import { getConfirmationEmailHtml } from "../../emails/ConfirmationEmail";
import nodemailer from "nodemailer";
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
      throw new Error("Registration or guardian not found for confirmation email");
    }
    const players = registration.players?.map((p: any) => p.player) || [];
    // Use guardianEmail from argument if provided, else fallback to DB
    const email = guardianEmail || registration.guardian.user.email;


    // 2. Compose email HTML
    const html = await getConfirmationEmailHtml({
      players,
      paymentReceiptUrl: receiptUrl ?? undefined,
    });

    // 3. SMTP config
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
      throw new Error("Missing SMTP environment variables");
    }
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    // 4. Send email
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: "Precision Heat Tryouts Registration Confirmation",
      html,
    });

    return info;
  } catch (err) {
    console.error('[WebhookEmail] ERROR in sendConfirmationFromWebhook:', err);
    throw err;
  }
}
