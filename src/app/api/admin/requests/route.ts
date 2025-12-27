import { connect } from "@/dbConfig/dbConfig";
import Request from "@/models/requestModel";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connect();
        const requests = await Request.find({}).sort({ createdAt: -1 });

        // Calculate summary for the top cards
        const stats = {
            total: requests.length,
            pending: requests.filter(r => r.status === "Pending").length,
            fulfilled: requests.filter(r => r.status === "Fulfilled").length,
            urgent: requests.filter(r => r.isUrgent && r.status === "Pending").length
        };

        return NextResponse.json({ success: true, requests, stats });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}