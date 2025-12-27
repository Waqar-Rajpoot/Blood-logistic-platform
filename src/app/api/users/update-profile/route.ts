import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const reqBody = await request.json();
    const { phoneNumber, city, area, isAvailable } = reqBody;

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          phoneNumber,
          city,
          area,
          isAvailable,
        },
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "Profile updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
