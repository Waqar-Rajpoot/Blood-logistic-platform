import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connect();
        // Fetch all users except their passwords
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}