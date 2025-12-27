import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Donation from "@/models/donationModel";
import Request from "@/models/requestModel"; // Your blood request model
import User from "@/models/userModel";

export async function POST(req: Request) {
    try {
        await connect();
        const { requestId, donorId, units } = await req.json();

        // 1. Create the official Donation Record
        const newRecord = new Donation({
            donorId,
            requestId,
            units,
            date: new Date(),
            status: "Verified by Hospital"
        });
        await newRecord.save();

        // 2. Mark the Request as Fulfilled
        await Request.findByIdAndUpdate(requestId, { status: "Fulfilled" });

        // 3. Set Donor to Unavailable (8-week recovery period starts)
        await User.findByIdAndUpdate(donorId, { isAvailable: false });

        return NextResponse.json({ message: "Donation verified successfully!" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}