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

    const { id: userId } = await params;

    // Use a transaction to delete related records in the correct order
    await prisma.$transaction(async (tx) => {
      // First, find the user and their related records
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: {
          guardian: {
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
          },
          player: {
            include: {
              registrations: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // If user is a guardian, delete all related data
      if (user.guardian) {
        // Delete all player registrations for players under this guardian
        for (const player of user.guardian.players) {
          await tx.playerRegistration.deleteMany({
            where: { playerId: player.id },
          });
        }

        // Delete all payments for registrations by this guardian
        for (const registration of user.guardian.registrations) {
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
          where: { guardianId: user.guardian.id },
        });

        // Delete all players under this guardian
        await tx.player.deleteMany({
          where: { guardianId: user.guardian.id },
        });

        // Delete the guardian record
        await tx.guardian.delete({
          where: { id: user.guardian.id },
        });
      }

      // If user is a player, delete their registrations
      if (user.player) {
        await tx.playerRegistration.deleteMany({
          where: { playerId: user.player.id },
        });

        await tx.player.delete({
          where: { id: user.player.id },
        });
      }

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        error: `Failed to delete user: ${
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
