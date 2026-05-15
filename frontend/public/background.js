// background.js — Service worker for badge updates + API proxy

const API_BASE_URLS = ['http://localhost:5000', 'http://127.0.0.1:5000'];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_BADGE') {
    const count = message.count;
    const tabId = sender.tab?.id;
    if (!tabId) return;

    if (count > 0) {
      chrome.action.setBadgeText({ text: String(count), tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#EF4444', tabId });
    } else {
      chrome.action.setBadgeText({ text: '', tabId });
    }
  }

  if (message.type === 'PREDICT_BATCH') {
    const texts = Array.isArray(message.texts) ? message.texts : [];
    if (texts.length === 0) {
      sendResponse({ success: false, error: 'No texts provided' });
      return;
    }

    (async () => {
      let lastError;

      for (const baseUrl of API_BASE_URLS) {
        try {
          const response = await fetch(`${baseUrl}/predict_batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts })
          });

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          const data = await response.json();
          sendResponse({ success: true, data });
          return;
        } catch (error) {
          lastError = error;
        }
      }

      sendResponse({
        success: false,
        error: lastError?.message || 'Could not connect to API'
      });
    })();

    return true;
  }
});

// Clear badge when tab navigates
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    chrome.action.setBadgeText({ text: '', tabId });
  }
});
