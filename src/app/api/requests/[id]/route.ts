import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import RequestModel from "@/models/requestModel"; // Renamed to avoid global conflict
import { connect } from "@/dbConfig/dbConfig";

// 1. Define the correct type for Next.js 15
type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function DELETE(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        await connect();
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const { id } = await params;
        const bloodRequest = await RequestModel.findById(id);

        if (!bloodRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (bloodRequest.userId.toString() !== session.user.id) {
            return NextResponse.json(
                { error: "You do not have permission to delete this request" },
                { status: 403 }
            );
        }

        // 4. Delete the request
        await RequestModel.findByIdAndDelete(id);

        return NextResponse.json({
            message: "Blood request deleted successfully",
            success: true
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}