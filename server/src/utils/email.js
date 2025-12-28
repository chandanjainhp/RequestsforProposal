import nodemailer from 'nodemailer';
import logger from './logger.js';

/**
 * Email Configuration
 * Support for Gmail OAuth2 or standard SMTP
 */

// Create transporter based on environment
const createTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  
  if (emailService === 'gmail' && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    // Gmail with App Password
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  } else if (emailService === 'ethereal') {
    // Ethereal (test email service)
    return nodemailer.createTransport({
      host: process.env.ETHEREAL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.ETHEREAL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });
  } else {
    // Generic SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
};

const transporter = createTransporter();

/**
 * Email Templates
 */

const templates = {
  rfpRequest: (vendorName, rfpTitle, rfpDetails, senderName, senderEmail) => ({
    subject: `Request for Proposal (RFP): ${rfpTitle}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6; 
              color: #333; 
              background-color: #f5f5f5;
            }
            .email-container { 
              max-width: 650px; 
              margin: 0 auto; 
              background-color: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 { font-size: 28px; margin-bottom: 5px; }
            .header p { font-size: 14px; opacity: 0.9; }
            .body { padding: 30px 20px; }
            .section { margin-bottom: 25px; }
            .section h2 { 
              color: #667eea; 
              font-size: 18px; 
              margin-bottom: 12px;
              border-bottom: 2px solid #667eea;
              padding-bottom: 8px;
            }
            .section p { margin-bottom: 10px; }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              background-color: #f9f9f9;
            }
            .details-table th {
              background-color: #667eea;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 600;
            }
            .details-table td {
              padding: 12px;
              border-bottom: 1px solid #eee;
            }
            .details-table tr:last-child td {
              border-bottom: none;
            }
            .line-items {
              background-color: #f0f4ff;
              border-left: 4px solid #667eea;
              padding: 15px;
              margin: 10px 0;
              border-radius: 4px;
            }
            .line-item {
              padding: 8px 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .highlight-box {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .highlight-box strong { color: #ff8c00; }
            .contact-section {
              background-color: #e8f4f8;
              border-left: 4px solid #0284c7;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .contact-section a {
              color: #0284c7;
              text-decoration: none;
              font-weight: 600;
            }
            .instructions {
              background-color: #f0f9ff;
              padding: 15px;
              border-radius: 4px;
              margin: 15px 0;
            }
            .instructions ol {
              margin-left: 20px;
              margin-top: 10px;
            }
            .instructions li {
              margin-bottom: 8px;
              line-height: 1.6;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            .footer-separator { 
              border-top: 1px solid #ddd;
              margin: 20px 0;
            }
            .cta-button {
              display: inline-block;
              background-color: #667eea;
              color: white;
              padding: 12px 24px;
              border-radius: 4px;
              text-decoration: none;
              margin: 15px 0;
              font-weight: 600;
            }
            .cta-button:hover {
              background-color: #5a67d8;
            }
            .badge {
              display: inline-block;
              background-color: #667eea;
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <h1>📋 Request for Proposal</h1>
              <p>${rfpTitle}</p>
            </div>

            <!-- Body -->
            <div class="body">
              <p>Dear <strong>${vendorName}</strong>,</p>

              <p style="margin-top: 15px; margin-bottom: 15px;">
                We are pleased to invite you to submit a proposal for the following procurement opportunity. 
                We believe your organization's capabilities align well with our requirements.
              </p>

              <!-- RFP Overview -->
              <div class="section">
                <h2>📌 RFP Overview</h2>
                <p><strong>Title:</strong> ${rfpTitle}</p>
                <p><strong>Description:</strong></p>
                <p style="margin-top: 8px; padding: 12px; background-color: #f9f9f9; border-radius: 4px;">
                  ${rfpDetails.description || rfpDetails.summary || 'N/A'}
                </p>
              </div>

              <!-- Key Details -->
              <div class="section">
                <h2>💼 Key Details</h2>
                <table class="details-table">
                  <thead>
                    <tr>
                      <th>Attribute</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Budget</strong></td>
                      <td>${rfpDetails.currency || 'USD'} ${rfpDetails.budget ? rfpDetails.budget.toLocaleString() : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Required Delivery</strong></td>
                      <td>${rfpDetails.delivery_days ? rfpDetails.delivery_days + ' days' : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Payment Terms</strong></td>
                      <td>${rfpDetails.payment_terms || 'Net 30'}</td>
                    </tr>
                    <tr>
                      <td><strong>Warranty Period</strong></td>
                      <td>${rfpDetails.warranty_months ? rfpDetails.warranty_months + ' months' : 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Line Items -->
              ${rfpDetails.line_items && rfpDetails.line_items.length > 0 ? `
              <div class="section">
                <h2>📦 Required Items</h2>
                <div class="line-items">
                  ${rfpDetails.line_items.map((item, idx) => `
                    <div class="line-item">
                      <span><strong>${idx + 1}. ${item.description || item.name || item}</strong></span>
                      ${item.quantity ? `<span class="badge">Qty: ${item.quantity}</span>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
              ` : ''}

              <!-- Requirements -->
              <div class="section">
                <h2>✓ Required Proposal Information</h2>
                <div class="instructions">
                  <p style="margin-bottom: 10px;"><strong>Please include the following in your proposal:</strong></p>
                  <ol>
                    <li><strong>Pricing:</strong> Complete itemized cost breakdown</li>
                    <li><strong>Timeline:</strong> Proposed delivery schedule</li>
                    <li><strong>Specifications:</strong> Detailed product/service specifications</li>
                    <li><strong>Company Details:</strong> Relevant experience and certifications</li>
                    <li><strong>References:</strong> At least 2-3 relevant client references</li>
                    <li><strong>Terms & Conditions:</strong> Your standard T&Cs and any exceptions</li>
                    <li><strong>Contact Information:</strong> Primary contact for this proposal</li>
                  </ol>
                </div>
              </div>

              <!-- Important Information -->
              <div class="highlight-box">
                <strong>⏰ Submission Deadline:</strong>
                <p style="margin-top: 8px;">
                  Please submit your complete proposal within <strong>7 business days</strong> of receiving this RFP.
                </p>
              </div>

              <!-- Contact Section -->
              <div class="contact-section">
                <strong>📧 How to Submit Your Proposal</strong>
                <p style="margin-top: 10px;">
                  Please reply to this email with your complete proposal or contact us directly:
                </p>
                <p style="margin-top: 8px;">
                  <strong>Contact Person:</strong> ${senderName}<br/>
                  <strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a><br/>
                </p>
              </div>

              <!-- Next Steps -->
              <div class="section">
                <h2>📅 Evaluation Process</h2>
                <ol style="margin-left: 20px;">
                  <li>Receipt and initial review of all proposals</li>
                  <li>Short-listing of qualified vendors</li>
                  <li>Clarification calls (if needed)</li>
                  <li>Final evaluation and selection</li>
                  <li>Contract negotiation with selected vendor</li>
                </ol>
              </div>

              <!-- Footer Section -->
              <div class="footer-separator"></div>
              <p style="font-size: 14px; margin-bottom: 10px;">
                Thank you for your interest in this opportunity. We look forward to reviewing your proposal 
                and potentially working with your organization.
              </p>
            </div>

            <!-- Email Footer -->
            <div class="footer">
              <p>This is an automated message from RFP Management System</p>
              <p>Please do not reply to this sender address. Use the contact information above for inquiries.</p>
              <p style="margin-top: 10px; opacity: 0.7;">
                © 2025 Procurement Department. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  proposalReceived: (vendorName, rfpTitle, proposalDetails, recipientEmail) => ({
    subject: `✓ Your Proposal Received - ${rfpTitle}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6; 
              color: #333; 
              background-color: #f5f5f5;
            }
            .email-container { 
              max-width: 650px; 
              margin: 0 auto; 
              background-color: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white; 
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 { font-size: 28px; margin-bottom: 5px; }
            .body { padding: 30px 20px; }
            .success-box {
              background-color: #d1fae5;
              border-left: 4px solid #10b981;
              padding: 20px;
              border-radius: 4px;
              margin-bottom: 20px;
            }
            .success-box h2 {
              color: #10b981;
              margin-bottom: 10px;
            }
            .details {
              background-color: #f0fdf4;
              padding: 15px;
              border-radius: 4px;
              margin: 15px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #dcfce7;
            }
            .detail-row strong { color: #10b981; }
            .timeline {
              background-color: #f0fdf4;
              padding: 20px;
              border-radius: 4px;
              margin: 20px 0;
            }
            .timeline ol {
              margin-left: 20px;
              margin-top: 10px;
            }
            .timeline li {
              margin-bottom: 10px;
              line-height: 1.6;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>✓ Proposal Received</h1>
              <p>Thank you for your submission</p>
            </div>

            <div class="body">
              <p>Dear <strong>${vendorName}</strong>,</p>

              <div class="success-box">
                <h2>Thank You for Your Proposal!</h2>
                <p>We have successfully received your proposal and it is now under review.</p>
              </div>

              <div class="section">
                <h2 style="color: #10b981; margin-bottom: 15px;">📋 Submission Details</h2>
                <div class="details">
                  <div class="detail-row">
                    <span><strong>RFP Title:</strong></span>
                    <span>${rfpTitle}</span>
                  </div>
                  <div class="detail-row">
                    <span><strong>Received Date:</strong></span>
                    <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div class="detail-row">
                    <span><strong>Received Time:</strong></span>
                    <span>${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                  <div class="detail-row" style="border-bottom: none;">
                    <span><strong>Status:</strong></span>
                    <span style="color: #10b981; font-weight: 600;">✓ Received and Processing</span>
                  </div>
                </div>
              </div>

              <div class="timeline">
                <h3 style="color: #10b981; margin-bottom: 10px;">📅 What Happens Next</h3>
                <ol>
                  <li><strong>Initial Review:</strong> We will verify all submitted documents and information</li>
                  <li><strong>Evaluation:</strong> Your proposal will be evaluated against our criteria</li>
                  <li><strong>Clarification (if needed):</strong> We may contact you for additional details</li>
                  <li><strong>Final Selection:</strong> We will notify you of the outcome</li>
                  <li><strong>Next Steps:</strong> Selected vendors will proceed to contract negotiation</li>
                </ol>
              </div>

              <p style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #fbbf24; border-radius: 4px;">
                <strong>⏱️ Please Note:</strong> We typically complete our evaluation within <strong>10-15 business days</strong>. 
                We will contact you as soon as a decision has been made.
              </p>

              <p style="margin-top: 15px;">
                If you have any questions about your submission or the RFP process, please feel free to contact us at <strong>${recipientEmail}</strong>
              </p>

              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                Thank you again for your interest and effort in preparing this proposal. We appreciate the opportunity to consider your organization.
              </p>
            </div>

            <div class="footer">
              <p>This is an automated confirmation message from RFP Management System</p>
              <p style="margin-top: 10px; opacity: 0.7;">© 2025 Procurement Department</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  proposalRejected: (vendorName, rfpTitle, reason, recipientEmail) => ({
    subject: `Decision on Your Proposal - ${rfpTitle}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6; 
              color: #333; 
              background-color: #f5f5f5;
            }
            .email-container { 
              max-width: 650px; 
              margin: 0 auto; 
              background-color: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              color: white; 
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 { font-size: 28px; margin-bottom: 5px; }
            .body { padding: 30px 20px; }
            .info-box {
              background-color: #fee2e2;
              border-left: 4px solid #ef4444;
              padding: 20px;
              border-radius: 4px;
              margin-bottom: 20px;
            }
            .info-box h2 {
              color: #dc2626;
              margin-bottom: 10px;
            }
            .details {
              background-color: #fef2f2;
              padding: 15px;
              border-radius: 4px;
              margin: 15px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #fecaca;
            }
            .detail-row strong { color: #dc2626; }
            .reason-section {
              background-color: #fef2f2;
              padding: 20px;
              border-radius: 4px;
              margin: 20px 0;
              border: 1px solid #fecaca;
            }
            .feedback {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Proposal Decision</h1>
              <p>Thank you for your participation</p>
            </div>

            <div class="body">
              <p>Dear <strong>${vendorName}</strong>,</p>

              <div class="info-box">
                <h2>Thank You for Your Proposal</h2>
                <p>We appreciated your effort in preparing a comprehensive proposal for our RFP.</p>
              </div>

              <div class="section">
                <h2 style="color: #dc2626; margin-bottom: 15px;">📋 RFP Information</h2>
                <div class="details">
                  <div class="detail-row">
                    <span><strong>RFP Title:</strong></span>
                    <span>${rfpTitle}</span>
                  </div>
                  <div class="detail-row">
                    <span><strong>Decision Date:</strong></span>
                    <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div class="detail-row" style="border-bottom: none;">
                    <span><strong>Status:</strong></span>
                    <span style="color: #dc2626; font-weight: 600;">⊘ Not Selected</span>
                  </div>
                </div>
              </div>

              <div class="reason-section">
                <h3 style="color: #dc2626; margin-bottom: 10px;">💭 Evaluation Feedback</h3>
                <p>${reason || `While your proposal demonstrated many strengths, another vendor's submission better aligned with our current requirements and selection criteria.`}</p>
              </div>

              <div class="feedback">
                <strong>📌 Moving Forward</strong>
                <p style="margin-top: 10px;">
                  We encourage you to consider future opportunities. Your organization's capabilities were recognized, and we would welcome the opportunity to work together on upcoming projects.
                </p>
              </div>

              <div class="section" style="background-color: #f9fafb; padding: 15px; border-radius: 4px; margin: 15px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">❓ Questions?</h3>
                <p>If you have questions about the evaluation process or would like to discuss your proposal further, please contact us at <strong>${recipientEmail}</strong></p>
              </div>

              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                We appreciate your interest and professionalism throughout this process. We look forward to potential future opportunities.
              </p>
            </div>

            <div class="footer">
              <p>This is an automated notification from RFP Management System</p>
              <p style="margin-top: 10px; opacity: 0.7;">© 2025 Procurement Department</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  proposalAccepted: (vendorName, rfpTitle, details, recipientEmail) => ({
    subject: `🎉 Congratulations! Your Proposal Accepted - ${rfpTitle}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6; 
              color: #333; 
              background-color: #f5f5f5;
            }
            .email-container { 
              max-width: 650px; 
              margin: 0 auto; 
              background-color: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white; 
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 { font-size: 28px; margin-bottom: 5px; }
            .body { padding: 30px 20px; }
            .congratulations-box {
              background-color: #d1fae5;
              border-left: 4px solid #10b981;
              padding: 20px;
              border-radius: 4px;
              margin-bottom: 20px;
              text-align: center;
            }
            .congratulations-box h2 {
              color: #10b981;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .details-section {
              background-color: #f0fdf4;
              padding: 20px;
              border-radius: 4px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #dcfce7;
              font-size: 15px;
            }
            .detail-row:last-child { border-bottom: none; }
            .detail-row strong { color: #10b981; width: 40%; }
            .next-steps {
              background-color: #f0f9ff;
              border-left: 4px solid #0284c7;
              padding: 20px;
              border-radius: 4px;
              margin: 20px 0;
            }
            .next-steps h3 {
              color: #0284c7;
              margin-bottom: 10px;
            }
            .next-steps ol {
              margin-left: 20px;
              margin-top: 10px;
            }
            .next-steps li {
              margin-bottom: 8px;
              line-height: 1.6;
            }
            .contact-info {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              border-radius: 4px;
              margin: 15px 0;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🎉 Proposal Accepted</h1>
              <p>Welcome aboard!</p>
            </div>

            <div class="body">
              <p>Dear <strong>${vendorName}</strong>,</p>

              <div class="congratulations-box">
                <h2>Congratulations!</h2>
                <p>Your proposal has been accepted. We look forward to working with you!</p>
              </div>

              <div class="section">
                <h2 style="color: #10b981; margin-bottom: 15px;">📋 Proposal Details</h2>
                <div class="details-section">
                  <div class="detail-row">
                    <strong>RFP Title:</strong>
                    <span>${rfpTitle}</span>
                  </div>
                  <div class="detail-row">
                    <strong>Total Price:</strong>
                    <span>$${details?.total_price?.toLocaleString() || 'To be confirmed'}</span>
                  </div>
                  <div class="detail-row">
                    <strong>Delivery Period:</strong>
                    <span>${details?.delivery_days || 'To be determined'} days</span>
                  </div>
                  <div class="detail-row">
                    <strong>Warranty Period:</strong>
                    <span>${details?.warranty_months || 'To be negotiated'} months</span>
                  </div>
                  <div class="detail-row">
                    <strong>Payment Terms:</strong>
                    <span>${details?.payment_terms || 'To be determined'}</span>
                  </div>
                </div>
              </div>

              <div class="next-steps">
                <h3>📅 What Happens Next</h3>
                <ol>
                  <li><strong>Contract Preparation:</strong> Our legal team will prepare the final contract</li>
                  <li><strong>Contract Review:</strong> You will receive the contract for review within 2-3 business days</li>
                  <li><strong>Signature & Execution:</strong> Both parties will execute the contract</li>
                  <li><strong>Project Kickoff:</strong> We will schedule a kickoff meeting to discuss timelines and deliverables</li>
                  <li><strong>Work Begins:</strong> Project work will commence according to agreed timeline</li>
                </ol>
              </div>

              <div class="contact-info">
                <strong>📧 Point of Contact</strong>
                <p style="margin-top: 8px;">
                  Our project manager will be reaching out to you shortly to coordinate next steps and answer any questions.
                </p>
              </div>

              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                We are excited about this partnership and believe your organization is the right fit for this project. 
                Should you have any immediate questions or concerns, please don't hesitate to contact us at <strong>${recipientEmail}</strong>.
              </p>
            </div>

            <div class="footer">
              <p>This is an automated notification from RFP Management System</p>
              <p style="margin-top: 10px; opacity: 0.7;">© 2025 Procurement Department</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordReset: (userName, resetToken, resetUrl) => ({
    subject: 'Password Reset Request - RFP Management System',
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6; 
              color: #333; 
              background-color: #f5f5f5;
            }
            .email-container { 
              max-width: 650px; 
              margin: 0 auto; 
              background-color: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 { font-size: 28px; margin-bottom: 5px; }
            .body { padding: 30px 20px; }
            .info-box {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 20px;
              border-radius: 4px;
              margin: 20px 0;
            }
            .info-box strong { color: #ff8c00; }
            .cta-button {
              display: inline-block;
              background-color: #667eea;
              color: white;
              padding: 14px 28px;
              border-radius: 4px;
              text-decoration: none;
              margin: 20px 0;
              font-weight: 600;
              font-size: 16px;
            }
            .cta-button:hover {
              background-color: #5a67d8;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            .token-box {
              background-color: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 4px;
              padding: 15px;
              margin: 15px 0;
              word-break: break-all;
              font-family: monospace;
              font-size: 14px;
            }
            .warning-box {
              background-color: #fee2e2;
              border-left: 4px solid #ef4444;
              padding: 15px;
              border-radius: 4px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
              <p>RFP Management System</p>
            </div>

            <div class="body">
              <p>Hello <strong>${userName}</strong>,</p>

              <p style="margin-top: 15px;">
                We received a request to reset your password for your RFP Management System account.
                If you didn't make this request, you can safely ignore this email.
              </p>

              <div class="info-box">
                <strong>⏰ This link will expire in 30 minutes</strong>
                <p style="margin-top: 8px;">For security reasons, password reset links are only valid for 30 minutes.</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="cta-button">Reset Password</a>
              </div>

              <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
              <div class="token-box">${resetUrl}</div>

              <div class="warning-box">
                <strong>⚠️ Security Notice</strong>
                <p style="margin-top: 8px;">
                  If you didn't request a password reset, please ignore this email. 
                  Your password will remain unchanged. For security, never share this link with anyone.
                </p>
              </div>

              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                This is an automated message from RFP Management System. Please do not reply to this email.
              </p>
            </div>

            <div class="footer">
              <p>This is an automated message from RFP Management System</p>
              <p style="margin-top: 10px; opacity: 0.7;">
                © 2025 RFP Management System. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const templateData = templates.passwordReset(
      user.name,
      resetToken,
      resetUrl
    );

    const mailOptions = {
      from: `"RFP Management System" <${process.env.SENDER_EMAIL || process.env.GMAIL_USER || 'noreply@rfp-system.com'}>`,
      to: user.email,
      subject: templateData.subject,
      html: templateData.html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${user.email}`, { messageId: info.messageId });
    return { status: 'sent', messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send password reset email to ${user.email}`, { error: error.message });
    throw error;
  }
};

/**
 * Send RFP to vendors
 */
export const sendRfpEmail = async (vendors, rfpData, senderInfo = {}) => {
  if (!vendors || vendors.length === 0) {
    throw new Error('No vendors provided');
  }

  if (!rfpData) {
    throw new Error('No RFP data provided');
  }

  const results = {
    sent: [],
    failed: [],
  };

  for (const vendor of vendors) {
    try {
      const templateData = templates.rfpRequest(
        vendor.name,
        rfpData.title,
        rfpData,
        senderInfo?.name || 'Procurement Team',
        senderInfo?.email || process.env.SENDER_EMAIL || 'noreply@rfp-system.com'
      );

      const mailOptions = {
        from: `"Procurement System" <${process.env.SENDER_EMAIL || process.env.GMAIL_USER || 'noreply@rfp-system.com'}>`,
        to: vendor.contact_email,
        subject: templateData.subject,
        html: templateData.html,
        replyTo: senderInfo.email || process.env.SENDER_EMAIL,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`RFP email sent to ${vendor.contact_email}`, { messageId: info.messageId });
      
      results.sent.push({
        vendorId: vendor._id,
        vendorName: vendor.name,
        email: vendor.contact_email,
        status: 'sent',
      });
    } catch (error) {
      logger.error(`Failed to send RFP email to ${vendor.contact_email}`, { error: error.message });
      results.failed.push({
        vendorId: vendor._id,
        vendorName: vendor.name,
        email: vendor.contact_email,
        status: 'failed',
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * Send proposal received confirmation
 */
export const sendProposalReceivedEmail = async (vendor, rfpTitle, recipientEmail) => {
  try {
    const templateData = templates.proposalReceived(
      vendor.name,
      rfpTitle,
      {},
      recipientEmail
    );

    const mailOptions = {
      from: process.env.SENDER_EMAIL || process.env.GMAIL_USER || 'noreply@rfp-system.com',
      to: vendor.contact_email,
      subject: templateData.subject,
      html: templateData.html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Proposal received email sent to ${vendor.contact_email}`, { messageId: info.messageId });
    return { status: 'sent', messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send proposal received email to ${vendor.contact_email}`, { error: error.message });
    throw error;
  }
};

/**
 * Send proposal decision email
 */
export const sendProposalDecisionEmail = async (vendor, rfpTitle, accepted, details = {}) => {
  try {
    const templateData = accepted
      ? templates.proposalAccepted(vendor.name, rfpTitle, details)
      : templates.proposalRejected(vendor.name, rfpTitle, details.reason);

    const mailOptions = {
      from: process.env.SENDER_EMAIL || process.env.GMAIL_USER || 'noreply@rfp-system.com',
      to: vendor.contact_email,
      subject: templateData.subject,
      html: templateData.html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Proposal decision email sent to ${vendor.contact_email}`, { messageId: info.messageId });
    return { status: 'sent', messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send proposal decision email to ${vendor.contact_email}`, { error: error.message });
    throw error;
  }
};

/**
 * Verify email service is working
 */
export const verifyEmailService = async () => {
  try {
    await transporter.verify();
    logger.info('Email service verified successfully');
    return true;
  } catch (error) {
    logger.error('Email service verification failed', { error: error.message });
    return false;
  }
};

export default {
  sendRfpEmail,
  sendProposalReceivedEmail,
  sendProposalDecisionEmail,
  sendPasswordResetEmail,
  verifyEmailService,
};
