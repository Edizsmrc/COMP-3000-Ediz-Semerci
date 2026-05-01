const HISTORY_LIMIT = 30;
chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(["history", "latestScan"]);
  await chrome.storage.local.set({
    history: Array.isArray(existing.history) ? existing.history : [],
    latestScan: existing.latestScan || null
  });
  await chrome.action.setBadgeText({ text: "" });
});
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    if (message?.type === "SAVE_SCAN") {
      const scan = message.scan;
      if (!scan) {
        sendResponse({ ok: false, error: "Missing scan payload." });
        return;
      }
      const { history = [] } = await chrome.storage.local.get(["history"]);
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        scannedAt: scan.scannedAt,
        subject: scan.subject || "No subject",
        sender: scan.sender || "Unknown sender",
        score: scan.score,
        mlScore: scan.mlScore,
        ruleScore: scan.ruleScore,
        mlProbability: scan.mlProbability,
        level: scan.level,
        reasons: scan.reasons || [],
        flaggedLinks: scan.stats?.flaggedLinks || 0,
        totalLinks: scan.stats?.totalLinks || 0,
        snippet: scan.snippet || ""
      };
      const nextHistory = [entry, ...history].slice(0, HISTORY_LIMIT);
      await chrome.storage.local.set({
        latestScan: entry,
        history: nextHistory
      });
      await chrome.action.setBadgeText({ text: entry.level === "High" ? "H" : entry.level === "Medium" ? "M" : entry.level === "Low" ? "L" : "" });
      await chrome.action.setBadgeBackgroundColor({ color: entry.level === "High" ? "#c62828" : entry.level === "Medium" ? "#ef6c00" : "#2e7d32" });
      await chrome.action.setTitle({ title: `PhishGuard AI - ${entry.level} risk (${entry.score})` });
      sendResponse({ ok: true, entry });
      return;
    }
    if (message?.type === "GET_STATE") {
      const state = await chrome.storage.local.get(["history", "latestScan"]);
      sendResponse({
        ok: true,
        history: state.history || [],
        latestScan: state.latestScan || null
      });
      return;
    }
    if (message?.type === "CLEAR_HISTORY") {
      await chrome.storage.local.set({ history: [], latestScan: null });
      await chrome.action.setBadgeText({ text: "" });
      sendResponse({ ok: true });
      return;
    }
    sendResponse({ ok: false, error: "Unknown message type." });
  })().catch((error) => {
    sendResponse({ ok: false, error: error?.message || String(error) });
  });
  return true;
});