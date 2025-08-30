import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://host.docker.internal:3000/api';
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    // Return mock response for development when backend is not available
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        status: 'offline',
        message: 'Backend not available - using frontend-only mode',
        timestamp: new Date().toISOString(),
        mock: true
      });
    }
    
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to backend',
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 'offline'
      },
      { status: 500 }
    );
  }
}