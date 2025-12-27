import { NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET() {
    try {
        
        await connect();
        const donorCount = await User.countDocuments({ role: "donor" });
        return NextResponse.json({
            count: donorCount,
            success: true
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}