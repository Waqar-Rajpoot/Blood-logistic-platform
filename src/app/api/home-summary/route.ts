import { NextResponse } from "next/server";
import User from "@/models/userModel";
import Donation from "@/models/donationModel";
import Request from "@/models/requestModel";
import Inventory from "@/models/inventoryModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET() {
  await connect();
  try {
    const [stats, urgentRequests, recentDonations, inventory] = await Promise.all([
      // 1. Impact Stats Calculation
      (async () => {
        const livesSaved = await Donation.countDocuments({ journeyStatus: "Life Saved" });
        const verifiedDonors = await User.countDocuments({ role: "donor", isVerified: true });
        const successfulMatches = await Request.countDocuments({ status: "Fulfilled" });
        const activeUnits = await Inventory.aggregate([
          { $match: { status: "available" } },
          { $group: { _id: null, total: { $sum: "$units" } } }
        ]);
        return { 
          livesSaved, 
          verifiedDonors, 
          successfulMatches, 
          activeUnits: activeUnits[0]?.total || 0 
        };
      })(),

      // 2. Urgent Requests for the Map
      Request.find({ isUrgent: true, status: "Pending" })
        .select("location bloodGroup hospitalName patientName")
        .limit(15),

      // 3. Community Wall (Recent Verified Donations)
      Donation.find({ status: "Verified" })
        .sort({ donationDate: -1 })
        .limit(4)
        .populate("donorId", "username area"),

      // 4. Inventory Grid
      Inventory.find({ status: "available" }).sort({ createdAt: -1 }).limit(6)
    ]);

    return NextResponse.json({ stats, urgentRequests, recentDonations, inventory });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}