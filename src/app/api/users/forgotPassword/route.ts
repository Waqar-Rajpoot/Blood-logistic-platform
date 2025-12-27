import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    await connect();
    const reqBody = await req.json();
    const { email } = reqBody;
    console.log(email);

    if (!email) {
      return NextResponse.json({ error: "Email is required", status: 400 });
    }
    const user = await User.findOne({ email });
    console.log("email is: ", email);

    if (!user) {
      return NextResponse.json(
        {
          error: "User does not exist",
        },
        { status: 400 }
      );
    }
    await sendEmail({ email, emailType: "RESET", userId: user._id });

    return NextResponse.json({
      message: "Email sent successfully",
      success: true,
    });
  } catch (error: any) {
    console.log(
      "Login failed",
      error.response?.data?.error || "Something went wrong"
    );
    return NextResponse.json(
      {
        message: "Something went wrong",
        success: false,
      },
      { status: 500 }
    );
  }
}
