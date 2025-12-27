import { NextRequest, NextResponse } from "next/server";
import Request from "@/models/requestModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDatatFromToken } from "@/helpers/getDataFromToken";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
    if ( !session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
        await connect();
        const userId = await getDatatFromToken(request);
        const history = await Request.find({
            status: "Fulfilled",
            potentialDonors: userId 
        })
        .sort({ createdAt: -1 })
        .lean();

        return NextResponse.json({
            success: true,
            history: history.map((item: any) => ({
                _id: item._id,
                date: item.createdAt,
                location: item.hospitalName,
                recipientName: item.patientName,
                status: item.status,
                units: item.unitsRequired,
                city: item.city
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}