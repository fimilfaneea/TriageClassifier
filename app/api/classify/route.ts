import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Add edge runtime support

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientInfo } = body;

    if (!patientInfo) {
      return new NextResponse(
        JSON.stringify({ error: 'Patient information is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // This is a simple example classification logic
    let classification = 'GREEN'; // Default classification
    
    const lowercaseInfo = patientInfo.toLowerCase();
    
    if (lowercaseInfo.includes('chest pain') || 
        lowercaseInfo.includes('difficulty breathing') ||
        lowercaseInfo.includes('severe bleeding')) {
      classification = 'RED';
    } else if (lowercaseInfo.includes('broken') || 
               lowercaseInfo.includes('fracture') ||
               lowercaseInfo.includes('moderate pain')) {
      classification = 'YELLOW';
    }

    return new NextResponse(
      JSON.stringify({ classification }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Classification error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 