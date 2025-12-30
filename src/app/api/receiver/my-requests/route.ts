// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";
// import { NextResponse } from "next/server";
// import Request from "@/models/requestModel";
// import { connect } from "@/dbConfig/dbConfig";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     await connect();
//     const requests = await Request.find({ userId: session.user.id })
//       .populate("potentialDonors", "username phoneNumber bloodGroup")
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ requests });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }








import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import Request from "@/models/requestModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // 1. Fetch requests belonging to the logged-in user
    // 2. CRITICAL: Added 'location' to the populate string
    const requests = await Request.find({ userId: session.user.id })
      .populate({
        path: "potentialDonors",
        select: "username phoneNumber bloodGroup location",
      })
      .sort({ createdAt: -1 });

    // 3. Return the requests with full donor location data
    return NextResponse.json({ 
      success: true,
      requests 
    });
    
  } catch (error: any) {
    console.error("Fetch My Requests Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}