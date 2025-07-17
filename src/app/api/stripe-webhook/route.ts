import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  let event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(
      body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: `Webhook Error: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 400 }
    );
  }
  // Handle event types as needed
  switch (event.type) {
    case "payment_intent.succeeded": {
      // Expand charges for the payment intent
      const paymentIntent = event.data.object as Stripe.PaymentIntent & {
        charges?: { data: { receipt_url?: string }[] };
      };
      const registrationId = paymentIntent.metadata?.registrationId;
      if (registrationId) {
        try {
          console.log(
            "Attempting to upsert payment for registrationId:",
            registrationId
          );
          await prisma.payment.upsert({
            where: { registrationId },
            update: {
              stripeId: paymentIntent.id,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              status: paymentIntent.status,
              receiptUrl: (() => {
                const charges = paymentIntent.charges;
                if (
                  charges &&
                  Array.isArray(charges.data) &&
                  charges.data[0]?.receipt_url
                ) {
                  return charges.data[0].receipt_url;
                }
                return null;
              })(),
            },
            create: {
              registrationId,
              stripeId: paymentIntent.id,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              status: paymentIntent.status,
              receiptUrl: (() => {
                const charges = paymentIntent.charges;
                if (
                  charges &&
                  Array.isArray(charges.data) &&
                  charges.data[0]?.receipt_url
                ) {
                  return charges.data[0].receipt_url;
                }
                return null;
              })(),
            },
          });

          // Update registration status to COMPLETED
          try {
            console.log(
              "[StripeWebhook] Attempting to update registration status to 'COMPLETED':",
              registrationId
            );
            const regUpdate = await prisma.registration.update({
              where: { id: registrationId },
              data: { status: "COMPLETED" },
            });
            console.log(
              "[StripeWebhook] Registration status updated:",
              regUpdate.id,
              regUpdate.status,
              JSON.stringify(regUpdate)
            );
          } catch (err) {
            console.error(
              "[StripeWebhook] Failed to update registration status:",
              err,
              registrationId
            );
          }
          // After upsert, send confirmation email from webhook
          let receiptUrl;
          try {
            receiptUrl = (() => {
              const charges = paymentIntent.charges;
              if (
                charges &&
                Array.isArray(charges.data) &&
                charges.data[0]?.receipt_url
              ) {
                return charges.data[0].receipt_url;
              }
              return null;
            })();
            const { sendConfirmationFromWebhook } = await import(
              "./sendConfirmationFromWebhook"
            );
            await sendConfirmationFromWebhook({
              registrationId,
              receiptUrl,
              guardianEmail: paymentIntent.metadata?.guardianEmail,
            });
            console.log(
              "Confirmation email sent from webhook for registrationId:",
              registrationId
            );
          } catch (err) {
            console.error(
              "Failed to send confirmation email from webhook:",
              {
                errorMessage: err instanceof Error ? err.message : String(err),
                errorStack: err instanceof Error ? err.stack : undefined,
                errorType: err?.constructor?.name || typeof err,
                registrationId,
                guardianEmail: paymentIntent.metadata?.guardianEmail,
                receiptUrl,
                rawError: err
              }
            );
          }
        } catch (err) {
          console.error("Failed to upsert payment:", err);
        }
      }
      break;
    }
    // Add other event types as needed
    default:
      break;
  }
  return NextResponse.json({ received: true } satisfies { received: boolean });
}
