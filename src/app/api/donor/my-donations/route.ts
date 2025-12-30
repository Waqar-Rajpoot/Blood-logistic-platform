import { connect } from "@/dbConfig/dbConfig";
import Donation from "@/models/donationModel";
import { NextRequest, NextResponse } from "next/server";
import { getDatatFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
    try {
        await connect();
        const donorId = await getDatatFromToken(req);

        // Find the most recent donation made by this donor
        const donation = await Donation.findOne({ donorId })
            .sort({ donationDate: -1 });

        return NextResponse.json({ success: true, donation });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}