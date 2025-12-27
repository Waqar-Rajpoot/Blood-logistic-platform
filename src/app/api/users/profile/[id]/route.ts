

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

// 1. Define the Context type for Next.js 15
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteContext // Use the async context type here
) {
  try {
    await connect();

    // 2. Await the params before accessing properties
    const { id } = await params;
    
    // id actually refers to email in your logic
    const email = decodeURIComponent(id); 
    
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}