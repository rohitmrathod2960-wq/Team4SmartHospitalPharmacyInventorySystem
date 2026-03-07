import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    /* ============================= */
    /*       VALIDATE INPUT          */
    /* ============================= */

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    /* ============================= */
    /*      FETCH STORED OTP         */
    /* ============================= */

    const snapshot = await getDoc(doc(db, "otp", email));

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "OTP not found" },
        { status: 400 }
      );
    }

    const data = snapshot.data();

    /* ============================= */
    /*        CHECK EXPIRY           */
    /* ============================= */

    if (Date.now() > data.expiresAt) {
      await deleteDoc(doc(db, "otp", email)); // Clean expired OTP
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    /* ============================= */
    /*        CHECK MATCH            */
    /* ============================= */

    if (data.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    /* ============================= */
    /*     DELETE OTP AFTER USE      */
    /* ============================= */

    await deleteDoc(doc(db, "otp", email));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}