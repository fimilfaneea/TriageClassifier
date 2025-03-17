import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `Classify the patient based on the triage color code system (Red, Yellow, Green, or Black) using the given information. If the information is insufficient for classification, respond with "More info needed."

Output Format:
Important Note: Do not use bold (**), as it causes problems in the output.


The triage color code (Red, Yellow, Green, or Black) — no additional text, just the color.
----leave a line as gap-----
On the next line, provide critical information that the doctor needs to know immediately, including:
Symptoms, vital signs (e.g., blood pressure, oxygen levels), allergies, relevant medical history, provide in sentences.
----leave a line as gap-----
On the next line,"Possible diagnosis: (diagnosis)".
----leave a line as gap-----
On the next line, " Refer to dept: (here relevant medical dept)"
If the information is insufficient, return:
More info needed`;


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
      model: "llama3-70b-8192",
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
