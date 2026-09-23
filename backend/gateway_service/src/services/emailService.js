import axios from 'axios';
import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.isPrewarmed = false;
  }

  logEmailConfigStatus() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const resend = process.env.RESEND_API_KEY;
    const brevo = process.env.BREVO_API_KEY;

    if (user && pass) {
      console.log(`[EmailService] SMTP configured: ${user} (Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'})`);
    } else {
      console.warn('[EmailService] ⚠️ SMTP_USER or SMTP_PASS not set in environment variables.');
    }

    if (resend) {
      console.log('[EmailService] Resend API Key configured (HTTPS port 443 fallback active).');
    }
    if (brevo) {
      console.log('[EmailService] Brevo API Key configured (HTTPS port 443 fallback active).');
    }

    if (!user && !resend && !brevo) {
      console.warn('[EmailService] 🚨 CRITICAL: No live email dispatch credentials configured! In your cloud dashboard (Render/Railway), add SMTP_USER/SMTP_PASS, RESEND_API_KEY, or BREVO_API_KEY.');
    }
  }

  getTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
      if (!this.transporter) {
        const isGmail = host.includes('gmail.com');
        const transportConfig = isGmail
          ? {
              service: 'gmail',
              pool: true,
              maxConnections: 5,
              maxMessages: 100,
              rateLimit: 10,
              connectionTimeout: 5000, // 5s timeout if cloud provider blocks SMTP
              greetingTimeout: 5000,
              socketTimeout: 8000,
              auth: { user, pass }
            }
          : {
              host,
              port,
              secure: port === 465,
              pool: true,
              maxConnections: 5,
              connectionTimeout: 5000,
              greetingTimeout: 5000,
              socketTimeout: 8000,
              auth: { user, pass }
            };

        this.transporter = nodemailer.createTransport(transportConfig);
        console.log(`[EmailService] Configured live SMTP transport with ${isGmail ? 'Gmail Service' : `${host}:${port}`} (${user})`);

        if (!this.isPrewarmed) {
          this.isPrewarmed = true;
          this.transporter.verify().then(() => {
            console.log('[EmailService] SMTP transporter pre-warmed and ready.');
          }).catch(err => {
            console.warn('[EmailService] SMTP pre-warm warning (likely outbound port blocked by cloud host):', err.message);
          });
        }
      }
      return this.transporter;
    }
    return null;
  }

  async sendPasswordResetOtp(toEmail, otp, recipientName = 'Learner') {
    const safeName = (recipientName && typeof recipientName === 'string' && recipientName.trim())
      ? recipientName.trim()
      : 'Learner';

    const subject = `[Saksham AI] ${otp} is your verification code`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Saksham AI - Password Reset Code</title>
      </head>
      <body style="margin: 0; padding: 20px 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <!-- Preheader preview text for inbox and push notifications -->
        <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
          Your 6-digit verification code is ${otp}. Valid for 15 minutes. Do not share this code with anyone.
        </div>
        
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.85; margin-bottom: 6px; font-weight: 600;">Government of India • MoSPI</div>
            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">SAKSHAM AI</h1>
            <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">National Skill Intelligence & Learning Platform</p>
          </div>
          
          <!-- Content Body -->
          <div style="padding: 36px 28px; color: #1e293b;">
            <p style="font-size: 16px; margin-top: 0; font-weight: 600; color: #0f172a;">Namaste ${safeName},</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
              We received a request to reset your password for your account on the <strong>Saksham AI Platform</strong>. Use the verification code below to complete your password reset:
            </p>
            
            <!-- OTP Box -->
            <div style="text-align: center; margin: 28px 0; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 24px 16px;">
              <span style="font-size: 11px; color: #475569; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; display: block; margin-bottom: 8px;">6-Digit Verification Code</span>
              <div style="display: inline-block; background-color: #ffffff; border: 2px solid #2563eb; border-radius: 10px; padding: 12px 28px; box-shadow: 0 2px 4px rgba(37,99,235,0.08);">
                <span style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #1e3a8a; font-family: 'Courier New', Consolas, monospace;">${otp}</span>
              </div>
              <p style="font-size: 12px; color: #64748b; margin: 12px 0 0 0; font-weight: 500;">
                ⏱️ Code expires in <strong>15 minutes</strong>
              </p>
            </div>
            
            <!-- Security Warning -->
            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; margin: 24px 0;">
              <p style="font-size: 12px; color: #92400e; margin: 0; line-height: 1.5;">
                <strong>Security Reminder:</strong> Never share this verification code with anyone. Saksham AI and MoSPI administrators will never ask for your password or OTP.
              </p>
            </div>

            <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 0;">
              If you did not request a password reset, you can safely disregard this email. Your existing credentials remain secure.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.6;">
            <strong>Saksham AI</strong> • National Skill Intelligence & Learning Platform<br>
            Ministry of Statistics & Programme Implementation (MoSPI), Government of India<br>
            <span style="font-size: 11px; opacity: 0.8;">This is an automated system notification. Please do not reply directly to this email.</span>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `Namaste ${safeName},

Your verification code for Saksham AI is: ${otp}

This 6-digit code is valid for 15 minutes. Use it on the password reset page to complete your request.

SECURITY NOTICE: Never share this verification code with anyone. Saksham AI and MoSPI officials will never ask for your OTP.

If you did not request this password reset, please ignore this email.

---
Saksham AI • National Skill Intelligence & Learning Platform
Ministry of Statistics & Programme Implementation (MoSPI), Government of India`;

    // 1. Try Live Gmail SMTP Transporter (Highest priority: Sends to ANY email recipient globally)
    const transporter = this.getTransporter();
    if (transporter) {
      try {
        const fromAddr = process.env.SMTP_FROM || `"Saksham AI — MoSPI" <${process.env.SMTP_USER}>`;
        const info = await transporter.sendMail({
          from: fromAddr,
          to: toEmail,
          subject,
          text: textContent,
          html: htmlContent
        });
        console.log(`[EmailService] OTP email dispatched via SMTP to ${toEmail}. Message ID: ${info.messageId}`);
        return { success: true, liveDispatched: true, provider: 'smtp', messageId: info.messageId };
      } catch (smtpErr) {
        console.error('[EmailService] SMTP error:', smtpErr.message);
      }
    }

    // 2. Try Brevo REST API first if configured (HTTPS port 443 - free 300/day to ANY recipient globally without domain verification)
    const brevoKey = process.env.BREVO_API_KEY;
    if (brevoKey) {
      try {
        const senderEmail = process.env.BREVO_FROM_EMAIL || process.env.SMTP_USER || 'webbyashu21@gmail.com';
        const response = await axios.post(
          'https://api.brevo.com/v3/smtp/email',
          {
            sender: { name: 'Saksham AI - MoSPI', email: senderEmail },
            to: [{ email: toEmail, name: safeName }],
            subject,
            htmlContent,
            textContent
          },
          {
            headers: {
              'api-key': brevoKey,
              'Content-Type': 'application/json'
            },
            timeout: 8000
          }
        );

        console.log(`[EmailService] OTP email dispatched via Brevo API to ${toEmail}. Message ID: ${response.data?.messageId}`);
        return { success: true, liveDispatched: true, provider: 'brevo', messageId: response.data?.messageId };
      } catch (brevoErr) {
        console.error('[EmailService] Brevo API dispatch error:', brevoErr?.response?.data || brevoErr.message);
      }
    }

    // 3. Try Resend API (HTTPS port 443 - note: onboarding@resend.dev sandbox only allows sending to your own registered email until a domain is verified at resend.com/domains)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey.startsWith('re_')) {
      try {
        const fromAddr = process.env.RESEND_FROM || 'Saksham AI <onboarding@resend.dev>';
        const response = await axios.post(
          'https://api.resend.com/emails',
          {
            from: fromAddr,
            to: [toEmail],
            subject,
            text: textContent,
            html: htmlContent
          },
          {
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 8000
          }
        );

        console.log(`[EmailService] OTP email dispatched via Resend API to ${toEmail}. Resend ID: ${response.data?.id}`);
        return { success: true, liveDispatched: true, provider: 'resend', id: response.data?.id };
      } catch (resendErr) {
        const errMsg = resendErr?.response?.data?.message || resendErr.message;
        console.error('[EmailService] Resend API error:', errMsg);
        if (errMsg?.includes('only send testing emails to your own email address')) {
          console.warn('[EmailService] ⚠️ Resend Sandbox Restriction: onboarding@resend.dev can only send to your own registered Resend email. To send to other users, either: 1) Verify a custom domain at resend.com/domains, or 2) Add BREVO_API_KEY in Render dashboard (Brevo sends to any email for free).');
        }
      }
    }

    console.warn(`[EmailService] ⚠️ Live email could not be dispatched to ${toEmail}. Check cloud environment variables (SMTP_USER/SMTP_PASS, RESEND_API_KEY, or BREVO_API_KEY). Simulated OTP: ${otp}`);
    return { success: true, liveDispatched: false, demoOtp: otp };
  }
}

export const emailService = new EmailService();
