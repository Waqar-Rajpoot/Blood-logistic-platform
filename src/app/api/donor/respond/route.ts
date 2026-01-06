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

    const updatedRequest = await Request.findOneAndUpdate(
      { 
        _id: requestId, 
      },
      { 
        $addToSet: { respondedDonors: userId } 
      },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json({ error: "Blood request not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Your donation response has been recorded!",
      success: true,
    });

  } catch (error: any) {
    console.error("Respond Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}