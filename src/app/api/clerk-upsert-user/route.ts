import { NextRequest, NextResponse } from "next/server";

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    if (!CLERK_SECRET_KEY) {
      console.error("[ERROR] CLERK_SECRET_KEY is missing");
      return NextResponse.json(
        { error: "CLERK_SECRET_KEY is missing from environment" },
        { status: 500 }
      );
    }
    // Call Clerk API to find or create the user
    const res = await fetch("https://api.clerk.dev/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email_address: [email],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      // If error is 'email taken', fetch user by email
      if (data.errors && data.errors[0]?.code === "form_identifier_exists") {
        const getRes = await fetch(
          `https://api.clerk.dev/v1/users?email_address=${encodeURIComponent(
            email
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${CLERK_SECRET_KEY}`,
            },
          }
        );
        const getData = await getRes.json();
        if (getRes.ok && Array.isArray(getData) && getData.length > 0) {
          return NextResponse.json({ clerkUserId: getData[0].id });
        } else {
          return NextResponse.json(
            { error: "User exists but could not retrieve Clerk userId" },
            { status: 500 }
          );
        }
      }
      return NextResponse.json(
        { error: data.errors?.[0]?.message || "Failed to upsert Clerk user" },
        { status: 500 }
      );
    }
    // Return Clerk user id
    return NextResponse.json({ clerkUserId: data.id });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
