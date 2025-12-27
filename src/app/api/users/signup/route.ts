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
    } = reqBody;

    // 2. Validation
    if (!username || !email || !password || !phoneNumber || !city || !area) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }
    
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).maxTimeMS(5000);

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      bloodGroup: role === "donor" ? bloodGroup : undefined,
      phoneNumber,
      city,
      area,
    });

    await newUser.save();

    // 6. Send Verification Email
    // Move this to the end to ensure the user is saved first
    // try {
    //   await sendEmail({
    //     email,
    //     emailType: "VERIFY",
    //     userId: savedUser._id,
    //   });
    // } catch (emailError) {
    //   console.warn("User saved but email failed:", emailError);
    //   // Don't fail the whole request if only the email fails
    // }

    return NextResponse.json(
      {
        message: "User created successfully. Please verify your email.",
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Route Error:", error);

    if (error.message.includes("buffering timed out")) {
      return NextResponse.json(
        { error: "Database connection busy. Please try again." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
