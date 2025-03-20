import sendResponse from "@/lib";
import connectDb from "@/lib/db";
import RefreshToken from "@/models/refreshToken.model";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
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

    let refreshTokenDoc = await RefreshToken.findOne({ userId: user._id });
    let refreshToken;

    if (refreshTokenDoc) {
      try {
        await jwtVerify(
          refreshTokenDoc.refreshToken,
          new TextEncoder().encode(process.env.JWT_SECRET || "")
        );
        refreshToken = refreshTokenDoc.refreshToken;
      } catch (error) {
        // Token is expired or invalid, generate a new one
        refreshToken = await new SignJWT({ userId: user._id })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("7d")
          .sign(new TextEncoder().encode(process.env.JWT_SECRET || ""));
        refreshTokenDoc.refreshToken = refreshToken;
        await refreshTokenDoc.save();
      }
    } else {
      refreshToken = await new SignJWT({ userId: user._id })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET || ""));
      await RefreshToken.create({ userId: user._id, refreshToken });
    }

    const response = sendResponse(200, {
      success: true,
      successMessage: "Sign in successfull",
      data: { token, user, refreshToken },
    });

    response.cookies.set("refreshtoken", refreshToken, {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === "production", // Set to true in production
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/", // Set the cookie path
    });

    return response;
  } catch (error) {
    console.log(error);
    return sendResponse(500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};
