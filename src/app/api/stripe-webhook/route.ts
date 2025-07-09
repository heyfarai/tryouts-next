import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  let event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(
      body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: unknown) {
    return NextResponse.json({ error: `Webhook Error: ${err instanceof Error ? err.message : String(err)}` }, { status: 400 });
  }
  // Handle event types as needed
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment intent
      break;
    // Add other event types as needed
    default:
      break;
  }
  return NextResponse.json({ received: true } satisfies { received: boolean });
}
