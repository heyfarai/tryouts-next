import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clerkUserId = searchParams.get('clerkUserId');
  const role = searchParams.get('role');
  if (!clerkUserId) {
    return NextResponse.json({ error: 'Missing clerkUserId' }, { status: 400 });
  }
  if (!role) {
    return NextResponse.json({ error: 'Missing role' }, { status: 400 });
  }
  try {
    if (role === 'GUARDIAN') {
      const user = await prisma.user.findUnique({
        where: { clerkUserId },
        include: {
          guardian: {
            include: {
              players: true,
              registrations: {
                include: {
                  players: { include: { player: true } },
                  payment: true,
                },
              },
            },
          },
        },
      });
      if (!user || !user.guardian) return NextResponse.json({ error: 'Guardian not found' }, { status: 404 });
      type RegistrationType = {
  id: string;
  tryoutName: string;
  createdAt: string;
  payment?: {
    amount: number;
    currency: string;
    status: string;
    receiptUrl?: string;
  } | null;
  players: unknown[];
};
const registrations = user.guardian.registrations.map((r: any) => ({
  ...r,
  createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  payment: r.payment ? {
    amount: r.payment.amount,
    currency: r.payment.currency,
    status: r.payment.status,
    receiptUrl: r.payment.receiptUrl
  } : null
}));
      return NextResponse.json({
        role: 'GUARDIAN',
        guardian: user.guardian,
        players: user.guardian.players,
        registrations,
      });
    } else if (role === 'PLAYER') {
      const user = await prisma.user.findUnique({
        where: { clerkUserId },
        include: {
          player: {
            include: {
              registrations: {
                include: {
                  registration: {
                    include: {
                      payment: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!user || !user.player) return NextResponse.json({ error: 'Player not found' }, { status: 404 });
      return NextResponse.json({
        role: 'PLAYER',
        player: user.player,
        registrations: user.player.registrations,
      });
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
