
(function(){"use strict";
var CLIENT_ID="BAADY3HmA8ip1D8X4DGaJ9V3YBlg1INapOOrbKRCDd1nTP9KQN6WxKo9Tn5ZWectpb3LYEoeDYH6a3i1dA";
var DEFAULT_CURRENCY="USD";
var CURRENCIES=[
{code:"USD",label:"United States dollar (USD)",priceLabel:"$ / USD",hostedButtonId:"UN2JC9AKLU324",venmo:true},
{code:"EUR",label:"Euro (EUR)",priceLabel:"€ / EUR",hostedButtonId:"CDQRTENPA7CHW",venmo:false},
{code:"GBP",label:"British pound sterling (GBP)",priceLabel:"£ / GBP",hostedButtonId:"L5QMF6Y3XTU8G",venmo:false},
{code:"AUD",label:"Australian dollar (AUD)",priceLabel:"A$ / AUD",hostedButtonId:"XZCXVPHH4HJ6U",venmo:false},
{code:"BRL",label:"Brazilian real (BRL)",priceLabel:"R$ / BRL",hostedButtonId:"3P83HN2MGBB6Y",venmo:false},
{code:"HKD",label:"Hong Kong dollar (HKD)",priceLabel:"HK$ / HKD",hostedButtonId:"E4QDPS5P3572C",venmo:false},
{code:"PHP",label:"Philippine peso (PHP)",priceLabel:"₱ / PHP",hostedButtonId:"UQH9X3VDYFSLN",venmo:false},
{code:"CAD",label:"Canadian dollar (CAD)",priceLabel:"C$ / CAD",hostedButtonId:"KLFLSGM5EZKV6",venmo:false},
{code:"CHF",label:"Swiss franc (CHF)",priceLabel:"CHF",hostedButtonId:"B85SZBFHMXJEJ",venmo:false},
{code:"MXN",label:"Mexican peso (MXN)",priceLabel:"MX$ / MXN",hostedButtonId:"VT62YZXXNKNEG",venmo:false},
{code:"JPY",label:"Japanese yen (JPY)",priceLabel:"¥ / JPY",hostedButtonId:"F3FWS8KCPU49W",venmo:false},
{code:"NZD",label:"New Zealand dollar (NZD)",priceLabel:"NZ$ / NZD",hostedButtonId:"8VJF3SQSBUP9L",venmo:false}
];
function byCode(code){code=String(code||"").toUpperCase().replace(/[^A-Z]/g,"");return CURRENCIES.find(function(row){return row.code===code})||CURRENCIES[0]}
function fromButtonId(buttonId){buttonId=String(buttonId||"").trim();return CURRENCIES.find(function(row){return row.hostedButtonId===buttonId})||null}
function normalizeCurrency(code){return byCode(code).code}
function selectedCurrency(fallback){var urlCurrency="";try{urlCurrency=new URLSearchParams(location.search).get("currency")||""}catch(e){}return normalizeCurrency(urlCurrency||localStorage.getItem("cgn_payment_currency")||fallback||DEFAULT_CURRENCY)}
function saveSelectedCurrency(currency,context){var cfg=byCode(currency);try{localStorage.setItem("cgn_payment_currency",cfg.code);localStorage.setItem("cgn_payment_hosted_button_id",cfg.hostedButtonId);localStorage.setItem("cgn_payment_context",context||"site");localStorage.setItem("cgn_payment_selected_at",new Date().toISOString())}catch(e){}return cfg}
function safeText(value){return String(value||"").replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]})}
function currencySelectHtml(id,context,selected){var current=selectedCurrency(selected||DEFAULT_CURRENCY);var options=CURRENCIES.map(function(row){return '<option value="'+safeText(row.code)+'"'+(row.code===current?' selected':'')+'>'+safeText(row.label)+'</option>'}).join("");return '<label for="'+safeText(id)+'" style="display:block;font-size:12px;font-weight:900;margin:0 0 6px;">Payment currency</label><select id="'+safeText(id)+'" style="width:100%;max-width:420px;padding:10px;border:1px solid #bbb;background:#fff;">'+options+'</select><p style="font-size:12px;color:#667085;line-height:1.35;margin:8px 0 0;">Accepted currencies: USD, EUR, GBP, AUD, BRL, HKD, PHP, CAD, CHF, MXN, JPY, and NZD.</p>'}
function sdkNamespace(currency){return "paypal_"+normalizeCurrency(currency).toLowerCase()}
function loadPayPalSdk(currency){var cfg=byCode(currency),namespace=sdkNamespace(cfg.code);if(window[namespace]&&window[namespace].HostedButtons)return Promise.resolve(window[namespace]);var existing=document.getElementById("cgn-paypal-sdk-"+cfg.code);if(existing&&existing._cgnPromise)return existing._cgnPromise;var script=existing||document.createElement("script");script.id="cgn-paypal-sdk-"+cfg.code;script.setAttribute("data-namespace",namespace);script.async=true;var funding=cfg.venmo?"enable-funding=venmo":"disable-funding=venmo";script.src="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CLIENT_ID)+"&components=hosted-buttons&"+funding+"&currency="+encodeURIComponent(cfg.code);script._cgnPromise=new Promise(function(resolve,reject){script.onload=function(){resolve(window[namespace]||window.paypal)};script.onerror=function(){reject(new Error("PayPal SDK failed to load for "+cfg.code))}});if(!existing)document.head.appendChild(script);return script._cgnPromise}
function renderHostedButton(options){options=options||{};var containerId=String(options.containerId||"").replace(/^#/,"");if(!containerId)return Promise.reject(new Error("Missing PayPal container ID."));var container=document.getElementById(containerId);if(!container)return Promise.reject(new Error("PayPal container not found: "+containerId));var cfg=saveSelectedCurrency(options.currency||selectedCurrency(DEFAULT_CURRENCY),options.context||"site");container.innerHTML="";return loadPayPalSdk(cfg.code).then(function(paypalApi){if(!paypalApi||!paypalApi.HostedButtons)throw new Error("PayPal HostedButtons is unavailable for "+cfg.code);return paypalApi.HostedButtons({hostedButtonId:cfg.hostedButtonId}).render("#"+containerId)})}
function paymentQueryString(){var cfg=saveSelectedCurrency(selectedCurrency(DEFAULT_CURRENCY),"payment-success");return "currency="+encodeURIComponent(cfg.code)+"&hosted_button_id="+encodeURIComponent(cfg.hostedButtonId)}
window.CGNPayments={version:"CGN NOW payments",clientId:CLIENT_ID,defaultCurrency:DEFAULT_CURRENCY,currencies:CURRENCIES.slice(),byCode:byCode,fromButtonId:fromButtonId,normalizeCurrency:normalizeCurrency,getSelectedCurrency:selectedCurrency,saveSelectedCurrency:saveSelectedCurrency,currencySelectHtml:currencySelectHtml,renderHostedButton:renderHostedButton,paymentQueryString:paymentQueryString};
})();