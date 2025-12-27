import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import Request from "@/models/requestModel";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(request: NextRequest) {
  try {
    // 1. Get the current logged-in user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await connect();

    const reqBody = await request.json();
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      city,
      area,
      contactNumber,
      isUrgent,
    } = reqBody;

    // 2. Simple Validation
    if (!patientName || !bloodGroup || !unitsRequired || !hospitalName) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    // 3. Create the Request in Database
    const newRequest = new Request({
      userId: session.user.id, // The ID of the Receiver/Hospital
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      city,
      area,
      contactNumber,
      isUrgent,
      status: "Pending",
      potentialDonors: [], // Starts empty
    });

    const savedRequest = await newRequest.save();

    console.log("New blood request created: ", savedRequest);

    return NextResponse.json({
      message: "Blood request created successfully",
      success: true,
      request: savedRequest,
    });
  } catch (error: any) {
    console.error("Request Creation Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
