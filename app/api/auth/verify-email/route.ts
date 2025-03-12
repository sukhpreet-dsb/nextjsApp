import sendResponse from "@/lib";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  await connectDb();
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("token");
    const user = await User.findOne({ verificationToken: query });

    if (!user) {
      return sendResponse(400, {
        success: false,
        errorMessage: "Invalid or expired token",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    sendResponse(200, {
      success: true,
      successMessage: "Email verified successfully!",
    });
  } catch (error) {
    return sendResponse(500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};
