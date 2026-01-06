import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import Request from "@/models/requestModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // Fetch requests belonging to the logged-in user
    const requests = await Request.find({ userId: session.user.id })
      .populate({
        path: "potentialDonors",
        select: "username phoneNumber bloodGroup location",
      })
      .populate({
        // THIS IS THE KEY ADDITION:
        // We must populate the donors who actually responded
        path: "respondedDonors",
        select: "username phoneNumber bloodGroup location",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true,
      requests 
    });
    
  } catch (error: any) {
    console.error("Fetch My Requests Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}