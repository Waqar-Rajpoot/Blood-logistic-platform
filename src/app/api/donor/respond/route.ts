import { NextRequest, NextResponse } from "next/server";
import Request from "@/models/requestModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDatatFromToken } from "@/helpers/getDataFromToken";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await connect();
    const userId = await getDatatFromToken(request);
    const { requestId } = await request.json();

    const bloodRequest = await Request.findById(requestId);
    if (!bloodRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Prevent duplicate responses
    if (bloodRequest.potentialDonors.includes(userId)) {
      return NextResponse.json(
        { message: "Already responded" },
        { status: 400 }
      );
    }

    // Add donor to the potentialDonors array
    bloodRequest.potentialDonors.push(userId);
    await bloodRequest.save();

    return NextResponse.json({
      message: "Response sent to receiver successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
