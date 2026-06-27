
(function(){
  "use strict";
  var CGN_DEFAULT_API_BASE = "https://script.google.com/macros/s/AKfycbx41mQg-Ine3XZ-VrMI_SaQn4_K6cDQHA0cBFyGPgupu_edNFoNRjSLv2hoSe_bOytt/exec";
  function normalizeApiBase(value){ return String(value || "").trim().replace(/\?+$/, ""); }
  function getConfiguredApiBase(){
    var meta = document.querySelector('meta[name="cgn-api-base"]');
    var metaValue = meta ? meta.getAttribute("content") : "";
    var storedValue = localStorage.getItem("cgn_api_base") || "";
    var windowValue = window.CGN_API_BASE || window.CGN_API_URL || "";
    return normalizeApiBase(windowValue || metaValue || storedValue || CGN_DEFAULT_API_BASE);
  }
  var CGN_API_BASE = getConfiguredApiBase();
  window.CGN_API_BASE = CGN_API_BASE;
  window.CGN_API_URL = CGN_API_BASE;
  window.CGN_CONFIG = window.CGN_CONFIG || {};
  window.CGN_CONFIG.apiBase = CGN_API_BASE;
  window.CGN_CONFIG.apiUrl = CGN_API_BASE;
  window.CGN_CONFIG.googleAppsScriptWebAppUrl = CGN_API_BASE;
  window.CGN_SET_API_BASE = function(url){
    var clean = normalizeApiBase(url);
    if(clean){
      localStorage.setItem("cgn_api_base", clean);
      window.CGN_API_BASE = clean;
      window.CGN_API_URL = clean;
      window.CGN_CONFIG.apiBase = clean;
      window.CGN_CONFIG.apiUrl = clean;
      window.CGN_CONFIG.googleAppsScriptWebAppUrl = clean;
    }
    return window.CGN_API_BASE;
  };
  function safeText(value){ return String(value || "").replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]; }); }
  function getUser(){ return localStorage.getItem("user_id") || ""; }
  function statusIsActive(value){
    var v = String(value || "").trim().toLowerCase();
    return value === true || v === "true" || v === "active" || v === "paid" || v === "subscriber";
  }
  function updateAccountUI(){
    var btn = document.getElementById("account-btn");
    if(!btn) return;
    if(getUser()){
      btn.textContent = "Account";
      btn.setAttribute("aria-label", "CGN NOW account");
    } else {
      btn.textContent = "Login";
      btn.setAttribute("aria-label", "Login or create CGN account");
    }
  }
  function setLoginMessage(message){ var el = document.getElementById("cgn-now-login-message"); if(el) el.textContent = message || ""; }
  function renderLoginModal(){
    var existing = document.getElementById("login-modal");
    if(existing) return existing;
    var modal = document.createElement("div");
    modal.id = "login-modal";
    modal.className = "cgn-now-login-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "cgn-now-login-title");
    modal.innerHTML = '\
      <div class="cgn-now-login-card">\
        <img class="cgn-now-login-logo" src="/CGNNewsNowLogo.png" alt="CGN NOW">\
        <h3 id="cgn-now-login-title">Account Access</h3>\
        <p>Create a free CGN account to unlock 6 free articles. Subscribers get unlimited article access.</p>\
        <label for="login-email">Email</label>\
        <input id="login-email" type="email" placeholder="Email" autocomplete="email">\
        <label for="login-password">Password</label>\
        <input id="login-password" type="password" placeholder="Password" autocomplete="current-password">\
        <div id="cgn-now-login-message" class="cgn-now-login-message" aria-live="polite"></div>\
        <div class="cgn-now-login-actions">\
          <button type="button" onclick="loginUser()">Login</button>\
          <button type="button" onclick="signupUser()">Create Account</button>\
        </div>\
        <a class="cgn-now-reset-link" href="/reset-password/">Forgot Password?</a>\
        <button type="button" class="cgn-now-login-close" onclick="closeLogin()">Close</button>\
      </div>';
    modal.addEventListener("click", function(event){ if(event.target === modal) closeLogin(); });
    document.body.appendChild(modal);
    return modal;
  }
  function openLogin(){
    var modal = renderLoginModal();
    modal.classList.add("open");
    document.body.classList.add("cgn-now-login-is-open");
    var menu = document.getElementById("account-menu"); if(menu) menu.classList.remove("open");
    setLoginMessage("");
    setTimeout(function(){ var email = document.getElementById("login-email"); if(email) email.focus(); }, 50);
  }
  function closeLogin(){
    var modal = document.getElementById("login-modal");
    if(modal) modal.classList.remove("open");
    document.body.classList.remove("cgn-now-login-is-open");
  }
  async function shellLoginUser(){
    var emailInput = document.getElementById("login-email");
    var passwordInput = document.getElementById("login-password");
    var email = emailInput ? emailInput.value.trim() : "";
    var password = passwordInput ? passwordInput.value : "";
    if(!email || !password){ setLoginMessage("Enter email and password."); return; }
    setLoginMessage("Logging in...");
    try{
      var res = await fetch(CGN_API_BASE + "?action=login&email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password));
      var data = await res.json();
      if(data && data.success){
        var userId = data.user_id || data.userId || (data.user && (data.user.user_id || data.user.id)) || "";
        if(userId) localStorage.setItem("user_id", userId);
        if(statusIsActive(data.subscriber) || (data.user && statusIsActive(data.user.subscriber))) localStorage.setItem("subscriber", "true");
        if(data.subscriber === false || (data.user && data.user.subscriber === false)) localStorage.setItem("subscriber", "false");
        setLoginMessage("Logged in."); closeLogin(); updateAccountUI(); document.dispatchEvent(new CustomEvent("cgn:login", {detail:data}));
        if(typeof window.loadArticle === "function") window.loadArticle();
        return;
      }
      setLoginMessage((data && (data.error || data.message)) || "Login failed.");
    }catch(e){ console.error("CGN NOW LOGIN ERROR", e); setLoginMessage("Unable to log in right now."); }
  }
  async function shellSignupUser(){
    var emailInput = document.getElementById("login-email");
    var passwordInput = document.getElementById("login-password");
    var email = emailInput ? emailInput.value.trim() : "";
    var password = passwordInput ? passwordInput.value : "";
    if(!email || !password){ setLoginMessage("Enter email and password."); return; }
    setLoginMessage("Creating account...");
    try{
      var res = await fetch(CGN_API_BASE + "?action=signup&email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password));
      var data = await res.json();
      if(data && data.success){
        var userId = data.user_id || data.userId || (data.user && (data.user.user_id || data.user.id)) || "";
        if(userId) localStorage.setItem("user_id", userId);
        if(statusIsActive(data.subscriber) || (data.user && statusIsActive(data.user.subscriber))) localStorage.setItem("subscriber", "true");
        if(data.subscriber === false || (data.user && data.user.subscriber === false)) localStorage.setItem("subscriber", "false");
        setLoginMessage("Account created."); closeLogin(); updateAccountUI(); document.dispatchEvent(new CustomEvent("cgn:signup", {detail:data}));
        if(typeof window.loadArticle === "function") window.loadArticle();
        return;
      }
      setLoginMessage((data && (data.error || data.message)) || "Signup failed.");
    }catch(e){ console.error("CGN NOW SIGNUP ERROR", e); setLoginMessage("Unable to create account right now."); }
  }
  function logoutUser(){
    localStorage.removeItem("user_id");
    localStorage.removeItem("subscriber");
    var menu = document.getElementById("account-menu"); if(menu) menu.classList.remove("open");
    updateAccountUI();
    document.dispatchEvent(new CustomEvent("cgn:logout"));
  }
  function categoryHref(category){
    if(category === "All") return "/news/";
    return "/news/?category=" + encodeURIComponent(category);
  }
  function activeTab(){
    var p = location.pathname;
    if(p.indexOf("/traffic") === 0) return "traffic";
    if(p.indexOf("/sports") === 0) return "sports";
    if(p.indexOf("/weather/radar") === 0) return "radar";
    if(p.indexOf("/weather") === 0) return "weather";
    if(p.indexOf("/account") === 0) return "account";
    return "news";
  }
  function renderHeader(){
    var mount = document.getElementById("cgn-site-header");
    if(!mount) return;
    var categories = ["All","Local","World","Politics","Business","Markets","Technology","Entertainment","Environment","Energy","Opinion","Investigations","Special Reports"];
    var currentCategory = new URLSearchParams(location.search).get("category") || "";
    var catHtml = categories.map(function(cat){
      var active = (cat === "All" && !currentCategory && location.pathname.indexOf("/news") === 0) || cat.toLowerCase() === String(currentCategory).toLowerCase();
      return '<a href="' + categoryHref(cat) + '"' + (active ? ' class="active"' : '') + '>' + safeText(cat === "All" ? "All News" : cat) + '</a>';
    }).join("");
    mount.innerHTML = '\
      <div class="cgn-now-topbar">\
        <a class="cgn-now-brand" href="/news/" aria-label="CGN NOW News">\
          <img src="/CGNNewsNowLogo.png" alt="CGN NOW">\
          <span class="cgn-now-title"><strong>CGN NOW</strong></span>\
        </a>\
        <div class="cgn-now-header-actions">\
          <button type="button" id="cgn-now-install-btn" class="cgn-now-install-btn">Install</button>\
          <span class="account-wrap">\
            <a href="#" id="account-btn">Login</a>\
            <span id="account-menu" class="account-menu" aria-label="Account menu">\
              <a href="/account/">Account</a>\
              <a href="/reporters/">Reporters</a>\
              <a href="/support/">Support</a>\
              <a href="/contact/">Contact</a>\
              <a href="/about/">About</a>\
              <a href="/write-for-us/">Write For Us</a>\
              <a href="/editorial-standards/">Editorial Standards</a>\
              <a href="/terms-of-service/">Terms of Service</a>\
              <a href="/privacy-policy/">Privacy Policy</a>\
              <a href="/copyright/">Copyright</a>\
              <a href="/editor/">Editor Portal</a>\
              <button type="button" id="account-logout-btn">Logout</button>\
            </span>\
          </span>\
        </div>\
      </div>\
      <nav class="cgn-now-category-bar" aria-label="CGN NOW news categories">' + catHtml + '</nav>';
    var accountBtn = document.getElementById("account-btn");
    if(accountBtn){
      accountBtn.addEventListener("click", function(event){
        event.preventDefault();
        if(!getUser()){ openLogin(); return; }
        var menu = document.getElementById("account-menu"); if(menu) menu.classList.toggle("open");
      });
    }
    var logoutBtn = document.getElementById("account-logout-btn"); if(logoutBtn) logoutBtn.addEventListener("click", logoutUser);
    updateAccountUI();
  }
  function ensureFooterPlacementStyles(){
    if(document.getElementById("cgn-now-footer-placement-fix")) return;
    var style = document.createElement("style");
    style.id = "cgn-now-footer-placement-fix";
    style.textContent = '\
      body.cgn-now-shell{padding-bottom:calc(138px + env(safe-area-inset-bottom,0px))!important;}\
      .cgn-now-bottom-fixed{position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:9997!important;background:#fff!important;border-top:1px solid rgba(7,17,31,.12)!important;box-shadow:0 -8px 24px rgba(7,17,31,.10)!important;padding-bottom:env(safe-area-inset-bottom,0px)!important;font-family:Arial,Helvetica,sans-serif!important;}\
      .cgn-now-support-toggle{display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;width:100%!important;min-height:44px!important;padding:5px 10px!important;margin:0!important;border:0!important;border-bottom:1px solid rgba(7,17,31,.10)!important;background:#f8fafc!important;color:#07111f!important;font-size:12px!important;font-weight:950!important;letter-spacing:.04em!important;text-transform:uppercase!important;cursor:pointer!important;line-height:1!important;}\
      .cgn-now-support-arrow{display:inline-flex!important;align-items:center!important;justify-content:center!important;font-size:14px!important;line-height:1!important;transform:rotate(0deg)!important;transition:transform .18s ease!important;}\
      .cgn-now-support-toggle[aria-expanded="true"] .cgn-now-support-arrow{transform:rotate(180deg)!important;}\
      .cgn-now-legal-panel{display:none!important;position:absolute!important;left:8px!important;right:8px!important;bottom:100%!important;z-index:9998!important;max-height:178px!important;overflow:auto!important;padding:8px!important;border:1px solid rgba(7,17,31,.14)!important;border-bottom:0!important;border-radius:14px 14px 0 0!important;background:#fff!important;box-shadow:0 -12px 30px rgba(7,17,31,.14)!important;}\
      .cgn-now-legal-panel.open{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important;}\
      .cgn-now-legal-panel a{display:flex!important;align-items:center!important;justify-content:center!important;min-height:31px!important;padding:6px 8px!important;border:1px solid rgba(7,17,31,.10)!important;border-radius:999px!important;background:#f8fafc!important;color:#07111f!important;text-decoration:none!important;font-size:11px!important;font-weight:900!important;line-height:1.1!important;text-align:center!important;}\
      .cgn-now-legal-panel a:hover{text-decoration:underline!important;background:#eef2f7!important;}\
      .cgn-now-bottom-fixed .cgn-now-copyright-line{display:flex!important;align-items:center!important;justify-content:center!important;min-height:22px!important;padding:3px 10px!important;margin:0!important;width:100%!important;background:#fff!important;color:#344054!important;text-decoration:none!important;font-size:10.8px!important;font-weight:900!important;line-height:1.15!important;border-bottom:1px solid rgba(7,17,31,.10)!important;text-align:center!important;}\
      .cgn-now-bottom-fixed .cgn-now-copyright-line:hover{text-decoration:underline!important;}\
      .cgn-now-bottom-fixed .cgn-now-tabs{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;z-index:auto!important;width:100%!important;margin:0!important;}\
      .cgn-now-legal-footer{display:none!important;}\
      .cgn-now-install-window{bottom:calc(148px + env(safe-area-inset-bottom,0px))!important;}\
      .cgn-now-bottom-fixed .cgn-now-tabs{grid-template-columns:repeat(6,minmax(0,1fr))!important;}\
      .cgn-now-car-icon{position:relative!important;display:inline-block!important;width:28px!important;height:18px!important;margin-bottom:1px!important;}\
      .cgn-now-car-icon:before{content:""!important;position:absolute!important;left:2px!important;right:2px!important;bottom:0!important;height:2px!important;border-radius:999px!important;background:rgba(255,255,255,.42)!important;box-shadow:10px 0 0 rgba(255,255,255,.25)!important;animation:cgn-now-road-dash .9s linear infinite!important;}\
      .cgn-now-car-body{position:absolute!important;left:3px!important;right:3px!important;bottom:4px!important;height:8px!important;border-radius:5px 7px 4px 4px!important;background:linear-gradient(90deg,#f8fafc,#53d5ff)!important;box-shadow:0 0 0 1px rgba(255,255,255,.38),0 0 12px rgba(83,213,255,.42)!important;}\
      .cgn-now-car-roof{position:absolute!important;left:8px!important;right:8px!important;bottom:10px!important;height:6px!important;border-radius:7px 7px 2px 2px!important;background:linear-gradient(90deg,#ffffff,#dbeafe)!important;}\
      .cgn-now-car-window{position:absolute!important;left:11px!important;right:11px!important;bottom:11px!important;height:4px!important;border-radius:4px 4px 1px 1px!important;background:#07111f!important;opacity:.8!important;}\
      .cgn-now-car-wheel{position:absolute!important;bottom:2px!important;width:6px!important;height:6px!important;border:1px solid rgba(255,255,255,.9)!important;border-radius:999px!important;background:#07111f!important;}\
      .cgn-now-car-wheel-left{left:7px!important;}\
      .cgn-now-car-wheel-right{right:7px!important;}\
      .cgn-now-car-headlight{position:absolute!important;right:2px!important;bottom:7px!important;width:4px!important;height:2px!important;border-radius:999px!important;background:#facc15!important;box-shadow:4px 0 9px rgba(250,204,21,.8)!important;}\
      .cgn-now-tab.active .cgn-now-car-body{background:linear-gradient(90deg,#fff,#facc15)!important;box-shadow:0 0 0 1px rgba(255,255,255,.5),0 0 13px rgba(250,204,21,.55)!important;}\
      @keyframes cgn-now-road-dash{0%{transform:translateX(4px)}100%{transform:translateX(-4px)}}\
      @media(max-width:560px){body.cgn-now-shell{padding-bottom:calc(136px + env(safe-area-inset-bottom,0px))!important;}.cgn-now-support-toggle{min-height:42px!important;font-size:11px!important;padding:5px 8px!important;}.cgn-now-legal-panel{left:6px!important;right:6px!important;max-height:170px!important;padding:7px!important;}.cgn-now-legal-panel a{min-height:30px!important;font-size:10.5px!important;padding:6px!important;}.cgn-now-bottom-fixed .cgn-now-copyright-line{font-size:10.2px!important;min-height:21px!important;padding-left:6px!important;padding-right:6px!important;}.cgn-now-install-window{bottom:calc(146px + env(safe-area-inset-bottom,0px))!important;}}\
    ';
    document.head.appendChild(style);
  }
  function setSupportMenu(open){
    var panel = document.getElementById("cgn-now-legal-panel");
    var btn = document.getElementById("cgn-now-support-toggle");
    if(!panel || !btn) return;
    if(open){
      panel.classList.add("open");
      panel.removeAttribute("hidden");
      btn.setAttribute("aria-expanded", "true");
    } else {
      panel.classList.remove("open");
      panel.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
    }
  }
  function toggleSupportMenu(event){
    if(event){
      event.preventDefault();
      event.stopPropagation();
    }
    var panel = document.getElementById("cgn-now-legal-panel");
    setSupportMenu(!(panel && panel.classList.contains("open")));
  }
  function setupSupportMenu(){
    var btn = document.getElementById("cgn-now-support-toggle");
    if(btn && !btn.dataset.cgnReady){
      btn.dataset.cgnReady = "true";
      btn.addEventListener("click", toggleSupportMenu);
    }
    if(window.CGN_NOW_SUPPORT_MENU_READY) return;
    window.CGN_NOW_SUPPORT_MENU_READY = true;
    document.addEventListener("click", function(event){
      var root = document.querySelector(".cgn-now-bottom-fixed");
      if(root && !root.contains(event.target)) setSupportMenu(false);
    });
    document.addEventListener("keydown", function(event){
      if(event.key === "Escape") setSupportMenu(false);
    });
  }
  function renderFooter(){
    ensureFooterPlacementStyles();
    var mount = document.getElementById("cgn-site-footer");
    if(!mount) return;
    var tab = activeTab();
    function cls(name){ return "cgn-now-tab" + (tab === name ? " active" : ""); }
    mount.innerHTML = '\
      <div class="cgn-now-bottom-fixed" aria-label="CGN NOW fixed footer">\
        <div id="cgn-now-legal-panel" class="cgn-now-legal-panel" hidden aria-label="Support and legal links">\
          <a href="/support/">Support</a>\
          <a href="/contact/">Contact</a>\
          <a href="/about/">About</a>\
          <a href="/terms-of-service/">Terms</a>\
          <a href="/privacy-policy/">Privacy</a>\
          <a href="/editorial-standards/">Editorial Standards</a>\
          <a href="/equal-opportunity/">Equal Opportunity</a>\
          <a href="/write-for-us/">Write For Us</a>\
          <a href="/unsubscribe/">Unsubscribe</a>\
          <a href="/copyright/">Copyright</a>\
        </div>\
        <button type="button" id="cgn-now-support-toggle" class="cgn-now-support-toggle" aria-expanded="false" aria-controls="cgn-now-legal-panel">Support <span class="cgn-now-support-arrow" aria-hidden="true">⌃</span></button>\
        <a class="cgn-now-copyright-line" href="/copyright/">Copyright © 2026 | CGN News — All Rights Reserved</a>\
        <nav class="cgn-now-tabs" aria-label="CGN NOW app tabs">\
          <a class="' + cls("news") + '" href="/news/"><span class="cgn-now-tab-icon">📰</span><span>News</span></a>\
          <a class="' + cls("sports") + '" href="/sports/"><span class="cgn-now-tab-icon">🏟️</span><span>Sports</span></a>\
          <a class="' + cls("weather") + '" href="/weather/"><span class="cgn-now-tab-icon">🌦️</span><span>Weather</span></a>\
          <a class="' + cls("radar") + '" href="/weather/radar/"><span class="cgn-now-tab-icon">📡</span><span>Radar</span></a>\
          <a class="' + cls("traffic") + '" href="/traffic/"><span class=\"cgn-now-tab-icon cgn-now-car-icon\" aria-hidden=\"true\"><span class=\"cgn-now-car-roof\"></span><span class=\"cgn-now-car-window\"></span><span class=\"cgn-now-car-body\"></span><span class=\"cgn-now-car-wheel cgn-now-car-wheel-left\"></span><span class=\"cgn-now-car-wheel cgn-now-car-wheel-right\"></span><span class=\"cgn-now-car-headlight\"></span></span><span>Traffic</span></a>\
          <a class="' + cls("account") + '" href="/account/"><span class="cgn-now-tab-icon">👤</span><span>Account</span></a>\
        </nav>\
      </div>';
    setupSupportMenu();
  }
  function isStandaloneApp(){
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  }
  function renderInstallWindow(){
    if(isStandaloneApp()) return;
    if(document.getElementById("cgn-now-install-window")) return;

    var panel = document.createElement("section");
    panel.id = "cgn-now-install-window";
    panel.className = "cgn-now-install-window";
    panel.setAttribute("aria-label", "Install CGN NOW");
    panel.innerHTML = '\
      <div class="cgn-now-install-card">\
        <img class="cgn-now-install-icon" src="/CGNNewsNowLogo.png" alt="CGN NOW app icon">\
        <div class="cgn-now-install-copy">\
          <strong>Install CGN NOW</strong>\
          <span>Use CGN NOW as a standalone app. Installed app name: CGN NOW.</span>\
        </div>\
        <button type="button" id="cgn-now-install-window-btn" class="cgn-now-install-window-btn" hidden>Install</button>\
        <a class="cgn-now-install-help" href="/" aria-label="Open CGN NOW install instructions">How to install</a>\
        <button type="button" id="cgn-now-install-window-close" class="cgn-now-install-window-close" aria-label="Close install prompt">×</button>\
      </div>';
    document.body.appendChild(panel);
  }
  function setupInstallPrompt(){
    var deferredPrompt = null;
    renderInstallWindow();

    window.addEventListener("beforeinstallprompt", function(event){
      event.preventDefault();
      deferredPrompt = event;
      var btn = document.getElementById("cgn-now-install-btn");
      if(btn) btn.classList.add("show");
      var windowBtn = document.getElementById("cgn-now-install-window-btn");
      if(windowBtn) windowBtn.hidden = false;
    });

    document.addEventListener("click", function(event){
      var installBtn = event.target && event.target.closest && event.target.closest("#cgn-now-install-btn, #cgn-now-install-window-btn");
      if(installBtn && deferredPrompt){
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(function(){
          deferredPrompt = null;
          var headerBtn = document.getElementById("cgn-now-install-btn");
          if(headerBtn) headerBtn.classList.remove("show");
          var windowBtn = document.getElementById("cgn-now-install-window-btn");
          if(windowBtn) windowBtn.hidden = true;
        });
      }

      var closeBtn = event.target && event.target.closest && event.target.closest("#cgn-now-install-window-close");
      if(closeBtn){
        var panel = document.getElementById("cgn-now-install-window");
        if(panel) panel.remove();
      }

      var accountWrap = document.querySelector(".account-wrap");
      var menu = document.getElementById("account-menu");
      if(accountWrap && menu && !accountWrap.contains(event.target)) menu.classList.remove("open");
    });
  }
  function patchLinks(){
    document.addEventListener("click", function(event){
      var a = event.target && event.target.closest ? event.target.closest("a[href]") : null;
      if(!a) return;
      var href = a.getAttribute("href") || "";
      if(href === "/" || href === "/index.html"){ event.preventDefault(); location.href = "/news/"; return; }
      if(href.indexOf("/category/weather") === 0){ event.preventDefault(); location.href = "/weather/"; return; }
      if(href.indexOf("/category/sports") === 0){ event.preventDefault(); location.href = "/sports/"; return; }
      if(href.indexOf("/support") === 0 || href.indexOf("/support.html") === 0){ event.preventDefault(); location.href = "/support/"; return; }
      if(href.indexOf("/contact.html") === 0){ event.preventDefault(); location.href = "/contact/"; return; }
      if(href.indexOf("/about.html") === 0){ event.preventDefault(); location.href = "/about/"; return; }
      if(href.indexOf("/contact") === 0){ event.preventDefault(); location.href = "/contact/"; return; }
      if(href.indexOf("/about") === 0){ event.preventDefault(); location.href = "/about/"; return; }
      if(href.indexOf("/bureaus") === 0 || href.indexOf("/archives") === 0 || href.indexOf("/special-reports") === 0 || href.indexOf("/investigations") === 0){ event.preventDefault(); location.href = "/news/"; return; }
    });
  }
  window.openLogin = openLogin;
  window.closeLogin = closeLogin;
  window.loginUser = shellLoginUser;
  window.signupUser = shellSignupUser;
  window.CGN_OPEN_LOGIN = openLogin;
  window.CGN_NOW_LOGOUT = logoutUser;
  function init(){
    document.body.classList.add("cgn-now-shell");
    renderHeader();
    renderFooter();
    renderLoginModal();
    setupInstallPrompt();
    patchLinks();
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){});});}
