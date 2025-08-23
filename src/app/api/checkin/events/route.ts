import { NextRequest } from 'next/server';
import { checkInEvents } from '@/lib/eventEmitter';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
      );

      // Listen for check-in updates
      const onCheckInUpdate = (event: any) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      checkInEvents.on('checkin_update', onCheckInUpdate);

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`)
        );
      }, 30000);

      // Cleanup on connection close
      const cleanup = () => {
        clearInterval(heartbeat);
        checkInEvents.off('checkin_update', onCheckInUpdate);
        controller.close();
      };

      // Handle client disconnect
      request.signal.addEventListener('abort', cleanup);
    },
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}
