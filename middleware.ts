import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import sendResponse from "./lib";

export const middleware = async (request: NextRequest) => {
  const token = request.headers.get("Authorization");
  if (!token) {
    return sendResponse(401, {
      success: false,
      errorMessage: "UnAuthorized",
    });
  }

  try {
    const actualToken = token.replace("Bearer ", "");
    const secretKey = process.env.JWT_SECRET || "";
    const { payload } = await jwtVerify(
      actualToken,
      new TextEncoder().encode(secretKey)
    );
    console.log("Token verified", payload.userId);

    const response = NextResponse.next();

    response.headers.set("userId", (payload as { userId: string }).userId);
    return response;
  } catch (error) {
    return sendResponse(401, {
      success: false,
      errorMessage: "Unauthorized: Invalid or expired token",
    });
  }
};

export const config = {
  matcher: ["/(api/health)"],
};

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };
