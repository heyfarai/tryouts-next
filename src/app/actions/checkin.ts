'use server';

import { Player } from '../checkin/page';

export async function fetchPlayers(): Promise<Player[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/checkin`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch players');
    }
    
    const data = await response.json();
    return data.map((player: Player) => ({
      ...player,
      registrations: player.registrations || []
    }));
  } catch (error) {
    console.error('Error in fetchPlayers:', error);
    return [];
  }
}
