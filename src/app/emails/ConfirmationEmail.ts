export async function getConfirmationEmailHtml({
  players,
  paymentReceiptUrl,
}: {
  players: any[];
  paymentReceiptUrl?: string;
}): Promise<string> {
  // DEBUG: Log input to diagnose email rendering issues
  console.log("[ConfirmationEmail] players:", JSON.stringify(players));
  console.log("[ConfirmationEmail] paymentReceiptUrl:", paymentReceiptUrl);

  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Precision Heat Tryout Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: #333;
            background-color: #fff;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background-color: #e80707;
            color: #fff;
            padding: 15px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        h2, h3 {
            margin-top: 0;
            margin-bottom: 0;
        }
        .qr-code {
            text-align: center;
            margin: 20px 0;
        }
        a.button {
            display: inline-block;
            background-color: #e80707;
            color: #fff;
            text-decoration: none;
            padding: 10px 15px;
        }
        li {
            list-style-type: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>You're registered for Precision Heat 2025-26 tryouts!</h2>
        </div>
        <div class="content">
            <p>Hi,</p>
            <p>Here are your details:</p>
            <p><strong>Registered for tryouts:</strong></p>
            <ul>
                ${players
                  .map((p: any) => `<li>${p.firstName} ${p.lastName}</li>`)
                  .join("")}
            </ul>
            <p><strong>Dates:</strong></p>
            <ul>
                <li>
                Tryout Day 1 (All welcome):<br/>
                Sunday, August 24, 2025<br/>
                3:00pm - 5:00pm <br/>
                BGC Taggart Parkes (<a href="https://maps.app.goo.gl/fcace5GkineLFBK69">map</a>) <br/><br/><br/>
                </li>
                <li>
                Tryout Day 2 (Invitation only):<br/>
                Thursday, August 28, 2025<br/>
                5:30pm - 7:30pm <br/>
                BGC Taggart Parkes (<a href="https://maps.app.goo.gl/fcace5GkineLFBK69">map</a>) <br/>
                </li>
            </ul>
            ${paymentReceiptUrl
              ? `<div style="margin: 32px 0; text-align: center;">
                  <a href="${paymentReceiptUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 24px;background:#1976d2;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:1.1rem;">View Payment Receipt</a>
                  <p style="margin-top:8px;font-size:0.95rem;color:#555;">You can download or print your payment receipt here.</p>
                </div>`
              : ''}
            <p>See you at the tryouts!</p>
        </div>
    </div>
</body>
</html>
  `;
}
