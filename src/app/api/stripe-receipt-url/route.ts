import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const payment_intent_id = searchParams.get("payment_intent_id");
  if (!payment_intent_id) {
    return NextResponse.json(
      { error: "Missing payment_intent_id" },
      { status: 400 }
    );
  }
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment_intent_id,
      { expand: ["charges"] }
    );
    // Debug log the full PaymentIntent object and charges
    if (
      !paymentIntent ||
      typeof paymentIntent.charges !== "object" ||
      !("data" in paymentIntent.charges)
    ) {
      // Fallback: Try to fetch the latest_charge directly
      if (paymentIntent.latest_charge) {
        try {
          const charge = await stripe.charges.retrieve(
            paymentIntent.latest_charge as string
          );
          if (charge && charge.receipt_url) {
            return NextResponse.json({ receipt_url: charge.receipt_url });
          } else {
            return NextResponse.json(
              { error: "No receipt_url on latest charge", charge },
              { status: 404 }
            );
          }
        } catch (err: any) {
          return NextResponse.json(
            {
              error: "Failed to fetch latest_charge directly",
              detail: err.message,
            },
            { status: 500 }
          );
        }
      }
      return NextResponse.json(
        { error: "No charges found for payment intent", paymentIntent },
        { status: 404 }
      );
    }
    const charge = paymentIntent.charges.data[0];
    if (!charge) {
      // Fallback: Try to fetch the latest_charge directly
      if (paymentIntent.latest_charge) {
        try {
          const charge = await stripe.charges.retrieve(
            paymentIntent.latest_charge as string
          );
          if (charge && charge.receipt_url) {
            return NextResponse.json({ receipt_url: charge.receipt_url });
          } else {
            return NextResponse.json(
              { error: "No receipt_url on latest charge", charge },
              { status: 404 }
            );
          }
        } catch (err: any) {
          return NextResponse.json(
            {
              error: "Failed to fetch latest_charge directly",
              detail: err.message,
            },
            { status: 500 }
          );
        }
      }
      return NextResponse.json(
        {
          error: "No charge found for payment intent",
          charges: paymentIntent.charges,
        },
        { status: 404 }
      );
    }
    const receipt_url = charge.receipt_url;
    return NextResponse.json({ receipt_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
