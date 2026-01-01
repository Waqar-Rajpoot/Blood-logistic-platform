import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { getDatatFromToken } from "@/helpers/getDataFromToken";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Donation from "@/models/donationModel";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connect();
    const userId = await getDatatFromToken(request);

    const history = await Donation.find({ donorId: userId })
      .populate("requestId", "patientName city")
      .sort({ donationDate: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      history: history.map((item: any) => {
        const isVoluntary = item.hospitalName.includes("Inventory");

        return {
          _id: item._id,
          date: item.donationDate,
          location: item.hospitalName,
          recipientName: isVoluntary
            ? "Voluntary Donation"
            : item.requestId?.patientName || "Direct Donation",
          city: item.requestId?.city || "N/A",
          status: item.status,
          units: item.unitsDonated,
          journeyStatus: item.journeyStatus,
        };
      }),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
