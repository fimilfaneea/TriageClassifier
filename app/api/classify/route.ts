import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are an expert emergency medical triage system. Your task is to classify patients into one of three triage categories based on their symptoms and conditions:

RED (Immediate/Critical):
- Life-threatening conditions
- Severe trauma
- Chest pain, difficulty breathing
- Severe bleeding
- Unconsciousness

YELLOW (Urgent/Delayed):
- Moderate injuries
- Stable vital signs
- Fractures and sprains
- Moderate pain
- Non-life-threatening conditions

GREEN (Non-urgent/Minor):
- Minor injuries
- Minor illnesses
- Stable condition
- Able to walk
- Minimal pain

Respond ONLY with the color category (RED, YELLOW, or GREEN) based on the patient information provided.`;

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
      model: 'mixtral-8x7b-32768',
      temperature: 0.1,
      max_tokens: 10,
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