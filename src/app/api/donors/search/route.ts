// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/userModel";
// import { connect } from "@/dbConfig/dbConfig";


// export async function GET(request: NextRequest) {
//     try {
//         await connect();
//         const { searchParams } = new URL(request.url);
//         const bloodGroup = searchParams.get("bloodGroup");
//         const area = searchParams.get("area");

//         // Base query: only find users registered as donors
//         const query: any = { role: "donor" };

//         if (bloodGroup && bloodGroup !== "Blood Group (Any)") {
//             query.bloodGroup = bloodGroup;
//         }

//         if (area) {
//             // Case-insensitive search for area or city
//             query.$or = [
//                 { area: { $regex: area, $options: "i" } },
//                 { city: { $regex: area, $options: "i" } }
//             ];
//         }

//         // Exclude sensitive info like passwords
//         const donors = await User.find(query)
//             .select("username bloodGroup city area phoneNumber lastDonationDate")
//             .sort({ createdAt: -1 });

//         return NextResponse.json({ donors });
//     } catch (error: any) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }








import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET(request: NextRequest) {
    try {
        await connect();
        const { searchParams } = new URL(request.url);
        
        const bloodGroup = searchParams.get("bloodGroup");
        const city = searchParams.get("city");

        // Use $and to strictly enforce the donor role and verification
        const query: any = {
            $and: [
                { role: "donor" },
                { isVerified: true }
            ]
        };

        // Add Blood Group filter to the $and array if it exists
        if (bloodGroup && bloodGroup !== "" && bloodGroup !== "Any Group" && bloodGroup !== "undefined") {
            query.$and.push({ bloodGroup: bloodGroup });
        }

        // Add City/Area filter to the $and array
        if (city && city.trim() !== "" && city !== "undefined") {
            query.$and.push({
                $or: [
                    { city: { $regex: city, $options: "i" } },
                    { area: { $regex: city, $options: "i" } }
                ]
            });
        }

        const donors = await User.find(query)
            .select("username bloodGroup city area phoneNumber lastDonationDate location isAvailable points")
            .sort({ isAvailable: -1, createdAt: -1 })
            .lean();

        return NextResponse.json({ 
            success: true,
            count: donors.length,
            donors 
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message }, 
            { status: 500 }
        );
    }
}