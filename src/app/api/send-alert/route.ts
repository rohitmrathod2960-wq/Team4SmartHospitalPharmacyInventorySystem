import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { medicineName, quantity, supplier } = await req.json();

    if (!medicineName || !quantity || !supplier) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Inventra Alerts" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Low Stock Alert",
      html: `
        <h2>Low Stock Alert</h2>
        <p><strong>Product:</strong> ${medicineName}</p>
        <p><strong>Available Quantity:</strong> ${quantity}</p>
        <p><strong>Supplier:</strong> ${supplier}</p>
      `,
    });

    return NextResponse.json({ message: "Email sent successfully" });

  } catch (error: any) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}