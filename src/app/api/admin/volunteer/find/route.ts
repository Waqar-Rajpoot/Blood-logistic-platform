import { connect } from "@/dbConfig/dbConfig";
import Volunteer from "@/models/volunteerModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connect();
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        const record = await Volunteer.findOne({ 
            token: token, 
            status: { $ne: "Completed" } 
        }).populate("donorId", "username email");

        if (!record) {
            return NextResponse.json({ error: "Invalid or already processed token" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: record });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}