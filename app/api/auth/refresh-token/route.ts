import sendResponse from "@/lib";
import RefreshToken from "@/models/refreshToken.model";
import cookie from "cookie";
import { jwtVerify, SignJWT } from "jose";
import { NextRequest } from "next/server";
export const POST = async (request: NextRequest) => {
  try {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    console.log(cookies.refreshtoken, "cookies");
    if (!cookies.refreshtoken) {
      return sendResponse(401, {
        success: false,
        errorMessage: "Refresh Token is required",
      });
    }

    let decoded;
    const secretKey = process.env.JWT_SECRET || "";

    try {
      decoded = await jwtVerify(
        cookies.refreshtoken,
        new TextEncoder().encode(secretKey)
      );
    } catch (error) {
      return sendResponse(403, {
        success: false,
        errorMessage: "Invalid or expired Refresh Token",
      });
    }

    const storedToken = await RefreshToken.findOne({
      userId: decoded.payload.userId,
      refreshToken: cookies.refreshtoken,
    });

    if (!storedToken) {
      return sendResponse(403, {
        success: false,
        errorMessage: "Invalid Refresh Token",
      });
    }

    const newAccessToken = await new SignJWT({ userId: decoded.payload.userId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || "")); // Encode the secret key properly

    return sendResponse(200, {
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    return sendResponse(500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};
