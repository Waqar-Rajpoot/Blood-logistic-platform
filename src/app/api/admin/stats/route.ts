import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Request from "@/models/requestModel";
import Inventory from "@/models/inventoryModel";
import Donation from "@/models/donationModel"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const [users, requests, inventory, donations] = await Promise.all([
      User.find({}),
      Request.find({}),
      Inventory.find({ status: "available" }),
      Donation.find({}).sort({ createdAt: -1 }).limit(10),
    ]);

    const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const bloodGroupStats = groups.map((group) => ({
      group,
      units: inventory
        .filter((item) => item.bloodGroup === group)
        .reduce((acc, curr) => acc + curr.units, 0),
    }));

    const recentActivities = donations
      .map((d) => ({
        type: "Donation",
        status: d.status,
        bloodGroup: "N/A", 
        city: d.hospitalName.split(" ")[0],
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
      .slice(0, 8); 


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

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
