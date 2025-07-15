import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-06-30.basil",
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");
    if (!session_id) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    // 1. Fetch the Stripe Checkout Session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // 2. Extract metadata
    const registrationId = session.metadata?.registrationId;
    const guardianEmail =
      session.customer_email || session.metadata?.guardianEmail;
    const paymentStatus = session.payment_status;

    // 3. Fetch registration info from DB (if possible)
    let registration = null;
    if (registrationId) {
      registration = await prisma.registration.findUnique({
        where: { id: registrationId },
        include: {
          guardian: true,
          players: { include: { player: true } },
        },
      });
    }

    // 4. Compose confirmation object
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;
    const confirmation = registration
      ? {
          guardianEmail: (registration.guardian as any)?.email || guardianEmail,
          guardianPhone: registration.guardian?.phone || "",
          players: registration.players?.map((p: any) => p.player) || [],
          paymentStatus,
          paymentIntentId,
        }
      : {
          guardianEmail,
          guardianPhone: "",
          players: [],
          paymentStatus,
          paymentIntentId,
        };

    return NextResponse.json({ confirmation });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err instanceof Error ? err.message : String(err) : String(err) }, { status: 500 });
  }
}
