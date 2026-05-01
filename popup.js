const els = {
  statusBadge: document.getElementById("statusBadge"),
  scoreValue: document.getElementById("scoreValue"),
  mlProbabilityValue: document.getElementById("mlProbabilityValue"),
  ruleScoreValue: document.getElementById("ruleScoreValue"),
  flaggedLinksValue: document.getElementById("flaggedLinksValue"),
  subjectValue: document.getElementById("subjectValue"),
  senderValue: document.getElementById("senderValue"),
  reasonsList: document.getElementById("reasonsList"),
  historyList: document.getElementById("historyList"),
  rescanButton: document.getElementById("rescanButton"),
  clearHistoryButton: document.getElementById("clearHistoryButton")
};
function runtimeMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve(response || null);
    });
  });
}
function queryActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs?.[0] || null));
  });
}
function sendMessageToTab(tabId, message) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve(response || null);
    });
  });
}
function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function setBadge(level) {
  els.statusBadge.className = "badge";
  if (level === "High") els.statusBadge.classList.add("badge--high");
  else if (level === "Medium") els.statusBadge.classList.add("badge--medium");
  else if (level === "Low") els.statusBadge.classList.add("badge--low");
  else els.statusBadge.classList.add("badge--neutral");
  els.statusBadge.textContent = level || "Waiting";
}
function renderCurrent(scan, inGmail) {
  if (!inGmail) {
    setBadge(null);
    els.scoreValue.textContent = "--";
    els.mlProbabilityValue.textContent = "--";
    els.ruleScoreValue.textContent = "--";
    els.flaggedLinksValue.textContent = "--";
    els.subjectValue.textContent = "Open Gmail in the active tab to scan an email.";
    els.senderValue.textContent = "";
    els.reasonsList.innerHTML = "";
    return;
  }
  if (!scan) {
    setBadge(null);
    els.scoreValue.textContent = "--";
    els.mlProbabilityValue.textContent = "--";
    els.ruleScoreValue.textContent = "--";
    els.flaggedLinksValue.textContent = "--";
    els.subjectValue.textContent = "Open an email message in Gmail, then press Rescan.";
    els.senderValue.textContent = "";
    els.reasonsList.innerHTML = "";
    return;
  }
  setBadge(scan.level);
  els.scoreValue.textContent = String(scan.score ?? "--");
  els.mlProbabilityValue.textContent = `${Math.round((scan.mlProbability || 0) * 100)}%`;
  els.ruleScoreValue.textContent = String(scan.ruleScore ?? "--");
  els.flaggedLinksValue.textContent = `${scan.stats?.flaggedLinks ?? 0}/${scan.stats?.totalLinks ?? 0}`;
  els.subjectValue.textContent = `Subject: ${scan.subject || "No subject"}`;
  els.senderValue.textContent = `Sender: ${scan.sender || "Unknown sender"}`;
  els.reasonsList.innerHTML = (scan.reasons || []).slice(0, 6).map((reason) => `<li>${escapeHtml(reason)}</li>`).join("") || "<li>No strong indicators found.</li>";
}
function renderHistory(history) {
  if (!history?.length) {
    els.historyList.innerHTML = '<p class="empty">No saved scans yet.</p>';
    return;
  }
  els.historyList.innerHTML = history.slice(0, 8).map((entry) => {
    const time = new Date(entry.scannedAt).toLocaleString();
    const badgeClass = entry.level === "High" ? "badge--high" : entry.level === "Medium" ? "badge--medium" : "badge--low";
    return `
      <article class="history-item">
        <div class="row row--space">
          <h3>${escapeHtml(entry.subject || "No subject")}</h3>
          <span class="badge ${badgeClass}">${escapeHtml(entry.level)}</span>
        </div>
        <p class="history-meta">${escapeHtml(entry.sender || "Unknown sender")}</p>
        <p class="history-meta">${time}</p>
        <p class="history-meta">Hybrid ${entry.score} | AI ${Math.round((entry.mlProbability || 0) * 100)}% | Rules ${entry.ruleScore}</p>
      </article>
    `;
  }).join("");
}
async function refreshPopup() {
  const tab = await queryActiveTab();
  const inGmail = !!tab?.url?.startsWith("https://mail.google.com/");
  let liveScan = null;
  if (inGmail && tab?.id) {
    const response = await sendMessageToTab(tab.id, { type: "GET_CURRENT_SCAN" });
    liveScan = response?.scan || null;
  }
  const state = await runtimeMessage({ type: "GET_STATE" });
  renderCurrent(liveScan, inGmail);
  renderHistory(state?.history || []);
}
els.rescanButton.addEventListener("click", async () => {
  const tab = await queryActiveTab();
  if (!tab?.id || !tab?.url?.startsWith("https://mail.google.com/")) {
    renderCurrent(null, false);
    return;
  }
  const response = await sendMessageToTab(tab.id, { type: "RUN_SCAN" });
  const state = await runtimeMessage({ type: "GET_STATE" });
  renderCurrent(response?.scan || null, true);
  renderHistory(state?.history || []);
});
els.clearHistoryButton.addEventListener("click", async () => {
  await runtimeMessage({ type: "CLEAR_HISTORY" });
  refreshPopup();
});
refreshPopup();