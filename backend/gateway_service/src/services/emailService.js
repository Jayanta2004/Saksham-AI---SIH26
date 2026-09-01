import axios from 'axios';
import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
      if (!this.transporter) {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        });
        console.log(`[EmailService] Configured live SMTP transport with ${host}:${port} (${user})`);
      }
      return this.transporter;
    }
    return null;
  }

  async sendPasswordResetOtp(toEmail, otp, recipientName = 'Learner') {
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">SAKSHAM AI</h2>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Ministry of Statistics & Programme Implementation</p>
        </div>
        
        <div style="padding: 32px 24px; color: #1e293b;">
          <p style="font-size: 15px; margin-top: 0; font-weight: 600;">Namaste <strong>${recipientName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            We received a request to reset your password for your account on the <strong>Saksham AI Skill Intelligence & Learning Platform</strong>.
          </p>
          
          <div style="text-align: center; margin: 28px 0;">
            <div style="display: inline-block; background-color: #f0fdf4; border: 2px dashed #16a34a; border-radius: 12px; padding: 18px 40px;">
              <span style="font-size: 12px; color: #15803d; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; display: block; margin-bottom: 6px;">Your 6-Digit Verification Code</span>
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #166534; font-family: 'Courier New', monospace;">${otp}</span>
            </div>
          </div>
          
          <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
            This verification code is valid for <strong>15 minutes</strong>. If you did not initiate this request, you can safely ignore this email.
          </p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          Smart India Hackathon 2026 • Official Statistical System Intelligence Platform<br>
          Government of India • Ministry of Statistics & Programme Implementation (MoSPI)
        </div>
      </div>
    `;

    // 1. Try Live Gmail SMTP Transporter (Highest priority: Sends to ANY email recipient globally)
    const transporter = this.getTransporter();
    if (transporter) {
      try {
        const fromAddr = process.env.SMTP_FROM || `"Saksham AI — MoSPI" <${process.env.SMTP_USER}>`;
        const info = await transporter.sendMail({
          from: fromAddr,
          to: toEmail,
          subject: `Saksham AI — Password Reset Verification Code: ${otp}`,
          html: htmlContent
        });
        console.log(`[EmailService] OTP email dispatched via SMTP to ${toEmail}. Message ID: ${info.messageId}`);
        return { success: true, liveDispatched: true, provider: 'smtp', messageId: info.messageId };
      } catch (smtpErr) {
        console.error('[EmailService] SMTP error:', smtpErr.message);
      }
    }

    // 2. Fallback to Resend API if key is set
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey.startsWith('re_')) {
      try {
        const response = await axios.post(
          'https://api.resend.com/emails',
          {
            from: 'Saksham AI <onboarding@resend.dev>',
            to: [toEmail],
            subject: `Saksham AI — Password Reset Verification Code: ${otp}`,
            html: htmlContent
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );

        console.log(`[EmailService] OTP email dispatched via Resend to ${toEmail}. Resend ID: ${response.data?.id}`);
        return { success: true, liveDispatched: true, provider: 'resend', id: response.data?.id };
      } catch (resendErr) {
        console.error('[EmailService] Resend API dispatch error:', resendErr?.response?.data || resendErr.message);
      }
    }

    console.log(`[EmailService] Simulated email to ${toEmail} with OTP: ${otp}`);
    return { success: true, liveDispatched: false, demoOtp: otp };
  }
}

export const emailService = new EmailService();
