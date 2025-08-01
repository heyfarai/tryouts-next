import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { players, guardianEmail } = await req.json();
    if (!players || !guardianEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Upsert user in Clerk and get real Clerk user ID
    const upsertRes = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/clerk-upsert-user`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: guardianEmail }),
      }
    );
    const upsertData = await upsertRes.json();
    if (!upsertRes.ok) {
      return NextResponse.json(
        { error: upsertData.error || "Failed to upsert Clerk user" },
        { status: 500 }
      );
    }
    const clerkUserId = upsertData.clerkUserId;
    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email: guardianEmail } });
    let guardian;
    if (!user) {
      // Create user and guardian in DB with real Clerk user ID
      user = await prisma.user.create({
        data: {
          email: guardianEmail,
          clerkUserId,
          role: "GUARDIAN",
        },
      });
      guardian = await prisma.guardian.create({
        data: {
          userId: user.id,
        },
      });
    } else {
      // Find guardian by userId
      guardian = await prisma.guardian.findUnique({ where: { userId: user.id } });
      if (!guardian) {
        // If user exists but not guardian, create guardian
        guardian = await prisma.guardian.create({
          data: {
            userId: user.id,
          },
        });
      }
    }
    // Create registration
    const registration = await prisma.registration.create({
      data: {
        guardianId: guardian.id,
        tryoutName: "2025 Tryout",
        players: {
          create: players.map((p: any) => ({
            player: {
              create: {
                firstName: p.firstName,
                lastName: p.lastName,
                birthdate: new Date(p.birthdate),
                gender: p.gender,
                guardianId: guardian.id,
              },
            },
          })),
        },
      },
      include: {
        players: true,
      },
    });
    return NextResponse.json({ registrationId: registration.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
