import sendResponse from "@/lib";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return sendResponse(400, {
        success: false,
        errorMessage: "Token and new password are required",
      });
    }

    let decoded;
    const secretKey = process.env.JWT_SECRET || "";
    try {
      decoded = await jwtVerify(token, new TextEncoder().encode(secretKey));
    } catch (error) {
      return sendResponse(400, {
        success: false,
        errorMessage: "Invalid or expired token",
      });
    }

    const user = await User.findOne({
      _id: decoded.payload.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return sendResponse(400, {
        success: false,
        errorMessage: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
    return sendResponse(200, {
      success: true,
      successMessage: "Password reset successfully!",
    });
  } catch (error) {
    return sendResponse(500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};
