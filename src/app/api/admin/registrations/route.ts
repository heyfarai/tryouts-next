import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
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

export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request);

    const registrations = await prisma.registration.findMany({
      include: {
        guardian: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        players: {
          include: {
            player: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        payment: {
          select: {
            amount: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Unauthorized or server error" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
