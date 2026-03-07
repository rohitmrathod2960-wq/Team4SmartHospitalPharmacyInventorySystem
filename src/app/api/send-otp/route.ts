import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in Firestore with expiry (5 minutes)
    await setDoc(doc(db, "otp", email), {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Smart Defence System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Your OTP Code</h2>
        <h1>${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("OTP ERROR:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}