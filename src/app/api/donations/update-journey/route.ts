import { connect } from "@/dbConfig/dbConfig";
import Donation from "@/models/donationModel";
import { NextRequest, NextResponse } from "next/server";
import { getDatatFromToken } from "@/helpers/getDataFromToken";

export async function PATCH(req: NextRequest) {
  try {
    await connect();
    const receiverId = await getDatatFromToken(req);
    const { donationId, newStatus } = await req.json();

    // Security: Ensure this donation belongs to the logged-in receiver
    const donation = await Donation.findOne({ _id: donationId, receiverId });

    if (!donation) {
      return NextResponse.json(
        { error: "Donation record not found" },
        { status: 404 }
      );
    }

    donation.journeyStatus = newStatus;
    await donation.save();

    return NextResponse.json({
      success: true,
      message: `Status updated to ${newStatus}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
