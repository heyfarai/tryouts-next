import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(req: NextRequest) {
  const { guardian, players, tryoutName } = await req.json();
  if (!guardian || !players || !tryoutName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkUserId: guardian.clerkUserId },
          { email: guardian.email },
        ],
      },
      include: { guardian: true },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: guardian.clerkUserId,
          email: guardian.email,
          role: 'GUARDIAN',
          guardian: {
            create: { phone: guardian.phone },
          },
        },
        include: { guardian: true },
      });
    }
    const guardianDb = await prisma.guardian.upsert({
      where: { userId: user.id },
      update: { phone: guardian.phone },
      create: {
        userId: user.id,
        phone: guardian.phone,
      },
    });
    const createdPlayers = await Promise.all(players.map(async (p: any) => {
      return prisma.player.create({
        data: {
          firstName: p.firstName,
          lastName: p.lastName,
          birthdate: new Date(p.birthdate),
          gender: p.gender,
          guardianId: guardianDb.id,
        },
      });
    }));
    const registration = await prisma.registration.create({
      data: {
        guardianId: guardianDb.id,
        tryoutName,
        players: {
          create: createdPlayers.map((player: any) => ({ playerId: player.id })),
        },
      },
      include: {
        players: { include: { player: true } },
      },
    });
    return NextResponse.json({ registration } satisfies { registration: unknown });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err instanceof Error ? err instanceof Error ? err.message : String(err) : String(err) : String(err) }, { status: 500 });
  }
}
