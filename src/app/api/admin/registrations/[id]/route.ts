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
      // First, find the registration and its related records
      const registration = await tx.registration.findUnique({
        where: { id },
        include: {
          payment: true,
          players: true,
        },
      });

      if (!registration) {
        throw new Error("Registration not found");
      }

      // Delete the payment if it exists
      if (registration.payment) {
        await tx.payment.delete({
          where: { id: registration.payment.id },
        });
      }

      // Delete all player registrations for this registration
      await tx.playerRegistration.deleteMany({
        where: { registrationId: id },
      });

      // Finally, delete the registration
      await tx.registration.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      {
        error: `Failed to delete registration: ${
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
