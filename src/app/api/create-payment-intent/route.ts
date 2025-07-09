import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const {
      amount = Number(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_PER_PLAYER),
      currency = "cad",
      registrationId,
    } = await req.json();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        integration_check: "tryouts-registration",
        registrationId,
      },
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret } satisfies { clientSecret: string | null });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
