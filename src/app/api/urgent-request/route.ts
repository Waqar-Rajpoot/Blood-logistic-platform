// import { connect } from "@/dbConfig/dbConfig";
// // import User from "@/models/userModel";
// import Request from "@/models/requestModel";
// import { NextRequest, NextResponse } from "next/server";
// import { getDatatFromToken } from "@/helpers/getDataFromToken";
// // import { getDataFromToken } from "@/helpers/getDataFromToken"; // Ensure you have this helper

// export async function POST(req: NextRequest) {
//   try {
//     await connect();
    
//     // 1. Get the logged-in User's ID from the token
//     const userId = await getDatatFromToken(req); 
//     if (!userId) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const reqBody = await req.json();
//     const { 
//       patientName,
//       bloodGroup, 
//       unitsRequired,
//       hospitalName, 
//       contactNumber, 
//       city,
//       area,
//       latitude,
//       longitude,
//       isUrgent
//     } = reqBody;

//     // 2. Create the Request with exact Model matches
//     const newRequest = await Request.create({
//       userId, // Now provided
//       patientName,
//       bloodGroup,
//       unitsRequired,
//       hospitalName,
//       contactNumber,
//       city,
//       area,
//       location: {
//         type: "Point",
//         coordinates: [Number(longitude), Number(latitude)]
//       },
//       isUrgent: isUrgent || false,
//       status: "Pending" // Match the Capital "P" in your enum
//     });

//     // ... (rest of your nearby donors logic)

//     return NextResponse.json({ 
//       success: true, 
//       donorsFound: 0, // Update with your logic
//       requestId: newRequest._id 
//     });

//   } catch (error: any) {
//     console.error("Route Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }








import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel"; // Uncommented this
import Request from "@/models/requestModel";
import { NextRequest, NextResponse } from "next/server";
import { getDatatFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: NextRequest) {
  try {
    await connect();
    
    // 1. Get the logged-in User's ID from the token
    const userId = await getDatatFromToken(req); 
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reqBody = await req.json();
    const { 
      patientName,
      bloodGroup, 
      unitsRequired,
      hospitalName, 
      contactNumber, 
      city,
      area,
      latitude,
      longitude,
      isUrgent
    } = reqBody;

    // 2. Create the Request
    const newRequest = await Request.create({
      userId,
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      contactNumber,
      city,
      area,
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)]
      },
      isUrgent: isUrgent || false,
      status: "Pending" 
    });

    // 3. SMART MATCH LOGIC: Find matching donors within 10km
    const nearbyDonors = await User.find({
      role: "donor",
      bloodGroup: bloodGroup,
      isAvailable: true,
      _id: { $ne: userId }, // Don't notify the person making the request
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: 10000, // 10,000 meters = 10km
        },
      },
    });

    // 4. REAL-TIME NOTIFICATION via Socket.io
    const io = (global as any).io; // Access global instance from pages/api/socket.ts
    
    if (io && nearbyDonors.length > 0) {
      nearbyDonors.forEach((donor) => {
        // Send alert to the donor's specific room (their ID)
        io.to(donor._id.toString()).emit("URGENT_MATCH", {
          requestId: newRequest._id,
          hospital: hospitalName,
          bloodGroup: bloodGroup,
          patientName: patientName,
          isUrgent: newRequest.isUrgent
        });
      });
      console.log(`✅ Smart Match: ${nearbyDonors.length} donors notified.`);
    }

    return NextResponse.json({ 
      success: true, 
      donorsFound: nearbyDonors.length,
      requestId: newRequest._id 
    });

  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}