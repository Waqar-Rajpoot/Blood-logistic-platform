import { NextRequest, NextResponse } from "next/server";
import Request from "@/models/requestModel";
import { connect } from "@/dbConfig/dbConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    await connect();

    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get("bloodGroup");

    if (!bloodGroup) {
      return NextResponse.json(
        { error: "Blood group is required to find matching alerts." },
        { status: 400 }
      );
    }

    const validGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validGroups.includes(bloodGroup.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid blood group format provided." },
        { status: 400 }
      );
    }

    const requests = await Request.find({
      status: "Pending",
      bloodGroup: bloodGroup.toUpperCase(),
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    if (!requests || requests.length === 0) {
      return NextResponse.json(
        {
          requests: [],
          message: `No active requests found for ${bloodGroup}`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: requests.length,
        requests,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API_ALERTS_ERROR:", error);

    // Handle specific Mongoose errors if necessary
    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid data format requested." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
}
