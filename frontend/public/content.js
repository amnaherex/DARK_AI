// content.js — Runs on every webpage
// Scrapes text, sends to Flask API, highlights deceptive patterns
console.log("🔥 Content script loaded");
console.log("🔥 Content script loaded");
console.log("🔥 Content script loaded");
console.log("🔥 Content script loaded");
console.log("🔥 Content script loaded");
console.log("🔥 Content script loaded");

if (typeof window.dpdLoaded === 'undefined') {
window.dpdLoaded = true;

const COLORS = {
  scarcity:     { bg: 'rgba(239,68,68,0.25)',   border: '#EF4444', label: '🔴 Fake Scarcity'     },
  urgency:      { bg: 'rgba(249,115,22,0.25)',  border: '#F97316', label: '🟠 Fake Urgency'      },
  social_proof: { bg: 'rgba(234,179,8,0.25)',   border: '#EAB308', label: '🟡 Fake Social Proof' },
};

let highlightedNodes = [];
let isAnalyzing = false;

function predictBatchViaBackground(texts) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'PREDICT_BATCH', texts }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (!response?.success) {
        reject(new Error(response?.error || 'Unknown API error'));
        return;
      }

      resolve(response.data);
    });
  });
}

// ─────────────────────────────────────────────
// EXTRACT TEXT NODES FROM PAGE
// ─────────────────────────────────────────────
function getTextNodes() {
  const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'INPUT', 'TEXTAREA', 'SELECT', 'BUTTON']);
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        const text = node.textContent.trim();
        if (text.length < 6) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  let node;
  while ((node = walker.nextNode())) {
    nodes.push(node);
  }
  return nodes;
}

// ─────────────────────────────────────────────
// HIGHLIGHT A TEXT NODE
// ─────────────────────────────────────────────
function highlightNode(textNode, category) {
  const style = COLORS[category];
  if (!style) return;

  const span = document.createElement('span');
  span.className = `dpd-highlight dpd-${category}`;
  span.setAttribute('data-dpd-category', category);
  span.setAttribute('data-dpd-label', style.label);
  span.style.cssText = `
    background-color: ${style.bg} !important;
    border-bottom: 2px solid ${style.border} !important;
    border-radius: 3px !important;
    padding: 1px 2px !important;
    cursor: help !important;
    position: relative !important;
  `;

  // Tooltip on hover
  span.title = `⚠️ ${style.label} detected`;

  try {
    const range = document.createRange();
    range.selectNode(textNode);
    range.surroundContents(span);
    highlightedNodes.push(span);
  } catch (e) {
    // Node might be part of a mixed content node — skip safely
  }
}

// ─────────────────────────────────────────────
// REMOVE ALL HIGHLIGHTS
// ─────────────────────────────────────────────
function clearHighlights() {
  document.querySelectorAll('.dpd-highlight').forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    }
  });
  highlightedNodes = [];
}

// ─────────────────────────────────────────────
// MAIN ANALYSIS FUNCTION
// ─────────────────────────────────────────────
async function analyzePage() {
  if (isAnalyzing) return { error: 'Already analyzing' };
  isAnalyzing = true;
  clearHighlights();

  // Wait for dynamic content to load
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    // Collect text nodes
    const textNodes = getTextNodes();
    if (textNodes.length === 0) {
      isAnalyzing = false;
      return { error: 'No text found on page' };
    }

    // Build list of unique texts (to reduce API calls)
    const texts = textNodes.map(n => n.textContent.trim()).filter(t => t.length > 5);
    const uniqueTexts = [...new Set(texts)];

    // Send to Flask in batches of 50
    const BATCH_SIZE = 50;
    const allResults = {};

    for (let i = 0; i < uniqueTexts.length; i += BATCH_SIZE) {
      const batch = uniqueTexts.slice(i, i + BATCH_SIZE);
      try {
        const data = await predictBatchViaBackground(batch);

        data.results.forEach(item => {
          allResults[item.text] = item.result;
        });
      } catch (fetchError) {
        isAnalyzing = false;
        return { error: `Could not connect to API. Is Flask running? (${fetchError.message})` };
      }
    }

    // Highlight matching nodes
    let deceptiveCount = { scarcity: 0, urgency: 0, social_proof: 0 };
    textNodes.forEach(node => {
      const text = node.textContent.trim();
      const result = allResults[text];
      if (result && result.category !== 'not_deceptive') {
        highlightNode(node, result.category);
        deceptiveCount[result.category] = (deceptiveCount[result.category] || 0) + 1;
      }
    });

    const totalDeceptive = Object.values(deceptiveCount).reduce((a, b) => a + b, 0);

    // Update badge
    chrome.runtime.sendMessage({
      type: 'UPDATE_BADGE',
      count: totalDeceptive
    });

    isAnalyzing = false;
    return {
      success: true,
      total_analyzed: texts.length,
      deceptive_found: totalDeceptive,
      breakdown: deceptiveCount
    };

  } catch (err) {
    isAnalyzing = false;
    return { error: err.message };
  }
}

// ─────────────────────────────────────────────
// LISTEN FOR MESSAGES FROM POPUP
// ─────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYZE_PAGE') {
    analyzePage().then(result => sendResponse(result));
    return true; // keep channel open for async response
  }

  if (message.type === 'CLEAR_HIGHLIGHTS') {
    clearHighlights();
    chrome.runtime.sendMessage({ type: 'UPDATE_BADGE', count: 0 });
    sendResponse({ success: true });
  }

  if (message.type === 'GET_STATUS') {
    sendResponse({ isAnalyzing });
  }
});

} // end dpdLoaded guard
