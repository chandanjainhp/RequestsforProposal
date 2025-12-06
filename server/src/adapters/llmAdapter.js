// LLM Adapter for RFP and Proposal parsing
// Uses Google Gemini AI for smart parsing

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI with unified API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const RFP_PARSE_PROMPT = `You are an expert RFP (Request for Proposal) parser. Extract ALL structured data from the following text.

IMPORTANT: You MUST extract line_items. Look for any products, equipment, services, or items mentioned with quantities.

Return a JSON object with these exact fields:
{
  "title": "Brief title summarizing the RFP (max 100 chars)",
  "summary": "2-3 sentence summary of what is needed",
  "budget": numeric value or null,
  "currency": "USD", "INR", "EUR", "GBP", etc. or null,
  "delivery_days": number of days or null,
  "delivery_date": "YYYY-MM-DD" format or null,
  "payment_terms": "Net 30", "50% advance", etc. or null,
  "warranty_months": number of months or null,
  "line_items": [
    {
      "name": "product/service name",
      "quantity": number (default 1 if not specified),
      "specs": { "key": "value" pairs for specifications },
      "estimated_unit_price": number or null
    }
  ],
  "notes": "any additional important information"
}

Rules:
- CRITICAL: Extract ALL line items mentioned (products, services, equipment, supplies)
- Examples of line items: "10 managed switches" -> {"name": "managed switches", "quantity": 10}
- Examples: "5 routers" -> {"name": "routers", "quantity": 5}
- Examples: "necessary cabling" -> {"name": "cabling", "quantity": 1}
- For budget: "under $5,000" or "$5,000 budget" or "budget of $5,000" -> budget: 5000
- For delivery: "within 2 weeks" = delivery_days: 14, "by next month" = delivery_days: 30
- For "X year warranty/support", convert to months (1 year = 12 months, 3 years = 36 months)
- For "$50K" or "50K", convert to 50000
- For "lakh", multiply by 100000; for "crore", multiply by 10000000
- Detect currency from symbols: $ = USD, ₹ = INR, € = EUR, £ = GBP
- "within X days" means delivery_days = X
- "within X weeks" means delivery_days = X * 7
- "within X months" means delivery_days = X * 30
- Return ONLY valid JSON, no markdown, no explanation, no code blocks

Text to parse:
`;

// Call Gemini AI for parsing
async function callGeminiAI(prompt, text) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',  // Using the model from env config
      generationConfig: {
        temperature: 0.1,  // Low temperature for consistent output
        topP: 0.8,
        maxOutputTokens: 2048,
      }
    });
    const result = await model.generateContent(prompt + text);
    const response = await result.response;
    let responseText = response.text();
    console.log('[AI] Raw response:', responseText.substring(0, 500));
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(responseText);
    console.log('[AI] Parsed line_items:', parsed.line_items?.length || 0);
    return { success: true, data: parsed };
  } catch (error) {
    console.error('Gemini AI error:', error.message);
    return { success: false, error: error.message };
  }
}

// Fallback regex parser
function fallbackParseRfp(text) {
  const parsed = {
    title: null, summary: null, budget: null, currency: null,
    delivery_days: null, delivery_date: null, payment_terms: null,
    warranty_months: null, line_items: [], notes: null
  };
  const titleMatch = text.match(/^([^.!?\n]+[.!?]?)/);
  if (titleMatch) parsed.title = titleMatch[1].substring(0, 100).trim();
  let budgetMatch = text.match(/budget\s+(?:is\s+)?(?:allocated\s+)?(?:\$|£|€|₹)?\s*([\d,]+(?:\.\d+)?)\s*(lakh|crore|k|million|m)?/i);
  if (!budgetMatch) budgetMatch = text.match(/(?:\$|£|€|₹)\s*([\d,]+(?:\.\d+)?)\s*(lakh|crore|k|million|m)?/i);
  if (budgetMatch) {
    let amount = parseFloat(budgetMatch[1].replace(/,/g, ''));
    const mult = budgetMatch[2]?.toLowerCase();
    if (mult === 'lakh') amount *= 100000;
    else if (mult === 'crore') amount *= 10000000;
    else if (mult === 'k') amount *= 1000;
    else if (mult === 'million' || mult === 'm') amount *= 1000000;
    parsed.budget = amount;
  }
  if (text.match(/\$/)) parsed.currency = 'USD';
  else if (text.match(/₹|Rs\.?|INR/i)) parsed.currency = 'INR';
  const deliveryMatch = text.match(/(?:within|completed\s+within|delivery)\s*(\d+)\s*days?/i);
  if (deliveryMatch) parsed.delivery_days = parseInt(deliveryMatch[1]);
  const warrantyMatch = text.match(/(\d+)[-\s]?year\s+(?:warranty|support)/i);
  if (warrantyMatch) parsed.warranty_months = parseInt(warrantyMatch[1]) * 12;
  const paymentMatch = text.match(/payment\s+terms?\s+(?:should\s+be\s+|:?\s*)?(net\s+\d+)/i);
  if (paymentMatch) parsed.payment_terms = paymentMatch[1].trim();
  parsed.summary = text.substring(0, 200);
  return parsed;
}

