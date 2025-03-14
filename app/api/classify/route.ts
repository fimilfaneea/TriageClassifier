import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `Classify the patient based on the triage color code system (Red, Yellow, Green, Black) using the given information. Provide the output in the following format:

The triage color code (Red, Yellow, Green, or Black) — no additional text, just the color.
On the next line, brief critical information that the doctor needs to know immediately about the patient's condition.`;

// Remove edge runtime to use default Node.js runtime
// export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    console.log("Received request to /api/classify");

    const body = await request.json();
    console.log("Received body:", body);

    const { patientInfo } = body;

    if (!patientInfo) {
      console.log("Missing patientInfo in request");
      return NextResponse.json(
        { error: "Patient information is required" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    // Call Groq API for classification
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: patientInfo,
        },
      ],
      model: "gemma2-9b-it",
    });

    const classification =
      completion.choices[0]?.message?.content?.trim() || "GREEN";
    console.log("Classification result:", classification);

    return NextResponse.json({ classification });
  } catch (error) {
    console.error("Classification error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
