import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import BloodRequest from '@/models/requestModel';
import User from '@/models/userModel';

export async function GET() {
  await connect();

  try {
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    // 1. Basic Stats
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalReceivers = await User.countDocuments({ role: 'receiver' });
    const pendingRequests = await BloodRequest.countDocuments({ status: 'Pending' });
    const completedRequests = await BloodRequest.countDocuments({ status: 'Fulfilled' });

    // 2. Inventory (Available Donors per Blood Group)
    const donorStats = await User.aggregate([
      { $match: { role: 'donor' } },
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } }
    ]);

    // 3. Demand (Total Requests per Blood Group)
    const requestStats = await BloodRequest.aggregate([
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } }
    ]);

    // Format data to ensure all groups exist for the charts
    const inventoryMap = Object.fromEntries(donorStats.map(d => [d._id, d.count]));
    const requestMap = Object.fromEntries(requestStats.map(r => [r._id, r.count]));

    const formattedInventory = bloodGroups.map(bg => ({
      _id: bg,
      totalUnits: inventoryMap[bg] || 0
    }));

    const formattedRequests = bloodGroups.map(bg => ({
      _id: bg,
      totalUnits: requestMap[bg] || 0
    }));

    // Calculate fulfillment rate
    const totalReq = await BloodRequest.countDocuments();
    const fulfillmentRate = totalReq > 0 ? `${Math.round((completedRequests / totalReq) * 100)}%` : "0%";

    return NextResponse.json({
      stats: { totalDonors, totalReceivers, pendingRequests, fulfillmentRate },
      inventory: formattedInventory,
      requests: formattedRequests,
      trends: { // Placeholder for time-based trends
        donations: [{ _id: 'Mon', count: 5 }, { _id: 'Tue', count: 8 }], 
        requests: [{ _id: 'Mon', count: 3 }, { _id: 'Tue', count: 12 }]
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch data", message: error.message }, { status: 500 });
  }
}