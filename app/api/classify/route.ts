import { NextResponse } from 'next/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const { patientInfo } = await req.json();

    const prompt = `As an emergency medical triage expert, analyze the following patient information and classify them into one of these color codes:
    RED (Immediate) - Immediate life-threatening conditions requiring immediate medical attention
    YELLOW (Urgent) - Serious but not immediately life-threatening conditions requiring urgent care
    GREEN (Minor) - Minor injuries or illnesses that can wait
    BLACK (Expectant) - Beyond help or deceased

    Provide the classification in this format:
    COLOR CODE
    Key Findings:
    - [list 2-3 key findings that led to this classification]
    
    Patient Information:
    ${patientInfo}

    If critical information is missing, respond with "YELLOW - Insufficient Information" and list what additional information is needed for a more accurate assessment.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1, // Lower temperature for more consistent responses
        max_tokens: 200,  // Limit response length
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get classification');
    }

    const data = await response.json();
    const classification = data.choices[0].message.content.trim();

    return NextResponse.json({ classification });
  } catch (error) {
    console.error('Classification error:', error);
    return NextResponse.json(
      { error: 'Failed to classify patient information' },
      { status: 500 }
    );
  }
} 