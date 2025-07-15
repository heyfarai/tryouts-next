import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("host");
  const baseUrl = `${protocol}://${host}`;
  try {
    const {
      amount,
      registrationId,
      players,
      guardianEmail,
      successUrl,
      cancelUrl,
    } = await req.json();
    if (!amount || !registrationId || !players || !guardianEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const session: any = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      payment_intent_data: {
        metadata: {
          registrationId,
          guardianEmail,
        },
      },
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `Precision Heat Tryout Registration (${
                players.length
              } player${players.length > 1 ? "s" : ""})`,
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
      success_url:
        successUrl ||
        `${baseUrl}/registration-complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/register?canceled=1`,
    });

    return NextResponse.json({ id: session.id, url: session.url } satisfies {
      id: string;
      url: string;
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
