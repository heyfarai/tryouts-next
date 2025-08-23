import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  let firstName: string | undefined;
  let lastName: string | undefined;
  let email: string | undefined;
  let birthdate: string | undefined;
  
  try {
    const requestData = await request.json();
    firstName = requestData.firstName?.trim();
    lastName = requestData.lastName?.trim();
    email = requestData.email?.trim();
    birthdate = requestData.birthdate?.trim();
    
    // Validation
    if (!firstName || !lastName || !email || !birthdate) {
      return NextResponse.json(
        { error: 'First name, last name, guardian email, and birthdate are required' },
        { status: 400 }
      );
    }

    // Generate unique check-in ID
    const checkInId = await generateUniqueCheckInId();

    // Use a transaction to create user, guardian, and player
    const result = await prisma.$transaction(async (tx) => {
      // Check if user with this email already exists
      let user = await tx.user.findUnique({
        where: { email: email! }
      });

      let guardian;
      
      if (user) {
        // User exists, find their guardian record
        guardian = await tx.guardian.findUnique({
          where: { userId: user.id }
        });
        
        if (!guardian) {
          // User exists but no guardian record, create one
          guardian = await tx.guardian.create({
            data: {
              phone: '', // Empty phone for walk-ins
              userId: user.id,
            },
          });
        }
      } else {
        // Create new User record with a temporary clerkUserId
        const tempClerkId = `walkin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        user = await tx.user.create({
          data: {
            clerkUserId: tempClerkId,
            email: email!,
            role: 'GUARDIAN', // Set as guardian since we need a guardian record
            isLead: false,
          },
        });

        // Create Guardian record (required for Player)
        guardian = await tx.guardian.create({
          data: {
            phone: '', // Empty phone for walk-ins
            userId: user.id,
          },
        });
      }

      // Create Player record with required fields
      const player = await tx.player.create({
        data: {
          firstName: firstName!,
          lastName: lastName!,
          birthdate: new Date(birthdate!), // Use actual birthdate from form
          gender: 'Unknown', // Default gender for walk-ins
          checkInId,
          guardianId: guardian.id,
        },
      });

      // Create a temporary registration for walk-in players to enable check-in
      const registration = await tx.registration.create({
        data: {
          guardianId: guardian.id,
          tryoutName: 'Walk-in Registration',
          status: 'PENDING_PAYMENT', // Mark as unpaid
        },
      });

      // Create PlayerRegistration to link player to registration
      const playerRegistration = await tx.playerRegistration.create({
        data: {
          playerId: player.id,
          registrationId: registration.id,
        },
      });

      return {
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        checkInId: player.checkInId,
        registrations: [{
          id: playerRegistration.id,
          checkedInAt: null,
          checkedOutAt: null,
        }], // Include registration for check-in capability
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding walk-in player:', {
      error: error instanceof Error ? error.message : error,
      firstName,
      lastName,
      email,
      birthdate,
      timestamp: new Date().toISOString()
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Failed to add walk-in player',
        details: errorMessage
      },
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
    
    // Check if this ID is already in use
    const existingPlayer = await prisma.$queryRaw`
      SELECT id FROM "Player" WHERE "checkInId" = ${checkInId} LIMIT 1
    ` as any[];
    
    if (!existingPlayer || existingPlayer.length === 0) {
      isUnique = true;
    }
  }
  
  return checkInId!;
}
