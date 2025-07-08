import { NextRequest, NextResponse } from 'next/server';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }
    // Call Clerk API to find or create the user
    const res = await fetch('https://api.clerk.dev/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email_address: [email],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.errors?.[0]?.message || 'Failed to upsert Clerk user' }, { status: 500 });
    }
    // Return Clerk user id
    return NextResponse.json({ clerkUserId: data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
