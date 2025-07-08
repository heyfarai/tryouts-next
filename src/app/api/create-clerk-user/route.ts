import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }
  try {
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
    if (!CLERK_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing CLERK_SECRET_KEY in environment' }, { status: 500 });
    }
    // Check if user already exists in Clerk
    const searchResp = await fetch(
      `https://api.clerk.dev/v1/users?email_address=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        },
      }
    );
    const searchData = await searchResp.json();
    if (Array.isArray(searchData) && searchData.length > 0) {
      return NextResponse.json({ success: true, message: 'User already exists in Clerk' });
    }
    const clerkPayload: Record<string, any> = {
      email_address: [email],
      send_email_invite: true,
    };
    const resp = await fetch('https://api.clerk.dev/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify(clerkPayload),
    });
    const respText = await resp.text();
    if (!resp.ok) {
      return NextResponse.json({ error: respText }, { status: resp.status });
    }
    return NextResponse.json({ success: true, message: 'User created in Clerk', data: respText });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
