[README.md](https://github.com/user-attachments/files/29233241/README.md)
<img src="CGNNewsNowLogo.png" alt="CGN NOW" width="240">

# CGN NOW iOS App PWA v1.4.0 Alpha

**Plain-English + Technical README / Operating Manual**  
Progressive Web App | CGN NOW | iOS App Experience | Browser Install Page | News | Sports | Weather | Radar | Account | Paywall | Legal Pages | Support Footer | Static GitHub Pages | Service Worker | Web Manifest | App Icons | Offline Shell | Dynamic Article Routes

**Updated:** 27 June 2026 • 02:58:02Z UTC  
**App Build Stamp:** 27 June 2026 • 02:58:02Z UTC | Developed by Cook Technology Services  
**App Version:** `CGN NOW iOS APP PWA v1.4.0 Alpha`  
**App Slug:** `cgn-now-ios-pwa-v1.4.0-alpha`  
**Repository:** `CookInternational/CGN-iOS-App`  
**Site:** https://ios.cgnnews.net  
**Production Domain:** `ios.cgnnews.net`

CGN News / Cook Global News Network  
Market Square Center  
151 N. Delaware Street, Suite 122  
Indianapolis, IN 46204  
tips@cgnnews.net | www.cgnnews.net | +1 (317) 442-1437 | Copyright © 2026 | CGN News/Cook Global News Network | All Rights Reserved.

## What's Changed in v1.4.0 Alpha?

v1.4.0 updated the Copyright page, Editorial Standards page, and added CGN Traffic Center.
---
## What's Changed in v1.3.0 Alpha?

v1.3.0 updated the Weather Radar pages, Account Page, and removed Archives from the /news page on iOS.

## What's Changed in v1.2.0 Alpha?

v1.2.0 updated the Weather page, and updated and added Sports logic for 12 cities.  

## What's Changed in v1.1.0 Alpha?

v1.1.0 Added CGN Radar pages for 44 cities. Alpha establishes the CGN NOW iOS App repository as a static, installable Progressive Web App for CGN News.

The app is designed to run from `ios.cgnnews.net`, open as a browser install landing page at the root domain, and launch to `/news/` when installed as a standalone app. The installed app name is **CGN NOW** and the app icon is served from the CGN NOW icon assets.

This build preserves the CGN News article, account, paywall, weather, sports, radar, legal, support, and editor access flows while presenting them in a mobile-first app shell.

### Fixed and locked in this build

- Defines **CGN NOW** as the installed app name.
- Uses `CGNNewsNowLogo.png` and the generated icon pack as the canonical app icon source.
- Sets the browser root at `https://ios.cgnnews.net/` as the install landing page.
- Sets the installed app launch target to `/news/`.
- Keeps `site.webmanifest` as the PWA manifest.
- Keeps `sw.js` as the service worker.
- Keeps `assets/cgn-now-shell.js` as the global app shell for header, account, support menu, fixed footer, bottom tabs, and link routing.
- Keeps `assets/cgn-now.css` as the shared app stylesheet.
- Keeps article paywall behavior through `article.html` and the CGN backend.
- Keeps dynamic article route handling through `404.html`.
- Keeps Weather, Sports, Radar, Weekly Weather Brief, Account, Support, About, Contact, and legal pages available inside the app.
- Keeps the fixed bottom app tabs for News, Sports, Weather, Radar, and Account.
- Keeps the copyright line linked to `/copyright/`.
- Keeps the collapsed **Support** bar for support/legal/footer links.

---

## 1. Executive Summary

CGN NOW iOS App PWA v1.1.0 Alpha is the static Progressive Web App shell for CGN News.

Plain-English explanation: this repository powers the installable CGN NOW app experience. Readers can open `ios.cgnnews.net` in a browser to install the app, then launch CGN NOW from their home screen or desktop app launcher. The installed app opens directly to `/news/`.

Technical explanation: this repository is a GitHub Pages-hosted static app. The PWA contract is controlled by `site.webmanifest`, `sw.js`, `index.html`, `assets/cgn-now-shell.js`, `assets/cgn-now.css`, and the app page directories. The app depends on the main CGN News backend for article feeds, account state, paywall checks, editor functions, payments, weather articles, sports articles, and dynamic article data.

---

## 2. Build Lock

| Item | Current value |
|---|---|
| App repository | `CookInternational/CGN-iOS-App` |
| Production site | `https://ios.cgnnews.net` |
| Custom domain file | `CNAME` |
| App version | `CGN NOW iOS APP PWA v1.1.0 Alpha` |
| App slug | `cgn-now-ios-pwa-v1.1.0-alpha` |
| App build stamp | `2026-06-23T04:15:38Z` |
| README updated | `23 June 2026 • 04:15:38Z UTC` |
| Installed app name | `CGN NOW` |
| Manifest file | `site.webmanifest` |
| Service worker | `sw.js` |
| Browser root page | `index.html` |
| Installed app start URL | `/news/` |
| App display mode | `standalone` |
| App scope | `/` |
| Shared shell | `assets/cgn-now-shell.js` |
| Shared stylesheet | `assets/cgn-now.css` |
| App icon source | `CGNNewsNowLogo.png` |
| Apple touch icon | `apple-touch-icon.png` |
| PWA icon pack | `icons/` |
| Article template | `article.html` |
| Dynamic route fallback | `404.html` |
| Main backend source | CGN News Google Apps Script Web App |
| Main content source | CGN News `Articles` workflow |
| Main site | `https://www.cgnnews.net` |

Critical controls:

- The installed app must be named **CGN NOW**.
- The installed app must launch to `/news/`.
- The browser root must remain the install landing page.
- The app icon must remain the CGN NOW icon, not the main CGN News favicon.
- The bottom tab navigation must remain app-style and fixed.
- The Support/legal links must remain available from the collapsed **Support** bar.
- The copyright line must remain linked to `/copyright/`.
- `assets/cgn-now-shell.js` is the global app shell and should be edited carefully.
- The app must not introduce display advertising into the CGN NOW PWA shell.
- Paywall, account, and article access logic must remain connected to the main CGN News backend.

---

## 3. PWA Contract

| PWA element | Locked behavior |
|---|---|
| Browser root | `https://ios.cgnnews.net/` opens the install landing page. |
| Installed launch | Installed app opens `/news/`. |
| App name | `CGN NOW`. |
| App icon | CGN NOW logo/icon assets. |
| Display mode | `standalone`. |
| Scope | `/`. |
| Install instructions | Root landing page explains install flow and offers browser continuation. |
| Service worker | `sw.js` caches the shell and app routes. |
| Manifest | `site.webmanifest` defines app identity, icon set, scope, start URL, theme color, and shortcuts. |

The root page is not the news page in browser mode. Browser visitors see the install window/landing page. Installed users go directly to the news app experience.

---

## 4. Repository Structure

| Path | Role |
|---|---|
| `.github/workflows/` | GitHub Pages deployment workflow area. |
| `index.html` | Browser install landing page for `ios.cgnnews.net`. |
| `news/` | Main app news index and feed experience. |
| `sports/` | CGN Sports Center app page. |
| `weather/` | CGN Weather app page, saved city controls, radar links, and Weekly Weather Brief access. |
| `weather/radar/` | Weather radar page. |
| `weather/weekly-weather-brief/` | CGN Weekly Weather Brief app page/embed experience. |
| `account/` | Account, subscription, and user settings page. |
| `article.html` | Article rendering, account state, and paywall-aware article template. |
| `404.html` | Dynamic article route resolver for `/news/`, `/sports/`, and `/weather/` article paths. |
| `assets/cgn-now-shell.js` | Global app header, account menu, install prompt, footer, bottom tabs, support/legal menu, and link routing. |
| `assets/cgn-now.css` | Shared app styling. |
| `site.webmanifest` | PWA manifest. |
| `sw.js` | Service worker cache and navigation fallback. |
| `icons/` | PWA icon assets. |
| `support/`, `about/`, `contact/` | Support and organization pages inside the app. |
| `terms-of-service/`, `privacy-policy/`, `editorial-standards/`, `equal-opportunity/`, `copyright/` | Legal and standards pages. |
| `editor/` | Editor portal access route. |
| `reporters/` | Reporter directory/profile entry point. |
| `payment-success/` | Payment success return flow. |
| `reset-password/` | Password recovery route. |
| `unsubscribe/` | Newsletter unsubscribe route. |

---

## 5. Global Shell Contract

The global app shell lives in:

`assets/cgn-now-shell.js`

It controls:

- top CGN NOW header
- CGN NOW logo link
- install button
- account/login menu
- account logout
- global support/legal footer
- collapsed **Support** bar
- copyright line
- bottom app tabs
- app route patches
- service worker registration safety
- global login modal

Locked footer behavior:

- The Support bar is a thin collapsed bar above the copyright line.
- The Support bar opens upward.
- Support/legal links must remain inside the collapsible panel.
- The copyright line must read exactly:
  `Copyright © 2026 | CGN News — All Rights Reserved`
- The copyright line must link to `/copyright/`.
- The bottom tabs must remain below the copyright line.
- The bottom tabs must include News, Sports, Weather, Radar, and Account.

Locked link routing:

| Link | Destination |
|---|---|
| `/support/` | `/support/` |
| `/contact/` | `/contact/` |
| `/about/` | `/about/` |
| `/terms-of-service/` | `/terms-of-service/` |
| `/privacy-policy/` | `/privacy-policy/` |
| `/editorial-standards/` | `/editorial-standards/` |
| `/equal-opportunity/` | `/equal-opportunity/` |
| `/copyright/` | `/copyright/` |

The shell must not redirect Contact to Support and must not redirect About to News.

---

## 6. News and Article Contract

The app uses the main CGN News backend and article workflow for live content.

| Area | Behavior |
|---|---|
| News index | Displays CGN News feed and category views. |
| Article pages | Use `article.html` and dynamic route resolution. |
| Dynamic routes | Handled through `404.html` when GitHub Pages receives a deep article path. |
| Article categories | Main app routes include News, Sports, and Weather article families. |
| Paywall | Preserved through account state and backend article access checks. |
| Account login | Available through the app shell and account page. |
| Subscriber unlock | Depends on the main CGN News backend subscription state. |

Dynamic article route families:

- `/news/YYYY/MM/DD/slug/`
- `/sports/YYYY/MM/DD/slug/`
- `/weather/YYYY/MM/DD/slug/`

The app must not replace backend article access checks with static-only article access.

---

## 7. Weather Contract

The Weather app page is located at:

`weather/index.html`

Weather page locked behavior:

- default city: Indianapolis
- saved city feature
- unit toggle: Imperial / Metric
- forecast ranges: 1, 3, 5, 7, 10, and 14 days
- hourly forecast section
- extended forecast section
- weather stats grid
- dynamic weather mood/effects
- weather news feed
- CGN LIVE Weather Center
- Weekly Weather Brief link
- Weather Radar link

Saved-city limit:

| Item | Current value |
|---|---|
| Saved city key | `cgn_weather_saved_locations` |
| Saved city constant | `WEATHER_MAX_SAVED_LOCATIONS` |
| Locked app value | `4` |

When adjusting saved-city behavior, update the constant in `weather/index.html` and keep the load/save trimming behavior tied to that constant.

---

## 8. Sports Contract

The Sports app page provides the CGN Sports Center experience and connects readers to sports articles, scores, team coverage, sports highlights, and CGN sports navigation.

Locked rules:

- Do not invent scores, schedules, standings, teams, injuries, or transactions in static markup.
- Live sports data must come from approved data sources or CGN backend feeds.
- Sports article paths should continue to resolve through the app article template and route fallback.

---

## 9. Account, Payment, and Paywall Contract

Account and subscription behavior remains tied to the main CGN News backend.

| Reader type | Access model |
|---|---|
| Anonymous reader | Limited free article access. |
| Logged-in free user | Expanded free article access. |
| Active subscriber | Unlimited article access. |

Locked rules:

- A successful payment screen alone is not enough.
- Account state must be stored and checked through the CGN backend flow.
- Subscriber state must unlock article access only when backend subscription status confirms it.
- `payment-success/` must remain connected to the return flow.
- `account/` must remain available from the app bottom tab and header account menu.
- Login, signup, logout, password reset, and account view behavior must remain intact.

---

## 10. Legal, Support, and Organization Pages

The app includes static pages for:

- Support
- Contact
- About
- Terms of Service
- Privacy Policy
- Editorial Standards
- Equal Opportunity
- Copyright
- Write For Us
- Unsubscribe
- Reporters

Locked rules:

- Legal pages must use app icons and app shell where appropriate.
- Legal/support links must remain reachable from the collapsed Support footer bar.
- The copyright line must remain visible above the bottom app buttons.
- The copyright line must link to `/copyright/`.
- Contact must go to `/contact/`.
- About must go to `/about/`.
- Support must go to `/support/`.

---

## 11. App Assets

| Asset | Role |
|---|---|
| `CGNNewsNowLogo.png` | Canonical CGN NOW app logo/icon source. |
| `CGNNewsLogo01.png` | Main CGN News logo asset retained where needed. |
| `CGNFavicon.png` | Legacy/favicon support asset. |
| `apple-touch-icon.png` | iOS home-screen icon. |
| `favicon.ico` | Browser favicon. |
| `favicon-48x48.png` | Browser/favicon icon. |
| `favicon-96x96.png` | Browser/favicon icon. |
| `icons/pwa-192.png` | Manifest icon. |
| `icons/pwa-512.png` | Manifest icon. |
| `icons/pwa-maskable-512.png` | Maskable PWA icon. |
| `CGNNowAdBanner01.png` | Desktop CGN NOW promotional banner. |
| `CGNNowAdMobileBanner01.png` | Mobile CGN NOW promotional banner. |
| `CGNNewNowBanner01.png` | Legacy/promo banner asset retained for compatibility. |

---

## 12. Service Worker and Cache Contract

The service worker file is:

`sw.js`

Locked behavior:

- Cache shell-critical app assets.
- Cache root install page.
- Cache `/news/`, `/sports/`, `/weather/`, radar, weekly weather, account, support, reporters, and legal routes where listed.
- Remove old cache versions on activate.
- Use network-first navigation with app fallback.
- Preserve app route availability where possible.

Do not cache private account state, payment status, or user credentials.

---

## 13. Deployment Runbook

1. Make the required file changes locally.
2. Confirm `README.md` remains at the repository root.
3. Confirm `site.webmanifest` still identifies the app as `CGN NOW`.
4. Confirm `site.webmanifest` still starts the installed app at `/news/`.
5. Confirm `index.html` still opens the install landing page in browser mode.
6. Confirm `assets/cgn-now-shell.js` still renders the header, Support bar, copyright line, and bottom tabs.
7. Confirm `/contact/`, `/about/`, and `/support/` route correctly.
8. Confirm `/weather/` saved city behavior is capped at four saved cities.
9. Confirm `/weather/radar/` and `/weather/weekly-weather-brief/` still load.
10. Confirm article routes still resolve through `404.html` and `article.html`.
11. Confirm account login and article paywall behavior still connect to the backend.
12. Commit the surgical change.
13. Push to `main`.
14. Confirm GitHub Pages publishes `ios.cgnnews.net`.

---

## 14. Acceptance Tests

The build is acceptable when:

- README shows `CGN NOW iOS App PWA v1.1.0 Alpha` as the current app build.
- README updated timestamp is `23 June 2026 • 04:15:38Z UTC`.
- App build stamp matches `2026-06-23T04:15:38Z`.
- Repository is `CookInternational/CGN-iOS-App`.
- Production site is `https://ios.cgnnews.net`.
- Installed app name is `CGN NOW`.
- Installed app start URL is `/news/`.
- Browser root opens the install landing page.
- `CGNNewsNowLogo.png` remains the app icon source.
- `site.webmanifest` remains present.
- `sw.js` remains present.
- `assets/cgn-now-shell.js` remains the global app shell.
- Footer Support menu opens upward and exposes support/legal links.
- Copyright line reads `Copyright © 2026 | CGN News — All Rights Reserved`.
- Contact routes to `/contact/`.
- About routes to `/about/`.
- Support routes to `/support/`.
- Weather saved city limit is four.
- News, Sports, Weather, Radar, and Account tabs remain available.
- Article paywall logic remains preserved through app/backend integration.
- Dynamic article routes are handled by `404.html`.
- No display advertising is added to the app shell.

---

## 15. File Inventory for v1.1.0 Alpha

| File | Status |
|---|---|
| `README.md` | Canonical README / operating manual for the CGN NOW iOS App PWA. |
| `index.html` | Browser install landing page for the app. |
| `site.webmanifest` | PWA identity, icons, scope, display mode, and start URL. |
| `sw.js` | Service worker and cache behavior. |
| `assets/cgn-now-shell.js` | Global app shell, account menu, Support bar, footer, bottom tabs, and link routing. |
| `assets/cgn-now.css` | Shared app styling. |
| `article.html` | Article page template and paywall-aware article rendering. |
| `404.html` | Dynamic route fallback for article pages. |
| `weather/index.html` | Weather app page, saved city cap, forecasts, radar links, and CGN LIVE Weather Center. |
| `sports/index.html` | Sports Center app page. |
| `news/index.html` | News app page. |
| `account/index.html` | Account and subscription page. |
| `support/index.html` | Support page. |
| `contact/index.html` | Contact page. |
| `about/index.html` | About page. |
| `copyright/index.html` | Copyright page. |
| `terms-of-service/index.html` | Terms page. |
| `privacy-policy/index.html` | Privacy page. |
| `editorial-standards/index.html` | Editorial Standards page. |
| `equal-opportunity/index.html` | Equal Opportunity page. |
| `icons/` | PWA icon pack. |
| `CNAME` | Custom domain configuration for `ios.cgnnews.net`. |
| `.github/workflows/` | GitHub Pages deployment workflow area. |

---

## 16. Operator Notes

- Treat changes as surgical.
- Do not rewrite the whole app to fix one route.
- Do not remove `site.webmanifest`.
- Do not remove `sw.js`.
- Do not remove `assets/cgn-now-shell.js`.
- Do not replace the CGN NOW icon with the main CGN News logo.
- Do not change installed app name away from `CGN NOW`.
- Do not change installed app start URL away from `/news/`.
- Do not convert the browser root into the news page.
- Do not break `article.html` paywall behavior.
- Do not break dynamic article resolution in `404.html`.
- Do not redirect Contact to Support.
- Do not redirect About to News.
- Do not hide Support, Contact, About, or legal links.
- Do not move the copyright line away from the fixed footer without replacing its visibility.
- Do not add display ads or AdSense code to the app shell.
- Do not remove Weather Radar or Weekly Weather Brief routes.
- Do not increase saved cities above the locked app cap without updating this README.

---

## 17. Emergency Troubleshooting

### If the installed app opens the wrong page

Check `site.webmanifest` and confirm `start_url` is `/news/`.

### If the browser root skips the install page

Check `index.html` and confirm browser mode does not immediately redirect to `/news/`.

### If the wrong app icon appears

Check `site.webmanifest`, `apple-touch-icon.png`, `icons/`, and `CGNNewsNowLogo.png`.

### If footer links route incorrectly

Check `assets/cgn-now-shell.js`, especially the footer render function and link patching logic. Contact must route to `/contact/`, About to `/about/`, and Support to `/support/`.

### If the Support menu covers the footer

Check the collapsed Support bar and upward-opening legal panel styles in `assets/cgn-now-shell.js`.

### If saved weather cities show five instead of four

Check `weather/index.html` and set `WEATHER_MAX_SAVED_LOCATIONS` to `4`.

### If article pages fail

Check `404.html`, `article.html`, backend API configuration, and route families for `/news/`, `/sports/`, and `/weather/`.

### If account login or paywall unlock fails

Check `assets/cgn-now-shell.js`, `account/index.html`, `article.html`, the stored `user_id`, and the CGN backend account/subscription endpoints.

### If GitHub Pages does not publish

Check `.github/workflows/`, GitHub Pages settings, `CNAME`, and repository deployment logs.

---

Last Updated on 27 June 2026 • 02:58:02Z UTC | Developed by Cook Technology Services  
Copyright © 2026 | CGN News/Cook Global News Network. All Rights Reserved.  
End of README - CGN NOW iOS App PWA v1.4.0 Alpha
