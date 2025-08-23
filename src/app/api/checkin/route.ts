import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emitCheckInUpdate } from '@/lib/eventEmitter';

export async function GET() {
  try {
    // Get all players who have at least one valid registration
    const players = (await prisma.$queryRaw`
      SELECT 
        p.id,
        p."firstName",
        p."lastName",
        p."checkInId",
        COALESCE(
          json_agg(
            json_build_object(
              'id', pr.id,
              'checkedInAt', pr."checkedInAt",
              'checkedOutAt', pr."checkedOutAt"
            )
            ORDER BY r."createdAt" DESC
          ) FILTER (WHERE r.status = 'COMPLETED' OR (r.status = 'PENDING_PAYMENT' AND r."isWalkIn" = true)),
          '[]'::json
        ) as registrations
      FROM "Player" p
      INNER JOIN "PlayerRegistration" pr ON p.id = pr."playerId"
      INNER JOIN "Registration" r ON pr."registrationId" = r.id
      WHERE EXISTS (
        SELECT 1 FROM "PlayerRegistration" pr2
        INNER JOIN "Registration" r2 ON pr2."registrationId" = r2.id
        WHERE pr2."playerId" = p.id 
        AND (r2.status = 'COMPLETED' OR (r2.status = 'PENDING_PAYMENT' AND r2."isWalkIn" = true))
      )
      GROUP BY p.id, p."firstName", p."lastName", p."checkInId"
      ORDER BY LOWER(p."firstName") ASC, LOWER(p."lastName") ASC
    ` as any[]).map(player => ({
      ...player,
      registrations: player.registrations || []
    }));

    // Ensure all players have a checkInId
    const playersWithCheckInId = [];
    
    for (const player of players) {
      if (!player.checkInId) {
        const checkInId = await generateUniqueCheckInId();
        await prisma.$executeRaw`
          UPDATE "Player" 
          SET "checkInId" = ${checkInId} 
          WHERE id = ${player.id}
        `;
        player.checkInId = checkInId;
      }
      playersWithCheckInId.push(player);
    }

    return NextResponse.json(playersWithCheckInId);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}

async function generateUniqueCheckInId(): Promise<number> {
  let checkInId: number;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate a random number between 10 and 99
    checkInId = Math.floor(Math.random() * 90) + 10;
    
    // Check if this ID is already in use using raw query to bypass type checking
    const existingPlayer = await prisma.$queryRaw`
      SELECT id FROM "Player" WHERE "checkInId" = ${checkInId} LIMIT 1
    ` as any[];
    
    if (!existingPlayer || existingPlayer.length === 0) {
      isUnique = true;
    }
  }
  
  return checkInId!;
}

export async function POST(request: Request) {
  let playerId: string | undefined;
  let checkIn: boolean | undefined;
  
  try {
    const requestData = await request.json();
    playerId = requestData.playerId;
    checkIn = requestData.checkIn;
    
    if (!playerId || checkIn === undefined) {
      return NextResponse.json(
        { error: 'Player ID and checkIn status are required' },
        { status: 400 }
      );
    }

    // Use a transaction to ensure atomicity and better error handling
    const result = await prisma.$transaction(async (tx) => {
      // Find the most recent registration for this player (including walk-ins)
      const playerRegistration = await tx.$queryRaw`
        SELECT pr.id 
        FROM "PlayerRegistration" pr
        JOIN "Registration" r ON pr."registrationId" = r.id
        WHERE pr."playerId" = ${playerId} AND (r.status = 'COMPLETED' OR (r.status = 'PENDING_PAYMENT' AND r."isWalkIn" = true))
        ORDER BY r."createdAt" DESC
        LIMIT 1
      ` as any[];

      if (!playerRegistration || playerRegistration.length === 0) {
        throw new Error(`No completed registration found for player ${playerId}`);
      }

      const registrationId = playerRegistration[0].id;
      const now = new Date();
      
      // Update the registration status
      if (checkIn) {
        await tx.$executeRaw`
          UPDATE "PlayerRegistration" 
          SET "checkedInAt" = ${now}, "checkedOutAt" = NULL
          WHERE id = ${registrationId}
        `;
      } else {
        await tx.$executeRaw`
          UPDATE "PlayerRegistration" 
          SET "checkedInAt" = NULL, "checkedOutAt" = ${now}
          WHERE id = ${registrationId}
        `;
      }

      return { registrationId, action: checkIn ? 'check-in' : 'check-out' };
    });

    // Emit real-time update to all connected clients
    emitCheckInUpdate(playerId, checkIn);

    return NextResponse.json({ 
      success: true, 
      message: `Player ${result.action} successful`,
      registrationId: result.registrationId 
    });
  } catch (error) {
    console.error('Error updating check-in status:', {
      error: error instanceof Error ? error.message : error,
      playerId,
      checkIn,
      timestamp: new Date().toISOString()
    });
    
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Failed to update check-in status',
        details: errorMessage,
        playerId 
      },
      { status: 500 }
    );
  }
}
