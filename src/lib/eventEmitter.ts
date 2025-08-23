import { EventEmitter } from 'events';

// Global event emitter for server-side events
export const checkInEvents = new EventEmitter();

export interface CheckInEvent {
  type: 'checkin_updated';
  playerId: string;
  isCheckedIn: boolean;
  timestamp: string;
}

export function emitCheckInUpdate(playerId: string, isCheckedIn: boolean) {
  const event: CheckInEvent = {
    type: 'checkin_updated',
    playerId,
    isCheckedIn,
    timestamp: new Date().toISOString(),
  };
  
  checkInEvents.emit('checkin_update', event);
}
