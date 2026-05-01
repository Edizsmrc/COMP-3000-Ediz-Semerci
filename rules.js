(() => {
  const TRUSTED_BASE_DOMAINS = new Set([
    "google.com",
    "google.co.uk",
    "gmail.com",
    "googleusercontent.com",
    "googleapis.com",
    "gstatic.com",
    "youtube.com",
    "microsoft.com",
    "office.com",
    "office365.com",
    "outlook.com",
    "live.com",
    "apple.com",
    "amazon.com",
    "paypal.com",
    "github.com",
    "linkedin.com",
    "dropbox.com",
    "adobe.com"
  ]);
  const SUSPICIOUS_TLDS = new Set(["zip", "top", "shop", "xyz", "click", "gq", "work", "country", "kim", "link"]);
  const PATH_KEYWORDS = ["login", "verify", "secure", "account", "password", "signin", "reset", "update", "wallet", "payment", "billing"];
  const URGENCY_WORDS = ["urgent", "immediately", "asap", "today", "now", "verify", "warning", "alert", "limited", "deadline"];
  const THREAT_WORDS = ["suspended", "locked", "disabled", "expired", "expire", "penalty", "restricted"];
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function sigmoid(value) {
    return 1 / (1 + Math.exp(-value));
  }
  function isVisibleValue(value) {
    return String(value || "").trim().length > 0;
  }
  function getHostname(value) {
    try {
      return new URL(value).hostname.toLowerCase();
    } catch {
      return "";
    }
  }
  function getBaseDomain(hostname) {
    const host = String(hostname || "").toLowerCase().replace(/^www\./, "");
    if (!host) return "";
    const parts = host.split(".").filter(Boolean);
    if (parts.length <= 2) return host;
    const special = new Set(["co.uk", "org.uk", "gov.uk", "ac.uk", "com.au", "co.nz"]);
    const tail = parts.slice(-2).join(".");
    if (special.has(tail) && parts.length >= 3) {
      return parts.slice(-3).join(".");
    }
    return parts.slice(-2).join(".");
  }
  function parseDisplayedDomain(text) {
    const match = String(text || "").toLowerCase().match(/([a-z0-9-]+\.[a-z]{2,})(?!.*[a-z0-9-]+\.[a-z]{2,})/i);
    return match ? match[1].toLowerCase() : "";
  }
  function extractSenderDomain(sender) {
    const match = String(sender || "").match(/[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})/i);
    return match ? match[1].toLowerCase() : "";
  }
  function scoreTextUrgency(text) {
    const low = String(text || "").toLowerCase();
    const tokens = low.match(/[a-z0-9']+/g) || [];
    const urgencyCount = tokens.filter((token) => URGENCY_WORDS.includes(token)).length;
    const threatCount = tokens.filter((token) => THREAT_WORDS.includes(token)).length;
    let score = 0;
    const reasons = [];
    if (urgencyCount >= 2) {
      score += 10;
      reasons.push("Urgent action language detected in the email body.");
    }
    if (threatCount >= 1) {
      score += 10;
      reasons.push("Threat or suspension language detected.");
    }
    return { score, reasons };
  }
  function analyseLink(link) {
    const href = String(link?.href || "");
    const text = String(link?.text || "").trim();
    if (!href || href.startsWith("mailto:")) {
      return { href, text, score: 0, reasons: [], baseDomain: "", trusted: false };
    }
    let score = 0;
    const reasons = [];
    let hostname = "";
    try {
      const url = new URL(href);
      hostname = url.hostname.toLowerCase();
      const baseDomain = getBaseDomain(hostname);
      const trusted = TRUSTED_BASE_DOMAINS.has(baseDomain);
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
        score += 28;
        reasons.push("Link uses a raw IP address instead of a named domain.");
      }
      if (hostname.includes("xn--")) {
        score += 18;
        reasons.push("Link uses punycode, which can hide lookalike domains.");
      }
      if (url.protocol !== "https:") {
        score += 10;
        reasons.push("Link does not use HTTPS.");
      }
      if (hostname.split(".").length > 4) {
        score += 9;
        reasons.push("Link uses an unusually deep subdomain structure.");
      }
      const tld = hostname.split(".").pop() || "";
      if (SUSPICIOUS_TLDS.has(tld)) {
        score += 12;
        reasons.push("Link uses a top-level domain often associated with abuse.");
      }
      if (href.length > 120) {
        score += 8;
        reasons.push("Link is unusually long.");
      }
      if (href.includes("@")) {
        score += 14;
        reasons.push("Link contains an @ character, which can obscure the real destination.");
      }
      const displayedDomain = parseDisplayedDomain(text);
      if (displayedDomain && !hostname.includes(displayedDomain) && !trusted) {
        score += 20;
        reasons.push("Displayed link text does not match the real destination domain.");
      }
      if (!trusted) {
        const lowerHref = href.toLowerCase();
        const matchedPathKeywords = PATH_KEYWORDS.filter((keyword) => lowerHref.includes(keyword));
        if (matchedPathKeywords.length >= 2) {
          score += 10;
          reasons.push("Link path contains multiple credential-related terms.");
        } else if (matchedPathKeywords.length === 1) {
          score += 5;
          reasons.push("Link path contains credential-related wording.");
        }
      }
      return { href, text, score: clamp(score, 0, 100), reasons, baseDomain, trusted, hostname };
    } catch {
      return { href, text, score: 12, reasons: ["Link could not be parsed safely."], baseDomain: "", trusted: false, hostname: "" };
    }
  }
  function summariseRuleSignals(emailData) {
    const linkAnalyses = (emailData.links || []).map(analyseLink);
    const suspiciousLinks = linkAnalyses.filter((item) => item.score >= 18);
    const trustedLinks = linkAnalyses.filter((item) => item.trusted);
    const senderDomain = extractSenderDomain(emailData.sender);
    const senderBaseDomain = getBaseDomain(senderDomain);
    const senderTrusted = TRUSTED_BASE_DOMAINS.has(senderBaseDomain);
    const textSignals = scoreTextUrgency(emailData.text || "");
    const linkScore = suspiciousLinks.reduce((max, item) => Math.max(max, item.score), 0);
    let ruleScore = clamp(linkScore + textSignals.score, 0, 100);
    const reasons = [];
    suspiciousLinks.slice(0, 4).forEach((item) => {
      item.reasons.slice(0, 2).forEach((reason) => reasons.push(reason));
    });
    textSignals.reasons.forEach((reason) => reasons.push(reason));
    const trustedRatio = linkAnalyses.length ? trustedLinks.length / linkAnalyses.length : 0;
    if (senderTrusted && trustedRatio === 1 && suspiciousLinks.length === 0) {
      ruleScore = Math.max(0, ruleScore - 20);
      reasons.push("Sender and visible links are from trusted domains.");
    }
    return {
      ruleScore,
      reasons,
      suspiciousLinks,
      totalLinks: linkAnalyses.length,
      trustedRatio,
      senderTrusted,
      senderDomain: senderBaseDomain,
      linkAnalyses
    };
  }
  function buildLevel(score) {
    if (score >= 70) return "High";
    if (score >= 40) return "Medium";
    return "Low";
  }
  function dedupe(items) {
    return [...new Set((items || []).filter(Boolean))];
  }
  function analyseEmail(emailData) {
    const ai = window.PhishGuardAI.analyseText(emailData.text || "");
    const rules = summariseRuleSignals(emailData);
    const mlScore = Math.round(ai.probability * 100);
    let finalScore = Math.round(mlScore * 0.65 + rules.ruleScore * 0.35);
    if (rules.suspiciousLinks.length > 0 && ai.probability >= 0.55) {
      finalScore += 8;
    }
    if (rules.suspiciousLinks.length === 0 && rules.trustedRatio === 1) {
      finalScore = Math.min(finalScore, 36);
    }
    if (rules.senderTrusted && rules.suspiciousLinks.length === 0) {
      finalScore = Math.min(finalScore, 32);
    }
    if ((emailData.links || []).length === 0 && ai.probability < 0.7) {
      finalScore = Math.min(finalScore, 58);
    }
    finalScore = clamp(finalScore, 0, 100);
    const reasons = [];
    ai.topSignals.slice(0, 4).forEach((signal) => {
      reasons.push(`ML signal: ${signal.label}.`);
    });
    rules.reasons.slice(0, 4).forEach((reason) => reasons.push(reason));
    if (!reasons.length) {
      reasons.push("No strong phishing indicators were found in the visible content.");
    }
    const level = buildLevel(finalScore);
    return {
      subject: emailData.subject || "No subject",
      sender: emailData.sender || "Unknown sender",
      score: finalScore,
      mlScore,
      ruleScore: rules.ruleScore,
      mlProbability: Number(ai.probability.toFixed(4)),
      level,
      reasons: dedupe(reasons).slice(0, 6),
      suspiciousLinks: rules.suspiciousLinks,
      aiSignals: ai.topSignals,
      reassuringSignals: ai.reassuringSignals,
      stats: {
        totalLinks: rules.totalLinks,
        flaggedLinks: rules.suspiciousLinks.length,
        trustedRatio: Number(rules.trustedRatio.toFixed(2))
      },
      senderDomain: rules.senderDomain,
      scannedAt: new Date().toISOString()
    };
  }
  window.PhishGuardRules = {
    analyseEmail
  };
})();