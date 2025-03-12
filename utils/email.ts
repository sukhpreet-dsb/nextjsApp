import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<h2>Welcome! Click the link below to verify your email:</h2>
             <a href="${verificationLink}" target="_blank">${verificationLink}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
