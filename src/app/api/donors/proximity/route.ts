import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

export async function GET(req: NextRequest) {
  try {
    await connect();

    // Get params from URL (e.g., /api/donors/proximity?lat=23.8&lng=90.3&bloodGroup=O+)
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const bloodGroup = searchParams.get("bloodGroup");

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    // Find verified donors within 10km (10,000 meters)
    const donors = await User.find({
      role: "donor",
      isVerified: true,
      isAvailable: true,
      ...(bloodGroup && { bloodGroup }), // Only filter by blood group if provided
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)], // MongoDB expects [Lng, Lat]
          },
          $maxDistance: 10000, // 10km radius
        },
      },
    });

    return NextResponse.json(donors, { status: 200 });
  } catch (error: any) {
    console.error("Proximity Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
