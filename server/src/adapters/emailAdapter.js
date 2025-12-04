// Email Adapter
// Handles email sending for RFP distribution and notifications
// For production, integrate with Mailgun, SendGrid, or AWS SES

import logger from '../utils/logger.js';

/**
 * Format RFP as plain text email
 */
function formatRfpEmail(rfp, vendor, replyToToken, replyDomain) {
  const title = rfp.title || 'RFP Request';
  const description = rfp.description || '';
  const budget = rfp.budget ? `${rfp.currency || 'USD'} ${rfp.budget.toLocaleString()}` : 'TBD';
  const delivery = rfp.delivery_days ? `within ${rfp.delivery_days} days` : 'TBD';
  const warranty = rfp.warranty_months ? `${rfp.warranty_months} months` : 'TBD';
  const paymentTerms = rfp.payment_terms || 'Net 30';

  const lineItemsText = rfp.line_items && rfp.line_items.length > 0
    ? rfp.line_items.map(item => `  • ${item.quantity}x ${item.name}`).join('\n')
    : '';

  const replyTo = `rfp+${replyToToken}@${replyDomain}`;

  const plainText = `Subject: RFP: ${title} — ${rfp._id}

Hello ${vendor.name},

We are requesting proposals for the following procurement:

Title: ${title}
Description: ${description}

Budget: ${budget}
Delivery: ${delivery}
Payment Terms: ${paymentTerms}
Warranty: ${warranty}

${lineItemsText ? 'Line Items:\n' + lineItemsText + '\n' : ''}

Please provide your proposal including:
- Total price and itemized breakdown
- Delivery timeline
- Terms and conditions
- Any relevant certifications or references

To ensure your reply is automatically processed, please reply to:
${replyTo}

Or reply to this email and we will manually map your response.

RFP ID: ${rfp._id}
Reply-To Token: ${replyToToken}

Best regards,
Procurement Team
`;

  const htmlText = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h2 { color: #2c3e50; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; color: #555; }
    .items { background: #f5f5f5; padding: 10px; border-radius: 4px; }
    .reply-info { background: #e8f4f8; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0; }
    code { background: #f1f1f1; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>RFP: ${title}</h2>
    
    <div class="field">
      <span class="label">Description:</span> ${description}
    </div>
    
    <div class="field">
      <span class="label">Budget:</span> ${budget}
    </div>
    
    <div class="field">
      <span class="label">Delivery:</span> ${delivery}
    </div>
    
    <div class="field">
      <span class="label">Payment Terms:</span> ${paymentTerms}
    </div>
    
    <div class="field">
      <span class="label">Warranty:</span> ${warranty}
    </div>
    
    ${lineItemsText && rfp.line_items ? `
    <div class="field">
      <span class="label">Line Items:</span>
      <div class="items">
        ${(rfp.line_items || []).map(item => `<div>• ${item.quantity}x ${item.name}</div>`).join('')}
      </div>
    </div>
    ` : ''}
    
    <div class="reply-info">
      <strong>To submit your proposal:</strong>
      <p>Reply to this email or send to: <code>${replyTo}</code></p>
      <p><strong>RFP ID:</strong> ${rfp._id}</p>
    </div>
    
    <p><em>This is an automated message. Please do not reply to this sender address.</em></p>
  </div>
</body>
</html>
  `;

  return { plainText, htmlText, replyTo };
}

/**
 * Send RFP email to vendor
 * For stub implementation, logs the email. For production, use Mailgun/SES/SendGrid.
 */
async function sendRfpEmail(rfp, vendor, replyToToken) {
  const replyDomain = process.env.RFP_REPLY_DOMAIN || 'localhost';
  const emailFrom = process.env.EMAIL_FROM || 'rfp@localhost';

  const { plainText, htmlText, replyTo } = formatRfpEmail(rfp, vendor, replyToToken, replyDomain);

  // Stub implementation: log the email
  logger.info(`[EMAIL STUB] Sending RFP to ${vendor.contact_email}`);
  logger.debug(`From: ${emailFrom}`);
  logger.debug(`To: ${vendor.contact_email}`);
  logger.debug(`Reply-To: ${replyTo}`);
  logger.debug(`Subject: RFP: ${rfp.title} — ${rfp._id}`);

  // TODO: Integrate with real provider
  // Example with Mailgun:
  // const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
  // const emailData = {
  //   from: emailFrom,
  //   to: vendor.contact_email,
  //   'reply-to': replyTo,
  //   subject: `RFP: ${rfp.title} — ${rfp._id}`,
  //   text: plainText,
  //   html: htmlText
  // };
  // return await mg.messages().send(emailData);

  return {
    success: true,
    vendor_email: vendor.contact_email,
    reply_to: replyTo,
    message_id: `stub-${Date.now()}`
  };
}

/**
 * Send multiple RFP emails (batch)
 */
async function sendRfpBatch(rfp, vendors, replyToToken) {
  logger.info(`[EMAIL BATCH START] Sending to ${vendors.length} vendors, RFP: ${rfp._id}, Token: ${replyToToken}`);
  const results = [];
  for (const vendor of vendors) {
    try {
      logger.debug(`[EMAIL BATCH ITEM] Processing vendor: ${vendor._id}, email: ${vendor.contact_email}`);
      const result = await sendRfpEmail(rfp, vendor, replyToToken);
      results.push({ vendor_id: vendor._id, vendor_email: vendor.contact_email, success: true, ...result });
      logger.debug(`[EMAIL BATCH ITEM OK] Vendor: ${vendor._id}`);
    } catch (error) {
      logger.error(`Failed to send RFP to ${vendor.contact_email}: ${error.message}`);
      results.push({ vendor_id: vendor._id, vendor_email: vendor.contact_email, success: false, error: error.message });
    }
  }
  logger.info(`[EMAIL BATCH END] Completed, results: ${results.length}`);
  return results;
}

export default {
  formatRfpEmail,
  sendRfpEmail,
  sendRfpBatch
};
