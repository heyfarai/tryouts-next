import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin token (basic check)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: playerId } = await params;

    // Find the most recent pending registration for this player
    const pendingRegistration = await prisma.registration.findFirst({
      where: {
        players: {
          some: {
            playerId: playerId
          }
        },
        status: 'PENDING_PAYMENT'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!pendingRegistration) {
      return NextResponse.json(
        { error: 'No pending registration found for this player' },
        { status: 404 }
      );
    }

    // Update the registration status to COMPLETED
    await prisma.registration.update({
      where: {
        id: pendingRegistration.id
      },
      data: {
        status: 'COMPLETED'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Registration marked as completed',
      registrationId: pendingRegistration.id
    });

  } catch (error) {
    console.error('Error marking registration complete:', error);
    return NextResponse.json(
      { error: 'Failed to mark registration complete' },
      { status: 500 }
    );
  }
}
