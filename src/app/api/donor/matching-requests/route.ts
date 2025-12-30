// import { NextRequest, NextResponse } from "next/server";
// import Request from "@/models/requestModel";
// import { connect } from "@/dbConfig/dbConfig";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 403 }
//       );
//     }
//     await connect();

//     const { searchParams } = new URL(request.url);
//     const bloodGroup = searchParams.get("bloodGroup");

//     if (!bloodGroup) {
//       return NextResponse.json(
//         { error: "Blood group is required to find matching alerts." },
//         { status: 400 }
//       );
//     }

//     const validGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
//     if (!validGroups.includes(bloodGroup.toUpperCase())) {
//       return NextResponse.json(
//         { error: "Invalid blood group format provided." },
//         { status: 400 }
//       );
//     }

//     const requests = await Request.find({
//       status: "Pending",
//       bloodGroup: bloodGroup.toUpperCase(),
//     })
//       .select("-__v")
//       .sort({ createdAt: -1 })
//       .lean();

//     if (!requests || requests.length === 0) {
//       return NextResponse.json(
//         {
//           requests: [],
//           message: `No active requests found for ${bloodGroup}`,
//         },
//         { status: 200 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         count: requests.length,
//         requests,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("API_ALERTS_ERROR:", error);

//     // Handle specific Mongoose errors if necessary
//     if (error.name === "CastError") {
//       return NextResponse.json(
//         { error: "Invalid data format requested." },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Internal Server Error. Please try again later." },
//       { status: 500 }
//     );
//   }
// }








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

        // 2. Get Search Parameters from the URL
        const { searchParams } = new URL(req.url);
        const bloodGroup = searchParams.get("bloodGroup");

        if (!bloodGroup) {
            return NextResponse.json({ error: "Blood group is required" }, { status: 400 });
        }

        // 3. Perform Geospatial Query
        // We find requests matching the blood group AND within 20km of donor's coordinates
        const query: any = {
            bloodGroup: bloodGroup,
            status: "Pending",
            userId: { $ne: userId } // Don't show the donor's own requests if they are also a receiver
        };

        // If donor has coordinates, filter by 20km radius
        if (donor.location?.coordinates && donor.location.coordinates[0] !== 0) {
            query.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: donor.location.coordinates // [lng, lat]
                    },
                    $maxDistance: 20000 // 20,000 meters = 20km
                }
            };
        }

        const matchingRequests = await Request.find(query)
            .sort({ createdAt: -1 }) // Newest first
            .limit(10); // Don't overload the alert page

        return NextResponse.json({
            success: true,
            requests: matchingRequests,
            count: matchingRequests.length
        });

    } catch (error: any) {
        console.error("Matching Requests API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}