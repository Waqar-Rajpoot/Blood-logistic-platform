import { connect } from "@/dbConfig/dbConfig";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import User from "@/models/userModel";
import { userRegisterSchema } from "@/schema/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();

    const result = userRegisterSchema.safeParse(reqBody);

    if (!result.success) {
    return Response.json({ error: result.error.format() }, { status: 400 });
  }

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

    // 2. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 5 * 60000);


    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
      verifyCode,
      verifyCodeExpire: expiryDate,
      location: {
        type: "Point",
        coordinates: coords,
      },
      isAvailable: role === "donor",
      isVerified: false,
    });

    const savedUser = await newUser.save();

    const emailType = "VERIFY";

    const emailResponse = await sendVerificationEmail(
      email,
      emailType,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

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
          role: savedUser.role,
          emailType,
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Signup Route Error:", error);

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
