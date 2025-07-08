import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { amount, registrationId, players, guardianEmail, successUrl, cancelUrl } = await req.json();
    if (!amount || !registrationId || !players || !guardianEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `Tryout Registration (${players.length} player${players.length > 1 ? 's' : ''})`,
              metadata: {
                registrationId,
                guardianEmail,
              },
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId,
        guardianEmail,
      },
      customer_email: guardianEmail,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/registration-complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/register?canceled=1`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
