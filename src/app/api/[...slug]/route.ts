import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return proxyRequest(request, slug, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return proxyRequest(request, slug, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return proxyRequest(request, slug, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return proxyRequest(request, slug, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  slug: string[],
  method: string
) {
  try {
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://host.docker.internal:3000/api';
    const path = slug.join('/');
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const backendUrl = `${backendBaseUrl}/${path}${searchParams ? `?${searchParams}` : ''}`;

    console.log(`Proxying ${method} ${path} to:`, backendUrl);

    let body = undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text();
      } catch (error) {
        console.log('No body to read');
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.Authorization = authHeader;
      console.log('Forwarding auth header:', authHeader.substring(0, 20) + '...');
    } else {
      console.log('No auth header found in request');
    }

    const response = await fetch(backendUrl, {
      method,
      headers,
      body: body || undefined,
    });

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { 
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } else {
      const text = await response.text();
      return new NextResponse(text, { 
        status: response.status,
        headers: {
          'Content-Type': contentType || 'text/plain',
        }
      });
    }
    
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to backend',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: `Attempted to proxy: ${slug.join('/')}`
      },
      { status: 500 }
    );
  }
}