function calculateConfidence(parsed) {
  let score = 0.2;  // Start at 20%
  const fields = [parsed.title, parsed.budget, parsed.delivery_days, parsed.payment_terms, parsed.warranty_months, parsed.currency];
  const filledCount = fields.filter(f => f !== null && f !== undefined).length;
  score += (filledCount / 6) * 0.5;  // Add up to 50% for filled fields
  if (parsed.line_items?.length > 0) score += Math.min(0.3, parsed.line_items.length * 0.05);  // Add up to 30% for line items
  const finalScore = Math.min(1.0, Math.max(0.2, score));  // Between 20-100%
  console.log(`[Confidence] Fields: ${filledCount}/6, LineItems: ${parsed.line_items?.length || 0}, Score: ${(finalScore * 100).toFixed(1)}%`);
  return finalScore;
}

export default {
  async parseRfp(text) {
    const warnings = [];
    let parsed, confidence, usedAI = false;
    const aiResult = await callGeminiAI(RFP_PARSE_PROMPT, text);
    if (aiResult.success && aiResult.data) {
      parsed = aiResult.data;
      usedAI = true;
      parsed.title = parsed.title || null;
      parsed.summary = parsed.summary || parsed.description || null;
      parsed.budget = parsed.budget || null;
      parsed.currency = parsed.currency || null;
      parsed.delivery_days = parsed.delivery_days || null;
      parsed.delivery_date = parsed.delivery_date || null;
      parsed.payment_terms = parsed.payment_terms || null;
      parsed.warranty_months = parsed.warranty_months || null;
      parsed.line_items = parsed.line_items || [];
      parsed.notes = parsed.notes || null;
      confidence = calculateConfidence(parsed);
    } else {
      warnings.push('AI parsing failed, using fallback parser');
      parsed = fallbackParseRfp(text);
      confidence = calculateConfidence(parsed) * 0.8;
    }
    if (!parsed.currency) warnings.push('Currency not detected');
    if (!parsed.delivery_days && !parsed.delivery_date) warnings.push('Delivery timeline not specified');
    if (!parsed.budget) warnings.push('Budget not specified');
    return { parsed_rfp: parsed, parse_confidence: confidence, warnings, ai_powered: usedAI };
  },
  async parseProposal(text) {
    console.log('[Proposal Parser] Parsing vendor proposal with AI...');
    const prompt = `You are an expert procurement specialist parsing vendor proposals/quotes in response to an RFP.

Extract ALL structured data from this vendor response email/text. Vendors may respond in messy formats: free-form text, tables, lists, or attachments.

Return a JSON object with these exact fields:
{
  "vendor_name": "Name of the vendor/company if mentioned",
  "total_price": numeric value (extract the main quoted price),
  "currency": "USD", "INR", "EUR", "GBP", etc.,
  "delivery_days": number of days they can deliver in,
  "warranty_months": number of months warranty offered,
  "payment_terms": "Net 30", "50% advance, 50% on delivery", etc.,
  "line_items": [
    {
      "name": "product/service name",
      "quantity": number,
      "unit_price": number or null,
      "subtotal": number or null
    }
  ],
  "technical_specs": "Key technical specifications offered",
  "certifications": "Any certifications mentioned (ISO, CE, etc.)",
  "terms_conditions": "Special terms or conditions mentioned",
  "notes": "Any other important details"
}

Rules:
- Extract prices even from messy text like "we can offer $24,000" or "our quote is 24000 USD"
- Convert "$24K" to 24000, "5 lakh" to 500000, "1 crore" to 10000000
- "within 25 days" or "25 day delivery" = delivery_days: 25
- "12 month warranty" or "1 year warranty" = warranty_months: 12
- "3 year warranty" = warranty_months: 36
- Extract line items from tables, lists, or text descriptions
- If vendor name not clear, return null
- Return ONLY valid JSON, no markdown, no explanation

Vendor Response to Parse:
`;
    
    const aiResult = await callGeminiAI(prompt, text);
    
    if (aiResult.success && aiResult.data) {
      const data = aiResult.data;
      const warnings = [];
      let confidence = 0.95;
      
      // Validate and adjust confidence
      if (!data.total_price) { warnings.push('Price not extracted'); confidence -= 0.2; }
      if (!data.delivery_days) { warnings.push('Delivery timeline not specified'); confidence -= 0.1; }
      if (!data.warranty_months) { warnings.push('Warranty not specified'); confidence -= 0.1; }
      if (!data.line_items || data.line_items.length === 0) { warnings.push('No line items extracted'); confidence -= 0.1; }
      
      console.log('[Proposal Parser] AI extracted:', {
        price: data.total_price,
        currency: data.currency,
        delivery: data.delivery_days,
        warranty: data.warranty_months,
        items: data.line_items?.length || 0
      });
      
      return {
        parsed_proposal: {
          vendor_name: data.vendor_name || null,
          total_price: data.total_price,
          currency: data.currency || 'USD',
          delivery_days: data.delivery_days,
          warranty_months: data.warranty_months,
          payment_terms: data.payment_terms || null,
          line_items: data.line_items || [],
          technical_specs: data.technical_specs || null,
          certifications: data.certifications || null,
          terms_conditions: data.terms_conditions || null,
          notes: data.notes || null
        },
        parse_confidence: Math.max(0.3, confidence),
        warnings,
        ai_powered: true
      };
    }
    
    // Fallback: basic regex extraction
    console.log('[Proposal Parser] AI failed, using fallback regex parser');
    const priceMatch = text.match(/\$?([\d,]+(?:\.\d{2})?)\s*(?:USD|dollars?)?/i) || 
                       text.match(/(?:quote|price|offer|total)[:\s]+\$?([\d,]+)/i);
    const deliveryMatch = text.match(/(\d+)\s*(?:day|days)/i);
    const warrantyMatch = text.match(/(\d+)\s*(?:month|year)s?\s*warranty/i);
    
    let totalPrice = null;
    if (priceMatch) {
      totalPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
    }
    
    let warrantyMonths = null;
    if (warrantyMatch) {
      warrantyMonths = parseInt(warrantyMatch[1]);
      if (text.toLowerCase().includes('year')) warrantyMonths *= 12;
    }
    
    return {
      parsed_proposal: {
        vendor_name: null,
        total_price: totalPrice,
        currency: 'USD',
        delivery_days: deliveryMatch ? parseInt(deliveryMatch[1]) : null,
        warranty_months: warrantyMonths,
        payment_terms: null,
        line_items: [],
        technical_specs: null,
        certifications: null,
        terms_conditions: null,
        notes: text.substring(0, 500)
      },
      parse_confidence: 0.4,
      warnings: ['Using fallback parser - some fields may be missing'],
      ai_powered: false
    };
  },
  parseProposalStageA(text) { return { parsed: { total_price: null, items: [] }, confidence: 0.2, stage: 'A', complete: false }; },
  parseProposalStageB(text) { return { parsed: { total_price: null, items: [], currency: 'USD' }, confidence: 0.4, stage: 'B', complete: false }; },
  async parseProposalStageC(text) { const r = await this.parseProposal(text); return { parsed: r.parsed_proposal, confidence: r.parse_confidence, stage: 'C', complete: false }; }
};
