"use server";
import { Chapa } from 'chapa-nodejs';

import { urlFor } from "@/sanity/lib/image";
import baseUrl from "@/lib/baseUrl";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import { clerkClient } from "@clerk/nextjs/server";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";

const CHAPA_API_KEY = process.env.CHAPA_API_KEY; // Ensure this is set in your environment variables

if (!CHAPA_API_KEY) {
  throw new Error("CHAPA_API_KEY is not defined");
}

const chapa = new Chapa({
  secretKey: CHAPA_API_KEY,
});

export async function createChapaCheckout(courseId: string, userId: string) {
  try {
    // 1. Query course details from Sanity
    console.log("User Id", userId)
    const course = await getCourseById(courseId);
    const clerkUser = await (await clerkClient()).users.getUser(userId);
    const { emailAddresses, firstName, lastName, imageUrl, phoneNumbers } = clerkUser;
    const email = emailAddresses[0]?.emailAddress;
    const phoneNumber = phoneNumbers?.[0]?.phoneNumber || "0900123456"; 

    if (!emailAddresses || !email) {
      throw new Error("User details not found");
    }

    if (!course) {
      throw new Error("Course not found");
    }

    const user = await createStudentIfNotExists({
      clerkId: userId,
      email: email || "",
      firstName: firstName || email,
      lastName: lastName || "",
      imageUrl: imageUrl || "",
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 2. Validate course data and prepare price for Chapa
    if (typeof course.price !== "number") {
      throw new Error("Course price is not set correctly");
    }

    const price = course.price; // Assume the price is in ETB

    console.log("Course Price:", price);
    console.log("studentId:", user._id);  
    // If course is free, bypass checkout and create enrollment
    if (price === 0) {
      await createEnrollment({
        studentId: user._id,
        courseId: course._id,
        paymentId: "free",
        amount: 0,
      });

      return { url: `/courses/${course.slug?.current}` };
    }

    const { title, description, image, slug } = course;

    if (!title || !description || !image || !slug) {
      throw new Error("Course data is incomplete");
    }
    console.log("Using Chapa API Key:", CHAPA_API_KEY?.slice(0, 4) + "****");


    const tx_ref = `chapa_${courseId}_${user._id}_${Date.now()}`;
    
    // Prepare request payload
    const payload = JSON.stringify({
      amount: price.toString(),
      currency: "ETB",
      email,
      first_name: firstName || "Student",
      last_name: lastName || "User",
      phone_number: phoneNumber,
      tx_ref,
      callback_url: `${baseUrl}/courses/${slug.current}`,
      return_url: `${baseUrl}/courses/${slug.current}?canceled=true`,
      "customization[title]": title,
      "customization[description]": description,
      "meta[hide_receipt]": "true",
    });
    console.log("Chapa Payload:", payload);
    // Make Chapa API request
    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CHAPA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    const result = await response.json();
    console.log("Chapa Response:", result);

    if (!response.ok || !result?.data?.checkout_url) {
      throw new Error(`Chapa error: ${result?.message || "Unknown error"}`);
    }
    return { url: result.data.checkout_url };
  } catch (error) {
    console.error("Error in createChapaCheckout:", error);
    throw new Error(`Failed to create checkout session: ${error}`);
  }
}