import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const payment_intent_id = searchParams.get("payment_intent_id");
  if (!payment_intent_id) {
    return NextResponse.json({ error: "Missing payment_intent_id" }, { status: 400 });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    if (!paymentIntent || typeof paymentIntent.charges !== "object" || !("data" in paymentIntent.charges)) {
      return NextResponse.json({ error: "No charges found for payment intent" }, { status: 404 });
    }
    const charge = paymentIntent.charges.data[0];
    if (!charge) {
      return NextResponse.json({ error: "No charge found for payment intent" }, { status: 404 });
    }
    const receipt_url = charge.receipt_url;
    return NextResponse.json({ receipt_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
