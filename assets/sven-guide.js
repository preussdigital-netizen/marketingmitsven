/* ============================================
   Sven Guide — Persistent Website Guide
   Marketing mit Sven (MMS) V2
   Deterministic / local — no LLM backend
   ============================================ */

(function() {
  'use strict';

  // === CONFIG ===
  var STORAGE_KEY = 'mms_guide_greeted';
  var SESSION_KEY = 'mms_guide_seen';
  var REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // === PAGE CONTEXT DETECTION ===
  function getCurrentPage() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    return path;
  }

  function getPageContext(page) {
    switch(page) {
      case 'index.html':
        return { type: 'home', label: 'Startseite' };
      case 'ueber-mich.html':
        return { type: 'about', label: 'Über mich' };
      case 'expertise.html':
        return { type: 'expertise', label: 'Expertise' };
      case 'projekte.html':
        return { type: 'projects', label: 'Projekte' };
      case 'ai-business-systems.html':
        return { type: 'ai-systems', label: 'AI Business Systems' };
      case 'career.html':
        return { type: 'career', label: 'Career' };
      case 'recruiter-mode.html':
        return { type: 'recruiter', label: 'Recruiter Mode' };
      case 'kontakt.html':
        return { type: 'contact', label: 'Kontakt' };
      case 'guide.html':
        return { type: 'guide', label: 'Sven Guide' };
      case 'insights.html':
        return { type: 'insights', label: 'Insights' };
      default:
        return { type: 'general', label: 'Marketing mit Sven' };
    }
  }

  // === DATA LOADING ===
  var resumeData = null;

  function loadResumeData(callback) {
    if (resumeData) { callback(resumeData); return; }
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'assets/resume.json', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              resumeData = JSON.parse(xhr.responseText);
            } catch(e) {
              resumeData = null;
            }
          }
          callback(resumeData);
        }
      };
      xhr.send();
    } catch(e) {
      callback(null);
    }
  }

  // === QUICK ACTIONS BY CONTEXT ===
  function getQuickActions(ctx, data) {
    var actions = [];
    var isRecruiterContext = (ctx.type === 'career' || ctx.type === 'recruiter');

    // Universal actions
    actions.push({ label: 'Über Sven', icon: 'user', url: 'ueber-mich.html', desc: 'Person, Hintergrund & Werte' });
    actions.push({ label: 'Expertise', icon: 'grid', url: 'expertise.html', desc: 'Fachbereiche & Methodik' });
    actions.push({ label: 'Projekte', icon: 'folder', url: 'projekte.html', desc: 'Cases & Eigenentwicklungen' });
    actions.push({ label: 'AI Business Systems', icon: 'cpu', url: 'ai-business-systems.html', desc: 'KI als operative Infrastruktur' });

    // Recruiter-priority actions
    if (isRecruiterContext) {
      actions.push({ label: 'CV herunterladen', icon: 'download', url: 'assets/Lebenslauf_Sven-Preuss_AI-Business-Systems-Specialist.pdf', desc: 'PDF-Lebenslauf', download: true });
      actions.push({ label: 'Recruiter Mode', icon: 'briefcase', url: 'recruiter-mode.html', desc: 'Kompakte Eckdaten' });
      actions.push({ label: 'Zertifikate', icon: 'award', url: 'expertise.html#certificates', desc: 'Alle Nachweise' });
    }

    // Toolstack
    actions.push({ label: 'Toolstack', icon: 'tool', url: 'expertise.html#tools', desc: 'Verwendete Tools & Plattformen' });

    // Contact
    actions.push({ label: 'Kontakt', icon: 'mail', url: 'kontakt.html', desc: 'E-Mail, LinkedIn & Telefon' });

    return actions;
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
      compass: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>'
    };
    return icons[name] || icons.compass;
  }

  // === BUILD DOM ===
  function buildGuide() {
    // Trigger button
    var trigger = document.createElement('button');
    trigger.className = 'sven-guide-trigger';
    trigger.setAttribute('aria-label', 'Sven Guide öffnen');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('type', 'button');
    trigger.id = 'svenGuideTrigger';
    trigger.innerHTML =
      '<span class="sg-trigger-icon">' + getIcon('compass') + '</span>' +
      '<span class="sg-trigger-text">Sven Guide</span>';

    // Panel
    var panel = document.createElement('div');
    panel.className = 'sven-guide-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-label', 'Sven Guide');
    panel.id = 'svenGuidePanel';

    // Overlay (for mobile)
    var overlay = document.createElement('div');
    overlay.className = 'sven-guide-overlay';
    overlay.id = 'svenGuideOverlay';

    // Panel content
    var ctx = getPageContext(getCurrentPage());

    panel.innerHTML =
      '<div class="sg-header">' +
        '<div class="sg-header-title">' +
          '<span class="sg-header-icon">' + getIcon('compass') + '</span>' +
          '<div>' +
            '<div class="sg-header-name">Sven Guide</div>' +
            '<div class="sg-header-sub">' + ctx.label + '</div>' +
          '</div>' +
        '</div>' +
        '<button class="sg-close" id="svenGuideClose" aria-label="Sven Guide schließen" type="button">' +
          getIcon('close') +
        '</button>' +
      '</div>' +
      '<div class="sg-body" id="svenGuideBody">' +
        '<div class="sg-loading">Lade…</div>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(trigger);
    document.body.appendChild(panel);

    // Events
    trigger.addEventListener('click', function() {
      togglePanel(true);
    });
    document.getElementById('svenGuideClose').addEventListener('click', function() {
      togglePanel(false);
    });
    overlay.addEventListener('click', function() {
      togglePanel(false);
    });

    // ESC to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        togglePanel(false);
        trigger.focus();
      }
    });

    // Load data and populate
    loadResumeData(function(data) {
      populatePanel(ctx, data);
      maybeShowGreeting();
    });
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
      // Focus first action
      setTimeout(function() {
        var firstBtn = panel.querySelector('.sg-action-btn');
        if (firstBtn) firstBtn.focus();
      }, REDUCED_MOTION ? 0 : 200);
    } else if (!open && isOpen) {
      isOpen = false;
      panel.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('visible');
      if (lastFocused) lastFocused.focus();
    }
  }

  // === POPULATE PANEL ===
  function populatePanel(ctx, data) {
    var body = document.getElementById('svenGuideBody');
    if (!body) return;

    var actions = getQuickActions(ctx, data);
    var isRecruiterContext = (ctx.type === 'career' || ctx.type === 'recruiter');

    var html = '';

    // Greeting
    html += '<div class="sg-greeting">Schnelle Orientierung — wähle einen Bereich.</div>';

    // Quick Actions
    html += '<div class="sg-section"><div class="sg-section-label">Schnellzugriff</div><div class="sg-actions">';

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

    html += '</div></div>';

    // Context-specific info from resume.json
    if (data) {
      // Projects (if available)
      if (data.projects && data.projects.length > 0 && (ctx.type === 'projects' || ctx.type === 'general' || ctx.type === 'home' || isRecruiterContext)) {
        html += '<div class="sg-section"><div class="sg-section-label">Projekte</div><div class="sg-list">';
        data.projects.slice(0, 5).forEach(function(p) {
          var name = p.name || '';
          var desc = (p.description || '').substring(0, 100);
          html +=
            '<a class="sg-list-item" href="projekte.html">' +
            '<span class="sg-list-name">' + name + '</span>' +
            '<span class="sg-list-desc">' + desc + '</span></a>';
        });
        html += '<a class="sg-list-more" href="projekte.html">Alle Projekte ansehen &rarr;</a></div></div>';
      }

      // Tools (if available)
      if (data.tools) {
        var toolCats = Object.keys(data.tools);
        if (toolCats.length > 0 && (ctx.type === 'expertise' || ctx.type === 'general' || ctx.type === 'home')) {
          html += '<div class="sg-section"><div class="sg-section-label">Toolstack</div><div class="sg-tool-list">';
          toolCats.forEach(function(cat) {
            var tools = data.tools[cat];
            if (Array.isArray(tools) && tools.length > 0) {
              var catLabel = getToolCategoryLabel(cat);
              html += '<div class="sg-tool-cat"><span class="sg-tool-cat-name">' + catLabel + '</span><span class="sg-tool-items">' + tools.slice(0, 5).join(' · ') + '</span></div>';
            }
          });
          html += '<a class="sg-list-more" href="expertise.html#tools">Vollständiger Toolstack &rarr;</a></div></div>';
        }
      }

      // Certificates (recruiter context)
      if (data.certificates && data.certificates.length > 0 && (isRecruiterContext || ctx.type === 'expertise')) {
        html += '<div class="sg-section"><div class="sg-section-label">Zertifikate</div><div class="sg-cert-list">';
        data.certificates.slice(0, 6).forEach(function(c) {
          var name = c.name || '';
          var issuer = c.issuer || '';
          html += '<div class="sg-cert-item"><span class="sg-cert-name">' + name + '</span><span class="sg-cert-issuer">' + issuer + '</span></div>';
        });
        html += '<a class="sg-list-more" href="expertise.html#certificates">Alle Zertifikate &rarr;</a></div></div>';
      }

      // AI Business Systems explanation
      if (ctx.type === 'ai-systems' || ctx.type === 'general' || ctx.type === 'home') {
        html += '<div class="sg-section"><div class="sg-section-label">AI Business Systems</div>' +
          '<div class="sg-info-text">KI als operative Infrastruktur: Prompt Engineering, Low-Code Apps, automatisierte Workflows und KI-Ethik. ' +
          'MissionOS ist ein eigenes AI-/Automation-Konzept in Entwicklung.</div>' +
          '<a class="sg-list-more" href="ai-business-systems.html">Mehr dazu &rarr;</a></div>';
      }
    }

    // Contact shortcut
    html += '<div class="sg-section sg-contact-section">' +
      '<a class="sg-contact-btn" href="kontakt.html">' + getIcon('mail') + ' Kontakt aufnehmen</a>' +
      '<a class="sg-contact-btn sg-contact-linkedin" href="https://linkedin.com/in/sven-preuss" target="_blank" rel="noopener">LinkedIn Profil</a>' +
      '</div>';

    body.innerHTML = html;
  }

  // === TOOL CATEGORY LABELS ===
  function getToolCategoryLabel(cat) {
    var labels = {
      aiAndLLMs: 'AI & LLMs',
      lowCodeAndAiDevelopment: 'Low-Code & AI Development',
      workflowAutomation: 'Workflow Automation & APIs',
      performanceMarketing: 'Performance Marketing',
      seoAndAiSearch: 'Search & AI Search',
      analyticsAndTracking: 'Analytics & Tracking',
      designAndContent: 'Design & Content',
      cloudAndStorage: 'Cloud & Productivity',
      productivity: 'Productivity'
    };
    return labels[cat] || cat;
  }

  // === GREETING ===
  function maybeShowGreeting() {
    try {
      var greeted = sessionStorage.getItem(SESSION_KEY);
      if (!greeted) {
        sessionStorage.setItem(SESSION_KEY, '1');
        // Subtle pulse on the trigger after 2 seconds
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
    } catch(e) {
      // sessionStorage might not be available
    }
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
