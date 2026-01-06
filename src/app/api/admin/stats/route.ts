import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Request from "@/models/requestModel";
import Inventory from "@/models/inventoryModel";
import Donation from "@/models/donationModel"; // Assuming this is your model for the donation journey
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    await connect();

    // 1. Try Cache First
    const cachedData = await redis.get("admin_dashboard_stats");
    if (cachedData) {
      console.log("🚀 Serving Dashboard from Cache");
      return NextResponse.json(
        typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData
      );
    }

    // 2. Parallel Data Fetching
    const [users, requests, inventory, donations] = await Promise.all([
      User.find({}),
      Request.find({}),
      Inventory.find({ status: "available" }),
      Donation.find({}).sort({ createdAt: -1 }).limit(10),
    ]);

    // 3. Process Blood Group Stats (Inventory Health)
    const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const bloodGroupStats = groups.map((group) => ({
      group,
      units: inventory
        .filter((item) => item.bloodGroup === group)
        .reduce((acc, curr) => acc + curr.units, 0),
    }));

    // 4. Map Recent Activity (Combined feed of Requests and Donations)
    const recentActivities = donations
      .map((d) => ({
        type: "Donation",
        status: d.status,
        bloodGroup: "N/A", // You can cross-reference if needed
        city: d.hospitalName.split(" ")[0], // Rough city extract or use hospitalName
        area: "Central Hub",
        timeAgo: "Recently",
        journeyStatus: d.journeyStatus,
        createdAt: d.donationDate,
      }))
      .concat(
        requests
          .slice(-5)
          .reverse()
          .map((r) => ({
            type: "Request",
            status: r.status,
            bloodGroup: r.bloodGroup,
            city: r.city,
            area: r.area,
            timeAgo: "Just now",
            journeyStatus: r.isUrgent ? "Critical" : "Standard",
            createdAt: r.createdAt,
          }))
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 8); // Keep top 8 combined activities

    // 5. Construct Final Object
    const stats = {
      totalUsers: users.length,
      donorsCount: users.filter((u) => u.role === "donor").length,
      receiversCount: users.filter((u) => u.role === "receiver").length,
      inventoryUnits: inventory.reduce((acc, curr) => acc + curr.units, 0),
      pendingRequests: requests.filter((r) => r.status === "Pending").length,
      successfulDonations: requests.filter((r) => r.status === "Fulfilled")
        .length,
      urgentRequests: requests.filter(
        (r) => r.isUrgent && r.status === "Pending"
      ).length,
      pendingVerifications: users.filter(
        (u) => u.role === "donor" && !u.isVerified
      ).length,
      bloodGroupStats,
      recentActivities,
    };

    // 6. Update Cache (Set for 5 minutes)
    await redis.set("admin_dashboard_stats", JSON.stringify(stats), {
      ex: 300,
    });

    console.log("📊 Serving Dashboard from MongoDB & Cache Updated");
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
