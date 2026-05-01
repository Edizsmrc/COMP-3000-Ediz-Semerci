(() => {
  const MODEL = {"intercept": -0.7417540123160242, "threshold": 0.55, "token_features": ["00", "000", "01", "10", "11", "12", "15", "20", "2000", "2001", "30", "about", "address", "after", "all", "also", "am", "am to", "an", "and", "and the", "any", "are", "as", "at", "at the", "attached", "available", "back", "be", "because", "been", "before", "being", "below", "best", "business", "but", "by", "by the", "call", "can", "cc", "cc subject", "click", "com", "company", "contact", "could", "date", "day", "do", "do not", "does", "don", "each", "ect", "ect ect", "email", "enron", "fax", "find", "first", "following", "for", "for the", "for your", "forward", "forwarded", "forwarded by", "free", "from", "from the", "future", "get", "give", "go", "good", "great", "group", "had", "has", "has been", "have", "have been", "he", "help", "here", "his", "hou", "hou ect", "how", "http", "http www", "if", "if you", "in", "in the", "information", "into", "is", "is not", "is the", "it", "it is", "its", "just", "kaminski", "know", "last", "let", "let me", "like", "like to", "list", "ll", "look", "made", "mail", "make", "many", "may", "me", "me know", "message", "money", "more", "most", "much", "my", "name", "need", "need to", "new", "next", "no", "not", "now", "number", "of", "of the", "of this", "of your", "offer", "office", "on", "on the", "one", "online", "only", "or", "order", "original", "other", "our", "out", "over", "people", "phone", "please", "pm", "pm to", "price", "provide", "questions", "re", "receive", "regards", "research", "see", "send", "sent", "should", "site", "so", "some", "still", "subject", "subject re", "such", "system", "take", "th", "than", "thank", "thank you", "thanks", "that", "that the", "that you", "the", "the following", "their", "them", "then", "there", "these", "they", "think", "this", "this is", "those", "through", "time", "to", "to be", "to get", "to the", "to you", "today", "two", "under", "up", "us", "use", "very", "vince", "want", "want to", "was", "way", "we", "we are", "we have", "week", "well", "were", "what", "when", "where", "which", "who", "will", "will be", "with", "with the", "within", "work", "world", "would", "would be", "would like", "www", "year", "you", "you are", "you can", "you have", "you will", "your"], "token_weights": [-0.290777829068273, 0.43056911879854654, -1.2109893206083293, 0.186329833929756, -0.32857788527708626, -0.371668193572247, -0.40948784963995555, 0.08127872604715111, -1.7571971026760544, -2.919169810158923, -0.3893438445887266, -0.48858242391127704, -0.29228690573189886, 0.36562490991884844, 0.49382479814649355, -0.387925836760351, -0.2754900985625029, -2.397950818789502, 0.01706998581952281, -0.2109073116868976, -0.26421739932242366, -0.07269645760086538, -0.33510369698880327, -0.12746577801515388, -0.3551704578895805, -0.3892984280587686, -2.035777913883421, -0.28396803255280345, -0.4283418718994257, 0.22473926934301303, -0.3635939527494645, 0.12876655887720015, 0.21711775202471748, 0.08951616599616716, 0.30012885318615595, 0.853305648424574, 0.5251503526458599, -0.4231891604301448, 0.01987135824773016, 0.15217645218166106, 0.024384610135741922, -0.3070083340635145, 0.17403433237846302, -0.5980569956339444, 1.6816982985742215, 1.4231439352962711, 1.2096464145877803, 0.22269128027400367, 0.0338970226617856, -2.366204338982058, -0.023812203891622714, -0.015576815750605395, 0.5434141278447508, 0.00013471169677227711, -0.03639457388108642, -0.39819497447631264, -1.2787991290558665, -0.7376140762006891, 0.9493072215563763, -10.837622489177145, -1.7208286717963452, -0.43900734984233464, -0.3373355966183352, -0.8477813649779499, 0.025713463628624148, -0.8303002098615269, 0.07611298154204328, -0.21729953693048756, -1.4434862127993575, -0.6437746298155876, 0.3739377905863189, -0.03923098602414784, -0.25214675746546844, 0.7543666568102806, 0.504078370714271, -0.23693041291047906, 0.1595683658311026, -0.09662082721772564, 0.26075114771119556, -1.3506270613691491, 0.1702626474898907, -0.11691706695244782, -0.08153189714835161, -0.09309520407250899, 0.4242937780196433, 0.18114495211900666, 0.13461871278194815, 0.8498095915356412, 0.5176725549941811, 1.1424760868686594, -0.7670456958027708, 0.0029482651469160083, 2.099117976984347, -1.275673255307511, -0.6301394662948436, 0.3332702926085109, -0.12870221809191398, 0.0033409483049607214, 0.2611397375856835, -0.18744461201869428, -0.1493938709270006, 0.4375955394768881, -0.14156842970203326, -0.037561364503974556, 0.19998076030601425, -0.07790585475378398, 0.1407132440056783, -4.636801486244185, -0.1953165591959381, -0.05543837358447572, -0.4190383793100689, -0.1981389458076489, 0.08591919136504972, 0.20018729632706267, -0.7042388471564716, -0.6152279197240338, 0.11700170002811096, 0.6567101984223725, 0.36352577559623217, -0.022193885429179168, 0.023039395888355588, 0.03465589059205786, -0.19928520576061787, -0.7953568804825069, 0.34260554436670865, 1.543093909828915, 0.7683831066323894, 0.2635539838133236, -0.04311359508090204, -0.49913775015705464, 0.6530294672032799, 0.4116642103879055, -1.6011536907985533, -0.11675724789679567, 0.01585991919035579, 0.6677270218108673, 0.17754728336266765, 0.4930955625482387, 0.4742860856924994, 0.18869145667085507, -0.2071390679325195, 0.5585437777633726, 0.7237967733101791, 1.7157941360110234, 0.4797428793952689, -0.5005181058714001, -0.48585432591867395, 0.2523400381728108, 1.3169498020593857, 0.7206493758975814, 0.12652913138719274, 0.7887842909552027, 0.04629441153332453, -0.28861471852610965, 1.0133186218008563, 0.3923050892641295, 0.8828626184174357, 0.02565535768596349, 0.2427782454246501, -0.30270044348219777, -1.698067727978645, -1.9039077463112208, 0.4139762667857039, 0.19750933225832187, -1.4793089929174945, -0.0768730152966475, 0.9547192446051694, -0.19934180793792605, -1.7836691187024647, 0.08494012662790348, -0.27609368994333033, -0.268094601956948, -0.49571420207656014, 0.8521373224842015, -0.3817559302233621, -0.5097130754668181, -0.5536517407532696, 1.5148551343155907, 0.4157096985605362, 0.18531493508327926, -0.03314595579447313, -0.22462689743862066, -0.3561398542759575, 0.04625459963125458, -0.0030250538298797593, 0.07486429106859378, -1.6564651385129097, -0.45786543799003904, -0.32055524717678574, 0.20587527689950738, -0.1250367432538757, 0.005923366580615598, -0.004250178316647233, -0.24106182542121052, -0.20654608640602976, -0.4522449726399994, 0.23593083458668723, -0.23291963145094033, -0.6422287034843346, -0.38674213824047776, 0.5831329156201114, -0.8535105506538416, 0.24051095278081214, 0.033965859098645135, 0.2787247093733316, 0.2991566807985654, -0.6509903506343201, -0.4506802916475992, 0.7753128290535232, -0.44917632920758843, -0.4720598401569682, 0.3071155360962918, -0.08235835216633061, 0.5293203593657164, -0.5213165995218734, 0.12368917576777425, -4.874358259954352, 0.8083925689778814, -0.9740808978369909, 0.32097030611277855, 0.4416796018414592, 0.1631169325830197, 0.7694347748475021, 0.49336369063472324, -0.4967775472203446, -0.46144923691920836, 0.1091182689655182, 0.010917250216110702, -0.27519345964162073, -0.5205102231327986, -0.1513729086049532, 0.34855081841810137, -0.6207421979092053, -0.4060158296007844, 0.14934254381293904, -0.09556306992255592, 1.180478961535389, -0.5079045287245161, 0.14788383540818043, -0.2576022522286747, -1.3178970745863487, -0.060822400184600306, 0.09773353305832648, -0.09342938258978471, 0.2809739849052712, 0.6348889564830762, 0.7771788213692107, 0.07317851641521197, 1.2893405551121853, 1.206763209944552], "numeric_names": ["text_length", "url_count", "email_count", "exclamation_count", "question_count", "upper_ratio", "digit_ratio", "urgent_term_count", "credential_term_count", "financial_term_count", "threat_term_count", "link_term_count", "attachment_term_count", "html_signal", "reply_to_signal"], "numeric_weights": [0.5297276374842967, -0.1036810052123064, -0.30015669655528276, 0.24233603948286492, 0.23517937294654273, -0.03646292371786853, 0.4089826308441817, 0.41120489642475144, -0.529920426902603, 0.1471096343073588, 0.10130613303545874, -0.1438867930889473, -0.49887891589853495, 0.025085882009375983, -0.09739676341372056], "means": [1448.9366875084343, 0.378345553506365, 0.22432639107552516, 1.2016553461382753, 1.5867707255634025, 0.022469464985586707, 0.029084619899747196, 0.7126535018667627, 3.5329719760694527, 0.44401961225316, 0.04075390220862759, 1.1166164365075795, 0.36239935225585895, 0.0531240160136746, 0.0005172956682110567], "stds": [3605.957097544235, 2.267696371481503, 0.9168155623631129, 4.66822890142923, 32.29108057394932, 0.0655622691546716, 0.040432253029774275, 2.108056933185614, 11.343955679738553, 2.5196192288346175, 0.29018993845042673, 3.9964345355373445, 1.3571421473390828, 0.22428075025785052, 0.022738251326835702], "friendly_token_labels": {"http": "direct web link language", "https": "direct web link language", "click": "click-focused language", "click here": "click-here call to action", "account": "account-related wording", "verify": "verification wording", "password": "password-related wording", "security": "security warning wording", "offer": "promotional or lure wording", "free": "free offer wording", "money": "financial lure wording", "bank": "banking wording", "invoice": "invoice or billing wording", "billing": "billing wording", "update": "update request wording", "login": "login wording", "subject": "formal subject-line pattern", "com": "commercial domain wording", "mail": "email-related wording", "reply": "reply-trigger wording", "within": "deadline wording", "online": "online-action wording"}, "friendly_numeric_labels": {"text_length": "unusually long message body", "url_count": "many links in the email", "email_count": "many email addresses in the message", "exclamation_count": "heavy exclamation usage", "question_count": "frequent question prompts", "upper_ratio": "high uppercase emphasis", "digit_ratio": "high number density", "urgent_term_count": "urgent wording density", "credential_term_count": "credential-request wording", "financial_term_count": "financial wording density", "threat_term_count": "threat or suspension wording", "link_term_count": "link-focused wording density", "attachment_term_count": "attachment wording density", "html_signal": "HTML-style content markers", "reply_to_signal": "reply-to header wording"}, "metrics": {"threshold": 0.55, "accuracy": 0.9282191205792842, "precision": 0.9039850227333511, "recall": 0.9122807017543859, "f1": 0.908113917248791, "true_negative": 5465, "false_positive": 359, "false_negative": 325, "true_positive": 3380, "train_size": 44462, "test_size": 9529}, "dataset": {"name": "PhishFinderDatasetID.unique.train/test.csv", "source": "angelfonsecar/phishing-compilation", "license": "MIT"}};
  const HIDDEN_SIGNAL_TERMS = new Set(["you","your","to","no","was","and","the","this","that","it","our","of","be","is","are","on","at","for","an","or","as","we","my","if","can","will","also","all","more","one","who"]);
  function sigmoid(value) {
    return 1 / (1 + Math.exp(-value));
  }
  function tokenize(text) {
    return (String(text || "").toLowerCase().match(/[\w:/\.-]{2,}/g) || []);
  }
  function buildBigrams(tokens) {
    const bigrams = [];
    for (let i = 0; i < tokens.length - 1; i += 1) {
      bigrams.push(tokens[i] + " " + tokens[i + 1]);
    }
    return bigrams;
  }
  function extractNumeric(text) {
    const value = String(text || "");
    const low = value.toLowerCase();
    const tokens = low.match(/[a-z0-9']+/g) || [];
    const urlCount = (low.match(/https?:\/\/|www\./g) || []).length;
    const emailCount = (low.match(/[\w\.-]+@[\w\.-]+\.\w+/g) || []).length;
    let uppercase = 0;
    let letters = 0;
    let digits = 0;
    for (const ch of value) {
      if (/[A-Z]/.test(ch)) uppercase += 1;
      if (/[A-Za-z]/.test(ch)) letters += 1;
      if (/[0-9]/.test(ch)) digits += 1;
    }
    return {
      text_length: value.length,
      url_count: urlCount,
      email_count: emailCount,
      exclamation_count: (value.match(/!/g) || []).length,
      question_count: (value.match(/\?/g) || []).length,
      upper_ratio: uppercase / Math.max(letters, 1),
      digit_ratio: digits / Math.max(value.length, 1),
      urgent_term_count: tokens.filter((token) => ["urgent","immediately","asap","now","today","action","required","verify","suspended","limited","alert","attention"].includes(token)).length,
      credential_term_count: tokens.filter((token) => ["password","login","log","in","verify","verification","account","confirm","update","authenticate","security","credential","username","sign"].includes(token)).length,
      financial_term_count: tokens.filter((token) => ["bank","payment","invoice","billing","card","credit","debit","transfer","wire","transaction","wallet"].includes(token)).length,
      threat_term_count: tokens.filter((token) => ["suspend","suspended","locked","disable","disabled","expire","expired","penalty","cancel","cancelled","restricted"].includes(token)).length,
      link_term_count: tokens.filter((token) => ["http","https","www","click","link","url","domain"].includes(token)).length,
      attachment_term_count: tokens.filter((token) => ["attachment","attached","invoice","pdf","document","file","zip","html","htm"].includes(token)).length,
      html_signal: /html|href=|<a\b/.test(low) ? 1 : 0,
      reply_to_signal: low.includes("reply-to") ? 1 : 0
    };
  }
  function analyseText(text) {
    const value = String(text || "");
    const tokens = tokenize(value);
    const allTerms = new Set(tokens);
    for (const bigram of buildBigrams(tokens)) {
      allTerms.add(bigram);
    }
    const numeric = extractNumeric(value);
    const contributions = [];
    let score = MODEL.intercept;
    for (let i = 0; i < MODEL.token_features.length; i += 1) {
      const term = MODEL.token_features[i];
      if (!allTerms.has(term)) continue;
      const weight = MODEL.token_weights[i];
      score += weight;
      contributions.push({
        source: "text",
        name: term,
        label: MODEL.friendly_token_labels[term] || `text signal: ${term}`,
        value: 1,
        weight,
        contribution: weight
      });
    }
    for (let i = 0; i < MODEL.numeric_names.length; i += 1) {
      const name = MODEL.numeric_names[i];
      const rawValue = numeric[name];
      const z = (rawValue - MODEL.means[i]) / MODEL.stds[i];
      const weight = MODEL.numeric_weights[i];
      const contribution = z * weight;
      score += contribution;
      if (Math.abs(contribution) >= 0.18) {
        contributions.push({
          source: "numeric",
          name,
          label: MODEL.friendly_numeric_labels[name] || name,
          value: rawValue,
          weight,
          contribution
        });
      }
    }
    contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
    const probability = sigmoid(score);
    const positiveSignals = contributions
      .filter((item) => item.contribution > 0)
      .filter((item) => !(item.source === "text" && HIDDEN_SIGNAL_TERMS.has(item.name)))
      .slice(0, 6);
    const negativeSignals = contributions
      .filter((item) => item.contribution < 0)
      .filter((item) => !(item.source === "text" && HIDDEN_SIGNAL_TERMS.has(item.name)))
      .slice(0, 4);
    return {
      probability,
      threshold: MODEL.threshold,
      label: probability >= MODEL.threshold ? "phishing" : "ham",
      topSignals: positiveSignals,
      reassuringSignals: negativeSignals,
      numeric,
      rawScore: score,
      metrics: MODEL.metrics
    };
  }
  window.PhishGuardAI = {
    analyseText,
    model: MODEL
  };
})();
