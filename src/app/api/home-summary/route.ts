import { NextResponse } from "next/server";
import User from "@/models/userModel";
import Donation from "@/models/donationModel";
import Request from "@/models/requestModel";
import Inventory from "@/models/inventoryModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET() {
  await connect();
  try {
    const [stats, urgentRequests, recentDonations, inventory, topDonors] = await Promise.all([
      // 1. Impact Stats Calculation
      (async () => {
        const livesSaved = await Donation.countDocuments({ journeyStatus: "Life Saved" });
        const verifiedDonors = await User.countDocuments({ role: "donor", isVerified: true });
        const successfulMatches = await Request.countDocuments({ status: "Fulfilled" });
        
        // FIX: Use Regex for case-insensitive matching (Available vs available)
        const activeUnits = await Inventory.aggregate([
          { $match: { status: { $regex: /^available$/i } } }, 
          { $group: { _id: null, total: { $sum: "$units" } } }
        ]);
        
        return { 
          livesSaved, 
          verifiedDonors, 
          successfulMatches, 
          activeUnits: activeUnits[0]?.total || 0 
        };
      })(),

      // 2. Urgent Requests
      Request.find({ isUrgent: true, status: "Pending" })
        .select("location bloodGroup hospitalName patientName")
        .limit(15),

      Donation.find({ status: { $in: ["Verified", "Completed", "Donated"] } })
        .sort({ donationDate: -1 })
        .limit(8)
        .populate("donorId", "username area points bloodGroup"),

      Inventory.find({ status: { $regex: /^available$/i } })
        .sort({ createdAt: -1 })
        .limit(6),

      // 5. Elite Donors
      User.find({ role: "donor", isVerified: true })
        .sort({ points: -1 })
        .select("username points bloodGroup area city")
        .limit(6)
    ]);

    console.log("Inventory: ",inventory)

    return NextResponse.json({ 
      stats, 
      urgentRequests, 
      recentDonations, 
      inventory, 
      topDonors
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}