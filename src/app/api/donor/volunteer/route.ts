import { connect } from "@/dbConfig/dbConfig";
import { getDatatFromToken } from "@/helpers/getDataFromToken";
import Volunteer from "@/models/volunteerModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        await connect();
        const userId = await getDatatFromToken(req);
        const body = await req.json();
        const { hbLevel, preferredDate, donorNote } = body;

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Generate a simple unique token for the appointment
        const donationToken = `VOL-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        const newVolunteerOffer = new Volunteer({
            donorId: userId,
            bloodGroup: user.bloodGroup,
            hbLevel,
            preferredDate,
            donorNote,
            location: user.location,
            token: donationToken
        });

        await newVolunteerOffer.save();

        return NextResponse.json({
            success: true,
            message: "Donation offer submitted successfully",
            token: donationToken
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}