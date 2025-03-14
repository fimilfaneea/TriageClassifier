import { NextRequest, NextResponse } from 'next/server';

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

    // This is a simple example classification logic
    let classification = 'GREEN'; // Default classification
    
    const lowercaseInfo = patientInfo.toLowerCase();
    console.log('Processing patient info:', lowercaseInfo);
    
    if (lowercaseInfo.includes('chest pain') || 
        lowercaseInfo.includes('difficulty breathing') ||
        lowercaseInfo.includes('severe bleeding')) {
      classification = 'RED';
    } else if (lowercaseInfo.includes('broken') || 
               lowercaseInfo.includes('fracture') ||
               lowercaseInfo.includes('moderate pain')) {
      classification = 'YELLOW';
    }

    console.log('Classification result:', classification);
    return NextResponse.json({ classification });
    
  } catch (error) {
    console.error('Classification error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      body: request.body
    });
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 