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

    const guardians = await prisma.guardian.findMany({
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
        players: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        registrations: {
          select: {
            id: true,
            tryoutName: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: "desc",
        },
      },
    });

    return NextResponse.json(guardians);
  } catch (error) {
    console.error("Error fetching guardians:", error);
    return NextResponse.json(
      { error: "Unauthorized or server error" },
      { status: error instanceof Error && error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
