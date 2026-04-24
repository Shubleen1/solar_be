const nodemailer = require('nodemailer');

// Reusable email sender
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // This must be a Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"SolarRefer" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    // Don't crash the server if email fails — just log it
    console.error('❌ Email error:', err.message);
  }
};

// ── Email Templates ──────────────────────────────────────────

// Sent to new user after registration
const welcomeEmail = (name, referralCode, frontendUrl) => ({
  subject: '☀️ Your Solar Referral Code is Ready!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #f59e0b;">☀️ Welcome to SolarRefer, ${name}!</h2>
      <p>Your unique referral code is:</p>
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center;">
        <h1 style="color: #d97706; letter-spacing: 4px; margin: 0;">${referralCode}</h1>
      </div>
      <p>Share this code with anyone who wants to install solar panels at their home or business.</p>
      <p>When they submit an inquiry using your code and the project gets installed — <strong>you earn commission!</strong></p>
      <a href="${frontendUrl}/dashboard" style="background: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">
        View My Dashboard
      </a>
      <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
        Need help? Reply to this email anytime.
      </p>
    </div>
  `,
});

// Sent to referrer when someone uses their code
const newLeadEmail = (referrerName, customerName, customerCity) => ({
  subject: `🎉 Someone used your referral code!`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #10b981;">🎉 Great news, ${referrerName}!</h2>
      <p><strong>${customerName}</strong> from <strong>${customerCity}</strong> just submitted a solar inquiry using your referral code.</p>
      <p>Our team will contact them within 24 hours. If the project gets installed — <strong>you earn commission!</strong></p>
      <p style="color: #6b7280;">Track your leads and earnings in your dashboard.</p>
    </div>
  `,
});

// Sent when commission is approved/paid
const commissionEmail = (name, amount, status) => ({
  subject: `💰 Commission ${status === 'paid' ? 'Paid!' : 'Approved!'}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #10b981;">💰 Commission ${status === 'paid' ? 'Paid' : 'Approved'}, ${name}!</h2>
      <p>Your commission of <strong>₹${amount.toLocaleString()}</strong> has been <strong>${status}</strong>.</p>
      ${status === 'paid' ? '<p>The amount has been transferred to your account.</p>' : '<p>Payment will be processed soon.</p>'}
    </div>
  `,
});

module.exports = { sendEmail, welcomeEmail, newLeadEmail, commissionEmail };
