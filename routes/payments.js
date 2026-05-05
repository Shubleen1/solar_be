// routes/payments.js  (or wherever your Express routes live)
// Install: npm install nodemailer
const Payment = require("../models/Payment");
const express  = require("express");
// payments route — already correct, no changes needed here
const nodemailer = require("nodemailer");
const router   = express.Router();

/**
 * POST /api/payments/send-invoice-email
 * Body: { to, customerName, invoiceNo, amount, gstRate, note, pdfBase64 }
 */
router.post("/create", async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("customerId")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/send-invoice-email", async (req, res) => {
  const { to, customerName, invoiceNo, amount, gstRate = 8.9, note, pdfBase64 } = req.body;

  if (!to || !pdfBase64) {
    return res.status(400).json({ error: "Missing required fields: to, pdfBase64" });
  }

  // Configure your SMTP transport
  // Use environment variables — never hard-code credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",   // or your SMTP provider
    auth: {
      user: process.env.MAIL_USER,   // e.g. ratandeeptraders1@gmail.com
      pass: process.env.MAIL_PASS,   // App password (not your Google password)
    },
  });

  const gstAmount  = Math.round(amount * (gstRate / 100));
  const grandTotal = amount + gstAmount;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1e293b;">
      <div style="background:#0f172a;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;">Ratandeep Traders</h1>
        <p style="color:#e8920a;margin:4px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Solar Energy Solutions</p>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;padding:28px 32px;border-radius:0 0 12px 12px;">
        <p style="font-size:15px;">Dear <strong>${customerName}</strong>,</p>
        <p style="color:#475569;font-size:14px;line-height:1.6;">
          Please find your invoice <strong>#${invoiceNo}</strong> attached to this email.
        </p>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:20px 0;">
          <table style="width:100%;font-size:13px;border-collapse:collapse;">
            <tr>
              <td style="color:#64748b;padding:4px 0;">Invoice No.</td>
              <td style="text-align:right;font-weight:600;">#${invoiceNo}</td>
            </tr>
            <tr>
              <td style="color:#64748b;padding:4px 0;">Subtotal</td>
              <td style="text-align:right;font-weight:600;">₹${amount.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="color:#64748b;padding:4px 0;">GST (${gstRate}%)</td>
              <td style="text-align:right;font-weight:600;">₹${gstAmount.toLocaleString("en-IN")}</td>
            </tr>
            <tr style="border-top:1px solid #e2e8f0;">
              <td style="padding:8px 0 4px;font-weight:700;font-size:14px;">Total Due</td>
              <td style="text-align:right;font-weight:700;font-size:14px;color:#e8920a;">₹${grandTotal.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>

        ${note ? `<p style="color:#475569;font-size:13px;font-style:italic;">${note}</p>` : ""}

        <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
          For any queries, contact us at
          <a href="mailto:ratandeeptraders1@gmail.com" style="color:#e8920a;">ratandeeptraders1@gmail.com</a>
          or call <strong>98131-16005</strong>.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from:        `"Ratandeep Traders" <${process.env.MAIL_USER}>`,
    to,
    subject:     `Invoice #${invoiceNo} — Ratandeep Traders`,
    html,
    attachments: [{
      filename:    `Invoice-${invoiceNo}.pdf`,
      content:     pdfBase64,
      encoding:    "base64",
      contentType: "application/pdf",
    }],
  });

  res.json({ success: true, message: `Invoice sent to ${to}` });
});

module.exports = router;