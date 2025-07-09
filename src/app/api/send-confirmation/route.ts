import { NextRequest, NextResponse } from "next/server";
import { getConfirmationEmailHtml } from "../../emails/ConfirmationEmail";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, players, paymentReceiptUrl, phone } = await req.json();
    if (!email || !players) {
      console.error("Missing required fields:", { email, players });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const html = await getConfirmationEmailHtml({
      players,
      paymentReceiptUrl,
    });

    // Nodemailer config from env
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } =
      process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
      console.error("Missing SMTP environment variables");
      return NextResponse.json(
        { error: "Missing SMTP config" },
        { status: 500 }
      );
    }
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465, // true for 465, false for others
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
    } catch (err) {
      console.error("Failed to create transporter:", err);
      return NextResponse.json(
        { error: "Failed to create email transporter" },
        { status: 500 }
      );
    }
    try {
      const info = await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: "Your Tryouts Registration Confirmation",
        html,
      });
      console.log("Confirmation email sent:", info.messageId);
      return NextResponse.json({
        success: true,
        messageId: info.messageId,
        html,
      });
    } catch (err: unknown) {
      console.error("Failed to send confirmation email:", err);
      return NextResponse.json(
        { error: "Failed to send confirmation email", detail: err instanceof Error ? err.message : String(err) },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
