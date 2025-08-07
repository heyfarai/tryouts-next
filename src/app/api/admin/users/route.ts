import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.substring(7);
  
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    throw new Error('Unauthorized');
  }
}

export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request);

    const users = await prisma.user.findMany({
      include: {
        guardian: {
          select: {
            id: true,
            phone: true
          }
        },
        player: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Unauthorized or server error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
