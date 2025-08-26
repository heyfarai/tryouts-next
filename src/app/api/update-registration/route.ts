import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { registrationId, players, guardianEmail } = await req.json();
    
    if (!registrationId || !players || !guardianEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if registration exists
    const existingRegistration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        guardian: {
          include: {
            user: true
          }
        },
        players: {
          include: {
            player: true
          }
        }
      }
    });

    if (!existingRegistration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Update guardian email if changed
    if (existingRegistration.guardian.user.email !== guardianEmail) {
      await prisma.user.update({
        where: { id: existingRegistration.guardian.userId },
        data: { email: guardianEmail }
      });
    }

    // Delete existing players and create new ones
    // This handles cases where player count or data changes
    await prisma.playerRegistration.deleteMany({
      where: { registrationId: registrationId }
    });

    // Delete the actual player records that were associated with this registration
    const playerIds = existingRegistration.players.map(pr => pr.playerId);
    await prisma.player.deleteMany({
      where: { id: { in: playerIds } }
    });

    // Create new players
    const updatedRegistration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        players: {
          create: players.map((p: any) => ({
            player: {
              create: {
                firstName: p.firstName,
                lastName: p.lastName,
                birthdate: new Date(p.birthdate),
                gender: p.gender,
                guardianId: existingRegistration.guardianId,
              },
            },
          })),
        },
      },
      include: {
        players: {
          include: {
            player: true
          }
        },
      },
    });

    return NextResponse.json({ 
      registrationId: updatedRegistration.id,
      message: "Registration updated successfully" 
    });
    
  } catch (err: unknown) {
    console.error("[ERROR] Update registration failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
