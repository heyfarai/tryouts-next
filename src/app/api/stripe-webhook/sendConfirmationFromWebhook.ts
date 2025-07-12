import { getConfirmationEmailHtml } from "../../emails/ConfirmationEmail";
import { sendPostmarkEmail } from "../../lib/sendPostmarkEmail";
import { prisma } from "../../lib/prisma";

export async function sendConfirmationFromWebhook({
  registrationId,
  receiptUrl,
  guardianEmail,
}: {
  registrationId: string;
  receiptUrl: string | null;
  guardianEmail?: string;
}) {
  try {
    // 1. Fetch registration, guardian, and player info
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        guardian: { include: { user: true } },
        players: { include: { player: true } },
      },
    });

    if (!registration || !registration.guardian) {
      throw new Error(
        "Registration or guardian not found for confirmation email"
      );
    }
    const players = registration.players?.map((p: any) => p.player) || [];
    // Use guardianEmail from argument if provided, else fallback to DB
    const email = guardianEmail || registration.guardian.user.email;

    // 2. Compose email HTML
    const html = await getConfirmationEmailHtml({
      players,
      paymentReceiptUrl: receiptUrl ?? undefined,
    });

    // 3. Postmark config

    // 4. Send email via reusable utility
    const result = await sendPostmarkEmail({
      to: email,
      subject: "🏀 Tryouts confirmation",
      html,
      messageStream: "outbound",
    });
    return result;
  } catch (err) {
    console.error("[WebhookEmail] ERROR in sendConfirmationFromWebhook:", err);
    throw err;
  }
}
