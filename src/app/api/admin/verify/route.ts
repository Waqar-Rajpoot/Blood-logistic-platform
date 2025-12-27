import { connect } from "@/dbConfig/dbConfig";
import { authOptions } from "@/lib/auth";
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connect();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    const query: any = { isVerified: false };
    if (role) {
      query.role = role;
    }

    const unverifiedUsers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json(unverifiedUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await connect();
    const { userId, status } = await request.json();

    if (userId === session.user.id && status === false) {
        return NextResponse.json(
            { error: "You cannot un-verify your own admin account." },
            { status: 400 }
        );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isVerified: status },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: `${updatedUser.role} status updated successfully`,
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await connect();
    
    // We only allow deleting users who are NOT verified
    const userToDelete = await User.findOne({ _id: userId, isVerified: false });
    
    if (!userToDelete) {
      return NextResponse.json({ error: "User not found or already verified" }, { status: 404 });
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "Unverified account removed successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}