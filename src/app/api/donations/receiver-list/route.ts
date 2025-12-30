import { connect } from "@/dbConfig/dbConfig";
import Donation from "@/models/donationModel";
// import User from "@/models/userModel"; // Ensure User model is registered
import { NextRequest, NextResponse } from "next/server";
import { getDatatFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
    try {
        await connect();
        const receiverId = await getDatatFromToken(req);

        const donations = await Donation.find({ receiverId })
            .populate("donorId", "username email") // Fetch username/email from User collection
            .sort({ donationDate: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            donations,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}