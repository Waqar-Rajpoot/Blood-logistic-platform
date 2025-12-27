import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    let updateFields = {};
    let route = "";

    if (emailType === process.env.USER_VERIFY) {
      updateFields = {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      };
      route = "verifyemail";
    } else if (emailType === process.env.PASSWORD_RESET) {
      updateFields = {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      };
      route = "resetPassword";
    }

    await User.findByIdAndUpdate(userId, updateFields);

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject:
        emailType === process.env.USER_VERIFY
          ? "Verify your email"
          : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN}/${route}?token=${hashedToken}">here</a> to ${
        emailType === process.env.USER_VERIFY
          ? "verify your email"
          : "reset your password"
      } 
        or copy and paste the link below in your browser: <br>
        ${process.env.DOMAIN}/${route}?token=${hashedToken}
        </p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    console.log("hello error: ",error.message);
    
    throw new Error(error.message);
  }
};





/*






*/
