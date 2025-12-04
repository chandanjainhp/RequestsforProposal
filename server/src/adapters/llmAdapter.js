// LLM Adapter for RFP and Proposal parsing
// Supports both stub (regex) and real LLM implementations

const LLM_PROMPT_PARSE_RFP = `You are an extraction assistant. Convert the input to strict JSON that matches schema:
{ "title":string|null, "description":string|null, "budget":number|null, "currency":string|null, "delivery_days":int|null, "delivery_date":string|null, "payment_terms":string|null, "warranty_months":int|null, "line_items":[{"name":string,"quantity":int|null,"specs":object,"estimated_unit_price":number|null}], "notes":string|null }

Rules:
- Return only JSON. Use null for missing values.
- Normalize currency to ISO codes (USD, INR, EUR). If none mentioned, set null.
- Dates in YYYY-MM-DD.
- If "within X days", set delivery_days.
- For "1 year", warranty_months=12.
- For line items, extract name, quantity, and any specs mentioned.

Now parse:
---INPUT---
{message}`;

// Stub implementation: regex-based parsing for prototyping
function stubParseRfp(text) {
  const parsed = {
    title: null,
    description: null,
    budget: null,
    currency: null,
    delivery_days: null,
    delivery_date: null,
    payment_terms: null,
    warranty_months: null,
    line_items: [],
    notes: null
  };

  // Extract title (first sentence or line)
  const titleMatch = text.match(/^([^.!?\n]+[.!?]?)/);
  if (titleMatch) {
    parsed.title = titleMatch[1].substring(0, 100).trim();
  }

  // Extract budget
  const budgetMatch = text.match(/budget[:\s]*[\$£€]?([\d,]+(?:\.\d+)?)/i);
  if (budgetMatch) {
    parsed.budget = parseFloat(budgetMatch[1].replace(/,/g, ''));
  }

  // Extract currency
  if (text.match(/\$/)) parsed.currency = 'USD';
  else if (text.match(/£/)) parsed.currency = 'GBP';
  else if (text.match(/€/)) parsed.currency = 'EUR';
  else if (text.match(/₹|INR/i)) parsed.currency = 'INR';

  // Extract delivery days
  const deliveryMatch = text.match(/(?:delivery|within|need|require).*?(\d+)\s*days?/i);
  if (deliveryMatch) {
    parsed.delivery_days = parseInt(deliveryMatch[1]);
  }

  // Extract warranty months
  const warrantyMatch = text.match(/warranty[:\s]*(\d+)\s*(?:month|year)/i);
  if (warrantyMatch) {
    const value = parseInt(warrantyMatch[1]);
    parsed.warranty_months = text.toLowerCase().includes('year') ? value * 12 : value;
  }

  // Extract payment terms
  const paymentMatch = text.match(/payment[:\s]*(net\s+\d+|due\s+on|terms?[:\s]*[\w\s]+)/i);
  if (paymentMatch) {
    parsed.payment_terms = paymentMatch[1].trim().substring(0, 50);
  }

  // Extract line items (simple pattern: number + item description)
  const itemMatches = text.matchAll(/(\d+)\s+([^.!?\n]+?)(?:\s*-\s*|\s*budget|\s*price|\s*@|\s*\$|\.|\n|$)/gi);
  for (const match of itemMatches) {
    const quantity = parseInt(match[1]);
    const name = match[2].trim();
    if (name.length > 3 && name.length < 100) {
      parsed.line_items.push({
        name,
        quantity,
        specs: {},
        estimated_unit_price: null
      });
    }
  }

  // Set description as remaining text if no title
  if (!parsed.title && text.length < 200) {
    parsed.description = text;
  } else if (text.length > 100) {
    parsed.description = text.substring(0, 300);
  }

  // Compute confidence based on fields populated
  const fieldsPopulated = [
    parsed.title,
    parsed.budget,
    parsed.currency,
    parsed.delivery_days,
    parsed.warranty_months,
    parsed.payment_terms
  ].filter(f => f !== null).length;
  
  const confidence = Math.min(0.95, 0.4 + (fieldsPopulated / 6) * 0.5);

  return { parsed, confidence };
}

