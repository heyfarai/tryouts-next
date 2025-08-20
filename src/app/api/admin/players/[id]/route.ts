import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.substring(7);

  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    throw new Error("Unauthorized");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdminToken(request);

    const { id: playerId } = await params;

    // Use a transaction to delete related records in the correct order
    await prisma.$transaction(async (tx) => {
      // First, delete all player registrations for this player
      await tx.playerRegistration.deleteMany({
        where: { playerId: playerId },
      });

      // Then delete the player
      await tx.player.delete({
        where: { id: playerId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting player:", error);
    return NextResponse.json(
      {
        error: `Failed to delete player: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      {
        status:
          error instanceof Error && error instanceof Error && error.message === "Unauthorized"
            ? 401
            : 500,
      }
    );
  }
}
