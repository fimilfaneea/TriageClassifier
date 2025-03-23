import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `Classify the patient using the triage color code system (Red, Yellow, Green, Black). If data is insufficient, return: More info needed.

Output Format:

Color code (Red, Yellow, Green, Black) — no extra text.

(Leave a line)

Patient details:
OP No X, Mr./Ms. [Name], a [Occupation] from [Location], has a history of [Relevant medical history]. Currently experiencing [Symptoms], BP [mmHg], SpO2 [ %], Temp [°F], HR [bpm]. Additional conditions: [Diabetes/Hypertension/etc.], lifestyle factors (if any).

(Leave a line)

Possible diagnosis: (Diagnosis)

(Leave a line)

Refer to dept: (Relevant medical department)`;

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
          content: `${SYSTEM_PROMPT}\n\n${patientInfo}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
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
