import { NextResponse } from "next/server";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import crypto from "crypto";

const CHAPA_API_KEY = process.env.CHAPA_API_KEY;
const CHAPA_SECRET = process.env.CHAPA_SECRET;

if (!CHAPA_API_KEY || !CHAPA_SECRET) {
  throw new Error("CHAPA_API_KEY or CHAPA_SECRET is not defined");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Raw Webhook Body:", body);

    // Retrieve the signature from the headers
    const signature = req.headers.get('x-chapa-signature');
    if (!signature) {
      console.error("No Chapa-Signature header found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Compute the hash using HMAC SHA256 and your secret key
    const hash = crypto
      .createHmac('sha256', CHAPA_SECRET as string)
      .update(JSON.stringify(body)) // Serialize the body to a string
      .digest('hex');

    console.log("Computed Hash:", hash);
    console.log("Received Signature:", signature);

    // Verify the signature
    if (hash !== signature) {
      console.error("Invalid Signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    
    
    const { tx_ref, status } = body;
    // console.log("body: " , body);
    
    console.log("tx_ref: " , tx_ref);

    if (status !== "success") {
      return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
    }

    // Verify the payment with Chapa
    const verifyResponse = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CHAPA_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const verifyResult = await verifyResponse.json();
    console.log("Chapa Verification Response:", verifyResult);

    if (!verifyResponse.ok || verifyResult?.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Extract necessary data
    const courseId = tx_ref.split("_")[1];
    const userId =tx_ref.split("_")[2];

    console.log("tx_ref ", tx_ref);
    console.log("Course ID:", courseId);
    console.log("User ID:", userId);
    // Get the course details
    const course = await getCourseById(courseId);
    console.log("Course:", course);
    if (!course) {
        console.log("Course not found");
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Create enrollment in Sanity
    await createEnrollment({
      studentId: userId,
      courseId: course._id,
      paymentId: tx_ref,
      amount: verifyResult.data.amount,
    });

    return NextResponse.json({ message: "Enrollment created successfully" });
  } catch (error) {
    console.error("Error processing Chapa webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
