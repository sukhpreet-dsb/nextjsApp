import sendResponse from "@/lib";
import connectDb from "@/lib/db";
import RefreshToken from "@/models/refreshToken.model";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
// import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  await connectDb();
  try {
    const body = await request.json();
    const { email, password } = body;
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(400, {
        success: false,
        errorMessage: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return sendResponse(403, {
        success: false,
        errorMessage: "Please verify your email before signing in",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(400, {
        success: false,
        errorMessage: "Invalid email or password",
      });
    }
    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || "")); // Encode the secret key properly

    const refreshtoken = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || "")); // Encode the secret key properly

    await RefreshToken.create({ userId: user._id, refreshToken: refreshtoken });

    return sendResponse(200, {
      success: true,
      successMessage: "Sign in successfull",
      data: { token, user, refreshtoken },
    });
  } catch (error) {
    console.log(error);
    return sendResponse(500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};
