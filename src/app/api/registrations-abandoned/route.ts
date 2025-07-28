import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// Returns a list of registrations with status PENDING_PAYMENT older than X hours (default: 1 hour)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hours = parseInt(searchParams.get("hours") || "1", 10);
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  const registrations = await prisma.registration.findMany({
    where: {
      status: "PENDING_PAYMENT",
      createdAt: { lt: cutoff },
    },
    include: {
      guardian: { include: { user: true } },
      players: { include: { player: true } },
      payment: true,
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ registrations });
}
