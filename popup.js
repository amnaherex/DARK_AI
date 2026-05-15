// popup.js — Controls the extension popup UI

const scanBtn       = document.getElementById('scanBtn');
const loadingStatus = document.getElementById('loadingStatus');
const errorStatus   = document.getElementById('errorStatus');
const errorText     = document.getElementById('errorText');
const cleanStatus   = document.getElementById('cleanStatus');
const resultsSection = document.getElementById('resultsSection');
const clearBtn      = document.getElementById('clearBtn');

const scarcityCard  = document.getElementById('scarcityCard');
const urgencyCard   = document.getElementById('urgencyCard');
const socialCard    = document.getElementById('socialCard');

const scarcityCount = document.getElementById('scarcityCount');
const urgencyCount  = document.getElementById('urgencyCount');
const socialCount   = document.getElementById('socialCount');
const totalCount    = document.getElementById('totalCount');

function hideAll() {
  loadingStatus.style.display = 'none';
  errorStatus.style.display   = 'none';
  cleanStatus.style.display   = 'none';
  resultsSection.classList.remove('visible');
}

function showLoading() {
  hideAll();
  loadingStatus.style.display = 'flex';
  scanBtn.disabled = true;
  scanBtn.textContent = '⏳ Scanning...';
}

function showError(message) {
  hideAll();
  errorStatus.style.display = 'flex';
  errorText.textContent = message;
  scanBtn.disabled = false;
  scanBtn.textContent = '⚡ Scan This Page';
}

function showResults(breakdown) {
  hideAll();
  const total = (breakdown.scarcity || 0) + (breakdown.urgency || 0) + (breakdown.social_proof || 0);

  if (total === 0) {
    cleanStatus.style.display = 'flex';
  } else {
    resultsSection.classList.add('visible');

    // Scarcity
    if (breakdown.scarcity > 0) {
      scarcityCard.style.display = 'flex';
      scarcityCount.textContent = breakdown.scarcity;
    } else {
      scarcityCard.style.display = 'none';
    }

    // Urgency
    if (breakdown.urgency > 0) {
      urgencyCard.style.display = 'flex';
      urgencyCount.textContent = breakdown.urgency;
    } else {
      urgencyCard.style.display = 'none';
    }

    // Social Proof
    if (breakdown.social_proof > 0) {
      socialCard.style.display = 'flex';
      socialCount.textContent = breakdown.social_proof;
    } else {
      socialCard.style.display = 'none';
    }

    totalCount.textContent = total;
    totalCount.className = 'total-num' + (total === 0 ? ' zero' : '');
  }

  scanBtn.disabled = false;
  scanBtn.textContent = '⚡ Scan This Page';
}

// ── SCAN BUTTON ──
scanBtn.addEventListener('click', async () => {
  showLoading();

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Inject content script if not already there
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }).catch(() => {}); // ignore if already injected

    // Send analyze message
    chrome.tabs.sendMessage(tab.id, { type: 'ANALYZE_PAGE' }, (response) => {
      if (chrome.runtime.lastError) {
        showError('Could not connect to page. Try refreshing.');
        return;
      }
      if (!response) {
        showError('No response from page.');
        return;
      }
      if (response.error) {
        showError(response.error);
        return;
      }
      showResults(response.breakdown || {});
    });
  } catch (err) {
    showError(`Error: ${err.message}`);
  }
});

// ── CLEAR BUTTON ──
clearBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_HIGHLIGHTS' }, () => {
    hideAll();
    scanBtn.textContent = '⚡ Scan This Page';
  });
});
