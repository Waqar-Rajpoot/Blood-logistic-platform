import { connect } from "@/dbConfig/dbConfig";
import { getDatatFromToken } from "@/helpers/getDataFromToken";
import Request from "@/models/requestModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connect();

        const userId = await getDatatFromToken(req);
        const donor = await User.findById(userId);

        if (!donor) {
            return NextResponse.json({ error: "Donor not found" }, { status: 404 });
        }

        // 1. Get Search Parameters from the URL
        const { searchParams } = new URL(req.url);
        const bloodGroup = searchParams.get("bloodGroup");
        
        // 2. Extract radius from searchParams, default to 20 if not provided
        // We multiply by 1000 because MongoDB $maxDistance uses meters
        const radiusInKm = parseInt(searchParams.get("radius") || "20");
        const maxDistanceInMeters = radiusInKm * 1000;

        if (!bloodGroup) {
            return NextResponse.json({ error: "Blood group is required" }, { status: 400 });
        }

        const query: any = {
            bloodGroup: bloodGroup,
            status: "Pending",
            userId: { $ne: userId }
        };

        // If donor has coordinates, filter by the dynamic radius
        if (donor.location?.coordinates && donor.location.coordinates[0] !== 0) {
            query.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: donor.location.coordinates // [lng, lat]
                    },
                    $maxDistance: maxDistanceInMeters 
                }
            };
        }

        const matchingRequests = await Request.find(query)
            .sort({ createdAt: -1 }) // Newest first
            .limit(10); 

        return NextResponse.json({
            success: true,
            requests: matchingRequests,
            count: matchingRequests.length,
            appliedRadius: radiusInKm // Returning this so frontend can confirm
        });

    } catch (error: any) {
        console.error("Matching Requests API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}