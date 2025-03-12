import sendResponse from "@/lib";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  await connectDb();

  try {

    const userId = request.headers.get("userId")

    const userInfo = await User.findById({ _id: userId });

    if (!userInfo) {
      return sendResponse(400, {
        success: false,
        errorMessage: "You are not Authorized",
      });
    }
    return sendResponse(200, { success: true, data: userInfo });
  } catch (error) {
    return sendResponse(500, {
      success: false,
      errorMessage: "Internal server error",
    });
  }
};
