/**
 * Email templates for OTP verification system
 */

const generateWelcomeEmail = (user, otpCode) => {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-otp?email=${encodeURIComponent(user.email)}&code=${otpCode}`;
  
  return {
    subject: "Welcome to BidSense - Verify Your Email",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to BidSense</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #FFFFE3;
            color: #6D8196;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: #FFFFE3;
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid #CBCBCB;
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: #4A4A4A;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #4A4A4A;
            margin-bottom: 5px;
        }
        .subtitle {
            font-size: 16px;
            color: #6D8196;
            margin-bottom: 20px;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
            color: #4A4A4A;
        }
        .otp-container {
            background: #6D8196;
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 25px 0;
        }
        .otp-title {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            color: #FFFFE3;
        }
        .otp-code {
            font-size: 48px;
            font-weight: 700;
            font-family: 'Courier New', monospace;
            letter-spacing: 8px;
            line-height: 1;
        }
        .otp-note {
            font-size: 12px;
            margin-top: 10px;
            color: #FFFFE3;
            opacity: 0.8;
        }
        .button {
            display: inline-block;
            background: #6D8196;
            color: white;
            padding: 14px 32px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: background 0.3s ease;
        }
        .button:hover {
            background: #5A6B7F;
            text-decoration: none;
            color: white;
        }
        .alternative {
            font-size: 14px;
            color: #6D8196;
            margin-top: 15px;
            text-align: center;
        }
        .footer {
            background: #F8F9FA;
            padding: 20px 30px;
            border-top: 1px solid #CBCBCB;
            font-size: 12px;
            color: #6D8196;
            text-align: center;
        }
        .footer-links {
            margin-top: 10px;
        }
        .footer-links a {
            color: #6D8196;
            text-decoration: none;
            margin: 0 10px;
        }
        .footer-links a:hover {
            text-decoration: underline;
        }
        .divider {
            height: 1px;
            background: #CBCBCB;
            margin: 20px 0;
            opacity: 0.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">BidSense</div>
            <div class="title">Welcome to BidSense!</div>
            <div class="subtitle">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hi ${user.name},
            </div>
            
            <div style="font-size: 16px; line-height: 1.6; color: #4A4A4A; margin-bottom: 25px;">
                Thank you for signing up! To complete your registration and start creating RFPs, please verify your email address.
            </div>
            
            <div class="otp-container">
                <div class="otp-title">Your verification code is:</div>
                <div class="otp-code">${otpCode}</div>
                <div class="otp-note">This code expires in 10 minutes.</div>
            </div>
            
            <div style="text-align: center;">
                <a href="${verifyLink}" class="button">Verify My Email</a>
            </div>
            
            <div class="alternative">
                Or copy and paste this link:<br>
                <a href="${verifyLink}" style="color: #6D8196; word-break: break-all;">${verifyLink}</a>
            </div>
            
            <div class="divider"></div>
            
            <div style="font-size: 14px; color: #6D8196; margin-bottom: 15px;">
                Didn't sign up for BidSense?<br>
                You can safely ignore this email.
            </div>
            
            <div style="font-size: 14px; color: #6D8196;">
                Need help? Contact us at<br>
                <a href="mailto:support@bidsense.com" style="color: #6D8196; text-decoration: none;">support@bidsense.com</a>
            </div>
        </div>
        
        <div class="footer">
            <div class="divider"></div>
            <div>© ${new Date().getFullYear()} BidSense. All rights reserved.</div>
            <div class="footer-links">
                <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a>
                <a href="${process.env.FRONTEND_URL}/terms">Terms of Service</a>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    text: `
Welcome to BidSense!

Hi ${user.name},

Thank you for signing up! To complete your registration and start creating RFPs, please verify your email address.

Your verification code is: ${otpCode}

This code expires in 10 minutes.

Verify your email: ${verifyLink}

Or copy and paste this link: ${verifyLink}

If you didn't sign up for BidSense, you can safely ignore this email.

Need help? Contact us at support@bidsense.com

Best regards,
The BidSense Team

© ${new Date().getFullYear()} BidSense. All rights reserved.
    `
  };
};

const generateResendEmail = (user, otpCode) => {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-otp?email=${encodeURIComponent(user.email)}&code=${otpCode}`;
  
  return {
    subject: "Your New BidSense Verification Code",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Verification Code</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #FFFFE3;
            color: #6D8196;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: #FFFFE3;
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid #CBCBCB;
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: #4A4A4A;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #4A4A4A;
            margin-bottom: 5px;
        }
        .subtitle {
            font-size: 16px;
            color: #6D8196;
            margin-bottom: 20px;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
            color: #4A4A4A;
        }
        .otp-container {
            background: #6D8196;
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 25px 0;
        }
        .otp-title {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            color: #FFFFE3;
        }
        .otp-code {
            font-size: 48px;
            font-weight: 700;
            font-family: 'Courier New', monospace;
            letter-spacing: 8px;
            line-height: 1;
        }
        .otp-note {
            font-size: 12px;
            margin-top: 10px;
            color: #FFFFE3;
            opacity: 0.8;
        }
        .warning {
            background: #FFF3CD;
            border: 1px solid #FFEAA7;
            color: #856404;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: #6D8196;
            color: white;
            padding: 14px 32px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: background 0.3s ease;
        }
        .button:hover {
            background: #5A6B7F;
            text-decoration: none;
            color: white;
        }
        .footer {
            background: #F8F9FA;
            padding: 20px 30px;
            border-top: 1px solid #CBCBCB;
            font-size: 12px;
            color: #6D8196;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">BidSense</div>
            <div class="title">New Verification Code</div>
            <div class="subtitle">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hi ${user.name},
            </div>
            
            <div style="font-size: 16px; line-height: 1.6; color: #4A4A4A; margin-bottom: 25px;">
                You requested a new verification code. Here it is:
            </div>
            
            <div class="otp-container">
                <div class="otp-title">Your verification code is:</div>
                <div class="otp-code">${otpCode}</div>
                <div class="otp-note">This code expires in 10 minutes. Previous code has been invalidated.</div>
            </div>
            
            <div style="text-align: center;">
                <a href="${verifyLink}" class="button">Verify My Email</a>
            </div>
            
            <div class="warning">
                <strong>If you didn't request this,</strong> please contact support immediately at support@bidsense.com
            </div>
            
            <div style="font-size: 14px; color: #6D8196;">
                Need help? Contact us at<br>
                <a href="mailto:support@bidsense.com" style="color: #6D8196; text-decoration: none;">support@bidsense.com</a>
            </div>
        </div>
        
        <div class="footer">
            <div>© ${new Date().getFullYear()} BidSense. All rights reserved.</div>
        </div>
    </div>
</body>
</html>
    `,
    text: `
New Verification Code

Hi ${user.name},

You requested a new verification code. Here it is:

Your verification code is: ${otpCode}

This code expires in 10 minutes. Previous code has been invalidated.

Verify your email: ${verifyLink}

If you didn't request this, please contact support immediately at support@bidsense.com

Need help? Contact us at support@bidsense.com

Best regards,
The BidSense Team

© ${new Date().getFullYear()} BidSense. All rights reserved.
    `
  };
};

const generateWelcomeConfirmationEmail = (user) => {
  return {
    subject: "Welcome to BidSense - Let's Get Started!",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to BidSense!</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #FFFFE3;
            color: #6D8196;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: #FFFFE3;
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid #CBCBCB;
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: #4A4A4A;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #4A4A4A;
            margin-bottom: 5px;
        }
        .subtitle {
            font-size: 16px;
            color: #6D8196;
            margin-bottom: 20px;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
            color: #4A4A4A;
        }
        .success-box {
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            color: #166534;
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
            text-align: center;
        }
        .success-icon {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .features {
            background: #F8FAFC;
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
        }
        .features h3 {
            margin: 0 0 15px 0;
            color: #4A4A4A;
            font-size: 18px;
        }
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .feature-list li {
            padding: 8px 0;
            border-bottom: 1px solid #E2E8F0;
            font-size: 14px;
        }
        .feature-list li:last-child {
            border-bottom: none;
        }
        .feature-list li:before {
            content: "✓";
            color: #10B981;
            font-weight: bold;
            margin-right: 10px;
        }
        .button {
            display: inline-block;
            background: #6D8196;
            color: white;
            padding: 14px 32px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: background 0.3s ease;
        }
        .button:hover {
            background: #5A6B7F;
            text-decoration: none;
            color: white;
        }
        .guide-link {
            color: #6D8196;
            text-decoration: none;
            font-size: 14px;
            display: inline-block;
            margin-top: 10px;
        }
        .footer {
            background: #F8F9FA;
            padding: 20px 30px;
            border-top: 1px solid #CBCBCB;
            font-size: 12px;
            color: #6D8196;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">BidSense</div>
            <div class="title">🎉 You're All Set!</div>
            <div class="subtitle">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hi ${user.name},
            </div>
            
            <div class="success-box">
                <div class="success-icon">🎉</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 5px;">Your email has been verified!</div>
                <div>Your BidSense account is ready!</div>
            </div>
            
            <div style="font-size: 16px; line-height: 1.6; color: #4A4A4A; margin-bottom: 25px;">
                Your email has been verified and your BidSense account is ready!
            </div>
            
            <div style="font-size: 16px; color: #4A4A4A; margin-bottom: 15px;">
                Here's what you can do now:
            </div>
            
            <div class="features">
                <h3>Quick Start Guide:</h3>
                <ul class="feature-list">
                    <li>Complete your profile</li>
                    <li>Add your company information</li>
                    <li>Create your first RFP</li>
                    <li>Invite team members</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/quick-start" class="guide-link">View Quick Start Guide</a>
            </div>
            
            <div style="font-size: 14px; color: #6D8196; margin-top: 20px;">
                Need help getting started?<br>
                Check our documentation or contact<br>
                <a href="mailto:support@bidsense.com" style="color: #6D8196; text-decoration: none;">support@bidsense.com</a>
            </div>
        </div>
        
        <div class="footer">
            <div>© ${new Date().getFullYear()} BidSense. All rights reserved.</div>
        </div>
    </div>
</body>
</html>
    `,
    text: `
Welcome to BidSense!

Hi ${user.name},

🎉 Your email has been verified and your BidSense account is ready!

Here's what you can do now:

✓ Complete your profile
✓ Add your company information  
✓ Create your first RFP
✓ Invite team members

Go to Dashboard: ${process.env.FRONTEND_URL}/dashboard

View Quick Start Guide: ${process.env.FRONTEND_URL}/quick-start

Need help getting started?
Check our documentation or contact support@bidsense.com

Best regards,
The BidSense Team

© ${new Date().getFullYear()} BidSense. All rights reserved.
    `
  };
};

export {
  generateWelcomeEmail,
  generateResendEmail,
  generateWelcomeConfirmationEmail
};