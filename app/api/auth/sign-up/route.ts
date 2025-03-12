import sendResponse from "@/lib";
import connectDb from "@/lib/db";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import { SignJWT } from "jose";
import User from "@/models/user.model";
import { NextRequest } from "next/server";
import { sendVerificationEmail } from "@/utils/email";

export const POST = async (request: NextRequest) => {
  await connectDb();
  try {
    const body = await request.json();
    const { name, email, password } = body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return sendResponse(400, {
        success: false,
        errorMessage: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = await new SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" }) // Set the algorithm (HS256 is a symmetric key)
      .setExpirationTime("1h") // Set the expiration time
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || "")); // Sign the JWT with the secret key

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    return sendResponse(201, {
      success: true,
      successMessage:
        "Signup successful! Check your email to verify your account",
    });
  } catch (error) {
    console.log(error);
    return sendResponse(500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};
