import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// const SYSTEM_PROMPT = `You are an expert emergency medical triage system specialized in casualty and trauma care. Your primary objective is to classify patients into one of four triage categories to ensure rapid and efficient care delivery:

// Red (Immediate): Life-threatening conditions requiring immediate intervention.

// Yellow (Urgent): Serious conditions that are not immediately life-threatening but need prompt attention.

// Green (Minor): Non-urgent cases that can wait for treatment.

// Black (Deceased/Non-Salvageable): No signs of life or fatal injuries.

// Instructions for Classification:

// Quickly assess the patient's condition based on provided symptoms, vital signs, and medical history.

// Display the triage color prominently.

// Summarize key medical information concisely, including:

// Patient demographics

// Vital signs (heart rate, blood pressure, oxygen saturation, temperature, etc.)

// Primary symptoms

// Known allergies

// Existing medical conditions

// Medications

// Highlight any critical findings or warning signs that require immediate attention.

// Keep the output brief and easy for the doctor to comprehend in minimal time.
// `;

const SYSTEM_PROMPT = `Give an essay on
`;

// Remove edge runtime to use default Node.js runtime
// export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    console.log('Received request to /api/classify');
    
    const body = await request.json();
    console.log('Received body:', body);
    
    const { patientInfo } = body;

    if (!patientInfo) {
      console.log('Missing patientInfo in request');
      return NextResponse.json(
        { error: 'Patient information is required' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    // Call Groq API for classification
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: patientInfo
        }
      ],
      model: 'whisper-large-v3-turbo',
      temperature: 0.1,
      max_tokens: 100,
    });

    const classification = completion.choices[0]?.message?.content?.trim() || 'GREEN';
    console.log('Classification result:', classification);

    return NextResponse.json({ classification });
    
  } catch (error) {
    console.error('Classification error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 