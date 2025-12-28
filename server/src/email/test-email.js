import nodemailer from "nodemailer";

console.log("Testing Gmail email configuration...");

// 🔴 REPLACE THESE
const GMAIL_USER = "yourgmail@gmail.com";
const GMAIL_APP_PASSWORD = "your_16_char_app_password";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

// Verify SMTP
console.log("\nTesting SMTP connection...");
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error);
    return;
  }

  console.log("✅ SMTP Server is ready");

  const mailOptions = {
    from: `Secure Bridge <${GMAIL_USER}>`,
    to: iamchandanjainhp@gmail.com, // send to yourself
    subject: "Test Email from Secure Bridge",
    html: `
      <h1>Test Email</h1>
      <p>If you received this email, Nodemailer is working correctly.</p>
    `,
  };

  console.log("\nSending test email...");

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Email Send Error:", error);
    } else {
      console.log("✅ Email sent successfully!");
      console.log("Message ID:", info.messageId);
      console.log("Response:", info.response);
    }
  });
});
