import { connect } from "@/dbConfig/dbConfig";
import Volunteer from "@/models/volunteerModel";
import Inventory from "@/models/inventoryModel";
import Donation from "@/models/donationModel"; 
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        await connect();
        const { volunteerId, adminNote } = await req.json();

        // 1. Fetch Volunteer Record with Username
        const record = await Volunteer.findById(volunteerId).populate("donorId", "username");
        if (!record || record.status === "Completed") {
            return NextResponse.json({ error: "Invalid record" }, { status: 400 });
        }

        const donorUsername = record.donorId?.username || "Unknown Donor";

        // 2. Mark Volunteer Offer as Completed
        record.status = "Completed";
        record.adminNote = adminNote;
        await record.save();

        const newDonationHistory = new Donation({
            donorId: record.donorId._id,
            requestId: record._id,
            receiverId: record.donorId._id,
            unitsDonated: 1,
            hospitalName: "Central Blood Bank (Inventory)", 
            status: "Verified",
            journeyStatus: "Life Saved",
            journeyTimeline: [{
                stage: "Donated",
                note: "Voluntary donation added to inventory stock."
            }]
        });
        await newDonationHistory.save();

        // 4. Create Inventory Entry
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 42);

        const newStock = new Inventory({
            bloodGroup: record.bloodGroup,
            units: 1,
            source: `${donorUsername}`,
            expiryDate: expiryDate,
            status: "available"
        });
        await newStock.save();

        return NextResponse.json({
            success: true,
            message: "Donation recorded in history and inventory updated!"
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}