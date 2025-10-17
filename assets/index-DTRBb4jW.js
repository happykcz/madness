(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();class Kr{constructor(){this.routes=new Map,this.beforeEachGuards=[],this.currentRoute=null,this.isInitialized=!1}register(e,t){this.routes.set(e,t)}registerRoutes(e){Object.entries(e).forEach(([t,r])=>{this.register(t,r)})}beforeEach(e){this.beforeEachGuards.push(e)}navigate(e,t=!1){const r=`#${e}`;t?window.location.replace(r):window.location.hash=r}back(){window.history.back()}getCurrentPath(){return window.location.hash.slice(1)||"/"}getParams(){const e=window.location.hash,t=e.indexOf("?");if(t===-1)return{};const r=e.slice(t+1),n=new URLSearchParams(r);return Object.fromEntries(n.entries())}async handleRouteChange(){const e=this.getCurrentPath(),t=this.routes.get(e);let r=!0;for(const n of this.beforeEachGuards)if(await n(e,this.currentRoute,o=>{o&&this.navigate(o,!0)})===!1){r=!1;break}if(r)if(this.currentRoute=e,t)try{await t()}catch{this.handleNotFound()}else this.handleNotFound()}handleNotFound(){const e=document.querySelector("#app");e&&(e.innerHTML=`
        <div class="min-h-screen flex items-center justify-center" style="background-color: #fafbfc;">
          <div class="card max-w-md text-center">
            <h1 class="text-3xl font-bold mb-4" style="color: #24292e;">404</h1>
            <p class="mb-6" style="color: #586069;">Route not found</p>
            <button class="btn btn-primary" onclick="window.location.hash='#/'">
              Go Home
            </button>
          </div>
        </div>
      `)}init(){this.isInitialized||(window.addEventListener("hashchange",()=>this.handleRouteChange()),this.handleRouteChange(),this.isInitialized=!0)}destroy(){window.removeEventListener("hashchange",()=>this.handleRouteChange()),this.isInitialized=!1}}const z=new Kr,Vr="modulepreload",Jr=function(i){return"/"+i},Ot={},Fe=function(e,t,r){let n=Promise.resolve();if(t&&t.length>0){let d=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};var o=d;document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),l=a?.nonce||a?.getAttribute("nonce");n=d(t.map(c=>{if(c=Jr(c),c in Ot)return;Ot[c]=!0;const u=c.endsWith(".css"),h=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":Vr,u||(p.as="script"),p.crossOrigin="",p.href=c,l&&p.setAttribute("nonce",l),document.head.appendChild(p),u)return new Promise((g,m)=>{p.addEventListener("load",g),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function s(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return n.then(a=>{for(const l of a||[])l.status==="rejected"&&s(l.reason);return e().catch(s)})},Yr=i=>{let e;return i?e=i:typeof fetch>"u"?e=(...t)=>Fe(async()=>{const{default:r}=await Promise.resolve().then(()=>je);return{default:r}},void 0).then(({default:r})=>r(...t)):e=fetch,(...t)=>e(...t)};class At extends Error{constructor(e,t="FunctionsError",r){super(e),this.name=t,this.context=r}}class Pt extends At{constructor(e){super("Failed to send a request to the Edge Function","FunctionsFetchError",e)}}class Rt extends At{constructor(e){super("Relay Error invoking the Edge Function","FunctionsRelayError",e)}}class jt extends At{constructor(e){super("Edge Function returned a non-2xx status code","FunctionsHttpError",e)}}var gt;(function(i){i.Any="any",i.ApNortheast1="ap-northeast-1",i.ApNortheast2="ap-northeast-2",i.ApSouth1="ap-south-1",i.ApSoutheast1="ap-southeast-1",i.ApSoutheast2="ap-southeast-2",i.CaCentral1="ca-central-1",i.EuCentral1="eu-central-1",i.EuWest1="eu-west-1",i.EuWest2="eu-west-2",i.EuWest3="eu-west-3",i.SaEast1="sa-east-1",i.UsEast1="us-east-1",i.UsWest1="us-west-1",i.UsWest2="us-west-2"})(gt||(gt={}));var Qr=function(i,e,t,r){function n(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(c){try{d(r.next(c))}catch(u){o(u)}}function l(c){try{d(r.throw(c))}catch(u){o(u)}}function d(c){c.done?s(c.value):n(c.value).then(a,l)}d((r=r.apply(i,e||[])).next())})};class Zr{constructor(e,{headers:t={},customFetch:r,region:n=gt.Any}={}){this.url=e,this.headers=t,this.region=n,this.fetch=Yr(r)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e){return Qr(this,arguments,void 0,function*(t,r={}){var n;try{const{headers:s,method:o,body:a,signal:l}=r;let d={},{region:c}=r;c||(c=this.region);const u=new URL(`${this.url}/${t}`);c&&c!=="any"&&(d["x-region"]=c,u.searchParams.set("forceFunctionRegion",c));let h;a&&(s&&!Object.prototype.hasOwnProperty.call(s,"Content-Type")||!s)&&(typeof Blob<"u"&&a instanceof Blob||a instanceof ArrayBuffer?(d["Content-Type"]="application/octet-stream",h=a):typeof a=="string"?(d["Content-Type"]="text/plain",h=a):typeof FormData<"u"&&a instanceof FormData?h=a:(d["Content-Type"]="application/json",h=JSON.stringify(a)));const p=yield this.fetch(u.toString(),{method:o||"POST",headers:Object.assign(Object.assign(Object.assign({},d),this.headers),s),body:h,signal:l}).catch(_=>{throw _.name==="AbortError"?_:new Pt(_)}),g=p.headers.get("x-relay-error");if(g&&g==="true")throw new Rt(p);if(!p.ok)throw new jt(p);let m=((n=p.headers.get("Content-Type"))!==null&&n!==void 0?n:"text/plain").split(";")[0].trim(),f;return m==="application/json"?f=yield p.json():m==="application/octet-stream"?f=yield p.blob():m==="text/event-stream"?f=p:m==="multipart/form-data"?f=yield p.formData():f=yield p.text(),{data:f,error:null,response:p}}catch(s){return s instanceof Error&&s.name==="AbortError"?{data:null,error:new Pt(s)}:{data:null,error:s,response:s instanceof jt||s instanceof Rt?s.context:void 0}}})}}function Xr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function ei(i){if(Object.prototype.hasOwnProperty.call(i,"__esModule"))return i;var e=i.default;if(typeof e=="function"){var t=function r(){var n=!1;try{n=this instanceof r}catch{}return n?Reflect.construct(e,arguments,this.constructor):e.apply(this,arguments)};t.prototype=e.prototype}else t={};return Object.defineProperty(t,"__esModule",{value:!0}),Object.keys(i).forEach(function(r){var n=Object.getOwnPropertyDescriptor(i,r);Object.defineProperty(t,r,n.get?n:{enumerable:!0,get:function(){return i[r]}})}),t}var R={},fe={},me={},ye={},ve={},be={},ti=function(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("unable to locate global object")},Oe=ti();const ri=Oe.fetch,ur=Oe.fetch.bind(Oe),hr=Oe.Headers,ii=Oe.Request,ni=Oe.Response,je=Object.freeze(Object.defineProperty({__proto__:null,Headers:hr,Request:ii,Response:ni,default:ur,fetch:ri},Symbol.toStringTag,{value:"Module"})),si=ei(je);var Ke={},Lt;function pr(){if(Lt)return Ke;Lt=1,Object.defineProperty(Ke,"__esModule",{value:!0});class i extends Error{constructor(t){super(t.message),this.name="PostgrestError",this.details=t.details,this.hint=t.hint,this.code=t.code}}return Ke.default=i,Ke}var Bt;function gr(){if(Bt)return be;Bt=1;var i=be&&be.__importDefault||function(n){return n&&n.__esModule?n:{default:n}};Object.defineProperty(be,"__esModule",{value:!0});const e=i(si),t=i(pr());class r{constructor(s){var o,a;this.shouldThrowOnError=!1,this.method=s.method,this.url=s.url,this.headers=new Headers(s.headers),this.schema=s.schema,this.body=s.body,this.shouldThrowOnError=(o=s.shouldThrowOnError)!==null&&o!==void 0?o:!1,this.signal=s.signal,this.isMaybeSingle=(a=s.isMaybeSingle)!==null&&a!==void 0?a:!1,s.fetch?this.fetch=s.fetch:typeof fetch>"u"?this.fetch=e.default:this.fetch=fetch}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(s,o){return this.headers=new Headers(this.headers),this.headers.set(s,o),this}then(s,o){this.schema===void 0||(["GET","HEAD"].includes(this.method)?this.headers.set("Accept-Profile",this.schema):this.headers.set("Content-Profile",this.schema)),this.method!=="GET"&&this.method!=="HEAD"&&this.headers.set("Content-Type","application/json");const a=this.fetch;let l=a(this.url.toString(),{method:this.method,headers:this.headers,body:JSON.stringify(this.body),signal:this.signal}).then(async d=>{var c,u,h,p;let g=null,m=null,f=null,_=d.status,b=d.statusText;if(d.ok){if(this.method!=="HEAD"){const S=await d.text();S===""||(this.headers.get("Accept")==="text/csv"||this.headers.get("Accept")&&(!((c=this.headers.get("Accept"))===null||c===void 0)&&c.includes("application/vnd.pgrst.plan+text"))?m=S:m=JSON.parse(S))}const k=(u=this.headers.get("Prefer"))===null||u===void 0?void 0:u.match(/count=(exact|planned|estimated)/),C=(h=d.headers.get("content-range"))===null||h===void 0?void 0:h.split("/");k&&C&&C.length>1&&(f=parseInt(C[1])),this.isMaybeSingle&&this.method==="GET"&&Array.isArray(m)&&(m.length>1?(g={code:"PGRST116",details:`Results contain ${m.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:"JSON object requested, multiple (or no) rows returned"},m=null,f=null,_=406,b="Not Acceptable"):m.length===1?m=m[0]:m=null)}else{const k=await d.text();try{g=JSON.parse(k),Array.isArray(g)&&d.status===404&&(m=[],g=null,_=200,b="OK")}catch{d.status===404&&k===""?(_=204,b="No Content"):g={message:k}}if(g&&this.isMaybeSingle&&(!((p=g?.details)===null||p===void 0)&&p.includes("0 rows"))&&(g=null,_=200,b="OK"),g&&this.shouldThrowOnError)throw new t.default(g)}return{error:g,data:m,count:f,status:_,statusText:b}});return this.shouldThrowOnError||(l=l.catch(d=>{var c,u,h;return{error:{message:`${(c=d?.name)!==null&&c!==void 0?c:"FetchError"}: ${d?.message}`,details:`${(u=d?.stack)!==null&&u!==void 0?u:""}`,hint:"",code:`${(h=d?.code)!==null&&h!==void 0?h:""}`},data:null,count:null,status:0,statusText:""}})),l.then(s,o)}returns(){return this}overrideTypes(){return this}}return be.default=r,be}var zt;function fr(){if(zt)return ve;zt=1;var i=ve&&ve.__importDefault||function(r){return r&&r.__esModule?r:{default:r}};Object.defineProperty(ve,"__esModule",{value:!0});const e=i(gr());class t extends e.default{select(n){let s=!1;const o=(n??"*").split("").map(a=>/\s/.test(a)&&!s?"":(a==='"'&&(s=!s),a)).join("");return this.url.searchParams.set("select",o),this.headers.append("Prefer","return=representation"),this}order(n,{ascending:s=!0,nullsFirst:o,foreignTable:a,referencedTable:l=a}={}){const d=l?`${l}.order`:"order",c=this.url.searchParams.get(d);return this.url.searchParams.set(d,`${c?`${c},`:""}${n}.${s?"asc":"desc"}${o===void 0?"":o?".nullsfirst":".nullslast"}`),this}limit(n,{foreignTable:s,referencedTable:o=s}={}){const a=typeof o>"u"?"limit":`${o}.limit`;return this.url.searchParams.set(a,`${n}`),this}range(n,s,{foreignTable:o,referencedTable:a=o}={}){const l=typeof a>"u"?"offset":`${a}.offset`,d=typeof a>"u"?"limit":`${a}.limit`;return this.url.searchParams.set(l,`${n}`),this.url.searchParams.set(d,`${s-n+1}`),this}abortSignal(n){return this.signal=n,this}single(){return this.headers.set("Accept","application/vnd.pgrst.object+json"),this}maybeSingle(){return this.method==="GET"?this.headers.set("Accept","application/json"):this.headers.set("Accept","application/vnd.pgrst.object+json"),this.isMaybeSingle=!0,this}csv(){return this.headers.set("Accept","text/csv"),this}geojson(){return this.headers.set("Accept","application/geo+json"),this}explain({analyze:n=!1,verbose:s=!1,settings:o=!1,buffers:a=!1,wal:l=!1,format:d="text"}={}){var c;const u=[n?"analyze":null,s?"verbose":null,o?"settings":null,a?"buffers":null,l?"wal":null].filter(Boolean).join("|"),h=(c=this.headers.get("Accept"))!==null&&c!==void 0?c:"application/json";return this.headers.set("Accept",`application/vnd.pgrst.plan+${d}; for="${h}"; options=${u};`),d==="json"?this:this}rollback(){return this.headers.append("Prefer","tx=rollback"),this}returns(){return this}maxAffected(n){return this.headers.append("Prefer","handling=strict"),this.headers.append("Prefer",`max-affected=${n}`),this}}return ve.default=t,ve}var Mt;function Ct(){if(Mt)return ye;Mt=1;var i=ye&&ye.__importDefault||function(r){return r&&r.__esModule?r:{default:r}};Object.defineProperty(ye,"__esModule",{value:!0});const e=i(fr());class t extends e.default{eq(n,s){return this.url.searchParams.append(n,`eq.${s}`),this}neq(n,s){return this.url.searchParams.append(n,`neq.${s}`),this}gt(n,s){return this.url.searchParams.append(n,`gt.${s}`),this}gte(n,s){return this.url.searchParams.append(n,`gte.${s}`),this}lt(n,s){return this.url.searchParams.append(n,`lt.${s}`),this}lte(n,s){return this.url.searchParams.append(n,`lte.${s}`),this}like(n,s){return this.url.searchParams.append(n,`like.${s}`),this}likeAllOf(n,s){return this.url.searchParams.append(n,`like(all).{${s.join(",")}}`),this}likeAnyOf(n,s){return this.url.searchParams.append(n,`like(any).{${s.join(",")}}`),this}ilike(n,s){return this.url.searchParams.append(n,`ilike.${s}`),this}ilikeAllOf(n,s){return this.url.searchParams.append(n,`ilike(all).{${s.join(",")}}`),this}ilikeAnyOf(n,s){return this.url.searchParams.append(n,`ilike(any).{${s.join(",")}}`),this}is(n,s){return this.url.searchParams.append(n,`is.${s}`),this}in(n,s){const o=Array.from(new Set(s)).map(a=>typeof a=="string"&&new RegExp("[,()]").test(a)?`"${a}"`:`${a}`).join(",");return this.url.searchParams.append(n,`in.(${o})`),this}contains(n,s){return typeof s=="string"?this.url.searchParams.append(n,`cs.${s}`):Array.isArray(s)?this.url.searchParams.append(n,`cs.{${s.join(",")}}`):this.url.searchParams.append(n,`cs.${JSON.stringify(s)}`),this}containedBy(n,s){return typeof s=="string"?this.url.searchParams.append(n,`cd.${s}`):Array.isArray(s)?this.url.searchParams.append(n,`cd.{${s.join(",")}}`):this.url.searchParams.append(n,`cd.${JSON.stringify(s)}`),this}rangeGt(n,s){return this.url.searchParams.append(n,`sr.${s}`),this}rangeGte(n,s){return this.url.searchParams.append(n,`nxl.${s}`),this}rangeLt(n,s){return this.url.searchParams.append(n,`sl.${s}`),this}rangeLte(n,s){return this.url.searchParams.append(n,`nxr.${s}`),this}rangeAdjacent(n,s){return this.url.searchParams.append(n,`adj.${s}`),this}overlaps(n,s){return typeof s=="string"?this.url.searchParams.append(n,`ov.${s}`):this.url.searchParams.append(n,`ov.{${s.join(",")}}`),this}textSearch(n,s,{config:o,type:a}={}){let l="";a==="plain"?l="pl":a==="phrase"?l="ph":a==="websearch"&&(l="w");const d=o===void 0?"":`(${o})`;return this.url.searchParams.append(n,`${l}fts${d}.${s}`),this}match(n){return Object.entries(n).forEach(([s,o])=>{this.url.searchParams.append(s,`eq.${o}`)}),this}not(n,s,o){return this.url.searchParams.append(n,`not.${s}.${o}`),this}or(n,{foreignTable:s,referencedTable:o=s}={}){const a=o?`${o}.or`:"or";return this.url.searchParams.append(a,`(${n})`),this}filter(n,s,o){return this.url.searchParams.append(n,`${s}.${o}`),this}}return ye.default=t,ye}var Nt;function mr(){if(Nt)return me;Nt=1;var i=me&&me.__importDefault||function(r){return r&&r.__esModule?r:{default:r}};Object.defineProperty(me,"__esModule",{value:!0});const e=i(Ct());class t{constructor(n,{headers:s={},schema:o,fetch:a}){this.url=n,this.headers=new Headers(s),this.schema=o,this.fetch=a}select(n,s){const{head:o=!1,count:a}=s??{},l=o?"HEAD":"GET";let d=!1;const c=(n??"*").split("").map(u=>/\s/.test(u)&&!d?"":(u==='"'&&(d=!d),u)).join("");return this.url.searchParams.set("select",c),a&&this.headers.append("Prefer",`count=${a}`),new e.default({method:l,url:this.url,headers:this.headers,schema:this.schema,fetch:this.fetch})}insert(n,{count:s,defaultToNull:o=!0}={}){var a;const l="POST";if(s&&this.headers.append("Prefer",`count=${s}`),o||this.headers.append("Prefer","missing=default"),Array.isArray(n)){const d=n.reduce((c,u)=>c.concat(Object.keys(u)),[]);if(d.length>0){const c=[...new Set(d)].map(u=>`"${u}"`);this.url.searchParams.set("columns",c.join(","))}}return new e.default({method:l,url:this.url,headers:this.headers,schema:this.schema,body:n,fetch:(a=this.fetch)!==null&&a!==void 0?a:fetch})}upsert(n,{onConflict:s,ignoreDuplicates:o=!1,count:a,defaultToNull:l=!0}={}){var d;const c="POST";if(this.headers.append("Prefer",`resolution=${o?"ignore":"merge"}-duplicates`),s!==void 0&&this.url.searchParams.set("on_conflict",s),a&&this.headers.append("Prefer",`count=${a}`),l||this.headers.append("Prefer","missing=default"),Array.isArray(n)){const u=n.reduce((h,p)=>h.concat(Object.keys(p)),[]);if(u.length>0){const h=[...new Set(u)].map(p=>`"${p}"`);this.url.searchParams.set("columns",h.join(","))}}return new e.default({method:c,url:this.url,headers:this.headers,schema:this.schema,body:n,fetch:(d=this.fetch)!==null&&d!==void 0?d:fetch})}update(n,{count:s}={}){var o;const a="PATCH";return s&&this.headers.append("Prefer",`count=${s}`),new e.default({method:a,url:this.url,headers:this.headers,schema:this.schema,body:n,fetch:(o=this.fetch)!==null&&o!==void 0?o:fetch})}delete({count:n}={}){var s;const o="DELETE";return n&&this.headers.append("Prefer",`count=${n}`),new e.default({method:o,url:this.url,headers:this.headers,schema:this.schema,fetch:(s=this.fetch)!==null&&s!==void 0?s:fetch})}}return me.default=t,me}var Dt;function oi(){if(Dt)return fe;Dt=1;var i=fe&&fe.__importDefault||function(n){return n&&n.__esModule?n:{default:n}};Object.defineProperty(fe,"__esModule",{value:!0});const e=i(mr()),t=i(Ct());class r{constructor(s,{headers:o={},schema:a,fetch:l}={}){this.url=s,this.headers=new Headers(o),this.schemaName=a,this.fetch=l}from(s){const o=new URL(`${this.url}/${s}`);return new e.default(o,{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch})}schema(s){return new r(this.url,{headers:this.headers,schema:s,fetch:this.fetch})}rpc(s,o={},{head:a=!1,get:l=!1,count:d}={}){var c;let u;const h=new URL(`${this.url}/rpc/${s}`);let p;a||l?(u=a?"HEAD":"GET",Object.entries(o).filter(([m,f])=>f!==void 0).map(([m,f])=>[m,Array.isArray(f)?`{${f.join(",")}}`:`${f}`]).forEach(([m,f])=>{h.searchParams.append(m,f)})):(u="POST",p=o);const g=new Headers(this.headers);return d&&g.set("Prefer",`count=${d}`),new t.default({method:u,url:h,headers:g,schema:this.schemaName,body:p,fetch:(c=this.fetch)!==null&&c!==void 0?c:fetch})}}return fe.default=r,fe}var Ut;function ai(){if(Ut)return R;Ut=1;var i=R&&R.__importDefault||function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(R,"__esModule",{value:!0}),R.PostgrestError=R.PostgrestBuilder=R.PostgrestTransformBuilder=R.PostgrestFilterBuilder=R.PostgrestQueryBuilder=R.PostgrestClient=void 0;const e=i(oi());R.PostgrestClient=e.default;const t=i(mr());R.PostgrestQueryBuilder=t.default;const r=i(Ct());R.PostgrestFilterBuilder=r.default;const n=i(fr());R.PostgrestTransformBuilder=n.default;const s=i(gr());R.PostgrestBuilder=s.default;const o=i(pr());return R.PostgrestError=o.default,R.default={PostgrestClient:e.default,PostgrestQueryBuilder:t.default,PostgrestFilterBuilder:r.default,PostgrestTransformBuilder:n.default,PostgrestBuilder:s.default,PostgrestError:o.default},R}var li=ai();const di=Xr(li),{PostgrestClient:ci,PostgrestQueryBuilder:Wo,PostgrestFilterBuilder:Go,PostgrestTransformBuilder:Ko,PostgrestBuilder:Vo,PostgrestError:Jo}=di;class ui{static detectEnvironment(){var e;if(typeof WebSocket<"u")return{type:"native",constructor:WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocket<"u")return{type:"native",constructor:globalThis.WebSocket};if(typeof global<"u"&&typeof global.WebSocket<"u")return{type:"native",constructor:global.WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocketPair<"u"&&typeof globalThis.WebSocket>"u")return{type:"cloudflare",error:"Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",workaround:"Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."};if(typeof globalThis<"u"&&globalThis.EdgeRuntime||typeof navigator<"u"&&(!((e=navigator.userAgent)===null||e===void 0)&&e.includes("Vercel-Edge")))return{type:"unsupported",error:"Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",workaround:"Use serverless functions or a different deployment target for WebSocket functionality."};if(typeof process<"u"){const t=process.versions;if(t&&t.node){const r=t.node,n=parseInt(r.replace(/^v/,"").split(".")[0]);return n>=22?typeof globalThis.WebSocket<"u"?{type:"native",constructor:globalThis.WebSocket}:{type:"unsupported",error:`Node.js ${n} detected but native WebSocket not found.`,workaround:"Provide a WebSocket implementation via the transport option."}:{type:"unsupported",error:`Node.js ${n} detected without native WebSocket support.`,workaround:`For Node.js < 22, install "ws" package and provide it via the transport option:
import ws from "ws"
new RealtimeClient(url, { transport: ws })`}}}return{type:"unsupported",error:"Unknown JavaScript runtime without WebSocket support.",workaround:"Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."}}static getWebSocketConstructor(){const e=this.detectEnvironment();if(e.constructor)return e.constructor;let t=e.error||"WebSocket not supported in this environment.";throw e.workaround&&(t+=`

Suggested solution: ${e.workaround}`),new Error(t)}static createWebSocket(e,t){const r=this.getWebSocketConstructor();return new r(e,t)}static isWebSocketSupported(){try{const e=this.detectEnvironment();return e.type==="native"||e.type==="ws"}catch{return!1}}}const hi="2.75.0",pi=`realtime-js/${hi}`,gi="1.0.0",ft=1e4,fi=1e3,mi=100;var ze;(function(i){i[i.connecting=0]="connecting",i[i.open=1]="open",i[i.closing=2]="closing",i[i.closed=3]="closed"})(ze||(ze={}));var P;(function(i){i.closed="closed",i.errored="errored",i.joined="joined",i.joining="joining",i.leaving="leaving"})(P||(P={}));var U;(function(i){i.close="phx_close",i.error="phx_error",i.join="phx_join",i.reply="phx_reply",i.leave="phx_leave",i.access_token="access_token"})(U||(U={}));var mt;(function(i){i.websocket="websocket"})(mt||(mt={}));var de;(function(i){i.Connecting="connecting",i.Open="open",i.Closing="closing",i.Closed="closed"})(de||(de={}));class yi{constructor(){this.HEADER_LENGTH=1}decode(e,t){return e.constructor===ArrayBuffer?t(this._binaryDecode(e)):t(typeof e=="string"?JSON.parse(e):{})}_binaryDecode(e){const t=new DataView(e),r=new TextDecoder;return this._decodeBroadcast(e,t,r)}_decodeBroadcast(e,t,r){const n=t.getUint8(1),s=t.getUint8(2);let o=this.HEADER_LENGTH+2;const a=r.decode(e.slice(o,o+n));o=o+n;const l=r.decode(e.slice(o,o+s));o=o+s;const d=JSON.parse(r.decode(e.slice(o,e.byteLength)));return{ref:null,topic:a,event:l,payload:d}}}class yr{constructor(e,t){this.callback=e,this.timerCalc=t,this.timer=void 0,this.tries=0,this.callback=e,this.timerCalc=t}reset(){this.tries=0,clearTimeout(this.timer),this.timer=void 0}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries=this.tries+1,this.callback()},this.timerCalc(this.tries+1))}}var T;(function(i){i.abstime="abstime",i.bool="bool",i.date="date",i.daterange="daterange",i.float4="float4",i.float8="float8",i.int2="int2",i.int4="int4",i.int4range="int4range",i.int8="int8",i.int8range="int8range",i.json="json",i.jsonb="jsonb",i.money="money",i.numeric="numeric",i.oid="oid",i.reltime="reltime",i.text="text",i.time="time",i.timestamp="timestamp",i.timestamptz="timestamptz",i.timetz="timetz",i.tsrange="tsrange",i.tstzrange="tstzrange"})(T||(T={}));const qt=(i,e,t={})=>{var r;const n=(r=t.skipTypes)!==null&&r!==void 0?r:[];return e?Object.keys(e).reduce((s,o)=>(s[o]=vi(o,i,e,n),s),{}):{}},vi=(i,e,t,r)=>{const n=e.find(a=>a.name===i),s=n?.type,o=t[i];return s&&!r.includes(s)?vr(s,o):yt(o)},vr=(i,e)=>{if(i.charAt(0)==="_"){const t=i.slice(1,i.length);return _i(e,t)}switch(i){case T.bool:return bi(e);case T.float4:case T.float8:case T.int2:case T.int4:case T.int8:case T.numeric:case T.oid:return wi(e);case T.json:case T.jsonb:return xi(e);case T.timestamp:return ki(e);case T.abstime:case T.date:case T.daterange:case T.int4range:case T.int8range:case T.money:case T.reltime:case T.text:case T.time:case T.timestamptz:case T.timetz:case T.tsrange:case T.tstzrange:return yt(e);default:return yt(e)}},yt=i=>i,bi=i=>{switch(i){case"t":return!0;case"f":return!1;default:return i}},wi=i=>{if(typeof i=="string"){const e=parseFloat(i);if(!Number.isNaN(e))return e}return i},xi=i=>{if(typeof i=="string")try{return JSON.parse(i)}catch{return i}return i},_i=(i,e)=>{if(typeof i!="string")return i;const t=i.length-1,r=i[t];if(i[0]==="{"&&r==="}"){let s;const o=i.slice(1,t);try{s=JSON.parse("["+o+"]")}catch{s=o?o.split(","):[]}return s.map(a=>vr(e,a))}return i},ki=i=>typeof i=="string"?i.replace(" ","T"):i,br=i=>{let e=i;return e=e.replace(/^ws/i,"http"),e=e.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i,""),e.replace(/\/+$/,"")+"/api/broadcast"};class st{constructor(e,t,r={},n=ft){this.channel=e,this.event=t,this.payload=r,this.timeout=n,this.sent=!1,this.timeoutTimer=void 0,this.ref="",this.receivedResp=null,this.recHooks=[],this.refEvent=null}resend(e){this.timeout=e,this._cancelRefEvent(),this.ref="",this.refEvent=null,this.receivedResp=null,this.sent=!1,this.send()}send(){this._hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload,ref:this.ref,join_ref:this.channel._joinRef()}))}updatePayload(e){this.payload=Object.assign(Object.assign({},this.payload),e)}receive(e,t){var r;return this._hasReceived(e)&&t((r=this.receivedResp)===null||r===void 0?void 0:r.response),this.recHooks.push({status:e,callback:t}),this}startTimeout(){if(this.timeoutTimer)return;this.ref=this.channel.socket._makeRef(),this.refEvent=this.channel._replyEventName(this.ref);const e=t=>{this._cancelRefEvent(),this._cancelTimeout(),this.receivedResp=t,this._matchReceive(t)};this.channel._on(this.refEvent,{},e),this.timeoutTimer=setTimeout(()=>{this.trigger("timeout",{})},this.timeout)}trigger(e,t){this.refEvent&&this.channel._trigger(this.refEvent,{status:e,response:t})}destroy(){this._cancelRefEvent(),this._cancelTimeout()}_cancelRefEvent(){this.refEvent&&this.channel._off(this.refEvent,{})}_cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=void 0}_matchReceive({status:e,response:t}){this.recHooks.filter(r=>r.status===e).forEach(r=>r.callback(t))}_hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}}var Ft;(function(i){i.SYNC="sync",i.JOIN="join",i.LEAVE="leave"})(Ft||(Ft={}));class Me{constructor(e,t){this.channel=e,this.state={},this.pendingDiffs=[],this.joinRef=null,this.enabled=!1,this.caller={onJoin:()=>{},onLeave:()=>{},onSync:()=>{}};const r=t?.events||{state:"presence_state",diff:"presence_diff"};this.channel._on(r.state,{},n=>{const{onJoin:s,onLeave:o,onSync:a}=this.caller;this.joinRef=this.channel._joinRef(),this.state=Me.syncState(this.state,n,s,o),this.pendingDiffs.forEach(l=>{this.state=Me.syncDiff(this.state,l,s,o)}),this.pendingDiffs=[],a()}),this.channel._on(r.diff,{},n=>{const{onJoin:s,onLeave:o,onSync:a}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(n):(this.state=Me.syncDiff(this.state,n,s,o),a())}),this.onJoin((n,s,o)=>{this.channel._trigger("presence",{event:"join",key:n,currentPresences:s,newPresences:o})}),this.onLeave((n,s,o)=>{this.channel._trigger("presence",{event:"leave",key:n,currentPresences:s,leftPresences:o})}),this.onSync(()=>{this.channel._trigger("presence",{event:"sync"})})}static syncState(e,t,r,n){const s=this.cloneDeep(e),o=this.transformState(t),a={},l={};return this.map(s,(d,c)=>{o[d]||(l[d]=c)}),this.map(o,(d,c)=>{const u=s[d];if(u){const h=c.map(f=>f.presence_ref),p=u.map(f=>f.presence_ref),g=c.filter(f=>p.indexOf(f.presence_ref)<0),m=u.filter(f=>h.indexOf(f.presence_ref)<0);g.length>0&&(a[d]=g),m.length>0&&(l[d]=m)}else a[d]=c}),this.syncDiff(s,{joins:a,leaves:l},r,n)}static syncDiff(e,t,r,n){const{joins:s,leaves:o}={joins:this.transformState(t.joins),leaves:this.transformState(t.leaves)};return r||(r=()=>{}),n||(n=()=>{}),this.map(s,(a,l)=>{var d;const c=(d=e[a])!==null&&d!==void 0?d:[];if(e[a]=this.cloneDeep(l),c.length>0){const u=e[a].map(p=>p.presence_ref),h=c.filter(p=>u.indexOf(p.presence_ref)<0);e[a].unshift(...h)}r(a,c,l)}),this.map(o,(a,l)=>{let d=e[a];if(!d)return;const c=l.map(u=>u.presence_ref);d=d.filter(u=>c.indexOf(u.presence_ref)<0),e[a]=d,n(a,d,l),d.length===0&&delete e[a]}),e}static map(e,t){return Object.getOwnPropertyNames(e).map(r=>t(r,e[r]))}static transformState(e){return e=this.cloneDeep(e),Object.getOwnPropertyNames(e).reduce((t,r)=>{const n=e[r];return"metas"in n?t[r]=n.metas.map(s=>(s.presence_ref=s.phx_ref,delete s.phx_ref,delete s.phx_ref_prev,s)):t[r]=n,t},{})}static cloneDeep(e){return JSON.parse(JSON.stringify(e))}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel._joinRef()}}var Ht;(function(i){i.ALL="*",i.INSERT="INSERT",i.UPDATE="UPDATE",i.DELETE="DELETE"})(Ht||(Ht={}));var Ne;(function(i){i.BROADCAST="broadcast",i.PRESENCE="presence",i.POSTGRES_CHANGES="postgres_changes",i.SYSTEM="system"})(Ne||(Ne={}));var Y;(function(i){i.SUBSCRIBED="SUBSCRIBED",i.TIMED_OUT="TIMED_OUT",i.CLOSED="CLOSED",i.CHANNEL_ERROR="CHANNEL_ERROR"})(Y||(Y={}));class $t{constructor(e,t={config:{}},r){var n,s;if(this.topic=e,this.params=t,this.socket=r,this.bindings={},this.state=P.closed,this.joinedOnce=!1,this.pushBuffer=[],this.subTopic=e.replace(/^realtime:/i,""),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:"",enabled:!1},private:!1},t.config),this.timeout=this.socket.timeout,this.joinPush=new st(this,U.join,this.params,this.timeout),this.rejoinTimer=new yr(()=>this._rejoinUntilConnected(),this.socket.reconnectAfterMs),this.joinPush.receive("ok",()=>{this.state=P.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(o=>o.send()),this.pushBuffer=[]}),this._onClose(()=>{this.rejoinTimer.reset(),this.socket.log("channel",`close ${this.topic} ${this._joinRef()}`),this.state=P.closed,this.socket._remove(this)}),this._onError(o=>{this._isLeaving()||this._isClosed()||(this.socket.log("channel",`error ${this.topic}`,o),this.state=P.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("timeout",()=>{this._isJoining()&&(this.socket.log("channel",`timeout ${this.topic}`,this.joinPush.timeout),this.state=P.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("error",o=>{this._isLeaving()||this._isClosed()||(this.socket.log("channel",`error ${this.topic}`,o),this.state=P.errored,this.rejoinTimer.scheduleTimeout())}),this._on(U.reply,{},(o,a)=>{this._trigger(this._replyEventName(a),o)}),this.presence=new Me(this),this.broadcastEndpointURL=br(this.socket.endPoint),this.private=this.params.config.private||!1,!this.private&&(!((s=(n=this.params.config)===null||n===void 0?void 0:n.broadcast)===null||s===void 0)&&s.replay))throw`tried to use replay on public channel '${this.topic}'. It must be a private channel.`}subscribe(e,t=this.timeout){var r,n,s;if(this.socket.isConnected()||this.socket.connect(),this.state==P.closed){const{config:{broadcast:o,presence:a,private:l}}=this.params,d=(n=(r=this.bindings.postgres_changes)===null||r===void 0?void 0:r.map(p=>p.filter))!==null&&n!==void 0?n:[],c=!!this.bindings[Ne.PRESENCE]&&this.bindings[Ne.PRESENCE].length>0||((s=this.params.config.presence)===null||s===void 0?void 0:s.enabled)===!0,u={},h={broadcast:o,presence:Object.assign(Object.assign({},a),{enabled:c}),postgres_changes:d,private:l};this.socket.accessTokenValue&&(u.access_token=this.socket.accessTokenValue),this._onError(p=>e?.(Y.CHANNEL_ERROR,p)),this._onClose(()=>e?.(Y.CLOSED)),this.updateJoinPayload(Object.assign({config:h},u)),this.joinedOnce=!0,this._rejoin(t),this.joinPush.receive("ok",async({postgres_changes:p})=>{var g;if(this.socket.setAuth(),p===void 0){e?.(Y.SUBSCRIBED);return}else{const m=this.bindings.postgres_changes,f=(g=m?.length)!==null&&g!==void 0?g:0,_=[];for(let b=0;b<f;b++){const v=m[b],{filter:{event:k,schema:C,table:S,filter:O}}=v,ee=p&&p[b];if(ee&&ee.event===k&&ee.schema===C&&ee.table===S&&ee.filter===O)_.push(Object.assign(Object.assign({},v),{id:ee.id}));else{this.unsubscribe(),this.state=P.errored,e?.(Y.CHANNEL_ERROR,new Error("mismatch between server and client bindings for postgres changes"));return}}this.bindings.postgres_changes=_,e&&e(Y.SUBSCRIBED);return}}).receive("error",p=>{this.state=P.errored,e?.(Y.CHANNEL_ERROR,new Error(JSON.stringify(Object.values(p).join(", ")||"error")))}).receive("timeout",()=>{e?.(Y.TIMED_OUT)})}return this}presenceState(){return this.presence.state}async track(e,t={}){return await this.send({type:"presence",event:"track",payload:e},t.timeout||this.timeout)}async untrack(e={}){return await this.send({type:"presence",event:"untrack"},e)}on(e,t,r){return this.state===P.joined&&e===Ne.PRESENCE&&(this.socket.log("channel",`resubscribe to ${this.topic} due to change in presence callbacks on joined channel`),this.unsubscribe().then(()=>this.subscribe())),this._on(e,t,r)}async send(e,t={}){var r,n;if(!this._canPush()&&e.type==="broadcast"){const{event:s,payload:o}=e,l={method:"POST",headers:{Authorization:this.socket.accessTokenValue?`Bearer ${this.socket.accessTokenValue}`:"",apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"},body:JSON.stringify({messages:[{topic:this.subTopic,event:s,payload:o,private:this.private}]})};try{const d=await this._fetchWithTimeout(this.broadcastEndpointURL,l,(r=t.timeout)!==null&&r!==void 0?r:this.timeout);return await((n=d.body)===null||n===void 0?void 0:n.cancel()),d.ok?"ok":"error"}catch(d){return d.name==="AbortError"?"timed out":"error"}}else return new Promise(s=>{var o,a,l;const d=this._push(e.type,e,t.timeout||this.timeout);e.type==="broadcast"&&!(!((l=(a=(o=this.params)===null||o===void 0?void 0:o.config)===null||a===void 0?void 0:a.broadcast)===null||l===void 0)&&l.ack)&&s("ok"),d.receive("ok",()=>s("ok")),d.receive("error",()=>s("error")),d.receive("timeout",()=>s("timed out"))})}updateJoinPayload(e){this.joinPush.updatePayload(e)}unsubscribe(e=this.timeout){this.state=P.leaving;const t=()=>{this.socket.log("channel",`leave ${this.topic}`),this._trigger(U.close,"leave",this._joinRef())};this.joinPush.destroy();let r=null;return new Promise(n=>{r=new st(this,U.leave,{},e),r.receive("ok",()=>{t(),n("ok")}).receive("timeout",()=>{t(),n("timed out")}).receive("error",()=>{n("error")}),r.send(),this._canPush()||r.trigger("ok",{})}).finally(()=>{r?.destroy()})}teardown(){this.pushBuffer.forEach(e=>e.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=P.closed,this.bindings={}}async _fetchWithTimeout(e,t,r){const n=new AbortController,s=setTimeout(()=>n.abort(),r),o=await this.socket.fetch(e,Object.assign(Object.assign({},t),{signal:n.signal}));return clearTimeout(s),o}_push(e,t,r=this.timeout){if(!this.joinedOnce)throw`tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;let n=new st(this,e,t,r);return this._canPush()?n.send():this._addToPushBuffer(n),n}_addToPushBuffer(e){if(e.startTimeout(),this.pushBuffer.push(e),this.pushBuffer.length>mi){const t=this.pushBuffer.shift();t&&(t.destroy(),this.socket.log("channel",`discarded push due to buffer overflow: ${t.event}`,t.payload))}}_onMessage(e,t,r){return t}_isMember(e){return this.topic===e}_joinRef(){return this.joinPush.ref}_trigger(e,t,r){var n,s;const o=e.toLocaleLowerCase(),{close:a,error:l,leave:d,join:c}=U;if(r&&[a,l,d,c].indexOf(o)>=0&&r!==this._joinRef())return;let h=this._onMessage(o,t,r);if(t&&!h)throw"channel onMessage callbacks must return the payload, modified or unmodified";["insert","update","delete"].includes(o)?(n=this.bindings.postgres_changes)===null||n===void 0||n.filter(p=>{var g,m,f;return((g=p.filter)===null||g===void 0?void 0:g.event)==="*"||((f=(m=p.filter)===null||m===void 0?void 0:m.event)===null||f===void 0?void 0:f.toLocaleLowerCase())===o}).map(p=>p.callback(h,r)):(s=this.bindings[o])===null||s===void 0||s.filter(p=>{var g,m,f,_,b,v;if(["broadcast","presence","postgres_changes"].includes(o))if("id"in p){const k=p.id,C=(g=p.filter)===null||g===void 0?void 0:g.event;return k&&((m=t.ids)===null||m===void 0?void 0:m.includes(k))&&(C==="*"||C?.toLocaleLowerCase()===((f=t.data)===null||f===void 0?void 0:f.type.toLocaleLowerCase()))}else{const k=(b=(_=p?.filter)===null||_===void 0?void 0:_.event)===null||b===void 0?void 0:b.toLocaleLowerCase();return k==="*"||k===((v=t?.event)===null||v===void 0?void 0:v.toLocaleLowerCase())}else return p.type.toLocaleLowerCase()===o}).map(p=>{if(typeof h=="object"&&"ids"in h){const g=h.data,{schema:m,table:f,commit_timestamp:_,type:b,errors:v}=g;h=Object.assign(Object.assign({},{schema:m,table:f,commit_timestamp:_,eventType:b,new:{},old:{},errors:v}),this._getPayloadRecords(g))}p.callback(h,r)})}_isClosed(){return this.state===P.closed}_isJoined(){return this.state===P.joined}_isJoining(){return this.state===P.joining}_isLeaving(){return this.state===P.leaving}_replyEventName(e){return`chan_reply_${e}`}_on(e,t,r){const n=e.toLocaleLowerCase(),s={type:n,filter:t,callback:r};return this.bindings[n]?this.bindings[n].push(s):this.bindings[n]=[s],this}_off(e,t){const r=e.toLocaleLowerCase();return this.bindings[r]&&(this.bindings[r]=this.bindings[r].filter(n=>{var s;return!(((s=n.type)===null||s===void 0?void 0:s.toLocaleLowerCase())===r&&$t.isEqual(n.filter,t))})),this}static isEqual(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const r in e)if(e[r]!==t[r])return!1;return!0}_rejoinUntilConnected(){this.rejoinTimer.scheduleTimeout(),this.socket.isConnected()&&this._rejoin()}_onClose(e){this._on(U.close,{},e)}_onError(e){this._on(U.error,{},t=>e(t))}_canPush(){return this.socket.isConnected()&&this._isJoined()}_rejoin(e=this.timeout){this._isLeaving()||(this.socket._leaveOpenTopic(this.topic),this.state=P.joining,this.joinPush.resend(e))}_getPayloadRecords(e){const t={new:{},old:{}};return(e.type==="INSERT"||e.type==="UPDATE")&&(t.new=qt(e.columns,e.record)),(e.type==="UPDATE"||e.type==="DELETE")&&(t.old=qt(e.columns,e.old_record)),t}}const ot=()=>{},Ve={HEARTBEAT_INTERVAL:25e3,RECONNECT_DELAY:10,HEARTBEAT_TIMEOUT_FALLBACK:100},Ei=[1e3,2e3,5e3,1e4],Si=1e4,Ti=`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;class Ai{constructor(e,t){var r;if(this.accessTokenValue=null,this.apiKey=null,this.channels=new Array,this.endPoint="",this.httpEndpoint="",this.headers={},this.params={},this.timeout=ft,this.transport=null,this.heartbeatIntervalMs=Ve.HEARTBEAT_INTERVAL,this.heartbeatTimer=void 0,this.pendingHeartbeatRef=null,this.heartbeatCallback=ot,this.ref=0,this.reconnectTimer=null,this.logger=ot,this.conn=null,this.sendBuffer=[],this.serializer=new yi,this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.accessToken=null,this._connectionState="disconnected",this._wasManualDisconnect=!1,this._authPromise=null,this._resolveFetch=n=>{let s;return n?s=n:typeof fetch>"u"?s=(...o)=>Fe(async()=>{const{default:a}=await Promise.resolve().then(()=>je);return{default:a}},void 0).then(({default:a})=>a(...o)).catch(a=>{throw new Error(`Failed to load @supabase/node-fetch: ${a.message}. This is required for HTTP requests in Node.js environments without native fetch.`)}):s=fetch,(...o)=>s(...o)},!(!((r=t?.params)===null||r===void 0)&&r.apikey))throw new Error("API key is required to connect to Realtime");this.apiKey=t.params.apikey,this.endPoint=`${e}/${mt.websocket}`,this.httpEndpoint=br(e),this._initializeOptions(t),this._setupReconnectionTimer(),this.fetch=this._resolveFetch(t?.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||this.conn!==null&&this.isConnected())){if(this._setConnectionState("connecting"),this._setAuthSafely("connect"),this.transport)this.conn=new this.transport(this.endpointURL());else try{this.conn=ui.createWebSocket(this.endpointURL())}catch(e){this._setConnectionState("disconnected");const t=e.message;throw t.includes("Node.js")?new Error(`${t}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`):new Error(`WebSocket not available: ${t}`)}this._setupConnectionHandlers()}}endpointURL(){return this._appendParams(this.endPoint,Object.assign({},this.params,{vsn:gi}))}disconnect(e,t){if(!this.isDisconnecting())if(this._setConnectionState("disconnecting",!0),this.conn){const r=setTimeout(()=>{this._setConnectionState("disconnected")},100);this.conn.onclose=()=>{clearTimeout(r),this._setConnectionState("disconnected")},e?this.conn.close(e,t??""):this.conn.close(),this._teardownConnection()}else this._setConnectionState("disconnected")}getChannels(){return this.channels}async removeChannel(e){const t=await e.unsubscribe();return this.channels.length===0&&this.disconnect(),t}async removeAllChannels(){const e=await Promise.all(this.channels.map(t=>t.unsubscribe()));return this.channels=[],this.disconnect(),e}log(e,t,r){this.logger(e,t,r)}connectionState(){switch(this.conn&&this.conn.readyState){case ze.connecting:return de.Connecting;case ze.open:return de.Open;case ze.closing:return de.Closing;default:return de.Closed}}isConnected(){return this.connectionState()===de.Open}isConnecting(){return this._connectionState==="connecting"}isDisconnecting(){return this._connectionState==="disconnecting"}channel(e,t={config:{}}){const r=`realtime:${e}`,n=this.getChannels().find(s=>s.topic===r);if(n)return n;{const s=new $t(`realtime:${e}`,t,this);return this.channels.push(s),s}}push(e){const{topic:t,event:r,payload:n,ref:s}=e,o=()=>{this.encode(e,a=>{var l;(l=this.conn)===null||l===void 0||l.send(a)})};this.log("push",`${t} ${r} (${s})`,n),this.isConnected()?o():this.sendBuffer.push(o)}async setAuth(e=null){this._authPromise=this._performAuth(e);try{await this._authPromise}finally{this._authPromise=null}}async sendHeartbeat(){var e;if(!this.isConnected()){try{this.heartbeatCallback("disconnected")}catch(t){this.log("error","error in heartbeat callback",t)}return}if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.log("transport","heartbeat timeout. Attempting to re-establish connection");try{this.heartbeatCallback("timeout")}catch(t){this.log("error","error in heartbeat callback",t)}this._wasManualDisconnect=!1,(e=this.conn)===null||e===void 0||e.close(fi,"heartbeat timeout"),setTimeout(()=>{var t;this.isConnected()||(t=this.reconnectTimer)===null||t===void 0||t.scheduleTimeout()},Ve.HEARTBEAT_TIMEOUT_FALLBACK);return}this.pendingHeartbeatRef=this._makeRef(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback("sent")}catch(t){this.log("error","error in heartbeat callback",t)}this._setAuthSafely("heartbeat")}onHeartbeat(e){this.heartbeatCallback=e}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}_makeRef(){let e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}_leaveOpenTopic(e){let t=this.channels.find(r=>r.topic===e&&(r._isJoined()||r._isJoining()));t&&(this.log("transport",`leaving duplicate topic "${e}"`),t.unsubscribe())}_remove(e){this.channels=this.channels.filter(t=>t.topic!==e.topic)}_onConnMessage(e){this.decode(e.data,t=>{if(t.topic==="phoenix"&&t.event==="phx_reply")try{this.heartbeatCallback(t.payload.status==="ok"?"ok":"error")}catch(d){this.log("error","error in heartbeat callback",d)}t.ref&&t.ref===this.pendingHeartbeatRef&&(this.pendingHeartbeatRef=null);const{topic:r,event:n,payload:s,ref:o}=t,a=o?`(${o})`:"",l=s.status||"";this.log("receive",`${l} ${r} ${n} ${a}`.trim(),s),this.channels.filter(d=>d._isMember(r)).forEach(d=>d._trigger(n,s,o)),this._triggerStateCallbacks("message",t)})}_clearTimer(e){var t;e==="heartbeat"&&this.heartbeatTimer?(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0):e==="reconnect"&&((t=this.reconnectTimer)===null||t===void 0||t.reset())}_clearAllTimers(){this._clearTimer("heartbeat"),this._clearTimer("reconnect")}_setupConnectionHandlers(){this.conn&&("binaryType"in this.conn&&(this.conn.binaryType="arraybuffer"),this.conn.onopen=()=>this._onConnOpen(),this.conn.onerror=e=>this._onConnError(e),this.conn.onmessage=e=>this._onConnMessage(e),this.conn.onclose=e=>this._onConnClose(e))}_teardownConnection(){this.conn&&(this.conn.onopen=null,this.conn.onerror=null,this.conn.onmessage=null,this.conn.onclose=null,this.conn=null),this._clearAllTimers(),this.channels.forEach(e=>e.teardown())}_onConnOpen(){this._setConnectionState("connected"),this.log("transport",`connected to ${this.endpointURL()}`),this.flushSendBuffer(),this._clearTimer("reconnect"),this.worker?this.workerRef||this._startWorkerHeartbeat():this._startHeartbeat(),this._triggerStateCallbacks("open")}_startHeartbeat(){this.heartbeatTimer&&clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(()=>this.sendHeartbeat(),this.heartbeatIntervalMs)}_startWorkerHeartbeat(){this.workerUrl?this.log("worker",`starting worker for from ${this.workerUrl}`):this.log("worker","starting default worker");const e=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(e),this.workerRef.onerror=t=>{this.log("worker","worker error",t.message),this.workerRef.terminate()},this.workerRef.onmessage=t=>{t.data.event==="keepAlive"&&this.sendHeartbeat()},this.workerRef.postMessage({event:"start",interval:this.heartbeatIntervalMs})}_onConnClose(e){var t;this._setConnectionState("disconnected"),this.log("transport","close",e),this._triggerChanError(),this._clearTimer("heartbeat"),this._wasManualDisconnect||(t=this.reconnectTimer)===null||t===void 0||t.scheduleTimeout(),this._triggerStateCallbacks("close",e)}_onConnError(e){this._setConnectionState("disconnected"),this.log("transport",`${e}`),this._triggerChanError(),this._triggerStateCallbacks("error",e)}_triggerChanError(){this.channels.forEach(e=>e._trigger(U.error))}_appendParams(e,t){if(Object.keys(t).length===0)return e;const r=e.match(/\?/)?"&":"?",n=new URLSearchParams(t);return`${e}${r}${n}`}_workerObjectUrl(e){let t;if(e)t=e;else{const r=new Blob([Ti],{type:"application/javascript"});t=URL.createObjectURL(r)}return t}_setConnectionState(e,t=!1){this._connectionState=e,e==="connecting"?this._wasManualDisconnect=!1:e==="disconnecting"&&(this._wasManualDisconnect=t)}async _performAuth(e=null){let t;e?t=e:this.accessToken?t=await this.accessToken():t=this.accessTokenValue,this.accessTokenValue!=t&&(this.accessTokenValue=t,this.channels.forEach(r=>{const n={access_token:t,version:pi};t&&r.updateJoinPayload(n),r.joinedOnce&&r._isJoined()&&r._push(U.access_token,{access_token:t})}))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(e="general"){this.setAuth().catch(t=>{this.log("error",`error setting auth in ${e}`,t)})}_triggerStateCallbacks(e,t){try{this.stateChangeCallbacks[e].forEach(r=>{try{r(t)}catch(n){this.log("error",`error in ${e} callback`,n)}})}catch(r){this.log("error",`error triggering ${e} callbacks`,r)}}_setupReconnectionTimer(){this.reconnectTimer=new yr(async()=>{setTimeout(async()=>{await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()},Ve.RECONNECT_DELAY)},this.reconnectAfterMs)}_initializeOptions(e){var t,r,n,s,o,a,l,d,c;if(this.transport=(t=e?.transport)!==null&&t!==void 0?t:null,this.timeout=(r=e?.timeout)!==null&&r!==void 0?r:ft,this.heartbeatIntervalMs=(n=e?.heartbeatIntervalMs)!==null&&n!==void 0?n:Ve.HEARTBEAT_INTERVAL,this.worker=(s=e?.worker)!==null&&s!==void 0?s:!1,this.accessToken=(o=e?.accessToken)!==null&&o!==void 0?o:null,this.heartbeatCallback=(a=e?.heartbeatCallback)!==null&&a!==void 0?a:ot,e?.params&&(this.params=e.params),e?.logger&&(this.logger=e.logger),(e?.logLevel||e?.log_level)&&(this.logLevel=e.logLevel||e.log_level,this.params=Object.assign(Object.assign({},this.params),{log_level:this.logLevel})),this.reconnectAfterMs=(l=e?.reconnectAfterMs)!==null&&l!==void 0?l:(u=>Ei[u-1]||Si),this.encode=(d=e?.encode)!==null&&d!==void 0?d:((u,h)=>h(JSON.stringify(u))),this.decode=(c=e?.decode)!==null&&c!==void 0?c:this.serializer.decode.bind(this.serializer),this.worker){if(typeof window<"u"&&!window.Worker)throw new Error("Web Worker is not supported");this.workerUrl=e?.workerUrl}}}class It extends Error{constructor(e){super(e),this.__isStorageError=!0,this.name="StorageError"}}function I(i){return typeof i=="object"&&i!==null&&"__isStorageError"in i}class Ci extends It{constructor(e,t,r){super(e),this.name="StorageApiError",this.status=t,this.statusCode=r}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}}class vt extends It{constructor(e,t){super(e),this.name="StorageUnknownError",this.originalError=t}}var $i=function(i,e,t,r){function n(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(c){try{d(r.next(c))}catch(u){o(u)}}function l(c){try{d(r.throw(c))}catch(u){o(u)}}function d(c){c.done?s(c.value):n(c.value).then(a,l)}d((r=r.apply(i,e||[])).next())})};const wr=i=>{let e;return i?e=i:typeof fetch>"u"?e=(...t)=>Fe(async()=>{const{default:r}=await Promise.resolve().then(()=>je);return{default:r}},void 0).then(({default:r})=>r(...t)):e=fetch,(...t)=>e(...t)},Ii=()=>$i(void 0,void 0,void 0,function*(){return typeof Response>"u"?(yield Fe(()=>Promise.resolve().then(()=>je),void 0)).Response:Response}),bt=i=>{if(Array.isArray(i))return i.map(t=>bt(t));if(typeof i=="function"||i!==Object(i))return i;const e={};return Object.entries(i).forEach(([t,r])=>{const n=t.replace(/([-_][a-z])/gi,s=>s.toUpperCase().replace(/[-_]/g,""));e[n]=bt(r)}),e},Oi=i=>{if(typeof i!="object"||i===null)return!1;const e=Object.getPrototypeOf(i);return(e===null||e===Object.prototype||Object.getPrototypeOf(e)===null)&&!(Symbol.toStringTag in i)&&!(Symbol.iterator in i)};var ge=function(i,e,t,r){function n(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(c){try{d(r.next(c))}catch(u){o(u)}}function l(c){try{d(r.throw(c))}catch(u){o(u)}}function d(c){c.done?s(c.value):n(c.value).then(a,l)}d((r=r.apply(i,e||[])).next())})};const at=i=>i.msg||i.message||i.error_description||i.error||JSON.stringify(i),Pi=(i,e,t)=>ge(void 0,void 0,void 0,function*(){const r=yield Ii();i instanceof r&&!t?.noResolveJson?i.json().then(n=>{const s=i.status||500,o=n?.statusCode||s+"";e(new Ci(at(n),s,o))}).catch(n=>{e(new vt(at(n),n))}):e(new vt(at(i),i))}),Ri=(i,e,t,r)=>{const n={method:i,headers:e?.headers||{}};return i==="GET"||!r?n:(Oi(r)?(n.headers=Object.assign({"Content-Type":"application/json"},e?.headers),n.body=JSON.stringify(r)):n.body=r,e?.duplex&&(n.duplex=e.duplex),Object.assign(Object.assign({},n),t))};function He(i,e,t,r,n,s){return ge(this,void 0,void 0,function*(){return new Promise((o,a)=>{i(t,Ri(e,r,n,s)).then(l=>{if(!l.ok)throw l;return r?.noResolveJson?l:l.json()}).then(l=>o(l)).catch(l=>Pi(l,a,r))})})}function Qe(i,e,t,r){return ge(this,void 0,void 0,function*(){return He(i,"GET",e,t,r)})}function V(i,e,t,r,n){return ge(this,void 0,void 0,function*(){return He(i,"POST",e,r,n,t)})}function wt(i,e,t,r,n){return ge(this,void 0,void 0,function*(){return He(i,"PUT",e,r,n,t)})}function ji(i,e,t,r){return ge(this,void 0,void 0,function*(){return He(i,"HEAD",e,Object.assign(Object.assign({},t),{noResolveJson:!0}),r)})}function xr(i,e,t,r,n){return ge(this,void 0,void 0,function*(){return He(i,"DELETE",e,r,n,t)})}var Li=function(i,e,t,r){function n(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(c){try{d(r.next(c))}catch(u){o(u)}}function l(c){try{d(r.throw(c))}catch(u){o(u)}}function d(c){c.done?s(c.value):n(c.value).then(a,l)}d((r=r.apply(i,e||[])).next())})};class Bi{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t}then(e,t){return this.execute().then(e,t)}execute(){return Li(this,void 0,void 0,function*(){try{return{data:(yield this.downloadFn()).body,error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(I(e))return{data:null,error:e};throw e}})}}var zi=function(i,e,t,r){function n(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(c){try{d(r.next(c))}catch(u){o(u)}}function l(c){try{d(r.throw(c))}catch(u){o(u)}}function d(c){c.done?s(c.value):n(c.value).then(a,l)}d((r=r.apply(i,e||[])).next())})};class Mi{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t}asStream(){return new Bi(this.downloadFn,this.shouldThrowOnError)}then(e,t){return this.execute().then(e,t)}execute(){return zi(this,void 0,void 0,function*(){try{return{data:yield(yield this.downloadFn()).blob(),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(I(e))return{data:null,error:e};throw e}})}}var B=function(i,e,t,r){function n(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(c){try{d(r.next(c))}catch(u){o(u)}}function l(c){try{d(r.throw(c))}catch(u){o(u)}}function d(c){c.done?s(c.value):n(c.value).then(a,l)}d((r=r.apply(i,e||[])).next())})};const Ni={limit:100,offset:0,sortBy:{column:"name",order:"asc"}},Wt={cacheControl:"3600",contentType:"text/plain;charset=UTF-8",upsert:!1};class Di{constructor(e,t={},r,n){this.shouldThrowOnError=!1,this.url=e,this.headers=t,this.bucketId=r,this.fetch=wr(n)}throwOnError(){return this.shouldThrowOnError=!0,this}uploadOrUpdate(e,t,r,n){return B(this,void 0,void 0,function*(){try{let s;const o=Object.assign(Object.assign({},Wt),n);let a=Object.assign(Object.assign({},this.headers),e==="POST"&&{"x-upsert":String(o.upsert)});const l=o.metadata;typeof Blob<"u"&&r instanceof Blob?(s=new FormData,s.append("cacheControl",o.cacheControl),l&&s.append("metadata",this.encodeMetadata(l)),s.append("",r)):typeof FormData<"u"&&r instanceof FormData?(s=r,s.append("cacheControl",o.cacheControl),l&&s.append("metadata",this.encodeMetadata(l))):(s=r,a["cache-control"]=`max-age=${o.cacheControl}`,a["content-type"]=o.contentType,l&&(a["x-metadata"]=this.toBase64(this.encodeMetadata(l)))),n?.headers&&(a=Object.assign(Object.assign({},a),n.headers));const d=this._removeEmptyFolders(t),c=this._getFinalPath(d),u=yield(e=="PUT"?wt:V)(this.fetch,`${this.url}/object/${c}`,s,Object.assign({headers:a},o?.duplex?{duplex:o.duplex}:{}));return{data:{path:d,id:u.Id,fullPath:u.Key},error:null}}catch(s){if(this.shouldThrowOnError)throw s;if(I(s))return{data:null,error:s};throw s}})}upload(e,t,r){return B(this,void 0,void 0,function*(){return this.uploadOrUpdate("POST",e,t,r)})}uploadToSignedUrl(e,t,r,n){return B(this,void 0,void 0,function*(){const s=this._removeEmptyFolders(e),o=this._getFinalPath(s),a=new URL(this.url+`/object/upload/sign/${o}`);a.searchParams.set("token",t);try{let l;const d=Object.assign({upsert:Wt.upsert},n),c=Object.assign(Object.assign({},this.headers),{"x-upsert":String(d.upsert)});typeof Blob<"u"&&r instanceof Blob?(l=new FormData,l.append("cacheControl",d.cacheControl),l.append("",r)):typeof FormData<"u"&&r instanceof FormData?(l=r,l.append("cacheControl",d.cacheControl)):(l=r,c["cache-control"]=`max-age=${d.cacheControl}`,c["content-type"]=d.contentType);const u=yield wt(this.fetch,a.toString(),l,{headers:c});return{data:{path:s,fullPath:u.Key},error:null}}catch(l){if(this.shouldThrowOnError)throw l;if(I(l))return{data:null,error:l};throw l}})}createSignedUploadUrl(e,t){return B(this,void 0,void 0,function*(){try{let r=this._getFinalPath(e);const n=Object.assign({},this.headers);t?.upsert&&(n["x-upsert"]="true");const s=yield V(this.fetch,`${this.url}/object/upload/sign/${r}`,{},{headers:n}),o=new URL(this.url+s.url),a=o.searchParams.get("token");if(!a)throw new It("No token returned by API");return{data:{signedUrl:o.toString(),path:e,token:a},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(I(r))return{data:null,error:r};throw r}})}update(e,t,r){return B(this,void 0,void 0,function*(){return this.uploadOrUpdate("PUT",e,t,r)})}move(e,t,r){return B(this,void 0,void 0,function*(){try{return{data:yield V(this.fetch,`${this.url}/object/move`,{bucketId:this.bucketId,sourceKey:e,destinationKey:t,destinationBucket:r?.destinationBucket},{headers:this.headers}),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(I(n))return{data:null,error:n};throw n}})}copy(e,t,r){return B(this,void 0,void 0,function*(){try{return{data:{path:(yield V(this.fetch,`${this.url}/object/copy`,{bucketId:this.bucketId,sourceKey:e,destinationKey:t,destinationBucket:r?.destinationBucket},{headers:this.headers})).Key},error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(I(n))return{data:null,error:n};throw n}})}createSignedUrl(e,t,r){return B(this,void 0,void 0,function*(){try{let n=this._getFinalPath(e),s=yield V(this.fetch,`${this.url}/object/sign/${n}`,Object.assign({expiresIn:t},r?.transform?{transform:r.transform}:{}),{headers:this.headers});const o=r?.download?`&download=${r.download===!0?"":r.download}`:"";return s={signedUrl:encodeURI(`${this.url}${s.signedURL}${o}`)},{data:s,error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(I(n))return{data:null,error:n};throw n}})}createSignedUrls(e,t,r){return B(this,void 0,void 0,function*(){try{const n=yield V(this.fetch,`${this.url}/object/sign/${this.bucketId}`,{expiresIn:t,paths:e},{headers:this.headers}),s=r?.download?`&download=${r.download===!0?"":r.download}`:"";return{data:n.map(o=>Object.assign(Object.assign({},o),{signedUrl:o.signedURL?encodeURI(`${this.url}${o.signedURL}${s}`):null})),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(I(n))return{data:null,error:n};throw n}})}download(e,t){const n=typeof t?.transform<"u"?"render/image/authenticated":"object",s=this.transformOptsToQueryString(t?.transform||{}),o=s?`?${s}`:"",a=this._getFinalPath(e),l=()=>Qe(this.fetch,`${this.url}/${n}/${a}${o}`,{headers:this.headers,noResolveJson:!0});return new Mi(l,this.shouldThrowOnError)}info(e){return B(this,void 0,void 0,function*(){const t=this._getFinalPath(e);try{const r=yield Qe(this.fetch,`${this.url}/object/info/${t}`,{headers:this.headers});return{data:bt(r),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(I(r))return{data:null,error:r};throw r}})}exists(e){return B(this,void 0,void 0,function*(){const t=this._getFinalPath(e);try{return yield ji(this.fetch,`${this.url}/object/${t}`,{headers:this.headers}),{data:!0,error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(I(r)&&r instanceof vt){const n=r.originalError;if([400,404].includes(n?.status))return{data:!1,error:r}}throw r}})}getPublicUrl(e,t){const r=this._getFinalPath(e),n=[],s=t?.download?`download=${t.download===!0?"":t.download}`:"";s!==""&&n.push(s);const a=typeof t?.transform<"u"?"render/image":"object",l=this.transformOptsToQueryString(t?.transform||{});l!==""&&n.push(l);let d=n.join("&");return d!==""&&(d=`?${d}`),{data:{publicUrl:encodeURI(`${this.url}/${a}/public/${r}${d}`)}}}remove(e){return B(this,void 0,void 0,function*(){try{return{data:yield xr(this.fetch,`${this.url}/object/${this.bucketId}`,{prefixes:e},{headers:this.headers}),error:null}}catch(t){if(this.shouldThrowOnError)throw t;if(I(t))return{data:null,error:t};throw t}})}list(e,t,r){return B(this,void 0,void 0,function*(){try{const n=Object.assign(Object.assign(Object.assign({},Ni),t),{prefix:e||""});return{data:yield V(this.fetch,`${this.url}/object/list/${this.bucketId}`,n,{headers:this.headers},r),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(I(n))return{data:null,error:n};throw n}})}listV2(e,t){return B(this,void 0,void 0,function*(){try{const r=Object.assign({},e);return{data:yield V(this.fetch,`${this.url}/object/list-v2/${this.bucketId}`,r,{headers:this.headers},t),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(I(r))return{data:null,error:r};throw r}})}encodeMetadata(e){return JSON.stringify(e)}toBase64(e){return typeof Buffer<"u"?Buffer.from(e).toString("base64"):btoa(e)}_getFinalPath(e){return`${this.bucketId}/${e.replace(/^\/+/,"")}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,"").replace(/\/+/g,"/")}transformOptsToQueryString(e){const t=[];return e.width&&t.push(`width=${e.width}`),e.height&&t.push(`height=${e.height}`),e.resize&&t.push(`resize=${e.resize}`),e.format&&t.push(`format=${e.format}`),e.quality&&t.push(`quality=${e.quality}`),t.join("&")}}const Ui="2.75.0",qi={"X-Client-Info":`storage-js/${Ui}`};var we=function(i,e,t,r){function n(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(c){try{d(r.next(c))}catch(u){o(u)}}function l(c){try{d(r.throw(c))}catch(u){o(u)}}function d(c){c.done?s(c.value):n(c.value).then(a,l)}d((r=r.apply(i,e||[])).next())})};class Fi{constructor(e,t={},r,n){this.shouldThrowOnError=!1;const s=new URL(e);n?.useNewHostname&&/supabase\.(co|in|red)$/.test(s.hostname)&&!s.hostname.includes("storage.supabase.")&&(s.hostname=s.hostname.replace("supabase.","storage.supabase.")),this.url=s.href.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},qi),t),this.fetch=wr(r)}throwOnError(){return this.shouldThrowOnError=!0,this}listBuckets(){return we(this,void 0,void 0,function*(){try{return{data:yield Qe(this.fetch,`${this.url}/bucket`,{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(I(e))return{data:null,error:e};throw e}})}getBucket(e){return we(this,void 0,void 0,function*(){try{return{data:yield Qe(this.fetch,`${this.url}/bucket/${e}`,{headers:this.headers}),error:null}}catch(t){if(this.shouldThrowOnError)throw t;if(I(t))return{data:null,error:t};throw t}})}createBucket(e){return we(this,arguments,void 0,function*(t,r={public:!1}){try{return{data:yield V(this.fetch,`${this.url}/bucket`,{id:t,name:t,type:r.type,public:r.public,file_size_limit:r.fileSizeLimit,allowed_mime_types:r.allowedMimeTypes},{headers:this.headers}),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(I(n))return{data:null,error:n};throw n}})}updateBucket(e,t){return we(this,void 0,void 0,function*(){try{return{data:yield wt(this.fetch,`${this.url}/bucket/${e}`,{id:e,name:e,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(I(r))return{data:null,error:r};throw r}})}emptyBucket(e){return we(this,void 0,void 0,function*(){try{return{data:yield V(this.fetch,`${this.url}/bucket/${e}/empty`,{},{headers:this.headers}),error:null}}catch(t){if(this.shouldThrowOnError)throw t;if(I(t))return{data:null,error:t};throw t}})}deleteBucket(e){return we(this,void 0,void 0,function*(){try{return{data:yield xr(this.fetch,`${this.url}/bucket/${e}`,{},{headers:this.headers}),error:null}}catch(t){if(this.shouldThrowOnError)throw t;if(I(t))return{data:null,error:t};throw t}})}}class Hi extends Fi{constructor(e,t={},r,n){super(e,t,r,n)}from(e){return new Di(this.url,this.headers,e,this.fetch)}}const Wi="2.75.0";let Be="";typeof Deno<"u"?Be="deno":typeof document<"u"?Be="web":typeof navigator<"u"&&navigator.product==="ReactNative"?Be="react-native":Be="node";const Gi={"X-Client-Info":`supabase-js-${Be}/${Wi}`},Ki={headers:Gi},Vi={schema:"public"},Ji={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:"implicit"},Yi={};var Qi=function(i,e,t,r){function n(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(c){try{d(r.next(c))}catch(u){o(u)}}function l(c){try{d(r.throw(c))}catch(u){o(u)}}function d(c){c.done?s(c.value):n(c.value).then(a,l)}d((r=r.apply(i,e||[])).next())})};const Zi=i=>{let e;return i?e=i:typeof fetch>"u"?e=ur:e=fetch,(...t)=>e(...t)},Xi=()=>typeof Headers>"u"?hr:Headers,en=(i,e,t)=>{const r=Zi(t),n=Xi();return(s,o)=>Qi(void 0,void 0,void 0,function*(){var a;const l=(a=yield e())!==null&&a!==void 0?a:i;let d=new n(o?.headers);return d.has("apikey")||d.set("apikey",i),d.has("Authorization")||d.set("Authorization",`Bearer ${l}`),r(s,Object.assign(Object.assign({},o),{headers:d}))})};var tn=function(i,e,t,r){function n(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(c){try{d(r.next(c))}catch(u){o(u)}}function l(c){try{d(r.throw(c))}catch(u){o(u)}}function d(c){c.done?s(c.value):n(c.value).then(a,l)}d((r=r.apply(i,e||[])).next())})};function rn(i){return i.endsWith("/")?i:i+"/"}function nn(i,e){var t,r;const{db:n,auth:s,realtime:o,global:a}=i,{db:l,auth:d,realtime:c,global:u}=e,h={db:Object.assign(Object.assign({},l),n),auth:Object.assign(Object.assign({},d),s),realtime:Object.assign(Object.assign({},c),o),storage:{},global:Object.assign(Object.assign(Object.assign({},u),a),{headers:Object.assign(Object.assign({},(t=u?.headers)!==null&&t!==void 0?t:{}),(r=a?.headers)!==null&&r!==void 0?r:{})}),accessToken:()=>tn(this,void 0,void 0,function*(){return""})};return i.accessToken?h.accessToken=i.accessToken:delete h.accessToken,h}function sn(i){const e=i?.trim();if(!e)throw new Error("supabaseUrl is required.");if(!e.match(/^https?:\/\//i))throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");try{return new URL(rn(e))}catch{throw Error("Invalid supabaseUrl: Provided URL is malformed.")}}const _r="2.75.0",Te=30*1e3,xt=3,lt=xt*Te,on="http://localhost:9999",an="supabase.auth.token",ln={"X-Client-Info":`gotrue-js/${_r}`},_t="X-Supabase-Api-Version",kr={"2024-01-01":{timestamp:Date.parse("2024-01-01T00:00:00.0Z"),name:"2024-01-01"}},dn=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,cn=600*1e3;class Ue extends Error{constructor(e,t,r){super(e),this.__isAuthError=!0,this.name="AuthError",this.status=t,this.code=r}}function w(i){return typeof i=="object"&&i!==null&&"__isAuthError"in i}class un extends Ue{constructor(e,t,r){super(e,t,r),this.name="AuthApiError",this.status=t,this.code=r}}function hn(i){return w(i)&&i.name==="AuthApiError"}class ce extends Ue{constructor(e,t){super(e),this.name="AuthUnknownError",this.originalError=t}}class se extends Ue{constructor(e,t,r,n){super(e,r,n),this.name=t,this.status=r}}class re extends se{constructor(){super("Auth session missing!","AuthSessionMissingError",400,void 0)}}function pn(i){return w(i)&&i.name==="AuthSessionMissingError"}class xe extends se{constructor(){super("Auth session or user missing","AuthInvalidTokenResponseError",500,void 0)}}class Je extends se{constructor(e){super(e,"AuthInvalidCredentialsError",400,void 0)}}class Ye extends se{constructor(e,t=null){super(e,"AuthImplicitGrantRedirectError",500,void 0),this.details=null,this.details=t}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}function gn(i){return w(i)&&i.name==="AuthImplicitGrantRedirectError"}class Gt extends se{constructor(e,t=null){super(e,"AuthPKCEGrantCodeExchangeError",500,void 0),this.details=null,this.details=t}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}class kt extends se{constructor(e,t){super(e,"AuthRetryableFetchError",t,void 0)}}function dt(i){return w(i)&&i.name==="AuthRetryableFetchError"}class Kt extends se{constructor(e,t,r){super(e,"AuthWeakPasswordError",t,"weak_password"),this.reasons=r}}class Et extends se{constructor(e){super(e,"AuthInvalidJwtError",400,"invalid_jwt")}}const Ze="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""),Vt=` 	
\r=`.split(""),fn=(()=>{const i=new Array(128);for(let e=0;e<i.length;e+=1)i[e]=-1;for(let e=0;e<Vt.length;e+=1)i[Vt[e].charCodeAt(0)]=-2;for(let e=0;e<Ze.length;e+=1)i[Ze[e].charCodeAt(0)]=e;return i})();function Jt(i,e,t){if(i!==null)for(e.queue=e.queue<<8|i,e.queuedBits+=8;e.queuedBits>=6;){const r=e.queue>>e.queuedBits-6&63;t(Ze[r]),e.queuedBits-=6}else if(e.queuedBits>0)for(e.queue=e.queue<<6-e.queuedBits,e.queuedBits=6;e.queuedBits>=6;){const r=e.queue>>e.queuedBits-6&63;t(Ze[r]),e.queuedBits-=6}}function Er(i,e,t){const r=fn[i];if(r>-1)for(e.queue=e.queue<<6|r,e.queuedBits+=6;e.queuedBits>=8;)t(e.queue>>e.queuedBits-8&255),e.queuedBits-=8;else{if(r===-2)return;throw new Error(`Invalid Base64-URL character "${String.fromCharCode(i)}"`)}}function Yt(i){const e=[],t=o=>{e.push(String.fromCodePoint(o))},r={utf8seq:0,codepoint:0},n={queue:0,queuedBits:0},s=o=>{vn(o,r,t)};for(let o=0;o<i.length;o+=1)Er(i.charCodeAt(o),n,s);return e.join("")}function mn(i,e){if(i<=127){e(i);return}else if(i<=2047){e(192|i>>6),e(128|i&63);return}else if(i<=65535){e(224|i>>12),e(128|i>>6&63),e(128|i&63);return}else if(i<=1114111){e(240|i>>18),e(128|i>>12&63),e(128|i>>6&63),e(128|i&63);return}throw new Error(`Unrecognized Unicode codepoint: ${i.toString(16)}`)}function yn(i,e){for(let t=0;t<i.length;t+=1){let r=i.charCodeAt(t);if(r>55295&&r<=56319){const n=(r-55296)*1024&65535;r=(i.charCodeAt(t+1)-56320&65535|n)+65536,t+=1}mn(r,e)}}function vn(i,e,t){if(e.utf8seq===0){if(i<=127){t(i);return}for(let r=1;r<6;r+=1)if((i>>7-r&1)===0){e.utf8seq=r;break}if(e.utf8seq===2)e.codepoint=i&31;else if(e.utf8seq===3)e.codepoint=i&15;else if(e.utf8seq===4)e.codepoint=i&7;else throw new Error("Invalid UTF-8 sequence");e.utf8seq-=1}else if(e.utf8seq>0){if(i<=127)throw new Error("Invalid UTF-8 sequence");e.codepoint=e.codepoint<<6|i&63,e.utf8seq-=1,e.utf8seq===0&&t(e.codepoint)}}function $e(i){const e=[],t={queue:0,queuedBits:0},r=n=>{e.push(n)};for(let n=0;n<i.length;n+=1)Er(i.charCodeAt(n),t,r);return new Uint8Array(e)}function bn(i){const e=[];return yn(i,t=>e.push(t)),new Uint8Array(e)}function he(i){const e=[],t={queue:0,queuedBits:0},r=n=>{e.push(n)};return i.forEach(n=>Jt(n,t,r)),Jt(null,t,r),e.join("")}function wn(i){return Math.round(Date.now()/1e3)+i}function xn(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(i){const e=Math.random()*16|0;return(i=="x"?e:e&3|8).toString(16)})}const M=()=>typeof window<"u"&&typeof document<"u",oe={tested:!1,writable:!1},Sr=()=>{if(!M())return!1;try{if(typeof globalThis.localStorage!="object")return!1}catch{return!1}if(oe.tested)return oe.writable;const i=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(i,i),globalThis.localStorage.removeItem(i),oe.tested=!0,oe.writable=!0}catch{oe.tested=!0,oe.writable=!1}return oe.writable};function _n(i){const e={},t=new URL(i);if(t.hash&&t.hash[0]==="#")try{new URLSearchParams(t.hash.substring(1)).forEach((n,s)=>{e[s]=n})}catch{}return t.searchParams.forEach((r,n)=>{e[n]=r}),e}const Tr=i=>{let e;return i?e=i:typeof fetch>"u"?e=(...t)=>Fe(async()=>{const{default:r}=await Promise.resolve().then(()=>je);return{default:r}},void 0).then(({default:r})=>r(...t)):e=fetch,(...t)=>e(...t)},kn=i=>typeof i=="object"&&i!==null&&"status"in i&&"ok"in i&&"json"in i&&typeof i.json=="function",Ae=async(i,e,t)=>{await i.setItem(e,JSON.stringify(t))},ae=async(i,e)=>{const t=await i.getItem(e);if(!t)return null;try{return JSON.parse(t)}catch{return t}},te=async(i,e)=>{await i.removeItem(e)};class rt{constructor(){this.promise=new rt.promiseConstructor((e,t)=>{this.resolve=e,this.reject=t})}}rt.promiseConstructor=Promise;function ct(i){const e=i.split(".");if(e.length!==3)throw new Et("Invalid JWT structure");for(let r=0;r<e.length;r++)if(!dn.test(e[r]))throw new Et("JWT not in base64url format");return{header:JSON.parse(Yt(e[0])),payload:JSON.parse(Yt(e[1])),signature:$e(e[2]),raw:{header:e[0],payload:e[1]}}}async function En(i){return await new Promise(e=>{setTimeout(()=>e(null),i)})}function Sn(i,e){return new Promise((r,n)=>{(async()=>{for(let s=0;s<1/0;s++)try{const o=await i(s);if(!e(s,null,o)){r(o);return}}catch(o){if(!e(s,o)){n(o);return}}})()})}function Tn(i){return("0"+i.toString(16)).substr(-2)}function An(){const e=new Uint32Array(56);if(typeof crypto>"u"){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",r=t.length;let n="";for(let s=0;s<56;s++)n+=t.charAt(Math.floor(Math.random()*r));return n}return crypto.getRandomValues(e),Array.from(e,Tn).join("")}async function Cn(i){const t=new TextEncoder().encode(i),r=await crypto.subtle.digest("SHA-256",t),n=new Uint8Array(r);return Array.from(n).map(s=>String.fromCharCode(s)).join("")}async function $n(i){if(!(typeof crypto<"u"&&typeof crypto.subtle<"u"&&typeof TextEncoder<"u"))return i;const t=await Cn(i);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function _e(i,e,t=!1){const r=An();let n=r;t&&(n+="/PASSWORD_RECOVERY"),await Ae(i,`${e}-code-verifier`,n);const s=await $n(r);return[s,r===s?"plain":"s256"]}const In=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;function On(i){const e=i.headers.get(_t);if(!e||!e.match(In))return null;try{return new Date(`${e}T00:00:00.0Z`)}catch{return null}}function Pn(i){if(!i)throw new Error("Missing exp claim");const e=Math.floor(Date.now()/1e3);if(i<=e)throw new Error("JWT has expired")}function Rn(i){switch(i){case"RS256":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}};case"ES256":return{name:"ECDSA",namedCurve:"P-256",hash:{name:"SHA-256"}};default:throw new Error("Invalid alg claim")}}const jn=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;function ke(i){if(!jn.test(i))throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not")}function ut(){const i={};return new Proxy(i,{get:(e,t)=>{if(t==="__isUserNotAvailableProxy")return!0;if(typeof t=="symbol"){const r=t.toString();if(r==="Symbol(Symbol.toPrimitive)"||r==="Symbol(Symbol.toStringTag)"||r==="Symbol(util.inspect.custom)")return}throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t}" property of the session object is not supported. Please use getUser() instead.`)},set:(e,t)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(e,t)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function Qt(i){return JSON.parse(JSON.stringify(i))}var Ln=function(i,e){var t={};for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&e.indexOf(r)<0&&(t[r]=i[r]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,r=Object.getOwnPropertySymbols(i);n<r.length;n++)e.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(i,r[n])&&(t[r[n]]=i[r[n]]);return t};const le=i=>i.msg||i.message||i.error_description||i.error||JSON.stringify(i),Bn=[502,503,504];async function Zt(i){var e;if(!kn(i))throw new kt(le(i),0);if(Bn.includes(i.status))throw new kt(le(i),i.status);let t;try{t=await i.json()}catch(s){throw new ce(le(s),s)}let r;const n=On(i);if(n&&n.getTime()>=kr["2024-01-01"].timestamp&&typeof t=="object"&&t&&typeof t.code=="string"?r=t.code:typeof t=="object"&&t&&typeof t.error_code=="string"&&(r=t.error_code),r){if(r==="weak_password")throw new Kt(le(t),i.status,((e=t.weak_password)===null||e===void 0?void 0:e.reasons)||[]);if(r==="session_not_found")throw new re}else if(typeof t=="object"&&t&&typeof t.weak_password=="object"&&t.weak_password&&Array.isArray(t.weak_password.reasons)&&t.weak_password.reasons.length&&t.weak_password.reasons.reduce((s,o)=>s&&typeof o=="string",!0))throw new Kt(le(t),i.status,t.weak_password.reasons);throw new un(le(t),i.status||500,r)}const zn=(i,e,t,r)=>{const n={method:i,headers:e?.headers||{}};return i==="GET"?n:(n.headers=Object.assign({"Content-Type":"application/json;charset=UTF-8"},e?.headers),n.body=JSON.stringify(r),Object.assign(Object.assign({},n),t))};async function x(i,e,t,r){var n;const s=Object.assign({},r?.headers);s[_t]||(s[_t]=kr["2024-01-01"].name),r?.jwt&&(s.Authorization=`Bearer ${r.jwt}`);const o=(n=r?.query)!==null&&n!==void 0?n:{};r?.redirectTo&&(o.redirect_to=r.redirectTo);const a=Object.keys(o).length?"?"+new URLSearchParams(o).toString():"",l=await Mn(i,e,t+a,{headers:s,noResolveJson:r?.noResolveJson},{},r?.body);return r?.xform?r?.xform(l):{data:Object.assign({},l),error:null}}async function Mn(i,e,t,r,n,s){const o=zn(e,r,n,s);let a;try{a=await i(t,Object.assign({},o))}catch(l){throw new kt(le(l),0)}if(a.ok||await Zt(a),r?.noResolveJson)return a;try{return await a.json()}catch(l){await Zt(l)}}function D(i){var e;let t=null;Un(i)&&(t=Object.assign({},i),i.expires_at||(t.expires_at=wn(i.expires_in)));const r=(e=i.user)!==null&&e!==void 0?e:i;return{data:{session:t,user:r},error:null}}function Xt(i){const e=D(i);return!e.error&&i.weak_password&&typeof i.weak_password=="object"&&Array.isArray(i.weak_password.reasons)&&i.weak_password.reasons.length&&i.weak_password.message&&typeof i.weak_password.message=="string"&&i.weak_password.reasons.reduce((t,r)=>t&&typeof r=="string",!0)&&(e.data.weak_password=i.weak_password),e}function ie(i){var e;return{data:{user:(e=i.user)!==null&&e!==void 0?e:i},error:null}}function Nn(i){return{data:i,error:null}}function Dn(i){const{action_link:e,email_otp:t,hashed_token:r,redirect_to:n,verification_type:s}=i,o=Ln(i,["action_link","email_otp","hashed_token","redirect_to","verification_type"]),a={action_link:e,email_otp:t,hashed_token:r,redirect_to:n,verification_type:s},l=Object.assign({},o);return{data:{properties:a,user:l},error:null}}function er(i){return i}function Un(i){return i.access_token&&i.refresh_token&&i.expires_in}const ht=["global","local","others"];var qn=function(i,e){var t={};for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&e.indexOf(r)<0&&(t[r]=i[r]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,r=Object.getOwnPropertySymbols(i);n<r.length;n++)e.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(i,r[n])&&(t[r[n]]=i[r[n]]);return t};class Fn{constructor({url:e="",headers:t={},fetch:r}){this.url=e,this.headers=t,this.fetch=Tr(r),this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)}}async signOut(e,t=ht[0]){if(ht.indexOf(t)<0)throw new Error(`@supabase/auth-js: Parameter scope must be one of ${ht.join(", ")}`);try{return await x(this.fetch,"POST",`${this.url}/logout?scope=${t}`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(r){if(w(r))return{data:null,error:r};throw r}}async inviteUserByEmail(e,t={}){try{return await x(this.fetch,"POST",`${this.url}/invite`,{body:{email:e,data:t.data},headers:this.headers,redirectTo:t.redirectTo,xform:ie})}catch(r){if(w(r))return{data:{user:null},error:r};throw r}}async generateLink(e){try{const{options:t}=e,r=qn(e,["options"]),n=Object.assign(Object.assign({},r),t);return"newEmail"in r&&(n.new_email=r?.newEmail,delete n.newEmail),await x(this.fetch,"POST",`${this.url}/admin/generate_link`,{body:n,headers:this.headers,xform:Dn,redirectTo:t?.redirectTo})}catch(t){if(w(t))return{data:{properties:null,user:null},error:t};throw t}}async createUser(e){try{return await x(this.fetch,"POST",`${this.url}/admin/users`,{body:e,headers:this.headers,xform:ie})}catch(t){if(w(t))return{data:{user:null},error:t};throw t}}async listUsers(e){var t,r,n,s,o,a,l;try{const d={nextPage:null,lastPage:0,total:0},c=await x(this.fetch,"GET",`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(r=(t=e?.page)===null||t===void 0?void 0:t.toString())!==null&&r!==void 0?r:"",per_page:(s=(n=e?.perPage)===null||n===void 0?void 0:n.toString())!==null&&s!==void 0?s:""},xform:er});if(c.error)throw c.error;const u=await c.json(),h=(o=c.headers.get("x-total-count"))!==null&&o!==void 0?o:0,p=(l=(a=c.headers.get("link"))===null||a===void 0?void 0:a.split(","))!==null&&l!==void 0?l:[];return p.length>0&&(p.forEach(g=>{const m=parseInt(g.split(";")[0].split("=")[1].substring(0,1)),f=JSON.parse(g.split(";")[1].split("=")[1]);d[`${f}Page`]=m}),d.total=parseInt(h)),{data:Object.assign(Object.assign({},u),d),error:null}}catch(d){if(w(d))return{data:{users:[]},error:d};throw d}}async getUserById(e){ke(e);try{return await x(this.fetch,"GET",`${this.url}/admin/users/${e}`,{headers:this.headers,xform:ie})}catch(t){if(w(t))return{data:{user:null},error:t};throw t}}async updateUserById(e,t){ke(e);try{return await x(this.fetch,"PUT",`${this.url}/admin/users/${e}`,{body:t,headers:this.headers,xform:ie})}catch(r){if(w(r))return{data:{user:null},error:r};throw r}}async deleteUser(e,t=!1){ke(e);try{return await x(this.fetch,"DELETE",`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:t},xform:ie})}catch(r){if(w(r))return{data:{user:null},error:r};throw r}}async _listFactors(e){ke(e.userId);try{const{data:t,error:r}=await x(this.fetch,"GET",`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:n=>({data:{factors:n},error:null})});return{data:t,error:r}}catch(t){if(w(t))return{data:null,error:t};throw t}}async _deleteFactor(e){ke(e.userId),ke(e.id);try{return{data:await x(this.fetch,"DELETE",`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(t){if(w(t))return{data:null,error:t};throw t}}async _listOAuthClients(e){var t,r,n,s,o,a,l;try{const d={nextPage:null,lastPage:0,total:0},c=await x(this.fetch,"GET",`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:(r=(t=e?.page)===null||t===void 0?void 0:t.toString())!==null&&r!==void 0?r:"",per_page:(s=(n=e?.perPage)===null||n===void 0?void 0:n.toString())!==null&&s!==void 0?s:""},xform:er});if(c.error)throw c.error;const u=await c.json(),h=(o=c.headers.get("x-total-count"))!==null&&o!==void 0?o:0,p=(l=(a=c.headers.get("link"))===null||a===void 0?void 0:a.split(","))!==null&&l!==void 0?l:[];return p.length>0&&(p.forEach(g=>{const m=parseInt(g.split(";")[0].split("=")[1].substring(0,1)),f=JSON.parse(g.split(";")[1].split("=")[1]);d[`${f}Page`]=m}),d.total=parseInt(h)),{data:Object.assign(Object.assign({},u),d),error:null}}catch(d){if(w(d))return{data:{clients:[]},error:d};throw d}}async _createOAuthClient(e){try{return await x(this.fetch,"POST",`${this.url}/admin/oauth/clients`,{body:e,headers:this.headers,xform:t=>({data:t,error:null})})}catch(t){if(w(t))return{data:null,error:t};throw t}}async _getOAuthClient(e){try{return await x(this.fetch,"GET",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:t=>({data:t,error:null})})}catch(t){if(w(t))return{data:null,error:t};throw t}}async _deleteOAuthClient(e){try{return await x(this.fetch,"DELETE",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:t=>({data:t,error:null})})}catch(t){if(w(t))return{data:null,error:t};throw t}}async _regenerateOAuthClientSecret(e){try{return await x(this.fetch,"POST",`${this.url}/admin/oauth/clients/${e}/regenerate_secret`,{headers:this.headers,xform:t=>({data:t,error:null})})}catch(t){if(w(t))return{data:null,error:t};throw t}}}function tr(i={}){return{getItem:e=>i[e]||null,setItem:(e,t)=>{i[e]=t},removeItem:e=>{delete i[e]}}}const Ee={debug:!!(globalThis&&Sr()&&globalThis.localStorage&&globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug")==="true")};class Ar extends Error{constructor(e){super(e),this.isAcquireTimeout=!0}}class Hn extends Ar{}async function Wn(i,e,t){Ee.debug;const r=new globalThis.AbortController;return e>0&&setTimeout(()=>{r.abort(),Ee.debug},e),await Promise.resolve().then(()=>globalThis.navigator.locks.request(i,e===0?{mode:"exclusive",ifAvailable:!0}:{mode:"exclusive",signal:r.signal},async n=>{if(n){Ee.debug;try{return await t()}finally{Ee.debug}}else{if(e===0)throw Ee.debug,new Hn(`Acquiring an exclusive Navigator LockManager lock "${i}" immediately failed`);if(Ee.debug)try{const s=await globalThis.navigator.locks.query()}catch{}return await t()}}))}function Gn(){if(typeof globalThis!="object")try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<"u"&&(self.globalThis=self)}}function Cr(i){if(!/^0x[a-fA-F0-9]{40}$/.test(i))throw new Error(`@supabase/auth-js: Address "${i}" is invalid.`);return i.toLowerCase()}function Kn(i){return parseInt(i,16)}function Vn(i){const e=new TextEncoder().encode(i);return"0x"+Array.from(e,r=>r.toString(16).padStart(2,"0")).join("")}function Jn(i){var e;const{chainId:t,domain:r,expirationTime:n,issuedAt:s=new Date,nonce:o,notBefore:a,requestId:l,resources:d,scheme:c,uri:u,version:h}=i;{if(!Number.isInteger(t))throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${t}`);if(!r)throw new Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');if(o&&o.length<8)throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${o}`);if(!u)throw new Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');if(h!=="1")throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${h}`);if(!((e=i.statement)===null||e===void 0)&&e.includes(`
`))throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${i.statement}`)}const p=Cr(i.address),g=c?`${c}://${r}`:r,m=i.statement?`${i.statement}
`:"",f=`${g} wants you to sign in with your Ethereum account:
${p}

${m}`;let _=`URI: ${u}
Version: ${h}
Chain ID: ${t}${o?`
Nonce: ${o}`:""}
Issued At: ${s.toISOString()}`;if(n&&(_+=`
Expiration Time: ${n.toISOString()}`),a&&(_+=`
Not Before: ${a.toISOString()}`),l&&(_+=`
Request ID: ${l}`),d){let b=`
Resources:`;for(const v of d){if(!v||typeof v!="string")throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${v}`);b+=`
- ${v}`}_+=b}return`${f}
${_}`}class $ extends Error{constructor({message:e,code:t,cause:r,name:n}){var s;super(e,{cause:r}),this.__isWebAuthnError=!0,this.name=(s=n??(r instanceof Error?r.name:void 0))!==null&&s!==void 0?s:"Unknown Error",this.code=t}}class Xe extends ${constructor(e,t){super({code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t,message:e}),this.name="WebAuthnUnknownError",this.originalError=t}}function Yn({error:i,options:e}){var t,r,n;const{publicKey:s}=e;if(!s)throw Error("options was missing required publicKey property");if(i.name==="AbortError"){if(e.signal instanceof AbortSignal)return new $({message:"Registration ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:i})}else if(i.name==="ConstraintError"){if(((t=s.authenticatorSelection)===null||t===void 0?void 0:t.requireResidentKey)===!0)return new $({message:"Discoverable credentials were required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",cause:i});if(e.mediation==="conditional"&&((r=s.authenticatorSelection)===null||r===void 0?void 0:r.userVerification)==="required")return new $({message:"User verification was required during automatic registration but it could not be performed",code:"ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",cause:i});if(((n=s.authenticatorSelection)===null||n===void 0?void 0:n.userVerification)==="required")return new $({message:"User verification was required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",cause:i})}else{if(i.name==="InvalidStateError")return new $({message:"The authenticator was previously registered",code:"ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",cause:i});if(i.name==="NotAllowedError")return new $({message:i.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:i});if(i.name==="NotSupportedError")return s.pubKeyCredParams.filter(a=>a.type==="public-key").length===0?new $({message:'No entry in pubKeyCredParams was of type "public-key"',code:"ERROR_MALFORMED_PUBKEYCREDPARAMS",cause:i}):new $({message:"No available authenticator supported any of the specified pubKeyCredParams algorithms",code:"ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",cause:i});if(i.name==="SecurityError"){const o=window.location.hostname;if(Ir(o)){if(s.rp.id!==o)return new $({message:`The RP ID "${s.rp.id}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:i})}else return new $({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:i})}else if(i.name==="TypeError"){if(s.user.id.byteLength<1||s.user.id.byteLength>64)return new $({message:"User ID was not between 1 and 64 characters",code:"ERROR_INVALID_USER_ID_LENGTH",cause:i})}else if(i.name==="UnknownError")return new $({message:"The authenticator was unable to process the specified options, or could not create a new credential",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:i})}return new $({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:i})}function Qn({error:i,options:e}){const{publicKey:t}=e;if(!t)throw Error("options was missing required publicKey property");if(i.name==="AbortError"){if(e.signal instanceof AbortSignal)return new $({message:"Authentication ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:i})}else{if(i.name==="NotAllowedError")return new $({message:i.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:i});if(i.name==="SecurityError"){const r=window.location.hostname;if(Ir(r)){if(t.rpId!==r)return new $({message:`The RP ID "${t.rpId}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:i})}else return new $({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:i})}else if(i.name==="UnknownError")return new $({message:"The authenticator was unable to process the specified options, or could not create a new assertion signature",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:i})}return new $({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:i})}var $r=function(i,e){var t={};for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&e.indexOf(r)<0&&(t[r]=i[r]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,r=Object.getOwnPropertySymbols(i);n<r.length;n++)e.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(i,r[n])&&(t[r[n]]=i[r[n]]);return t};class Zn{createNewAbortSignal(){if(this.controller){const t=new Error("Cancelling existing WebAuthn API call for new one");t.name="AbortError",this.controller.abort(t)}const e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){const e=new Error("Manually cancelling existing WebAuthn API call");e.name="AbortError",this.controller.abort(e),this.controller=void 0}}}const Xn=new Zn;function es(i){if(!i)throw new Error("Credential creation options are required");if(typeof PublicKeyCredential<"u"&&"parseCreationOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseCreationOptionsFromJSON=="function")return PublicKeyCredential.parseCreationOptionsFromJSON(i);const{challenge:e,user:t,excludeCredentials:r}=i,n=$r(i,["challenge","user","excludeCredentials"]),s=$e(e).buffer,o=Object.assign(Object.assign({},t),{id:$e(t.id).buffer}),a=Object.assign(Object.assign({},n),{challenge:s,user:o});if(r&&r.length>0){a.excludeCredentials=new Array(r.length);for(let l=0;l<r.length;l++){const d=r[l];a.excludeCredentials[l]=Object.assign(Object.assign({},d),{id:$e(d.id).buffer,type:d.type||"public-key",transports:d.transports})}}return a}function ts(i){if(!i)throw new Error("Credential request options are required");if(typeof PublicKeyCredential<"u"&&"parseRequestOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseRequestOptionsFromJSON=="function")return PublicKeyCredential.parseRequestOptionsFromJSON(i);const{challenge:e,allowCredentials:t}=i,r=$r(i,["challenge","allowCredentials"]),n=$e(e).buffer,s=Object.assign(Object.assign({},r),{challenge:n});if(t&&t.length>0){s.allowCredentials=new Array(t.length);for(let o=0;o<t.length;o++){const a=t[o];s.allowCredentials[o]=Object.assign(Object.assign({},a),{id:$e(a.id).buffer,type:a.type||"public-key",transports:a.transports})}}return s}function rs(i){var e;if("toJSON"in i&&typeof i.toJSON=="function")return i.toJSON();const t=i;return{id:i.id,rawId:i.id,response:{attestationObject:he(new Uint8Array(i.response.attestationObject)),clientDataJSON:he(new Uint8Array(i.response.clientDataJSON))},type:"public-key",clientExtensionResults:i.getClientExtensionResults(),authenticatorAttachment:(e=t.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function is(i){var e;if("toJSON"in i&&typeof i.toJSON=="function")return i.toJSON();const t=i,r=i.getClientExtensionResults(),n=i.response;return{id:i.id,rawId:i.id,response:{authenticatorData:he(new Uint8Array(n.authenticatorData)),clientDataJSON:he(new Uint8Array(n.clientDataJSON)),signature:he(new Uint8Array(n.signature)),userHandle:n.userHandle?he(new Uint8Array(n.userHandle)):void 0},type:"public-key",clientExtensionResults:r,authenticatorAttachment:(e=t.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function Ir(i){return i==="localhost"||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(i)}function rr(){var i,e;return!!(M()&&"PublicKeyCredential"in window&&window.PublicKeyCredential&&"credentials"in navigator&&typeof((i=navigator?.credentials)===null||i===void 0?void 0:i.create)=="function"&&typeof((e=navigator?.credentials)===null||e===void 0?void 0:e.get)=="function")}async function ns(i){try{const e=await navigator.credentials.create(i);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Xe("Browser returned unexpected credential type",e)}:{data:null,error:new Xe("Empty credential response",e)}}catch(e){return{data:null,error:Yn({error:e,options:i})}}}async function ss(i){try{const e=await navigator.credentials.get(i);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Xe("Browser returned unexpected credential type",e)}:{data:null,error:new Xe("Empty credential response",e)}}catch(e){return{data:null,error:Qn({error:e,options:i})}}}const os={hints:["security-key"],authenticatorSelection:{authenticatorAttachment:"cross-platform",requireResidentKey:!1,userVerification:"preferred",residentKey:"discouraged"},attestation:"none"},as={userVerification:"preferred",hints:["security-key"]};function et(...i){const e=n=>n!==null&&typeof n=="object"&&!Array.isArray(n),t=n=>n instanceof ArrayBuffer||ArrayBuffer.isView(n),r={};for(const n of i)if(n)for(const s in n){const o=n[s];if(o!==void 0)if(Array.isArray(o))r[s]=o;else if(t(o))r[s]=o;else if(e(o)){const a=r[s];e(a)?r[s]=et(a,o):r[s]=et(o)}else r[s]=o}return r}function ls(i,e){return et(os,i,e||{})}function ds(i,e){return et(as,i,e||{})}class cs{constructor(e){this.client=e,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(e){return this.client.mfa.enroll(Object.assign(Object.assign({},e),{factorType:"webauthn"}))}async _challenge({factorId:e,webauthn:t,friendlyName:r,signal:n},s){try{const{data:o,error:a}=await this.client.mfa.challenge({factorId:e,webauthn:t});if(!o)return{data:null,error:a};const l=n??Xn.createNewAbortSignal();if(o.webauthn.type==="create"){const{user:d}=o.webauthn.credential_options.publicKey;d.name||(d.name=`${d.id}:${r}`),d.displayName||(d.displayName=d.name)}switch(o.webauthn.type){case"create":{const d=ls(o.webauthn.credential_options.publicKey,s?.create),{data:c,error:u}=await ns({publicKey:d,signal:l});return c?{data:{factorId:e,challengeId:o.id,webauthn:{type:o.webauthn.type,credential_response:c}},error:null}:{data:null,error:u}}case"request":{const d=ds(o.webauthn.credential_options.publicKey,s?.request),{data:c,error:u}=await ss(Object.assign(Object.assign({},o.webauthn.credential_options),{publicKey:d,signal:l}));return c?{data:{factorId:e,challengeId:o.id,webauthn:{type:o.webauthn.type,credential_response:c}},error:null}:{data:null,error:u}}}}catch(o){return w(o)?{data:null,error:o}:{data:null,error:new ce("Unexpected error in challenge",o)}}}async _verify({challengeId:e,factorId:t,webauthn:r}){return this.client.mfa.verify({factorId:t,challengeId:e,webauthn:r})}async _authenticate({factorId:e,webauthn:{rpId:t=typeof window<"u"?window.location.hostname:void 0,rpOrigins:r=typeof window<"u"?[window.location.origin]:void 0,signal:n}},s){if(!t)return{data:null,error:new Ue("rpId is required for WebAuthn authentication")};try{if(!rr())return{data:null,error:new ce("Browser does not support WebAuthn",null)};const{data:o,error:a}=await this.challenge({factorId:e,webauthn:{rpId:t,rpOrigins:r},signal:n},{request:s});if(!o)return{data:null,error:a};const{webauthn:l}=o;return this._verify({factorId:e,challengeId:o.challengeId,webauthn:{type:l.type,rpId:t,rpOrigins:r,credential_response:l.credential_response}})}catch(o){return w(o)?{data:null,error:o}:{data:null,error:new ce("Unexpected error in authenticate",o)}}}async _register({friendlyName:e,rpId:t=typeof window<"u"?window.location.hostname:void 0,rpOrigins:r=typeof window<"u"?[window.location.origin]:void 0,signal:n},s){if(!t)return{data:null,error:new Ue("rpId is required for WebAuthn registration")};try{if(!rr())return{data:null,error:new ce("Browser does not support WebAuthn",null)};const{data:o,error:a}=await this._enroll({friendlyName:e});if(!o)return await this.client.mfa.listFactors().then(c=>{var u;return(u=c.data)===null||u===void 0?void 0:u.all.find(h=>h.factor_type==="webauthn"&&h.friendly_name===e&&h.status!=="unverified")}).then(c=>c?this.client.mfa.unenroll({factorId:c?.id}):void 0),{data:null,error:a};const{data:l,error:d}=await this._challenge({factorId:o.id,friendlyName:o.friendly_name,webauthn:{rpId:t,rpOrigins:r},signal:n},{create:s});return l?this._verify({factorId:o.id,challengeId:l.challengeId,webauthn:{rpId:t,rpOrigins:r,type:l.webauthn.type,credential_response:l.webauthn.credential_response}}):{data:null,error:d}}catch(o){return w(o)?{data:null,error:o}:{data:null,error:new ce("Unexpected error in register",o)}}}}Gn();const us={url:on,storageKey:an,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:ln,flowType:"implicit",debug:!1,hasCustomAuthorizationHeader:!1};async function ir(i,e,t){return await t()}const Se={};class qe{get jwks(){var e,t;return(t=(e=Se[this.storageKey])===null||e===void 0?void 0:e.jwks)!==null&&t!==void 0?t:{keys:[]}}set jwks(e){Se[this.storageKey]=Object.assign(Object.assign({},Se[this.storageKey]),{jwks:e})}get jwks_cached_at(){var e,t;return(t=(e=Se[this.storageKey])===null||e===void 0?void 0:e.cachedAt)!==null&&t!==void 0?t:Number.MIN_SAFE_INTEGER}set jwks_cached_at(e){Se[this.storageKey]=Object.assign(Object.assign({},Se[this.storageKey]),{cachedAt:e})}constructor(e){var t,r;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.initializePromise=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log,this.instanceID=qe.nextInstanceID,qe.nextInstanceID+=1,this.instanceID>0&&M();const n=Object.assign(Object.assign({},us),e);if(this.logDebugMessages=!!n.debug,typeof n.debug=="function"&&(this.logger=n.debug),this.persistSession=n.persistSession,this.storageKey=n.storageKey,this.autoRefreshToken=n.autoRefreshToken,this.admin=new Fn({url:n.url,headers:n.headers,fetch:n.fetch}),this.url=n.url,this.headers=n.headers,this.fetch=Tr(n.fetch),this.lock=n.lock||ir,this.detectSessionInUrl=n.detectSessionInUrl,this.flowType=n.flowType,this.hasCustomAuthorizationHeader=n.hasCustomAuthorizationHeader,n.lock?this.lock=n.lock:M()&&(!((t=globalThis?.navigator)===null||t===void 0)&&t.locks)?this.lock=Wn:this.lock=ir,this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=Number.MIN_SAFE_INTEGER),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new cs(this)},this.persistSession?(n.storage?this.storage=n.storage:Sr()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=tr(this.memoryStorage)),n.userStorage&&(this.userStorage=n.userStorage)):(this.memoryStorage={},this.storage=tr(this.memoryStorage)),M()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch{}(r=this.broadcastChannel)===null||r===void 0||r.addEventListener("message",async s=>{this._debug("received broadcast notification from other tab or client",s),await this._notifyAllSubscribers(s.data.event,s.data.session,!1)})}this.initialize()}_debug(...e){return this.logDebugMessages&&this.logger(`GoTrueClient@${this.instanceID} (${_r}) ${new Date().toISOString()}`,...e),this}async initialize(){return this.initializePromise?await this.initializePromise:(this.initializePromise=(async()=>await this._acquireLock(-1,async()=>await this._initialize()))(),await this.initializePromise)}async _initialize(){var e;try{const t=_n(window.location.href);let r="none";if(this._isImplicitGrantCallback(t)?r="implicit":await this._isPKCECallback(t)&&(r="pkce"),M()&&this.detectSessionInUrl&&r!=="none"){const{data:n,error:s}=await this._getSessionFromURL(t,r);if(s){if(this._debug("#_initialize()","error detecting session from URL",s),gn(s)){const l=(e=s.details)===null||e===void 0?void 0:e.code;if(l==="identity_already_exists"||l==="identity_not_found"||l==="single_identity_not_deletable")return{error:s}}return await this._removeSession(),{error:s}}const{session:o,redirectType:a}=n;return this._debug("#_initialize()","detected session in URL",o,"redirect type",a),await this._saveSession(o),setTimeout(async()=>{a==="recovery"?await this._notifyAllSubscribers("PASSWORD_RECOVERY",o):await this._notifyAllSubscribers("SIGNED_IN",o)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(t){return w(t)?{error:t}:{error:new ce("Unexpected error during initialization",t)}}finally{await this._handleVisibilityChange(),this._debug("#_initialize()","end")}}async signInAnonymously(e){var t,r,n;try{const s=await x(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{data:(r=(t=e?.options)===null||t===void 0?void 0:t.data)!==null&&r!==void 0?r:{},gotrue_meta_security:{captcha_token:(n=e?.options)===null||n===void 0?void 0:n.captchaToken}},xform:D}),{data:o,error:a}=s;if(a||!o)return{data:{user:null,session:null},error:a};const l=o.session,d=o.user;return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers("SIGNED_IN",l)),{data:{user:d,session:l},error:null}}catch(s){if(w(s))return{data:{user:null,session:null},error:s};throw s}}async signUp(e){var t,r,n;try{let s;if("email"in e){const{email:c,password:u,options:h}=e;let p=null,g=null;this.flowType==="pkce"&&([p,g]=await _e(this.storage,this.storageKey)),s=await x(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,redirectTo:h?.emailRedirectTo,body:{email:c,password:u,data:(t=h?.data)!==null&&t!==void 0?t:{},gotrue_meta_security:{captcha_token:h?.captchaToken},code_challenge:p,code_challenge_method:g},xform:D})}else if("phone"in e){const{phone:c,password:u,options:h}=e;s=await x(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{phone:c,password:u,data:(r=h?.data)!==null&&r!==void 0?r:{},channel:(n=h?.channel)!==null&&n!==void 0?n:"sms",gotrue_meta_security:{captcha_token:h?.captchaToken}},xform:D})}else throw new Je("You must provide either an email or phone number and a password");const{data:o,error:a}=s;if(a||!o)return{data:{user:null,session:null},error:a};const l=o.session,d=o.user;return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers("SIGNED_IN",l)),{data:{user:d,session:l},error:null}}catch(s){if(w(s))return{data:{user:null,session:null},error:s};throw s}}async signInWithPassword(e){try{let t;if("email"in e){const{email:s,password:o,options:a}=e;t=await x(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:s,password:o,gotrue_meta_security:{captcha_token:a?.captchaToken}},xform:Xt})}else if("phone"in e){const{phone:s,password:o,options:a}=e;t=await x(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:s,password:o,gotrue_meta_security:{captcha_token:a?.captchaToken}},xform:Xt})}else throw new Je("You must provide either an email or phone number and a password");const{data:r,error:n}=t;return n?{data:{user:null,session:null},error:n}:!r||!r.session||!r.user?{data:{user:null,session:null},error:new xe}:(r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers("SIGNED_IN",r.session)),{data:Object.assign({user:r.user,session:r.session},r.weak_password?{weakPassword:r.weak_password}:null),error:n})}catch(t){if(w(t))return{data:{user:null,session:null},error:t};throw t}}async signInWithOAuth(e){var t,r,n,s;return await this._handleProviderSignIn(e.provider,{redirectTo:(t=e.options)===null||t===void 0?void 0:t.redirectTo,scopes:(r=e.options)===null||r===void 0?void 0:r.scopes,queryParams:(n=e.options)===null||n===void 0?void 0:n.queryParams,skipBrowserRedirect:(s=e.options)===null||s===void 0?void 0:s.skipBrowserRedirect})}async exchangeCodeForSession(e){return await this.initializePromise,this._acquireLock(-1,async()=>this._exchangeCodeForSession(e))}async signInWithWeb3(e){const{chain:t}=e;switch(t){case"ethereum":return await this.signInWithEthereum(e);case"solana":return await this.signInWithSolana(e);default:throw new Error(`@supabase/auth-js: Unsupported chain "${t}"`)}}async signInWithEthereum(e){var t,r,n,s,o,a,l,d,c,u,h;let p,g;if("message"in e)p=e.message,g=e.signature;else{const{chain:m,wallet:f,statement:_,options:b}=e;let v;if(M())if(typeof f=="object")v=f;else{const J=window;if("ethereum"in J&&typeof J.ethereum=="object"&&"request"in J.ethereum&&typeof J.ethereum.request=="function")v=J.ethereum;else throw new Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.")}else{if(typeof f!="object"||!b?.url)throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");v=f}const k=new URL((t=b?.url)!==null&&t!==void 0?t:window.location.href),C=await v.request({method:"eth_requestAccounts"}).then(J=>J).catch(()=>{throw new Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid")});if(!C||C.length===0)throw new Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");const S=Cr(C[0]);let O=(r=b?.signInWithEthereum)===null||r===void 0?void 0:r.chainId;if(!O){const J=await v.request({method:"eth_chainId"});O=Kn(J)}const ee={domain:k.host,address:S,statement:_,uri:k.href,version:"1",chainId:O,nonce:(n=b?.signInWithEthereum)===null||n===void 0?void 0:n.nonce,issuedAt:(o=(s=b?.signInWithEthereum)===null||s===void 0?void 0:s.issuedAt)!==null&&o!==void 0?o:new Date,expirationTime:(a=b?.signInWithEthereum)===null||a===void 0?void 0:a.expirationTime,notBefore:(l=b?.signInWithEthereum)===null||l===void 0?void 0:l.notBefore,requestId:(d=b?.signInWithEthereum)===null||d===void 0?void 0:d.requestId,resources:(c=b?.signInWithEthereum)===null||c===void 0?void 0:c.resources};p=Jn(ee),g=await v.request({method:"personal_sign",params:[Vn(p),S]})}try{const{data:m,error:f}=await x(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"ethereum",message:p,signature:g},!((u=e.options)===null||u===void 0)&&u.captchaToken?{gotrue_meta_security:{captcha_token:(h=e.options)===null||h===void 0?void 0:h.captchaToken}}:null),xform:D});if(f)throw f;return!m||!m.session||!m.user?{data:{user:null,session:null},error:new xe}:(m.session&&(await this._saveSession(m.session),await this._notifyAllSubscribers("SIGNED_IN",m.session)),{data:Object.assign({},m),error:f})}catch(m){if(w(m))return{data:{user:null,session:null},error:m};throw m}}async signInWithSolana(e){var t,r,n,s,o,a,l,d,c,u,h,p;let g,m;if("message"in e)g=e.message,m=e.signature;else{const{chain:f,wallet:_,statement:b,options:v}=e;let k;if(M())if(typeof _=="object")k=_;else{const S=window;if("solana"in S&&typeof S.solana=="object"&&("signIn"in S.solana&&typeof S.solana.signIn=="function"||"signMessage"in S.solana&&typeof S.solana.signMessage=="function"))k=S.solana;else throw new Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.")}else{if(typeof _!="object"||!v?.url)throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");k=_}const C=new URL((t=v?.url)!==null&&t!==void 0?t:window.location.href);if("signIn"in k&&k.signIn){const S=await k.signIn(Object.assign(Object.assign(Object.assign({issuedAt:new Date().toISOString()},v?.signInWithSolana),{version:"1",domain:C.host,uri:C.href}),b?{statement:b}:null));let O;if(Array.isArray(S)&&S[0]&&typeof S[0]=="object")O=S[0];else if(S&&typeof S=="object"&&"signedMessage"in S&&"signature"in S)O=S;else throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");if("signedMessage"in O&&"signature"in O&&(typeof O.signedMessage=="string"||O.signedMessage instanceof Uint8Array)&&O.signature instanceof Uint8Array)g=typeof O.signedMessage=="string"?O.signedMessage:new TextDecoder().decode(O.signedMessage),m=O.signature;else throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields")}else{if(!("signMessage"in k)||typeof k.signMessage!="function"||!("publicKey"in k)||typeof k!="object"||!k.publicKey||!("toBase58"in k.publicKey)||typeof k.publicKey.toBase58!="function")throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");g=[`${C.host} wants you to sign in with your Solana account:`,k.publicKey.toBase58(),...b?["",b,""]:[""],"Version: 1",`URI: ${C.href}`,`Issued At: ${(n=(r=v?.signInWithSolana)===null||r===void 0?void 0:r.issuedAt)!==null&&n!==void 0?n:new Date().toISOString()}`,...!((s=v?.signInWithSolana)===null||s===void 0)&&s.notBefore?[`Not Before: ${v.signInWithSolana.notBefore}`]:[],...!((o=v?.signInWithSolana)===null||o===void 0)&&o.expirationTime?[`Expiration Time: ${v.signInWithSolana.expirationTime}`]:[],...!((a=v?.signInWithSolana)===null||a===void 0)&&a.chainId?[`Chain ID: ${v.signInWithSolana.chainId}`]:[],...!((l=v?.signInWithSolana)===null||l===void 0)&&l.nonce?[`Nonce: ${v.signInWithSolana.nonce}`]:[],...!((d=v?.signInWithSolana)===null||d===void 0)&&d.requestId?[`Request ID: ${v.signInWithSolana.requestId}`]:[],...!((u=(c=v?.signInWithSolana)===null||c===void 0?void 0:c.resources)===null||u===void 0)&&u.length?["Resources",...v.signInWithSolana.resources.map(O=>`- ${O}`)]:[]].join(`
`);const S=await k.signMessage(new TextEncoder().encode(g),"utf8");if(!S||!(S instanceof Uint8Array))throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");m=S}}try{const{data:f,error:_}=await x(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"solana",message:g,signature:he(m)},!((h=e.options)===null||h===void 0)&&h.captchaToken?{gotrue_meta_security:{captcha_token:(p=e.options)===null||p===void 0?void 0:p.captchaToken}}:null),xform:D});if(_)throw _;return!f||!f.session||!f.user?{data:{user:null,session:null},error:new xe}:(f.session&&(await this._saveSession(f.session),await this._notifyAllSubscribers("SIGNED_IN",f.session)),{data:Object.assign({},f),error:_})}catch(f){if(w(f))return{data:{user:null,session:null},error:f};throw f}}async _exchangeCodeForSession(e){const t=await ae(this.storage,`${this.storageKey}-code-verifier`),[r,n]=(t??"").split("/");try{const{data:s,error:o}=await x(this.fetch,"POST",`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:r},xform:D});if(await te(this.storage,`${this.storageKey}-code-verifier`),o)throw o;return!s||!s.session||!s.user?{data:{user:null,session:null,redirectType:null},error:new xe}:(s.session&&(await this._saveSession(s.session),await this._notifyAllSubscribers("SIGNED_IN",s.session)),{data:Object.assign(Object.assign({},s),{redirectType:n??null}),error:o})}catch(s){if(w(s))return{data:{user:null,session:null,redirectType:null},error:s};throw s}}async signInWithIdToken(e){try{const{options:t,provider:r,token:n,access_token:s,nonce:o}=e,a=await x(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:r,id_token:n,access_token:s,nonce:o,gotrue_meta_security:{captcha_token:t?.captchaToken}},xform:D}),{data:l,error:d}=a;return d?{data:{user:null,session:null},error:d}:!l||!l.session||!l.user?{data:{user:null,session:null},error:new xe}:(l.session&&(await this._saveSession(l.session),await this._notifyAllSubscribers("SIGNED_IN",l.session)),{data:l,error:d})}catch(t){if(w(t))return{data:{user:null,session:null},error:t};throw t}}async signInWithOtp(e){var t,r,n,s,o;try{if("email"in e){const{email:a,options:l}=e;let d=null,c=null;this.flowType==="pkce"&&([d,c]=await _e(this.storage,this.storageKey));const{error:u}=await x(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{email:a,data:(t=l?.data)!==null&&t!==void 0?t:{},create_user:(r=l?.shouldCreateUser)!==null&&r!==void 0?r:!0,gotrue_meta_security:{captcha_token:l?.captchaToken},code_challenge:d,code_challenge_method:c},redirectTo:l?.emailRedirectTo});return{data:{user:null,session:null},error:u}}if("phone"in e){const{phone:a,options:l}=e,{data:d,error:c}=await x(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{phone:a,data:(n=l?.data)!==null&&n!==void 0?n:{},create_user:(s=l?.shouldCreateUser)!==null&&s!==void 0?s:!0,gotrue_meta_security:{captcha_token:l?.captchaToken},channel:(o=l?.channel)!==null&&o!==void 0?o:"sms"}});return{data:{user:null,session:null,messageId:d?.message_id},error:c}}throw new Je("You must provide either an email or phone number.")}catch(a){if(w(a))return{data:{user:null,session:null},error:a};throw a}}async verifyOtp(e){var t,r;try{let n,s;"options"in e&&(n=(t=e.options)===null||t===void 0?void 0:t.redirectTo,s=(r=e.options)===null||r===void 0?void 0:r.captchaToken);const{data:o,error:a}=await x(this.fetch,"POST",`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:s}}),redirectTo:n,xform:D});if(a)throw a;if(!o)throw new Error("An error occurred on token verification.");const l=o.session,d=o.user;return l?.access_token&&(await this._saveSession(l),await this._notifyAllSubscribers(e.type=="recovery"?"PASSWORD_RECOVERY":"SIGNED_IN",l)),{data:{user:d,session:l},error:null}}catch(n){if(w(n))return{data:{user:null,session:null},error:n};throw n}}async signInWithSSO(e){var t,r,n;try{let s=null,o=null;return this.flowType==="pkce"&&([s,o]=await _e(this.storage,this.storageKey)),await x(this.fetch,"POST",`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},"providerId"in e?{provider_id:e.providerId}:null),"domain"in e?{domain:e.domain}:null),{redirect_to:(r=(t=e.options)===null||t===void 0?void 0:t.redirectTo)!==null&&r!==void 0?r:void 0}),!((n=e?.options)===null||n===void 0)&&n.captchaToken?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:s,code_challenge_method:o}),headers:this.headers,xform:Nn})}catch(s){if(w(s))return{data:null,error:s};throw s}}async reauthenticate(){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._reauthenticate())}async _reauthenticate(){try{return await this._useSession(async e=>{const{data:{session:t},error:r}=e;if(r)throw r;if(!t)throw new re;const{error:n}=await x(this.fetch,"GET",`${this.url}/reauthenticate`,{headers:this.headers,jwt:t.access_token});return{data:{user:null,session:null},error:n}})}catch(e){if(w(e))return{data:{user:null,session:null},error:e};throw e}}async resend(e){try{const t=`${this.url}/resend`;if("email"in e){const{email:r,type:n,options:s}=e,{error:o}=await x(this.fetch,"POST",t,{headers:this.headers,body:{email:r,type:n,gotrue_meta_security:{captcha_token:s?.captchaToken}},redirectTo:s?.emailRedirectTo});return{data:{user:null,session:null},error:o}}else if("phone"in e){const{phone:r,type:n,options:s}=e,{data:o,error:a}=await x(this.fetch,"POST",t,{headers:this.headers,body:{phone:r,type:n,gotrue_meta_security:{captcha_token:s?.captchaToken}}});return{data:{user:null,session:null,messageId:o?.message_id},error:a}}throw new Je("You must provide either an email or phone number and a type")}catch(t){if(w(t))return{data:{user:null,session:null},error:t};throw t}}async getSession(){return await this.initializePromise,await this._acquireLock(-1,async()=>this._useSession(async t=>t))}async _acquireLock(e,t){this._debug("#_acquireLock","begin",e);try{if(this.lockAcquired){const r=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),n=(async()=>(await r,await t()))();return this.pendingInLock.push((async()=>{try{await n}catch{}})()),n}return await this.lock(`lock:${this.storageKey}`,e,async()=>{this._debug("#_acquireLock","lock acquired for storage key",this.storageKey);try{this.lockAcquired=!0;const r=t();for(this.pendingInLock.push((async()=>{try{await r}catch{}})()),await r;this.pendingInLock.length;){const n=[...this.pendingInLock];await Promise.all(n),this.pendingInLock.splice(0,n.length)}return await r}finally{this._debug("#_acquireLock","lock released for storage key",this.storageKey),this.lockAcquired=!1}})}finally{this._debug("#_acquireLock","end")}}async _useSession(e){this._debug("#_useSession","begin");try{const t=await this.__loadSession();return await e(t)}finally{this._debug("#_useSession","end")}}async __loadSession(){this._debug("#__loadSession()","begin"),this.lockAcquired||this._debug("#__loadSession()","used outside of an acquired lock!",new Error().stack);try{let e=null;const t=await ae(this.storage,this.storageKey);if(this._debug("#getSession()","session from storage",t),t!==null&&(this._isValidSession(t)?e=t:(this._debug("#getSession()","session from storage is not valid"),await this._removeSession())),!e)return{data:{session:null},error:null};const r=e.expires_at?e.expires_at*1e3-Date.now()<lt:!1;if(this._debug("#__loadSession()",`session has${r?"":" not"} expired`,"expires_at",e.expires_at),!r){if(this.userStorage){const o=await ae(this.userStorage,this.storageKey+"-user");o?.user?e.user=o.user:e.user=ut()}if(this.storage.isServer&&e.user){let o=this.suppressGetSessionWarning;e=new Proxy(e,{get:(l,d,c)=>(!o&&d==="user"&&(o=!0,this.suppressGetSessionWarning=!0),Reflect.get(l,d,c))})}return{data:{session:e},error:null}}const{data:n,error:s}=await this._callRefreshToken(e.refresh_token);return s?{data:{session:null},error:s}:{data:{session:n},error:null}}finally{this._debug("#__loadSession()","end")}}async getUser(e){return e?await this._getUser(e):(await this.initializePromise,await this._acquireLock(-1,async()=>await this._getUser()))}async _getUser(e){try{return e?await x(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:e,xform:ie}):await this._useSession(async t=>{var r,n,s;const{data:o,error:a}=t;if(a)throw a;return!(!((r=o.session)===null||r===void 0)&&r.access_token)&&!this.hasCustomAuthorizationHeader?{data:{user:null},error:new re}:await x(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:(s=(n=o.session)===null||n===void 0?void 0:n.access_token)!==null&&s!==void 0?s:void 0,xform:ie})})}catch(t){if(w(t))return pn(t)&&(await this._removeSession(),await te(this.storage,`${this.storageKey}-code-verifier`)),{data:{user:null},error:t};throw t}}async updateUser(e,t={}){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._updateUser(e,t))}async _updateUser(e,t={}){try{return await this._useSession(async r=>{const{data:n,error:s}=r;if(s)throw s;if(!n.session)throw new re;const o=n.session;let a=null,l=null;this.flowType==="pkce"&&e.email!=null&&([a,l]=await _e(this.storage,this.storageKey));const{data:d,error:c}=await x(this.fetch,"PUT",`${this.url}/user`,{headers:this.headers,redirectTo:t?.emailRedirectTo,body:Object.assign(Object.assign({},e),{code_challenge:a,code_challenge_method:l}),jwt:o.access_token,xform:ie});if(c)throw c;return o.user=d.user,await this._saveSession(o),await this._notifyAllSubscribers("USER_UPDATED",o),{data:{user:o.user},error:null}})}catch(r){if(w(r))return{data:{user:null},error:r};throw r}}async setSession(e){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._setSession(e))}async _setSession(e){try{if(!e.access_token||!e.refresh_token)throw new re;const t=Date.now()/1e3;let r=t,n=!0,s=null;const{payload:o}=ct(e.access_token);if(o.exp&&(r=o.exp,n=r<=t),n){const{data:a,error:l}=await this._callRefreshToken(e.refresh_token);if(l)return{data:{user:null,session:null},error:l};if(!a)return{data:{user:null,session:null},error:null};s=a}else{const{data:a,error:l}=await this._getUser(e.access_token);if(l)throw l;s={access_token:e.access_token,refresh_token:e.refresh_token,user:a.user,token_type:"bearer",expires_in:r-t,expires_at:r},await this._saveSession(s),await this._notifyAllSubscribers("SIGNED_IN",s)}return{data:{user:s.user,session:s},error:null}}catch(t){if(w(t))return{data:{session:null,user:null},error:t};throw t}}async refreshSession(e){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._refreshSession(e))}async _refreshSession(e){try{return await this._useSession(async t=>{var r;if(!e){const{data:o,error:a}=t;if(a)throw a;e=(r=o.session)!==null&&r!==void 0?r:void 0}if(!e?.refresh_token)throw new re;const{data:n,error:s}=await this._callRefreshToken(e.refresh_token);return s?{data:{user:null,session:null},error:s}:n?{data:{user:n.user,session:n},error:null}:{data:{user:null,session:null},error:null}})}catch(t){if(w(t))return{data:{user:null,session:null},error:t};throw t}}async _getSessionFromURL(e,t){try{if(!M())throw new Ye("No browser detected.");if(e.error||e.error_description||e.error_code)throw new Ye(e.error_description||"Error in URL with unspecified error_description",{error:e.error||"unspecified_error",code:e.error_code||"unspecified_code"});switch(t){case"implicit":if(this.flowType==="pkce")throw new Gt("Not a valid PKCE flow url.");break;case"pkce":if(this.flowType==="implicit")throw new Ye("Not a valid implicit grant flow url.");break;default:}if(t==="pkce"){if(this._debug("#_initialize()","begin","is PKCE flow",!0),!e.code)throw new Gt("No code detected.");const{data:b,error:v}=await this._exchangeCodeForSession(e.code);if(v)throw v;const k=new URL(window.location.href);return k.searchParams.delete("code"),window.history.replaceState(window.history.state,"",k.toString()),{data:{session:b.session,redirectType:null},error:null}}const{provider_token:r,provider_refresh_token:n,access_token:s,refresh_token:o,expires_in:a,expires_at:l,token_type:d}=e;if(!s||!a||!o||!d)throw new Ye("No session defined in URL");const c=Math.round(Date.now()/1e3),u=parseInt(a);let h=c+u;l&&(h=parseInt(l)),(h-c)*1e3<=Te;const g=h-u;c-g>=120||c-g<0;const{data:m,error:f}=await this._getUser(s);if(f)throw f;const _={provider_token:r,provider_refresh_token:n,access_token:s,expires_in:u,expires_at:h,refresh_token:o,token_type:d,user:m.user};return window.location.hash="",this._debug("#_getSessionFromURL()","clearing window.location.hash"),{data:{session:_,redirectType:e.type},error:null}}catch(r){if(w(r))return{data:{session:null,redirectType:null},error:r};throw r}}_isImplicitGrantCallback(e){return!!(e.access_token||e.error_description)}async _isPKCECallback(e){const t=await ae(this.storage,`${this.storageKey}-code-verifier`);return!!(e.code&&t)}async signOut(e={scope:"global"}){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._signOut(e))}async _signOut({scope:e}={scope:"global"}){return await this._useSession(async t=>{var r;const{data:n,error:s}=t;if(s)return{error:s};const o=(r=n.session)===null||r===void 0?void 0:r.access_token;if(o){const{error:a}=await this.admin.signOut(o,e);if(a&&!(hn(a)&&(a.status===404||a.status===401||a.status===403)))return{error:a}}return e!=="others"&&(await this._removeSession(),await te(this.storage,`${this.storageKey}-code-verifier`)),{error:null}})}onAuthStateChange(e){const t=xn(),r={id:t,callback:e,unsubscribe:()=>{this._debug("#unsubscribe()","state change callback with id removed",t),this.stateChangeEmitters.delete(t)}};return this._debug("#onAuthStateChange()","registered callback with id",t),this.stateChangeEmitters.set(t,r),(async()=>(await this.initializePromise,await this._acquireLock(-1,async()=>{this._emitInitialSession(t)})))(),{data:{subscription:r}}}async _emitInitialSession(e){return await this._useSession(async t=>{var r,n;try{const{data:{session:s},error:o}=t;if(o)throw o;await((r=this.stateChangeEmitters.get(e))===null||r===void 0?void 0:r.callback("INITIAL_SESSION",s)),this._debug("INITIAL_SESSION","callback id",e,"session",s)}catch(s){await((n=this.stateChangeEmitters.get(e))===null||n===void 0?void 0:n.callback("INITIAL_SESSION",null)),this._debug("INITIAL_SESSION","callback id",e,"error",s)}})}async resetPasswordForEmail(e,t={}){let r=null,n=null;this.flowType==="pkce"&&([r,n]=await _e(this.storage,this.storageKey,!0));try{return await x(this.fetch,"POST",`${this.url}/recover`,{body:{email:e,code_challenge:r,code_challenge_method:n,gotrue_meta_security:{captcha_token:t.captchaToken}},headers:this.headers,redirectTo:t.redirectTo})}catch(s){if(w(s))return{data:null,error:s};throw s}}async getUserIdentities(){var e;try{const{data:t,error:r}=await this.getUser();if(r)throw r;return{data:{identities:(e=t.user.identities)!==null&&e!==void 0?e:[]},error:null}}catch(t){if(w(t))return{data:null,error:t};throw t}}async linkIdentity(e){return"token"in e?this.linkIdentityIdToken(e):this.linkIdentityOAuth(e)}async linkIdentityOAuth(e){var t;try{const{data:r,error:n}=await this._useSession(async s=>{var o,a,l,d,c;const{data:u,error:h}=s;if(h)throw h;const p=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,e.provider,{redirectTo:(o=e.options)===null||o===void 0?void 0:o.redirectTo,scopes:(a=e.options)===null||a===void 0?void 0:a.scopes,queryParams:(l=e.options)===null||l===void 0?void 0:l.queryParams,skipBrowserRedirect:!0});return await x(this.fetch,"GET",p,{headers:this.headers,jwt:(c=(d=u.session)===null||d===void 0?void 0:d.access_token)!==null&&c!==void 0?c:void 0})});if(n)throw n;return M()&&!(!((t=e.options)===null||t===void 0)&&t.skipBrowserRedirect)&&window.location.assign(r?.url),{data:{provider:e.provider,url:r?.url},error:null}}catch(r){if(w(r))return{data:{provider:e.provider,url:null},error:r};throw r}}async linkIdentityIdToken(e){return await this._useSession(async t=>{var r;try{const{error:n,data:{session:s}}=t;if(n)throw n;const{options:o,provider:a,token:l,access_token:d,nonce:c}=e,u=await x(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:(r=s?.access_token)!==null&&r!==void 0?r:void 0,body:{provider:a,id_token:l,access_token:d,nonce:c,link_identity:!0,gotrue_meta_security:{captcha_token:o?.captchaToken}},xform:D}),{data:h,error:p}=u;return p?{data:{user:null,session:null},error:p}:!h||!h.session||!h.user?{data:{user:null,session:null},error:new xe}:(h.session&&(await this._saveSession(h.session),await this._notifyAllSubscribers("USER_UPDATED",h.session)),{data:h,error:p})}catch(n){if(w(n))return{data:{user:null,session:null},error:n};throw n}})}async unlinkIdentity(e){try{return await this._useSession(async t=>{var r,n;const{data:s,error:o}=t;if(o)throw o;return await x(this.fetch,"DELETE",`${this.url}/user/identities/${e.identity_id}`,{headers:this.headers,jwt:(n=(r=s.session)===null||r===void 0?void 0:r.access_token)!==null&&n!==void 0?n:void 0})})}catch(t){if(w(t))return{data:null,error:t};throw t}}async _refreshAccessToken(e){const t=`#_refreshAccessToken(${e.substring(0,5)}...)`;this._debug(t,"begin");try{const r=Date.now();return await Sn(async n=>(n>0&&await En(200*Math.pow(2,n-1)),this._debug(t,"refreshing attempt",n),await x(this.fetch,"POST",`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:D})),(n,s)=>{const o=200*Math.pow(2,n);return s&&dt(s)&&Date.now()+o-r<Te})}catch(r){if(this._debug(t,"error",r),w(r))return{data:{session:null,user:null},error:r};throw r}finally{this._debug(t,"end")}}_isValidSession(e){return typeof e=="object"&&e!==null&&"access_token"in e&&"refresh_token"in e&&"expires_at"in e}async _handleProviderSignIn(e,t){const r=await this._getUrlForProvider(`${this.url}/authorize`,e,{redirectTo:t.redirectTo,scopes:t.scopes,queryParams:t.queryParams});return this._debug("#_handleProviderSignIn()","provider",e,"options",t,"url",r),M()&&!t.skipBrowserRedirect&&window.location.assign(r),{data:{provider:e,url:r},error:null}}async _recoverAndRefresh(){var e,t;const r="#_recoverAndRefresh()";this._debug(r,"begin");try{const n=await ae(this.storage,this.storageKey);if(n&&this.userStorage){let o=await ae(this.userStorage,this.storageKey+"-user");!this.storage.isServer&&Object.is(this.storage,this.userStorage)&&!o&&(o={user:n.user},await Ae(this.userStorage,this.storageKey+"-user",o)),n.user=(e=o?.user)!==null&&e!==void 0?e:ut()}else if(n&&!n.user&&!n.user){const o=await ae(this.storage,this.storageKey+"-user");o&&o?.user?(n.user=o.user,await te(this.storage,this.storageKey+"-user"),await Ae(this.storage,this.storageKey,n)):n.user=ut()}if(this._debug(r,"session from storage",n),!this._isValidSession(n)){this._debug(r,"session is not valid"),n!==null&&await this._removeSession();return}const s=((t=n.expires_at)!==null&&t!==void 0?t:1/0)*1e3-Date.now()<lt;if(this._debug(r,`session has${s?"":" not"} expired with margin of ${lt}s`),s){if(this.autoRefreshToken&&n.refresh_token){const{error:o}=await this._callRefreshToken(n.refresh_token);o&&(dt(o)||(this._debug(r,"refresh failed with a non-retryable error, removing the session",o),await this._removeSession()))}}else if(n.user&&n.user.__isUserNotAvailableProxy===!0)try{const{data:o,error:a}=await this._getUser(n.access_token);!a&&o?.user?(n.user=o.user,await this._saveSession(n),await this._notifyAllSubscribers("SIGNED_IN",n)):this._debug(r,"could not get user data, skipping SIGNED_IN notification")}catch(o){this._debug(r,"error getting user data, skipping SIGNED_IN notification",o)}else await this._notifyAllSubscribers("SIGNED_IN",n)}catch(n){this._debug(r,"error",n);return}finally{this._debug(r,"end")}}async _callRefreshToken(e){var t,r;if(!e)throw new re;if(this.refreshingDeferred)return this.refreshingDeferred.promise;const n=`#_callRefreshToken(${e.substring(0,5)}...)`;this._debug(n,"begin");try{this.refreshingDeferred=new rt;const{data:s,error:o}=await this._refreshAccessToken(e);if(o)throw o;if(!s.session)throw new re;await this._saveSession(s.session),await this._notifyAllSubscribers("TOKEN_REFRESHED",s.session);const a={data:s.session,error:null};return this.refreshingDeferred.resolve(a),a}catch(s){if(this._debug(n,"error",s),w(s)){const o={data:null,error:s};return dt(s)||await this._removeSession(),(t=this.refreshingDeferred)===null||t===void 0||t.resolve(o),o}throw(r=this.refreshingDeferred)===null||r===void 0||r.reject(s),s}finally{this.refreshingDeferred=null,this._debug(n,"end")}}async _notifyAllSubscribers(e,t,r=!0){const n=`#_notifyAllSubscribers(${e})`;this._debug(n,"begin",t,`broadcast = ${r}`);try{this.broadcastChannel&&r&&this.broadcastChannel.postMessage({event:e,session:t});const s=[],o=Array.from(this.stateChangeEmitters.values()).map(async a=>{try{await a.callback(e,t)}catch(l){s.push(l)}});if(await Promise.all(o),s.length>0){for(let a=0;a<s.length;a+=1);throw s[0]}}finally{this._debug(n,"end")}}async _saveSession(e){this._debug("#_saveSession()",e),this.suppressGetSessionWarning=!0;const t=Object.assign({},e),r=t.user&&t.user.__isUserNotAvailableProxy===!0;if(this.userStorage){!r&&t.user&&await Ae(this.userStorage,this.storageKey+"-user",{user:t.user});const n=Object.assign({},t);delete n.user;const s=Qt(n);await Ae(this.storage,this.storageKey,s)}else{const n=Qt(t);await Ae(this.storage,this.storageKey,n)}}async _removeSession(){this._debug("#_removeSession()"),await te(this.storage,this.storageKey),await te(this.storage,this.storageKey+"-code-verifier"),await te(this.storage,this.storageKey+"-user"),this.userStorage&&await te(this.userStorage,this.storageKey+"-user"),await this._notifyAllSubscribers("SIGNED_OUT",null)}_removeVisibilityChangedCallback(){this._debug("#_removeVisibilityChangedCallback()");const e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&M()&&window?.removeEventListener&&window.removeEventListener("visibilitychange",e)}catch{}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug("#_startAutoRefresh()");const e=setInterval(()=>this._autoRefreshTokenTick(),Te);this.autoRefreshTicker=e,e&&typeof e=="object"&&typeof e.unref=="function"?e.unref():typeof Deno<"u"&&typeof Deno.unrefTimer=="function"&&Deno.unrefTimer(e),setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0)}async _stopAutoRefresh(){this._debug("#_stopAutoRefresh()");const e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async _autoRefreshTokenTick(){this._debug("#_autoRefreshTokenTick()","begin");try{await this._acquireLock(0,async()=>{try{const e=Date.now();try{return await this._useSession(async t=>{const{data:{session:r}}=t;if(!r||!r.refresh_token||!r.expires_at){this._debug("#_autoRefreshTokenTick()","no session");return}const n=Math.floor((r.expires_at*1e3-e)/Te);this._debug("#_autoRefreshTokenTick()",`access token expires in ${n} ticks, a tick lasts ${Te}ms, refresh threshold is ${xt} ticks`),n<=xt&&await this._callRefreshToken(r.refresh_token)})}catch{}}finally{this._debug("#_autoRefreshTokenTick()","end")}})}catch(e){if(e.isAcquireTimeout||e instanceof Ar)this._debug("auto refresh token tick lock not available");else throw e}}async _handleVisibilityChange(){if(this._debug("#_handleVisibilityChange()"),!M()||!window?.addEventListener)return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>await this._onVisibilityChanged(!1),window?.addEventListener("visibilitychange",this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch{}}async _onVisibilityChanged(e){const t=`#_onVisibilityChanged(${e})`;this._debug(t,"visibilityState",document.visibilityState),document.visibilityState==="visible"?(this.autoRefreshToken&&this._startAutoRefresh(),e||(await this.initializePromise,await this._acquireLock(-1,async()=>{if(document.visibilityState!=="visible"){this._debug(t,"acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");return}await this._recoverAndRefresh()}))):document.visibilityState==="hidden"&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(e,t,r){const n=[`provider=${encodeURIComponent(t)}`];if(r?.redirectTo&&n.push(`redirect_to=${encodeURIComponent(r.redirectTo)}`),r?.scopes&&n.push(`scopes=${encodeURIComponent(r.scopes)}`),this.flowType==="pkce"){const[s,o]=await _e(this.storage,this.storageKey),a=new URLSearchParams({code_challenge:`${encodeURIComponent(s)}`,code_challenge_method:`${encodeURIComponent(o)}`});n.push(a.toString())}if(r?.queryParams){const s=new URLSearchParams(r.queryParams);n.push(s.toString())}return r?.skipBrowserRedirect&&n.push(`skip_http_redirect=${r.skipBrowserRedirect}`),`${e}?${n.join("&")}`}async _unenroll(e){try{return await this._useSession(async t=>{var r;const{data:n,error:s}=t;return s?{data:null,error:s}:await x(this.fetch,"DELETE",`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:(r=n?.session)===null||r===void 0?void 0:r.access_token})})}catch(t){if(w(t))return{data:null,error:t};throw t}}async _enroll(e){try{return await this._useSession(async t=>{var r,n;const{data:s,error:o}=t;if(o)return{data:null,error:o};const a=Object.assign({friendly_name:e.friendlyName,factor_type:e.factorType},e.factorType==="phone"?{phone:e.phone}:e.factorType==="totp"?{issuer:e.issuer}:{}),{data:l,error:d}=await x(this.fetch,"POST",`${this.url}/factors`,{body:a,headers:this.headers,jwt:(r=s?.session)===null||r===void 0?void 0:r.access_token});return d?{data:null,error:d}:(e.factorType==="totp"&&l.type==="totp"&&(!((n=l?.totp)===null||n===void 0)&&n.qr_code)&&(l.totp.qr_code=`data:image/svg+xml;utf-8,${l.totp.qr_code}`),{data:l,error:null})})}catch(t){if(w(t))return{data:null,error:t};throw t}}async _verify(e){return this._acquireLock(-1,async()=>{try{return await this._useSession(async t=>{var r;const{data:n,error:s}=t;if(s)return{data:null,error:s};const o=Object.assign({challenge_id:e.challengeId},"webauthn"in e?{webauthn:Object.assign(Object.assign({},e.webauthn),{credential_response:e.webauthn.type==="create"?rs(e.webauthn.credential_response):is(e.webauthn.credential_response)})}:{code:e.code}),{data:a,error:l}=await x(this.fetch,"POST",`${this.url}/factors/${e.factorId}/verify`,{body:o,headers:this.headers,jwt:(r=n?.session)===null||r===void 0?void 0:r.access_token});return l?{data:null,error:l}:(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+a.expires_in},a)),await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED",a),{data:a,error:l})})}catch(t){if(w(t))return{data:null,error:t};throw t}})}async _challenge(e){return this._acquireLock(-1,async()=>{try{return await this._useSession(async t=>{var r;const{data:n,error:s}=t;if(s)return{data:null,error:s};const o=await x(this.fetch,"POST",`${this.url}/factors/${e.factorId}/challenge`,{body:e,headers:this.headers,jwt:(r=n?.session)===null||r===void 0?void 0:r.access_token});if(o.error)return o;const{data:a}=o;if(a.type!=="webauthn")return{data:a,error:null};switch(a.webauthn.type){case"create":return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:es(a.webauthn.credential_options.publicKey)})})}),error:null};case"request":return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:ts(a.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(t){if(w(t))return{data:null,error:t};throw t}})}async _challengeAndVerify(e){const{data:t,error:r}=await this._challenge({factorId:e.factorId});return r?{data:null,error:r}:await this._verify({factorId:e.factorId,challengeId:t.id,code:e.code})}async _listFactors(){var e;const{data:{user:t},error:r}=await this.getUser();if(r)return{data:null,error:r};const n={all:[],phone:[],totp:[],webauthn:[]};for(const s of(e=t?.factors)!==null&&e!==void 0?e:[])n.all.push(s),s.status==="verified"&&n[s.factor_type].push(s);return{data:n,error:null}}async _getAuthenticatorAssuranceLevel(){return this._acquireLock(-1,async()=>await this._useSession(async e=>{var t,r;const{data:{session:n},error:s}=e;if(s)return{data:null,error:s};if(!n)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};const{payload:o}=ct(n.access_token);let a=null;o.aal&&(a=o.aal);let l=a;((r=(t=n.user.factors)===null||t===void 0?void 0:t.filter(u=>u.status==="verified"))!==null&&r!==void 0?r:[]).length>0&&(l="aal2");const c=o.amr||[];return{data:{currentLevel:a,nextLevel:l,currentAuthenticationMethods:c},error:null}}))}async fetchJwk(e,t={keys:[]}){let r=t.keys.find(a=>a.kid===e);if(r)return r;const n=Date.now();if(r=this.jwks.keys.find(a=>a.kid===e),r&&this.jwks_cached_at+cn>n)return r;const{data:s,error:o}=await x(this.fetch,"GET",`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(o)throw o;return!s.keys||s.keys.length===0||(this.jwks=s,this.jwks_cached_at=n,r=s.keys.find(a=>a.kid===e),!r)?null:r}async getClaims(e,t={}){try{let r=e;if(!r){const{data:p,error:g}=await this.getSession();if(g||!p.session)return{data:null,error:g};r=p.session.access_token}const{header:n,payload:s,signature:o,raw:{header:a,payload:l}}=ct(r);t?.allowExpired||Pn(s.exp);const d=!n.alg||n.alg.startsWith("HS")||!n.kid||!("crypto"in globalThis&&"subtle"in globalThis.crypto)?null:await this.fetchJwk(n.kid,t?.keys?{keys:t.keys}:t?.jwks);if(!d){const{error:p}=await this.getUser(r);if(p)throw p;return{data:{claims:s,header:n,signature:o},error:null}}const c=Rn(n.alg),u=await crypto.subtle.importKey("jwk",d,c,!0,["verify"]);if(!await crypto.subtle.verify(c,u,o,bn(`${a}.${l}`)))throw new Et("Invalid JWT signature");return{data:{claims:s,header:n,signature:o},error:null}}catch(r){if(w(r))return{data:null,error:r};throw r}}}qe.nextInstanceID=0;const hs=qe;class ps extends hs{constructor(e){super(e)}}var gs=function(i,e,t,r){function n(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(c){try{d(r.next(c))}catch(u){o(u)}}function l(c){try{d(r.throw(c))}catch(u){o(u)}}function d(c){c.done?s(c.value):n(c.value).then(a,l)}d((r=r.apply(i,e||[])).next())})};class fs{constructor(e,t,r){var n,s,o;this.supabaseUrl=e,this.supabaseKey=t;const a=sn(e);if(!t)throw new Error("supabaseKey is required.");this.realtimeUrl=new URL("realtime/v1",a),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace("http","ws"),this.authUrl=new URL("auth/v1",a),this.storageUrl=new URL("storage/v1",a),this.functionsUrl=new URL("functions/v1",a);const l=`sb-${a.hostname.split(".")[0]}-auth-token`,d={db:Vi,realtime:Yi,auth:Object.assign(Object.assign({},Ji),{storageKey:l}),global:Ki},c=nn(r??{},d);this.storageKey=(n=c.auth.storageKey)!==null&&n!==void 0?n:"",this.headers=(s=c.global.headers)!==null&&s!==void 0?s:{},c.accessToken?(this.accessToken=c.accessToken,this.auth=new Proxy({},{get:(u,h)=>{throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(h)} is not possible`)}})):this.auth=this._initSupabaseAuthClient((o=c.auth)!==null&&o!==void 0?o:{},this.headers,c.global.fetch),this.fetch=en(t,this._getAccessToken.bind(this),c.global.fetch),this.realtime=this._initRealtimeClient(Object.assign({headers:this.headers,accessToken:this._getAccessToken.bind(this)},c.realtime)),this.rest=new ci(new URL("rest/v1",a).href,{headers:this.headers,schema:c.db.schema,fetch:this.fetch}),this.storage=new Hi(this.storageUrl.href,this.headers,this.fetch,r?.storage),c.accessToken||this._listenForAuthEvents()}get functions(){return new Zr(this.functionsUrl.href,{headers:this.headers,customFetch:this.fetch})}from(e){return this.rest.from(e)}schema(e){return this.rest.schema(e)}rpc(e,t={},r={head:!1,get:!1,count:void 0}){return this.rest.rpc(e,t,r)}channel(e,t={config:{}}){return this.realtime.channel(e,t)}getChannels(){return this.realtime.getChannels()}removeChannel(e){return this.realtime.removeChannel(e)}removeAllChannels(){return this.realtime.removeAllChannels()}_getAccessToken(){return gs(this,void 0,void 0,function*(){var e,t;if(this.accessToken)return yield this.accessToken();const{data:r}=yield this.auth.getSession();return(t=(e=r.session)===null||e===void 0?void 0:e.access_token)!==null&&t!==void 0?t:this.supabaseKey})}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:t,detectSessionInUrl:r,storage:n,userStorage:s,storageKey:o,flowType:a,lock:l,debug:d},c,u){const h={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new ps({url:this.authUrl.href,headers:Object.assign(Object.assign({},h),c),storageKey:o,autoRefreshToken:e,persistSession:t,detectSessionInUrl:r,storage:n,userStorage:s,flowType:a,lock:l,debug:d,fetch:u,hasCustomAuthorizationHeader:Object.keys(this.headers).some(p=>p.toLowerCase()==="authorization")})}_initRealtimeClient(e){return new Ai(this.realtimeUrl.href,Object.assign(Object.assign({},e),{params:Object.assign({apikey:this.supabaseKey},e?.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((t,r)=>{this._handleTokenChanged(t,"CLIENT",r?.access_token)})}_handleTokenChanged(e,t,r){(e==="TOKEN_REFRESHED"||e==="SIGNED_IN")&&this.changedAccessToken!==r?(this.changedAccessToken=r,this.realtime.setAuth(r)):e==="SIGNED_OUT"&&(this.realtime.setAuth(),t=="STORAGE"&&this.auth.signOut(),this.changedAccessToken=void 0)}}const ms=(i,e,t)=>new fs(i,e,t);function ys(){if(typeof window<"u"||typeof process>"u")return!1;const i=process.version;if(i==null)return!1;const e=i.match(/^v(\d+)\./);return e?parseInt(e[1],10)<=18:!1}ys();const vs="https://skfdhfrfmorubqembaxt.supabase.co",bs="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrZmRoZnJmbW9ydWJxZW1iYXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNzI1ODIsImV4cCI6MjA3NTY0ODU4Mn0.s_Map7hVADaxZ_lM0XXX2A4o1A_TcxwXn1mMqr34A1M",y=ms(vs,bs,{auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!1,storage:window.localStorage},db:{schema:"public"},global:{headers:{"X-Client-Info":"quarry-madness-scorekeeper"}}});class ws{constructor(){this.currentUser=null,this.currentSession=null,this.listeners=[],this.isInitialized=!1}async init(){if(this.isInitialized)return;const{data:{session:e}}=await y.auth.getSession();e&&(this.currentSession=e,this.currentUser=e.user,this.notifyListeners("SIGNED_IN",e)),y.auth.onAuthStateChange((t,r)=>{this.currentSession=r,this.currentUser=r?.user||null,this.notifyListeners(t,r)}),this.isInitialized=!0}async signIn(e,t,r){try{if(!e||!t)return{success:!1,error:"Team ID and password are required"};if(!r)return{success:!1,error:"Please complete the verification challenge"};const n=`${e}@quarrymadness.local`,{data:s,error:o}=await y.auth.signInWithPassword({email:n,password:t});return o?{success:!1,error:o.message}:(s.session&&(this.currentSession=s.session,this.currentUser=s.user),{success:!0})}catch{return{success:!1,error:"An unexpected error occurred"}}}async signOut(){try{const{error:e}=await y.auth.signOut();return e?{success:!1,error:e.message}:(this.currentSession=null,this.currentUser=null,{success:!0})}catch{return{success:!1,error:"An unexpected error occurred"}}}isAuthenticated(){return!!this.currentSession&&!!this.currentUser}getUser(){return this.currentUser}getSession(){return this.currentSession}async getTeamData(){if(!this.isAuthenticated())return null;try{const{data:e,error:t}=await y.from("teams").select("*").eq("auth_user_id",this.currentUser.id).single();return t?null:e}catch{return null}}onAuthStateChange(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}notifyListeners(e,t){this.listeners.forEach(r=>{try{r(e,t)}catch{}})}async refreshSession(){try{const{data:{session:e},error:t}=await y.auth.refreshSession();if(t)throw t;return this.currentSession=e,this.currentUser=e?.user||null,e}catch{return null}}}const W=new ws;class xs{constructor(){this.container=null,this.toasts=[]}init(){this.container||(this.container=document.createElement("div"),this.container.id="toast-container",this.container.style.cssText=`
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-width: 280px;
    `,document.body.appendChild(this.container))}show(e,t="info",r=5e3){this.init();const n=document.createElement("div");n.className="toast";const s={success:{bg:"#d4edda",border:"#c3e6cb",text:"#155724"},error:{bg:"#f8d7da",border:"#f5c6cb",text:"#721c24"},warning:{bg:"#fff3cd",border:"#ffeeba",text:"#856404"},info:{bg:"#d1ecf1",border:"#bee5eb",text:"#0c5460"}},o=s[t]||s.info;return n.style.cssText=`
      background-color: ${o.bg};
      border: 1px solid ${o.border};
      border-radius: 4px;
      padding: 8px 12px;
      color: ${o.text};
      font-size: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      animation: slideInBottom 0.3s ease;
      cursor: pointer;
      opacity: 0.95;
    `,n.textContent=e,n.onclick=()=>this.remove(n),this.container.appendChild(n),this.toasts.push(n),r>0&&setTimeout(()=>this.remove(n),r),n}remove(e){e.style.animation="slideOutBottom 0.3s ease",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e),this.toasts=this.toasts.filter(t=>t!==e)},300)}clearAll(){this.toasts.forEach(e=>this.remove(e))}}const it=new xs;function j(i,e){return it.show(i,"success",e)}function E(i,e){return it.show(i,"error",e)}function nr(i,e){return it.show(i,"warning",e)}function _s(i,e){return it.show(i,"info",e)}class ks{constructor(){this.overlay=null,this.isLoading=!1}show(e="Loading..."){if(this.isLoading)return;this.overlay=document.createElement("div"),this.overlay.id="loading-overlay",this.overlay.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;const t=document.createElement("div");t.style.cssText=`
      background-color: white;
      border-radius: 6px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `,t.innerHTML=`
      <div style="
        border: 4px solid #f3f3f3;
        border-top: 4px solid #ff0046;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      "></div>
      <div style="color: #24292e; font-size: 14px;">${e}</div>
    `,this.overlay.appendChild(t),document.body.appendChild(this.overlay),this.isLoading=!0}hide(){this.overlay&&this.overlay.parentNode&&this.overlay.parentNode.removeChild(this.overlay),this.overlay=null,this.isLoading=!1}}const Or=new ks;function ne(i){Or.show(i)}function L(){Or.hide()}function Es(){if(document.getElementById("ui-helpers-styles"))return;const i=document.createElement("style");i.id="ui-helpers-styles",i.textContent=`
    @keyframes slideInBottom {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes slideOutBottom {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(20px);
        opacity: 0;
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,document.head.appendChild(i)}typeof document<"u"&&Es();function Ss(){const i=document.querySelector("#app");i.innerHTML=`
    <div class="min-h-screen flex items-center justify-center" style="padding: 20px;">
      <div class="card" style="max-width: 450px; width: 100%;">
        <!-- CAWA Logo -->
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" style="height: 80px; margin: 0 auto;" />
          <h1 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-top: 16px;">
            Quarry Madness
          </h1>
          <p style="color: var(--text-secondary); font-size: 14px; margin-top: 8px;">
            Team Sign In
          </p>
        </div>

        <!-- Login Form -->
        <form id="login-form" style="margin-bottom: 24px;">
          <!-- Team ID Input -->
          <div style="margin-bottom: 16px;">
            <label for="team-id" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
              Team ID
            </label>
            <input
              type="text"
              id="team-id"
              name="team-id"
              placeholder="team_001"
              required
              autocomplete="username"
              style="
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--border-primary);
                border-radius: 6px;
                font-size: 14px;
                box-sizing: border-box;
                background-color: var(--bg-secondary);
              "
            />
          </div>

          <!-- Password Input -->
          <div style="margin-bottom: 16px;">
            <label for="password" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
              Password
            </label>
            <div style="position: relative;">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your team password"
                required
                autocomplete="current-password"
                style="
                  width: 100%;
                  padding: 8px 40px 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                  background-color: var(--bg-secondary);
                "
              />
              <button
                type="button"
                id="toggle-password"
                style="
                  position: absolute;
                  right: 8px;
                  top: 50%;
                  transform: translateY(-50%);
                  background: none;
                  border: none;
                  color: var(--text-secondary);
                  cursor: pointer;
                  padding: 4px 8px;
                  font-size: 12px;
                  font-weight: 500;
                "
              >
                Show
              </button>
            </div>
          </div>

          <!-- Cloudflare Turnstile Widget -->
          <div style="margin-bottom: 16px;">
            <div id="turnstile-widget"></div>
          </div>

          <!-- Error Message Container -->
          <div id="login-error" style="margin-bottom: 16px;"></div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary"
            style="width: 100%; padding: 10px; font-size: 16px;"
          >
            Sign In
          </button>
        </form>

        <!-- Back to Home Link -->
        <div style="text-align: center;">
          <a
            href="#/"
            style="color: var(--color-tertiary); text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  `,Ts(),As()}function Ts(){const i="0x4AAAAAAB5xR2YjqecWsKNH",e=setInterval(()=>{if(window.turnstile){clearInterval(e);try{window.turnstile.render("#turnstile-widget",{sitekey:i,theme:"light",callback:t=>{window.turnstileToken=t},"error-callback":()=>{E("Verification failed. Please refresh and try again.")}})}catch{document.getElementById("turnstile-widget").innerHTML=`
          <div style="
            padding: 12px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            color: #721c24;
            font-size: 14px;
          ">
            [Error] Failed to load verification widget
          </div>
        `}}},100);setTimeout(()=>{clearInterval(e),window.turnstile||(document.getElementById("turnstile-widget").innerHTML=`
        <div style="
          padding: 12px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          color: #721c24;
          font-size: 14px;
        ">
          [Error] Verification widget failed to load. Please check your connection.
        </div>
      `)},1e4)}function As(){const i=document.getElementById("login-form"),e=document.getElementById("login-error"),t=document.getElementById("password"),r=document.getElementById("toggle-password");r.addEventListener("click",()=>{t.getAttribute("type")==="password"?(t.setAttribute("type","text"),r.textContent="Hide"):(t.setAttribute("type","password"),r.textContent="Show")}),i.addEventListener("submit",async n=>{n.preventDefault(),e.innerHTML="";const s=document.getElementById("team-id").value.trim(),o=document.getElementById("password").value;if(!s||!o){e.innerHTML=`
        <div style="
          padding: 12px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          color: #721c24;
          font-size: 14px;
        ">
          [Error] Please enter both Team ID and Password
        </div>
      `;return}const a=window.turnstileToken||"dev-mode-token";ne("Signing in...");try{const l=await W.signIn(s,o,a);if(L(),!l.success){if(e.innerHTML=`
          <div style="
            padding: 12px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            color: #721c24;
            font-size: 14px;
          ">
            [Error] ${l.error||"Login failed. Please check your credentials."}
          </div>
        `,window.turnstile)try{window.turnstile.reset(),window.turnstileToken=null}catch{}}}catch{if(L(),e.innerHTML=`
        <div style="
          padding: 12px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          color: #721c24;
          font-size: 14px;
        ">
          [Error] An unexpected error occurred. Please try again.
        </div>
      `,window.turnstile)try{window.turnstile.reset(),window.turnstileToken=null}catch{}}})}const sr=[1,.75,.5,.25,0];function Pr(i){if(i<1)return 0;const e=Math.min(i-1,sr.length-1);return sr[e]}function Cs(i,e,t=!1){if(i===0||e<1||e>4)return 0;const r=Pr(e);let n=i*r;return t&&(n=n*1.5),Math.round(n)}async function $s(i){try{const{data:e,error:t}=await y.from("active_team_nudges").select("*").eq("team_id",i).order("sent_at",{ascending:!1}).limit(1);if(t)throw t;return e&&e.length>0?e[0]:null}catch{return null}}async function Is(i,e){try{const{data:t,error:r}=await y.from("team_scores").select("team_id, team_name, total_points, category").eq("category",e).order("total_points",{ascending:!1});if(r)throw r;const n=t.slice(0,3),s=t.findIndex(l=>l.team_id===i),o=s!==-1?s+1:null,a=t[s];return{top3:n,teamPosition:o,teamData:a,totalTeams:t.length}}catch{return null}}async function Os(i,e){try{const{error:t}=await y.from("nudge_dismissals").insert({nudge_id:i,team_id:e});if(t)throw t;return!0}catch(t){return t.code==="23505"?!0:(E("Failed to dismiss nudge"),!1)}}async function Rr(i){if(!i||!i.id)return"";const e=await $s(i.id);if(!e)return"";let t="";if(e.show_leaderboard){const s=await Is(i.id,i.category);s&&(t=Ps(s,i))}const r=e.nudge_type==="auto"?"rgba(102, 126, 234, 0.1)":"rgba(251, 191, 36, 0.1)",n=e.nudge_type==="auto"?"#667eea":"#fbbf24";return`
    <div
      id="nudge-banner-${e.id}"
      class="nudge-banner"
      style="
        background: ${r};
        border: 2px solid ${n};
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        position: relative;
      "
    >
      <!-- Close Button -->
      <button
        class="nudge-dismiss-btn"
        data-nudge-id="${e.id}"
        data-team-id="${i.id}"
        style="
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.1);
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.2s;
        "
        onmouseover="this.style.background='rgba(0, 0, 0, 0.2)'"
        onmouseout="this.style.background='rgba(0, 0, 0, 0.1)'"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <!-- Nudge Icon & Message -->
      <div style="display: flex; align-items: start; gap: 12px; margin-bottom: ${t?"16px":"0"};">
        <div style="flex-shrink: 0; margin-top: 2px;">
          ${e.nudge_type==="auto"?`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${n}" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          `:`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${n}" stroke="${n}" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          `}
        </div>
        <div style="flex: 1; padding-right: 24px;">
          <div style="color: var(--text-primary); font-size: 15px; font-weight: 500; line-height: 1.5;">
            ${e.message}
          </div>
          <div style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">
            ${new Date(e.sent_at).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}
          </div>
        </div>
      </div>

      <!-- Mini Leaderboard (if enabled) -->
      ${t}
    </div>
  `}function Ps(i,e){const{top3:t,teamPosition:r,teamData:n,totalTeams:s}=i,o=r&&r<=3;return`
    <div style="
      background: rgba(255, 255, 255, 0.5);
      border-radius: 6px;
      padding: 12px;
      margin-top: 12px;
    ">
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        color: var(--text-primary);
        font-weight: 600;
        font-size: 13px;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 20V10M12 20V4M6 20v-6"/>
        </svg>
        Current Standings - ${Rs(e.category)}
      </div>

      <!-- Top 3 Teams -->
      ${t.map((a,l)=>{const d=l===0?"🥇":l===1?"🥈":"🥉",c=a.team_id===e.id;return`
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px;
            border-radius: 4px;
            margin-bottom: 4px;
            background: ${c?"#fff":"transparent"};
            border: ${c?"1px solid #667eea":"1px solid transparent"};
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 18px;">${d}</span>
              <div>
                <div style="
                  color: var(--text-primary);
                  font-size: 14px;
                  font-weight: ${c?"600":"500"};
                ">
                  ${a.team_name}${c?" (You)":""}
                </div>
              </div>
            </div>
            <div style="
              color: var(--color-primary);
              font-weight: 600;
              font-size: 16px;
            ">
              ${a.total_points}
            </div>
          </div>
        `}).join("")}

      <!-- Current Team Position (if not in top 3) -->
      ${!o&&r?`
        <div style="
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        ">
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px;
            border-radius: 4px;
            background: rgba(102, 126, 234, 0.15);
            border: 1px solid #667eea;
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: var(--color-primary);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 600;
              ">
                ${r}
              </div>
              <div>
                <div style="color: var(--text-primary); font-size: 14px; font-weight: 600;">
                  ${n.team_name} (You)
                </div>
                <div style="color: var(--text-secondary); font-size: 11px;">
                  ${r} of ${s} teams
                </div>
              </div>
            </div>
            <div style="color: var(--color-primary); font-weight: 600; font-size: 16px;">
              ${n.total_points}
            </div>
          </div>
        </div>
      `:""}
    </div>
  `}function jr(){document.querySelectorAll(".nudge-dismiss-btn").forEach(i=>{i.addEventListener("click",async e=>{const t=e.currentTarget.getAttribute("data-nudge-id"),r=e.currentTarget.getAttribute("data-team-id");if(await Os(t,r)){const s=document.getElementById(`nudge-banner-${t}`);s&&(s.style.transition="opacity 0.3s, transform 0.3s",s.style.opacity="0",s.style.transform="translateY(-10px)",setTimeout(()=>{s.remove()},300))}})})}function Rs(i){return i?i.charAt(0).toUpperCase()+i.slice(1):""}let A={type:"all",gradeband:"all",hideZeroPoint:!1},Pe=[],pe=null,N=null,tt=[],Q=!1,F=new Set;async function nt(){try{const{data:i,error:e}=await y.from("competition_settings").select("is_open, competition_start, competition_end").single();if(e)return!1;const t=new Date,r=new Date(i.competition_start),n=new Date(i.competition_end),s=t>=r&&t<=n;return i.is_open||s}catch{return!1}}async function js(i,e,t){pe={team:i,climbers:e,climberScores:t},N=null,tt=[],Q=await nt(),await Ls();const r=t.reduce((a,l)=>a+(l?.total_points||0),0),n=t.reduce((a,l)=>a+(l?.route_ascents||0),0),s=await Rr(i),o=document.querySelector("#app");o.innerHTML=`
    <div class="min-h-screen">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold"> ${i.team_name}</h1>
            </div>
            <button id="back-to-dashboard" class="btn btn-header btn-sm btn-inline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container" style="padding-top: 16px; padding-bottom: 32px;">
        <!-- Subheader: team totals + status -->
        <div class="subheader">
          <div class="subheader-left" style="font-size: 13px; color: var(--text-secondary);">
            Team Total: <span class="metric">${r} pts</span> • ${n} sends
          </div>
          <span class="status-pill ${Q?"open":"closed"}">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            ${Q?"Open":"Closed"}
          </span>
        </div>

        <!-- Nudge Banner -->
        ${s}

        <!-- Climber Selection (Sticky) -->
        <div id="climber-selection-sticky" class="card" style="position: sticky; top: 0; z-index: 100; margin-bottom: 16px; padding: 12px; background-color: var(--bg-white); box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div id="climber-selection-header" style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
            Select Climber
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${e.map((a,l)=>{const d=t?.find(h=>h.climber_id===a.id),c=d?.total_points||0,u=d?.route_ascents||0;return`
                <button
                  class="climber-select-btn"
                  data-climber-id="${a.id}"
                  data-climber-index="${l}"
                  data-climber-name="${a.name}"
                  style="
                    padding: 12px;
                    background-color: var(--bg-secondary);
                    border: 2px solid var(--border-primary);
                    border-radius: 6px;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s;
                  "
                >
                  <div class="climber-name-full" style="font-weight: 600; font-size: 14px; color: var(--text-primary);">
                    ${a.name}
                  </div>
                  <div class="climber-score-display" style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
                    ${c} pts • ${u} ascents
                  </div>
                </button>
              `}).join("")}
          </div>
        </div>

        <!-- Filters -->
        <div class="card" style="margin-bottom: 16px; padding: 0;">
          <div class="card-header">
            <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">
              Filters
            </div>
            <button id="toggle-all-sectors" class="btn btn-secondary btn-sm btn-inline">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              Expand All Sections
            </button>
          </div>
          <div class="filters-grid" style="padding: 12px;">
            <!-- Search -->
            <input id="filter-search" class="form-input" placeholder="Search route or sector" style="width: 100%;" />
            <!-- Type Filter -->
            <select id="filter-type" class="form-input" style="width: 100%;">
              <option value="all">All Types</option>
              <option value="sport">Sport</option>
              <option value="trad">Trad</option>
              <option value="boulder">Boulder</option>
            </select>

            <!-- Grade Band Filter -->
            <select id="filter-gradeband" class="form-input" style="width: 100%;">
              <option value="all">All Grades</option>
              <option value="recreational">Recreational (≤19)</option>
              <option value="intermediate">Intermediate (20-23)</option>
              <option value="advanced">Advanced (24+)</option>
            </select>

            <!-- Hide Zero Points -->
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
              <input type="checkbox" id="filter-hide-zero" />
              Hide 0 pts routes
            </label>
          </div>
          <div class="filter-chips" style="padding: 0 12px 12px;">
            <div class="chips" id="filter-chips"></div>
            <div>
              <button id="clear-filters" class="btn btn-secondary btn-sm">Clear</button>
            </div>
          </div>
        </div>

        <!-- Routes List -->
        <div id="routes-container">
          ${Lr()}
        </div>
      </main>
    </div>
  `,Fs(),jr(),Ms()}async function Ls(){try{const{data:i,error:e}=await y.from("routes").select("*").order("sector_order",{ascending:!0}).order("route_order",{ascending:!0});if(e)throw e;Pe=i||[]}catch{E("Failed to load routes"),Pe=[]}}async function or(){try{const{data:i,error:e}=await y.from("climber_scores").select("*").in("climber_id",pe.climbers.map(t=>t.id));if(e)throw e;pe.climberScores=i||[],N&&await Br(N.id),Bs(),zs()}catch{}}function Bs(){document.querySelectorAll(".climber-select-btn").forEach(i=>{const e=i.getAttribute("data-climber-id"),t=pe.climberScores?.find(o=>o.climber_id===e),r=t?.total_points||0,n=t?.route_ascents||0,s=i.querySelector(".climber-score-display");s&&(s.textContent=`${r} pts • ${n} ascents`)})}function zs(){const i=pe.climberScores.reduce((r,n)=>r+(n?.total_points||0),0),e=pe.climberScores.reduce((r,n)=>r+(n?.route_ascents||0),0),t=document.querySelector(".subheader-left");t&&(t.innerHTML=`
      Team Total: <span class="metric">${i} pts</span> • ${e} sends
    `)}function Ms(){let i=!1;const e=document.getElementById("climber-selection-sticky"),t=document.getElementById("climber-selection-header");!e||!t||window.addEventListener("scroll",()=>{const r=window.scrollY||window.pageYOffset;r>100&&!i?(i=!0,t.style.display="none",document.querySelectorAll(".climber-select-btn").forEach(n=>{n.style.padding="8px";const s=n.querySelector(".climber-score-display");s&&(s.style.display="none")}),e.style.padding="8px 12px"):r<=100&&i&&(i=!1,t.style.display="block",document.querySelectorAll(".climber-select-btn").forEach(n=>{n.style.padding="12px";const s=n.querySelector(".climber-score-display");s&&(s.style.display="block")}),e.style.padding="12px")})}function Lr(){return Pe.length===0?`
      <div class="card" style="padding: 32px; text-align: center;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; color: var(--text-secondary);">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 8px;">
          No Routes Yet
        </h3>
        <p style="color: var(--text-secondary); font-size: 14px;">
          Routes will be imported before the competition starts.
        </p>
      </div>
    `:Ns()}function Ns(){const i=qs(Pe);if(i.length===0)return`
      <div class="card" style="padding: 24px; text-align: center;">
        <p style="color: var(--text-secondary);">No routes match current filters</p>
      </div>
    `;const e={};i.forEach(r=>{const n=r.sector||"Main Area";e[n]||(e[n]=[]),e[n].push(r)});let t="";return Object.entries(e).forEach(([r,n])=>{const s=F.has(r);t+=`
      <div class="card" style="margin-bottom: 16px; padding: 0; overflow: hidden;">
        <div class="sector-header" data-sector="${r}">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${s?'<polyline points="9 18 15 12 9 6"/>':'<polyline points="6 9 12 15 18 9"/>'}
            </svg>
            <div>
              <div style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0;">
                ${r}
                <span style="font-size: 16px; color: var(--text-secondary); margin-left: 0px;">
                  • ${n.length} routes
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="sector-routes" data-sector="${r}" style="padding: 8px; display: ${s?"none":"block"};">
          ${n.map(a=>Us(a)).join("")}
        </div>
      </div>
    `}),t}function Ds(i){const t=Math.min(i,4),r="#e91e63",n="#e1e4e8",s=[];for(let o=0;o<4;o++){const a=o*90-90,l=a+90,c=o<t?r:n,u=a*Math.PI/180,h=l*Math.PI/180,p=50+45*Math.cos(u),g=50+45*Math.sin(u),m=50+45*Math.cos(h),f=50+45*Math.sin(h);s.push(`
      <path d="M 50 50 L ${p} ${g} A 45 45 0 0 1 ${m} ${f} Z"
            fill="${c}"
            stroke="white"
            stroke-width="2"/>
    `)}return`
    <svg width="40" height="40" viewBox="0 0 100 100" style="transform: rotate(0deg);">
      ${s.join("")}
      <circle cx="50" cy="50" r="20" fill="white"/>
      <text x="50" y="50" text-anchor="middle" dominant-baseline="middle"
            font-size="24" font-weight="600" fill="#333">
        ${i}
      </text>
    </svg>
  `}function Us(i){const e=i.base_points===0,t=i.gear_type==="trad"?"#d80":i.gear_type==="boulder"?"#e55":"#0366d6",r=i.gear_type==="boulder"?i.grade_numeric===0?"#FEE100":i.grade_numeric<=4?"#E58329":"#C90909":i.grade_numeric<=12?"#54B41A":i.grade_numeric<=18?"#FEE100":i.grade_numeric<=24?"#E58329":"#C90909",n=r==="#C90909"?"white":"black",s=tt.filter(u=>u.route_id===i.id),o=s.length,a=s.reduce((u,h)=>u+(h.points_earned||0),0),d=i.gear_type==="trad"?1.5:1,c=Math.floor(i.base_points*d);return`
    <div
      class="route-card"
      data-route-id="${i.id}"
      style="
        padding: 12px;
        margin: 8px 0;
        background-color: ${e?"#f6f8fa":"var(--bg-white)"};
        border: 1px solid var(--border-secondary);
        border-radius: 6px;
        cursor: ${N?"pointer":"not-allowed"};
        opacity: ${N?"1":"0.6"};
        transition: all 0.2s;
      "
    >
      <div style="display: flex; justify-content: space-between; align-items: start; gap: 12px;">
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 14px; color: var(--text-primary); margin-bottom: 4px;">
            ${i.name}
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            ${e?`
              <span style="font-size: 12px; color: var(--text-secondary); font-style: italic;">
                (out of competition)
              </span>
            `:`
              <span style="
                font-size: 11px;
                padding: 0px 3px;
                border: 1px solid ${t};
                border-left-width: 3px;
                color: black;
                border-radius: 3px;
              ">
                ${i.gear_type.substring(0,1).toUpperCase()+i.gear_type.substring(1).toLowerCase()}
              </span>
              <span style="
                font-size: 13px; 
                color: ${n};
                padding: 0px 3px;
                border: 1px solid var(--border-secondary);
                border-radius: 999px;
                background-color: ${r};
              ">
                ${i.grade}
              </span>
              <span style="font-size: 13px; color: black; font-weight: 600;">
                ${c} pts${i.gear_type==="trad"?" (trad)":""}
              </span>
            `}
          </div>
        </div>
        ${e?"":`
          <div style="flex-shrink: 0; display: flex; align-items: center; gap: 8px;">
            ${o>0?`
              <div style="
                font-size: 11px;
                padding: 2px 6px;
                background-color: #e1e4e8;
                color: #333;
                border-radius: 3px;
                font-weight: 600;
              ">
                ${a}pts
              </div>
            `:""}
            ${Ds(o)}
          </div>
        `}
      </div>
    </div>
  `}function qs(i){return i.filter(e=>{if(A.search&&A.search.trim()!==""){const t=A.search.trim().toLowerCase(),r=(e.name||"").toLowerCase(),n=(e.sector||"").toLowerCase();if(!r.includes(t)&&!n.includes(t))return!1}if(A.type!=="all"&&e.gear_type!==A.type)return!1;if(A.gradeband!=="all"){const t=e.grade;if(A.gradeband==="recreational"&&t>19||A.gradeband==="intermediate"&&(t<20||t>23)||A.gradeband==="advanced"&&t<24)return!1}return!(A.hideZeroPoint&&e.base_points===0)})}function Fs(){setTimeout(()=>{const i=document.getElementById("back-to-dashboard");i&&(i.replaceWith(i.cloneNode(!0)),document.getElementById("back-to-dashboard").addEventListener("click",async t=>{t.preventDefault(),t.stopPropagation(),await Mr()}))},0),document.querySelectorAll(".climber-select-btn").forEach(i=>{i.addEventListener("click",async()=>{const e=i.getAttribute("data-climber-id"),t=parseInt(i.getAttribute("data-climber-index"));await Hs(e,t)})}),document.getElementById("filter-search")?.addEventListener("input",i=>{A.search=i.target.value,q(),ue()}),document.getElementById("filter-type")?.addEventListener("change",i=>{A.type=i.target.value,q(),ue()}),document.getElementById("filter-gradeband")?.addEventListener("change",i=>{A.gradeband=i.target.value,q(),ue()}),document.getElementById("filter-hide-zero")?.addEventListener("change",i=>{A.hideZeroPoint=i.target.checked,q(),ue()}),document.getElementById("clear-filters")?.addEventListener("click",()=>{A={search:"",type:"all",gradeband:"all",hideZeroPoint:!1};const i=document.getElementById("filter-search"),e=document.getElementById("filter-type"),t=document.getElementById("filter-gradeband"),r=document.getElementById("filter-hide-zero");i&&(i.value=""),e&&(e.value="all"),t&&(t.value="all"),r&&(r.checked=!1),q(),ue()}),document.getElementById("toggle-all-sectors")?.addEventListener("click",()=>{const i=[...document.querySelectorAll(".sector-header")].map(e=>e.getAttribute("data-sector"));F.size===0?i.forEach(e=>F.add(e)):F.clear(),q(),St()}),document.querySelectorAll(".sector-header").forEach(i=>{i.addEventListener("click",()=>{const e=i.getAttribute("data-sector");F.has(e)?F.delete(e):F.add(e),q(),St()})}),document.querySelectorAll(".route-card").forEach(i=>{i.addEventListener("click",async()=>{if(!N){E("Please select a climber first");return}if(Q=await nt(),!Q){E("Competition is currently closed");return}const e=i.getAttribute("data-route-id"),t=Pe.find(r=>r.id===e);t&&zr(t)})})}async function Br(i){try{const{data:e,error:t}=await y.from("ascents").select("*").eq("climber_id",i).order("logged_at",{ascending:!0});if(t)throw t;tt=e||[]}catch{tt=[]}}async function Hs(i,e){N={id:i,data:pe.climbers[e]},document.querySelectorAll(".climber-select-btn").forEach(t=>{t.getAttribute("data-climber-id")===i?(t.style.borderColor="var(--color-primary)",t.style.backgroundColor="#fff5f7"):(t.style.borderColor="var(--border-primary)",t.style.backgroundColor="var(--bg-secondary)")}),await Br(i),q(),j(`Selected ${N.data.name}`)}function St(){const i=document.getElementById("toggle-all-sectors");if(!i)return;F.size>0?i.innerHTML=`
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
      Expand All Sections
    `:i.innerHTML=`
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
      Collapse All Sections
    `}function Ws(){const i=[];if(A.search&&A.search.trim()!==""&&i.push(`<span class="chip">Search: ${A.search}</span>`),A.type!=="all"&&i.push(`<span class="chip">Type: ${A.type}</span>`),A.gradeband!=="all"){const e=A.gradeband.charAt(0).toUpperCase()+A.gradeband.slice(1);i.push(`<span class="chip">${e}</span>`)}return A.hideZeroPoint&&i.push('<span class="chip">Hide 0 pts</span>'),i.join("")}function ue(){const i=document.getElementById("filter-chips");i&&(i.innerHTML=Ws())}function q(){const i=document.getElementById("routes-container");i&&(i.innerHTML=Lr(),ue(),document.querySelectorAll(".sector-header").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-sector");F.has(t)?F.delete(t):F.add(t),q(),St()})}),document.querySelectorAll(".route-card").forEach(e=>{e.addEventListener("click",async()=>{if(!N){E("Please select a climber first");return}if(Q=await nt(),!Q){E("Competition is currently closed");return}const t=e.getAttribute("data-route-id"),r=Pe.find(n=>n.id===t);r&&zr(r)})})),ue()}async function zr(i){const{data:e,error:t}=await y.from("ascents").select("*").eq("climber_id",N.id).eq("route_id",i.id).order("logged_at",{ascending:!0});if(t){E("Failed to load attempt history");return}const r=(e?.length||0)+1,n=i.gear_type==="trad",s=Cs(i.base_points,r,n),o=document.createElement("div");o.id="attempt-modal",o.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
  `,o.innerHTML=`
    <div class="card" style="max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="font-size: 20px; font-weight: 600; color: var(--text-primary); margin: 0;">
          Log Send
        </h2>
        <button id="close-modal" style="
          background: none;
          border: none;
          font-size: 24px;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">×</button>
      </div>

      <div style="background-color: var(--bg-secondary); padding: 12px; border-radius: 6px; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px; color: var(--color-primary); margin-bottom: 4px;">
          ${i.name}
        </div>
        <div style="font-size: 14px; color: var(--text-secondary);">
          ${i.gear_type.toUpperCase()} • Grade ${i.grade} • ${i.base_points} pts${n?" +50%":""}
        </div>
      </div>

      <div style="background-color: #fff5f7; padding: 12px; border-radius: 6px; margin-bottom: ${e?.length>0?"16px":"24px"};">
        <div style="font-weight: 600; font-size: 14px; color: var(--color-primary); margin-bottom: 4px;">
          ${N.data.name}
        </div>
        <div style="font-size: 13px; color: var(--text-secondary);">
          Tick #${r} • <span style="color: var(--text-primary); font-weight: 600;">+${s} points</span>
        </div>
      </div>

      ${e?.length>0?`
        <div style="margin-bottom: 24px;">
          <div style="font-weight: 600; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
            Previous Sends
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${e.map((l,d)=>{const c=d===e.length-1;return`
                <div style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 8px 12px;
                  background-color: var(--bg-secondary);
                  border-radius: 4px;
                  font-size: 13px;
                ">
                  <div>
                    <span style="font-weight: 600;">Tick #${d+1}</span>
                    <span style="color: var(--text-secondary);"> • ${l.points_earned}pts</span>
                    <span style="color: var(--text-secondary); font-size: 11px;"> • ${new Date(l.logged_at).toLocaleString()}</span>
                  </div>
                  ${c?`
                    <button
                      type="button"
                      class="delete-send-btn"
                      data-ascent-id="${l.id}"
                      style="
                        background: none;
                        border: none;
                        color: #dc3545;
                        cursor: pointer;
                        padding: 4px 8px;
                        line-height: 1;
                      "
                      title="Delete this send"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                    </button>
                  `:""}
                </div>
              `}).join("")}
          </div>
        </div>
      `:""}

      <form id="attempt-form">
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button type="button" id="cancel-btn" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary btn-inline">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
            Log Send
          </button>
        </div>
      </form>
    </div>
  `,document.body.appendChild(o);const a=()=>{o.remove()};document.getElementById("close-modal")?.addEventListener("click",a),document.getElementById("cancel-btn")?.addEventListener("click",a),o.addEventListener("click",l=>{l.target===o&&a()}),document.querySelectorAll(".delete-send-btn").forEach(l=>{l.addEventListener("click",async d=>{d.stopPropagation();const c=l.getAttribute("data-ascent-id");if(confirm("Are you sure you want to delete this send?"))try{ne("Deleting send...");const{error:u}=await y.from("ascents").delete().eq("id",c);if(u)throw u;L(),j("Send deleted"),a(),await or(),q()}catch(u){L(),E("Failed to delete send: "+u.message)}})}),document.getElementById("attempt-form")?.addEventListener("submit",async l=>{l.preventDefault();try{if(ne("Checking competition status..."),Q=await nt(),!Q){L(),E("Competition is currently closed"),a();return}ne("Logging send...");const{error:d}=await y.from("ascents").insert({climber_id:N.id,route_id:i.id,tick_number:r,tick_multiplier:Pr(r),trad_bonus_applied:n,points_earned:s,repeat_count:r,logged_at:new Date().toISOString()});if(d)throw d;L(),j(`Send logged! +${s} points`),a(),await or(),q()}catch(d){L(),E("Failed to log send: "+d.message)}})}async function Mr(){const i=document.querySelector("#app");i.innerHTML=`
    <div class="min-h-screen" >
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Quarry Madness</h1>
            </div>
            <button class="btn btn-header btn-sm btn-inline" id="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main class="container" style="padding-top: 32px;">
        <div style="text-align: center; padding: 40px;">
          <p style="color: var(--text-secondary);">Loading your team data...</p>
        </div>
      </main>
    </div>
  `;try{const e=await Gs();if(!e){ar("Failed to load team data");return}await Ks(e)}catch{ar("An error occurred while loading the dashboard")}document.getElementById("sign-out-btn")?.addEventListener("click",async()=>{await W.signOut()})}async function Gs(){const i=W.getUser();if(!i)return null;try{const{data:e,error:t}=await y.from("teams").select("*").eq("auth_user_id",i.id).single();if(t)throw t;const{data:r,error:n}=await y.from("climbers").select("*").eq("team_id",e.id);if(n)throw n;const{data:s,error:o}=await y.from("team_scores").select("*").eq("team_id",e.id).single(),a=o?null:s,{data:l,error:d}=await y.from("climber_scores").select("*").in("climber_id",r.map(g=>g.id)),c=d?[]:l,{data:u,error:h}=await y.from("bonus_entries").select(`
        climber_id,
        points_awarded,
        bonus_games (
          name
        )
      `).in("climber_id",r.map(g=>g.id));return{team:e,climbers:r,teamScore:a,climberScores:c,bonusEntries:h?[]:u}}catch(e){return E("Failed to load team data: "+e.message),null}}async function Ks(i){const{team:e,climbers:t,teamScore:r,climberScores:n,bonusEntries:s}=i,o=document.querySelector("#app"),a=r?.total_points||0,l=r?.total_ascents||0,d=await Rr(e);o.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Quarry Madness</h1>
            </div>
            <button class="btn btn-header btn-sm btn-inline" id="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main class="container" style="padding-top: 32px; padding-bottom: 32px;">
        <!-- Nudge Banner -->
        ${d}

        <!-- Team Info Card -->
        <div class="card" style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-bottom: 4px;">
                ${e.team_name}
              </h2>
              <p style="color: var(--text-secondary); font-size: 14px;">
                Team ID: ${e.team_id} • Category: ${lr(e.category)}
              </p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 32px; font-weight: 700; color: #ff0046;">
                ${a}
              </div>
              <div style="font-size: 14px; color: var(--text-secondary);">
                Total Points
              </div>
            </div>
          </div>

          <div style="padding-top: 16px; border-top: 1px solid var(--border-secondary);">
            <div style="display: flex; gap: 32px;">
              <div>
                <div style="font-size: 20px; font-weight: 600; color: var(--text-primary);">${l}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Total Ascents</div>
              </div>
              <div>
                <div style="font-size: 20px; font-weight: 600; color: var(--text-primary);">${t.length}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Team Members</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Climbers Section -->
        <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
          Team Members
        </h3>

        ${t.map(c=>{const u=n.find(f=>f.climber_id===c.id),h=u?.total_points||0,p=u?.route_ascents||0,g=s.filter(f=>f.climber_id===c.id),m=g.reduce((f,_)=>f+_.points_awarded,0);return`
            <div class="card" style="margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                  <h4 style="color: var(--text-primary); font-size: 16px; font-weight: 600; margin-bottom: 4px;">
                    ${c.name}
                  </h4>
                  <p style="color: var(--text-secondary); font-size: 14px;">
                    Age: ${c.age} • Grade: ${c.redpoint_grade} • Category: ${lr(c.category)}
                  </p>

                  ${g.length>0?`
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-secondary);">
                      <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px; font-weight: 500;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        Bonus Points:
                      </div>
                      ${g.map(f=>`
                        <div style="font-size: 12px; color: var(--text-secondary); margin-left: 20px; margin-bottom: 2px;">
                          • ${f.bonus_games.name}: <span style="color: var(--color-primary); font-weight: 600;">+${f.points_awarded}</span>
                        </div>
                      `).join("")}
                    </div>
                  `:""}
                </div>
                <div style="text-align: right; margin-left: 16px;">
                  <div style="font-size: 24px; font-weight: 600; color: #ff0046;">
                    ${h}
                  </div>
                  <div style="font-size: 12px; color: var(--text-secondary);">
                    ${p} ascent${p!==1?"s":""}
                  </div>
                  ${m>0?`
                    <div style="font-size: 11px; color: var(--color-primary); margin-top: 4px;">
                      +${m} bonus
                    </div>
                  `:""}
                </div>
              </div>
            </div>
          `}).join("")}

        <!-- Action Button -->
        <div style="margin-top: 32px; text-align: center;">
          <button id="goto-scoring" class="btn btn-primary btn-cta btn-inline gradient-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
              <line x1="12" y1="20" x2="12" y2="10"/>
              <line x1="18" y1="20" x2="18" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="16"/>
            </svg>
            Start Scoring
          </button>
        </div>

        <!-- Rules & Scoring (collapsible) -->
        <div class="accordion" style="margin-top: 16px;">
          <details>
            <summary>
              Scoring Overview
              <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </summary>
            <div class="content">
              <ul style="margin: 0; padding-left: 18px;">
                <li style="margin: 4px 0;">Each route has base points. Trad routes get <strong>+50%</strong>.</li>
                <li style="margin: 4px 0;">Repeats: <strong>100%</strong>, <strong>75%</strong>, <strong>50%</strong>, <strong>25%</strong>, then <strong>0%</strong>.</li>
                <li style="margin: 4px 0;">Team score = sum of both climbers’ points.</li>
                <li style="margin: 4px 0;">Points are whole numbers; partials round down where applicable.</li>
              </ul>
            </div>
          </details>

          <details>
            <summary>
              Base Points Guide
              <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </summary>
            <div class="content">
              <div style="margin-bottom: 8px;">
                Rope grades (Ewbank) use banded multipliers when deriving base points:
              </div>
              <ul style="margin: 0 0 8px; padding-left: 18px;">
                <li>≤14 → 0.75× grade</li>
                <li>15–17 → 1.00× grade</li>
                <li>18–20 → 1.25× grade</li>
                <li>21–23 → 1.50× grade</li>
                <li>≥24 → 1.75× grade</li>
              </ul>
              <div style="margin-bottom: 6px;">Boulders map to rope grades with ~30% reduction (e.g. V0≈16 → ~11.2 pts, V6≈26 → ~31.9 pts).</div>
              <div style="font-size: 12px; color: var(--text-muted);">In-app routes already include set base points from these guidelines.</div>
            </div>
          </details>

          <details>
            <summary>
              Categories
              <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </summary>
            <div class="content">
              <ul style="margin: 0; padding-left: 18px;">
                <li><strong>Recreational</strong>: hardest redpoint ≤19</li>
                <li><strong>Intermediate</strong>: usually 20–23</li>
                <li><strong>Advanced</strong>: 24+</li>
                <li><strong>Team category</strong> = stronger/older climber’s category; <strong>Masters</strong> if ≥50 (or both ≥45).</li>
              </ul>
            </div>
          </details>

          <details>
            <summary>
              Safety Rules
              <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </summary>
            <div class="content">
              <ul style="margin: 0; padding-left: 18px;">
                <li>Only experienced, self-sufficient outdoor lead climbers are eligible to enter, and by purchasing a ticket, anyone agrees to the Competition Rules &amp; CAWA terms and conditions.</li>
                <li>Helmets must be worn while climbing, belaying, and near the cliff.</li>
                <li>Anyone who is observed endangering themselves or others by climbing like an idiot will be disqualified. This includes:
                  <ul style="margin-top: 6px; padding-left: 18px;">
                    <li>Bolt skipping</li>
                    <li>General reckless behaviour</li>
                  </ul>
                </li>
              </ul>
            </div>
          </details>

          <details>
            <summary>
              General Rules
              <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </summary>
            <div class="content">
              <ul style="margin: 0; padding-left: 18px;">
                <li>Climbers compete in teams of 2.</li>
                <li>Climbers are encouraged to wear a fancy dress; however, costumes must be approved as being safe by the head judge, and common sense is advised.</li>
                <li>Team members belay each other; no external belayers are allowed.</li>
                <li>Only routes on the score sheet can be climbed.</li>
                <li>A climb can only be counted if it is lead; a successful "lead" is starting at the bottom, with no top-rope above, clipping gear along the way, and arriving at the anchors with no FALLS, no HANGS, and no PULLING ON GEAR. Trad and mixed climbs must be repointed; pink pointing is permitted on sport routes only.</li>
                <li>A successful 'second' can also count as an ascent in the competition, however, only on top-out Trad routes. The only routes where this is permitted are [list the routes]. On all other routes, only a lead can be scored.</li>
                <li>Only one climbing party can be on a route at a time. This applies to all single and multi-pitch routes.</li>
                <li>Stick Clip: Only stick-clipping the first bolt is permitted.</li>
                <li>Climbers can have two back-to-back goes (successful or unsuccessful) on a climb, after which they have to move on to another climb before returning to it again.</li>
                <li>If a climber falls on a climb, they can lower down and have a second attempt. If safe to do so, the climber can choose to leave the rope clipped to their high point and yoyo the climb up to their high point and continue the route. If the climber falls on the second attempt, they must try a different climb before attempting the climb again.</li>
                <li>Teams must submit their electronic or hard copy score sheet (both provided) before the event ends at 6 pm.</li>
                <li>Cleaning of routes
                  <ul style="margin-top: 6px; padding-left: 18px;">
                    <li>Climbers must clean climbs after they are finished on the route.</li>
                    <li>At the base of most climbs will be a set of locking carabiners. The first climber to climb each route will place these locking carabiners on the anchor of the climb. For the remainder of the event, climbers can clip and lower off these carabiners in order to clean the route.</li>
                  </ul>
                </li>
              </ul>
            </div>
          </details>
        </div>
      </main>
    </div>
  `,document.getElementById("sign-out-btn")?.addEventListener("click",async()=>{await W.signOut()}),jr(),document.getElementById("goto-scoring")?.addEventListener("click",async()=>{await js(i.team,i.climbers,i.climberScores)})}function ar(i){const e=document.querySelector("#app");e.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Quarry Madness</h1>
            </div>
            <button class="btn btn-secondary" id="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main class="container" style="padding-top: 32px;">
        <div class="card max-w-2xl mx-auto text-center">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-bottom: 16px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Error
          </h2>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">
            ${i}
          </p>
          <button class="btn btn-primary btn-inline btn-center" onclick="window.location.reload()">
            Reload Page
          </button>
        </div>
      </main>
    </div>
  `,document.getElementById("sign-out-btn")?.addEventListener("click",async()=>{await W.signOut()})}function lr(i){return i.charAt(0).toUpperCase()+i.slice(1)}function Vs(){const i=document.querySelector("#app");i.innerHTML=`
    <div class="min-h-screen flex items-center justify-center" style="padding: 20px;">
      <div class="card" style="max-width: 450px; width: 100%;">
        <!-- CAWA Logo -->
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" style="height: 80px; margin: 0 auto;" />
          <h1 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-top: 16px;">
            Admin Portal
          </h1>
          <p style="color: var(--text-secondary); font-size: 14px; margin-top: 8px;">
            Team Management & Competition Control
          </p>
        </div>

        <!-- Login Form -->
        <form id="admin-login-form" style="margin-bottom: 24px;">
          <!-- Username Input -->
          <div style="margin-bottom: 16px;">
            <label for="admin-username" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
              Admin Username
            </label>
            <input
              type="text"
              id="admin-username"
              name="admin-username"
              placeholder="admin"
              required
              autocomplete="username"
              style="
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--border-primary);
                border-radius: 6px;
                font-size: 14px;
                box-sizing: border-box;
                background-color: var(--bg-secondary);
              "
            />
            <p style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">
              Enter 'admin' or full email
            </p>
          </div>

          <!-- Password Input -->
          <div style="margin-bottom: 16px;">
            <label for="admin-password" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
              Password
            </label>
            <div style="position: relative;">
              <input
                type="password"
                id="admin-password"
                name="admin-password"
                placeholder="Enter admin password"
                required
                autocomplete="current-password"
                style="
                  width: 100%;
                  padding: 8px 40px 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                  background-color: var(--bg-secondary);
                "
              />
              <button
                type="button"
                id="toggle-admin-password"
                style="
                  position: absolute;
                  right: 8px;
                  top: 50%;
                  transform: translateY(-50%);
                  background: none;
                  border: none;
                  color: var(--text-secondary);
                  cursor: pointer;
                  padding: 4px 8px;
                  font-size: 12px;
                  font-weight: 500;
                "
              >
                Show
              </button>
            </div>
          </div>

          <!-- Cloudflare Turnstile Widget -->
          <div style="margin-bottom: 16px;">
            <div id="admin-turnstile-widget"></div>
          </div>

          <!-- Error Message Container -->
          <div id="admin-login-error" style="margin-bottom: 16px;"></div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary"
            style="width: 100%; padding: 10px; font-size: 16px;"
          >
            Sign In as Admin
          </button>
        </form>

        <!-- Back to Home Link -->
        <div style="text-align: center; align-items: center;">
          <a
            href="#/"
            style="color: var(--color-tertiary); text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Home
          </a>
          <span style="color: var(--border-primary); margin: 0 8px;">|</span>
          <a
            href="#/login"
            style="color: var(--color-tertiary); text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;"
          >
            Team Login
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
              <polyline points="9 6 15 12 9 18"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `,Js(),Ys()}function Js(){const i="0x4AAAAAAB5xR2YjqecWsKNH",e=setInterval(()=>{if(window.turnstile){clearInterval(e);try{window.turnstile.render("#admin-turnstile-widget",{sitekey:i,theme:"light",callback:t=>{window.adminTurnstileToken=t},"error-callback":()=>{Ce("Verification failed. Please refresh and try again.",document.getElementById("admin-login-error"))}})}catch{document.getElementById("admin-turnstile-widget").innerHTML=`
          <div style="
            padding: 12px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            color: #721c24;
            font-size: 14px;
          ">
            [Error] Failed to load verification widget
          </div>
        `}}},100);setTimeout(()=>{clearInterval(e)},1e4)}function Ys(){const i=document.getElementById("admin-login-form"),e=document.getElementById("admin-login-error"),t=document.getElementById("admin-password"),r=document.getElementById("toggle-admin-password");r.addEventListener("click",()=>{t.getAttribute("type")==="password"?(t.setAttribute("type","text"),r.textContent="Hide"):(t.setAttribute("type","password"),r.textContent="Show")}),i.addEventListener("submit",async n=>{n.preventDefault(),e.innerHTML="";const s=document.getElementById("admin-username").value.trim(),o=document.getElementById("admin-password").value;if(!s||!o){Ce("Please enter both username and password",e);return}if(!window.adminTurnstileToken){Ce("Please complete the verification challenge",e);return}let a=s;s.includes("@")||(a=`${s}@quarrymadness.local`);try{ne();const{data:l,error:d}=await y.auth.signInWithPassword({email:a,password:o});if(d){L(),Ce(d.message||"Invalid admin credentials",e);return}const{data:c,error:u}=await y.rpc("is_admin");if(L(),u||!c){await y.auth.signOut(),Ce("Access denied: Admin privileges required",e);return}W.currentSession=l.session,W.currentUser=l.user,z.navigate("/admin/dashboard")}catch{L(),Ce("An error occurred during login",e)}})}function Ce(i,e){e.innerHTML=`
    <div style="
      padding: 12px;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      color: #721c24;
      font-size: 14px;
    ">
      ${i}
    </div>
  `}function G(i={}){const{title:e="Admin Portal",currentPage:t="dashboard"}=i,n=[{id:"dashboard",label:"Dashboard",path:"/admin/dashboard",icon:dr},{id:"teams",label:"Team Management",path:"/admin/teams",icon:Qs},{id:"leaderboards",label:"Leaderboards",path:"/admin/leaderboards",icon:Zs},{id:"bonus",label:"Bonus Games",path:"/admin/bonus",icon:eo},{id:"nudge",label:"Leaderboard Nudges",path:"/admin/nudge",icon:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M22 2L11 13"/>
    <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>`},{id:"competition",label:"Competition Control",path:"/admin/competition",icon:Xs}],s=n.find(a=>a.id===t),o=s?s.icon:dr;return`
    <header class="header" style="padding: 12px 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <!-- Left: Logo + Title -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="/12qm25/assets/cawa-logo.png" alt="CAWA" style="height: 32px;" />
          <h1 style="color: white; font-size: 16px; font-weight: 600; margin: 0;">
            ${e}
          </h1>
        </div>

        <!-- Right: Navigation Dropdown -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="admin-nav-dropdown" style="position: relative;">
            <button
              id="admin-nav-toggle"
              class="btn btn-header btn-sm btn-inline"
              style=""
            >
              ${o}
              <span style="display: none;" class="nav-label">Menu</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div
              id="admin-nav-menu"
              class="admin-nav-menu"
              style="
                display: none;
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 4px;
                background: var(--bg-primary);
                border: 1px solid var(--border-primary);
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                min-width: 200px;
                z-index: 1000;
              "
            >
              ${n.map(a=>`
                <button
                  data-nav-path="${a.path}"
                  class="admin-nav-item ${a.id===t?"active":""}"
                  style="
                    width: 100%;
                    text-align: left;
                    padding: 10px 16px;
                    border: none;
                    background: ${a.id===t?"var(--color-primary-alpha)":"transparent"};
                    color: ${a.id===t?"var(--color-primary)":"var(--text-primary)"};
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: background-color 0.2s;
                  "
                  onmouseover="this.style.background = '${a.id===t?"var(--color-primary-alpha)":"var(--bg-secondary)"}'"
                  onmouseout="this.style.background = '${a.id===t?"var(--color-primary-alpha)":"transparent"}'"
                >
                  ${a.icon}
                  ${a.label}
                </button>
              `).join("")}

              <!-- Divider -->
              <div style="height: 1px; background: var(--border-secondary); margin: 4px 0;"></div>

              <!-- Sign Out -->
              <button
                id="admin-signout"
                class="admin-nav-item"
                style="
                  width: 100%;
                  text-align: left;
                  padding: 10px 16px;
                  border: none;
                  background: transparent;
                  color: var(--text-primary);
                  font-size: 14px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  transition: background-color 0.2s;
                "
                onmouseover="this.style.background = 'var(--bg-secondary)'"
                onmouseout="this.style.background = 'transparent'"
              >
                ${to}
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `}function K(){const i=document.getElementById("admin-nav-toggle"),e=document.getElementById("admin-nav-menu");i&&e&&(i.addEventListener("click",r=>{r.stopPropagation();const n=e.style.display==="block";e.style.display=n?"none":"block"}),document.addEventListener("click",r=>{r.target.closest(".admin-nav-dropdown")||(e.style.display="none")})),document.querySelectorAll(".admin-nav-item").forEach(r=>{r.addEventListener("click",n=>{const s=n.currentTarget.getAttribute("data-nav-path");s&&z.navigate(s)})});const t=document.getElementById("admin-signout");t&&t.addEventListener("click",async()=>{await y.auth.signOut(),z.navigate("/admin")})}const dr=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  <polyline points="9 22 9 12 15 12 15 22"/>
</svg>`,Qs=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
  <circle cx="9" cy="7" r="4"/>
  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</svg>`,Zs=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
  <path d="M4 22h16"/>
  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
</svg>`,Xs=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>`,eo=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
</svg>`,to=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
  <polyline points="16 17 21 12 16 7"/>
  <line x1="21" y1="12" x2="9" y2="12"/>
</svg>`;async function ro(){const i=document.querySelector("#app");i.innerHTML=`
    <div class="min-h-screen">
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
        <p style="color: var(--text-secondary); margin-top: 16px;">Loading admin dashboard...</p>
      </div>
    </div>
  `;try{const{data:e,error:t}=await y.from("admin_dashboard_stats").select("*").single();if(t)throw t;io(e)}catch(e){i.innerHTML=`
      <div class="min-h-screen" style="padding: 40px;">
        <div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
          <h2 style="color: var(--color-primary); margin-bottom: 16px;">Error Loading Dashboard</h2>
          <p style="color: var(--text-secondary);">${e.message}</p>
          <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 16px;">
            Retry
          </button>
        </div>
      </div>
    `}}function io(i){const e=document.querySelector("#app");e.innerHTML=`
    <div class="min-h-screen">
      ${G({title:"Admin Portal",currentPage:"dashboard"})}

      <!-- Main Content -->
      <div style="max-width: 1280px; margin: 0 auto; padding: 40px 24px;">
        <!-- Welcome -->
        <h2 style="color: var(--text-primary); font-size: 28px; font-weight: 600; margin-bottom: 8px;">
          Quarry Madness Admin
        </h2>
        <p style="color: var(--text-secondary); font-size: 16px; margin-bottom: 32px;">
          Manage teams, view results, and control competition settings
        </p>

        <!-- Stats Cards (mobile-optimized) -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
          <!-- Total Teams -->
          <div class="card" style="padding: 12px;">
            <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 2px;">Teams</div>
            <div style="color: var(--text-primary); font-size: 24px; font-weight: 600;">${i.total_teams||0}</div>
          </div>

          <!-- Total Climbers -->
          <div class="card" style="padding: 12px;">
            <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 2px;">Climbers</div>
            <div style="color: var(--text-primary); font-size: 24px; font-weight: 600;">${i.total_climbers||0}</div>
          </div>

          <!-- Total Ascents -->
          <div class="card" style="padding: 12px;">
            <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 2px;">Ascents</div>
            <div style="color: var(--text-primary); font-size: 24px; font-weight: 600;">${i.total_ascents||0}</div>
          </div>

          <!-- Active Windows -->
          <div class="card" style="padding: 12px;">
            <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 2px;">Windows</div>
            <div style="color: var(--text-primary); font-size: 24px; font-weight: 600;">${i.active_windows||0}</div>
          </div>
        </div>

        <!-- Current Leader (if there are ascents) -->
        ${i.total_ascents>0?`
          <div class="card gradient-primary" style="margin-bottom: 32px;">
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
              Current Leader
            </div>
            <div style="font-size: 24px; font-weight: 600;">${i.current_leader||"Loading..."}</div>
          </div>
        `:""}

        <!-- Navigation Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          <!-- Team Management -->
          <div class="card hover-card" id="nav-teams" style="cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4 10v-2a4 4 0 0 0-3-3.87" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div style="flex: 1;">
                <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 6px;">
                  Team Management
                </h3>
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.4;">
                  Create and manage teams, view credentials, and edit team information
                </p>
                <div style="margin-top: 8px; color: var(--color-primary); font-weight: 500; font-size: 14px;">
                  Manage Teams →
                </div>
              </div>
            </div>
          </div>

          <!-- Results & Leaderboard -->
          <div class="card hover-card" id="nav-results" style="cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <path d="M18 20V10M12 20V4M6 20v-6" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div style="flex: 1;">
                <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 6px;">
                  Results & Leaderboard
                </h3>
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.4;">
                  View standings, filter by category, and monitor live competition
                </p>
                <div style="margin-top: 8px; color: var(--color-primary); font-weight: 500; font-size: 14px;">
                  View Results →
                </div>
              </div>
            </div>
          </div>

          <!-- Bonus Games -->
          <div class="card hover-card" id="nav-bonus" style="cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div style="flex: 1;">
                <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 6px;">
                  Bonus Games
                </h3>
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.4;">
                  Create bonus challenges and award extra points to climbers
                </p>
                <div style="margin-top: 8px; color: var(--color-primary); font-weight: 500; font-size: 14px;">
                  Manage Bonus →
                </div>
              </div>
            </div>
          </div>

          <!-- Leaderboard Nudge -->
          <div class="card hover-card" id="nav-nudge" style="cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div style="flex: 1;">
                <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 6px;">
                  Leaderboard Nudges
                </h3>
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.4;">
                  Send announcements and reminders to check leaderboards
                </p>
                <div style="margin-top: 8px; color: var(--color-primary); font-weight: 500; font-size: 14px;">
                  Manage Nudges →
                </div>
              </div>
            </div>
          </div>

          <!-- Competition Settings -->
          <div class="card hover-card" id="nav-settings" style="cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <circle cx="12" cy="12" r="3" stroke="var(--color-primary)" stroke-width="2"/>
                <path d="M12 1v6m0 6v6M1 12h6m6 0h6m-2.5 8.66l-5.2-3m5.2-11.32l-5.2 3m0 8.32l5.2 3m-5.2-11.32l5.2-3" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <div style="flex: 1;">
                <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 6px;">
                  Competition Settings
                </h3>
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.4;">
                  Manage scoring windows and control competition parameters
                </p>
                <div style="margin-top: 8px; color: var(--color-primary); font-weight: 500; font-size: 14px;">
                  Settings →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .hover-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      }
    </style>
  `,K(),no()}function no(){document.getElementById("nav-teams")?.addEventListener("click",()=>{z.navigate("/admin/teams")}),document.getElementById("nav-results")?.addEventListener("click",()=>{z.navigate("/admin/leaderboards")}),document.getElementById("nav-bonus")?.addEventListener("click",()=>{z.navigate("/admin/bonus")}),document.getElementById("nav-nudge")?.addEventListener("click",()=>{z.navigate("/admin/nudge")}),document.getElementById("nav-settings")?.addEventListener("click",()=>{z.navigate("/admin/competition")})}const pt={RECREATIONAL:"recreational",INTERMEDIATE:"intermediate",ADVANCED:"advanced"},Le={MASTERS:"masters",RECREATIONAL:"recreational",INTERMEDIATE:"intermediate",ADVANCED:"advanced"};function cr(i){return i>=24?pt.ADVANCED:i>=20?pt.INTERMEDIATE:pt.RECREATIONAL}function so(i,e){const{age:t,redpointGrade:r}=i,{age:n,redpointGrade:s}=e;if(t>=50||n>=50||t>=45&&n>=45)return Le.MASTERS;const o=Math.max(r,s);return o>=24?Le.ADVANCED:o>=20?Le.INTERMEDIATE:Le.RECREATIONAL}let H="list",Tt=null;async function Z(){const i=document.querySelector("#app");i.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${We()}
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
        <p style="color: var(--text-secondary); margin-top: 16px;">Loading teams...</p>
      </div>
    </div>
  `;try{H==="list"?await oo():H==="create"?co():H==="view"&&Tt&&await Dr(Tt)}catch(e){E("Error loading teams: "+e.message)}}function We(){return G({title:"Team Management",currentPage:"teams"})}async function oo(){const i=document.querySelector("#app"),{data:e,error:t}=await y.from("teams").select(`
      *,
      climbers (*)
    `).order("created_at",{ascending:!1});if(t)throw t;i.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${We()}

      <div style="max-width: 1280px; margin: 0 auto; padding: 40px 24px;">
        <!-- Page Title and Actions -->
        <div class="page-header" style="margin-bottom: 32px;">
          <div style="flex: 1 1 auto;">
            <h2 class="page-title" style="font-size: 28px;">Teams (${e.length})</h2>
            <p style="color: var(--text-secondary);">
              Manage team registrations and credentials
            </p>
          </div>
          <div class="page-actions">
            <button id="create-team-btn" class="btn btn-secondary btn-inline btn-sm" style="opacity: 0.5;" disabled title="Use manual SQL creation for now">
              + Create New (Disabled)
            </button>
          </div>
        </div>

        <!-- Teams Table -->
        ${e.length===0?ao():lo(e)}
      </div>
    </div>
  `,uo()}function ao(){return`
    <div class="card" style="text-align: center; padding: 60px 40px;">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 16px; color: var(--text-secondary);">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <h3 style="color: var(--text-primary); font-size: 20px; margin-bottom: 8px;">No teams yet</h3>
      <p style="color: var(--text-secondary); margin-bottom: 24px;">
        Create your first team to get started with the competition
      </p>
      <button id="create-first-team" class="btn btn-primary">
        Create First Team
      </button>
    </div>
  `}function lo(i){return`
    <div style="display: grid; gap: 12px;">
      ${i.map(e=>`
        <div class="card" style="padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 16px; color: var(--text-primary); margin-bottom: 4px;">
                ${e.team_name}
              </div>
              <code style="background-color: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-size: 12px;">
                ${e.team_id}
              </code>
            </div>
            <span style="
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 2px 8px;
              background-color: var(--bg-tertiary);
              color: var(--text-secondary);
              border: 1px solid var(--border-secondary);
              border-radius: 999px;
              font-size: 12px;
              text-transform: capitalize;
              white-space: nowrap;
            ">
              <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${Nr(e.category)};"></span>
              ${e.category}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #e1e4e8;">
            <div style="font-size: 13px; color: var(--text-secondary);">
              ${e.climbers?.length||0} climbers • ${new Date(e.created_at).toLocaleDateString()}
            </div>
            <button
              class="btn btn-primary btn-sm btn-inline btn-view-team"
              data-team-id="${e.id}"
              style="
                font-weight: 600;
              "
            >
              View
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 6px;">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      `).join("")}
    </div>
  `}function Nr(i){return{masters:"#6f42c1",recreational:"#28a745",intermediate:"var(--color-primary)",advanced:"#d73a49"}[i]||"#6c757d"}function co(){const i=document.querySelector("#app");i.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${We()}

      <div style="max-width: 800px; margin: 0 auto; padding: 40px 24px;">
        <!-- Back Button -->
        <button id="back-to-list" class="btn" style="margin-bottom: 24px; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Teams
        </button>

        <!-- Form Card -->
        <div class="card">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-bottom: 24px;">
            Create New Team
          </h2>

          <form id="create-team-form">
            <!-- Team ID -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Team ID <span style="color: #d73a49;">*</span>
              </label>
              <input
                type="text"
                id="team-id-input"
                name="team-id"
                placeholder="Jeff_Peter or AliceAndBob"
                required
                pattern="[a-zA-Z0-9_]{3,50}"
                title="3-50 characters, letters, numbers and underscore only"
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
              />
              <p style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">
                Used for login. 3-50 characters, alphanumeric and underscore only (e.g., Jeff_Peter, AliceAndBob)
              </p>
            </div>

            <!-- Team Name -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Team Name <span style="color: #d73a49;">*</span>
              </label>
              <input
                type="text"
                id="team-name-input"
                name="team-name"
                placeholder="Team Alpha"
                required
                maxlength="100"
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
              />
            </div>

            <!-- Password -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Password <span style="color: #d73a49;">*</span>
              </label>
              <input
                type="text"
                id="password-input"
                name="password"
                value="12qm2025"
                required
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
              />
              <p style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">
                Default: 12qm2025 (can be customized)
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e1e4e8; margin: 32px 0;" />

            <!-- Climber 1 -->
            <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
              Climber 1
            </h3>

            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Name <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="text"
                  id="climber1-name"
                  required
                  placeholder="Alice"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Age <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="number"
                  id="climber1-age"
                  required
                  min="10"
                  max="100"
                  placeholder="30"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Grade <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="number"
                  id="climber1-grade"
                  required
                  min="10"
                  max="35"
                  placeholder="22"
                  title="Ewbank grade 10-35"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
            </div>

            <!-- Climber 2 -->
            <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
              Climber 2
            </h3>

            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 32px;">
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Name <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="text"
                  id="climber2-name"
                  required
                  placeholder="Bob"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Age <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="number"
                  id="climber2-age"
                  required
                  min="10"
                  max="100"
                  placeholder="28"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Grade <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="number"
                  id="climber2-grade"
                  required
                  min="10"
                  max="35"
                  placeholder="20"
                  title="Ewbank grade 10-35"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
            </div>

            <!-- Error Container -->
            <div id="form-error" style="margin-bottom: 16px;"></div>

            <!-- Submit Buttons -->
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button type="button" id="cancel-create" class="btn">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" style="padding: 10px 24px;">
                Create Team
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,ho()}function uo(){document.getElementById("create-team-btn")?.addEventListener("click",()=>{H="create",Z()}),document.getElementById("create-first-team")?.addEventListener("click",()=>{H="create",Z()}),document.querySelectorAll(".btn-view-team").forEach(i=>{i.addEventListener("click",async e=>{Tt=e.currentTarget.dataset.teamId,H="view",await Z()})}),K()}function ho(){const i=document.getElementById("create-team-form"),e=document.getElementById("form-error");i.addEventListener("submit",async t=>{t.preventDefault(),e.innerHTML="";const r=document.getElementById("team-id-input").value.trim(),n=document.getElementById("team-name-input").value.trim(),s=document.getElementById("password-input").value,o={name:document.getElementById("climber1-name").value.trim(),age:parseInt(document.getElementById("climber1-age").value),redpointGrade:parseInt(document.getElementById("climber1-grade").value)},a={name:document.getElementById("climber2-name").value.trim(),age:parseInt(document.getElementById("climber2-age").value),redpointGrade:parseInt(document.getElementById("climber2-grade").value)};try{ne();const{error:l}=await y.rpc("validate_team_id",{p_team_id:r});if(l)throw new Error(l.message);const d=so(o,a),{data:{session:c}}=await y.auth.getSession(),u=await fetch(`${y.supabaseUrl}/functions/v1/admin-create-team`,{method:"POST",headers:{Authorization:`Bearer ${c.access_token}`,"Content-Type":"application/json"},body:JSON.stringify({teamId:r,teamName:n,password:s,climber1:o,climber2:a,category:d})}),h=await u.json();if(!u.ok)throw new Error(h.error||"Failed to create team");L(),po(r,s,n)}catch(l){L(),e.innerHTML=`
        <div style="
          padding: 12px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          color: #721c24;
        ">
          ${l.message}
        </div>
      `}}),document.getElementById("cancel-create")?.addEventListener("click",()=>{H="list",Z()}),document.getElementById("back-to-list")?.addEventListener("click",()=>{H="list",Z()}),K()}function po(i,e,t){const r=document.querySelector("#app");r.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${We()}

      <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">
        <!-- Success Card -->
        <div class="card" style="text-align: center;">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" style="margin-bottom: 16px;">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          <h2 style="color: #28a745; font-size: 24px; font-weight: 600; margin-bottom: 8px;">
            Team Created Successfully!
          </h2>
          <p style="color: var(--text-secondary); margin-bottom: 32px;">
            ${t} is ready to compete
          </p>

          <!-- Credentials Box -->
          <div style="
            background-color: #f6f8fa;
            border: 2px solid var(--color-primary);
            border-radius: 6px;
            padding: 24px;
            margin-bottom: 24px;
            text-align: left;
          ">
            <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
              🔑 Login Credentials
            </h3>
            <div style="margin-bottom: 12px;">
              <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 4px;">Team ID:</div>
              <code style="
                display: block;
                background-color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 16px;
                font-weight: 600;
              ">${i}</code>
            </div>
            <div style="margin-bottom: 12px;">
              <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 4px;">Password:</div>
              <code style="
                display: block;
                background-color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 16px;
                font-weight: 600;
              ">${e}</code>
            </div>
            <div>
              <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 4px;">Login URL:</div>
              <code style="
                display: block;
                background-color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 13px;
              ">${window.location.origin}/12qm25/#/login</code>
            </div>
          </div>

          <!-- Copy Button -->
          <button id="copy-credentials" class="btn btn-primary btn-inline btn-center" style="width: 100%; margin-bottom: 12px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy Credentials to Clipboard
          </button>

          <!-- Done Button -->
          <button id="done-btn" class="btn" style="width: 100%;">
            Done - Back to Teams
          </button>
        </div>
      </div>
    </div>
  `,document.getElementById("copy-credentials")?.addEventListener("click",()=>{const n=`
Team Login Credentials
══════════════════════
Team ID:  ${i}
Password: ${e}
Login:    ${window.location.origin}/12qm25/#/login

Instructions:
1. Go to the login page
2. Enter your Team ID and Password
3. Complete verification
4. Click Sign In
    `.trim();navigator.clipboard.writeText(n),j("Credentials copied to clipboard!")}),document.getElementById("done-btn")?.addEventListener("click",()=>{H="list",Z()}),K()}async function Dr(i){const e=document.querySelector("#app"),{data:t,error:r}=await y.from("teams").select(`
      *,
      climbers (*)
    `).eq("id",i).single();if(r){E("Error loading team details: "+r.message),H="list",Z();return}e.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${We()}

      <div style="max-width: 800px; margin: 0 auto; padding: 40px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <button id="back-to-list" class="btn" style="display: inline-flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Teams
          </button>
          <button id="edit-team-btn" class="btn btn-primary btn-inline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Team
          </button>
        </div>

        <!-- Team Info Card -->
        <div class="card" style="margin-bottom: 24px;">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-bottom: 24px;">
            ${t.team_name}
          </h2>

          <!-- Credentials -->
          <div style="background-color: #f6f8fa; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
            <h3 style="color: var(--text-primary); font-size: 16px; font-weight: 600; margin-bottom: 12px;">
              🔑 Login Credentials
            </h3>
            <div style="margin-bottom: 8px;">
              <span style="color: var(--text-secondary);">Team ID:</span>
              <code style="background-color: white; padding: 2px 6px; border-radius: 3px; margin-left: 8px;">
                ${t.team_id}
              </code>
            </div>
            <div style="margin-bottom: 12px;">
              <span style="color: var(--text-secondary);">Password:</span>
              <span style="color: var(--text-secondary); font-style: italic; margin-left: 8px;">
                Contact admin to reset
              </span>
              <button id="reset-password-btn" class="btn" style="padding: 4px 8px; font-size: 12px; margin-left: 8px; opacity: 0.5;" disabled title="Feature temporarily disabled">
                Reset Password
              </button>
            </div>
          </div>

          <!-- Team Info -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
            <div>
              <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 4px;">Category</div>
              <span style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 2px 10px;
                background-color: var(--bg-tertiary);
                color: var(--text-secondary);
                border: 1px solid var(--border-secondary);
                border-radius: 999px;
                font-size: 13px;
                text-transform: capitalize;
              ">
                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${Nr(t.category)};"></span>
                ${t.category}
              </span>
            </div>
            <div>
              <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 4px;">Created</div>
              <div style="color: var(--text-primary);">${new Date(t.created_at).toLocaleString()}</div>
            </div>
          </div>

          <!-- Climbers -->
          <h3 style="color: var(--text-primary); font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Team Members
          </h3>
          ${t.climbers.map(n=>`
            <div style="
              background-color: #f6f8fa;
              padding: 12px 16px;
              border-radius: 6px;
              margin-bottom: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <div>
                <div style="font-weight: 500; color: var(--text-primary);">${n.name}</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                  Age ${n.age} • Grade ${n.redpoint_grade} • ${n.category}
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `,go(t)}function go(i){document.getElementById("back-to-list")?.addEventListener("click",()=>{H="list",Z()}),document.getElementById("edit-team-btn")?.addEventListener("click",()=>{fo(i)}),document.getElementById("show-password")?.addEventListener("click",()=>{const e=document.getElementById("password-display"),t=document.getElementById("show-password"),r=e.getAttribute("data-visible")==="true",n=e.getAttribute("data-password");r?(e.textContent="••••••••",e.setAttribute("data-visible","false"),t.textContent="Show"):(e.textContent=n,e.setAttribute("data-visible","true"),t.textContent="Hide")}),document.getElementById("reset-password-btn")?.addEventListener("click",async()=>{const t=prompt("Enter new password (or leave blank for default 12qm2025):")||"12qm2025";try{ne();const{data:{session:r}}=await y.auth.getSession(),n=await fetch(`${y.supabaseUrl}/functions/v1/admin-reset-password`,{method:"POST",headers:{Authorization:`Bearer ${r.access_token}`,"Content-Type":"application/json"},body:JSON.stringify({userId:i.auth_user_id,newPassword:t,teamId:i.team_id})}),s=await n.json();if(!n.ok)throw new Error(s.error||"Failed to reset password");await y.from("teams").update({password_reset_count:(i.password_reset_count||0)+1,last_password_reset:new Date().toISOString()}).eq("id",i.id),L(),j(`Password reset to: ${t}`);const o=document.getElementById("password-display");o&&(o.setAttribute("data-password",t),o.getAttribute("data-visible")==="true"&&(o.textContent=t))}catch(r){L(),E("Error resetting password: "+r.message)}}),K()}function fo(i){const e=document.createElement("div");e.id="edit-team-modal",e.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  `,e.innerHTML=`
    <div class="card" style="
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin: 0;">
          Edit Team
        </h2>
        <button id="close-modal" class="btn" style="padding: 4px 12px;">
          ✕
        </button>
      </div>

      <form id="edit-team-form">
        <!-- Team Name -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
            Team Name
          </label>
          <input
            type="text"
            id="edit-team-name"
            value="${i.team_name}"
            required
            style="
              width: 100%;
              padding: 8px 12px;
              border: 1px solid var(--border-primary);
              border-radius: 6px;
              font-size: 14px;
              box-sizing: border-box;
              background-color: var(--bg-secondary);
            "
          />
        </div>

        <!-- Team Category -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
            Team Category
          </label>
          <select
            id="edit-team-category"
            required
            style="
              width: 100%;
              padding: 8px 12px;
              border: 1px solid var(--border-primary);
              border-radius: 6px;
              font-size: 14px;
              box-sizing: border-box;
              background-color: var(--bg-secondary);
              cursor: pointer;
            "
          >
            <option value="recreational" ${i.category==="recreational"?"selected":""}>Recreational</option>
            <option value="intermediate" ${i.category==="intermediate"?"selected":""}>Intermediate</option>
            <option value="advanced" ${i.category==="advanced"?"selected":""}>Advanced</option>
            <option value="masters" ${i.category==="masters"?"selected":""}>Masters</option>
          </select>
        </div>

        <!-- Team ID (read-only) -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
            Team ID (cannot be changed)
          </label>
          <input
            type="text"
            value="${i.team_id}"
            disabled
            style="
              width: 100%;
              padding: 8px 12px;
              border: 1px solid var(--border-primary);
              border-radius: 6px;
              font-size: 14px;
              box-sizing: border-box;
              background-color: #f6f8fa;
              color: var(--text-secondary);
            "
          />
        </div>

        <!-- Climber 1 -->
        <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
          Climber 1
        </h3>
        <div style="background-color: #f6f8fa; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
              Name
            </label>
            <input
              type="text"
              id="edit-climber1-name"
              value="${i.climbers[0].name}"
              required
              style="
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--border-primary);
                border-radius: 6px;
                font-size: 14px;
                box-sizing: border-box;
                background-color: white;
              "
            />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Age
              </label>
              <input
                type="number"
                id="edit-climber1-age"
                value="${i.climbers[0].age}"
                min="10"
                max="100"
                required
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                  background-color: white;
                "
              />
            </div>
            <div>
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Grade (Ewbank)
              </label>
              <input
                type="number"
                id="edit-climber1-grade"
                value="${i.climbers[0].redpoint_grade}"
                min="10"
                max="35"
                required
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                  background-color: white;
                "
              />
            </div>
          </div>
        </div>

        <!-- Climber 2 -->
        <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
          Climber 2
        </h3>
        <div style="background-color: #f6f8fa; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
              Name
            </label>
            <input
              type="text"
              id="edit-climber2-name"
              value="${i.climbers[1].name}"
              required
              style="
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--border-primary);
                border-radius: 6px;
                font-size: 14px;
                box-sizing: border-box;
                background-color: white;
              "
            />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Age
              </label>
              <input
                type="number"
                id="edit-climber2-age"
                value="${i.climbers[1].age}"
                min="10"
                max="100"
                required
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                  background-color: white;
                "
              />
            </div>
            <div>
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Grade (Ewbank)
              </label>
              <input
                type="number"
                id="edit-climber2-grade"
                value="${i.climbers[1].redpoint_grade}"
                min="10"
                max="35"
                required
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                  background-color: white;
                "
              />
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button type="button" id="cancel-edit" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  `,document.body.appendChild(e);const t=()=>{e.remove()};document.getElementById("close-modal").addEventListener("click",t),document.getElementById("cancel-edit").addEventListener("click",t),e.addEventListener("click",r=>{r.target===e&&t()}),document.getElementById("edit-team-form").addEventListener("submit",async r=>{r.preventDefault(),await mo(i,t)})}async function mo(i,e){try{ne("Saving changes...");const t=document.getElementById("edit-team-name").value.trim(),r=document.getElementById("edit-team-category").value,n=document.getElementById("edit-climber1-name").value.trim(),s=parseInt(document.getElementById("edit-climber1-age").value),o=parseInt(document.getElementById("edit-climber1-grade").value),a=document.getElementById("edit-climber2-name").value.trim(),l=parseInt(document.getElementById("edit-climber2-age").value),d=parseInt(document.getElementById("edit-climber2-grade").value);if(!t||!n||!a)throw new Error("All name fields are required");if(s<10||s>100||l<10||l>100)throw new Error("Age must be between 10 and 100");if(o<10||o>35||d<10||d>35)throw new Error("Grade must be between 10 and 35 (Ewbank)");const c=cr(o),u=cr(d),{error:h}=await y.from("teams").update({team_name:t,category:r}).eq("id",i.id);if(h)throw h;const{error:p}=await y.from("climbers").update({name:n,age:s,redpoint_grade:o,category:c}).eq("id",i.climbers[0].id);if(p)throw p;const{error:g}=await y.from("climbers").update({name:a,age:l,redpoint_grade:d,category:u}).eq("id",i.climbers[1].id);if(g)throw g;L(),j("Team updated successfully!"),e(),await Dr(i.id)}catch(t){L(),E("Error updating team: "+t.message)}}async function Ur(){const i=document.querySelector("#app");i.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${G({title:"Leaderboards",currentPage:"leaderboards"})}
      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <p style="color: var(--text-secondary); text-align: center;">Loading leaderboards...</p>
      </main>
    </div>
  `;try{const[e,t,r,n,s]=await Promise.all([yo(),vo(),bo(),wo(),xo()]);_o(e,t,r,n,s)}catch{E("Failed to load leaderboards")}}async function yo(){const{data:i,error:e}=await y.from("team_scores").select("*").order("total_points",{ascending:!1});if(e)throw e;const{data:t,error:r}=await y.from("climbers").select("id, team_id, name");if(r)throw r;const n=i.map(s=>{const o=t.filter(a=>a.team_id===s.team_id);return{...s,climber_names:o.map(a=>a.name).join(", ")}});return{masters:n.filter(s=>s.category==="masters"),recreational:n.filter(s=>s.category==="recreational"),intermediate:n.filter(s=>s.category==="intermediate"),advanced:n.filter(s=>s.category==="advanced")}}async function vo(){const{data:i,error:e}=await y.from("climber_scores").select("*").order("total_points",{ascending:!1});if(e)throw e;return{recreational:i.filter(t=>t.category==="recreational"),intermediate:i.filter(t=>t.category==="intermediate"),advanced:i.filter(t=>t.category==="advanced")}}async function bo(){const{data:i,error:e}=await y.from("climber_scores").select("*").order("hardest_send",{ascending:!1}).order("route_ascents",{ascending:!1});if(e)throw e;return i}async function wo(){const{data:i,error:e}=await y.from("climber_scores").select("*").order("route_ascents",{ascending:!1});if(e)throw e;const t={recreational:1,intermediate:2,advanced:3};return i.sort((r,n)=>r.route_ascents!==n.route_ascents?n.route_ascents-r.route_ascents:t[r.category]-t[n.category])}async function xo(){const{data:i,error:e}=await y.from("bonus_games").select("*").eq("is_active",!0).order("name");if(e)throw e;return!i||i.length===0?[]:await Promise.all(i.map(async r=>{const{data:n,error:s}=await y.from("bonus_entries").select(`
          points_awarded,
          climbers (
            id,
            name,
            category,
            team_id,
            teams (
              team_name
            )
          )
        `).eq("bonus_game_id",r.id).order("points_awarded",{ascending:!1});return s?{...r,topClimbers:[]}:{...r,topClimbers:n||[]}}))}function _o(i,e,t,r,n){const s=document.querySelector("#app");s.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${G({title:"Leaderboards",currentPage:"leaderboards"})}

      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <!-- Page Header with Refresh -->
        <div class="page-header">
          <h2 class="page-title">Competition Leaderboards</h2>
          <div class="page-actions">
            <button id="refresh-btn" class="btn btn-secondary btn-inline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <!-- Mobile-Friendly Tab Navigation (Dropdown) -->
        <div style="margin-bottom: 24px;">
          <label style="display: block; color: var(--text-secondary); font-size: 13px; margin-bottom: 6px;">
            Select Leaderboard
          </label>
          <select id="leaderboard-selector" class="form-input" style="width: 100%; font-size: 16px; padding: 12px;">
            <option value="teams">Team Categories</option>
            <option value="climbers">Climber Categories</option>
            <option value="hardest">Hardest Sends</option>
            <option value="ticks">Most Ticks</option>
            <option value="bonus">Bonus Games</option>
          </select>
        </div>

        <!-- Tab Content -->
        <div id="tab-teams" class="tab-content active">
          ${ko(i)}
        </div>

        <div id="tab-climbers" class="tab-content" style="display: none;">
          ${Eo(e)}
        </div>

        <div id="tab-hardest" class="tab-content" style="display: none;">
          ${So(t)}
        </div>

        <div id="tab-ticks" class="tab-content" style="display: none;">
          ${To(r)}
        </div>

        <div id="tab-bonus" class="tab-content" style="display: none;">
          ${Ao(n)}
        </div>
      </main>
    </div>

    <style>
      .tab-content {
        display: none;
      }

      .tab-content.active {
        display: block;
      }
    </style>
  `,$o()}function ko(i){return`
    <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 24px; padding: 12px; background-color: var(--bg-secondary); border-radius: 6px;">
      <strong>Points include:</strong> Route points + Bonus games
    </p>
  `+[{key:"masters",label:"Masters Teams",color:"#6f42c1"},{key:"advanced",label:"Advanced Teams",color:"#dc3545"},{key:"intermediate",label:"Intermediate Teams",color:"#fd7e14"},{key:"recreational",label:"Recreational Teams",color:"#28a745"}].map(t=>`
    <div class="card" style="margin-bottom: 24px;">
      <h3 style="
        color: ${t.color};
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid ${t.color};
      ">
        ${t.label}
      </h3>
      ${i[t.key].length>0?`
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-secondary);">
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">RANK</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">TEAM</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">POINTS</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">SENDS</th>
            </tr>
          </thead>
          <tbody>
            ${i[t.key].map((r,n)=>`
              <tr style="border-bottom: 1px solid var(--border-secondary);">
                <td style="padding: 12px 8px;">
                  <div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: ${n<3?t.color:"var(--bg-secondary)"};
                    color: ${n<3?"white":"var(--text-primary)"};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                  ">
                    ${n+1}
                  </div>
                </td>
                <td style="padding: 12px 8px;">
                  <div style="font-weight: 600; color: var(--text-primary);">${r.team_name}</div>
                  <div style="font-size: 12px; color: var(--text-secondary);">${r.climber_names||"No climbers"}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="font-size: 20px; font-weight: 700; color: ${t.color};">${r.total_points}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="color: var(--text-primary);">${r.total_ascents||0}</div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `:`
        <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
          No teams in this category yet
        </p>
      `}
    </div>
  `).join("")}function Eo(i){return`
    <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 24px; padding: 12px; background-color: var(--bg-secondary); border-radius: 6px;">
      <strong>Points include:</strong> Route points + Bonus games
    </p>
  `+[{key:"advanced",label:"Advanced Climbers",color:"#dc3545"},{key:"intermediate",label:"Intermediate Climbers",color:"#fd7e14"},{key:"recreational",label:"Recreational Climbers",color:"#28a745"}].map(t=>`
    <div class="card" style="margin-bottom: 24px;">
      <h3 style="
        color: ${t.color};
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid ${t.color};
      ">
        ${t.label}
      </h3>
      ${i[t.key].length>0?`
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-secondary);">
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">RANK</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">CLIMBER</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">POINTS</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">SENDS</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">HARDEST</th>
            </tr>
          </thead>
          <tbody>
            ${i[t.key].map((r,n)=>`
              <tr style="border-bottom: 1px solid var(--border-secondary);">
                <td style="padding: 12px 8px;">
                  <div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: ${n<3?t.color:"var(--bg-secondary)"};
                    color: ${n<3?"white":"var(--text-primary)"};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                  ">
                    ${n+1}
                  </div>
                </td>
                <td style="padding: 12px 8px;">
                  <div style="font-weight: 600; color: var(--text-primary);">${r.name}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="font-size: 20px; font-weight: 700; color: ${t.color};">${r.total_points}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="color: var(--text-primary);">${r.route_ascents||0}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="font-weight: 600; color: var(--text-primary);">${r.hardest_send||0}</div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `:`
        <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
          No climbers in this category yet
        </p>
      `}
    </div>
  `).join("")}function So(i){return`
    <div class="card">
      <h3 style="
        color: var(--color-primary);
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
        padding-bottom: 12px;
        border-bottom: 2px solid var(--color-primary);
      ">
        Hardest Sends
      </h3>
      <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
        Total points include route points + bonus games
      </p>
      ${i.length>0?`
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-secondary);">
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">RANK</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">CLIMBER</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">CATEGORY</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">HARDEST GRADE</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">TOTAL POINTS</th>
            </tr>
          </thead>
          <tbody>
            ${i.map((e,t)=>`
              <tr style="border-bottom: 1px solid var(--border-secondary);">
                <td style="padding: 12px 8px;">
                  <div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: ${t<3?["#FFD700","#C0C0C0","#CD7F32"][t]:"var(--bg-secondary)"};
                    color: ${t<3?"white":"var(--text-primary)"};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                  ">
                    ${t+1}
                  </div>
                </td>
                <td style="padding: 12px 8px;">
                  <div style="font-weight: 600; color: var(--text-primary);">${e.name}</div>
                </td>
                <td style="padding: 12px 8px;">
                  <span style="
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 11px;
                    background-color: ${qr(e.category)};
                    color: white;
                    text-transform: capitalize;
                  ">
                    ${e.category}
                  </span>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="font-size: 24px; font-weight: 700; color: var(--color-primary);">${e.hardest_send||0}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="color: var(--text-primary); font-weight: 600;">${e.total_points}</div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `:`
        <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
          No data yet
        </p>
      `}
    </div>
  `}function To(i){return`
    <div class="card">
      <h3 style="
        color: var(--color-primary);
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
        padding-bottom: 12px;
        border-bottom: 2px solid var(--color-primary);
      ">
        Most Ticks (Route Ascents Only)
      </h3>
      <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 8px;">
        <strong>Ticks count:</strong> Route ascents only (bonus games not included)
      </p>
      <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
        <strong>Total points:</strong> Route points + bonus games • <strong>Tiebreaker:</strong> Lower category wins (Recreational > Intermediate > Advanced)
      </p>
      ${i.length>0?`
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-secondary);">
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">RANK</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">CLIMBER</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">CATEGORY</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">TOTAL TICKS</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">TOTAL POINTS</th>
            </tr>
          </thead>
          <tbody>
            ${i.map((e,t)=>`
              <tr style="border-bottom: 1px solid var(--border-secondary);">
                <td style="padding: 12px 8px;">
                  <div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: ${t<3?["#FFD700","#C0C0C0","#CD7F32"][t]:"var(--bg-secondary)"};
                    color: ${t<3?"white":"var(--text-primary)"};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                  ">
                    ${t+1}
                  </div>
                </td>
                <td style="padding: 12px 8px;">
                  <div style="font-weight: 600; color: var(--text-primary);">${e.name}</div>
                </td>
                <td style="padding: 12px 8px;">
                  <span style="
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 11px;
                    background-color: ${qr(e.category)};
                    color: white;
                    text-transform: capitalize;
                  ">
                    ${e.category}
                  </span>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="font-size: 24px; font-weight: 700; color: var(--color-primary);">${e.route_ascents||0}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="color: var(--text-primary); font-weight: 600;">${e.total_points}</div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `:`
        <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
          No data yet
        </p>
      `}
    </div>
  `}function Ao(i){return!i||i.length===0?`
      <div class="card">
        <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
          No active bonus games yet
        </p>
      </div>
    `:i.map(e=>`
    <div class="card" style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin: 0;">
          ${e.name}
        </h3>
      </div>

      ${e.topClimbers&&e.topClimbers.length>0?`
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-secondary);">
              <th style="padding: 8px; text-align: left; color: var(--text-secondary); font-size: 12px; font-weight: 500; width: 40px;">Rank</th>
              <th style="padding: 8px; text-align: left; color: var(--text-secondary); font-size: 12px; font-weight: 500;">Climber</th>
              <th style="padding: 8px; text-align: left; color: var(--text-secondary); font-size: 12px; font-weight: 500;">Team</th>
              <th style="padding: 8px; text-align: right; color: var(--text-secondary); font-size: 12px; font-weight: 500; width: 80px;">Points</th>
            </tr>
          </thead>
          <tbody>
            ${e.topClimbers.map((t,r)=>{const n=t.climbers,s=n?.teams;return`
                <tr style="border-bottom: 1px solid var(--border-tertiary);">
                  <td style="padding: 12px 8px;">
                    <div style="
                      width: 28px;
                      height: 28px;
                      border-radius: 50%;
                      background: ${r===0?"#fbbf24":r===1?"#d1d5db":r===2?"#f59e0b":"var(--bg-tertiary)"};
                      color: ${r<3?"#000":"var(--text-secondary)"};
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: 600;
                      font-size: 14px;
                    ">
                      ${r+1}
                    </div>
                  </td>
                  <td style="padding: 12px 8px;">
                    <div style="color: var(--text-primary); font-weight: 500;">
                      ${n?.name||"Unknown"}
                    </div>
                    <div style="color: var(--text-secondary); font-size: 12px;">
                      ${n?.category?Co(n.category):""}
                    </div>
                  </td>
                  <td style="padding: 12px 8px; color: var(--text-secondary); font-size: 14px;">
                    ${s?.team_name||"N/A"}
                  </td>
                  <td style="padding: 12px 8px; text-align: right;">
                    <div style="color: var(--color-primary); font-weight: 600; font-size: 16px;">
                      ${t.points_awarded}
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `:`
        <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
          No entries yet for this game
        </p>
      `}
    </div>
  `).join("")}function Co(i){return i?i.charAt(0).toUpperCase()+i.slice(1):""}function qr(i){return{masters:"#6f42c1",advanced:"#dc3545",intermediate:"#fd7e14",recreational:"#28a745"}[i]||"#6c757d"}function $o(){K(),document.getElementById("refresh-btn")?.addEventListener("click",async()=>{await Ur()}),document.getElementById("leaderboard-selector")?.addEventListener("change",e=>{const t=e.target.value;document.querySelectorAll(".tab-content").forEach(n=>{n.style.display="none",n.classList.remove("active")});const r=document.getElementById(`tab-${t}`);r&&(r.style.display="block",r.classList.add("active"))})}let X="list",Ie=null;async function Io(){const i=document.querySelector("#app");i.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${G({title:"Bonus Games",currentPage:"bonus"})}
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
        <p style="color: var(--text-secondary); margin-top: 16px;">Loading bonus games...</p>
      </div>
    </div>
  `;try{X==="list"?await Re():X==="create"?Fr():X==="award"&&await De()}catch(e){E("Error loading bonus games: "+e.message)}}async function Re(){const i=document.querySelector("#app"),{data:e,error:t}=await y.from("bonus_games").select("*").order("created_at",{ascending:!1});if(t)throw t;const{data:r,error:n}=await y.from("bonus_entries").select("bonus_game_id, climber_id");if(n)throw n;const s={};r.forEach(o=>{s[o.bonus_game_id]=(s[o.bonus_game_id]||0)+1}),i.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${G({title:"Bonus Games",currentPage:"bonus"})}

      <div style="max-width: 1280px; margin: 0 auto; padding: 40px 24px;">
        <!-- Page Header -->
        <div class="page-header" style="margin-bottom: 32px;">
          <div style="flex: 1 1 auto;">
            <h2 class="page-title" style="font-size: 28px;">Bonus Games (${e.length})</h2>
            <p style="color: var(--text-secondary);">
              Create bonus challenges and award points to climbers
            </p>
          </div>
          <div class="page-actions">
            <button id="create-game-btn" class="btn btn-secondary btn-inline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create Bonus Game
            </button>
          </div>
        </div>

        ${e.length===0?`
          <!-- Empty State -->
          <div class="card" style="text-align: center; padding: 60px 20px;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; color: var(--text-secondary);">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <h3 style="color: var(--text-primary); font-size: 18px; margin-bottom: 8px;">
              No Bonus Games Yet
            </h3>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">
              Create bonus games to award extra points for special challenges
            </p>
            <button id="create-game-btn-empty" class="btn btn-primary">
              Create First Bonus Game
            </button>
          </div>
        `:`
          <!-- Games Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
            ${e.map(o=>`
              <div class="card" style="position: relative;">
                <!-- Active/Inactive Badge -->
                <div style="position: absolute; top: 16px; right: 16px;">
                  <span style="
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    background: ${o.is_active?"var(--color-success)":"var(--text-muted)"};
                    color: white;
                  ">
                    ${o.is_active?"Active":"Inactive"}
                  </span>
                </div>

                <!-- Game Info -->
                <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 8px; padding-right: 80px;">
                  ${o.name}
                </h3>
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                  <div>
                    <div style="color: var(--text-secondary); font-size: 12px;">Points</div>
                    <div style="color: var(--color-primary); font-size: 24px; font-weight: 600;">${o.points}</div>
                  </div>
                  <div>
                    <div style="color: var(--text-secondary); font-size: 12px;">Awarded To</div>
                    <div style="color: var(--text-primary); font-size: 24px; font-weight: 600;">${s[o.id]||0}</div>
                  </div>
                </div>

                <!-- Actions -->
                <div style="display: flex; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-secondary);">
                  <button class="btn btn-primary award-points-btn" data-game-id="${o.id}" style="flex: 1;">
                    Award Points
                  </button>
                  <button class="btn btn-secondary toggle-active-btn" data-game-id="${o.id}" data-is-active="${o.is_active}">
                    ${o.is_active?"Deactivate":"Activate"}
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    </div>
  `,K(),Oo()}function Fr(){const i=document.querySelector("#app");i.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${G({title:"Bonus Games",currentPage:"bonus"})}

      <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">
        <!-- Back Button -->
        <button id="back-to-list" class="btn btn-secondary" style="margin-bottom: 24px; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Bonus Games
        </button>

        <!-- Create Form -->
        <div class="card">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-bottom: 24px;">
            Create Bonus Game
          </h2>

          <form id="create-game-form">
            <!-- Game Name -->
            <div style="margin-bottom: 20px;">
              <label for="game-name" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Game Name *
              </label>
              <input
                type="text"
                id="game-name"
                name="name"
                placeholder="e.g., Fastest Flash, Hardest Boulder, Team Spirit"
                required
                class="form-input"
                style="width: 100%; box-sizing: border-box;"
              />
              <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">
                Choose a descriptive name for the bonus challenge
              </p>
            </div>

            <!-- Points -->
            <div style="margin-bottom: 20px;">
              <label for="game-points" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Points Awarded *
              </label>
              <input
                type="number"
                id="game-points"
                name="points"
                min="1"
                max="100"
                value="10"
                required
                class="form-input"
                style="width: 100%; box-sizing: border-box;"
              />
              <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">
                How many bonus points should climbers receive?
              </p>
            </div>

            <!-- Active Status -->
            <div style="margin-bottom: 24px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input
                  type="checkbox"
                  id="game-active"
                  name="is_active"
                  checked
                  style="width: 18px; height: 18px; cursor: pointer;"
                />
                <span style="color: var(--text-primary); font-weight: 500;">
                  Active (can be awarded immediately)
                </span>
              </label>
            </div>

            <!-- Error Container -->
            <div id="form-error" style="margin-bottom: 16px;"></div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              Create Bonus Game
            </button>
          </form>
        </div>
      </div>
    </div>
  `,K(),Po()}async function De(){const i=document.querySelector("#app");if(!Ie){X="list",await Re();return}const{data:e,error:t}=await y.from("bonus_games").select("*").eq("id",Ie).single();if(t)throw t;const{data:r,error:n}=await y.from("teams").select(`
      *,
      climbers (*)
    `).order("team_name");if(n)throw n;const{data:s,error:o}=await y.from("bonus_entries").select("id, climber_id, points_awarded").eq("bonus_game_id",Ie);if(o)throw o;const a={};s.forEach(l=>{a[l.climber_id]={entryId:l.id,points:l.points_awarded}}),i.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${G({title:"Bonus Games",currentPage:"bonus"})}

      <div style="max-width: 900px; margin: 0 auto; padding: 40px 24px;">
        <!-- Back Button -->
        <button id="back-to-list" class="btn btn-secondary" style="margin-bottom: 24px; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Bonus Games
        </button>

        <!-- Game Info Card -->
        <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);">
          <h2 style="color: white; font-size: 24px; font-weight: 600; margin-bottom: 8px;">
            ${e.name}
          </h2>
          <div style="color: rgba(255,255,255,0.9); font-size: 16px;">
            <strong>${e.points} points</strong> per climber
          </div>
        </div>

        <!-- Search/Filter -->
        <div class="card" style="margin-bottom: 24px;">
          <input
            type="text"
            id="search-climbers"
            placeholder="Search by climber or team name..."
            class="form-input"
            style="width: 100%; box-sizing: border-box;"
          />
        </div>

        <!-- Climbers List -->
        <div class="card">
          <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
            Select Climbers to Award
          </h3>

          <div id="climbers-list">
            ${r.map(l=>`
              <div class="team-section" data-team-name="${l.team_name.toLowerCase()}">
                <h4 style="color: var(--text-secondary); font-size: 14px; font-weight: 600; margin: 16px 0 8px; text-transform: uppercase;">
                  ${l.team_name}
                </h4>
                ${l.climbers.map(d=>{const c=a[d.id],u=!!c;return`
                    <div class="climber-item" data-climber-name="${d.name.toLowerCase()}" style="
                      padding: 12px;
                      border: 1px solid var(--border-secondary);
                      border-radius: 6px;
                      margin-bottom: 8px;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      background: ${u?"var(--bg-tertiary)":"var(--bg-secondary)"};
                    ">
                      <div>
                        <div style="color: var(--text-primary); font-weight: 500;">
                          ${d.name}
                        </div>
                        <div style="color: var(--text-secondary); font-size: 13px;">
                          ${d.category} • Grade ${d.redpoint_grade}
                        </div>
                      </div>
                      ${u?`
                        <div style="display: flex; gap: 8px; align-items: center;">
                          <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: var(--bg-secondary); border-radius: 4px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-success);">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                              <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            <span style="color: var(--text-primary); font-weight: 600; font-size: 14px;">
                              ${c.points} pts
                            </span>
                          </div>
                          <button class="btn btn-secondary edit-award-btn"
                                  data-entry-id="${c.entryId}"
                                  data-climber-id="${d.id}"
                                  data-current-points="${c.points}"
                                  style="padding: 6px 12px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button class="btn delete-award-btn"
                                  data-entry-id="${c.entryId}"
                                  data-climber-name="${d.name}"
                                  style="padding: 6px 12px; background: #fee2e2; color: #dc2626; border: 1px solid #fecaca;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      `:`
                        <div style="display: flex; gap: 8px; align-items: center;">
                          <input
                            type="number"
                            class="form-input points-input"
                            data-climber-id="${d.id}"
                            value="${e.points}"
                            min="1"
                            max="999"
                            style="width: 80px; padding: 6px 8px; font-size: 14px;"
                            placeholder="Points"
                          />
                          <button class="btn btn-primary award-to-climber-btn" data-climber-id="${d.id}" data-climber-name="${d.name}" style="padding: 6px 16px;">
                            Award
                          </button>
                        </div>
                      `}
                    </div>
                  `}).join("")}
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `,K(),Ro()}function Oo(){document.querySelectorAll("#create-game-btn, #create-game-btn-empty").forEach(i=>{i?.addEventListener("click",()=>{X="create",Fr()})}),document.querySelectorAll(".award-points-btn").forEach(i=>{i.addEventListener("click",async e=>{Ie=e.target.getAttribute("data-game-id"),X="award",await De()})}),document.querySelectorAll(".toggle-active-btn").forEach(i=>{i.addEventListener("click",async e=>{const t=e.target.getAttribute("data-game-id"),r=e.target.getAttribute("data-is-active")==="true",{error:n}=await y.from("bonus_games").update({is_active:!r}).eq("id",t);n?E("Failed to update game: "+n.message):(j(`Game ${r?"deactivated":"activated"}`),await Re())})})}function Po(){document.getElementById("back-to-list")?.addEventListener("click",()=>{X="list",Re()}),document.getElementById("create-game-form")?.addEventListener("submit",async i=>{i.preventDefault();const e=new FormData(i.target),t=e.get("name"),r=parseInt(e.get("points")),n=e.get("is_active")==="on";try{const{data:s}=await y.auth.getUser(),{error:o}=await y.from("bonus_games").insert({name:t,points:r,is_active:n,created_by:s.user.id});if(o)throw o;j("Bonus game created successfully!"),X="list",await Re()}catch(s){E("Failed to create bonus game: "+s.message)}})}function Ro(){document.getElementById("back-to-list")?.addEventListener("click",()=>{Ie=null,X="list",Re()}),document.getElementById("search-climbers")?.addEventListener("input",e=>{const t=e.target.value.toLowerCase(),r=document.querySelectorAll(".climber-item"),n=document.querySelectorAll(".team-section");r.forEach(s=>{s.getAttribute("data-climber-name").includes(t)?s.style.display="flex":s.style.display="none"}),n.forEach(s=>{const o=s.getAttribute("data-team-name");s.querySelectorAll('.climber-item[style*="display: flex"]').length>0||o.includes(t)?s.style.display="block":s.style.display="none"})}),document.querySelectorAll(".award-to-climber-btn").forEach(e=>{e.addEventListener("click",async t=>{const r=t.target.getAttribute("data-climber-id"),n=t.target.getAttribute("data-climber-name"),s=document.querySelector(`.points-input[data-climber-id="${r}"]`),o=parseInt(s?.value||"0",10);if(!o||o<1||o>999){E("Please enter valid points (1-999)");return}try{const{error:a}=await y.from("bonus_entries").insert({climber_id:r,bonus_game_id:Ie,points_awarded:o});if(a)throw a;j(`${o} bonus points awarded to ${n}!`),await De()}catch(a){a.code==="23505"?E("Points already awarded to this climber"):E("Failed to award points: "+a.message)}})}),document.querySelectorAll(".edit-award-btn").forEach(e=>{e.addEventListener("click",async t=>{const r=t.currentTarget.getAttribute("data-entry-id"),n=parseInt(t.currentTarget.getAttribute("data-current-points")),s=prompt(`Enter new points value (current: ${n}):`,n);if(s===null)return;const o=parseInt(s,10);if(!o||o<1||o>999){E("Please enter valid points (1-999)");return}try{const{error:a}=await y.from("bonus_entries").update({points_awarded:o}).eq("id",r);if(a)throw a;j(`Points updated to ${o}!`),await De()}catch(a){E("Failed to update points: "+a.message)}})}),document.querySelectorAll(".delete-award-btn").forEach(e=>{e.addEventListener("click",async t=>{const r=t.currentTarget.getAttribute("data-entry-id"),n=t.currentTarget.getAttribute("data-climber-name");if(confirm(`Remove bonus points from ${n}?`))try{const{error:s}=await y.from("bonus_entries").delete().eq("id",r);if(s)throw s;j(`Bonus points removed from ${n}`),await De()}catch(s){E("Failed to delete award: "+s.message)}})})}async function jo(){const i=document.querySelector("#app");i.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${G({title:"Leaderboard Nudges",currentPage:"nudge"})}
      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <p style="color: var(--text-secondary); text-align: center;">Loading nudge settings...</p>
      </main>
    </div>
  `;try{const{data:e,error:t}=await y.from("competition_settings").select("*").single();if(t)throw t;const{data:r,error:n}=await y.from("leaderboard_nudges").select("*").order("sent_at",{ascending:!1}).limit(10);Lo(e,n?[]:r)}catch{E("Failed to load nudge settings")}}function Lo(i,e){const t=document.querySelector("#app"),r=i?.last_auto_nudge_sent?new Date(i.last_auto_nudge_sent).toLocaleString():"Never";t.innerHTML=`
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${G({title:"Leaderboard Nudges",currentPage:"nudge"})}

      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <!-- Page Header -->
        <div class="page-header" style="margin-bottom: 24px;">
          <div style="flex: 1 1 auto;">
            <h2 class="page-title">Leaderboard Nudges & Announcements</h2>
            <p style="color: var(--text-secondary); font-size: 14px;">
              Send manual nudges or announcements to all teams
            </p>
          </div>
        </div>

        <!-- Auto-Nudge Status Card -->
        <div class="card gradient-primary" style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
            <div>
              <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px; opacity: 0.9;">
                Auto-Nudge Status
              </h3>
              <p style="font-size: 13px; opacity: 0.8;">
                Automatic nudges every ${i?.nudge_interval_hours||3} hours during competition
              </p>
            </div>
            <div style="
              padding: 4px 12px;
              border-radius: 20px;
              background: ${i?.auto_nudge_enabled?"rgba(16, 185, 129, 0.2)":"rgba(239, 68, 68, 0.2)"};
              font-size: 12px;
              font-weight: 600;
            ">
              ${i?.auto_nudge_enabled?"Enabled":"Disabled"}
            </div>
          </div>
          <div style="font-size: 13px; opacity: 0.9;">
            <strong>Last auto-nudge:</strong> ${r}
          </div>
          <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">
            <strong>Next scheduled:</strong> ${Bo(i)}
          </div>
        </div>

        <!-- Send Manual Nudge Card -->
        <div class="card" style="margin-bottom: 24px;">
          <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
            Send Manual Nudge
          </h3>

          <form id="nudge-form">
            <!-- Message Input -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; color: var(--text-secondary); font-size: 13px; margin-bottom: 6px;">
                Message *
              </label>
              <textarea
                id="nudge-message"
                class="form-input"
                rows="3"
                placeholder="e.g., 'Check out the current standings!' or 'Lunch break in 30 minutes!'"
                required
                style="width: 100%; resize: vertical;"
              ></textarea>
              <div style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">
                This message will be shown to all teams
              </div>
            </div>

            <!-- Show Leaderboard Toggle -->
            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input
                  type="checkbox"
                  id="show-leaderboard"
                  style="width: 18px; height: 18px; margin-right: 8px;"
                />
                <span style="color: var(--text-primary); font-size: 14px;">
                  Show leaderboard with nudge
                </span>
              </label>
              <div style="color: var(--text-secondary); font-size: 12px; margin-top: 4px; margin-left: 26px;">
                When enabled, shows top 3 teams + team's current position
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary btn-inline btn-center" style="width: 100%;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
                <path d="M22 2L11 13"/>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
              Send Nudge Now
            </button>
          </form>
        </div>

        <!-- Recent Nudges History -->
        <div class="card">
          <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
            Recent Nudges
          </h3>

          <div id="recent-nudges-list">
            ${Hr(e)}
          </div>
        </div>
      </main>
    </div>
  `,Mo()}function Hr(i){return!i||i.length===0?`
      <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
        No nudges sent yet
      </p>
    `:i.map(e=>`
    <div class="nudge-item" style="
      border: 1px solid var(--border-secondary);
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 12px;
      background: var(--bg-secondary);
    ">
      <!-- Row 1: Type, Status, Delete Button -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            background: ${e.nudge_type==="auto"?"var(--bg-tertiary)":"#dbeafe"};
            color: ${e.nudge_type==="auto"?"var(--text-secondary)":"#1e40af"};
          ">
            ${e.nudge_type.toUpperCase()}
          </span>
          <span style="
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            background: ${e.is_active?"#d1fae5":"#fee2e2"};
            color: ${e.is_active?"#065f46":"#991b1b"};
          ">
            ${e.is_active?"Active":"Inactive"}
          </span>
          ${e.show_leaderboard?`
            <span title="Shows leaderboard" style="color: var(--color-primary);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
            </span>
          `:""}
        </div>
        <button
          class="delete-nudge-btn"
          data-nudge-id="${e.id}"
          style="
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s;
          "
          onmouseover="this.style.background='#fee2e2'; this.style.color='#dc2626'"
          onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)'"
          title="Delete nudge"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>

      <!-- Row 2: Message -->
      <div style="color: var(--text-primary); font-size: 14px; margin-bottom: 8px; line-height: 1.4;">
        ${e.message}
      </div>

      <!-- Row 3: Timestamp -->
      <div style="color: var(--text-secondary); font-size: 12px;">
        ${new Date(e.sent_at).toLocaleString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})}
      </div>
    </div>
  `).join("")}function Bo(i){if(!i?.auto_nudge_enabled)return"Disabled";const e=new Date,t=[9,12,15],r=e.getHours(),n=t.find(s=>s>r);if(n){const s=new Date(e);return s.setHours(n,0,0,0),s.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}return"Tomorrow 9:00 AM"}async function Wr(){try{const{data:i,error:e}=await y.from("leaderboard_nudges").select("*").order("sent_at",{ascending:!1}).limit(10);if(e)throw e;const t=document.getElementById("recent-nudges-list");t&&(t.innerHTML=Hr(i||[]),Gr())}catch{E("Failed to refresh nudges list")}}async function zo(i){try{const{error:e}=await y.from("leaderboard_nudges").delete().eq("id",i);if(e)throw e;return j("Nudge deleted successfully"),!0}catch(e){return E("Failed to delete nudge: "+e.message),!1}}function Gr(){document.querySelectorAll(".delete-nudge-btn").forEach(i=>{i.addEventListener("click",async e=>{const t=e.currentTarget.getAttribute("data-nudge-id");confirm("Delete this nudge? Teams who haven't dismissed it will no longer see it.")&&await zo(t)&&await Wr()})})}function Mo(){K();const i=document.getElementById("nudge-form");i?.addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("nudge-message").value.trim(),r=document.getElementById("show-leaderboard").checked;if(!t){E("Please enter a message");return}try{const{error:n}=await y.from("leaderboard_nudges").insert({message:t,nudge_type:"manual",show_leaderboard:r,sent_by:(await y.auth.getUser()).data.user?.id});if(n)throw n;j("Nudge sent successfully!"),i.reset(),setTimeout(()=>Wr(),500)}catch(n){E("Failed to send nudge: "+n.message)}}),Gr()}async function No(){const i=document.getElementById("app");i.innerHTML=`
    <div style="min-height: 100vh; background-color: var(--bg-primary);">
      ${G({title:"Competition Control",currentPage:"competition"})}

      <main class="container" style="padding: 16px 16px 32px;">

        <!-- Current Status Card -->
        <div class="card" style="margin-bottom: 16px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h2 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0;">
              Current Status
            </h2>
            <button id="refresh-btn" class="btn btn-secondary btn-inline" style="font-size: 12px; padding: 4px 8px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              Refresh
            </button>
          </div>

          <!-- Status Display -->
          <div id="status-display">
            <div style="text-align: center; padding: 20px; color: var(--text-secondary); font-size: 13px;">
              Loading...
            </div>
          </div>
        </div>

        <!-- Manual Control Card -->
        <div class="card" style="margin-bottom: 16px; padding: 16px;">
          <h2 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">
            Manual Control
          </h2>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <button id="btn-open" class="btn btn-inline btn-center" style="
              background-color: #28a745;
              color: white;
              border: none;
              padding: 10px;
              font-size: 13px;
              font-weight: 500;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v12M6 12h12"/>
              </svg>
              Open
            </button>

            <button id="btn-close" class="btn btn-inline btn-center" style="
              background-color: #dc3545;
              color: white;
              border: none;
              padding: 10px;
              font-size: 13px;
              font-weight: 500;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9l-6 6M9 9l6 6"/>
              </svg>
              Close
            </button>
          </div>

          <div style="
            padding: 8px 10px;
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            border-radius: 4px;
            font-size: 11px;
            color: #856404;
            line-height: 1.4;
          ">
            <strong>Note:</strong> Manual control overrides automatic window timing
          </div>
        </div>

        <!-- Scoring Window Times Card -->
        <div class="card" style="padding: 16px;">
          <h2 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">
            Scoring Window Times
          </h2>

          <form id="window-form">
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 12px;">

              <!-- Start Time -->
              <div>
                <label style="display: block; font-size: 12px; font-weight: 500; color: var(--text-primary); margin-bottom: 4px;">
                  Competition Start (AWST)
                </label>
                <input
                  type="datetime-local"
                  id="comp-start"
                  required
                  class="form-input"
                  style="width: 100%; padding: 8px; font-size: 13px; border: 1px solid var(--border-primary); border-radius: 4px; background-color: var(--bg-secondary);"
                />
              </div>

              <!-- End Time -->
              <div>
                <label style="display: block; font-size: 12px; font-weight: 500; color: var(--text-primary); margin-bottom: 4px;">
                  Competition End (AWST)
                </label>
                <input
                  type="datetime-local"
                  id="comp-end"
                  required
                  class="form-input"
                  style="width: 100%; padding: 8px; font-size: 13px; border: 1px solid var(--border-primary); border-radius: 4px; background-color: var(--bg-secondary);"
                />
              </div>

            </div>

            <button type="submit" class="btn btn-primary btn-inline btn-center" style="
              width: 100%;
              padding: 10px;
              font-size: 13px;
              font-weight: 500;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Window Times
            </button>
          </form>
        </div>

      </main>
    </div>

    <style>
      @media (min-width: 640px) {
        #window-form > div {
          grid-template-columns: 1fr 1fr !important;
        }
      }
    </style>
  `,Fo(),await Ge()}async function Ge(){const i=document.getElementById("status-display");try{const{data:e,error:t}=await y.from("competition_settings").select("*").single();if(t)throw t;const r=new Date,n=new Date(e.competition_start),s=new Date(e.competition_end),o=r>=n&&r<=s,a=e.is_open||o,l=g=>new Date(g).toLocaleString("en-AU",{timeZone:"Australia/Perth",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}),d=g=>{const m=new Date(g),f=m.getTimezoneOffset()*6e4;return new Date(m.getTime()-f).toISOString().slice(0,16)};document.getElementById("comp-start").value=d(e.competition_start),document.getElementById("comp-end").value=d(e.competition_end);const c=a?"#28a745":"#dc3545",u=a?"OPEN":"CLOSED",h=a?'<circle cx="12" cy="12" r="10" fill="#28a745"/>':'<circle cx="12" cy="12" r="10" fill="#dc3545"/><path d="M15 9l-6 6M9 9l6 6" stroke="white" stroke-width="2"/>',p=e.is_open?"Manually opened by admin":o?"Within scheduled window":"Outside scheduled window";i.innerHTML=`
      <!-- Main Status -->
      <div style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background-color: ${a?"rgba(40, 167, 69, 0.1)":"rgba(220, 53, 69, 0.1)"};
        border: 2px solid ${c};
        border-radius: 6px;
        margin-bottom: 12px;
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          ${h}
        </svg>
        <div style="flex: 1;">
          <div style="font-size: 18px; font-weight: 700; color: ${c};">
            ${u}
          </div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
            ${p}
          </div>
        </div>
      </div>

      <!-- Details Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <div style="padding: 10px; background-color: var(--bg-secondary); border-radius: 4px;">
          <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">
            Manual Override
          </div>
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">
            ${e.is_open?"Active":"Inactive"}
          </div>
        </div>

        <div style="padding: 10px; background-color: var(--bg-secondary); border-radius: 4px;">
          <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">
            Scheduled Window
          </div>
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">
            ${o?"Active":"Inactive"}
          </div>
        </div>
      </div>

      <!-- Window Times -->
      <div style="padding: 10px; background-color: var(--bg-secondary); border-radius: 4px;">
        <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase; font-weight: 600;">
          Scheduled Times
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">Start:</span>
            <span style="color: var(--text-primary); font-weight: 500;">${l(e.competition_start)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">End:</span>
            <span style="color: var(--text-primary); font-weight: 500;">${l(e.competition_end)}</span>
          </div>
        </div>
      </div>
    `}catch(e){i.innerHTML=`
      <div style="padding: 12px; background-color: rgba(220,53,69,0.1); border: 1px solid #dc3545; border-radius: 4px; color: #dc3545; font-size: 12px;">
        Error loading status: ${e.message}
      </div>
    `}}async function Do(){try{const{data:i,error:e}=await y.from("competition_settings").select("*").single();if(e)throw e;const{data:t,error:r}=await y.from("competition_settings").update({is_open:!0,updated_at:new Date().toISOString()}).eq("id",i.id).select();if(r)throw r;j("Competition opened successfully"),await Ge()}catch(i){E("Failed to open competition: "+i.message)}}async function Uo(){try{const{data:i,error:e}=await y.from("competition_settings").select("*").single();if(e)throw e;const{data:t,error:r}=await y.from("competition_settings").update({is_open:!1,updated_at:new Date().toISOString()}).eq("id",i.id).select();if(r)throw r;j("Competition closed successfully"),await Ge()}catch(i){E("Failed to close competition: "+i.message)}}async function qo(i){i.preventDefault();const e=document.getElementById("comp-start").value,t=document.getElementById("comp-end").value;if(!e||!t){nr("Please fill in both start and end times");return}const r=new Date(e),n=new Date(t);if(n<=r){nr("End time must be after start time");return}try{const{data:s,error:o}=await y.from("competition_settings").select("id").single();if(o)throw o;const{error:a}=await y.from("competition_settings").update({competition_start:r.toISOString(),competition_end:n.toISOString(),updated_at:new Date().toISOString()}).eq("id",s.id);if(a)throw a;j("Window times updated successfully"),await Ge()}catch(s){E("Failed to update times: "+s.message)}}function Fo(){K(),document.getElementById("refresh-btn")?.addEventListener("click",Ge),document.getElementById("btn-open")?.addEventListener("click",Do),document.getElementById("btn-close")?.addEventListener("click",Uo),document.getElementById("window-form")?.addEventListener("submit",qo)}W.init().then(()=>{W.onAuthStateChange(async(i,e)=>{if(i==="SIGNED_IN"){j("Successfully signed in!");const{data:t}=await y.rpc("is_admin");t?z.navigate("/admin/dashboard"):z.navigate("/dashboard")}else i==="SIGNED_OUT"&&(_s("Signed out"),z.navigate("/login"))})});z.registerRoutes({"/":Ho,"/login":Ss,"/dashboard":Mr,"/admin":Vs,"/admin/dashboard":ro,"/admin/teams":Z,"/admin/leaderboards":Ur,"/admin/bonus":Io,"/admin/nudge":jo,"/admin/competition":No});z.beforeEach(async(i,e,t)=>{const r=["/dashboard"],n=["/admin/dashboard","/admin/teams","/admin/leaderboards","/admin/competition","/admin/results","/admin/settings"];if(r.includes(i)&&!W.isAuthenticated())return t("/login"),!1;if(n.includes(i)){if(!W.isAuthenticated())return t("/admin"),!1;try{const{data:s,error:o}=await y.rpc("is_admin");if(o||!s)return t("/"),!1}catch{return t("/"),!1}}return!0});function Ho(){const i=document.querySelector("#app");i.innerHTML=`
    <div class="min-h-screen">
      <!-- GitHub-style header -->
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Quarry Madness 2025</h1>
            </div>
            <div style="display: flex; gap: 12px;">
              <button class="btn btn-header btn-sm btn-inline" onclick="window.location.hash='#/admin'">
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="container" style="padding-top: 32px;">
        <div class="card max-w-2xl mx-auto text-center">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 700; margin: 0 0 6px;">
            Quarry Madness 2025
          </h2>
          <p style="color: var(--text-secondary); margin: 0 0 10px;">
            A social, 12‑hour climbing jam by CAWA
          </p>

          <p style="color: var(--text-secondary); margin: 0 0 8px;">
            This app helps teams log ascents and track points throughout the day — simple, fast, and mobile‑friendly.
          </p>
          <p style="color: var(--text-muted); margin: 0 0 16px;">
            Saturday 18 October 2025 • 6 am – 6 pm
          </p>

          <button class="btn btn-primary btn-cta gradient-primary" onclick="window.location.hash='#/login'">
            Log In to Your Team
          </button>
        </div>
      </main>
    </div>
  `}z.init();
//# sourceMappingURL=index-DTRBb4jW.js.map
