(() => {
  const BANNER_ID = "phishguard-ai-banner";
  let currentScan = null;
  let lastSignature = "";
  let scanTimer = null;
  function isVisible(element) {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }
  function unique(items) {
    return [...new Set(items.filter(Boolean))];
  }
  function findMessageBodies() {
    const selectors = [".adn.ads .a3s", ".adn .a3s", "div.a3s.aiL", "div.ii.gt"];
    return unique(selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)))).filter(isVisible);
  }
  function findEmailContainer() {
    return document.querySelector(".adn.ads") || document.querySelector(".adn") || findMessageBodies()[0]?.closest(".nH") || document.querySelector('div[role="main"]') || document.body;
  }
  function getSubject() {
    const node = Array.from(document.querySelectorAll("h2.hP, h2[data-thread-perm-id], .ha h2")).find(isVisible);
    return node ? node.innerText.trim() : "No subject";
  }
  function getSender() {
    const node = Array.from(document.querySelectorAll(".gD[email], .gD")).find(isVisible);
    if (!node) return "Unknown sender";
    return node.getAttribute("email") || node.getAttribute("name") || node.textContent.trim();
  }
  function collectEmailData() {
    const bodies = findMessageBodies();
    if (!bodies.length) return null;
    const subject = getSubject();
    const sender = getSender();
    const primaryBody = bodies[bodies.length - 1];
    const text = (primaryBody.innerText || "").replace(/\s+/g, " ").trim();
    const links = Array.from(primaryBody.querySelectorAll("a[href]"))
      .filter((link) => !link.closest("#" + BANNER_ID))
      .map((link) => ({
        href: link.href,
        text: (link.innerText || link.textContent || "").trim()
      }));
    return {
      subject,
      sender,
      text,
      links,
      snippet: text.slice(0, 180)
    };
  }
  function getSeverityClass(level) {
    if (level === "High") return "pg-high";
    if (level === "Medium") return "pg-medium";
    return "pg-low";
  }
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  function clearHighlights() {
    document.querySelectorAll("a[data-phishguard-flag='true']").forEach((link) => {
      link.removeAttribute("data-phishguard-flag");
      link.removeAttribute("data-phishguard-level");
      link.removeAttribute("title");
      link.classList.remove("pg-flagged-link", "pg-high", "pg-medium", "pg-low");
    });
  }
  function applyHighlights(scan) {
    clearHighlights();
    const suspiciousByHref = new Map(scan.suspiciousLinks.map((item) => [item.href, item]));
    findMessageBodies().forEach((body) => {
      body.querySelectorAll("a[href]").forEach((link) => {
        const match = suspiciousByHref.get(link.href);
        if (!match) return;
        link.dataset.phishguardFlag = "true";
        link.dataset.phishguardLevel = scan.level;
        link.title = `PhishGuard AI: ${match.reasons.join(" | ")}`;
        link.classList.add("pg-flagged-link", getSeverityClass(scan.level));
      });
    });
  }
  function renderBanner(scan) {
    const container = findEmailContainer();
    if (!container) return;
    let banner = document.getElementById(BANNER_ID);
    if (!banner) {
      banner = document.createElement("div");
      banner.id = BANNER_ID;
      banner.className = "pg-banner";
      container.prepend(banner);
    }
    const reasonsHtml = (scan.reasons || []).slice(0, 5).map((reason) => `<li>${escapeHtml(reason)}</li>`).join("");
    banner.innerHTML = `
      <div class="pg-top">
        <div class="pg-top__left">
          <div class="pg-pill ${getSeverityClass(scan.level)}">${scan.level} risk</div>
          <div>
            <div class="pg-title">PhishGuard AI score: ${scan.score}/100</div>
            <div class="pg-meta">Subject: ${escapeHtml(scan.subject)} | Sender: ${escapeHtml(scan.sender)}</div>
          </div>
        </div>
        <button class="pg-button" type="button" data-phishguard-action="rescan">Rescan</button>
      </div>
      <div class="pg-grid">
        <div class="pg-stat">
          <span>AI probability</span>
          <strong>${Math.round(scan.mlProbability * 100)}%</strong>
        </div>
        <div class="pg-stat">
          <span>Rule score</span>
          <strong>${scan.ruleScore}</strong>
        </div>
        <div class="pg-stat">
          <span>Flagged links</span>
          <strong>${scan.stats.flaggedLinks}/${scan.stats.totalLinks}</strong>
        </div>
        <div class="pg-stat">
          <span>Trusted-link ratio</span>
          <strong>${Math.round((scan.stats.trustedRatio || 0) * 100)}%</strong>
        </div>
      </div>
      <div class="pg-body">
        <strong>Why it was scored this way</strong>
        <ul>${reasonsHtml || "<li>No strong indicators found.</li>"}</ul>
      </div>
    `;
  }
  function removeBanner() {
    document.getElementById(BANNER_ID)?.remove();
    clearHighlights();
  }
  function buildSignature(data) {
    return [data.subject, data.sender, data.links.slice(0, 5).map((item) => item.href).join("|"), data.text.slice(0, 260)].join("||");
  }
  function saveScan(scan) {
    chrome.runtime.sendMessage({ type: "SAVE_SCAN", scan }, () => {
      void chrome.runtime.lastError;
    });
  }
  function runScan(options = {}) {
    const { force = false, save = true } = options;
    const emailData = collectEmailData();
    if (!emailData) {
      currentScan = null;
      lastSignature = "";
      removeBanner();
      return null;
    }
    const signature = buildSignature(emailData);
    if (!force && signature === lastSignature && currentScan) {
      return currentScan;
    }
    const scan = window.PhishGuardRules.analyseEmail(emailData);
    scan.snippet = emailData.snippet;
    currentScan = scan;
    lastSignature = signature;
    applyHighlights(scan);
    renderBanner(scan);
    if (save) saveScan(scan);
    return currentScan;
  }
  function scheduleScan(force = false) {
    window.clearTimeout(scanTimer);
    scanTimer = window.setTimeout(() => runScan({ force }), 750);
  }
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "GET_CURRENT_SCAN") {
      sendResponse({ scan: currentScan || runScan({ force: false, save: false }) });
      return true;
    }
    if (message?.type === "RUN_SCAN") {
      sendResponse({ scan: runScan({ force: true, save: true }) });
      return true;
    }
    return false;
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-phishguard-action='rescan']");
    if (!trigger) return;
    event.preventDefault();
    runScan({ force: true, save: true });
  });
  const observer = new MutationObserver(() => scheduleScan(false));
  observer.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => runScan({ force: true, save: true }), 1300);
})();