/* Strong Website Design WJ chatbot — rule-based FAQ + lead capture.
   Pattern adapted from the Strong Roots Co. site widget.
   Lead form posts to FormSubmit (same endpoint style as our other sites).
   Email-only business: no phone number appears anywhere in this bot. */
(function () {
  var EMAIL = "websitedesignwjutah@gmail.com";
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/websitedesignwjutah@gmail.com";
  var SITE = "https://strongroots.github.io/Strong-Website-Design-WJ/";
  var LINKS = {
    receptionist: SITE + "receptionist.html",
    demo: SITE + "chatbot-demo.html",
    install: "https://buy.stripe.com/14AeV51U76R19M33Et1ck00",
    care: "https://buy.stripe.com/5kQ6oz42fgrB5vN8YN1ck01",
    template: "https://buy.stripe.com/eVq9AL9mzfnx0bt3Et1ck02",
    founding: "https://buy.stripe.com/7sY4graqD3EPcYf1wl1ck03",
    standard: "https://buy.stripe.com/bJe8wH56jdfpf6n1wl1ck04"
  };

  var RULES = [
    { k: ["receptionist", "answer my calls", "answering", "missed call", "miss calls", "phone calls", "after hours", "after-hours"],
      a: "Our AI Receptionist answers your business calls 24/7 — nights, weekends, and while your crew is on a job. If a call ever slips through, it texts the caller back in seconds, and after a finished job it asks happy customers for a Google review.\n\nPricing: $349/month founding rate (first 10 signups this month) or $497/month standard. Full details: " + LINKS.receptionist + "\n\nWant one for your shop? Tap \"Get a quote\" and we'll set it up within days." },
    { k: ["price", "cost", "much", "pricing", "charge"],
      a: "Here's the pricing — everything is sold separately, so you only pay for what you want:\n• Website chatbot: $500 one-time install\n• Care Plan monitoring: $99/month — OPTIONAL add-on (hosting, uptime monitoring, monthly updates, priority support). The chatbot works fine without it.\n• DIY chatbot template: $99 one-time\n• AI Receptionist: $349/month founding (first 10) / $497/month standard\n\nTap \"Get a quote\" and tell me which one you're looking at." },
    { k: ["care plan", "monitoring", "hosting", "maintenance", "uptime"],
      a: "The Care Plan is an optional add-on to the chatbot install — $99/month for hosting, uptime monitoring, monthly content updates (new FAQs, price or service changes), and priority support. Cancel anytime.\n\nYou do NOT have to take it. Plenty of clients just do the $500 install and run the chatbot on its own." },
    { k: ["template", "diy", "do it myself", "do-it-yourself"],
      a: "The DIY template is $99 one-time: the same chatbot we install, packaged for your trade (plumber, HVAC, roofer, electrician, or dentist) with step-by-step install instructions. You paste it in yourself — about 15 minutes. Get it here: " + LINKS.template },
    { k: ["website", "web site", "redesign", "refresh", "new site", "web design", "design"],
      a: "We build and refresh websites for local service businesses — mobile-friendly, fast, and set up so visitors actually contact you. A refresh or new site is usually paired with our chatbot so the site captures leads around the clock.\n\nTap \"Get a quote\" and tell me about your current site (or that you need one) and we'll send options and pricing." },
    { k: ["chatbot", "chat bot", "chat widget", "bot"],
      a: "Our website chatbot is custom-built for your business and installed on your site for a $500 one-time fee. It answers common questions, captures leads, and takes quote requests 24/7 — even at 11pm when a customer's water heater dies.\n\nWant to see one live first? Try the demo: " + LINKS.demo },
    { k: ["demo", "example", "see it", "try it", "sample"],
      a: "You can try a working demo right here: " + LINKS.demo + "\nIt shows the exact chatbot we'd install on your site, running on a sample plumbing company's page. Ask it about hours, pricing, and services, then tap its quote button to see how a lead reaches the owner." },
    { k: ["review", "reviews", "google rating", "stars"],
      a: "Review automation is built into our AI Receptionist: after a finished job, it automatically asks happy customers for a Google review — that's how shops steadily build their rating without chasing anyone. Details: " + LINKS.receptionist },
    { k: ["how long", "how does it work", "process", "get started", "sign up", "next step"],
      a: "Simple process:\n1. You reach out (tap \"Get a quote\" or email us).\n2. We customize the chatbot — or set up your AI receptionist — for your business.\n3. It goes live, usually within days, and starts capturing leads or answering calls around the clock.\n\nYou approve everything before it goes live, and you never hand over any logins." },
    { k: ["area", "serve", "location", "where", "utah", "west jordan", "salt lake"],
      a: "We're based in West Jordan, Utah and work with small businesses across Utah — especially the Salt Lake Valley. Since everything we build is delivered online, location is no barrier." },
    { k: ["trade", "plumber", "hvac", "roofer", "roofing", "electrician", "dentist", "contractor", "who do you work with"],
      a: "We specialize in local service businesses: plumbers, HVAC companies, roofers, electricians, and dentists — plus other trades and home-service shops with the same after-hours lead problem." },
    { k: ["human", "person", "email", "contact", "talk", "reach"],
      a: "You can email us anytime at " + EMAIL + " — a real person (Austin) reads every message and replies personally. Or tap \"Get a quote\" here and we'll come to you." },
    { k: ["guarantee", "cancel", "contract", "commitment"],
      a: "No long-term contracts. The monthly services (Care Plan, AI Receptionist) are month-to-month and cancel anytime. The chatbot install and DIY template are one-time purchases." },
    { k: ["hi", "hello", "hey", "yo"],
      a: "Hello! Ask me about websites, the chatbot, pricing, or the AI receptionist — or tap \"Get a quote\" to get started." },
    { k: ["thank", "thanks", "great", "awesome", "perfect"],
      a: "You're welcome! Anything else I can help with?" }
  ];

  var FALLBACK = "I want to make sure you get the right answer — tap \"Get a quote\" and Austin will reply personally, or email us at " + EMAIL + ".";

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function linkify(t) {
    return t
      .replace(/(https:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/websitedesignwjutah@gmail\.com/g, '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a>");
  }

  var panel, body, quick, input;

  function addMsg(text, who) {
    var m = el("div", "sw-msg " + (who || "sw-bot"), who === "sw-user" ? text.replace(/</g, "&lt;") : linkify(text));
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }

  function setQuick(items) {
    quick.innerHTML = "";
    items.forEach(function (t) {
      var c = el("button", "sw-chip", t);
      c.type = "button";
      c.onclick = function () { sendUser(t); };
      quick.appendChild(c);
    });
  }

  var DEFAULT_QUICK = ["Get a quote", "Pricing", "AI receptionist", "See the demo"];

  function answer(text) {
    var t = text.toLowerCase();
    if (/get a quote|get.*quote|quote request|contact me|sign me up/.test(t)) { startLeadForm(); return; }
    if (/see the demo|demo/.test(t)) {
      addMsg("Here's the live demo — the same chatbot we'd install on your site, running on a sample plumbing company's page: " + LINKS.demo + "\nAsk it about hours, pricing, or services, then tap its quote button to see how a lead reaches the owner.");
      setQuick(DEFAULT_QUICK); return;
    }
    if (/service/.test(t)) {
      addMsg("Here's what we do:\n• Website design & refresh for local businesses\n• AI chatbot installed on your website ($500 one-time)\n• Optional Care Plan monitoring ($99/month — separate, only if you want it)\n• DIY chatbot template ($99 one-time)\n• AI receptionist that answers your calls 24/7 (from $349/month)\n\nTap \"Get a quote\" for next steps on any of these.");
      setQuick(DEFAULT_QUICK); return;
    }
    for (var i = 0; i < RULES.length; i++) {
      var r = RULES[i];
      for (var j = 0; j < r.k.length; j++) {
        if (t.indexOf(r.k[j]) !== -1) { addMsg(r.a); setQuick(DEFAULT_QUICK); return; }
      }
    }
    addMsg(FALLBACK);
    setQuick(["Get a quote", "Pricing"]);
  }

  function sendUser(text) {
    addMsg(text, "sw-user");
    setQuick([]);
    setTimeout(function () { answer(text); }, 350);
  }

  function startLeadForm() {
    var wrap = el("div", "sw-msg sw-bot");
    wrap.innerHTML =
      '<div class="sw-lead-form">' +
      "<b>Get a quote / ask a question</b><br><br>" +
      '<input id="sw-f-name" placeholder="Your name" autocomplete="name">' +
      '<input id="sw-f-biz" placeholder="Business name" autocomplete="organization">' +
      '<input id="sw-f-email" placeholder="Email address" inputmode="email" autocomplete="email">' +
      '<input id="sw-f-phone" placeholder="Phone (optional)" inputmode="tel" autocomplete="tel">' +
      '<select id="sw-f-need">' +
      "<option>Website chatbot ($500 install)</option>" +
      "<option>New website / website refresh</option>" +
      "<option>AI receptionist</option>" +
      "<option>DIY chatbot template ($99)</option>" +
      "<option>Care Plan monitoring ($99/mo)</option>" +
      "<option>Something else / not sure yet</option>" +
      "</select>" +
      '<textarea id="sw-f-msg" rows="3" placeholder="Anything we should know? (your website address helps)"></textarea>' +
      '<button id="sw-f-go" type="button">Send my request</button>' +
      "</div>";
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    setQuick([]);
    wrap.querySelector("#sw-f-go").onclick = function () {
      var name = wrap.querySelector("#sw-f-name").value.trim();
      var biz = wrap.querySelector("#sw-f-biz").value.trim();
      var email = wrap.querySelector("#sw-f-email").value.trim();
      var phone = wrap.querySelector("#sw-f-phone").value.trim();
      var need = wrap.querySelector("#sw-f-need").value;
      var msg = wrap.querySelector("#sw-f-msg").value.trim();
      if (!name || (!email && !phone)) {
        addMsg("Please add your name and at least an email or phone number so we can reach you.");
        return;
      }
      var btn = wrap.querySelector("#sw-f-go");
      btn.disabled = true; btn.textContent = "Sending...";
      var payload = {
        _subject: "Website chatbot lead: " + need + " — " + (biz || name),
        Name: name, Business: biz || "(not given)", Email: email || "(not given)",
        Phone: phone || "(not given)", Interested_in: need, Details: msg || "(none)",
        _template: "table", _captcha: "false"
      };
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function () {
        wrap.innerHTML = "Sent! Thanks, <b>" + name.replace(/</g, "&lt;") + "</b> — Austin will get back to you personally, usually within one business day.";
        addMsg("Anything else I can help with?");
        setQuick(DEFAULT_QUICK);
      }).catch(function () {
        btn.disabled = false; btn.textContent = "Send my request";
        addMsg("Hmm, that didn't send. Please email us at " + EMAIL + " and we'll take care of you.");
        setQuick(DEFAULT_QUICK);
      });
    };
  }

  function build() {
    var btn = el("button", "", "");
    btn.id = "sw-chat-btn";
    btn.setAttribute("aria-label", "Chat with us");
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg><span class="sw-dot">1</span>';

    panel = el("div", ""); panel.id = "sw-chat-panel";
    panel.innerHTML =
      '<div id="sw-chat-head"><div class="sw-avatar">💬</div>' +
      '<div><div class="sw-title">Strong Website Design WJ</div><div class="sw-sub">Online now — ask us anything</div></div>' +
      '<button id="sw-chat-close" aria-label="Close chat">&times;</button></div>' +
      '<div id="sw-chat-body"></div><div id="sw-quick"></div>' +
      '<div id="sw-chat-foot"><input id="sw-chat-input" placeholder="Ask a question..." autocomplete="off">' +
      '<button id="sw-chat-send">Send</button></div>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);
    body = panel.querySelector("#sw-chat-body");
    quick = panel.querySelector("#sw-quick");
    input = panel.querySelector("#sw-chat-input");

    var opened = false;
    function toggle(force) {
      var open = force !== undefined ? force : !panel.classList.contains("sw-open");
      panel.classList.toggle("sw-open", open);
      if (open && !panelPinned) placePanel();
      if (open) {
        var dot = btn.querySelector(".sw-dot");
        if (dot) dot.classList.add("sw-hide");
        try { localStorage.setItem("sw-chat-seen", "1"); } catch (e) {}
      }
      if (open && !opened) {
        opened = true;
        addMsg("Hi! 👋 Thinking about a website, a chatbot for your site, or an AI receptionist to answer your calls? Ask me anything — or tap below to get a quote.");
        setQuick(DEFAULT_QUICK);
      }
      if (open) setTimeout(function () { input.focus(); }, 100);
    }
    /* --- Draggable widget: drag the button to move it; the panel follows.
       Drag the panel's header to move the panel on its own. Position persists. --- */
    var suppressClick = false;
    var panelPinned = false;
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function toXY(node) {
      var r = node.getBoundingClientRect();
      node.style.left = r.left + "px";
      node.style.top = r.top + "px";
      node.style.right = "auto";
      node.style.bottom = "auto";
      return r;
    }
    function savePos() {
      try {
        var b = btn.getBoundingClientRect(), p = panel.getBoundingClientRect();
        localStorage.setItem("sw-chat-pos", JSON.stringify({
          bl: b.left, bt: b.top, pl: p.left, pt: p.top, pinned: panelPinned
        }));
      } catch (e) {}
    }
    function restorePos() {
      try {
        var s = JSON.parse(localStorage.getItem("sw-chat-pos") || "null");
        if (!s) return;
        btn.style.left = s.bl + "px"; btn.style.top = s.bt + "px";
        btn.style.right = "auto"; btn.style.bottom = "auto";
        if (s.pinned) {
          panelPinned = true;
          panel.style.left = s.pl + "px"; panel.style.top = s.pt + "px";
          panel.style.right = "auto"; panel.style.bottom = "auto";
        }
      } catch (e) {}
    }
    function placePanel() {
      var r = btn.getBoundingClientRect();
      var pw = Math.min(378, window.innerWidth - 40);
      var ph = Math.min(540, window.innerHeight - 130);
      panel.style.left = clamp(r.left + r.width - pw, 8, Math.max(8, window.innerWidth - pw - 8)) + "px";
      panel.style.top = clamp(r.top - ph - 12, 8, Math.max(8, window.innerHeight - ph - 8)) + "px";
      panel.style.right = "auto"; panel.style.bottom = "auto";
    }
    function dragify(handle, node, opts) {
      var on = false, moved = false, sx = 0, sy = 0, ox = 0, oy = 0;
      handle.addEventListener("pointerdown", function (e) {
        if (opts.ignore && e.target.closest(opts.ignore)) return;
        on = true; moved = false; sx = e.clientX; sy = e.clientY;
        var r = toXY(node); ox = r.left; oy = r.top;
        handle.classList.add("sw-dragging"); node.classList.add("sw-dragging");
        try { handle.setPointerCapture(e.pointerId); } catch (err) {}
        e.preventDefault();
      });
      handle.addEventListener("pointermove", function (e) {
        if (!on) return;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 8) return;
        moved = true;
        var w = node.offsetWidth, h = node.offsetHeight;
        node.style.left = clamp(ox + dx, 0, Math.max(0, window.innerWidth - w)) + "px";
        node.style.top = clamp(oy + dy, 0, Math.max(0, window.innerHeight - h)) + "px";
        if (opts.onMove) opts.onMove();
      });
      function done() {
        if (!on) return;
        on = false;
        handle.classList.remove("sw-dragging"); node.classList.remove("sw-dragging");
        if (opts.onEnd) opts.onEnd(moved);
      }
      handle.addEventListener("pointerup", done);
      handle.addEventListener("pointercancel", done);
    }
    dragify(btn, btn, {
      onMove: function () { if (panel.classList.contains("sw-open") && !panelPinned) placePanel(); },
      onEnd: function (wasDrag) { suppressClick = wasDrag; if (wasDrag) savePos(); }
    });
    dragify(panel.querySelector("#sw-chat-head"), panel, {
      ignore: "#sw-chat-close",
      onEnd: function (wasDrag) { if (wasDrag) { panelPinned = true; savePos(); } }
    });
    btn.onclick = function () { if (suppressClick) { suppressClick = false; return; } toggle(); };
    try {
      if (localStorage.getItem("sw-chat-seen")) {
        var seenDot = btn.querySelector(".sw-dot");
        if (seenDot) seenDot.classList.add("sw-hide");
      }
    } catch (e) {}
    restorePos();
    panel.querySelector("#sw-chat-close").onclick = function () { toggle(false); };
    function send() {
      var v = input.value.trim();
      if (!v) return;
      input.value = "";
      sendUser(v);
    }
    panel.querySelector("#sw-chat-send").onclick = send;
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else { build(); }
})();
