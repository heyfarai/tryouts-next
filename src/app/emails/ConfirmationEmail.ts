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
                BGC Tomlinson (<a href="https://maps.app.goo.gl/4YFkKQamYPUCXG4m7">1463 Prince of
              Wales Dr.</a>) <br/><br/><br/>
                </li>
                <li>
                Tryout Day 2 (Invitation only):<br/>
                Thursday, August 28, 2025<br/>
                5:30pm - 7:30pm <br/>
                BGC Tomlinson (<a href="https://maps.app.goo.gl/4YFkKQamYPUCXG4m7">1463 Prince of
              Wales Dr.</a>) <br/>
                </li>
            </ul>
            ${
              paymentReceiptUrl
                ? `<div style="margin: 0;">
            <p><strong>Receipt</strong></p>
                  <a href="${paymentReceiptUrl}" target="_blank" rel="noopener" style="">View Payment Receipt</a>
                </div>`
                : ""
            }
            <p>We'll remind you closer to the day.</p>
            <p>See you at the tryouts!</p>
        </div>
    </div>
</body>
</html>
  `;
}
