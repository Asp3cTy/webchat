!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var o in n)("object"==typeof exports?exports:e)[o]=n[o]}}(self,(()=>(()=>{"use strict";var e={d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function n(e){if("string"!=typeof e||!e)throw new Error("expected a non-empty string, got: "+e)}function o(e){if("number"!=typeof e)throw new Error("expected a number, got: "+e)}e.r(t),e.d(t,{Database:()=>G,Picker:()=>Ce});const i="emoji",r="keyvalue",a="favorites",s="tokens",c="count",d="group-order",l="eTag",u="url",m="skinTone",p="readonly",f="readwrite",h="skinUnicodes";function g(e){return function(e){const t=new Set,n=[];for(const o of e){const e=o.unicode;t.has(e)||(t.add(e),n.push(o))}return n}(e)}const b={},y={},k={};function v(e,t,n){n.onerror=()=>t(n.error),n.onblocked=()=>t(new Error("IDB blocked")),n.onsuccess=()=>e(n.result)}function w(e,t,n,o){return new Promise(((i,r)=>{const a=e.transaction(t,n,{durability:"relaxed"}),s="string"==typeof t?a.objectStore(t):t.map((e=>a.objectStore(e)));let c;o(s,a,(e=>{c=e})),a.oncomplete=()=>i(c),a.onerror=()=>r(a.error)}))}function j(e){const t=b[e],n=t&&t.result;if(n){n.close();const t=k[e];if(t)for(const e of t)e()}delete b[e],delete y[e],delete k[e]}const E=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);function S(e){return e.split(/[\s_]+/).map((e=>!e.match(/\w/)||E.has(e)?e.toLowerCase():e.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase())).filter(Boolean)}const T=2;function x(e){return e.filter(Boolean).map((e=>e.toLowerCase())).filter((e=>e.length>=T))}function C(e,t,n,o){e[t](n).onsuccess=e=>o&&o(e.target.result)}function $(e,t,n){C(e,"get",t,n)}function _(e,t,n){C(e,"getAll",t,n)}function L(e){e.commit&&e.commit()}function P(e,t){const n=function(e,t){let n=e[0];for(let o=1;o<e.length;o++){const i=e[o];t(n)>t(i)&&(n=i)}return n}(e,(e=>e.length)),o=[];for(const i of n)e.some((e=>-1===e.findIndex((e=>t(e)===t(i)))))||o.push(i);return o}async function z(e,t,n,o){try{const a=function(e){return e.map((({annotation:e,emoticon:t,group:n,order:o,shortcodes:i,skins:r,tags:a,emoji:s,version:c})=>{const d=[...new Set(x([...(i||[]).map(S).flat(),...a.map(S).flat(),...S(e),t]))].sort(),l={annotation:e,group:n,order:o,tags:a,tokens:d,unicode:s,version:c};if(t&&(l.emoticon=t),i&&(l.shortcodes=i),r){l.skinTones=[],l.skinUnicodes=[],l.skinVersions=[];for(const{tone:e,emoji:t,version:n}of r)l.skinTones.push(e),l.skinUnicodes.push(t),l.skinVersions.push(n)}return l}))}(t);await w(e,[i,r],f,(([e,t],i)=>{let r,s,c=0;function d(){2==++c&&function(){if(r!==o||s!==n){e.clear();for(const t of a)e.put(t);t.put(o,l),t.put(n,u),L(i)}}()}$(t,l,(e=>{r=e,d()})),$(t,u,(e=>{s=e,d()}))}))}finally{}}async function I(e,t){const n=x(S(t));return n.length?w(e,i,p,((e,t,o)=>{const i=[],r=()=>{const e=P(i,(e=>e.unicode));o(e.sort(((e,t)=>e.order<t.order?-1:1)))};for(let t=0;t<n.length;t++){const o=n[t],a=t===n.length-1?IDBKeyRange.bound(o,o+"￿",!1,!0):IDBKeyRange.only(o);_(e.index(s),a,(e=>{i.push(e),i.length===n.length&&r()}))}})):[]}function M(e,t,n){return w(e,t,p,((e,t,o)=>$(e,n,o)))}const A=["name","url"];function B(e){!function(e){const t=e&&Array.isArray(e),n=t&&e.length&&(!e[0]||A.some((t=>!(t in e[0]))));if(!t||n)throw new Error("Custom emojis are in the wrong format")}(e);const t=(e,t)=>e.name.toLowerCase()<t.name.toLowerCase()?-1:1,n=e.sort(t),o=function(e){const t=new Map;for(const n of e){const e=[...new Set((n.shortcodes||[]).map((e=>S(e))).flat())];for(const o of e){let e=t;for(let t=0;t<o.length;t++){const n=o.charAt(t);let i=e.get(n);i||(i=new Map,e.set(n,i)),e=i}let i=e.get("");i||(i=[],e.set("",i)),i.push(n)}}return(e,n)=>{let o=t;for(let t=0;t<e.length;t++){const n=e.charAt(t),i=o.get(n);if(!i)return[];o=i}if(n)return o.get("")||[];const i=[],r=[o];for(;r.length;){const e=[...r.shift().entries()].sort(((e,t)=>e[0]<t[0]?-1:1));for(const[t,n]of e)""===t?i.push(...n):r.push(n)}return i}}(e),i=e=>o(e,!0),r=e=>o(e,!1),a=new Map,s=new Map;for(const t of e){s.set(t.name.toLowerCase(),t);for(const e of t.shortcodes||[])a.set(e.toLowerCase(),t)}return{all:n,search:e=>{const n=S(e);return P(n.map(((e,t)=>(t<n.length-1?i:r)(e))),(e=>e.name)).sort(t)},byShortcode:e=>a.get(e.toLowerCase()),byName:e=>s.get(e.toLowerCase())}}const O="undefined"!=typeof wrappedJSObject;function N(e){if(!e)return e;if(O&&(e=structuredClone(e)),delete e.tokens,e.skinTones){const t=e.skinTones.length;e.skins=Array(t);for(let n=0;n<t;n++)e.skins[n]={tone:e.skinTones[n],unicode:e.skinUnicodes[n],version:e.skinVersions[n]};delete e.skinTones,delete e.skinUnicodes,delete e.skinVersions}return e}function D(e){e||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}const F=["annotation","emoji","group","order","tags","version"];function W(e,t){if(2!==Math.floor(e.status/100))throw new Error("Failed to fetch: "+t+":  "+e.status)}async function U(e){const t=await fetch(e);W(t,e);const n=t.headers.get("etag");D(n);const o=await t.json();return function(e){if(!e||!Array.isArray(e)||!e[0]||"object"!=typeof e[0]||F.some((t=>!(t in e[0]))))throw new Error("Emoji data is in the wrong format")}(o),[n,o]}async function R(e){let t=function(e){for(var t=e.length,n=new ArrayBuffer(t),o=new Uint8Array(n),i=-1;++i<t;)o[i]=e.charCodeAt(i);return n}(JSON.stringify(e));const n=function(e){for(var t="",n=new Uint8Array(e),o=n.byteLength,i=-1;++i<o;)t+=String.fromCharCode(n[i]);return t}(await crypto.subtle.digest("SHA-1",t));return btoa(n)}class G{constructor({dataSource:e="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",locale:t="en",customEmoji:n=[]}={}){this.dataSource=e,this.locale=t,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=B(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){const e=this._db=await(t=this._dbName,y[t]||(y[t]=async function(e){const t=await new Promise(((t,n)=>{const o=indexedDB.open(e,1);b[e]=o,o.onupgradeneeded=e=>{e.oldVersion<1&&function(e){function t(t,n,o){const i=n?e.createObjectStore(t,{keyPath:n}):e.createObjectStore(t);if(o)for(const[e,[t,n]]of Object.entries(o))i.createIndex(e,t,{multiEntry:n});return i}t(r),t(i,"unicode",{[s]:["tokens",!0],[d]:[["group","order"]],[h]:["skinUnicodes",!0]}),t(a,void 0,{[c]:[""]})}(o.result)},v(t,n,o)}));return t.onclose=()=>j(e),t}(t)),y[t]);var t;!function(e,t){let n=k[e];n||(n=k[e]=[]),n.push(t)}(this._dbName,this._clear);const n=this.dataSource,o=await async function(e){return!await M(e,r,u)}(e);o?await async function(e,t){let[n,o]=await U(t);n||(n=await R(o)),await z(e,o,t,n)}(e,n):this._lazyUpdate=async function(e,t){let n,o=await async function(e){const t=await fetch(e,{method:"HEAD"});W(t,e);const n=t.headers.get("etag");return D(n),n}(t);if(!o){const e=await U(t);o=e[0],n=e[1],o||(o=await R(n))}await async function(e,t,n){const[o,i]=await Promise.all([l,u].map((t=>M(e,r,t))));return o===n&&i===t}(e,t,o)||(n||(n=(await U(t))[1]),await z(e,n,t,o))}(e,n)}async ready(){const e=async()=>(this._ready||(this._ready=this._init()),this._ready);await e(),this._db||await e()}async getEmojiByGroup(e){return o(e),await this.ready(),g(await async function(e,t){return w(e,i,p,((e,n,o)=>{const i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);_(e.index(d),i,o)}))}(this._db,e)).map(N)}async getEmojiBySearchQuery(e){return n(e),await this.ready(),[...this._custom.search(e),...g(await I(this._db,e)).map(N)]}async getEmojiByShortcode(e){n(e),await this.ready();return this._custom.byShortcode(e)||N(await async function(e,t){const n=await I(e,t);if(!n.length){const n=e=>(e.shortcodes||[]).includes(t.toLowerCase());return await async function(e,t){return w(e,i,p,((e,n,o)=>{let i;const r=()=>{e.getAll(i&&IDBKeyRange.lowerBound(i,!0),50).onsuccess=e=>{const n=e.target.result;for(const e of n)if(i=e.unicode,t(e))return o(e);if(n.length<50)return o();r()}};r()}))}(e,n)||null}return n.filter((e=>{const n=(e.shortcodes||[]).map((e=>e.toLowerCase()));return n.includes(t.toLowerCase())}))[0]||null}(this._db,e))}async getEmojiByUnicodeOrName(e){n(e),await this.ready();return this._custom.byName(e)||N(await async function(e,t){return w(e,i,p,((e,n,o)=>$(e,t,(n=>{if(n)return o(n);$(e.index(h),t,(e=>o(e||null)))}))))}(this._db,e))}async getPreferredSkinTone(){return await this.ready(),await M(this._db,r,m)||0}async setPreferredSkinTone(e){return o(e),await this.ready(),t=this._db,n=m,i=e,w(t,r,f,((e,t)=>{e.put(i,n),L(t)}));var t,n,i}async incrementFavoriteEmojiCount(e){return n(e),await this.ready(),t=this._db,o=e,w(t,a,f,((e,t)=>$(e,o,(n=>{e.put((n||0)+1,o),L(t)}))));var t,o}async getTopFavoriteEmoji(e){return o(e),await this.ready(),(await function(e,t,n){return 0===n?[]:w(e,[a,i],p,(([e,o],i,r)=>{const a=[];e.index(c).openCursor(void 0,"prev").onsuccess=e=>{const i=e.target.result;if(!i)return r(a);function s(e){if(a.push(e),a.length===n)return r(a);i.continue()}const c=i.primaryKey,d=t.byName(c);if(d)return s(d);$(o,c,(e=>{if(e)return s(e);i.continue()}))}}))}(this._db,this._custom,e)).map(N)}set customEmoji(e){this._custom=B(e)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch(e){}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await j(this._dbName)}async delete(){var e;await this._shutdown(),await(e=this._dbName,new Promise(((t,n)=>{j(e),v(t,n,indexedDB.deleteDatabase(e))})))}}const V=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map((([e,t,n])=>({id:e,emoji:t,name:n}))),K=V.slice(1),H="function"==typeof requestIdleCallback?requestIdleCallback:setTimeout;function q(e){return e.unicode.includes("‍")}const X={"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},J=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Q='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Y=(e,t)=>e<t?-1:e>t?1:0,Z=(e,t)=>{const n=document.createElement("canvas");n.width=n.height=1;const o=n.getContext("2d");return o.textBaseline="top",o.font=`100px ${Q}`,o.fillStyle=t,o.scale(.01,.01),o.fillText(e,0,0),o.getImageData(0,0,1,1).data};function ee(e){const t=Z(e,"#000"),n=Z(e,"#fff");return t&&n&&((e,t)=>{const n=[...e].join(",");return n===[...t].join(",")&&!n.startsWith("0,0,0,")})(t,n)}let te;const ne=()=>(te||(te=new Promise((e=>H((()=>e(function(){const e=Object.entries(X);try{for(const[t,n]of e)if(ee(t))return n}catch(e){}return e[0][1]}())))))),te),oe=new Map;function ie(e){e.preventDefault(),e.stopPropagation()}function re(e,t,n){return(t+=e?-1:1)<0?t=n.length-1:t>=n.length&&(t=0),t}function ae(e,t){const n=new Set,o=[];for(const i of e){const e=t(i);n.has(e)||(n.add(e),o.push(i))}return o}const se=requestAnimationFrame;let ce,de="function"==typeof ResizeObserver;function le(e){{const t=document.createRange();return t.selectNode(e.firstChild),t.getBoundingClientRect().width}}function ue(e,t,n){let o=e.get(t);return o||(o=n(),e.set(t,o)),o}function me(e){return""+e}const pe=new WeakMap,fe=new WeakMap,he=Symbol("un-keyed"),ge="replaceChildren"in Element.prototype;function be(e,t){const{targetNode:n}=t;let{targetParentNode:o}=t,i=!1;o?i=function(e,t){let n=e.firstChild,o=0;for(;n;){if(t[o]!==n)return!0;n=n.nextSibling,o++}return o!==t.length}(o,e):(i=!0,t.targetNode=void 0,t.targetParentNode=o=n.parentNode),i&&function(e,t){ge?e.replaceChildren(...t):(e.innerHTML="",e.append(...t))}(o,e)}function ye(e){const{template:t,elementsToBindings:n}=ue(pe,e,(()=>function(e){let t="",n=!1,o=!1,i=-1;const r=new Map,a=[];for(let s=0,c=e.length;s<c;s++){const d=e[s];if(t+=d,s===c-1)break;for(let e=0;e<d.length;e++)switch(d.charAt(e)){case"<":"/"===d.charAt(e+1)?a.pop():(n=!0,a.push(++i));break;case">":n=!1,o=!1;break;case"=":o=!0}const l=ue(r,a[a.length-1],(()=>[]));let u,m,p;if(o){const t=/(\S+)="?([^"=]*)$/.exec(d);u=t[1],m=t[2],p=/^[^">]*/.exec(e[s+1])[0]}const f={attributeName:u,attributeValuePre:m,attributeValuePost:p,expressionIndex:s};l.push(f),n||o||(t+=" ")}const s=function(e){const t=document.createElement("template");return t.innerHTML=e,t}(t);return{template:s,elementsToBindings:r}}(e))),o=t.cloneNode(!0).content.firstElementChild,i=function(e,t){const n=[],o=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT);let i=e,r=-1;do{const e=t.get(++r);if(e)for(let t=0;t<e.length;t++){const o=e[t],r={binding:o,targetNode:o.attributeName?i:i.firstChild,targetParentNode:void 0,currentExpression:void 0};n.push(r)}}while(i=o.nextNode());return n}(o,n);return function(e){return function(e,t){for(const n of t){const{targetNode:t,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:s}}=n,c=e[i];if(o!==c)if(n.currentExpression=c,r)t.setAttribute(r,a+me(c)+s);else{let e;Array.isArray(c)?be(c,n):c instanceof Element?(e=c,t.replaceWith(e)):t.nodeValue=me(c),e&&(n.targetNode=e)}}}(e,i),o}}const ke="function"==typeof queueMicrotask?queueMicrotask:e=>Promise.resolve().then(e);function ve(e,t,n){if(e.length!==t.length)return!1;for(let o=0;o<e.length;o++)if(!n(e[o],t[o]))return!1;return!0}const we=[],{assign:je}=Object;function Ee(e,t){const n={},o=new AbortController,i=o.signal,{state:r,createEffect:a}=function(e){let t,n=!1;const o=new Map,i=new Set;let r;const a=()=>{if(n)return;const e=[...i];i.clear();try{for(const t of e)t()}finally{r=!1,i.size&&(r=!0,ke(a))}},s=new Proxy({},{get(e,n){if(t){let e=o.get(n);e||(e=new Set,o.set(n,e)),e.add(t)}return e[n]},set(e,t,n){e[t]=n;const s=o.get(t);if(s){for(const e of s)i.add(e);r||(r=!0,ke(a))}return!0}});return e.addEventListener("abort",(()=>{n=!0})),{state:s,createEffect:e=>{const n=()=>{const o=t;t=n;try{return e()}finally{t=o}};return n()}}}(i);je(r,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),je(r,t),je(r,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:8,isRtl:!1,scrollbarWidth:0,currentGroupIndex:0,groups:K,databaseLoaded:!1,activeSearchItemId:void 0}),a((()=>{r.currentGroup!==r.groups[r.currentGroupIndex]&&(r.currentGroup=r.groups[r.currentGroupIndex])}));const s=t=>{e.getElementById(t).focus()},c=t=>e.getElementById(`emo-${t.id}`),d=(e,t)=>{n.rootElement.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))},l=(e,t)=>e.id===t.id,u=(e,t)=>{const{category:n,emojis:o}=e,{category:i,emojis:r}=t;return n===i&&ve(o,r,l)},m=e=>{ve(r.currentEmojis,e,l)||(r.currentEmojis=e)},p=e=>{r.searchMode!==e&&(r.searchMode=e)},f=(e,t)=>t&&e.skins&&e.skins[t]||e.unicode,h={labelWithSkin:(e,t)=>{return(n=[e.name||f(e,t),e.annotation,...e.shortcodes||we].filter(Boolean),ae(n,(e=>e))).join(", ");var n},titleForEmoji:e=>e.annotation||(e.shortcodes||we).join(", "),unicodeWithSkin:f},g={onClickSkinToneButton:function(e){r.skinTonePickerExpanded=!r.skinTonePickerExpanded,r.activeSkinTone=r.currentSkinTone,r.skinTonePickerExpanded&&(ie(e),se((()=>s("skintone-list"))))},onEmojiClick:async function(e){const{target:t}=e;t.classList.contains("emoji")&&(ie(e),E(t.id.substring(4)))},onNavClick:function(e){const{target:t}=e,o=t.closest(".nav-button");if(!o)return;const i=parseInt(o.dataset.groupId,10);n.searchElement.value="",r.rawSearchText="",r.searchText="",r.activeSearchItem=-1,r.currentGroupIndex=r.groups.findIndex((e=>e.id===i))},onNavKeydown:function(e){const{target:t,key:n}=e,o=t=>{t&&(ie(e),t.focus())};switch(n){case"ArrowLeft":return o(t.previousElementSibling);case"ArrowRight":return o(t.nextElementSibling);case"Home":return o(t.parentElement.firstElementChild);case"End":return o(t.parentElement.lastElementChild)}},onSearchKeydown:function(e){if(!r.searchMode||!r.currentEmojis.length)return;const t=t=>{ie(e),r.activeSearchItem=re(t,r.activeSearchItem,r.currentEmojis)};switch(e.key){case"ArrowDown":return t(!1);case"ArrowUp":return t(!0);case"Enter":if(-1!==r.activeSearchItem)return ie(e),E(r.currentEmojis[r.activeSearchItem].id);r.activeSearchItem=0}},onSkinToneOptionsClick:function(e){const{target:{id:t}}=e,n=t&&t.match(/^skintone-(\d)/);n&&(ie(e),S(parseInt(n[1],10)))},onSkinToneOptionsFocusOut:async function(e){const{relatedTarget:t}=e;t&&"skintone-list"===t.id||(r.skinTonePickerExpanded=!1)},onSkinToneOptionsKeydown:function(e){if(!r.skinTonePickerExpanded)return;const t=async t=>{ie(e),r.activeSkinTone=t};switch(e.key){case"ArrowUp":return t(re(!0,r.activeSkinTone,r.skinTones));case"ArrowDown":return t(re(!1,r.activeSkinTone,r.skinTones));case"Home":return t(0);case"End":return t(r.skinTones.length-1);case"Enter":return ie(e),S(r.activeSkinTone);case"Escape":return ie(e),r.skinTonePickerExpanded=!1,s("skintone-button")}},onSkinToneOptionsKeyup:function(e){if(r.skinTonePickerExpanded)return" "===e.key?(ie(e),S(r.activeSkinTone)):void 0},onSearchInput:function(e){r.rawSearchText=e.target.value}},b={calculateEmojiGridStyle:function(e){!function(e,t,n){let o;de?(o=new ResizeObserver((e=>n(e[0].contentRect.width))),o.observe(e)):se((()=>n(e.getBoundingClientRect().width))),t.addEventListener("abort",(()=>{o&&o.disconnect()}))}(e,i,(t=>{{const o=getComputedStyle(n.rootElement),i=parseInt(o.getPropertyValue("--num-columns"),10),a="rtl"===o.getPropertyValue("direction"),s=e.parentElement.getBoundingClientRect().width-t;r.numColumns=i,r.scrollbarWidth=s,r.isRtl=a}}))}};let y=!0;function k(){r.database.customEmoji=r.customEmoji||we}function v(e){return!e.unicode||!q(e)||oe.get(e.unicode)}async function w(e){const t=r.emojiVersion||await ne();return e.filter((({version:e})=>!e||e<=t))}async function j(e){return function(e,t){const n=e=>{const n={};for(const o of e)"number"==typeof o.tone&&o.version<=t&&(n[o.tone]=o.unicode);return n};return e.map((({unicode:e,skins:t,shortcodes:o,url:i,name:r,category:a,annotation:s})=>({unicode:e,name:r,shortcodes:o,url:i,category:a,annotation:s,id:e||r,skins:t&&n(t)})))}(e,r.emojiVersion||await ne())}async function E(e){const t=await r.database.getEmojiByUnicodeOrName(e),n=[...r.currentEmojis,...r.currentFavorites].find((t=>t.id===e)),o=n.unicode&&f(n,r.currentSkinTone);await r.database.incrementFavoriteEmojiCount(e),d("emoji-click",{emoji:t,skinTone:r.currentSkinTone,...o&&{unicode:o},...n.name&&{name:n.name}})}function S(e){r.currentSkinTone=e,r.skinTonePickerExpanded=!1,s("skintone-button"),d("skin-tone-change",{skinTone:e}),r.database.setPreferredSkinTone(e)}return a((()=>{(function(e,t,n,o,i,r,a,s){const{labelWithSkin:c,titleForEmoji:d,unicodeWithSkin:l}=n,{html:u,map:m}=function(e){const t=ue(fe,e,(()=>new Map));let n=he;return{map:function(e,t,o){return e.map(((e,i)=>{const r=n;n=o(e);try{return t(e,i)}finally{n=r}}))},html:function(e,...o){const i=ue(t,e,(()=>new Map));return ue(i,n,(()=>ye(e)))(o)}}}(t);function p(e,n,o){return m(e,((e,i)=>u`<button role="${n?"option":"menuitem"}" aria-selected="${t.searchMode?i===t.activeSearchItem:""}" aria-label="${c(e,t.currentSkinTone)}" title="${d(e)}" class="emoji ${n&&i===t.activeSearchItem?"active":""}" id="${`${o}-${e.id}`}">${e.unicode?l(e,t.currentSkinTone):u`<img class="custom-emoji" src="${e.url}" alt="" loading="lazy">`}</button>`),(e=>`${o}-${e.id}`))}const f=u`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!(!t.searchMode||!t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:""}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${m(t.skinTones,((e,n)=>u`<div id="skintone-${n}" class="emoji ${n===t.activeSkinTone?"active":""}" aria-selected="${n===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[n]}" aria-label="${t.i18n.skinTones[n]}">${e}</div>`),(e=>e))}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${m(t.groups,(e=>u`<button role="tab" class="nav-button" aria-controls="tab-${e.id}" aria-label="${t.i18n.categories[e.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===e.id}" title="${t.i18n.categories[e.name]}" data-group-id="${e.id}"><div class="nav-emoji emoji">${e.emoji}</div></button>`),(e=>e.id))}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?"":`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${m(t.currentEmojisWithCategories,((e,n)=>u`<div><div id="menu-label-${n}" class="category ${1===t.currentEmojisWithCategories.length&&""===t.currentEmojisWithCategories[0].category?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:e.category?e.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${n}" id="${t.searchMode?"search-results":""}">${p(e.emojis,t.searchMode,"emo")}</div></div>`),(e=>e.category))}</div></div><div class="favorites emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" style="padding-inline-end:${`${t.scrollbarWidth}px`}" data-on-click="onEmojiClick">${p(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`;if(s){e.appendChild(f);const t=(t,n)=>{for(const o of e.querySelectorAll(`[${t}]`))n(o,o.getAttribute(t))};for(const e of["click","focusout","input","keydown","keyup"])t(`data-on-${e}`,((t,n)=>{t.addEventListener(e,o[n])}));t("data-ref",((e,t)=>{r[t]=e})),t("data-action",((e,t)=>{i[t](e)})),a.addEventListener("abort",(()=>{e.removeChild(f)}))}})(e,r,h,g,b,n,i,y),y=!1})),r.emojiVersion||ne().then((e=>{e||(r.message=r.i18n.emojiUnsupportedMessage)})),a((()=>{r.database&&async function(){let e=!1;const t=setTimeout((()=>{e=!0,r.message=r.i18n.loadingMessage}),1e3);try{await r.database.ready(),r.databaseLoaded=!0}catch(e){console.error(e),r.message=r.i18n.networkErrorMessage}finally{clearTimeout(t),e&&(e=!1,r.message="")}}()})),a((()=>{r.pickerStyle=`\n      --num-groups: ${r.groups.length}; \n      --indicator-opacity: ${r.searchMode?0:1}; \n      --num-skintones: 6;`})),a((()=>{r.customEmoji&&r.database&&k()})),a((()=>{r.customEmoji&&r.customEmoji.length?r.groups!==V&&(r.groups=V):r.groups!==K&&(r.currentGroupIndex&&r.currentGroupIndex--,r.groups=K)})),a((()=>{!async function(){r.databaseLoaded&&(r.currentSkinTone=await r.database.getPreferredSkinTone())}()})),a((()=>{r.skinTones=Array(6).fill().map(((e,t)=>function(e,t){if(0===t)return e;const n=e.indexOf("‍");return-1!==n?e.substring(0,n)+String.fromCodePoint(127995+t-1)+e.substring(n):(e.endsWith("️")&&(e=e.substring(0,e.length-1)),e+"\ud83c"+String.fromCodePoint(57339+t-1))}(r.skinToneEmoji,t)))})),a((()=>{r.skinToneButtonText=r.skinTones[r.currentSkinTone]})),a((()=>{r.skinToneButtonLabel=r.i18n.skinToneLabel.replace("{skinTone}",r.i18n.skinTones[r.currentSkinTone])})),a((()=>{r.databaseLoaded&&async function(){const{database:e}=r,t=(await Promise.all(J.map((t=>e.getEmojiByUnicodeOrName(t))))).filter(Boolean);r.defaultFavoriteEmojis=t}()})),a((()=>{r.databaseLoaded&&r.defaultFavoriteEmojis&&async function(){k();const{database:e,defaultFavoriteEmojis:t,numColumns:n}=r,o=await e.getTopFavoriteEmoji(n),i=await j(ae([...o,...t],(e=>e.unicode||e.name)).slice(0,n));r.currentFavorites=i}()})),a((()=>{!async function(){const{searchText:e,currentGroup:t,databaseLoaded:n,customEmoji:o}=r;if(n)if(e.length>=2){const t=await async function(e){return j(await w(await r.database.getEmojiBySearchQuery(e)))}(e);r.searchText===e&&(m(t),p(!0))}else{const{id:e}=t;if(-1!==e||o&&o.length){const t=await async function(e){const t=-1===e?r.customEmoji:await r.database.getEmojiByGroup(e);return j(await w(t))}(e);r.currentGroup.id===e&&(m(t),p(!1))}}else r.currentEmojis=[],r.searchMode=!1}()})),a((()=>{const{currentEmojis:e,emojiVersion:t}=r,o=e.filter((e=>e.unicode)).filter((e=>q(e)&&!oe.has(e.unicode)));if(!t&&o.length)m(e),se((()=>function(e){(function(e,t,n){for(const o of e){const e=le(n(o));void 0===ce&&(ce=le(t));const i=e/1.8<ce;oe.set(o.unicode,i)}})(e,n.baselineEmoji,c),r.currentEmojis=r.currentEmojis}(o)));else{const o=t?e:e.filter(v);m(o),se((()=>{var e;(e=n.tabpanelElement)&&(e.scrollTop=0)}))}})),a((()=>{})),a((()=>{var e;e=function(){const{searchMode:e,currentEmojis:t}=r;if(e)return[{category:"",emojis:t}];const n=new Map;for(const e of t){const t=e.category||"";let o=n.get(t);o||(o=[],n.set(t,o)),o.push(e)}return[...n.entries()].map((([e,t])=>({category:e,emojis:t}))).sort(((e,t)=>r.customCategorySorting(e.category,t.category)))}(),ve(r.currentEmojisWithCategories,e,u)||(r.currentEmojisWithCategories=e)})),a((()=>{r.activeSearchItemId=-1!==r.activeSearchItem&&r.currentEmojis[r.activeSearchItem].id})),a((()=>{const{rawSearchText:e}=r;H((()=>{r.searchText=(e||"").trim(),r.activeSearchItem=-1}))})),a((()=>{r.skinTonePickerExpanded?n.skinToneDropdown.addEventListener("transitionend",(()=>{r.skinTonePickerExpandedAfterAnimation=!0}),{once:!0}):r.skinTonePickerExpandedAfterAnimation=!1})),{$set(e){je(r,e)},$destroy(){o.abort()}}}var Se={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}};const Te=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],xe=`:host{--emoji-font-family:${Q}}`;class Ce extends HTMLElement{constructor(e){super(),this.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent=":host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.custom-emoji,.emoji,button.emoji{height:var(--total-emoji-size);width:var(--total-emoji-size)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.custom-emoji{padding:var(--emoji-padding);object-fit:contain;pointer-events:none;background-repeat:no-repeat;background-position:center center;background-size:var(--emoji-size) var(--emoji-size)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}"+xe,this.shadowRoot.appendChild(t),this._ctx={locale:"en",dataSource:"https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",skinToneEmoji:"🖐️",customCategorySorting:Y,customEmoji:null,i18n:Se,emojiVersion:null,...e};for(const e of Te)"database"!==e&&Object.prototype.hasOwnProperty.call(this,e)&&(this._ctx[e]=this[e],delete this[e]);this._dbFlush()}connectedCallback(){this._cmp||(this._cmp=Ee(this.shadowRoot,this._ctx))}disconnectedCallback(){ke((()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;const{database:e}=this._ctx;e.close().catch((e=>console.error(e)))}}))}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(e,t,n){this._set(e.replace(/-([a-z])/g,((e,t)=>t.toUpperCase())),"emoji-version"===e?parseFloat(n):n)}_set(e,t){this._ctx[e]=t,this._cmp&&this._cmp.$set({[e]:t}),["locale","dataSource"].includes(e)&&this._dbFlush()}_dbCreate(){const{locale:e,dataSource:t,database:n}=this._ctx;n&&n.locale===e&&n.dataSource===t||this._set("database",new G({locale:e,dataSource:t}))}_dbFlush(){ke((()=>this._dbCreate()))}}const $e={};for(const e of Te)$e[e]={get(){return"database"===e&&this._dbCreate(),this._ctx[e]},set(t){if("database"===e)throw new Error("database is read-only");this._set(e,t)}};return Object.defineProperties(Ce.prototype,$e),customElements.get("emoji-picker")||customElements.define("emoji-picker",Ce),t})()));