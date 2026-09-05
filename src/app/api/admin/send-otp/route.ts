import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminOtpStore } from '@/lib/adminOtpStore';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetEmail = body.email || process.env.ADMIN_EMAIL || '221fa04049@gmail.com';

    // Generate secure 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    adminOtpStore.set(targetEmail.toLowerCase(), { code: otpCode, expiresAt });

    const subject = `[Security Alert] Your Admin Verification OTP Code: ${otpCode}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 0; color: #38bdf8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; }
          .otp-card { background: #f0f9ff; border: 2px dashed #0284c7; padding: 20px; text-align: center; border-radius: 16px; margin: 24px 0; }
          .otp-code { font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0369a1; }
          .content { padding: 28px 24px; }
          .warning-box { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 14px; color: #9f1239; font-size: 13px; font-weight: 600; margin-top: 20px; }
          .footer { background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <p>Vignan University · Admin Portal</p>
            <h1>Security Action Authorization</h1>
          </div>
          <div class="content">
            <h2 style="font-size: 15px; margin-top: 0; color: #334155;">Hello Admin (${targetEmail}),</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              An OTP verification was requested to authorize administrative privileges (Adding Events, Viewing Event Reports, or Downloading Export Reports).
            </p>
            <div class="otp-card">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #0284c7; margin-bottom: 6px;">Your 6-Digit Authorization OTP</div>
              <div class="otp-code">${otpCode}</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Valid for 5 minutes</div>
            </div>
            <div class="warning-box">
              ⚠️ Do not share this OTP code with anyone. System administrators will never ask for your verification code.
            </div>
          </div>
          <div class="footer">
            <p>Application Development Hub · Security Authorization System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    let emailSent = false;
    let messageId: string | undefined;

    try {
      const emailResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: targetEmail,
        subject,
        html: htmlContent,
      });

      if (emailResult.data?.id) {
        emailSent = true;
        messageId = emailResult.data.id;
      }
    } catch (err: any) {
      console.error('Resend SDK OTP dispatch error:', err);
    }

    console.log(`[ADMIN OTP DISPATCH] Sent OTP: ${otpCode} to ${targetEmail} (Email Sent: ${emailSent})`);

    return NextResponse.json({
      success: true,
      email: targetEmail,
      emailSent,
      messageId,
      message: `OTP code dispatched to ${targetEmail}`,
      devCode: otpCode,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