function stubParseProposal(text) {
  const parsed = {
    total_price: null,
    items: [],
    ai_summary: ''
  };

  // Extract total price
  const totalMatch = text.match(/(?:total|price|cost)[:\s]*[\$£€]?([\d,]+(?:\.\d+)?)/i);
  if (totalMatch) {
    parsed.total_price = parseFloat(totalMatch[1].replace(/,/g, ''));
  }

  // Simple item extraction
  const itemMatches = text.matchAll(/(?:^|\n)\s*[-•*]\s*(.+?)(?:\n|$)/gm);
  for (const match of itemMatches) {
    const item = match[1].trim();
    if (item.length > 3 && item.length < 200) {
      parsed.items.push(item);
    }
  }

  parsed.ai_summary = `Parsed total: ${parsed.total_price || 'unknown'}. Items: ${parsed.items.length}.`;

  const confidence = (parsed.total_price ? 0.6 : 0.3) + (parsed.items.length > 0 ? 0.2 : 0);

  return { parsed, confidence };
}

// Export adapter
export default {
  // Parse RFP from chat/freeform text
  parseRfp(text) {
    // For prototype, use stub. Swap to real LLM when ready:
    // return await callRealLLM(LLM_PROMPT_PARSE_RFP.replace('{message}', text));
    
    const { parsed, confidence } = stubParseRfp(text);
    
    const warnings = [];
    if (!parsed.currency) warnings.push('currency not specified — assumed USD');
    if (!parsed.delivery_days) warnings.push('delivery date not specified');
    if (!parsed.budget) warnings.push('budget not specified');

    return {
      parsed_rfp: parsed,
      parse_confidence: confidence,
      warnings
    };
  },

  // Parse proposal (vendor reply) from email/attachment
  // Returns { parsed, confidence, stage }
  parseProposal(text) {
    const { parsed, confidence } = stubParseProposal(text);
    return { parsed, confidence, stage: 'A' };
  },

  // Stage A: Fast regex-based deterministic parsing
  parseProposalStageA(text) {
    const parsed = {
      total_price: null,
      delivery_days: null,
      warranty_months: null,
      items: []
    };

    // Extract total price (required for A)
    const priceMatch = text.match(/(?:total|price|cost|quote)[:\s]*[\$£€]?([\d,]+(?:\.\d+)?)/i);
    if (priceMatch) {
      parsed.total_price = parseFloat(priceMatch[1].replace(/,/g, ''));
    }

    // Extract delivery days (optional)
    const deliveryMatch = text.match(/(?:delivery|ship)[:\s]*(\d+)\s*(?:day|business\s+day)/i);
    if (deliveryMatch) {
      parsed.delivery_days = parseInt(deliveryMatch[1]);
    }

    // Extract warranty (optional)
    const warrantyMatch = text.match(/warranty[:\s]*(\d+)\s*(?:month|year)/i);
    if (warrantyMatch) {
      const value = parseInt(warrantyMatch[1]);
      parsed.warranty_months = text.toLowerCase().includes('year') ? value * 12 : value;
    }

    // Stage A success if total_price found
    const confidence = parsed.total_price ? 0.85 : 0.3;
    return { parsed, confidence, stage: 'A', complete: !!parsed.total_price };
  },

  // Stage B: Table/structured extraction (CSV, invoice items)
  parseProposalStageB(text) {
    const parsed = {
      total_price: null,
      delivery_days: null,
      warranty_months: null,
      items: []
    };

    // Look for line items with prices
    const lines = text.split('\n');
    let subtotal = 0;
    for (const line of lines) {
      const itemMatch = line.match(/^\s*[-•*]?\s*(.+?)\s*[\$£€]?([\d,]+(?:\.\d+)?)/);
      if (itemMatch) {
        const itemName = itemMatch[1].trim();
        const price = parseFloat(itemMatch[2].replace(/,/g, ''));
        parsed.items.push({ name: itemName, price });
        subtotal += price;
      }
    }

    if (subtotal > 0) {
      parsed.total_price = subtotal;
    }

    const confidence = parsed.items.length > 0 ? 0.7 : 0.4;
    return { parsed, confidence, stage: 'B', complete: !!parsed.total_price };
  },

  // Stage C: LLM-based structured extraction
  parseProposalStageC(text) {
    // Stub implementation - would call real LLM in production
    const { parsed, confidence } = stubParseProposal(text);
    return { parsed, confidence, stage: 'C', complete: !!parsed.total_price };
  }
};