import postmark from "postmark";

const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN;
const FROM_EMAIL = "gm@precisionheat.team";
const FROM_NAME = "Precision Heat Basketball";

if (!POSTMARK_API_TOKEN) {
  throw new Error("Missing Postmark API token");
}

const client = new postmark.ServerClient(POSTMARK_API_TOKEN);

export interface SendPostmarkEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  messageStream?: string;
}

export async function sendPostmarkEmail({
  to,
  subject,
  html,
  text,
  messageStream = "outbound",
}: SendPostmarkEmailOptions) {
  return client.sendEmail({
    From: `${FROM_NAME} <${FROM_EMAIL}>`,
    To: to,
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
    MessageStream: messageStream,
  });
}
