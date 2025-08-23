import { prisma } from '@/lib/prisma';
import CheckInClient from './CheckInClient';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  checkInId: number | null;
  registrations: Array<{
    id: string;
    checkedInAt: string | null;
    checkedOutAt: string | null;
  }>;
}

async function getPlayers(): Promise<Player[]> {
  try {
    const players = (await prisma.$queryRaw`
      SELECT 
        p.id,
        p."firstName",
        p."lastName",
        p."checkInId",
        json_agg(
          json_build_object(
            'id', pr.id,
            'checkedInAt', pr."checkedInAt",
            'checkedOutAt', pr."checkedOutAt"
          )
        ) as registrations
      FROM "Player" p
      INNER JOIN "PlayerRegistration" pr ON p.id = pr."playerId"
      INNER JOIN "Registration" r ON pr."registrationId" = r.id 
      WHERE (r.status = 'COMPLETED' OR (r.status = 'PENDING_PAYMENT' AND r."isWalkIn" = true))
      GROUP BY p.id, p."firstName", p."lastName", p."checkInId"
      ORDER BY LOWER(p."firstName") ASC, LOWER(p."lastName") ASC
    ` as any[]).map(player => ({
      ...player,
      registrations: player.registrations || []
    }));

    return players;
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
}

export default async function CheckInPage() {
  const players = await getPlayers();
  
  return <CheckInClient initialPlayers={players} />;
}
