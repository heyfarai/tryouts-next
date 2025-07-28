import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendPostmarkEmail } from "../../lib/sendPostmarkEmail";
import { getAbsoluteUrl } from "../../lib/getAbsoluteUrl";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: "Email and first name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Create new user marked as a lead
      const leadId = `lead_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          clerkUserId: leadId,
          role: "GUARDIAN",
          isLead: true,
          leadSource: "tryout_guide_pdf",
        },
      });
    } else if (!user.isLead) {
      // Update existing user to mark as lead if not already marked
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          isLead: true,
          leadSource: user.leadSource || "2025_tryout_guide_pdf",
        },
      });
    }

    // Generate dynamic URLs
    const downloadUrl = getAbsoluteUrl(
      "/downloads/Precision-Heat-Tryouts-Mindset-Guide.pdf",
      {
        req: request,
      }
    );
    const registerUrl = getAbsoluteUrl("/#tryouts", { req: request });

    // Send email with PDF download link using Postmark
    try {
      const emailResult = await sendPostmarkEmail({
        to: email,
        subject: `${firstName}, Your Free Tryout Mindset Guide is Here!`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Free Tryout Guide</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #010101 0%, #000000 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">🔥🏀 Tryout Mindset Guide by Precision Heat</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Lock-in for Tryouts season. No matter where you try out.</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 4px 4px; border: 1px solid #f8fafc;">
          <h2 style="color: #e80707; margin-top: 0;">Hi ${firstName}! 👋</h2>
          
          <p>Downloading this guide is a step towards getting on the roster for your next team. This guide contains tips and cheatcodes that get you in the right mindset to get noticed by coaches (for the right reasons).</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e80707;">
            <h3 style="margin-top: 0; color: #e80707;">📋 What's Inside:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>9 ways to stay present and locked in</li>
              <li>9 tips on playing smart, hustle, and helping.</li>
              <li>8 tips on being respectful on and off the court.</li>
              <li>8 tips for your Grown-Ups. They need to know this too. </li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" 
               style="background: linear-gradient(135deg, #e80707 0%, #D8202B 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">
              Download Your Free Guide
            </a>
          </div>
          
          <div style="background: #000000; border: 1px solid #000000; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: white;">Looking for a competitive team? Precision Heat Tryouts are Open.</h4>
            <p style="margin: 0; color: white;">Secure your spot before we fill up.</p>
            <a href="${registerUrl}" style="color: #e80707; font-weight: bold;">Register for Tryouts →</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #64748b;">
            Questions? Reply to this email or contact us at <a href="mailto:GM@precisionheat.team" style="color: #3b82f6;">GM@precisionheat.team</a>
          </p>
          
          <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">
            You're receiving this because you requested our free Tryout Guide from ${getAbsoluteUrl(
              "/",
              { req: request }
            ).replace(/^https?:\/\//, "")}. 
            If you no longer wish to receive emails, just reply to this email and let us know.
          </p>
        </div>
      </body>
      </html>
    `,
        text: `Hi ${firstName}!

Downloading this guide is a step towards getting on the roster for your next team. This guide contains tips and cheatcodes that get you in the right mindset to get noticed by coaches (for the right reasons).

What's Inside:
- 9 ways to stay present and locked in
- 9 tips on playing smart, hustle, and helping.
- 8 tips on being respectful on and off the court.
- 8 tips for your Grown-Ups. They need to know this too. 

Download your guide: ${downloadUrl}

Looking for a competitive team? Precision Heat Tryouts are Open. Secure your spot before we fill up.
Register for Tryouts: ${registerUrl}

Questions? Contact us at GM@precisionheat.team

You're receiving this because you requested our free Tryout Guide from ${getAbsoluteUrl(
          "/",
          { req: request }
        ).replace(/^https?:\/\//, "")}.`,
      });

      console.log("Email sent successfully:", emailResult.MessageID);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: "Lead created and email sent successfully",
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
