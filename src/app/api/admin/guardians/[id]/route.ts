import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

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
  { params }: { params: { id: string } }
) {
  try {
    verifyAdminToken(request);

    const { id } = params;

    // Use a transaction to delete related records in the correct order
    await prisma.$transaction(async (tx) => {
      // First, find the guardian and their related records
      const guardian = await tx.guardian.findUnique({
        where: { id },
        include: {
          players: {
            include: {
              registrations: true,
            },
          },
          registrations: {
            include: {
              payment: true,
              players: true,
            },
          },
        },
      });

      if (!guardian) {
        throw new Error("Guardian not found");
      }

      // Delete all player registrations for players under this guardian
      for (const player of guardian.players) {
        await tx.playerRegistration.deleteMany({
          where: { playerId: player.id },
        });
      }

      // Delete all payments for registrations by this guardian
      for (const registration of guardian.registrations) {
        if (registration.payment) {
          await tx.payment.delete({
            where: { id: registration.payment.id },
          });
        }
        // Delete player registrations for this registration
        await tx.playerRegistration.deleteMany({
          where: { registrationId: registration.id },
        });
      }

      // Delete all registrations by this guardian
      await tx.registration.deleteMany({
        where: { guardianId: id },
      });

      // Delete all players under this guardian
      await tx.player.deleteMany({
        where: { guardianId: id },
      });

      // Finally, delete the guardian
      await tx.guardian.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting guardian:", error);
    return NextResponse.json(
      {
        error: `Failed to delete guardian: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      {
        status:
          error instanceof Error && error.message === "Unauthorized"
            ? 401
            : 500,
      }
    );
  }
}
