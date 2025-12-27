import { connect } from "@/dbConfig/dbConfig";
import { authOptions } from "@/lib/auth";
import RequestModel from "@/models/requestModel";
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Define the context type for Next.js 15
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    await connect();

    // In Next.js 15, params MUST be awaited
    const { id } = await params;

    const bloodRequest = await RequestModel.findById(id);

    if (!bloodRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Fetch the user who created this request
    const creator = await User.findById(bloodRequest.userId).select(
      "username email phone"
    );

    return NextResponse.json({
      success: true,
      data: bloodRequest,
      creator,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE route to allow admin to remove requests
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      !session.user ||
      !session.user.role ||
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }
    await connect();

    // In Next.js 15, params MUST be awaited
    const { id } = await params;

    const deletedRequest = await RequestModel.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json(
        { error: "Request already deleted or not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
