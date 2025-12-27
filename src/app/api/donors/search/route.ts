import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";


export async function GET(request: NextRequest) {
    try {
        await connect();
        const { searchParams } = new URL(request.url);
        const bloodGroup = searchParams.get("bloodGroup");
        const area = searchParams.get("area");

        // Base query: only find users registered as donors
        const query: any = { role: "donor" };

        if (bloodGroup && bloodGroup !== "Blood Group (Any)") {
            query.bloodGroup = bloodGroup;
        }

        if (area) {
            // Case-insensitive search for area or city
            query.$or = [
                { area: { $regex: area, $options: "i" } },
                { city: { $regex: area, $options: "i" } }
            ];
        }

        // Exclude sensitive info like passwords
        const donors = await User.find(query)
            .select("username bloodGroup city area phoneNumber lastDonationDate")
            .sort({ createdAt: -1 });

        return NextResponse.json({ donors });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}