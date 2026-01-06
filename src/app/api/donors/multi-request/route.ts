import { connect } from "@/dbConfig/dbConfig";
import Request from "@/models/requestModel";
import { NextRequest, NextResponse } from "next/server";
import { getDatatFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const senderId = await getDatatFromToken(req);
    const body = await req.json();

    const {
      donorIds,
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      location,
      city,
      area,
      contactNumber,
    } = body;

    // 1. Create one Request record for all targeted donors
    const newRequest = await Request.create({
      userId: senderId,
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      location,
      city,
      area,
      contactNumber,
      potentialDonors: donorIds,
      status: "Pending",
      isUrgent: true,
    });

    // 2. TARGETED SOCKET EMIT
    const io = (global as any).io;
    if (io && donorIds.length > 0) {
      donorIds.forEach((id: string) => {
        // We now include the city and contact in the socket broadcast
        // so the donor sees where the patient is immediately
        io.to(id).emit("URGENT_MATCH", {
          requestId: newRequest._id,
          patientName,
          hospitalName,
          bloodGroup,
          city,
          area,
          contactNumber,
          type: "DIRECT_SELECTION",
        });
      });
    }

    return NextResponse.json({
      success: true,
      message: `Alert successfully sent to ${donorIds.length} donors in ${city}.`,
    });
  } catch (error: any) {
    console.error("Multi-request Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
