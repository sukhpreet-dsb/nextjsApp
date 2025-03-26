import sendResponse from "@/lib";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { sendResetEmail } from "@/utils/email";
import { SignJWT } from "jose";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  await connectDb();
  try {
    const body = await request.json();
    const { email } = body;
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(404, {
        success: false,
        errorMessage: "User not found",
      });
    }

    const resetToken = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("4m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || "")); // Encode the secret key properly

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await sendResetEmail(user.email, resetLink);

    return sendResponse(200, {
      success: true,
      successMessage: "Password reset link sent to your email",
    });
  } catch (error) {
    return sendResponse(500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};
