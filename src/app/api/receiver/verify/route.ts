import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Donation from "@/models/donationModel";
import Request from "@/models/requestModel";
import User from "@/models/userModel";


export async function POST(request: NextRequest) {
    try {
        await connect();
        const { requestId, donorId } = await request.json();

        const bloodRequest = await Request.findById(requestId);
        if (!bloodRequest) throw new Error("Request not found");

        // 2. Create official Donation Record
        const donationRecord = new Donation({
            donorId,
            requestId,
            receiverId: bloodRequest.userId, // The hospital/receiver who posted
            hospitalName: bloodRequest.hospitalName,
            status: "Verified",
            donationDate: new Date()
        });
        await donationRecord.save();

        // 3. Update the Request Status
        await Request.findByIdAndUpdate(requestId, { status: "Fulfilled" });

        // 4. Update the Donor's User Profile
        // Set availability to false and log the date
        await User.findByIdAndUpdate(donorId, {
            isAvailable: false,
            lastDonationDate: new Date()
        });

        return NextResponse.json({ 
            message: "Donation verified. Donor profile updated and request closed.",
            success: true 
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}