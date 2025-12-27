import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import User from "@/models/userModel";
import Request from "@/models/requestModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET() {
    try {
        await connect();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email }).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const donationHistory = await Request.find({
            status: "Fulfilled",
            potentialDonors: user._id
        }).sort({ createdAt: -1 });

        const totalDonations = donationHistory.length;
        const lastDonationDate = totalDonations > 0 ? donationHistory[0].createdAt : null;

        const donorData = {
            ...user.toObject(),
            totalDonations: totalDonations,
            lastDonationDate: lastDonationDate,
            livesSaved: totalDonations * 3,
        };

        return NextResponse.json({
            message: "User data with impact stats retrieved",
            data: donorData
        });

    } catch (error: any) {
        console.error("Error in /api/users/me:", error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}