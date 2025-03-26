import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import sendResponse from "./lib";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/sign-in", "/sign-up"];

export default async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  const isAuthenticated = !!token;

  if (protectedRoutes.includes(path) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isAuthenticated && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAuthenticated && token) {
    if (!token) {
      return sendResponse(401, {
        success: false,
        errorMessage: "UnAuthorized",
      });
    }

    try {
      const secretKey = process.env.JWT_SECRET || "";
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secretKey)
      );

      const response = NextResponse.next();
      response.headers.set("userId", (payload as { userId: string }).userId);

      return response;
    } catch (error) {
      const response = NextResponse.next();
      console.error("JWT Verification Error:", error);
      response.cookies.delete("token");
      return response
      // return NextResponse.redirect(new URL("/sign-in", req.url));
      // return sendResponse(401, {
      //   success: false,
      //   errorMessage: "Unauthorized: Invalid or expired token",
      // });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(api/health)", "/dashboard", "/sign-in", "/sign-up"],
};
