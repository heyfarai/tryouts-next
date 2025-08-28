import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Check against environment variable or default password
    const correctPassword = process.env.CHECKIN_PASSWORD || 'checkin123';
    
    if (password === correctPassword) {
      // Create a simple session token (in production, use proper JWT)
      const sessionToken = Buffer.from(`checkin-${Date.now()}`).toString('base64');
      
      const response = NextResponse.json({ success: true });
      
      // Set httpOnly cookie for security
      response.cookies.set('checkin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 6, // 6 hours
        path: '/'
      });
      
      return response;
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Check-in auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Check if user has valid session
  const sessionCookie = request.cookies.get('checkin-session');
  
  if (sessionCookie?.value) {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false });
}
