// import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import bcrypt from "bcryptjs";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     await connect();

//     const reqBody = await request.json();
//     const {
//       username,
//       email,
//       password,
//       role,
//       bloodGroup,
//       phoneNumber,
//       city,
//       area,
//     } = reqBody;

//     // 2. Validation
//     if (!username || !email || !password || !phoneNumber || !city || !area) {
//       return NextResponse.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     if (password.length < 8) {
//       return NextResponse.json(
//         { error: "Password must be at least 8 characters long" },
//         { status: 400 }
//       );
//     }
    
//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }],
//     }).maxTimeMS(5000);

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User already exists", success: false },
//         { status: 400 }
//       );
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role,
//       bloodGroup: role === "donor" ? bloodGroup : undefined,
//       phoneNumber,
//       city,
//       area,
//     });

//     await newUser.save();

//     // 6. Send Verification Email
//     // Move this to the end to ensure the user is saved first
//     // try {
//     //   await sendEmail({
//     //     email,
//     //     emailType: "VERIFY",
//     //     userId: savedUser._id,
//     //   });
//     // } catch (emailError) {
//     //   console.warn("User saved but email failed:", emailError);
//     //   // Don't fail the whole request if only the email fails
//     // }

//     return NextResponse.json(
//       {
//         message: "User created successfully. Please verify your email.",
//         success: true,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Signup Route Error:", error);

//     if (error.message.includes("buffering timed out")) {
//       return NextResponse.json(
//         { error: "Database connection busy. Please try again." },
//         { status: 503 }
//       );
//     }
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }







// import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import bcrypt from "bcryptjs";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     await connect();

//     const reqBody = await request.json();
//     const {
//       username,
//       email,
//       password,
//       role,
//       bloodGroup,
//       phoneNumber,
//       city,
//       area,
//       latitude,
//       longitude,
//     } = reqBody;

//     // 1. Enhanced Validation
//     if (!username || !email || !password || !phoneNumber || !city) {
//       return NextResponse.json(
//         { error: "Required fields are missing" },
//         { status: 400 }
//       );
//     }

//     // Capture location check: Crucial for the Proximity Feature
//     if (latitude === undefined || longitude === undefined) {
//       return NextResponse.json(
//         { error: "Location data is required for proximity matching" },
//         { status: 400 }
//       );
//     }

//     // 2. Check if user already exists
//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }],
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User with this email or username already exists", success: false },
//         { status: 400 }
//       );
//     }

//     // 3. Hash Password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // 4. Create New User with GeoJSON Location
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role,
//       bloodGroup: role !== "admin" ? bloodGroup : undefined,
//       phoneNumber,
//       city,
//       area,
//       location: {
//         type: "Point",
//         coordinates: [Number(longitude), Number(latitude)],
//       },
//       isAvailable: role === "donor", 
//       isVerified: false, 
//     });

//     const savedUser = await newUser.save();

//     return NextResponse.json(
//       {
//         message: "User created successfully",
//         success: true,
//         user: {
//           id: savedUser._id,
//           username: savedUser.username,
//           role: savedUser.role
//         }
//       },
//       { status: 201 }
//     );

//   } catch (error: any) {
//     console.error("Signup Route Error:", error);
    
//     // Handle specific MongoDB errors (like index issues)
//     if (error.code === 11000) {
//       return NextResponse.json({ error: "Duplicate field detected" }, { status: 400 });
//     }

//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }






// import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import bcrypt from "bcryptjs";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     await connect();

//     const reqBody = await request.json();
//     const {
//       username,
//       email,
//       password,
//       role,
//       bloodGroup,
//       phoneNumber,
//       city,
//       area,
//       latitude,
//       longitude,
//     } = reqBody;

//     // 1. Basic Validation (Coordinates are no longer mandatory here)
//     if (!username || !email || !password || !phoneNumber || !city) {
//       return NextResponse.json(
//         { error: "Required fields (Username, Email, Password, Phone, City) are missing" },
//         { status: 400 }
//       );
//     }

//     // 2. Check if user already exists
//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }],
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User with this email or username already exists", success: false },
//         { status: 400 }
//       );
//     }

//     // 3. Hash Password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // 4. Create New User with GeoJSON Handling
//     // If lat/lng are missing from frontend, we use [0,0] to prevent schema errors
//     const coords = (latitude && longitude) 
//       ? [Number(longitude), Number(latitude)] 
//       : [0, 0];

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role,
//       bloodGroup: role === "donor" ? bloodGroup : undefined,
//       phoneNumber,
//       city,
//       area,
//       location: {
//         type: "Point",
//         coordinates: coords,
//       },
//       isAvailable: role === "donor", 
//       isVerified: false,
//     });

//     const savedUser = await newUser.save();

//     return NextResponse.json(
//       {
//         message: coords[0] === 0 
//           ? "User created (Manual Location Only)" 
//           : "User created with GPS Location",
//         success: true,
//         user: {
//           id: savedUser._id,
//           username: savedUser.username,
//         }
//       },
//       { status: 201 }
//     );

//   } catch (error: any) {
//     console.error("Signup Route Error:", error);
    
//     if (error.code === 11000) {
//       return NextResponse.json({ error: "Duplicate field detected (Email or Username)" }, { status: 400 });
//     }

//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }








import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const {
      username,
      email,
      password,
      role,
      bloodGroup,
      phoneNumber,
      city,
      area,
      latitude,
      longitude,
    } = reqBody;

    // 1. Strict Validation
    // We require basic info. Coordinates are optional but handled if provided.
    if (!username || !email || !password || !phoneNumber || !city || !area) {
      return NextResponse.json(
        { error: "Please fill in all required fields including City and Area." },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Robust GeoJSON Coordinate Handling
    // We check if latitude/longitude are valid numbers (even 0)
    const hasValidCoords = typeof latitude === 'number' && typeof longitude === 'number';
    
    // NOTE: GeoJSON requires [Longitude, Latitude] order
    const coords = hasValidCoords 
      ? [Number(longitude), Number(latitude)] 
      : [0, 0];

    // 5. Create New User
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      bloodGroup: role === "donor" ? bloodGroup : undefined,
      phoneNumber,
      city,
      area,
      location: {
        type: "Point",
        coordinates: coords,
      },
      isAvailable: role === "donor", // Default donors to available
      isVerified: false,
    });

    const savedUser = await newUser.save();

    // 6. Return response with contextual message
    return NextResponse.json(
      {
        message: hasValidCoords 
          ? "Account created with precise Map location!" 
          : "Account created (Generic Location)",
        success: true,
        user: {
          id: savedUser._id,
          username: savedUser.username,
          role: savedUser.role
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Signup Route Error:", error);

    // Handle MongoDB Duplicate Key Error (e.g., email already taken)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Username or Email is already registered." }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." }, 
      { status: 500 }
    );
  }
}
