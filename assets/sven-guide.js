/* ============================================
   Sven Guide — AI-Powered Website Assistant
   Marketing mit Sven (MMS) V2
   Tier 1: Instant FAQ (local, 0ms)
   Tier 2: Agent AI (backend workflow, ~8s)
   ============================================ */

(function() {
  'use strict';

  // === CONFIG ===
  var STORAGE_KEY = 'mms_guide_greeted';
  var SESSION_KEY = 'mms_guide_seen';
  var REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CHAT_BACKEND_URL = 'https://base44.app/api/apps/6a80e0cfdd160038b7d6dfdb/functions/chatSubmit';

  // === FAQ KNOWLEDGE BASE (Tier 1) ===
  var FAQ_DATA = [
    {
      keywords: ['wer ist sven', 'was macht sven', 'sven preuss', 'sven preuß', 'was machst du', 'über sven', 'person', 'hintergrund'],
      answer: 'Sven Preuß ist AI Business Systems Specialist & Search Growth Operations Expert aus Tettnang. Er verbindet KI, Low-Code-Entwicklung, Performance Marketing und SEO/GEO/AEO zu messbaren Geschäftserfolgen.',
      link: 'ueber-mich.html',
      linkLabel: 'Mehr über Sven →'
    },
    {
      keywords: ['kontakt', 'kontaktieren', 'email', 'e-mail', 'mail', 'erreichen', 'anfrage', 'kontakt aufnehmen'],
      answer: 'Du erreichst Sven per E-Mail an marketingmitsven@gmail.com, telefonisch unter +49 151 123 68 919 oder über die Kontakt-Seite. Er antwortet in der Regel innerhalb von 24 Stunden.',
      link: 'kontakt.html',
      linkLabel: 'Kontakt-Seite →'
    },
    {
      keywords: ['telefon', 'anrufen', 'nummer', 'handy', 'mobil', 'phone'],
      answer: 'Svens Telefonnummer ist +49 151 123 68 919. Am besten erreichst du ihn werktags zwischen 9 und 18 Uhr.',
      link: 'kontakt.html',
      linkLabel: 'Kontakt-Seite →'
    },
    {
      keywords: ['linkedin', 'xing', 'business network', 'profil'],
      answer: 'Svens LinkedIn-Profil findest du unter linkedin.com/in/sven-preuss. Vernetzungen und Anfragen sind immer willkommen.',
      link: 'https://linkedin.com/in/sven-preuss',
      linkLabel: 'LinkedIn Profil →'
    },
    {
      keywords: ['github', 'code', 'repository', 'open source'],
      answer: 'Svens GitHub-Profil ist github.com/preussdigital-netizen. Dort teilt er Code und Projekte rund um AI Business Systems und Automation.',
      link: 'https://github.com/preussdigital-netizen',
      linkLabel: 'GitHub Profil →'
    },
    {
      keywords: ['standort', 'wohnt', 'wo', 'ort', 'stadt', 'remote', 'tettnang', 'bundesland'],
      answer: 'Sven lebt und arbeitet in Tettnang (Baden-Württemberg). Er arbeitet sowohl vor Ort als auch vollständig remote mit Kunden in ganz Europa.',
      link: 'kontakt.html',
      linkLabel: 'Kontakt →'
    },
    {
      keywords: ['ai business systems', 'ai systems', 'ki systems', 'business system', 'ai geschäft'],
      answer: 'AI Business Systems ist Svens Kernkompetenz: Er baut operative KI-Infrastruktur aus Prompt Engineering, Low-Code-Apps, automatisierten Workflows und KI-Ethik — damit KI im Unternehmen tatsächlich Wertschöpfung generiert.',
      link: 'ai-business-systems.html',
      linkLabel: 'AI Business Systems →'
    },
    {
      keywords: ['missionos', 'mission os', 'multi-agent', 'agent system', 'agent orchestration'],
      answer: 'MissionOS ist Svens eigenes AI-/Automation-Konzept: Ein Multi-Agent-System, das KI-Agenten, Workflows und Human-in-the-Loop-Freigaben orchestriert. Es verbindet Prompt Engineering, Low-Code und Automations-Pipelines zu einem operativen Gesamtsystem.',
      link: 'ai-business-systems.html',
      linkLabel: 'Mehr zu MissionOS →'
    },
    {
      keywords: ['projekte', 'project', 'cases', 'referenzen', 'arbeit', 'portfolio', 'beispiele'],
      answer: 'Svens Projekte umfassen ein AI Multi-Agent Content System, ein Telegram AI Control Center, AI Chatbots & Voice Assistants, AI Workflow Automation und ein AI Search Portfolio. Alle Cases findest du auf der Projekte-Seite.',
      link: 'projekte.html',
      linkLabel: 'Alle Projekte →'
    },
    {
      keywords: ['zertifikate', 'zertifikat', 'zertifiziert', 'nachweise', 'pruefung', 'prüfung', 'ihk', 'bvdw', 'google ads', 'ibm', 'santander'],
      answer: 'Sven hat 18 akkreditierte Zertifikate, darunter IHK KI Anwender, BVDW SEO Certified Professional, Google Ads & Analytics, IBM/KI-Campus (Deep Learning & Watson) und Santander Open Academy. Alle Nachweise stehen auf der Expertise-Seite.',
      link: 'expertise.html#certificates',
      linkLabel: 'Alle Zertifikate →'
    },
    {
      keywords: ['tools', 'toolstack', 'software', 'plattformen', 'technologie', 'tech stack', 'programme'],
      answer: 'Sven nutzt AI & LLMs (Claude, ChatGPT, Gemini, Perplexity), Low-Code-Builder (Base44, Lovable, Figma Make), Automation (Make, Zapier, n8n), Performance Marketing (Google Ads, Meta Ads), SEO-Tools (Sistrix, Semrush) und Analytics (GA4, Looker Studio).',
      link: 'expertise.html#tools',
      linkLabel: 'Vollständiger Toolstack →'
    },
    {
      keywords: ['methode', 'methodik', 'prozess', 'vorgehen', 'arbeitsweise', '5 schritte', 'beobachten', 'verstehen', 'testen'],
      answer: 'Sven arbeitet nach einer 5-Schritt-Methode: 1. Beobachten 2. Verstehen 3. Testen 4. Dokumentieren 5. Daraus lernen. Diese Methode stellt sicher, dass Lösungen datenbasiert und nachhaltig sind — nicht nur Symptome behandelt werden.',
      link: 'expertise.html#methodik',
      linkLabel: 'Methodik ansehen →'
    },
    {
      keywords: ['lebenslauf', 'cv', 'resume', 'werdegang', 'laufbahn', 'download lebenslauf'],
      answer: 'Svens Lebenslauf ist als PDF, TXT und JSON verfügbar. Der PDF-Lebenslauf "AI Business Systems Specialist" kann direkt heruntergeladen werden. Alle Formate findest du auf der Career-Seite.',
      link: 'career.html',
      linkLabel: 'Career-Seite →'
    },
    {
      keywords: ['rekrutierer', 'recruiter', 'bewerbung', 'job', 'stelle', 'position', 'einstellung', 'headhunter'],
      answer: 'Recruiter finden alle wichtigen Eckdaten, CV-Downloads und einen Mutual-Fit-Prozess auf der Recruiter-Mode-Seite. Sven ist offen für Positionen im Bereich AI Business Systems, Automation und Digital Marketing.',
      link: 'recruiter-mode.html',
      linkLabel: 'Recruiter Mode →'
    },
    {
      keywords: ['ausbildung', 'schulung', 'umschulung', 'mod academy', 'moD', 'studium', 'bildung'],
      answer: 'Sven hat eine Umschulung zum "AI Powered Full Funnel Online Marketing Manager" an der MoD Academy absolviert (1300 Lerneinheiten). Zuvor war er als Bäcker und Airbrushdesigner tätig — eine ungewöhnliche, aber wertvolle Kombination aus Handwerk und Kreativität.',
      link: 'career.html',
      linkLabel: 'Werdegang ansehen →'
    },
    {
      keywords: ['seo', 'suchmaschinenoptimierung', 'google ranking', 'sichtbarkeit'],
      answer: 'Sven ist BVDW SEO Certified Professional und deckt alles ab: Technisches SEO, Content-Strategie, GEO/AEO (AI-Search-Optimization) und Performance-Tracking. Sein Ziel: Nachhaltige Sichtbarkeit, nicht kurzfristige Tricks.',
      link: 'expertise.html',
      linkLabel: 'SEO-Expertise →'
    },
    {
      keywords: ['geo', 'aeo', 'ai search', 'ai suche', 'generative search', 'llm seo'],
      answer: 'GEO/AEO (Generative Engine Optimization / AI Engine Optimization) ist die Weiterentwicklung von SEO für die KI-Ära: Inhalte so strukturieren, dass KI-Suchsysteme wie ChatGPT, Perplexity und Google AI Overviews sie finden und zitieren. Sven ist einer der ersten deutschen Experten auf diesem Gebiet.',
      link: 'expertise.html',
      linkLabel: 'Mehr zu GEO/AEO →'
    },
    {
      keywords: ['performance marketing', 'google ads', 'meta ads', 'werbung', 'kampagne', 'paid', 'paid ads'],
      answer: 'Sven ist zertifiziert in Google Ads, GA4, Campaign Manager 360 und Meta Ads. Er baut datengetriebene Kampagnen mit klarem ROI-Fokus — von der Keyword-Recherche bis zur Conversion-Optimierung.',
      link: 'expertise.html',
      linkLabel: 'Performance Marketing →'
    },
    {
      keywords: ['low-code', 'low code', 'vibe coding', 'no-code', 'app builder', 'base44'],
      answer: 'Low-Code/Vibe Coding ist Svens Ansatz, um schnell funktionsfähige AI-Anwendungen zu bauen. Mit Plattformen wie Base44, Lovable und Figma Make erstellt er Prototypen und Produktions-Apps in Tagen statt Monaten.',
      link: 'ai-business-systems.html',
      linkLabel: 'AI Business Systems →'
    },
    {
      keywords: ['workflow', 'automatisierung', 'automation', 'make.com', 'zapier', 'n8n', 'prozesse'],
      answer: 'Sven automatisiert Geschäftsprozesse durch AI-Agenten, APIs und Cloud-Services. Mit Tools wie Make, Zapier und n8n verbindet er Systeme und eliminierende manuelle Schritte — von der Lead-Generierung bis zur Content-Erstellung.',
      link: 'projekte.html',
      linkLabel: 'Automation-Projekte →'
    },
    {
      keywords: ['prompt engineering', 'prompt', 'ki training', 'llm', 'sprachmodell'],
      answer: 'Prompt Engineering ist die Kunst, KI-Modelle präzise zu steuern. Sven entwickelt strukturierte Prompt-Systeme, die reproduzierbare, qualitativ hochwertige Ergebnisse liefern — Grundlage aller seiner AI Business Systems.',
      link: 'ai-business-systems.html',
      linkLabel: 'Prompt Engineering →'
    },
    {
      keywords: ['chatbot', 'bot', 'voice assistant', 'sprachassistent', 'telefonassistent'],
      answer: 'Sven entwickelt AI-Chatbots und Voice-Assistenten inklusive Terminbuchung über Cal.com. Diese Bots können Kundenanfragen automatisch bearbeiten, Termine buchen und an menschliche Mitarbeiter eskalieren.',
      link: 'projekte.html',
      linkLabel: 'Bot-Projekte →'
    },
    {
      keywords: ['expertise', 'fachbereiche', 'kompetenzen', 'fähigkeiten', 'skills'],
      answer: 'Svens Expertise umfasst 6 Bereiche: AI Business Systems, Low-Code/Vibe Coding, Workflow Automation, Performance Marketing, SEO/GEO/AEO und Analytics/Tracking. Alle Bereiche sind mit Zertifikaten und Projekt-Referenzen belegt.',
      link: 'expertise.html',
      linkLabel: 'Expertise →'
    },
    {
      keywords: ['human in the loop', 'hitl', 'freigabe', 'kontroll'],
      answer: 'Human-in-the-Loop (HITL) ist ein Kernprinzip von Svens AI Systems: KI generiert Inhalte oder Entscheidungen, ein Mensch gibt sie frei. So bleibt die Qualitätssicherung gewährleistet, während die Effizienz durch Automatisierung steigt.',
      link: 'ai-business-systems.html',
      linkLabel: 'Mehr zu HITL →'
    },
    {
      keywords: ['ethik', 'ai ethik', 'verantwortung', 'ki sicherheit', 'eu ai act'],
      answer: 'Sven zertifiziert im EU AI Act und beachtet ethische KI-Prinzipien: Transparenz, Nachvollziehbarkeit und menschliche Kontrolle. KI soll unterstützen, nicht ungeprüft Entscheidungen treffen.',
      link: 'ai-business-systems.html',
      linkLabel: 'AI Ethik →'
    },
    {
      keywords: ['telegram', 'control center', 'steuerung'],
      answer: 'Das Telegram AI Control Center ist eines von Svens Schlüsselprojekten: Eine Telegram-basierte Steuerzentrale zur Verwaltung mehrerer AI-Agenten, Workflows und Automationen — überall verfügbar über Smartphone.',
      link: 'projekte.html',
      linkLabel: 'Telegram Control Center →'
    },
    {
      keywords: ['preise', 'kostet', 'kosten', 'budget', 'stundensatz', 'preis', 'honorar'],
      answer: 'Die Kosten hängen vom Projektumfang ab. Sven bietet sowohl Festpreisprojekte als auch Stunden- oder Retainer-Modelle an. Am besten besprichst du deine Anforderungen direkt über die Kontakt-Seite.',
      link: 'kontakt.html',
      linkLabel: 'Anfrage stellen →'
    },
    {
      keywords: ['verfügbar', 'verfuegbar', 'frei', 'kapazität', 'termin', 'wann', 'lieferzeit'],
      answer: 'Sven ist aktuell für neue Projekte verfügbar. Die Verfügbarkeit ändert sich laufend — am besten fragst du direkt über die Kontakt-Seite an, um einen freien Slot zu sichern.',
      link: 'kontakt.html',
      linkLabel: 'Anfrage →'
    },
    {
      keywords: ['dank', 'danke', 'merci', 'thx', 'thanks'],
      answer: 'Gern! Wenn du weitere Fragen hast, schreib einfach. Ansonsten erreichst du Sven direkt über die Kontakt-Seite. 👋',
      link: 'kontakt.html',
      linkLabel: 'Kontakt →'
    }
  ];

  // === PAGE CONTEXT DETECTION ===
  function getCurrentPage() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    return path;
  }

  function getPageContext(page) {
    switch(page) {
      case 'index.html': return { type: 'home', label: 'Startseite' };
      case 'ueber-mich.html': return { type: 'about', label: 'Über mich' };
      case 'expertise.html': return { type: 'expertise', label: 'Expertise' };
      case 'projekte.html': return { type: 'projects', label: 'Projekte' };
      case 'ai-business-systems.html': return { type: 'ai-systems', label: 'AI Business Systems' };
      case 'career.html': return { type: 'career', label: 'Career' };
      case 'recruiter-mode.html': return { type: 'recruiter', label: 'Recruiter Mode' };
      case 'kontakt.html': return { type: 'contact', label: 'Kontakt' };
      case 'guide.html': return { type: 'guide', label: 'Sven Guide' };
      case 'insights.html': return { type: 'insights', label: 'Insights' };
      default: return { type: 'general', label: 'Marketing mit Sven' };
    }
  }

  // === FAQ MATCHING (Tier 1) ===
  function normalizeText(text) {
    return text.toLowerCase()
      .replace(/[^\w\säöüß]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function matchFAQ(question) {
    var normalized = normalizeText(question);
    var bestMatch = null;
    var bestScore = 0;

    FAQ_DATA.forEach(function(entry) {
      var score = 0;
      entry.keywords.forEach(function(keyword) {
        var kw = normalizeText(keyword);
        if (normalized.includes(kw)) {
          score += kw.length > 4 ? 3 : (kw.length > 2 ? 2 : 1);
        }
        // Also check word-level matches
        var words = normalized.split(' ');
        if (words.indexOf(kw) !== -1) {
          score += 2;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    });

    // Threshold: at least 2 points to match
    return bestScore >= 2 ? bestMatch : null;
  }

  // === CHAT STATE ===
  var chatHistory = [];
  var isProcessing = false;

  function addMessage(role, text, link, linkLabel) {
    chatHistory.push({ role: role, text: text, link: link, linkLabel: linkLabel });
    renderMessages();
  }

  function renderMessages() {
    var chatArea = document.getElementById('sgChatArea');
    if (!chatArea) return;

    var html = '';
    chatHistory.forEach(function(msg) {
      if (msg.role === 'user') {
        html += '<div class="sg-chat-msg sg-chat-user">' + escapeHTML(msg.text) + '</div>';
      } else {
        html += '<div class="sg-chat-msg sg-chat-bot">' + escapeHTML(msg.text);
        if (msg.link) {
          var isExternal = msg.link.indexOf('http') === 0;
          html += ' <a class="sg-chat-link" href="' + msg.link + '"' +
            (isExternal ? ' target="_blank" rel="noopener"' : '') + '>' +
            (msg.linkLabel || 'Mehr →') + '</a>';
        }
        html += '</div>';
      }
    });

    // Typing indicator
    if (isProcessing) {
      html += '<div class="sg-chat-msg sg-chat-bot sg-chat-typing">' +
        '<span class="sg-typing-dot"></span><span class="sg-typing-dot"></span><span class="sg-typing-dot"></span>' +
        '</div>';
    }

    chatArea.innerHTML = html;
    chatArea.scrollTop = chatArea.scrollHeight;

    // Update link click handlers for internal links
    var links = chatArea.querySelectorAll('.sg-chat-link');
    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (link.getAttribute('target') !== '_blank') {
          // Let normal navigation happen
        }
      });
    });
  }

  function escapeHTML(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // === SEND MESSAGE ===
  function sendMessage() {
    var input = document.getElementById('sgChatInput');
    if (!input || isProcessing) return;

    var text = input.value.trim();
    if (!text || text.length > 500) return;

    input.value = '';
    addMessage('user', text);

    // Tier 1: Try FAQ match first (instant)
    var faqMatch = matchFAQ(text);

    if (faqMatch) {
      // Small delay for natural feel
      setTimeout(function() {
        addMessage('bot', faqMatch.answer, faqMatch.link, faqMatch.linkLabel);
      }, 300);
      return;
    }

    // Tier 2: Send to Agent backend
    isProcessing = true;
    renderMessages();

    fetch(CHAT_BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })
    .then(function(response) {
      if (!response.ok && response.status !== 504) {
        throw new Error('Backend error: ' + response.status);
      }
      return response.json();
    })
    .then(function(data) {
      isProcessing = false;
      if (data.response) {
        addMessage('bot', data.response);
      } else {
        addMessage('bot', 'Es tut mir leid, ich konnte keine Antwort generieren. Schreibe Sven direkt an marketingmitsven@gmail.com.', 'kontakt.html', 'Kontakt →');
      }
    })
    .catch(function(err) {
      isProcessing = false;
      addMessage('bot', 'Die Verbindung zum AI-Backend ist gerade nicht verfügbar. Schreibe Sven direkt an marketingmitsven@gmail.com oder nutze die Kontakt-Seite.', 'kontakt.html', 'Kontakt →');
    });
  }

  // === ICON SVGs ===
  function getIcon(name) {
    var icons = {
      user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
      grid: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
      folder: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
      cpu: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>',
      briefcase: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
      award: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
      tool: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
      mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
      download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
      close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
      compass: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>',
      send: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
      sparkles: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"></path></svg>'
    };
    return icons[name] || icons.compass;
  }

  // === QUICK ACTIONS ===
  function getQuickActions(ctx) {
    var actions = [];
    var isRecruiterContext = (ctx.type === 'career' || ctx.type === 'recruiter');

    actions.push({ label: 'Über Sven', icon: 'user', url: 'ueber-mich.html', desc: 'Person & Hintergrund' });
    actions.push({ label: 'Expertise', icon: 'grid', url: 'expertise.html', desc: 'Fachbereiche & Methodik' });
    actions.push({ label: 'Projekte', icon: 'folder', url: 'projekte.html', desc: 'Cases & Entwicklungen' });
    actions.push({ label: 'AI Systems', icon: 'cpu', url: 'ai-business-systems.html', desc: 'KI-Infrastruktur' });

    if (isRecruiterContext) {
      actions.push({ label: 'CV Download', icon: 'download', url: 'assets/Lebenslauf_Sven-Preuss_AI-Business-Systems-Specialist.pdf', desc: 'PDF-Lebenslauf', download: true });
      actions.push({ label: 'Recruiter Mode', icon: 'briefcase', url: 'recruiter-mode.html', desc: 'Kompakte Eckdaten' });
    }

    actions.push({ label: 'Kontakt', icon: 'mail', url: 'kontakt.html', desc: 'E-Mail & Telefon' });

    return actions;
  }

  // === BUILD DOM ===
  function buildGuide() {
    var trigger = document.createElement('button');
    trigger.className = 'sven-guide-trigger';
    trigger.setAttribute('aria-label', 'Sven Guide öffnen');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('type', 'button');
    trigger.id = 'svenGuideTrigger';
    trigger.innerHTML =
      '<span class="sg-trigger-icon">' + getIcon('compass') + '</span>' +
      '<span class="sg-trigger-text">Sven Guide</span>';

    var panel = document.createElement('div');
    panel.className = 'sven-guide-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-label', 'Sven Guide');
    panel.id = 'svenGuidePanel';

    var overlay = document.createElement('div');
    overlay.className = 'sven-guide-overlay';
    overlay.id = 'svenGuideOverlay';

    var ctx = getPageContext(getCurrentPage());

    panel.innerHTML =
      '<div class="sg-header">' +
        '<div class="sg-header-title">' +
          '<span class="sg-header-icon">' + getIcon('sparkles') + '</span>' +
          '<div>' +
            '<div class="sg-header-name">Sven AI Guide</div>' +
            '<div class="sg-header-sub">' + ctx.label + '</div>' +
          '</div>' +
        '</div>' +
        '<button class="sg-close" id="svenGuideClose" aria-label="Schließen" type="button">' +
          getIcon('close') +
        '</button>' +
      '</div>' +
      '<div class="sg-body" id="svenGuideBody">' +
        '<div class="sg-chat-area" id="sgChatArea"></div>' +
        '<div class="sg-chat-input-wrap">' +
          '<input type="text" class="sg-chat-input" id="sgChatInput" placeholder="Frage stellen…" maxlength="500" aria-label="Frage an Sven AI Guide" autocomplete="off" />' +
          '<button class="sg-chat-send" id="sgChatSend" aria-label="Frage senden" type="button">' +
            getIcon('send') +
          '</button>' +
        '</div>' +
        '<div class="sg-quick-toggle" id="sgQuickToggle">' +
          '<span class="sg-quick-toggle-icon">' + getIcon('grid') + '</span>' +
          '<span>Schnellzugriff</span>' +
        '</div>' +
        '<div class="sg-quick-actions" id="sgQuickActions" style="display:none;">' +
          '<div class="sg-actions" id="sgActions"></div>' +
        '</div>' +
        '<div class="sg-contact-section">' +
          '<a class="sg-contact-btn" href="kontakt.html">' + getIcon('mail') + ' Kontakt</a>' +
          '<a class="sg-contact-btn sg-contact-linkedin" href="https://linkedin.com/in/sven-preuss" target="_blank" rel="noopener">LinkedIn</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(trigger);
    document.body.appendChild(panel);

    // Event handlers
    trigger.addEventListener('click', function() { togglePanel(true); });
    document.getElementById('svenGuideClose').addEventListener('click', function() { togglePanel(false); });
    overlay.addEventListener('click', function() { togglePanel(false); });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        togglePanel(false);
        trigger.focus();
      }
    });

    // Chat send
    var sendBtn = document.getElementById('sgChatSend');
    var input = document.getElementById('sgChatInput');
    sendBtn.addEventListener('click', function(e) { e.preventDefault(); sendMessage(); });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Quick actions toggle
    var quickToggle = document.getElementById('sgQuickToggle');
    var quickActions = document.getElementById('sgQuickActions');
    quickToggle.addEventListener('click', function() {
      if (quickActions.style.display === 'none') {
        quickActions.style.display = 'block';
        populateQuickActions(ctx);
      } else {
        quickActions.style.display = 'none';
      }
    });

    // Welcome message
    var welcomeMsg = 'Hi! Ich bin Svens AI Guide. Stelle mir eine Frage zu Sven, seinen Projekten, AI Business Systems, Zertifikaten oder dem Kontakt. Ich antworte sofort auf die meisten Fragen. ✨';
    addMessage('bot', welcomeMsg);

    maybeShowGreeting();
  }

  // === POPULATE QUICK ACTIONS ===
  function populateQuickActions(ctx) {
    var container = document.getElementById('sgActions');
    if (!container) return;
    var actions = getQuickActions(ctx);
    var html = '';
    actions.forEach(function(action) {
      var downloadAttr = action.download ? ' download' : '';
      var targetAttr = action.download ? ' target="_blank" rel="noopener"' : '';
      html +=
        '<a class="sg-action-btn" href="' + action.url + '"' + downloadAttr + targetAttr +
        ' aria-label="' + action.label + '">' +
        '<span class="sg-action-icon">' + getIcon(action.icon) + '</span>' +
        '<span class="sg-action-text"><span class="sg-action-title">' + action.label + '</span>' +
        '<span class="sg-action-desc">' + action.desc + '</span></span>' +
        '</a>';
    });
    container.innerHTML = html;
  }

  // === TOGGLE ===
  var isOpen = false;
  var lastFocused = null;

  function togglePanel(open) {
    var trigger = document.getElementById('svenGuideTrigger');
    var panel = document.getElementById('svenGuidePanel');
    var overlay = document.getElementById('svenGuideOverlay');
    if (!panel) return;

    if (open && !isOpen) {
      lastFocused = document.activeElement;
      isOpen = true;
      panel.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      if (window.innerWidth <= 768) {
        overlay.classList.add('visible');
      }
      // Focus input
      setTimeout(function() {
        var input = document.getElementById('sgChatInput');
        if (input) input.focus();
      }, REDUCED_MOTION ? 0 : 200);
    } else if (!open && isOpen) {
      isOpen = false;
      panel.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('visible');
      if (lastFocused) lastFocused.focus();
    }
  }

  // === GREETING ===
  function maybeShowGreeting() {
    try {
      var greeted = sessionStorage.getItem(SESSION_KEY);
      if (!greeted) {
        sessionStorage.setItem(SESSION_KEY, '1');
        var trigger = document.getElementById('svenGuideTrigger');
        if (trigger && !REDUCED_MOTION) {
          setTimeout(function() {
            trigger.classList.add('sg-pulse');
            setTimeout(function() {
              trigger.classList.remove('sg-pulse');
            }, 2000);
          }, 2000);
        }
      }
    } catch(e) {}
  }

  // === INIT ===
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildGuide);
    } else {
      buildGuide();
    }
  }

  init();
})();
