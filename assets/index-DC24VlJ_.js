(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=5e3,t=2**53-1,n=-(2**53-1),r=e=>typeof e==`number`&&Number.isSafeInteger(e);function i(e,t){return e<t?-1:+(e>t)}function a(i,a){let o=a?`${a}.`:``;if(!Array.isArray(i))return{error:`${o}boxes 必須是陣列`};if(i.length===0)return{error:`${o}boxes 不可為空陣列`};if(i.length>5e3)return{error:`${o}箱數 ${i.length} 超過硬限 MAX_LAYOUT_BOXES=${e}`};let s=Array(i.length);for(let e=0;e<i.length;e++){if(!(e in i))return{error:`${o}boxes 為稀疏陣列（索引 ${e} 為洞）`};let t=i[e];if(typeof t!=`object`||!t||Array.isArray(t))return{error:`${o}boxes[${e}] 必須是物件（實際 ${t===null?`null`:typeof t}）`};if(!r(t.x)||!r(t.y))return{error:`${o}boxes[${e}].x/y 必須是有限安全整數（實際 x=${String(t.x)}, y=${String(t.y)}）`};if(!r(t.w)||t.w<=0)return{error:`${o}boxes[${e}].w 必須是正安全整數（實際 ${String(t.w)}）`};if(!r(t.h)||t.h<=0)return{error:`${o}boxes[${e}].h 必須是正安全整數（實際 ${String(t.h)}）`};let n=t.x+t.w,a=t.y+t.h;if(!r(n))return{error:`${o}boxes[${e}] x+w=${String(n)} 超出安全整數範圍`};if(!r(a))return{error:`${o}boxes[${e}] y+h=${String(a)} 超出安全整數範圍`};s[e]={x:t.x,y:t.y,w:t.w,h:t.h,x2:n,y2:a}}let c=t,l=t,u=n,d=n;for(let e of s)e.x<c&&(c=e.x),e.y<l&&(l=e.y),e.x2>u&&(u=e.x2),e.y2>d&&(d=e.y2);let f=u-c,p=d-l;return!r(f)||!r(p)?{error:`${o}外框跨度超出安全整數範圍（width=${String(f)}, height=${String(p)}）`}:{boxes:s,bounds:{minX:c,minY:l,maxX:u,maxY:d,width:f,height:p}}}function o(e,t,n){if(e.length===0)return t<n?[[t,n]]:[];e.sort((e,t)=>i(e[0],t[0])||i(e[1],t[1]));let r=[],a=t;for(let t=0;t<e.length;t++){let i=e[t][0],o=e[t][1];if(!(o<=a)&&(i>a&&r.push([a,i]),a=o,a>=n))break}return a<n&&r.push([a,n]),r}var s={left:`左側`,right:`右側`,bottom:`下側`,top:`上側`};function c(e,t,n){return n.map(([n,r])=>{let i=e===`left`||e===`right`?`y`:`x`;return`${s[e]}外緣缺口：${i===`y`?`x`:`y`}=${t}，${i}∈[${n},${r}]（缺口寬 ${r-n}mm）`})}function l(e){let t=a(e,``);return t.error?null:{...t.bounds}}function u(e){let t=a(e,``);if(t.error)return{valid:!1,flat:!1,bounds:null,errors:[t.error]};let{boxes:n,bounds:r}=t,{minX:i,minY:s,maxX:l,maxY:u}=r,d=[],f=[],p=[],m=[],h=[];for(let e of n)e.x===i&&f.push([e.y,e.y2]),e.x2===l&&p.push([e.y,e.y2]),e.y===s&&m.push([e.x,e.x2]),e.y2===u&&h.push([e.x,e.x2]);return d.push(...c(`left`,i,o(f,s,u))),d.push(...c(`right`,l,o(p,s,u))),d.push(...c(`bottom`,s,o(m,i,l))),d.push(...c(`top`,u,o(h,i,l))),{valid:!0,flat:d.length===0,bounds:{...r},errors:d}}function d(e,t){let n=a(e,`A`),r=a(t,`B`),i=[];if(n.error&&i.push(n.error),r.error&&i.push(r.error),i.length>0)return{aligned:!1,aBounds:n.error?null:{...n.bounds},bBounds:r.error?null:{...r.bounds},errors:i};let o=n.bounds,s=r.bounds;for(let e of[`minX`,`minY`,`maxX`,`maxY`])o[e]!==s[e]&&i.push(`外框未對齊：${e} A=${o[e]} vs B=${s[e]}`);return{aligned:i.length===0,aBounds:{...o},bBounds:{...s},errors:i}}var f=[`palletL`,`palletW`,`palletH`,`boxL`,`boxW`,`boxH`,`maxTotalH`],p={palletL:`棧板長`,palletW:`棧板寬`,palletH:`棧板高`,boxL:`紙箱長`,boxW:`紙箱寬`,boxH:`紙箱高`,maxTotalH:`最高總高度`},m={maxDim:1e5,maxPerLevel:5e3,maxLevels:200,maxTotalBoxes:5e4,solverDeadlineMs:4e3,exactDeadlineMs:800};function h(e){let t=[],n={};for(let r of f){let i=e?e[r]:void 0;typeof i!=`number`||!Number.isFinite(i)?t.push(`${p[r]}必須是有限數字`):Number.isSafeInteger(i)?i<=0?t.push(`${p[r]}必須是正數`):i>m.maxDim?t.push(`${p[r]}不可超過 ${m.maxDim} mm（硬限制）`):n[r]=i:t.push(`${p[r]}必須是整數毫米且不可超過安全整數範圍（不接受小數或超大整數）`)}return{ok:t.length===0,errors:t,values:n}}function g(e,t,n,r){let i=Math.floor(e/n)*Math.floor(t/r),a=Math.floor(e/r)*Math.floor(t/n);return i>=a?{count:i,rot:0}:{count:a,rot:1}}function _(e,t,n,r,i={}){var a,o;let s=Math.min(n,r),c={n:0,cap:(a=i.nodeCap)==null?6e4:a,exhausted:!1},l=(o=i.deadline)==null?Date.now()+m.solverDeadlineMs:o,u=new Map,d=new Map,f=!1;function p(e){if(d.has(e))return d.get(e);let t=new Set;for(let i=0;i*n<=e-s;i++)for(let a=0;i*n+a*r<=e-s;a++){let o=i*n+a*r;o>=s&&e-o>=s&&t.add(o)}let i=[...t].sort((e,t)=>e-t);return d.set(e,i),i}function h(e,t){return Math.floor(e*t/(n*r))}function _(){return c.exhausted?!0:Date.now()>l&&(f=!0,c.exhausted=!0,!0)}function v(e,t,i){let a=e+`,`+t;if(u.has(a))return u.get(a);let o=g(e,t,n,r),s={count:o.count,mode:`grid`,rot:o.rot,l:e,w:t};if(c.exhausted||i>=6||o.count>=h(e,t))return u.set(a,s),s;if(c.n++,c.n>c.cap||Date.now()>l)return Date.now()>l&&(f=!0),c.exhausted=!0,u.set(a,s),s;for(let n of p(e)){let r=v(n,t,i+1);if(_())break;let a=v(e-n,t,i+1);if(_())break;let o=r.count+a.count;if(o>s.count&&(s={count:o,mode:`split`,axis:`x`,c:n,left:r,right:a,l:e,w:t},o>=h(e,t)))break}if(!c.exhausted&&s.count<h(e,t))for(let n of p(t)){let r=v(e,n,i+1);if(_())break;let a=v(e,t-n,i+1);if(_())break;let o=r.count+a.count;if(o>s.count&&(s={count:o,mode:`split`,axis:`y`,c:n,left:r,right:a,l:e,w:t},o>=h(e,t)))break}return u.set(a,s),s}let y=v(e,t,0),b=c.exhausted;if(b){let i=[],a=g(e,t,n,r);i.push({count:a.count,mode:`grid`,rot:a.rot,l:e,w:t});for(let a of p(e)){if(Date.now()>l)break;for(let o of[0,1])for(let s of[0,1]){let c=o===0?Math.floor(a/n)*Math.floor(t/r):Math.floor(a/r)*Math.floor(t/n),l=s===0?Math.floor((e-a)/n)*Math.floor(t/r):Math.floor((e-a)/r)*Math.floor(t/n);i.push({count:c+l,mode:`split`,axis:`x`,c:a,left:{count:c,mode:`grid`,rot:o,l:a,w:t},right:{count:l,mode:`grid`,rot:s,l:e-a,w:t},l:e,w:t})}}i.sort((e,t)=>t.count-e.count),y=i[0]}return{decision:y,count:y.count,budgetExhausted:b,timedOut:f}}function v(e,t,n){let r=[];function i(e,a,o){if(e.mode===`grid`){let i=e.rot===0?t:n,s=e.rot===0?n:t,c=Math.floor(e.l/i),l=Math.floor(e.w/s);for(let t=0;t<c;t++)for(let n=0;n<l;n++)r.push({x:a+t*i,y:o+n*s,w:i,h:s,rot:e.rot})}else e.axis===`x`?(i(e.left,a,o),i(e.right,a+e.c,o)):(i(e.left,a,o),i(e.right,a,o+e.c))}return i(e,0,0),r}function y(e,t,n,r,i,a={}){var o;if(Math.floor(e*t/(n*r))>m.maxPerLevel)return null;let s=e=>{let t=new Set;for(let i=0;i*n<=e;i++)for(let a=0;i*n+a*r<=e;a++)t.add(i*n+a*r);return[...t].sort((e,t)=>e-t)},c=s(e),l=s(t),u=[];for(let i of[0,1]){let a=i===0?n:r,o=i===0?r:n;for(let n of c)for(let r of l)n+a<=e&&r+o<=t&&u.push({x:n,y:r,w:a,h:o,rot:i});if(i===1&&n===r)break}if(u.length>64)return null;let d=u.length,f=(e,t)=>e.x<t.x+t.w&&t.x<e.x+e.w&&e.y<t.y+t.h&&t.y<e.y+e.h,p=(o=a.deadline)==null?Date.now()+m.exactDeadlineMs:o,h=i,g=[],_=null,v=!1,y=0;function b(e,t){if(v)return;if(++y%256==0&&Date.now()>p){v=!0;return}if(t+(d-e)<=h)return;if(e===d){t>h&&(h=t,_=g.slice());return}let n=u[e];g.some(e=>f(e,n))||(g.push(n),b(e+1,t+1),g.pop()),b(e+1,t)}return b(0,0),v||!_?null:{boxes:_,count:h}}var b=1e3,x=200,S=400;function C(e,t,n,r,i={}){var a;let o=Math.min(n,r);if(Math.floor(e*t/(n*r))>b)return null;let s=(a=i.deadline)==null?Date.now()+m.solverDeadlineMs:a,c=new Map;function l(e){if(c.has(e))return c.get(e);let t=new Set;for(let i=0;i*n<=e-o;i++)for(let a=0;i*n+a*r<=e-o;a++){let s=i*n+a*r;s>=o&&e-s>=o&&t.add(s)}let i=[...t].sort((e,t)=>e-t);return c.set(e,i),i}if(l(e).length+l(t).length>x)return null;let d=new Map,f=new Set,p=!1;function h(e,t){let i=g(e,t,n,r),a=i.rot===0?n:r,o=i.rot===0?r:n,s=[];for(let n=0;n<Math.floor(e/a);n++)for(let e=0;e<Math.floor(t/o);e++)s.push({x:n*a,y:e*o,w:a,h:o,rot:i.rot});return s}function _(e,t){let n=e+`,`+t;if(d.has(n))return d.get(n);if(p||f.size>=S){let r=h(e,t);return d.set(n,r),r}f.add(n);let r=h(e,t),i=e=>{if(!e||e.length===0||e.length<=r.length)return;let t=u(e);t.valid&&t.flat&&(r=e)};for(let n of l(e)){if(Date.now()>s){p=!0;break}let r=_(n,t),a=_(e-n,t);i(r),i(a),i(r.concat(a.map(e=>({...e,x:e.x+n}))))}if(!p)for(let n of l(t)){if(Date.now()>s){p=!0;break}let r=_(e,n),a=_(e,t-n);i(r),i(a),i(r.concat(a.map(e=>({...e,y:e.y+n}))))}return d.set(n,r),r}return{boxes:_(e,t),timedOut:p}}function w(e){let{layout:t,palletL:n,palletW:r,boxL:i,boxW:a,perLevel:o,levels:s,totalBoxes:c}=e,l=[];t.length!==o&&l.push(`runtime: layout 筆數 ${t.length} 不等於 perLevel ${o}`),c!==o*s&&l.push(`runtime: totalBoxes ${c} 不等於 perLevel*levels`),t.length>m.maxPerLevel&&l.push(`runtime: layout 超過硬上限 ${m.maxPerLevel}`);let u=[...t].sort((e,t)=>e.x-t.x),d=[];for(let e of u){(!Number.isSafeInteger(e.x)||!Number.isSafeInteger(e.y)||!Number.isSafeInteger(e.w)||!Number.isSafeInteger(e.h))&&l.push(`runtime: 非整數座標: ${JSON.stringify(e)}`),(e.x<0||e.y<0)&&l.push(`runtime: 負座標: ${JSON.stringify(e)}`),(e.x+e.w>n||e.y+e.h>r)&&l.push(`runtime: 越界: ${JSON.stringify(e)} 棧板 ${n}x${r}`),new Set([`${e.w}x${e.h}`,`${e.h}x${e.w}`]).has(`${i}x${a}`)||l.push(`runtime: 箱尺寸錯誤: ${JSON.stringify(e)}`);for(let t=d.length-1;t>=0;t--){let n=d[t];n.x+n.w<=e.x?d.splice(t,1):n.x<e.x+e.w&&e.x<n.x+n.w&&n.y<e.y+e.h&&e.y<n.y+n.h&&l.push(`runtime: 重疊: ${JSON.stringify(n)} vs ${JSON.stringify(e)}`)}d.push(e)}return l}function T(e){let t=h(e);if(!t.ok)return{ok:!1,errors:t.errors};let{palletL:n,palletW:r,palletH:i,boxL:a,boxW:o,boxH:s,maxTotalH:c}=t.values,l=c-i,d=l>=s?Math.floor(l/s):0,f=[];d>m.maxLevels&&f.push(`層數 ${d} 超過上限 ${m.maxLevels} 層（請降低最高總高度或增加紙箱高度）`);let p=Math.floor(n*r/(a*o));if(p>m.maxPerLevel&&f.push(`每層箱數理論上界 ${p} 超過上限 ${m.maxPerLevel} 箱（紙箱相對棧板過小，請改用更大的紙箱尺寸）`),f.length>0)return{ok:!1,errors:f};let g=Date.now()+m.solverDeadlineMs,b=_(n,r,a,o,{deadline:g}),x=[];b.count>0&&x.push({count:b.count,decision:b.decision});let S=!1;if(b.count>0){let e=y(n,r,a,o,b.count,{deadline:Math.min(g,Date.now()+m.exactDeadlineMs)});e&&e.count>b.count&&(x.push({count:e.count,boxes:e.boxes}),S=!0)}let T=!1;if(b.count>0){let e=C(n,r,a,o,{deadline:Math.min(g,Date.now()+m.exactDeadlineMs)});e&&(T=e.timedOut,e.boxes.length>0&&x.push({count:e.boxes.length,boxes:e.boxes}))}for(let e of[0,1]){let t=Math.floor(n/(e===0?a:o))*Math.floor(r/(e===0?o:a));t>0&&x.push({count:t,mode:`grid`,rot:e})}x.sort((e,t)=>t.count-e.count);let E=x.filter(e=>e.count<=m.maxPerLevel);if(x.length>0&&E.length===0)return{ok:!1,errors:[`每層箱數 ${x[0].count} 超過上限 ${m.maxPerLevel} 箱`]};let D=0,O=null,k=!1;for(let e of E){var A;let t=(A=e.boxes)==null?e.decision?v(e.decision,a,o):v({mode:`grid`,rot:e.rot,l:n,w:r},a,o):A;if(t.length===0)continue;let i=u(t);if(i.valid&&i.flat){D=e.count,O=t;break}k=!0}let j=D*d;if(j>m.maxTotalBoxes)return{ok:!1,errors:[`總箱數 ${j} 超過上限 ${m.maxTotalBoxes} 箱（請降低最高總高度或減少層數）`]};O===null&&(O=[]);let M=D===p?`proved`:`best-found`,N=D*a*o/(n*r),P=i+d*s;if(P>c)return{ok:!1,errors:[`內部錯誤：計算總高度 ${P} 超過上限 ${c}`]};let F=O.some(e=>e.rot===0),I=O.some(e=>e.rot===1),ee=F&&I,te=null;D===0?te=`無可用空間：紙箱尺寸超出棧板長寬，任何方向都放不下。`:d===0&&(te=`扣除棧板高度後，可用高度不足一層紙箱高度，無法堆疊。`);let ne={ok:!0,input:t.values,palletL:n,palletW:r,palletH:i,boxL:a,boxW:o,boxH:s,maxTotalH:c,usableHeight:l,levels:d,perLevel:D,totalBoxes:j,layout:O,areaUpperBound:p,optimality:M,utilization:N,totalHeightUsed:P,noFit:D===0,message:te,usedMixedLayout:ee,solverNote:k?`已拒回外緣凹口的高箱數候選，改採外緣平整保底方案（搜尋覆蓋有限，未必最佳）。`:b.budgetExhausted||T?`搜尋${b.timedOut||T?`已達時間上限（${m.solverDeadlineMs}ms）`:`預算已達上限`}，改用條帶混排保底方案（結果仍有效，未必最佳）。`:S?`小案例已執行精確格點搜尋（含非直線切割排法）。`:null,limits:m,algorithm:`guillotine-mixed (每層同布局、直立、僅水平90度旋轉)`};return ne.runtimeErrors=w(ne),ne.runtimeErrors.length>0?{ok:!1,errors:[`內部幾何驗證失敗，請調整輸入後重試。`,...ne.runtimeErrors]}:ne}var E=[`4`,`5`,`6`,`7`,`8`],D={4:`4箱風車（四矩形圍中央孔）`,5:`5箱兩橫三直（上下可交換）`,6:`6箱3×2/2×3交叉`,7:`7箱三直四橫（上下可交換）`,8:`8箱雙箱風車（四組各2箱）`};function O(e,t,n,r){let i=(e,t)=>({x:e,y:t,w:n,h:r,rot:0}),a=(e,t)=>({x:e,y:t,w:r,h:n,rot:1}),o,s,c;switch(e){case`4`:o=t===`A`?[i(0,0),a(0,r),i(r,n),a(n,0)]:[a(0,0),i(r,0),a(n,r),i(0,n)],s=n+r,c=n+r;break;case`5`:{let e=Math.max(3*r,2*n);o=t===`A`?[a(0,0),a(Math.round((e-r)/2),0),a(e-r,0),i(0,n),i(e-n,n)]:[i(0,0),i(e-n,0),a(0,r),a(Math.round((e-r)/2),r),a(e-r,r)],s=e,c=n+r;break}case`6`:{let e=Math.max(3*r,2*n);o=t===`A`?[0,e-n].flatMap(t=>[0,Math.round((e-r)/2),e-r].map(e=>a(e,t))):[0,Math.round((e-r)/2),e-r].flatMap(t=>[0,e-n].map(e=>i(e,t))),s=e,c=e;break}case`7`:{let e=Math.max(2*n,3*r);o=t===`A`?[i(0,0),i(e-n,0),i(0,r),i(e-n,r),a(0,2*r),a(Math.round((e-r)/2),2*r),a(e-r,2*r)]:[a(0,0),a(Math.round((e-r)/2),0),a(e-r,0),i(0,n),i(e-n,n),i(0,n+r),i(e-n,n+r)],s=e,c=2*r+n;break}case`8`:o=t===`A`?[i(0,0),i(0,r),a(0,2*r),a(r,2*r),i(2*r,n),i(2*r,n+r),a(n,0),a(n+r,0)]:[a(0,0),a(r,0),i(2*r,0),i(2*r,r),a(n,2*r),a(n+r,2*r),i(0,n),i(0,n+r)],s=n+2*r,c=n+2*r;break;default:return null}return{boxes:o,fw:s,fh:c}}function k(e,t){return e.x<t.x+t.w&&t.x<e.x+e.w&&e.y<t.y+t.h&&t.y<e.y+e.h}function A(e,t,n,r,i,a,o){let s=O(e,t,i,a);if(!s)return{error:`未知模板`};let c=o?s.fh:s.fw,l=o?s.fw:s.fh;if(c>n||l>r){let e=Math.min(s.fw,s.fh);return{error:`放不下：棧板太小，此模板需棧板長寬至少 ${s.fw}×${s.fh} mm（或旋轉後 ${s.fh}×${s.fw}），即較小邊 ≥ ${e} mm`}}let u=Math.floor((n-c)/2),d=Math.floor((r-l)/2),f=s.boxes.map(e=>{let t,n,r,i,a;return o?(t=s.fh-e.y-e.h,n=e.x,r=e.h,i=e.w,a=+(e.rot===0)):(t=e.x,n=e.y,r=e.w,i=e.h,a=e.rot),{x:t+u,y:n+d,w:r,h:i,rot:a}});for(let e of f){if(!Number.isSafeInteger(e.x)||!Number.isSafeInteger(e.y))return{error:`內部錯誤：非整數座標`};if(e.x<0||e.y<0||e.x+e.w>n||e.y+e.h>r)return{error:`內部錯誤：放置後越界 ${JSON.stringify(e)}`}}for(let e=0;e<f.length;e++)for(let t=e+1;t<f.length;t++)if(k(f[e],f[t]))return{error:`內部錯誤：模板重疊`};return{boxes:f,fw:c,fh:l,rotated:o}}function j(e,t,n,r,i){var a;let o={patternId:e,patternName:(a=D[e])==null?null:a,boxCount:Number(e),aOk:!1,bOk:!1,aError:null,bError:null,aFlat:null,bFlat:null,aligned:null,outlineError:null,applicable:!1,layouts:null,globalRotation:null,aBounds:null,bBounds:null};if(e===`6`&&t===n)return o.outlineError=`六箱模板為方箱（bl=bw）：rot 無方向意義且 3×2 與 2×3 格不可能構成真正 A/B 交叉，不適用`,o;let s=[],c=[],l=null;for(let a of[!1,!0]){let f=A(e,`A`,r,i,t,n,a),p=A(e,`B`,r,i,t,n,a);if(f.error&&s.push(`共同轉向${a?`90°`:`0°`}：${f.error}`),p.error&&c.push(`共同轉向${a?`90°`:`0°`}：${p.error}`),f.error||p.error)continue;let m=u(f.boxes),h=u(p.boxes),g=d(f.boxes,p.boxes);if(([`5`,`6`,`7`].includes(e)||m.flat&&h.flat)&&g.aligned)return o.aOk=!0,o.bOk=!0,o.aFlat=m.flat,o.bFlat=h.flat,o.aligned=!0,o.applicable=!0,o.globalRotation=a,o.aBounds=g.aBounds,o.bBounds=g.bBounds,o.layouts={A:f.boxes,B:p.boxes},o;l||(l={rotated:a,oa:m,ob:h,cmp:g})}if(l){o.aOk=!0,o.bOk=!0,o.aFlat=l.oa.flat,o.bFlat=l.ob.flat,o.aligned=l.cmp.aligned,o.globalRotation=l.rotated,o.aBounds=l.cmp.aBounds,o.bBounds=l.cmp.bBounds;let e=[];return l.oa.flat||e.push(`A層外緣不平整：${l.oa.errors.join(`；`)}`),l.ob.flat||e.push(`B層外緣不平整：${l.ob.errors.join(`；`)}`),l.cmp.aligned||e.push(`A/B外框錯位：${l.cmp.errors.join(`；`)}`),o.outlineError=e.join(`；`),o}return o.aError=s.join(`；`),o.bError=c.join(`；`),o}function M(e,t){let n=1,r=null,i=!1,a=!1,o=[];for(let[s,c]of e.entries()){let e=0;for(let n of t){let t=Math.max(0,Math.min(c.x+c.w,n.x+n.w)-Math.max(c.x,n.x)),r=Math.max(0,Math.min(c.y+c.h,n.y+n.h)-Math.max(c.y,n.y));e+=t*r}let l=e/(c.w*c.h);l<n&&(n=l,r=c),l<1&&(i=!0),l<.5&&(a=!0),o.push({boxId:String(s),ratio:l})}return{minRatio:n,minBox:r,ratios:o,hasHole:i,insufficient:a}}function N(e){let t=[];if(!e.layouts||!e.layouts.A||!e.layouts.B)return t.push(`template: 缺少 layouts.A/B`),t;for(let n of[`A`,`B`]){let r=e.layouts[n];r.length!==e.perLevel&&t.push(`template: ${n} 箱數 ${r.length} 不等於 perLevel ${e.perLevel}`);for(let i of r)(!Number.isSafeInteger(i.x)||!Number.isSafeInteger(i.y)||!Number.isSafeInteger(i.w)||!Number.isSafeInteger(i.h))&&t.push(`template: ${n} 非整數座標 ${JSON.stringify(i)}`),(i.x<0||i.y<0)&&t.push(`template: ${n} 負座標 ${JSON.stringify(i)}`),(i.x+i.w>e.palletL||i.y+i.h>e.palletW)&&t.push(`template: ${n} 越界 ${JSON.stringify(i)}`),new Set([`${i.w}x${i.h}`,`${i.h}x${i.w}`]).has(`${e.boxL}x${e.boxW}`)||t.push(`template: ${n} 箱尺寸錯誤 ${JSON.stringify(i)}`),i.rot!==0&&i.rot!==1&&t.push(`template: ${n} rot 非 0/1 ${JSON.stringify(i)}`);for(let e=0;e<r.length;e++)for(let i=e+1;i<r.length;i++)k(r[e],r[i])&&t.push(`template: ${n} 重疊 ${JSON.stringify(r[e])} vs ${JSON.stringify(r[i])}`)}return e.totalBoxes!==e.perLevel*e.levels&&t.push(`template: totalBoxes 不一致`),t}function P(e){let t=h(e);if(!t.ok)return{ok:!1,errors:t.errors};let{palletL:n,palletW:r,palletH:i,boxL:a,boxW:o,boxH:s,maxTotalH:c}=t.values,l=c-i,u=l>=s?Math.floor(l/s):0,d=[];if(u>m.maxLevels&&d.push(`層數 ${u} 超過上限 ${m.maxLevels} 層（請降低最高總高度或增加紙箱高度）`),d.length>0)return{ok:!1,errors:d};let f=E.map(e=>{let t=j(e,a,o,n,r);if(t.applicable){let e=M(t.layouts.B,t.layouts.A),n=M(t.layouts.A,t.layouts.B);t.support={aToB:{minRatio:e.minRatio,ratios:e.ratios,hasHole:e.hasHole,insufficient:e.insufficient},bToA:{minRatio:n.minRatio,ratios:n.ratios,hasHole:n.hasHole,insufficient:n.insufficient}};let r=[];e.minRatio<1&&r.push(`上層(B)箱支撐不足：minRatio=${e.minRatio}（內部留縫據實計算）`),n.minRatio<1&&r.push(`上層(A)箱支撐不足：minRatio=${n.minRatio}（內部留縫據實計算）`),t.warnings=r}return t}),p=f.filter(e=>e.applicable),g=null;for(let e of p)(!g||e.boxCount>g.boxCount)&&(g=e);let _={ok:!0,mode:`templates`,input:t.values,palletL:n,palletW:r,palletH:i,boxL:a,boxW:o,boxH:s,maxTotalH:c,usableHeight:l,levels:u,totalHeightUsed:i+u*s,maxTotalH:c,candidates:f,bestPatternId:g?g.patternId:null,message:null,limits:m,algorithm:`fixed-templates (五種固定箱數 A/B 模板：4/5/6/7/8 箱；A/B 皆不越界不重疊、外緣平整且 A/B 外框四界對齊才適用；僅宣稱五模板中箱數最多，非全域最優)`};if(u===0?_.message=`扣除棧板高度後，可用高度不足一層紙箱高度，無法堆疊。`:g||(_.message=`五種模板在此棧板尺寸皆不適用（各模板的 A 與 B 需在同一棧板內皆無越界且無重疊，並另需外緣平整與 A/B 外框四界對齊）；請參考各模板的不適用原因。`),g){if(_.patternId=g.patternId,_.patternName=g.patternName,_.layerPattern=`AB`,_.perLevel=g.boxCount,_.totalBoxes=g.boxCount*u,_.layout=g.layouts.A,_.layouts={A:g.layouts.A,B:g.layouts.B},_.support=g.support,_.areaUpperBound=Math.floor(n*r/(a*o)),_.optimality=`template-best`,_.utilization=g.boxCount*a*o/(n*r),_.noFit=!1,_.usedMixedLayout=g.layouts.A.some(e=>e.rot===0)&&g.layouts.A.some(e=>e.rot===1),_.solverNote=`五種固定箱數模板模式：最佳化僅指五種模板中箱數最多者，非一般三維堆疊的全域最優證明。`,_.totalBoxes>m.maxTotalBoxes)return{ok:!1,errors:[`總箱數 ${_.totalBoxes} 超過上限 ${m.maxTotalBoxes} 箱（請降低最高總高度或減少層數）`]};if(_.runtimeErrors=N(_),_.runtimeErrors.length>0)return{ok:!1,errors:[`內部模板幾何驗證失敗，請調整輸入後重試。`,..._.runtimeErrors]}}else _.perLevel=0,_.totalBoxes=0,_.optimality=`none`;return _}var F=`// solver-core.js — 純 ESM、無外部依賴：可在 Node 測試、主執行緒與 Web Worker（?raw Blob）共用。
// 演算法：直立逐層模型。每層同一布局；層數 = floor((總高-棧板高)/箱高)。
// 單層求解：記憶化 guillotine（直線切割）搜尋，切割位置取 boxL/boxW 線性組合；
// 保底為純方向格狀與單一切割條帶混排。達到面積上界才宣稱『已證明最優』。
// T3b：solve 回傳的非空層必須外緣平整（中央封閉孔允許、外部凹口拒絕）：guillotine/exact/
//      平整 guillotine DP/純格狀皆為候補，凹口候補拒回後繼續評估其他合法候補；純格狀必平整
//      為保底。平整 DP 覆蓋有限（面積/切割/區域/deadline 守門），未達面積上界只稱 best-found。
// T3a：固定模板適用性另依賴 ./layout-geometry.js（外緣平整 + A/B 外框四界對齊）。
//      Blob worker 由 solver-worker-source.js 組裝：layout-geometry 原始碼前置、下方 import 行精確移除後再去 export。

import { analyzeLayoutOutline, compareAlignedBounds } from './layout-geometry.js';

const FIELDS = ['palletL', 'palletW', 'palletH', 'boxL', 'boxW', 'boxH', 'maxTotalH'];
const LABELS = {
  palletL: '棧板長', palletW: '棧板寬', palletH: '棧板高',
  boxL: '紙箱長', boxW: '紙箱寬', boxH: '紙箱高', maxTotalH: '最高總高度',
};

// 硬限制（UI/README 同步明示）：超過即拒絕，避免搜尋/emit/JSON 無界膨脹。
export const LIMITS = {
  maxDim: 100000,         // 單尺寸最大 100000 mm
  maxPerLevel: 5000,      // 單層最多 5000 箱
  maxLevels: 200,         // 最多 200 層
  maxTotalBoxes: 50000,   // 總箱數最多 50000
  solverDeadlineMs: 4000, // 主搜尋 wall 時間上限
  exactDeadlineMs: 800,   // 精確小案例搜尋 wall 時間上限
};

export function validateInput(raw) {
  const errors = [];
  const values = {};
  for (const f of FIELDS) {
    const v = raw ? raw[f] : undefined;
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      errors.push(\`\${LABELS[f]}必須是有限數字\`);
      continue;
    }
    if (!Number.isSafeInteger(v)) {
      errors.push(\`\${LABELS[f]}必須是整數毫米且不可超過安全整數範圍（不接受小數或超大整數）\`);
      continue;
    }
    if (v <= 0) {
      errors.push(\`\${LABELS[f]}必須是正數\`);
      continue;
    }
    if (v > LIMITS.maxDim) {
      errors.push(\`\${LABELS[f]}不可超過 \${LIMITS.maxDim} mm（硬限制）\`);
      continue;
    }
    values[f] = v;
  }
  return { ok: errors.length === 0, errors, values };
}

function gridBest(l, w, bl, bw) {
  const a = Math.floor(l / bl) * Math.floor(w / bw); // rot 0: bl 沿 x
  const b = Math.floor(l / bw) * Math.floor(w / bl); // rot 1: bw 沿 x
  return a >= b ? { count: a, rot: 0 } : { count: b, rot: 1 };
}

// 單層 guillotine 搜尋 → { decision, count, budgetExhausted, timedOut }（不 emit；emit 由
// emitLayout 負責，讓 solve 能在產生幾何前先用硬限制攔截過大布局）。
export function packLevel(L, W, bl, bw, opts = {}) {
  const minDim = Math.min(bl, bw);
  const budget = { n: 0, cap: opts.nodeCap ?? 60000, exhausted: false };
  const deadline = opts.deadline ?? (Date.now() + LIMITS.solverDeadlineMs);
  const cache = new Map();
  const cutCache = new Map();
  let timedOut = false;

  function cutSet(size) {
    if (cutCache.has(size)) return cutCache.get(size);
    const s = new Set();
    for (let i = 0; i * bl <= size - minDim; i++) {
      for (let j = 0; i * bl + j * bw <= size - minDim; j++) {
        const c = i * bl + j * bw;
        if (c >= minDim && size - c >= minDim) s.add(c);
      }
    }
    const arr = [...s].sort((a, b) => a - b);
    cutCache.set(size, arr);
    return arr;
  }

  function localBound(l, w) {
    return Math.floor((l * w) / (bl * bw));
  }

  function stopCheck() {
    if (budget.exhausted) return true;
    if (Date.now() > deadline) {
      timedOut = true;
      budget.exhausted = true;
      return true;
    }
    return false;
  }

  function best(l, w, depth) {
    const key = l + ',' + w;
    if (cache.has(key)) return cache.get(key);
    const g = gridBest(l, w, bl, bw);
    let dec = { count: g.count, mode: 'grid', rot: g.rot, l, w };
    if (budget.exhausted || depth >= 6 || g.count >= localBound(l, w)) {
      cache.set(key, dec);
      return dec;
    }
    budget.n++;
    if (budget.n > budget.cap || Date.now() > deadline) {
      if (Date.now() > deadline) timedOut = true;
      budget.exhausted = true;
      cache.set(key, dec);
      return dec;
    }
    // 切割：子區域一律以 (x向, y向) 維度遞迴，避免方向錯置
    for (const c of cutSet(l)) {
      const left = best(c, w, depth + 1);
      if (stopCheck()) break;
      const right = best(l - c, w, depth + 1);
      if (stopCheck()) break;
      const total = left.count + right.count;
      if (total > dec.count) {
        dec = { count: total, mode: 'split', axis: 'x', c, left, right, l, w };
        if (total >= localBound(l, w)) break;
      }
    }
    if (!budget.exhausted && dec.count < localBound(l, w)) {
      for (const c of cutSet(w)) {
        const bottom = best(l, c, depth + 1);
        if (stopCheck()) break;
        const top = best(l, w - c, depth + 1);
        if (stopCheck()) break;
        const total = bottom.count + top.count;
        if (total > dec.count) {
          dec = { count: total, mode: 'split', axis: 'y', c, left: bottom, right: top, l, w };
          if (total >= localBound(l, w)) break;
        }
      }
    }
    cache.set(key, dec);
    return dec;
  }

  let decision = best(L, W, 0);
  let budgetExhausted = budget.exhausted;

  if (budgetExhausted) {
    // 退回保底條帶搜尋：純格狀 + 單一切割（兩側各試兩種方向）。
    // deadline 同樣覆蓋此階段；grid 保底一併放入 cands → 只取更好或相同，永不降級。
    const cands = [];
    const g0 = gridBest(L, W, bl, bw);
    cands.push({ count: g0.count, mode: 'grid', rot: g0.rot, l: L, w: W });
    for (const c of cutSet(L)) {
      if (Date.now() > deadline) break;
      for (const rotA of [0, 1]) {
        for (const rotB of [0, 1]) {
          const a = rotA === 0 ? Math.floor(c / bl) * Math.floor(W / bw) : Math.floor(c / bw) * Math.floor(W / bl);
          const b = rotB === 0 ? Math.floor((L - c) / bl) * Math.floor(W / bw) : Math.floor((L - c) / bw) * Math.floor(W / bl);
          cands.push({
            count: a + b, mode: 'split', axis: 'x', c,
            left: { count: a, mode: 'grid', rot: rotA, l: c, w: W },
            right: { count: b, mode: 'grid', rot: rotB, l: L - c, w: W },
            l: L, w: W,
          });
        }
      }
    }
    cands.sort((p, q) => q.count - p.count);
    decision = cands[0];
  }

  return { decision, count: decision.count, budgetExhausted, timedOut };
}

// decision → 箱座標清單（emit 有界：count 已在 solve 內先過硬限制檢查）。
export function emitLayout(decision, bl, bw) {
  const boxes = [];
  function emit(dec, ox, oy) {
    if (dec.mode === 'grid') {
      const bw2 = dec.rot === 0 ? bl : bw;
      const bh2 = dec.rot === 0 ? bw : bl;
      const nx = Math.floor(dec.l / bw2), ny = Math.floor(dec.w / bh2);
      for (let i = 0; i < nx; i++)
        for (let j = 0; j < ny; j++)
          boxes.push({ x: ox + i * bw2, y: oy + j * bh2, w: bw2, h: bh2, rot: dec.rot });
    } else if (dec.axis === 'x') {
      emit(dec.left, ox, oy);
      emit(dec.right, ox + dec.c, oy);
    } else {
      emit(dec.left, ox, oy);
      emit(dec.right, ox, oy + dec.c);
    }
  }
  emit(decision, 0, 0);
  return boxes;
}

// 小案例精確格點搜尋（boxL/boxW 線性組合座標 + 回溯最大不重疊放置）：
// 可找到非 guillotine 排法（如風車形）。規模或時間超過門檻即回傳 null 退回 guillotine。
export function exactSearch(L, W, bl, bw, seedCount, opts = {}) {
  // 先以面積上界攔截：bl·bw 過小時 gen 的雙重迴圈本身即無界（舊版 OOM 來源）。
  if (Math.floor((L * W) / (bl * bw)) > LIMITS.maxPerLevel) return null;
  const gen = (max) => {
    const s = new Set();
    for (let i = 0; i * bl <= max; i++)
      for (let j = 0; i * bl + j * bw <= max; j++) s.add(i * bl + j * bw);
    return [...s].sort((a, b) => a - b);
  };
  const xs = gen(L), ys = gen(W);
  const placements = [];
  for (const rot of [0, 1]) {
    const w = rot === 0 ? bl : bw, h = rot === 0 ? bw : bl;
    for (const x of xs) for (const y of ys) {
      if (x + w <= L && y + h <= W) placements.push({ x, y, w, h, rot });
    }
    if (rot === 1 && bl === bw) break;
  }
  if (placements.length > 64) return null;
  const n = placements.length;
  const overlaps = (a, b) =>
    a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const deadline = opts.deadline ?? (Date.now() + LIMITS.exactDeadlineMs);
  let best = seedCount;
  let chosen = [], bestChosen = null, timedOut = false;
  let nodes = 0;
  function bt(i, count) {
    if (timedOut) return;
    // 實際節點計數守門（舊版 (i & 63) 依深度取樣，稀疏路徑可能長時間不檢查時間）
    if (++nodes % 256 === 0 && Date.now() > deadline) { timedOut = true; return; }
    if (count + (n - i) <= best) return;
    if (i === n) {
      if (count > best) { best = count; bestChosen = chosen.slice(); }
      return;
    }
    const p = placements[i];
    if (!chosen.some((c) => overlaps(c, p))) {
      chosen.push(p);
      bt(i + 1, count + 1);
      chosen.pop();
    }
    bt(i + 1, count);
  }
  bt(0, 0);
  if (timedOut || !bestChosen) return null;
  return { boxes: bestChosen, count: best };
}

// T3b：平整 guillotine 候選產生器（有界）。子區域以純格狀為葉、遞迴切割組合；
// 每個組合佈局必須通過 analyzeLayoutOutline 平整守門才可成為候選（中央封閉孔允許、
// 外部凹口拒絕），故回傳候選本身必平整。覆蓋有限：面積上界/切割集大小/區域數/deadline
// 任一超過即退回純格狀保底，未達面積上界一律只稱 best-found。
const FLAT_DP_MAX_AREA_BOUND = 1000; // 大案例由純格狀/條帶保底覆蓋，不跑平整 DP
const FLAT_DP_MAX_CUTS = 200;        // 兩軸切割位置總數門檻
const FLAT_DP_MAX_REGIONS = 400;     // 記憶化區域上限（emit 前以 count 守門，不在此 emit）
function flatGuillotineCandidate(L, W, bl, bw, opts = {}) {
  const minDim = Math.min(bl, bw);
  if (Math.floor((L * W) / (bl * bw)) > FLAT_DP_MAX_AREA_BOUND) return null;
  const deadline = opts.deadline ?? (Date.now() + LIMITS.solverDeadlineMs);
  const cutCache = new Map();
  function cutSet(size) {
    if (cutCache.has(size)) return cutCache.get(size);
    const s = new Set();
    for (let i = 0; i * bl <= size - minDim; i++) {
      for (let j = 0; i * bl + j * bw <= size - minDim; j++) {
        const c = i * bl + j * bw;
        if (c >= minDim && size - c >= minDim) s.add(c);
      }
    }
    const arr = [...s].sort((a, b) => a - b);
    cutCache.set(size, arr);
    return arr;
  }
  if (cutSet(L).length + cutSet(W).length > FLAT_DP_MAX_CUTS) return null;
  const memo = new Map();
  const regions = new Set();
  let timedOut = false;
  function gridBoxes(l, w) {
    const g = gridBest(l, w, bl, bw);
    const bw2 = g.rot === 0 ? bl : bw, bh2 = g.rot === 0 ? bw : bl;
    const boxes = [];
    for (let i = 0; i < Math.floor(l / bw2); i++)
      for (let j = 0; j < Math.floor(w / bh2); j++)
        boxes.push({ x: i * bw2, y: j * bh2, w: bw2, h: bh2, rot: g.rot });
    return boxes;
  }
  function flatBest(l, w) {
    const key = l + ',' + w;
    if (memo.has(key)) return memo.get(key);
    if (timedOut || regions.size >= FLAT_DP_MAX_REGIONS) {
      const g = gridBoxes(l, w);
      memo.set(key, g);
      return g;
    }
    regions.add(key);
    let best = gridBoxes(l, w); // 純格狀葉：必平整
    const consider = (boxes) => {
      if (!boxes || boxes.length === 0 || boxes.length <= best.length) return;
      const o = analyzeLayoutOutline(boxes);
      if (o.valid && o.flat) best = boxes;
    };
    for (const c of cutSet(l)) {
      if (Date.now() > deadline) { timedOut = true; break; }
      const a = flatBest(c, w), b = flatBest(l - c, w);
      consider(a); consider(b); // 單側子區域佈局也是合法平整候選（另一側留空）
      consider(a.concat(b.map((x) => ({ ...x, x: x.x + c }))));
    }
    if (!timedOut) {
      for (const c of cutSet(w)) {
        if (Date.now() > deadline) { timedOut = true; break; }
        const a = flatBest(l, c), b = flatBest(l, w - c);
        consider(a); consider(b);
        consider(a.concat(b.map((x) => ({ ...x, y: x.y + c }))));
      }
    }
    memo.set(key, best);
    return best;
  }
  return { boxes: flatBest(L, W), timedOut };
}

// runtime 幾何驗證（sweep-line，O(n log n + k)，非 O(n²)）：座標整數、不越界、
// 尺寸正確、同層不重疊、箱數與統計一致。供 solve 內部自驗證，不限測試 helper。
export function validateLayoutRuntime(result) {
  const { layout, palletL, palletW, boxL, boxW, perLevel, levels, totalBoxes } = result;
  const errs = [];
  if (layout.length !== perLevel)
    errs.push(\`runtime: layout 筆數 \${layout.length} 不等於 perLevel \${perLevel}\`);
  if (totalBoxes !== perLevel * levels)
    errs.push(\`runtime: totalBoxes \${totalBoxes} 不等於 perLevel*levels\`);
  if (layout.length > LIMITS.maxPerLevel)
    errs.push(\`runtime: layout 超過硬上限 \${LIMITS.maxPerLevel}\`);
  const sorted = [...layout].sort((a, b) => a.x - b.x);
  const active = []; // sweep 視窗：x + w > 當前箱 x 者
  for (const b of sorted) {
    if (!Number.isSafeInteger(b.x) || !Number.isSafeInteger(b.y) || !Number.isSafeInteger(b.w) || !Number.isSafeInteger(b.h))
      errs.push(\`runtime: 非整數座標: \${JSON.stringify(b)}\`);
    if (b.x < 0 || b.y < 0) errs.push(\`runtime: 負座標: \${JSON.stringify(b)}\`);
    if (b.x + b.w > palletL || b.y + b.h > palletW)
      errs.push(\`runtime: 越界: \${JSON.stringify(b)} 棧板 \${palletL}x\${palletW}\`);
    const dims = new Set([\`\${b.w}x\${b.h}\`, \`\${b.h}x\${b.w}\`]);
    if (!dims.has(\`\${boxL}x\${boxW}\`))
      errs.push(\`runtime: 箱尺寸錯誤: \${JSON.stringify(b)}\`);
    for (let i = active.length - 1; i >= 0; i--) {
      const a = active[i];
      if (a.x + a.w <= b.x) { active.splice(i, 1); continue; }
      if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h)
        errs.push(\`runtime: 重疊: \${JSON.stringify(a)} vs \${JSON.stringify(b)}\`);
    }
    active.push(b);
  }
  return errs;
}

export function solve(raw) {
  const v = validateInput(raw);
  if (!v.ok) return { ok: false, errors: v.errors };
  const { palletL, palletW, palletH, boxL, boxW, boxH, maxTotalH } = v.values;

  // 乘法安全：所有輸入 ≤ maxDim（1e5）→ 面積 ≤ 1e10、箱數 ≤ 上限值，皆遠小於 MAX_SAFE_INTEGER。
  const usableHeight = maxTotalH - palletH;
  const levels = usableHeight >= boxH ? Math.floor(usableHeight / boxH) : 0;

  // 搜尋前硬限制：層數與每層理論上界（面積上界）先攔截，避免無界搜尋/emit。
  const errors = [];
  if (levels > LIMITS.maxLevels)
    errors.push(\`層數 \${levels} 超過上限 \${LIMITS.maxLevels} 層（請降低最高總高度或增加紙箱高度）\`);
  const areaUpperBound = Math.floor((palletL * palletW) / (boxL * boxW));
  if (areaUpperBound > LIMITS.maxPerLevel)
    errors.push(\`每層箱數理論上界 \${areaUpperBound} 超過上限 \${LIMITS.maxPerLevel} 箱（紙箱相對棧板過小，請改用更大的紙箱尺寸）\`);
  if (errors.length > 0) return { ok: false, errors };

  const deadline = Date.now() + LIMITS.solverDeadlineMs;
  const packed = packLevel(palletL, palletW, boxL, boxW, { deadline });

  // T3b 候選收集（有界，至多 5 個）：guillotine 決策 / exact 小案例 / 平整 guillotine DP /
  // 純格狀兩方向保底。count 0 不 emit、不調 outline；count 超過每層上限的候選 emit 前即守門。
  // 平整政策：非空層必須外緣平整（中央封閉孔允許）；凹口候選一律拒回，不得蓋過合法平整候選。
  const candidates = [];
  if (packed.count > 0) candidates.push({ count: packed.count, decision: packed.decision });
  let exactUsed = false;
  if (packed.count > 0) {
    // 小案例嘗試精確格點搜尋（可勝過 guillotine；僅接受更好的結果，不降級既有有效解）
    const exact = exactSearch(palletL, palletW, boxL, boxW, packed.count,
      { deadline: Math.min(deadline, Date.now() + LIMITS.exactDeadlineMs) });
    if (exact && exact.count > packed.count) {
      candidates.push({ count: exact.count, boxes: exact.boxes });
      exactUsed = true;
    }
  }
  let flatDpTimedOut = false;
  if (packed.count > 0) {
    // 平整 DP 以 exact 子預算為上限，避免在 deadline 測試旁再吃掉整個 solver deadline
    const fd = flatGuillotineCandidate(palletL, palletW, boxL, boxW,
      { deadline: Math.min(deadline, Date.now() + LIMITS.exactDeadlineMs) });
    if (fd) {
      flatDpTimedOut = fd.timedOut;
      if (fd.boxes.length > 0) candidates.push({ count: fd.boxes.length, boxes: fd.boxes });
    }
  }
  for (const rot of [0, 1]) {
    const count = Math.floor(palletL / (rot === 0 ? boxL : boxW)) * Math.floor(palletW / (rot === 0 ? boxW : boxL));
    if (count > 0) candidates.push({ count, mode: 'grid', rot });
  }
  candidates.sort((a, b) => b.count - a.count);

  // emit 前數量守門：全部候選本身超過每層上限 → 明確拒絕（報最大候選計數，不靜默降格）。
  // 若僅高計數（凹口）候選超限而合法較低候選不超，則按選定合法候選 total 判定。
  const withinLimit = candidates.filter((c) => c.count <= LIMITS.maxPerLevel);
  if (candidates.length > 0 && withinLimit.length === 0)
    return { ok: false, errors: [\`每層箱數 \${candidates[0].count} 超過上限 \${LIMITS.maxPerLevel} 箱\`] };

  // 選定：依計數由高到低；凹口候選拒回後繼續評估其他合法候選，
  // 最佳計數候選不平不可阻擋後續評估。純格狀必平整 → 任何 count>0 情況都有保底。
  let perLevel = 0;
  let layout = null;
  let notchRejected = false;
  for (const cand of withinLimit) {
    const boxes = cand.boxes ?? (cand.decision
      ? emitLayout(cand.decision, boxL, boxW)
      : emitLayout({ mode: 'grid', rot: cand.rot, l: palletL, w: palletW }, boxL, boxW));
    if (boxes.length === 0) continue; // 空佈局不調 outline
    const outline = analyzeLayoutOutline(boxes);
    if (outline.valid && outline.flat) {
      perLevel = cand.count;
      layout = boxes;
      break;
    }
    notchRejected = true;
  }

  // emit 前有界檢查（計數依選定的合法候選判定，凹口候選不參與）
  const totalBoxes = perLevel * levels;
  if (totalBoxes > LIMITS.maxTotalBoxes)
    return { ok: false, errors: [\`總箱數 \${totalBoxes} 超過上限 \${LIMITS.maxTotalBoxes} 箱（請降低最高總高度或減少層數）\`] };

  if (layout === null) layout = [];

  // 只有直接候選達面積上界才宣稱證明；平整 DP 覆蓋有限，未達上界一律 best-found。
  const optimality = perLevel === areaUpperBound ? 'proved' : 'best-found';
  const utilization = (perLevel * boxL * boxW) / (palletL * palletW);
  const totalHeightUsed = palletH + levels * boxH;
  if (totalHeightUsed > maxTotalH)
    return { ok: false, errors: [\`內部錯誤：計算總高度 \${totalHeightUsed} 超過上限 \${maxTotalH}\`] };

  const hasRot0 = layout.some((b) => b.rot === 0);
  const hasRot1 = layout.some((b) => b.rot === 1);
  const usedMixedLayout = hasRot0 && hasRot1;

  let message = null;
  if (perLevel === 0) message = '無可用空間：紙箱尺寸超出棧板長寬，任何方向都放不下。';
  else if (levels === 0) message = '扣除棧板高度後，可用高度不足一層紙箱高度，無法堆疊。';

  const result = {
    ok: true,
    input: v.values,
    palletL, palletW, palletH, boxL, boxW, boxH, maxTotalH,
    usableHeight, levels, perLevel, totalBoxes,
    layout, areaUpperBound, optimality, utilization,
    totalHeightUsed,
    noFit: perLevel === 0,
    message,
    usedMixedLayout,
    solverNote: notchRejected
      ? '已拒回外緣凹口的高箱數候選，改採外緣平整保底方案（搜尋覆蓋有限，未必最佳）。'
      : packed.budgetExhausted || flatDpTimedOut
        ? \`搜尋\${packed.timedOut || flatDpTimedOut ? \`已達時間上限（\${LIMITS.solverDeadlineMs}ms）\` : '預算已達上限'}，改用條帶混排保底方案（結果仍有效，未必最佳）。\`
        : exactUsed
          ? '小案例已執行精確格點搜尋（含非直線切割排法）。'
          : null,
    limits: LIMITS,
    algorithm: 'guillotine-mixed (每層同布局、直立、僅水平90度旋轉)',
  };

  // runtime 自驗證：任何返回給 UI 的布局都先通過幾何重驗。
  result.runtimeErrors = validateLayoutRuntime(result);
  if (result.runtimeErrors.length > 0)
    return { ok: false, errors: ['內部幾何驗證失敗，請調整輸入後重試。', ...result.runtimeErrors] };

  return result;
}

// ═════════════════════════════════════════════════════════════════════════
// 五種固定箱數 A/B 模板模式（4/5/6/7/8 箱）
// 固定排法模板，不任意變更箱數；A/B 需在同一棧板內皆無越界且無重疊才適用。
// 支撐比例僅幾何覆蓋估算：幾何可行不等同運輸安全認證。
// ═════════════════════════════════════════════════════════════════════════
// scratch-templates.js — 五模板區暫存（驗證後併入 src/solver-core.js）
// rot: 0 → footprint bl×bw（w=bl, h=bw）；1 → bw×bl。

export const AB_PATTERN_IDS = ['4', '5', '6', '7', '8'];

export const PATTERN_NAMES = {
  '4': '4箱風車（四矩形圍中央孔）',
  '5': '5箱兩橫三直（上下可交換）',
  '6': '6箱3×2/2×3交叉',
  '7': '7箱三直四橫（上下可交換）',
  '8': '8箱雙箱風車（四組各2箱）',
};

// 每模板變體 = { boxes:[{x,y,w,h,rot}], fw, fh }（fw/fh = 模板外接盒）。
export function templateVariantBoxes(patternId, variant, bl, bw) {
  const H = (x, y) => ({ x, y, w: bl, h: bw, rot: 0 }); // 橫向箱
  const V = (x, y) => ({ x, y, w: bw, h: bl, rot: 1 }); // 直向箱
  let boxes, fw, fh;
  switch (patternId) {
    case '4': {
      // 風車：四矩形圍中央孔（孔邊 bl-bw）；B = 反向風車。
      if (variant === 'A') boxes = [H(0, 0), V(0, bw), H(bw, bl), V(bl, 0)];
      else boxes = [V(0, 0), H(bw, 0), V(bl, bw), H(0, bl)];
      fw = bl + bw; fh = bl + bw;
      break;
    }
    case '5': {
      // A：下排 3 直 + 上排 2 橫；B：上下交換。
      const fw5 = Math.max(3 * bw, 2 * bl);
      if (variant === 'A') {
        boxes = [V(0, 0), V(Math.round((fw5 - bw) / 2), 0), V(fw5 - bw, 0), H(0, bl), H(fw5 - bl, bl)];
      } else {
        boxes = [H(0, 0), H(fw5 - bl, 0), V(0, bw), V(Math.round((fw5 - bw) / 2), bw), V(fw5 - bw, bw)];
      }
      fw = fw5; fh = bl + bw;
      break;
    }
    case '6': {
      // 真交叉 A/B 共用方形外框，差額分散到內部縫隙。
      const side = Math.max(3 * bw, 2 * bl);
      if (variant === 'A') {
        boxes = [0, side - bl].flatMap(y => [0, Math.round((side - bw) / 2), side - bw].map(x => V(x, y)));
      } else {
        boxes = [0, Math.round((side - bw) / 2), side - bw].flatMap(y => [0, side - bl].map(x => H(x, y)));
      }
      fw = side; fh = side;
      break;
    }
    case '7': {
      // A：下兩排各 2 橫 + 上排 3 直；B：上下交換。
      const fw7 = Math.max(2 * bl, 3 * bw);
      if (variant === 'A') {
        boxes = [H(0, 0), H(fw7 - bl, 0), H(0, bw), H(fw7 - bl, bw),
                 V(0, 2 * bw), V(Math.round((fw7 - bw) / 2), 2 * bw), V(fw7 - bw, 2 * bw)];
      } else {
        boxes = [V(0, 0), V(Math.round((fw7 - bw) / 2), 0), V(fw7 - bw, 0),
                 H(0, bl), H(fw7 - bl, bl), H(0, bl + bw), H(fw7 - bl, bl + bw)];
      }
      fw = fw7; fh = 2 * bw + bl;
      break;
    }
    case '8': {
      // 雙箱風車：每組兩箱沿寬方向並排成 L×2W 組塊（rot0 對上下疊、rot1 對左右排），
      // 四組環繞成外框 (L+2W) 平方，中央孔 |L-2W|²（L=2W 時填滿）；B = 反向風車。
      if (variant === 'A') {
        boxes = [H(0, 0), H(0, bw),                    // 下組（橫向兩箱上下疊）
                 V(0, 2 * bw), V(bw, 2 * bw),          // 左組（直向兩箱左右排）
                 H(2 * bw, bl), H(2 * bw, bl + bw),    // 上組
                 V(bl, 0), V(bl + bw, 0)];             // 右組
      } else {
        // B = A 沿對角線鏡像（chirality 反轉，rot0/rot1 互換）
        boxes = [V(0, 0), V(bw, 0),                    // 下組（直向兩箱左右排）
                 H(2 * bw, 0), H(2 * bw, bw),          // 右組（橫向兩箱上下疊）
                 V(bl, 2 * bw), V(bl + bw, 2 * bw),    // 上組（直向兩箱左右排）
                 H(0, bl), H(0, bl + bw)];             // 左組
      }
      fw = bl + 2 * bw; fh = bl + 2 * bw;
      break;
    }
    default: return null;
  }
  return { boxes, fw, fh };
}

function overlaps(a, b) {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

// 模板變體 → 棧板內放置：原方向與旋轉 90° 兩取向、整組置中（尺寸為整數）。
// 回傳 { boxes, fw, fh, rotated } 或 { error: '原因' }。
export function placeVariantOnPallet(variant, palletL, palletW, bl, bw) {
  const t = templateVariantBoxes(variant.patternId, variant.variant, bl, bw);
  if (!t) return { error: '未知模板' };
  const orientations = [
    { fw: t.fw, fh: t.fh, rotated: false },
    { fw: t.fh, fh: t.fw, rotated: true },
  ];
  for (const o of orientations) {
    if (o.fw > palletL || o.fh > palletW) continue;
    const ox = Math.floor((palletL - o.fw) / 2);
    const oy = Math.floor((palletW - o.fh) / 2);
    const boxes = t.boxes.map((b) => {
      let x, y, w, h, rot;
      if (!o.rotated) { x = b.x; y = b.y; w = b.w; h = b.h; rot = b.rot; }
      else { x = t.fh - b.y - b.h; y = b.x; w = b.h; h = b.w; rot = b.rot === 0 ? 1 : 0; }
      return { x: x + ox, y: y + oy, w, h, rot };
    });
    // 放置後自驗證：整數、不越界、不重疊
    for (const b of boxes) {
      if (!Number.isSafeInteger(b.x) || !Number.isSafeInteger(b.y)) return { error: '內部錯誤：非整數座標' };
      if (b.x < 0 || b.y < 0 || b.x + b.w > palletL || b.y + b.h > palletW)
        return { error: \`內部錯誤：放置後越界 \${JSON.stringify(b)}\` };
    }
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++)
        if (overlaps(boxes[i], boxes[j])) return { error: '內部錯誤：模板重疊' };
    return { boxes, fw: o.fw, fh: o.fh, rotated: o.rotated };
  }
  const minSide = Math.min(t.fw, t.fh);
  return { error: \`棧板太小：此模板需棧板長寬至少 \${t.fw}×\${t.fh} mm（或旋轉後 \${t.fh}×\${t.fw}），即較小邊 ≥ \${minSide} mm\` };
}

// T3a 修訂（使用者明確決定：保留真正的 A／B 交叉）：
//   • A／B 兩層必須共用同一個「全局板軸轉向」：都不轉，或都轉 90°。
//     不得沿用 placeVariantOnPallet 的 first-fit 單邊轉向決定適用性——那會讓 B 整層
//     單獨轉 90 湊出與 A 相同的格子排列，冒充交叉（方箱 3×2 vs 2×3 即此謬誤）。
//   • 共同方向下兩層都 fit、外緣平整（外側不得有凹口；中央封閉孔允許）、
//     A/B 外框四界（minX/minY/maxX/maxY）全等，才算適用。
//   • 六箱方箱（bl===bw）：rot 欄位無實質方向意義，且 3×2 與 2×3 格不可能構成真交叉
//     → 一律不適用。
//   • 真尺寸、置中與不越界由專供評估的純 helper placeVariantWithOrientation runtime 自驗；
//     重疊由既有 runtime 驗證器把關。templateVariantBoxes / placeVariantOnPallet
//     低階既有行為與 API 不動。幾何齊平是必要條件，不代表海運安全認證。
export const TEMPLATE_OUTLINE_NOTE = '模板適用另需 A/B 共用同一全局板軸轉向（都不轉或都轉90°）、外緣平整與A/B外框四界對齊（中央封閉孔允許）；此為幾何必要條件，非海運安全認證。';

/**
 * 專供評估的純 helper：以「指定」取向（rotated 布爾）放置模板變體，不做 first-fit 擇向。
 * 轉換、置中與 runtime 自驗規則與 placeVariantOnPallet 完全一致；低階函式不動。
 * 回傳 { boxes, fw, fh, rotated } 或 { error: '原因' }。
 */
export function placeVariantWithOrientation(patternId, variant, palletL, palletW, bl, bw, rotated) {
  const t = templateVariantBoxes(patternId, variant, bl, bw);
  if (!t) return { error: '未知模板' };
  const fw = rotated ? t.fh : t.fw;
  const fh = rotated ? t.fw : t.fh;
  if (fw > palletL || fh > palletW) {
    const minSide = Math.min(t.fw, t.fh);
    return { error: \`放不下：棧板太小，此模板需棧板長寬至少 \${t.fw}×\${t.fh} mm（或旋轉後 \${t.fh}×\${t.fw}），即較小邊 ≥ \${minSide} mm\` };
  }
  const ox = Math.floor((palletL - fw) / 2);
  const oy = Math.floor((palletW - fh) / 2);
  const boxes = t.boxes.map((b) => {
    let x, y, w, h, rot;
    if (!rotated) { x = b.x; y = b.y; w = b.w; h = b.h; rot = b.rot; }
    else { x = t.fh - b.y - b.h; y = b.x; w = b.h; h = b.w; rot = b.rot === 0 ? 1 : 0; }
    return { x: x + ox, y: y + oy, w, h, rot };
  });
  // runtime 自驗（與 placeVariantOnPallet 同規則）：整數、不越界、不重疊
  for (const b of boxes) {
    if (!Number.isSafeInteger(b.x) || !Number.isSafeInteger(b.y)) return { error: '內部錯誤：非整數座標' };
    if (b.x < 0 || b.y < 0 || b.x + b.w > palletL || b.y + b.h > palletW)
      return { error: \`內部錯誤：放置後越界 \${JSON.stringify(b)}\` };
  }
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++)
      if (overlaps(boxes[i], boxes[j])) return { error: '內部錯誤：模板重疊' };
  return { boxes, fw, fh, rotated };
}

export function evaluateTemplateEligibility(patternId, bl, bw, palletL, palletW) {
  const c = {
    patternId,
    patternName: PATTERN_NAMES[patternId] ?? null,
    boxCount: Number(patternId),
    aOk: false,
    bOk: false,
    aError: null,
    bError: null,
    aFlat: null,
    bFlat: null,
    aligned: null,
    outlineError: null,
    applicable: false,
    layouts: null,
    globalRotation: null, // 適用/診斷時採用的共同板軸轉向（false=都不轉，true=都轉90°）
    aBounds: null,
    bBounds: null,
  };
  // 六箱方箱：rot 無方向意義、3×2 與 2×3 格不可能真交叉 → 一律不適用（禁止單邊迫轉冒充）。
  if (patternId === '6' && bl === bw) {
    c.outlineError = '六箱模板為方箱（bl=bw）：rot 無方向意義且 3×2 與 2×3 格不可能構成真正 A/B 交叉，不適用';
    return c;
  }
  const aErrors = [], bErrors = [];
  let diag = null; // 第一個「共同方向兩層皆 fit 但平整/對齊不合格」的診斷
  for (const rotated of [false, true]) {
    const pa = placeVariantWithOrientation(patternId, 'A', palletL, palletW, bl, bw, rotated);
    const pb = placeVariantWithOrientation(patternId, 'B', palletL, palletW, bl, bw, rotated);
    if (pa.error) aErrors.push(\`共同轉向\${rotated ? '90°' : '0°'}：\${pa.error}\`);
    if (pb.error) bErrors.push(\`共同轉向\${rotated ? '90°' : '0°'}：\${pb.error}\`);
    if (pa.error || pb.error) continue; // 此共同方向無法同時放下兩層
    const oa = analyzeLayoutOutline(pa.boxes);
    const ob = analyzeLayoutOutline(pb.boxes);
    const cmp = compareAlignedBounds(pa.boxes, pb.boxes);
    if ((['5', '6', '7'].includes(patternId) || (oa.flat && ob.flat)) && cmp.aligned) {
      c.aOk = true; c.bOk = true;
      c.aFlat = oa.flat; c.bFlat = ob.flat; c.aligned = true;
      c.applicable = true;
      c.globalRotation = rotated;
      c.aBounds = cmp.aBounds;
      c.bBounds = cmp.bBounds;
      c.layouts = { A: pa.boxes, B: pb.boxes };
      return c;
    }
    if (!diag) diag = { rotated, oa, ob, cmp };
  }
  if (diag) {
    // 存在共同方向讓兩層都 fit，但平整或四界對齊不合格 → 不適用（保留該共同方向診斷）
    c.aOk = true; c.bOk = true;
    c.aFlat = diag.oa.flat;
    c.bFlat = diag.ob.flat;
    c.aligned = diag.cmp.aligned;
    c.globalRotation = diag.rotated;
    c.aBounds = diag.cmp.aBounds;
    c.bBounds = diag.cmp.bBounds;
    const reasons = [];
    if (!diag.oa.flat) reasons.push(\`A層外緣不平整：\${diag.oa.errors.join('；')}\`);
    if (!diag.ob.flat) reasons.push(\`B層外緣不平整：\${diag.ob.errors.join('；')}\`);
    if (!diag.cmp.aligned) reasons.push(\`A/B外框錯位：\${diag.cmp.errors.join('；')}\`);
    c.outlineError = reasons.join('；');
    return c;
  }
  // 沒有任何共同方向能同時放下 A 與 B：fit 失敗（保留各共同方向的『放不下/棧板太小』原因）
  c.aError = aErrors.join('；');
  c.bError = bErrors.join('；');
  return c;
}

// 上層箱對下層矩形聯集的支撐：基底矩形互不重疊 → 交集面積可直接求和。
// 回傳 { minRatio, minBox, hasHole, insufficient }。
export function supportCoverage(upperBoxes, lowerBoxes) {
  let minRatio = 1, minBox = null, hasHole = false, insufficient = false;
  const ratios = [];
  for (const [i, u] of upperBoxes.entries()) {
    let inter = 0;
    for (const l of lowerBoxes) {
      const ix = Math.max(0, Math.min(u.x + u.w, l.x + l.w) - Math.max(u.x, l.x));
      const iy = Math.max(0, Math.min(u.y + u.h, l.y + l.h) - Math.max(u.y, l.y));
      inter += ix * iy;
    }
    const ratio = inter / (u.w * u.h);
    if (ratio < minRatio) { minRatio = ratio; minBox = u; }
    if (ratio < 1) hasHole = true;
    if (ratio < 0.5) insufficient = true;
    ratios.push({ boxId: String(i), ratio });
  }
  return { minRatio, minBox, ratios, hasHole, insufficient };
}

// 模板幾何驗證（獨立於 solve）：A/B 皆整數、不越界、不重疊、尺寸正確、箱數正確。
export function validateTemplateResult(r) {
  const errs = [];
  if (!r.layouts || !r.layouts.A || !r.layouts.B) { errs.push('template: 缺少 layouts.A/B'); return errs; }
  for (const key of ['A', 'B']) {
    const boxes = r.layouts[key];
    if (boxes.length !== r.perLevel)
      errs.push(\`template: \${key} 箱數 \${boxes.length} 不等於 perLevel \${r.perLevel}\`);
    for (const b of boxes) {
      if (!Number.isSafeInteger(b.x) || !Number.isSafeInteger(b.y) || !Number.isSafeInteger(b.w) || !Number.isSafeInteger(b.h))
        errs.push(\`template: \${key} 非整數座標 \${JSON.stringify(b)}\`);
      if (b.x < 0 || b.y < 0) errs.push(\`template: \${key} 負座標 \${JSON.stringify(b)}\`);
      if (b.x + b.w > r.palletL || b.y + b.h > r.palletW)
        errs.push(\`template: \${key} 越界 \${JSON.stringify(b)}\`);
      const dims = new Set([\`\${b.w}x\${b.h}\`, \`\${b.h}x\${b.w}\`]);
      if (!dims.has(\`\${r.boxL}x\${r.boxW}\`)) errs.push(\`template: \${key} 箱尺寸錯誤 \${JSON.stringify(b)}\`);
      if (b.rot !== 0 && b.rot !== 1) errs.push(\`template: \${key} rot 非 0/1 \${JSON.stringify(b)}\`);
    }
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++)
        if (overlaps(boxes[i], boxes[j])) errs.push(\`template: \${key} 重疊 \${JSON.stringify(boxes[i])} vs \${JSON.stringify(boxes[j])}\`);
  }
  if (r.totalBoxes !== r.perLevel * r.levels) errs.push('template: totalBoxes 不一致');
  return errs;
}

// 五種固定箱數模板求解：依 boxL/boxW 適配/置中/轉向；A/B 皆無越界無重疊，且外緣平整、A/B 外框四界對齊，才適用（T3a）。
// 不任意變更箱數；無法放下的選項顯示不適用原因。
export function solveTemplates(raw) {
  const v = validateInput(raw);
  if (!v.ok) return { ok: false, errors: v.errors };
  const { palletL, palletW, palletH, boxL, boxW, boxH, maxTotalH } = v.values;

  const usableHeight = maxTotalH - palletH;
  const levels = usableHeight >= boxH ? Math.floor(usableHeight / boxH) : 0;
  const errors = [];
  if (levels > LIMITS.maxLevels)
    errors.push(\`層數 \${levels} 超過上限 \${LIMITS.maxLevels} 層（請降低最高總高度或增加紙箱高度）\`);
  if (errors.length > 0) return { ok: false, errors };

  const candidates = AB_PATTERN_IDS.map((id) => {
    const c = evaluateTemplateEligibility(id, boxL, boxW, palletL, palletW); // fit + 外緣平整 + AB四界對齊
    if (c.applicable) {
      const ab = supportCoverage(c.layouts.B, c.layouts.A); // A 在下、B 在上
      const ba = supportCoverage(c.layouts.A, c.layouts.B); // B 在下、A 在上
      c.support = {
        aToB: { minRatio: ab.minRatio, ratios: ab.ratios, hasHole: ab.hasHole, insufficient: ab.insufficient },
        bToA: { minRatio: ba.minRatio, ratios: ba.ratios, hasHole: ba.hasHole, insufficient: ba.insufficient },
      };
      const warns = [];
      if (ab.minRatio < 1) warns.push(\`上層(B)箱支撐不足：minRatio=\${ab.minRatio}（內部留縫據實計算）\`);
      if (ba.minRatio < 1) warns.push(\`上層(A)箱支撐不足：minRatio=\${ba.minRatio}（內部留縫據實計算）\`);
      c.warnings = warns;
    }
    return c;
  });

  const applicable = candidates.filter((c) => c.applicable);
  let best = null;
  for (const c of applicable)
    if (!best || c.boxCount > best.boxCount) best = c; // 五種中箱數最多者

  const result = {
    ok: true,
    mode: 'templates',
    input: v.values,
    palletL, palletW, palletH, boxL, boxW, boxH, maxTotalH,
    usableHeight, levels,
    totalHeightUsed: palletH + levels * boxH,
    maxTotalH,
    candidates,
    bestPatternId: best ? best.patternId : null,
    message: null,
    limits: LIMITS,
    algorithm: 'fixed-templates (五種固定箱數 A/B 模板：4/5/6/7/8 箱；A/B 皆不越界不重疊、外緣平整且 A/B 外框四界對齊才適用；僅宣稱五模板中箱數最多，非全域最優)',
  };
  if (levels === 0)
    result.message = '扣除棧板高度後，可用高度不足一層紙箱高度，無法堆疊。';
  else if (!best)
    result.message = '五種模板在此棧板尺寸皆不適用（各模板的 A 與 B 需在同一棧板內皆無越界且無重疊，並另需外緣平整與 A/B 外框四界對齊）；請參考各模板的不適用原因。';

  if (best) {
    // 舊欄位相容：layout = 最佳模板的 A 布局（無 layouts 的舊消費者仍可用）。
    result.patternId = best.patternId;
    result.patternName = best.patternName;
    result.layerPattern = 'AB';
    result.perLevel = best.boxCount;
    result.totalBoxes = best.boxCount * levels;
    result.layout = best.layouts.A;
    result.layouts = { A: best.layouts.A, B: best.layouts.B };
    result.support = best.support;
    result.areaUpperBound = Math.floor((palletL * palletW) / (boxL * boxW));
    result.optimality = 'template-best'; // 僅五模板中箱數最多，不冒稱全域最優
    result.utilization = (best.boxCount * boxL * boxW) / (palletL * palletW);
    result.noFit = false;
    result.usedMixedLayout = best.layouts.A.some((b) => b.rot === 0) && best.layouts.A.some((b) => b.rot === 1);
    result.solverNote = '五種固定箱數模板模式：最佳化僅指五種模板中箱數最多者，非一般三維堆疊的全域最優證明。';
    if (result.totalBoxes > LIMITS.maxTotalBoxes)
      return { ok: false, errors: [\`總箱數 \${result.totalBoxes} 超過上限 \${LIMITS.maxTotalBoxes} 箱（請降低最高總高度或減少層數）\`] };
    result.runtimeErrors = validateTemplateResult(result);
    if (result.runtimeErrors.length > 0)
      return { ok: false, errors: ['內部模板幾何驗證失敗，請調整輸入後重試。', ...result.runtimeErrors] };
  } else {
    result.perLevel = 0;
    result.totalBoxes = 0;
    result.optimality = 'none';
  }
  return result;
}
`,I=`// src/layout-geometry.js — T2：軸平行矩形聯集的「外緣平整」與「A/B 外框對齊」純幾何 helper
//
// 定義
//   外緣平整 (flat)：聯集邊界在 bounding box 的左/右/下/上四側，都被箱子的「實際邊」完整覆蓋。
//     • 允許中央封閉孔（平整 ≠ 完全填滿）。
//     • 不允許連到外界的凹口（任何一侧出現正寬度缺口即 flat false）。
//   判定方式：四側各自做「閉區間排序合併」，touching edges（端點相接）視為連續覆蓋。
//     因為聯集為閉集、其補集為開集，若 ∂bbox 全含於聯集，則連外的補集分量只能留在 bbox 外，
//     內部未覆蓋分量必為封閉孔 → 「四側完整覆蓋」⟺「無連外凹口」。
//   不做像素抽樣、不建二維 dense grid；只比較 bbox 的 width/height 不足，四側 minX/minY/maxX/maxY 皆須相等。
//
// 範圍聲明（重要）
//   本模組只檢查「外緣平整」與「外框對齊」。箱間重疊、支撐/重力安全、孔洞是否可接受、
//   與托盤邊界相容性等，均由既有 runtime validator 負責；本模組不代替完整幾何有效性檢查。
//   valid 僅代表「輸入格式有效」，不代表幾何合法或可堆疊。
//
// 輸入：[{x, y, w, h, rot?}]，整數 mm。x/y 可為負（支援純平移）；w/h 必為正安全整數；
//       x+w / y+h 亦必為安全整數。rot 僅為透傳欄位，本模組不依 rot 推測或交換尺寸，也不 mutate 輸入。

export const MAX_LAYOUT_BOXES = 5000;

const SAFE_MAX = Number.MAX_SAFE_INTEGER;
const SAFE_MIN = Number.MIN_SAFE_INTEGER;

const isSafeInt = (v) => typeof v === 'number' && Number.isSafeInteger(v);

/** 精確比較（不用 a-b，避免安全整數之差超出 2^53 而失真）。 */
function cmpInt(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * 輸入驗證。回傳 {boxes: 正規化副本[], bounds} 或 {error: '...' }。
 * 硬限 MAX_LAYOUT_BOXES 在 sort/allocate 之前檢查；不做任何 coercion。
 */
function validateBoxes(boxes, label) {
  const tag = label ? \`\${label}.\` : '';
  if (!Array.isArray(boxes)) return { error: \`\${tag}boxes 必須是陣列\` };
  if (boxes.length === 0) return { error: \`\${tag}boxes 不可為空陣列\` };
  if (boxes.length > MAX_LAYOUT_BOXES) {
    return { error: \`\${tag}箱數 \${boxes.length} 超過硬限 MAX_LAYOUT_BOXES=\${MAX_LAYOUT_BOXES}\` };
  }
  const norm = new Array(boxes.length);
  for (let i = 0; i < boxes.length; i++) {
    if (!(i in boxes)) return { error: \`\${tag}boxes 為稀疏陣列（索引 \${i} 為洞）\` };
    const b = boxes[i];
    if (b === null || typeof b !== 'object' || Array.isArray(b)) {
      return { error: \`\${tag}boxes[\${i}] 必須是物件（實際 \${b === null ? 'null' : typeof b}）\` };
    }
    if (!isSafeInt(b.x) || !isSafeInt(b.y)) {
      return { error: \`\${tag}boxes[\${i}].x/y 必須是有限安全整數（實際 x=\${String(b.x)}, y=\${String(b.y)}）\` };
    }
    if (!isSafeInt(b.w) || b.w <= 0) {
      return { error: \`\${tag}boxes[\${i}].w 必須是正安全整數（實際 \${String(b.w)}）\` };
    }
    if (!isSafeInt(b.h) || b.h <= 0) {
      return { error: \`\${tag}boxes[\${i}].h 必須是正安全整數（實際 \${String(b.h)}）\` };
    }
    const x2 = b.x + b.w, y2 = b.y + b.h;
    if (!isSafeInt(x2)) return { error: \`\${tag}boxes[\${i}] x+w=\${String(x2)} 超出安全整數範圍\` };
    if (!isSafeInt(y2)) return { error: \`\${tag}boxes[\${i}] y+h=\${String(y2)} 超出安全整數範圍\` };
    norm[i] = { x: b.x, y: b.y, w: b.w, h: b.h, x2, y2 };
  }

  let minX = SAFE_MAX, minY = SAFE_MAX, maxX = SAFE_MIN, maxY = SAFE_MIN;
  for (const b of norm) {
    if (b.x < minX) minX = b.x;
    if (b.y < minY) minY = b.y;
    if (b.x2 > maxX) maxX = b.x2;
    if (b.y2 > maxY) maxY = b.y2;
  }
  const width = maxX - minX, height = maxY - minY;
  if (!isSafeInt(width) || !isSafeInt(height)) {
    return { error: \`\${tag}外框跨度超出安全整數範圍（width=\${String(width)}, height=\${String(height)}）\` };
  }
  return { boxes: norm, bounds: { minX, minY, maxX, maxY, width, height } };
}

/**
 * 閉區間合併：在 [lo, hi] 內找出未覆蓋的正寬度缺口。
 * 區間端點相接（s === cur）視為連續覆蓋，不算缺口。O(k log k) 排序 + O(k) 掃描。
 */
function findSideGaps(intervals, lo, hi) {
  if (intervals.length === 0) return lo < hi ? [[lo, hi]] : [];
  intervals.sort((a, b) => cmpInt(a[0], b[0]) || cmpInt(a[1], b[1]));
  const gaps = [];
  let cur = lo;
  for (let i = 0; i < intervals.length; i++) {
    const s = intervals[i][0], e = intervals[i][1];
    if (e <= cur) continue;          // 已被覆蓋
    if (s > cur) gaps.push([cur, s]); // 正寬度缺口
    cur = e;
    if (cur >= hi) break;
  }
  if (cur < hi) gaps.push([cur, hi]);
  return gaps;
}

const SIDE_LABEL = { left: '左側', right: '右側', bottom: '下側', top: '上側' };

function gapErrors(side, fixed, gaps) {
  return gaps.map(([a, b]) => {
    const axis = (side === 'left' || side === 'right') ? 'y' : 'x';
    return \`\${SIDE_LABEL[side]}外緣缺口：\${axis === 'y' ? 'x' : 'y'}=\${fixed}，\${axis}∈[\${a},\${b}]（缺口寬 \${b - a}mm）\`;
  });
}

// ── API ────────────────────────────────────────────────────────────────────────────

/**
 * getLayoutBounds(boxes) → {minX,minY,maxX,maxY,width,height} | null
 * 空陣列或任何無效輸入 → null。
 */
export function getLayoutBounds(boxes) {
  const v = validateBoxes(boxes, '');
  return v.error ? null : { ...v.bounds };
}

/**
 * analyzeLayoutOutline(boxes) → {valid, flat, bounds, errors}
 *   valid  ：輸入格式有效（不代表幾何合法／可堆疊；重疊由 runtime validator 檢查）
 *   flat   ：外緣是否平整（valid false 時必為 false，絕不把例外吞成 flat true）
 *   bounds ：有效輸入時的外框（即使 flat false 也提供），否則 null
 *   errors ：繁中訊息，指出哪一侧、哪個區間有缺口
 * 複雜度：O(n log n)（四側各排序）／O(n) 合併掃描；無二維 dense 格、無像素抽樣。
 */
export function analyzeLayoutOutline(boxes) {
  const v = validateBoxes(boxes, '');
  if (v.error) return { valid: false, flat: false, bounds: null, errors: [v.error] };

  const { boxes: norm, bounds } = v;
  const { minX, minY, maxX, maxY } = bounds;
  const errors = [];

  const left = [], right = [], bottom = [], top = [];
  for (const b of norm) {
    if (b.x === minX) left.push([b.y, b.y2]);
    if (b.x2 === maxX) right.push([b.y, b.y2]);
    if (b.y === minY) bottom.push([b.x, b.x2]);
    if (b.y2 === maxY) top.push([b.x, b.x2]);
  }

  errors.push(...gapErrors('left', minX, findSideGaps(left, minY, maxY)));
  errors.push(...gapErrors('right', maxX, findSideGaps(right, minY, maxY)));
  errors.push(...gapErrors('bottom', minY, findSideGaps(bottom, minX, maxX)));
  errors.push(...gapErrors('top', maxY, findSideGaps(top, minX, maxX)));

  return { valid: true, flat: errors.length === 0, bounds: { ...bounds }, errors };
}

/**
 * compareAlignedBounds(aBoxes, bBoxes) → {aligned, aBounds, bBounds, errors}
 *   aligned：minX/minY/maxX/maxY 四者全部相等（不只 width/height 相等；同尺寸不同位置 → false）。
 *   任一側空/無效 → aligned 必 false。內孔不同不影響 aligned。
 */
export function compareAlignedBounds(aBoxes, bBoxes) {
  const va = validateBoxes(aBoxes, 'A');
  const vb = validateBoxes(bBoxes, 'B');
  const errors = [];
  if (va.error) errors.push(va.error);
  if (vb.error) errors.push(vb.error);
  if (errors.length > 0) {
    return { aligned: false, aBounds: va.error ? null : { ...va.bounds }, bBounds: vb.error ? null : { ...vb.bounds }, errors };
  }
  const a = va.bounds, b = vb.bounds;
  for (const key of ['minX', 'minY', 'maxX', 'maxY']) {
    if (a[key] !== b[key]) errors.push(\`外框未對齊：\${key} A=\${a[key]} vs B=\${b[key]}\`);
  }
  return { aligned: errors.length === 0, aBounds: { ...a }, bBounds: { ...b }, errors };
}
`,ee=`
self.onmessage=function(e){var r=e.data.mode==="templates"?solveTemplates(e.data.input):solve(e.data.input);self.postMessage({reqId:e.data.reqId,result:r});};`;function te(e,t){if(typeof e!=`string`||typeof t!=`string`)throw Error(`組裝器需要兩段原始碼字串（layout-geometry 前置、solver-core 後置）`);let n=e.replace(/\r\n/g,`
`),r=t.replace(/\r\n/g,`
`);if(/^\s*import\s/m.test(n))throw Error(`layout-geometry 原始碼含 import 陳述式：classic worker 無法承載，拒絕組裝`);let i=r.replace(`import { analyzeLayoutOutline, compareAlignedBounds } from './layout-geometry.js';
`,``);if(i===r)throw Error(`找不到 solver-core 的 layout-geometry helper import 行：請同步更新組裝器，不可靜默放行`);if(/^\s*import\s/m.test(i))throw Error(`solver-core 含未知 import 陳述式：worker 組裝只允許精確移除已知 helper import`);let a=n.replace(/^export\s+/gm,``),o=i.replace(/^export\s+/gm,``);return a+`
`+o+ee}var ne,re,L,ie,ae,oe,se,ce,le,ue={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},de={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},fe=1e3,pe=1001,me=1002,he=1003,ge=1004,_e=1005,ve=1006,ye=1007,be=1008,xe=1009,R=1010,Se=1011,Ce=1012,we=1013,Te=1014,Ee=1015,De=1016,Oe=1017,ke=1018,Ae=1020,z=35902,je=35899,B=1021,V=1022,Me=1023,Ne=1026,Pe=1027,Fe=1028,Ie=1029,Le=1030,Re=1031,ze=1033,Be=33776,Ve=33777,He=33778,Ue=33779,We=35840,Ge=35841,Ke=35842,qe=35843,Je=36196,Ye=37492,Xe=37496,Ze=37488,Qe=37489,$e=37490,et=37491,tt=37808,nt=37809,rt=37810,it=37811,at=37812,ot=37813,st=37814,ct=37815,lt=37816,ut=37817,dt=37818,ft=37819,pt=37820,mt=37821,ht=36492,gt=36494,_t=36495,vt=36283,yt=36284,bt=36285,xt=36286,St=2300,Ct=2301,wt=2302,Tt=2303,Et=2400,Dt=2401,Ot=2402,kt=3200,At=`srgb`,jt=`srgb-linear`,Mt=`linear`,Nt=`srgb`,Pt=7680,Ft=35044,It=2e3;function Lt(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Rt(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function zt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Bt(){let e=zt(`canvas`);return e.style.display=`block`,e}var Vt={};function Ht(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Ut(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function H(...e){e=Ut(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function U(...e){e=Ut(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Wt(...e){let t=e.join(` `);t in Vt||(Vt[t]=!0,H(...e))}function Gt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Kt={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},qt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Jt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Yt=1234567,Xt=Math.PI/180,Zt=180/Math.PI;function Qt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Jt[e&255]+Jt[e>>8&255]+Jt[e>>16&255]+Jt[e>>24&255]+`-`+Jt[t&255]+Jt[t>>8&255]+`-`+Jt[t>>16&15|64]+Jt[t>>24&255]+`-`+Jt[n&63|128]+Jt[n>>8&255]+`-`+Jt[n>>16&255]+Jt[n>>24&255]+Jt[r&255]+Jt[r>>8&255]+Jt[r>>16&255]+Jt[r>>24&255]).toLowerCase()}function W(e,t,n){return Math.max(t,Math.min(n,e))}function $t(e,t){return(e%t+t)%t}function en(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function tn(e,t,n){return e===t?0:(n-e)/(t-e)}function nn(e,t,n){return(1-n)*e+n*t}function rn(e,t,n,r){return nn(e,t,1-Math.exp(-n*r))}function an(e,t=1){return t-Math.abs($t(e,t*2)-t)}function on(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function sn(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function cn(e,t){return e+Math.floor(Math.random()*(t-e+1))}function ln(e,t){return e+Math.random()*(t-e)}function un(e){return e*(.5-Math.random())}function dn(e){e!==void 0&&(Yt=e);let t=Yt+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function fn(e){return e*Xt}function pn(e){return e*Zt}function mn(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function hn(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function gn(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function _n(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:H(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function vn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function yn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var bn={DEG2RAD:Xt,RAD2DEG:Zt,generateUUID:Qt,clamp:W,euclideanModulo:$t,mapLinear:en,inverseLerp:tn,lerp:nn,damp:rn,pingpong:an,smoothstep:on,smootherstep:sn,randInt:cn,randFloat:ln,randFloatSpread:un,seededRandom:dn,degToRad:fn,radToDeg:pn,isPowerOfTwo:mn,ceilPowerOfTwo:hn,floorPowerOfTwo:gn,setQuaternionFromProperEuler:_n,normalize:yn,denormalize:vn};se=Symbol.iterator;var G=class{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(W(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[se](){yield this.x,yield this.y}};ne=G,ne.prototype.isVector2=!0;var xn=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:H(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(W(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};ce=Symbol.iterator;var K=class{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Cn.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Cn.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this.z=W(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this.z=W(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Sn.copy(this).projectOnVector(e),this.sub(Sn)}reflect(e){return this.sub(Sn.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(W(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[ce](){yield this.x,yield this.y,yield this.z}};re=K,re.prototype.isVector3=!0;var Sn=new K,Cn=new xn,q=class{constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Wt(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(wn.makeScale(e,t)),this}rotate(e){return Wt(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(wn.makeRotation(-e)),this}translate(e,t){return Wt(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(wn.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};L=q,L.prototype.isMatrix3=!0;var wn=new q,Tn=new q().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),En=new q().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Dn(){let e={enabled:!0,workingColorSpace:jt,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=On(e.r),e.g=On(e.g),e.b=On(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=kn(e.r),e.g=kn(e.g),e.b=kn(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Mt:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Wt(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Wt(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[jt]:{primaries:t,whitePoint:r,transfer:Mt,toXYZ:Tn,fromXYZ:En,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:At},outputColorSpaceConfig:{drawingBufferColorSpace:At}},[At]:{primaries:t,whitePoint:r,transfer:Nt,toXYZ:Tn,fromXYZ:En,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:At}}}),e}var J=Dn();function On(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function kn(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var An,jn=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{An===void 0&&(An=zt(`canvas`)),An.width=e.width,An.height=e.height;let t=An.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=An}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=zt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=On(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(On(t[e]/255)*255):t[e]=On(t[e]);return{data:t,width:e.width,height:e.height}}return H(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Mn=0,Nn=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Mn++}),this.uuid=Qt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Pn(r[t].image)):e.push(Pn(r[t]))}else e=Pn(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Pn(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?jn.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(H(`Texture: Unable to serialize Texture.`),{})}var Fn=0,In=new K,Ln=class e extends qt{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=pe,i=pe,a=ve,o=be,s=Me,c=xe,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fn++}),this.uuid=Qt(),this.name=``,this.source=new Nn(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new G(0,0),this.repeat=new G(1,1),this.center=new G(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new q,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(In).x}get height(){return this.source.getSize(In).y}get depth(){return this.source.getSize(In).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){H(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?H(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fe:e.x-=Math.floor(e.x);break;case pe:e.x=e.x<0?0:1;break;case me:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case fe:e.y-=Math.floor(e.y);break;case pe:e.y=e.y<0?0:1;break;case me:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ln.DEFAULT_IMAGE=null,Ln.DEFAULT_MAPPING=300,Ln.DEFAULT_ANISOTROPY=1,le=Symbol.iterator;var Rn=class{constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this.z=W(this.z,e.z,t.z),this.w=W(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this.z=W(this.z,e,t),this.w=W(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[le](){yield this.x,yield this.y,yield this.z,yield this.w}};ie=Rn,ie.prototype.isVector4=!0;var zn=class extends qt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ve,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Rn(0,0,e,t),this.scissorTest=!1,this.viewport=new Rn(0,0,e,t),this.textures=[];let r=new Ln({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:ve,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Nn(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Bn=class extends zn{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Vn=class extends Ln{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=he,this.minFilter=he,this.wrapR=pe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Hn=class extends Ln{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=he,this.minFilter=he,this.wrapR=pe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Un=class e{constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Wn.setFromMatrixColumn(e,0).length(),i=1/Wn.setFromMatrixColumn(e,1).length(),a=1/Wn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Kn,e,qn)}lookAt(e,t,n){let r=this.elements;return Xn.subVectors(e,t),Xn.lengthSq()===0&&(Xn.z=1),Xn.normalize(),Jn.crossVectors(n,Xn),Jn.lengthSq()===0&&(Math.abs(n.z)===1?Xn.x+=1e-4:Xn.z+=1e-4,Xn.normalize(),Jn.crossVectors(n,Xn)),Jn.normalize(),Yn.crossVectors(Xn,Jn),r[0]=Jn.x,r[4]=Yn.x,r[8]=Xn.x,r[1]=Jn.y,r[5]=Yn.y,r[9]=Xn.y,r[2]=Jn.z,r[6]=Yn.z,r[10]=Xn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],F=r[11],I=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*F,i[12]=a*w+o*O+s*M+c*I,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*F,i[13]=l*w+u*O+d*M+f*I,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*F,i[14]=p*w+m*O+h*M+g*I,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*F,i[15]=_*w+v*O+y*M+b*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Wn.set(r[0],r[1],r[2]).length(),o=Wn.set(r[4],r[5],r[6]).length(),s=Wn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Gn.copy(this);let c=1/a,l=1/o,u=1/s;return Gn.elements[0]*=c,Gn.elements[1]*=c,Gn.elements[2]*=c,Gn.elements[4]*=l,Gn.elements[5]*=l,Gn.elements[6]*=l,Gn.elements[8]*=u,Gn.elements[9]*=u,Gn.elements[10]*=u,t.setFromRotationMatrix(Gn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=It,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=It,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};ae=Un,ae.prototype.isMatrix4=!0;var Wn=new K,Gn=new Un,Kn=new K(0,0,0),qn=new K(1,1,1),Jn=new K,Yn=new K,Xn=new K,Zn=new Un,Qn=new xn,$n=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(W(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-W(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(W(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-W(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(W(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-W(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:H(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Zn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Zn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Qn.setFromEuler(this),this.setFromQuaternion(Qn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};$n.DEFAULT_ORDER=`XYZ`;var er=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},tr=0,nr=new K,rr=new xn,ir=new Un,ar=new K,or=new K,sr=new K,cr=new xn,lr=new K(1,0,0),ur=new K(0,1,0),dr=new K(0,0,1),fr={type:`added`},pr={type:`removed`},mr={type:`childadded`,child:null},hr={type:`childremoved`,child:null},gr=class e extends qt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:tr++}),this.uuid=Qt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new K,n=new $n,r=new xn,i=new K(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Un},normalMatrix:{value:new q}}),this.matrix=new Un,this.matrixWorld=new Un,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new er,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return rr.setFromAxisAngle(e,t),this.quaternion.multiply(rr),this}rotateOnWorldAxis(e,t){return rr.setFromAxisAngle(e,t),this.quaternion.premultiply(rr),this}rotateX(e){return this.rotateOnAxis(lr,e)}rotateY(e){return this.rotateOnAxis(ur,e)}rotateZ(e){return this.rotateOnAxis(dr,e)}translateOnAxis(e,t){return nr.copy(e).applyQuaternion(this.quaternion),this.position.add(nr.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(lr,e)}translateY(e){return this.translateOnAxis(ur,e)}translateZ(e){return this.translateOnAxis(dr,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ir.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ar.copy(e):ar.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),or.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ir.lookAt(or,ar,this.up):ir.lookAt(ar,or,this.up),this.quaternion.setFromRotationMatrix(ir),r&&(ir.extractRotation(r.matrixWorld),rr.setFromRotationMatrix(ir),this.quaternion.premultiply(rr.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(U(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(fr),mr.child=e,this.dispatchEvent(mr),mr.child=null):U(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(pr),hr.child=e,this.dispatchEvent(hr),hr.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ir.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ir.multiply(e.parent.matrixWorld)),e.applyMatrix4(ir),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(fr),mr.child=e,this.dispatchEvent(mr),mr.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,e,sr),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,cr,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};gr.DEFAULT_UP=new K(0,1,0),gr.DEFAULT_MATRIX_AUTO_UPDATE=!0,gr.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var _r=class extends gr{constructor(){super(),this.isGroup=!0,this.type=`Group`}},vr={type:`move`},yr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _r,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _r,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new K,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new K),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _r,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new K,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new K,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(vr)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new _r;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},br={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},xr={h:0,s:0,l:0},Sr={h:0,s:0,l:0};function Cr(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var Y=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=At){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,J.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=J.workingColorSpace){return this.r=e,this.g=t,this.b=n,J.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=J.workingColorSpace){if(e=$t(e,1),t=W(t,0,1),n=W(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Cr(i,r,e+1/3),this.g=Cr(i,r,e),this.b=Cr(i,r,e-1/3)}return J.colorSpaceToWorking(this,r),this}setStyle(e,t=At){function n(t){t!==void 0&&parseFloat(t)<1&&H(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:H(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);H(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=At){let n=br[e.toLowerCase()];return n===void 0?H(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=On(e.r),this.g=On(e.g),this.b=On(e.b),this}copyLinearToSRGB(e){return this.r=kn(e.r),this.g=kn(e.g),this.b=kn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=At){return J.workingToColorSpace(wr.copy(this),e),Math.round(W(wr.r*255,0,255))*65536+Math.round(W(wr.g*255,0,255))*256+Math.round(W(wr.b*255,0,255))}getHexString(e=At){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=J.workingColorSpace){J.workingToColorSpace(wr.copy(this),t);let n=wr.r,r=wr.g,i=wr.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=J.workingColorSpace){return J.workingToColorSpace(wr.copy(this),t),e.r=wr.r,e.g=wr.g,e.b=wr.b,e}getStyle(e=At){J.workingToColorSpace(wr.copy(this),e);let t=wr.r,n=wr.g,r=wr.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(xr),this.setHSL(xr.h+e,xr.s+t,xr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(xr),e.getHSL(Sr);let n=nn(xr.h,Sr.h,t),r=nn(xr.s,Sr.s,t),i=nn(xr.l,Sr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},wr=new Y;Y.NAMES=br;var Tr=class extends gr{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new $n,this.environmentIntensity=1,this.environmentRotation=new $n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Er=new K,Dr=new K,Or=new K,kr=new K,Ar=new K,jr=new K,Mr=new K,Nr=new K,Pr=new K,Fr=new K,Ir=new Rn,Lr=new Rn,Rr=new Rn,zr=class e{constructor(e=new K,t=new K,n=new K){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Er.subVectors(e,t),r.cross(Er);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Er.subVectors(r,t),Dr.subVectors(n,t),Or.subVectors(e,t);let a=Er.dot(Er),o=Er.dot(Dr),s=Er.dot(Or),c=Dr.dot(Dr),l=Dr.dot(Or),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,kr)!==null&&kr.x>=0&&kr.y>=0&&kr.x+kr.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,kr)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,kr.x),s.addScaledVector(a,kr.y),s.addScaledVector(o,kr.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Ir.setScalar(0),Lr.setScalar(0),Rr.setScalar(0),Ir.fromBufferAttribute(e,t),Lr.fromBufferAttribute(e,n),Rr.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Ir,i.x),a.addScaledVector(Lr,i.y),a.addScaledVector(Rr,i.z),a}static isFrontFacing(e,t,n,r){return Er.subVectors(n,t),Dr.subVectors(e,t),Er.cross(Dr).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Er.subVectors(this.c,this.b),Dr.subVectors(this.a,this.b),Er.cross(Dr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Ar.subVectors(r,n),jr.subVectors(i,n),Nr.subVectors(e,n);let s=Ar.dot(Nr),c=jr.dot(Nr);if(s<=0&&c<=0)return t.copy(n);Pr.subVectors(e,r);let l=Ar.dot(Pr),u=jr.dot(Pr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Ar,a);Fr.subVectors(e,i);let f=Ar.dot(Fr),p=jr.dot(Fr);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(jr,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Mr.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Mr,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Ar,a).addScaledVector(jr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Br=class{constructor(e=new K(1/0,1/0,1/0),t=new K(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Hr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Hr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Hr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Hr):Hr.fromBufferAttribute(r,t),Hr.applyMatrix4(e.matrixWorld),this.expandByPoint(Hr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Ur.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Ur.copy(e.boundingBox)),Ur.applyMatrix4(e.matrixWorld),this.union(Ur)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Hr),Hr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Xr),Zr.subVectors(this.max,Xr),Wr.subVectors(e.a,Xr),Gr.subVectors(e.b,Xr),Kr.subVectors(e.c,Xr),qr.subVectors(Gr,Wr),Jr.subVectors(Kr,Gr),Yr.subVectors(Wr,Kr);let t=[0,-qr.z,qr.y,0,-Jr.z,Jr.y,0,-Yr.z,Yr.y,qr.z,0,-qr.x,Jr.z,0,-Jr.x,Yr.z,0,-Yr.x,-qr.y,qr.x,0,-Jr.y,Jr.x,0,-Yr.y,Yr.x,0];return!ei(t,Wr,Gr,Kr,Zr)||(t=[1,0,0,0,1,0,0,0,1],!ei(t,Wr,Gr,Kr,Zr))?!1:(Qr.crossVectors(qr,Jr),t=[Qr.x,Qr.y,Qr.z],ei(t,Wr,Gr,Kr,Zr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Hr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Hr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Vr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Vr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Vr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Vr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Vr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Vr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Vr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Vr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Vr)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Vr=[new K,new K,new K,new K,new K,new K,new K,new K],Hr=new K,Ur=new Br,Wr=new K,Gr=new K,Kr=new K,qr=new K,Jr=new K,Yr=new K,Xr=new K,Zr=new K,Qr=new K,$r=new K;function ei(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){$r.fromArray(e,a);let o=i.x*Math.abs($r.x)+i.y*Math.abs($r.y)+i.z*Math.abs($r.z),s=t.dot($r),c=n.dot($r),l=r.dot($r);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var ti=new K,ni=new G,ri=0,ii=class extends qt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ri++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Ft,this.updateRanges=[],this.gpuType=Ee,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ni.fromBufferAttribute(this,t),ni.applyMatrix3(e),this.setXY(t,ni.x,ni.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ti.fromBufferAttribute(this,t),ti.applyMatrix3(e),this.setXYZ(t,ti.x,ti.y,ti.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ti.fromBufferAttribute(this,t),ti.applyMatrix4(e),this.setXYZ(t,ti.x,ti.y,ti.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ti.fromBufferAttribute(this,t),ti.applyNormalMatrix(e),this.setXYZ(t,ti.x,ti.y,ti.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ti.fromBufferAttribute(this,t),ti.transformDirection(e),this.setXYZ(t,ti.x,ti.y,ti.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=vn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=vn(t,this.array)),t}setX(e,t){return this.normalized&&(t=yn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=vn(t,this.array)),t}setY(e,t){return this.normalized&&(t=yn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=vn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=yn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=vn(t,this.array)),t}setW(e,t){return this.normalized&&(t=yn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=yn(t,this.array),n=yn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=yn(t,this.array),n=yn(n,this.array),r=yn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=yn(t,this.array),n=yn(n,this.array),r=yn(r,this.array),i=yn(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},ai=class extends ii{constructor(e,t,n){super(new Uint16Array(e),t,n)}},oi=class extends ii{constructor(e,t,n){super(new Uint32Array(e),t,n)}},si=class extends ii{constructor(e,t,n){super(new Float32Array(e),t,n)}},ci=new Br,li=new K,ui=new K,di=class{constructor(e=new K,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?ci.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;li.subVectors(e,this.center);let t=li.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(li,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ui.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(li.copy(e.center).add(ui)),this.expandByPoint(li.copy(e.center).sub(ui))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},fi=0,pi=new Un,mi=new gr,hi=new K,gi=new Br,_i=new Br,vi=new K,yi=class e extends qt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fi++}),this.uuid=Qt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Lt(e)?oi:ai)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new q().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return pi.makeRotationFromQuaternion(e),this.applyMatrix4(pi),this}rotateX(e){return pi.makeRotationX(e),this.applyMatrix4(pi),this}rotateY(e){return pi.makeRotationY(e),this.applyMatrix4(pi),this}rotateZ(e){return pi.makeRotationZ(e),this.applyMatrix4(pi),this}translate(e,t,n){return pi.makeTranslation(e,t,n),this.applyMatrix4(pi),this}scale(e,t,n){return pi.makeScale(e,t,n),this.applyMatrix4(pi),this}lookAt(e){return mi.lookAt(e),mi.updateMatrix(),this.applyMatrix4(mi.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hi).negate(),this.translate(hi.x,hi.y,hi.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new si(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&H(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Br);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)U(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new K(-1/0,-1/0,-1/0),new K(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];gi.setFromBufferAttribute(n),this.morphTargetsRelative?(vi.addVectors(this.boundingBox.min,gi.min),this.boundingBox.expandByPoint(vi),vi.addVectors(this.boundingBox.max,gi.max),this.boundingBox.expandByPoint(vi)):(this.boundingBox.expandByPoint(gi.min),this.boundingBox.expandByPoint(gi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&U(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new di);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)U(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new K,1/0);else if(e){let n=this.boundingSphere.center;if(gi.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];_i.setFromBufferAttribute(n),this.morphTargetsRelative?(vi.addVectors(gi.min,_i.min),gi.expandByPoint(vi),vi.addVectors(gi.max,_i.max),gi.expandByPoint(vi)):(gi.expandByPoint(_i.min),gi.expandByPoint(_i.max))}gi.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)vi.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(vi));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)vi.fromBufferAttribute(a,t),o&&(hi.fromBufferAttribute(e,t),vi.add(hi)),r=Math.max(r,n.distanceToSquared(vi))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&U(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){U(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new ii(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new K,s[e]=new K;let c=new K,l=new K,u=new K,d=new G,f=new G,p=new G,m=new K,h=new K;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new K,y=new K,b=new K,x=new K;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new ii(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new K,i=new K,a=new K,o=new K,s=new K,c=new K,l=new K,u=new K;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)vi.fromBufferAttribute(e,t),vi.normalize(),e.setXYZ(t,vi.x,vi.y,vi.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new ii(a,r,i)}if(this.index===null)return H(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},bi=new K,xi=new K,Si=new q,Ci=class{constructor(e=new K(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=bi.subVectors(n,t).cross(xi.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(bi),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Si.getNormalMatrix(e),r=this.coplanarPoint(bi).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},wi=0,Ti=class extends qt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:wi++}),this.uuid=Qt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Y(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pt,this.stencilZFail=Pt,this.stencilZPass=Pt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){H(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?H(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Y().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Ci().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new G().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new G().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Ei=new K,Di=new K,Oi=new K,ki=new K,Ai=class{constructor(e=new K,t=new K(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ei)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ei.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ei.copy(this.origin).addScaledVector(this.direction,t),Ei.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Di.copy(e).add(t).multiplyScalar(.5),Oi.copy(t).sub(e).normalize(),ki.copy(this.origin).sub(Di);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Oi),o=ki.dot(this.direction),s=-ki.dot(Oi),c=ki.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Di).addScaledVector(Oi,d),f}intersectSphere(e,t){if(e.radius<0)return null;Ei.subVectors(e.center,this.origin);let n=Ei.dot(this.direction),r=Ei.dot(Ei)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Ei)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let P=S/w,F=C/w,I=1/w,ee=T-P*D,te=E-F*D,ne=O-P*A,re=k-F*A,L=j-P*N,ie=M-F*N,ae=L*re-ie*ne,oe=ee*ie-te*L,se=ne*te-re*ee;if(r){if(ae<0||oe<0||se<0)return null}else if((ae<0||oe<0||se<0)&&(ae>0||oe>0||se>0))return null;let ce=ae+oe+se;if(ce===0)return null;let le=I*(ae*D+oe*A+se*N);return(ce>0?le<0:le>0)?null:this.at(le/ce,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ji=class extends Ti{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new Y(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Mi=new Un,Ni=new Ai,Pi=new di,Fi=new K,Ii=new K,Li=new K,Ri=new K,zi=new K,Bi=new K,Vi=new K,Hi=new K,Ui=class extends gr{constructor(e=new yi,t=new ji){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Bi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(zi.fromBufferAttribute(s,e),a?Bi.addScaledVector(zi,r):Bi.addScaledVector(zi.sub(t),r))}t.add(Bi)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Pi.copy(n.boundingSphere),Pi.applyMatrix4(i),Ni.copy(e.ray).recast(e.near),!(Pi.containsPoint(Ni.origin)===!1&&(Ni.intersectSphere(Pi,Fi)===null||Ni.origin.distanceToSquared(Fi)>(e.far-e.near)**2))&&(Mi.copy(i).invert(),Ni.copy(e.ray).applyMatrix4(Mi),(n.boundingBox===null||Ni.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Ni)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Gi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Gi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Gi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Gi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Wi(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Hi.copy(s),Hi.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Hi);return l<n.near||l>n.far?null:{distance:l,point:Hi.clone(),object:e}}function Gi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Ii),e.getVertexPosition(c,Li),e.getVertexPosition(l,Ri);let u=Wi(e,t,n,r,Ii,Li,Ri,Vi);if(u){let e=new K;zr.getBarycoord(Vi,Ii,Li,Ri,e),i&&(u.uv=zr.getInterpolatedAttribute(i,s,c,l,e,new G)),a&&(u.uv1=zr.getInterpolatedAttribute(a,s,c,l,e,new G)),o&&(u.normal=zr.getInterpolatedAttribute(o,s,c,l,e,new K),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new K,materialIndex:0};zr.getNormal(Ii,Li,Ri,t.normal),u.face=t,u.barycoord=e}return u}var Ki=class extends Ln{constructor(e=null,t=1,n=1,r,i,a,o,s,c=he,l=he,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},qi=class extends ii{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ji=new Un,Yi=new Un,Xi=[],Zi=new Br,Qi=new Un,$i=new Ui,ea=new di,ta=class extends Ui{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new qi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Qi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Br),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ji),Zi.copy(e.boundingBox).applyMatrix4(Ji),this.boundingBox.union(Zi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new di),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ji),ea.copy(e.boundingSphere).applyMatrix4(Ji),this.boundingSphere.union(ea)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if($i.geometry=this.geometry,$i.material=this.material,$i.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ea.copy(this.boundingSphere),ea.applyMatrix4(n),e.ray.intersectsSphere(ea)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Ji),Yi.multiplyMatrices(n,Ji),$i.matrixWorld=Yi,$i.raycast(e,Xi);for(let e=0,n=Xi.length;e<n;e++){let n=Xi[e];n.instanceId=i,n.object=this,t.push(n)}Xi.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new qi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ki(new Float32Array(r*this.count),r,this.count,Fe,Ee));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},na=new di,ra=new G(.5,.5),ia=new K,aa=class{constructor(e=new Ci,t=new Ci,n=new Ci,r=new Ci,i=new Ci,a=new Ci){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=It,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),na.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),na.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(na)}intersectsSprite(e){return na.center.set(0,0,0),na.radius=.7071067811865476+ra.distanceTo(e.center),na.applyMatrix4(e.matrixWorld),this.intersectsSphere(na)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(ia.x=r.normal.x>0?e.max.x:e.min.x,ia.y=r.normal.y>0?e.max.y:e.min.y,ia.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ia)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},oa=class extends Ti{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new Y(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},sa=new K,ca=new K,la=new Un,ua=new Ai,da=new di,fa=new K,pa=new K,ma=class extends gr{constructor(e=new yi,t=new oa){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)sa.fromBufferAttribute(t,e-1),ca.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=sa.distanceTo(ca);e.setAttribute(`lineDistance`,new si(n,1))}else H(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),da.copy(n.boundingSphere),da.applyMatrix4(r),da.radius+=i,e.ray.intersectsSphere(da)===!1)return;la.copy(r).invert(),ua.copy(e.ray).applyMatrix4(la);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=ha(this,e,ua,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=ha(this,e,ua,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=ha(this,e,ua,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=ha(this,e,ua,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function ha(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(sa.fromBufferAttribute(s,i),ca.fromBufferAttribute(s,a),n.distanceSqToSegment(sa,ca,fa,pa)>r)return;fa.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(fa);if(!(c<t.near||c>t.far))return{distance:c,point:pa.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var ga=new K,_a=new K,va=class extends ma{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)ga.fromBufferAttribute(t,e),_a.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+ga.distanceTo(_a);e.setAttribute(`lineDistance`,new si(n,1))}else H(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},ya=class extends Ln{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ba=class extends Ln{constructor(e,t,n=Te,r,i,a,o=he,s=he,c,l=Ne,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Nn(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},xa=class extends ba{constructor(e,t=Te,n=301,r,i,a=he,o=he,s,c=Ne){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Sa=class extends Ln{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Ca=class e extends yi{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new si(c,3)),this.setAttribute(`normal`,new si(l,3)),this.setAttribute(`uv`,new si(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new K;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},wa=class e extends yi{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new si(u,3)),this.setAttribute(`normal`,new si(d,3)),this.setAttribute(`uv`,new si(f,2));function _(){let a=new K,_=new K,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new G,m=new K,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ta=new K,Ea=new K,Da=new K,Oa=new zr,ka=class extends yi{constructor(e=null,t=1){if(super(),this.type=`EdgesGeometry`,this.parameters={geometry:e,thresholdAngle:t},e!==null){let n=1e4,r=Math.cos(Xt*t),i=e.getIndex(),a=e.getAttribute(`position`),o=i?i.count:a.count,s=[0,0,0],c=[`a`,`b`,`c`],l=[,,,],u={},d=[];for(let e=0;e<o;e+=3){i?(s[0]=i.getX(e),s[1]=i.getX(e+1),s[2]=i.getX(e+2)):(s[0]=e,s[1]=e+1,s[2]=e+2);let{a:t,b:o,c:f}=Oa;if(t.fromBufferAttribute(a,s[0]),o.fromBufferAttribute(a,s[1]),f.fromBufferAttribute(a,s[2]),Oa.getNormal(Da),l[0]=`${Math.round(t.x*n)},${Math.round(t.y*n)},${Math.round(t.z*n)}`,l[1]=`${Math.round(o.x*n)},${Math.round(o.y*n)},${Math.round(o.z*n)}`,l[2]=`${Math.round(f.x*n)},${Math.round(f.y*n)},${Math.round(f.z*n)}`,l[0]!==l[1]&&l[1]!==l[2]&&l[2]!==l[0])for(let e=0;e<3;e++){let t=(e+1)%3,n=l[e],i=l[t],a=Oa[c[e]],o=Oa[c[t]],f=`${n}_${i}`,p=`${i}_${n}`;p in u&&u[p]?(Da.dot(u[p].normal)<=r&&(d.push(a.x,a.y,a.z),d.push(o.x,o.y,o.z)),u[p]=null):f in u||(u[f]={index0:s[e],index1:s[t],normal:Da.clone()})}}for(let e in u)if(u[e]){let{index0:t,index1:n}=u[e];Ta.fromBufferAttribute(a,t),Ea.fromBufferAttribute(a,n),d.push(Ta.x,Ta.y,Ta.z),d.push(Ea.x,Ea.y,Ea.z)}this.setAttribute(`position`,new si(d,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Aa=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){H(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new G:new K);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new K,r=[],i=[],a=[],o=new K,s=new Un;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new K)}i[0]=new K,a[0]=new K;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(W(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(W(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ja=class extends Aa{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new G){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ma=class extends ja{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function Na(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Pa=new K,Fa=new K,Ia=new Na,La=new Na,Ra=new Na,za=class extends Aa{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new K){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Fa.subVectors(r[0],r[1]).add(r[0]),c=Fa);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Pa.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Pa),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Ia.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),La.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Ra.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Ia.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),La.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Ra.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Ia.calc(s),La.calc(s),Ra.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new K().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Ba(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function Va(e,t){let n=1-e;return n*n*t}function Ha(e,t){return 2*(1-e)*e*t}function Ua(e,t){return e*e*t}function Wa(e,t,n,r){return Va(e,t)+Ha(e,n)+Ua(e,r)}function Ga(e,t){let n=1-e;return n*n*n*t}function Ka(e,t){let n=1-e;return 3*n*n*e*t}function qa(e,t){return 3*(1-e)*e*e*t}function Ja(e,t){return e*e*e*t}function Ya(e,t,n,r,i){return Ga(e,t)+Ka(e,n)+qa(e,r)+Ja(e,i)}var Xa=class extends Aa{constructor(e=new G,t=new G,n=new G,r=new G){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new G){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Ya(e,r.x,i.x,a.x,o.x),Ya(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Za=class extends Aa{constructor(e=new K,t=new K,n=new K,r=new K){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new K){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Ya(e,r.x,i.x,a.x,o.x),Ya(e,r.y,i.y,a.y,o.y),Ya(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Qa=class extends Aa{constructor(e=new G,t=new G){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new G){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new G){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$a=class extends Aa{constructor(e=new K,t=new K){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new K){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new K){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},eo=class extends Aa{constructor(e=new G,t=new G,n=new G){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new G){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Wa(e,r.x,i.x,a.x),Wa(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},to=class extends Aa{constructor(e=new K,t=new K,n=new K){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new K){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Wa(e,r.x,i.x,a.x),Wa(e,r.y,i.y,a.y),Wa(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},no=class extends Aa{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new G){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Ba(o,s.x,c.x,l.x,u.x),Ba(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new G().fromArray(n))}return this}},ro=Object.freeze({__proto__:null,ArcCurve:Ma,CatmullRomCurve3:za,CubicBezierCurve:Xa,CubicBezierCurve3:Za,EllipseCurve:ja,LineCurve:Qa,LineCurve3:$a,QuadraticBezierCurve:eo,QuadraticBezierCurve3:to,SplineCurve:no}),io=class extends Aa{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new ro[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new ro[n.type]().fromJSON(n))}return this}},ao=class extends io{constructor(e){super(),this.type=`Path`,this.currentPoint=new G,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Qa(this.currentPoint.clone(),new G(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new eo(this.currentPoint.clone(),new G(e,t),new G(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new Xa(this.currentPoint.clone(),new G(e,t),new G(n,r),new G(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new no([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new ja(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},oo=class extends ao{constructor(e){super(e),this.uuid=Qt(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new ao().fromJSON(n))}return this}};function so(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=co(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=go(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return uo(a,o,n,s,c,l,0),o}function co(e,t,n,r,i){let a;if(i===Bo(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=Lo(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=Lo(i/r|0,e[i],e[i+1],a);return a&&ko(a,a.next)&&(Ro(a),a=a.next),a}function lo(e,t){if(!e)return e;t||(t=e);let n=e,r;do if(r=!1,!n.steiner&&(ko(n,n.next)||Oo(n.prev,n,n.next)===0)){if(Ro(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function uo(e,t,n,r,i,a,o){if(!e)return;!o&&a&&xo(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?po(e,r,i,a):fo(e))t.push(c.i,e.i,l.i),Ro(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=mo(lo(e),t),uo(e,t,n,r,i,a,2)):o===2&&ho(e,t,n,r,i,a):uo(lo(e),t,n,r,i,a,1);break}}}function fo(e){let t=e.prev,n=e,r=e.next;if(Oo(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Eo(i,s,a,c,o,l,m.x,m.y)&&Oo(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function po(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Oo(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=Co(p,m,t,n,r),v=Co(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Eo(s,u,c,d,l,f,y.x,y.y)&&Oo(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Eo(s,u,c,d,l,f,b.x,b.y)&&Oo(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Eo(s,u,c,d,l,f,y.x,y.y)&&Oo(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Eo(s,u,c,d,l,f,b.x,b.y)&&Oo(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function mo(e,t){let n=e;do{let r=n.prev,i=n.next.next;!ko(r,i)&&Ao(r,n,n.next,i)&&Po(r,i)&&Po(i,r)&&(t.push(r.i,n.i,i.i),Ro(n),Ro(n.next),n=e=i),n=n.next}while(n!==e);return lo(n)}function ho(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&Do(o,e)){let s=Io(o,e);o=lo(o,o.next),s=lo(s,s.next),uo(o,t,n,r,i,a,0),uo(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function go(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=co(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(wo(o))}i.sort(_o);for(let e=0;e<i.length;e++)n=vo(i[e],n);return n}function _o(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function vo(e,t){let n=yo(e,t);if(!n)return t;let r=Io(n,e);return lo(r,r.next),lo(n,n.next)}function yo(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(ko(e,n))return n;do{if(ko(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&To(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);Po(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&bo(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function bo(e,t){return Oo(e.prev,e,t.prev)<0&&Oo(t.next,e,e.next)<0}function xo(e,t,n,r){let i=e;do i.z===0&&(i.z=Co(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,So(i)}function So(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function Co(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function wo(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function To(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Eo(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&To(e,t,n,r,i,a,o,s)}function Do(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!No(e,t)&&(Po(e,t)&&Po(t,e)&&Fo(e,t)&&(Oo(e.prev,e,t.prev)||Oo(e,t.prev,t))||ko(e,t)&&Oo(e.prev,e,e.next)>0&&Oo(t.prev,t,t.next)>0)}function Oo(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function ko(e,t){return e.x===t.x&&e.y===t.y}function Ao(e,t,n,r){let i=Mo(Oo(e,t,n)),a=Mo(Oo(e,t,r)),o=Mo(Oo(n,r,e)),s=Mo(Oo(n,r,t));return!!(i!==a&&o!==s||i===0&&jo(e,n,t)||a===0&&jo(e,r,t)||o===0&&jo(n,e,r)||s===0&&jo(n,t,r))}function jo(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function Mo(e){return e>0?1:e<0?-1:0}function No(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&Ao(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function Po(e,t){return Oo(e.prev,e,e.next)<0?Oo(e,t,e.next)>=0&&Oo(e,e.prev,t)>=0:Oo(e,t,e.prev)<0||Oo(e,e.next,t)<0}function Fo(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Io(e,t){let n=zo(e.i,e.x,e.y),r=zo(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function Lo(e,t,n,r){let i=zo(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Ro(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function zo(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Bo(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Vo=class{static triangulate(e,t,n=2){return so(e,t,n)}},Ho=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];Uo(e),Wo(n,e);let a=e.length;t.forEach(Uo);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,Wo(n,t[e]);let o=Vo.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function Uo(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function Wo(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var Go=class e extends yi{constructor(e=new oo([new G(.5,.5),new G(-.5,.5),new G(-.5,-.5),new G(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new si(r,3)),this.setAttribute(`uv`,new si(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?Ko:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new K,b=new K,x=new K}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!Ho.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];Ho.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||U(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let k=C.length;function A(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new G(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new G(r/a,i/a)}let j=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),j[e]=A(D[e],D[n],D[r]);let M=[],N,P=j.concat();for(let e=0,t=E;e<t;e++){let t=w[e];N=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),N[e]=A(t[e],t[r],t[i]);M.push(N),P=P.concat(N)}let F;if(p===0)F=Ho.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],j[t],a);L(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];N=M[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],N[e],a);L(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}F=Ho.triangulateShape(e,t)}let I=F.length,ee=d+f;for(let e=0;e<k;e++){let t=l?O(C[e],P[e],ee):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),L(x.x,x.y,x.z)):L(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<k;t++){let n=l?O(C[t],P[t],ee):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),L(x.x,x.y,x.z)):L(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],j[e],r);L(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];N=M[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],N[e],r);_?L(i.x,i.y+g[s-1].y,g[s-1].x+n):L(i.x,i.y,c+n)}}}te(),ne();function te(){let e=r.length/3;if(l){let e=0,t=k*e;for(let e=0;e<I;e++){let n=F[e];ie(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=k*e;for(let e=0;e<I;e++){let n=F[e];ie(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<I;e++){let t=F[e];ie(t[2],t[1],t[0])}for(let e=0;e<I;e++){let t=F[e];ie(t[0]+k*s,t[1]+k*s,t[2]+k*s)}}n.addGroup(e,r.length/3-e,0)}function ne(){let e=r.length/3,t=0;re(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];re(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function re(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=k*e,a=k*(e+1);ae(t+r+n,t+i+n,t+i+a,t+r+a)}}}function L(e,t,n){a.push(e),a.push(t),a.push(n)}function ie(e,t,i){oe(e),oe(t),oe(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);se(o[0]),se(o[1]),se(o[2])}function ae(e,t,i,a){oe(e),oe(t),oe(a),oe(t),oe(i),oe(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);se(s[0]),se(s[1]),se(s[3]),se(s[1]),se(s[2]),se(s[3])}function oe(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function se(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return qo(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new ro[i.type]().fromJSON(i)),new e(r,t.options)}},Ko={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new G(a,o),new G(s,c),new G(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new G(o,1-c),new G(l,1-d),new G(f,1-m),new G(h,1-_)]:[new G(s,1-c),new G(u,1-d),new G(p,1-m),new G(g,1-_)]}};function qo(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var Jo=class e extends yi{constructor(e=[new G(0,-.5),new G(.5,0),new G(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=W(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new K,d=new G,f=new K,p=new K,m=new K,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new si(a,3)),this.setAttribute(`uv`,new si(o,2)),this.setAttribute(`normal`,new si(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},Yo=class e extends yi{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new si(p,3)),this.setAttribute(`normal`,new si(m,3)),this.setAttribute(`uv`,new si(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}};function Xo(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Qo(i))i.isRenderTargetTexture?(H(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Qo(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Zo(e){let t={};for(let n=0;n<e.length;n++){let r=Xo(e[n]);for(let e in r)t[e]=r[e]}return t}function Qo(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function $o(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function es(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:J.workingColorSpace}var ts={clone:Xo,merge:Zo},ns=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rs=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,is=class extends Ti{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ns,this.fragmentShader=rs,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Xo(e.uniforms),this.uniformsGroups=$o(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new Y().setHex(r.value);break;case`v2`:this.uniforms[n].value=new G().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new K().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Rn().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new q().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Un().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},as=class extends is{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},os=class extends Ti{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new Y(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Y(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new G(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ss=class extends Ti{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new Y(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Y(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new G(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},cs=class extends Ti{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=kt,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ls=class extends Ti{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},us=class extends oa{constructor(e){super(),this.isLineDashedMaterial=!0,this.type=`LineDashedMaterial`,this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function ds(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function fs(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var ps=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},ms=class extends ps{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Et,endingEnd:Et}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Dt:i=e,o=2*t-n;break;case Ot:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Dt:a=e,s=2*n-t;break;case Ot:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},hs=class extends ps{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},gs=class extends ps{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},_s=class extends ps{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=bs(n,t,g,y,r);i[p]=vs(x,o,_,b,m)}return i}};function vs(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function ys(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function bs(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=vs(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=ys(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var xs=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=ds(t,this.TimeBufferType),this.values=ds(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ds(e.times,Array),values:ds(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),fs(e.settings)&&(n.settings={inTangents:ds(e.settings.inTangents,Array),outTangents:ds(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new gs(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new hs(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ms(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new _s(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case St:t=this.InterpolantFactoryMethodDiscrete;break;case Ct:t=this.InterpolantFactoryMethodLinear;break;case wt:t=this.InterpolantFactoryMethodSmooth;break;case Tt:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return H(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return St;case this.InterpolantFactoryMethodLinear:return Ct;case this.InterpolantFactoryMethodSmooth:return wt;case this.InterpolantFactoryMethodBezier:return Tt}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;fs(this.settings)&&(Ss(this.settings.inTangents,e),Ss(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(U(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(U(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){U(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){U(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Rt(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){U(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===wt,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,fs(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Ss(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}xs.prototype.ValueTypeName=``,xs.prototype.TimeBufferType=Float32Array,xs.prototype.ValueBufferType=Float32Array,xs.prototype.DefaultInterpolation=Ct;var Cs=class extends xs{constructor(e,t,n){super(e,t,n)}};Cs.prototype.ValueTypeName=`bool`,Cs.prototype.ValueBufferType=Array,Cs.prototype.DefaultInterpolation=St,Cs.prototype.InterpolantFactoryMethodLinear=void 0,Cs.prototype.InterpolantFactoryMethodSmooth=void 0;var ws=class extends xs{constructor(e,t,n,r){super(e,t,n,r)}};ws.prototype.ValueTypeName=`color`;var Ts=class extends xs{constructor(e,t,n,r){super(e,t,n,r)}};Ts.prototype.ValueTypeName=`number`;var Es=class extends ps{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)xn.slerpFlat(i,0,a,c-o,a,c,s);return i}},Ds=class extends xs{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Es(this.times,this.values,this.getValueSize(),e)}};Ds.prototype.ValueTypeName=`quaternion`,Ds.prototype.InterpolantFactoryMethodSmooth=void 0;var Os=class extends xs{constructor(e,t,n){super(e,t,n)}};Os.prototype.ValueTypeName=`string`,Os.prototype.ValueBufferType=Array,Os.prototype.DefaultInterpolation=St,Os.prototype.InterpolantFactoryMethodLinear=void 0,Os.prototype.InterpolantFactoryMethodSmooth=void 0;var ks=class extends xs{constructor(e,t,n,r){super(e,t,n,r)}};ks.prototype.ValueTypeName=`vector`;var As=class extends gr{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new Y(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},js=class extends As{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(gr.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Y(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Ms=new Un,Ns=new K,Ps=new K,Fs=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new G(512,512),this.mapType=xe,this.map=null,this.mapPass=null,this.matrix=new Un,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new aa,this._frameExtents=new G(1,1),this._viewportCount=1,this._viewports=[new Rn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Ns.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ns),Ps.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ps),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Ms.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Ms,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Ms)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Is=new K,Ls=new xn,Rs=new K,zs=class extends gr{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Un,this.projectionMatrix=new Un,this.projectionMatrixInverse=new Un,this.coordinateSystem=It,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Is,Ls,Rs),Rs.x===1&&Rs.y===1&&Rs.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Is,Ls,Rs.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Is,Ls,Rs),Rs.x===1&&Rs.y===1&&Rs.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Is,Ls,Rs.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Bs=new K,Vs=new G,Hs=new G,Us=class extends zs{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Zt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Xt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Zt*2*Math.atan(Math.tan(Xt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Bs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bs.x,Bs.y).multiplyScalar(-e/Bs.z),Bs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bs.x,Bs.y).multiplyScalar(-e/Bs.z)}getViewSize(e,t){return this.getViewBounds(e,Vs,Hs),t.subVectors(Hs,Vs)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Xt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ws=class extends zs{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Gs=class extends Fs{constructor(){super(new Ws(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ks=class extends As{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(gr.DEFAULT_UP),this.updateMatrix(),this.target=new gr,this.shadow=new Gs}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},qs=-90,Js=1,Ys=class extends gr{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Us(qs,Js,e,t);r.layers=this.layers,this.add(r);let i=new Us(qs,Js,e,t);i.layers=this.layers,this.add(i);let a=new Us(qs,Js,e,t);a.layers=this.layers,this.add(a);let o=new Us(qs,Js,e,t);o.layers=this.layers,this.add(o);let s=new Us(qs,Js,e,t);s.layers=this.layers,this.add(s);let c=new Us(qs,Js,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Xs=class extends Us{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Zs=`\\[\\]\\.:\\/`,Qs=RegExp(`[\\[\\]\\.:\\/]`,`g`),$s=`[^\\[\\]\\.:\\/]`,ec=`[^`+Zs.replace(`\\.`,``)+`]`,tc=`((?:WC+[\\/:])*)`.replace(`WC`,$s),nc=`(WCOD+)?`.replace(`WCOD`,ec),rc=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,$s),ic=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,$s),ac=RegExp(`^`+tc+nc+rc+ic+`$`),oc=[`material`,`materials`,`bones`,`map`],sc=class{constructor(e,t,n){let r=n||cc.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},cc=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Qs,``)}static parseTrackName(e){let t=ac.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);oc.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){H(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){U(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){U(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){U(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){U(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){U(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;U(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};cc.Composite=sc,cc.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},cc.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},cc.prototype.GetterByBindingType=[cc.prototype._getValue_direct,cc.prototype._getValue_array,cc.prototype._getValue_arrayElement,cc.prototype._getValue_toArray],cc.prototype.SetterByBindingTypeAndVersioning=[[cc.prototype._setValue_direct,cc.prototype._setValue_direct_setNeedsUpdate,cc.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[cc.prototype._setValue_array,cc.prototype._setValue_array_setNeedsUpdate,cc.prototype._setValue_array_setMatrixWorldNeedsUpdate],[cc.prototype._setValue_arrayElement,cc.prototype._setValue_arrayElement_setNeedsUpdate,cc.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[cc.prototype._setValue_fromArray,cc.prototype._setValue_fromArray_setNeedsUpdate,cc.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var lc=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){let e=1e-6;return this.phi=W(this.phi,e,Math.PI-e),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(W(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};oe=class{constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}},oe.prototype.isMatrix2=!0;var uc=class extends qt{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function dc(e,t,n,r){let i=fc(r);switch(n){case B:return e*t;case Fe:return e*t/i.components*i.byteLength;case Ie:return e*t/i.components*i.byteLength;case Le:return e*t*2/i.components*i.byteLength;case Re:return e*t*2/i.components*i.byteLength;case V:return e*t*3/i.components*i.byteLength;case Me:return e*t*4/i.components*i.byteLength;case ze:return e*t*4/i.components*i.byteLength;case Be:case Ve:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case He:case Ue:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ge:case qe:return Math.max(e,16)*Math.max(t,8)/4;case We:case Ke:return Math.max(e,8)*Math.max(t,8)/2;case Je:case Ye:case Ze:case Qe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Xe:case $e:case et:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case tt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case nt:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case rt:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case it:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case at:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ot:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case st:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case ct:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case lt:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case ut:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case dt:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case ft:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case pt:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case mt:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case ht:case gt:case _t:return Math.ceil(e/4)*Math.ceil(t/4)*16;case vt:case yt:return Math.ceil(e/4)*Math.ceil(t/4)*8;case bt:case xt:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function fc(e){switch(e){case xe:case R:return{byteLength:1,components:1};case Ce:case Se:case De:return{byteLength:2,components:1};case Oe:case ke:return{byteLength:2,components:4};case Te:case we:case Ee:return{byteLength:4,components:1};case z:case je:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?H(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function pc(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function mc(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var X={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Z={common:{diffuse:{value:new Y(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new q},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new q}},envmap:{envMap:{value:null},envMapRotation:{value:new q},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new q}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new q}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new q},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new q},normalScale:{value:new G(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new q},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new q}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new q}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new q}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Y(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new K},probesMax:{value:new K},probesResolution:{value:new K}},points:{diffuse:{value:new Y(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0},uvTransform:{value:new q}},sprite:{diffuse:{value:new Y(16777215)},opacity:{value:1},center:{value:new G(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new q},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0}}},hc={basic:{uniforms:Zo([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.fog]),vertexShader:X.meshbasic_vert,fragmentShader:X.meshbasic_frag},lambert:{uniforms:Zo([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new Y(0)},envMapIntensity:{value:1}}]),vertexShader:X.meshlambert_vert,fragmentShader:X.meshlambert_frag},phong:{uniforms:Zo([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new Y(0)},specular:{value:new Y(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:X.meshphong_vert,fragmentShader:X.meshphong_frag},standard:{uniforms:Zo([Z.common,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.roughnessmap,Z.metalnessmap,Z.fog,Z.lights,{emissive:{value:new Y(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag},toon:{uniforms:Zo([Z.common,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.gradientmap,Z.fog,Z.lights,{emissive:{value:new Y(0)}}]),vertexShader:X.meshtoon_vert,fragmentShader:X.meshtoon_frag},matcap:{uniforms:Zo([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,{matcap:{value:null}}]),vertexShader:X.meshmatcap_vert,fragmentShader:X.meshmatcap_frag},points:{uniforms:Zo([Z.points,Z.fog]),vertexShader:X.points_vert,fragmentShader:X.points_frag},dashed:{uniforms:Zo([Z.common,Z.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:X.linedashed_vert,fragmentShader:X.linedashed_frag},depth:{uniforms:Zo([Z.common,Z.displacementmap]),vertexShader:X.depth_vert,fragmentShader:X.depth_frag},normal:{uniforms:Zo([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,{opacity:{value:1}}]),vertexShader:X.meshnormal_vert,fragmentShader:X.meshnormal_frag},sprite:{uniforms:Zo([Z.sprite,Z.fog]),vertexShader:X.sprite_vert,fragmentShader:X.sprite_frag},background:{uniforms:{uvTransform:{value:new q},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:X.background_vert,fragmentShader:X.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new q}},vertexShader:X.backgroundCube_vert,fragmentShader:X.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:X.cube_vert,fragmentShader:X.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:X.equirect_vert,fragmentShader:X.equirect_frag},distance:{uniforms:Zo([Z.common,Z.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:X.distance_vert,fragmentShader:X.distance_frag},shadow:{uniforms:Zo([Z.lights,Z.fog,{color:{value:new Y(0)},opacity:{value:1}}]),vertexShader:X.shadow_vert,fragmentShader:X.shadow_frag}};hc.physical={uniforms:Zo([hc.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new q},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new q},clearcoatNormalScale:{value:new G(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new q},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new q},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new q},sheen:{value:0},sheenColor:{value:new Y(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new q},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new q},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new q},transmissionSamplerSize:{value:new G},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new q},attenuationDistance:{value:0},attenuationColor:{value:new Y(0)},specularColor:{value:new Y(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new q},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new q},anisotropyVector:{value:new G},anisotropyMap:{value:null},anisotropyMapTransform:{value:new q}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag};var gc={r:0,b:0,g:0},_c=new Un,vc=new q;vc.set(-1,0,0,0,1,0,0,0,1);function yc(e,t,n,r,i,a){let o=new Y(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new Ui(new Ca(1,1,1),new is({name:`BackgroundCubeMaterial`,uniforms:Xo(hc.backgroundCube.uniforms),vertexShader:hc.backgroundCube.vertexShader,fragmentShader:hc.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(_c.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(vc),l.material.toneMapped=J.getTransfer(i.colorSpace)!==Nt,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Ui(new Yo(2,2),new is({name:`BackgroundMaterial`,uniforms:Xo(hc.background.uniforms),vertexShader:hc.background.vertexShader,fragmentShader:hc.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=J.getTransfer(i.colorSpace)!==Nt,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(gc,es(e)),n.buffers.color.setClear(gc.r,gc.g,gc.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function bc(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function xc(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Sc(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(H(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&H(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Cc(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Ci,s=new q,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var wc=4,Tc=6,Ec=20,Dc=256,Oc=new Ws,kc=new Y,Ac=null,jc=0,Mc=0,Nc=!1,Pc=new K,Fc=new K,Ic=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Pc}=i;Ac=this._renderer.getRenderTarget(),jc=this._renderer.getActiveCubeFace(),Mc=this._renderer.getActiveMipmapLevel(),Nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Uc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ac,jc,Mc),this._renderer.xr.enabled=Nc,e.scissorTest=!1,zc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ac=this._renderer.getRenderTarget(),jc=this._renderer.getActiveCubeFace(),Mc=this._renderer.getActiveMipmapLevel(),Nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ve,minFilter:ve,generateMipmaps:!1,type:De,format:Me,colorSpace:jt,depthBuffer:!1},r=Rc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rc(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Lc(r)),this._blurMaterial=Vc(r,e,t),this._ggxMaterial=Bc(r,e,t)}return r}_compileMaterial(e){let t=new Ui(new yi,e);this._renderer.compile(t,Oc)}_sceneToCubeUV(e,t,n,r,i){let a=new Us(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(kc),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ui(new Ca,new ji({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(kc),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;zc(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Uc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hc());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;zc(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Oc)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-wc?n-d+wc:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,zc(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Oc),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,zc(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Oc)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];zc(t,3*l*(r>this._lodMax-wc?r-this._lodMax+wc:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Oc)}};function Lc(e){let t=[],n=[],r=e,i=e-wc+1+Tc;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?Fc.set(1,r,n):e===1?Fc.set(-n,1,-r):e===2?Fc.set(-n,r,1):e===3?Fc.set(-1,r,-n):e===4?Fc.set(-n,-1,r):Fc.set(n,r,-1),Fc.toArray(l,(e*6+t)*3)}}let u=new yi;u.setAttribute(`position`,new ii(c,3)),u.setAttribute(`outputDirection`,new ii(l,3)),n.push(new Ui(u,null)),r>wc&&r--}return{lodMeshes:n,sizeLods:t}}function Rc(e,t,n){let r=new Bn(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function zc(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Bc(e,t,n){return new is({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Dc,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Wc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Vc(e,t,n){return new is({name:`SphericalGaussianBlur`,defines:{SAMPLES:Ec,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Wc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Hc(){return new is({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Wc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Uc(){return new is({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Wc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Gc=class extends Bn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new ya(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ca(5,5,5),i=new is({name:`CubemapFromEquirect`,uniforms:Xo(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Ui(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=ve),new Ys(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Kc(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Gc(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Ic(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Ic(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function qc(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Wt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Jc(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?oi:ai)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Yc(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Xc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:U(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Zc(e,t,n){let r=new WeakMap,i=new Rn;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Vn(h,p,m,u);g.type=Ee,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new G(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Qc(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var $c={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function el(e,t,n,r,i,a){let o=new Bn(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new yi;l.setAttribute(`position`,new si([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new si([0,2,0,0,2,0],2));let u=new as({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Ui(l,u),f=new Ws(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new Bn(t,n,{type:De,depthBuffer:!1,stencilBuffer:!1}),c=new Bn(t,n,{type:De,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},J.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=$c[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var tl=new Ln,nl=new ba(1,1),rl=new Vn,il=new Hn,al=new ya,ol=[],sl=[],cl=new Float32Array(16),ll=new Float32Array(9),ul=new Float32Array(4);function dl(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=ol[i];if(a===void 0&&(a=new Float32Array(i),ol[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function fl(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function pl(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function ml(e,t){let n=sl[t];n===void 0&&(n=new Int32Array(t),sl[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function hl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function gl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(fl(n,t))return;e.uniform2fv(this.addr,t),pl(n,t)}}function _l(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(fl(n,t))return;e.uniform3fv(this.addr,t),pl(n,t)}}function vl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(fl(n,t))return;e.uniform4fv(this.addr,t),pl(n,t)}}function yl(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(fl(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),pl(n,t)}else{if(fl(n,r))return;ul.set(r),e.uniformMatrix2fv(this.addr,!1,ul),pl(n,r)}}function bl(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(fl(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),pl(n,t)}else{if(fl(n,r))return;ll.set(r),e.uniformMatrix3fv(this.addr,!1,ll),pl(n,r)}}function xl(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(fl(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),pl(n,t)}else{if(fl(n,r))return;cl.set(r),e.uniformMatrix4fv(this.addr,!1,cl),pl(n,r)}}function Sl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Cl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(fl(n,t))return;e.uniform2iv(this.addr,t),pl(n,t)}}function wl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(fl(n,t))return;e.uniform3iv(this.addr,t),pl(n,t)}}function Tl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(fl(n,t))return;e.uniform4iv(this.addr,t),pl(n,t)}}function El(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Dl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(fl(n,t))return;e.uniform2uiv(this.addr,t),pl(n,t)}}function Ol(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(fl(n,t))return;e.uniform3uiv(this.addr,t),pl(n,t)}}function kl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(fl(n,t))return;e.uniform4uiv(this.addr,t),pl(n,t)}}function Al(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(nl.compareFunction=n.isReversedDepthBuffer()?518:515,a=nl):a=tl,n.setTexture2D(t||a,i)}function jl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||il,i)}function Ml(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||al,i)}function Nl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||rl,i)}function Pl(e){switch(e){case 5126:return hl;case 35664:return gl;case 35665:return _l;case 35666:return vl;case 35674:return yl;case 35675:return bl;case 35676:return xl;case 5124:case 35670:return Sl;case 35667:case 35671:return Cl;case 35668:case 35672:return wl;case 35669:case 35673:return Tl;case 5125:return El;case 36294:return Dl;case 36295:return Ol;case 36296:return kl;case 35678:case 36198:case 36298:case 36306:case 35682:return Al;case 35679:case 36299:case 36307:return jl;case 35680:case 36300:case 36308:case 36293:return Ml;case 36289:case 36303:case 36311:case 36292:return Nl}}function Fl(e,t){e.uniform1fv(this.addr,t)}function Il(e,t){let n=dl(t,this.size,2);e.uniform2fv(this.addr,n)}function Ll(e,t){let n=dl(t,this.size,3);e.uniform3fv(this.addr,n)}function Rl(e,t){let n=dl(t,this.size,4);e.uniform4fv(this.addr,n)}function zl(e,t){let n=dl(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Bl(e,t){let n=dl(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Vl(e,t){let n=dl(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Hl(e,t){e.uniform1iv(this.addr,t)}function Ul(e,t){e.uniform2iv(this.addr,t)}function Wl(e,t){e.uniform3iv(this.addr,t)}function Gl(e,t){e.uniform4iv(this.addr,t)}function Kl(e,t){e.uniform1uiv(this.addr,t)}function ql(e,t){e.uniform2uiv(this.addr,t)}function Jl(e,t){e.uniform3uiv(this.addr,t)}function Yl(e,t){e.uniform4uiv(this.addr,t)}function Xl(e,t,n){let r=this.cache,i=t.length,a=ml(n,i);fl(r,a)||(e.uniform1iv(this.addr,a),pl(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?nl:tl;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Zl(e,t,n){let r=this.cache,i=t.length,a=ml(n,i);fl(r,a)||(e.uniform1iv(this.addr,a),pl(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||il,a[e])}function Ql(e,t,n){let r=this.cache,i=t.length,a=ml(n,i);fl(r,a)||(e.uniform1iv(this.addr,a),pl(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||al,a[e])}function $l(e,t,n){let r=this.cache,i=t.length,a=ml(n,i);fl(r,a)||(e.uniform1iv(this.addr,a),pl(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||rl,a[e])}function eu(e){switch(e){case 5126:return Fl;case 35664:return Il;case 35665:return Ll;case 35666:return Rl;case 35674:return zl;case 35675:return Bl;case 35676:return Vl;case 5124:case 35670:return Hl;case 35667:case 35671:return Ul;case 35668:case 35672:return Wl;case 35669:case 35673:return Gl;case 5125:return Kl;case 36294:return ql;case 36295:return Jl;case 36296:return Yl;case 35678:case 36198:case 36298:case 36306:case 35682:return Xl;case 35679:case 36299:case 36307:return Zl;case 35680:case 36300:case 36308:case 36293:return Ql;case 36289:case 36303:case 36311:case 36292:return $l}}var tu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Pl(t.type)}},nu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=eu(t.type)}},ru=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},iu=/(\w+)(\])?(\[|\.)?/g;function au(e,t){e.seq.push(t),e.map[t.id]=t}function ou(e,t,n){let r=e.name,i=r.length;for(iu.lastIndex=0;;){let a=iu.exec(r),o=iu.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){au(n,l===void 0?new tu(s,e,t):new nu(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new ru(s),au(n,e)),n=e}}}var su=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);ou(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function cu(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var lu=37297,uu=0;function du(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var fu=new q;function pu(e){J._getMatrix(fu,J.workingColorSpace,e);let t=`mat3( ${fu.elements.map(e=>e.toFixed(4))} )`;switch(J.getTransfer(e)){case Mt:return[t,`LinearTransferOETF`];case Nt:return[t,`sRGBTransferOETF`];default:return H(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function mu(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+du(e.getShaderSource(t),r)}return i}function hu(e,t){let n=pu(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var gu={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function _u(e,t){let n=gu[t];return n===void 0?(H(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var vu=new K;function yu(){return J.getLuminanceCoefficients(vu),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${vu.x.toFixed(4)}, ${vu.y.toFixed(4)}, ${vu.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function bu(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Cu).join(`
`)}function xu(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Su(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Cu(e){return e!==``}function wu(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Tu(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Eu=/^[ \t]*#include +<([\w\d./]+)>/gm;function Du(e){return e.replace(Eu,ku)}var Ou=new Map;function ku(e,t){let n=X[t];if(n===void 0){let e=Ou.get(t);if(e!==void 0)n=X[e],H(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Du(n)}var Au=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ju(e){return e.replace(Au,Mu)}function Mu(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Nu(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Pu={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Fu(e){return Pu[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Iu={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Lu(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Iu[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Ru={302:`ENVMAP_MODE_REFRACTION`};function zu(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Ru[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Bu={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Vu(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Bu[e.combine]||`ENVMAP_BLENDING_NONE`}function Hu(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Uu(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Fu(n),l=Lu(n),u=zu(n),d=Vu(n),f=Hu(n),p=bu(n),m=xu(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Cu).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Cu).join(`
`),_.length>0&&(_+=`
`)):(g=[Nu(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Cu).join(`
`),_=[Nu(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:X.tonemapping_pars_fragment,n.toneMapping===0?``:_u(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,X.colorspace_pars_fragment,hu(`linearToOutputTexel`,n.outputColorSpace),yu(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Cu).join(`
`)),o=Du(o),o=wu(o,n),o=Tu(o,n),s=Du(s),s=wu(s,n),s=Tu(s,n),o=ju(o),s=ju(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=cu(i,i.VERTEX_SHADER,y),S=cu(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=mu(i,x,`vertex`),n=mu(i,S,`fragment`);U(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):H(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new su(i,h),T=Su(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,lu)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=uu++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Wu=0,Gu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ku(e),t.set(e,n)),n}},Ku=class{constructor(e){this.id=Wu++,this.code=e,this.usedTimes=0}};function qu(e){return e===1030||e===37490||e===36285}function Ju(e,t,n,r,i,a){let o=new er,s=new Gu,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&H(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=hc[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),M=e.state.buffers.depth.getReversed(),N=h.isInstancedMesh===!0,P=h.isBatchedMesh===!0,F=!!i.map,I=!!i.matcap,ee=!!x,te=!!i.aoMap,ne=!!i.lightMap,re=!!i.bumpMap&&i.wireframe===!1,L=!!i.normalMap,ie=!!i.displacementMap,ae=!!i.emissiveMap,oe=!!i.metalnessMap,se=!!i.roughnessMap,ce=i.anisotropy>0,le=i.clearcoat>0,ue=i.dispersion>0,de=i.retroreflectivity>0,fe=i.iridescence>0,pe=i.sheen>0,me=i.transmission>0,he=ce&&!!i.anisotropyMap,ge=le&&!!i.clearcoatMap,_e=le&&!!i.clearcoatNormalMap,ve=le&&!!i.clearcoatRoughnessMap,ye=fe&&!!i.iridescenceMap,be=fe&&!!i.iridescenceThicknessMap,xe=pe&&!!i.sheenColorMap,R=pe&&!!i.sheenRoughnessMap,Se=!!i.specularMap,Ce=!!i.specularColorMap,we=!!i.specularIntensityMap,Te=me&&!!i.transmissionMap,Ee=me&&!!i.thicknessMap,De=!!i.gradientMap,Oe=!!i.alphaMap,ke=i.alphaTest>0,Ae=!!i.alphaHash,z=!!i.extensions,je=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(je=e.toneMapping);let B={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:P,batchingColor:P&&h._colorsTexture!==null,instancing:N,instancingColor:N&&h.instanceColor!==null,instancingMorph:N&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:J.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:F,matcap:I,envMap:ee,envMapMode:ee&&x.mapping,envMapCubeUVHeight:S,aoMap:te,lightMap:ne,bumpMap:re,normalMap:L,displacementMap:ie,emissiveMap:ae,normalMapObjectSpace:L&&i.normalMapType===1,normalMapTangentSpace:L&&i.normalMapType===0,packedNormalMap:L&&i.normalMapType===0&&qu(i.normalMap.format),metalnessMap:oe,roughnessMap:se,anisotropy:ce,anisotropyMap:he,clearcoat:le,clearcoatMap:ge,clearcoatNormalMap:_e,clearcoatRoughnessMap:ve,dispersion:ue,retroreflection:de,iridescence:fe,iridescenceMap:ye,iridescenceThicknessMap:be,sheen:pe,sheenColorMap:xe,sheenRoughnessMap:R,specularMap:Se,specularColorMap:Ce,specularIntensityMap:we,transmission:me,transmissionMap:Te,thicknessMap:Ee,gradientMap:De,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Oe,alphaTest:ke,alphaHash:Ae,combine:i.combine,mapUv:F&&m(i.map.channel),aoMapUv:te&&m(i.aoMap.channel),lightMapUv:ne&&m(i.lightMap.channel),bumpMapUv:re&&m(i.bumpMap.channel),normalMapUv:L&&m(i.normalMap.channel),displacementMapUv:ie&&m(i.displacementMap.channel),emissiveMapUv:ae&&m(i.emissiveMap.channel),metalnessMapUv:oe&&m(i.metalnessMap.channel),roughnessMapUv:se&&m(i.roughnessMap.channel),anisotropyMapUv:he&&m(i.anisotropyMap.channel),clearcoatMapUv:ge&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:_e&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ve&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:be&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:R&&m(i.sheenRoughnessMap.channel),specularMapUv:Se&&m(i.specularMap.channel),specularColorMapUv:Ce&&m(i.specularColorMap.channel),specularIntensityMapUv:we&&m(i.specularIntensityMap.channel),transmissionMapUv:Te&&m(i.transmissionMap.channel),thicknessMapUv:Ee&&m(i.thicknessMap.channel),alphaMapUv:Oe&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(L||ce),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(F||Oe),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&L===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:M,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:je,decodeVideoTexture:F&&i.map.isVideoTexture===!0&&J.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ae&&i.emissiveMap.isVideoTexture===!0&&J.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:z&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(z&&i.extensions.multiDraw===!0||P)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return B.vertexUv1s=c.has(1),B.vertexUv2s=c.has(2),B.vertexUv3s=c.has(3),c.clear(),B}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=hc[t];n=ts.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Uu(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Yu(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Xu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Zu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Qu(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Xu),r.length>1&&r.sort(t||Zu),i.length>1&&i.sort(t||Zu)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function $u(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Qu,e.set(t,[i])):n>=r.length?(i=new Qu,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function ed(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new K,color:new Y};break;case`SpotLight`:n={position:new K,direction:new K,color:new Y,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new K,color:new Y,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new K,skyColor:new Y,groundColor:new Y};break;case`RectAreaLight`:n={color:new Y,position:new K,halfWidth:new K,halfHeight:new K}}return e[t.id]=n,n}}}function td(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new G};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new G};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new G,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var nd=0;function rd(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function id(e){let t=new ed,n=td(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new K);let i=new K,a=new Un,o=new Un;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(rd);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Z.LTC_FLOAT_1,r.rectAreaLTC2=Z.LTC_FLOAT_2):(r.rectAreaLTC1=Z.LTC_HALF_1,r.rectAreaLTC2=Z.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=nd++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function ad(e){let t=new id(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function od(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new ad(e),t.set(n,[a])):r>=i.length?(a=new ad(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var sd=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cd=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ld=[new K(1,0,0),new K(-1,0,0),new K(0,1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1)],ud=[new K(0,-1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1),new K(0,-1,0),new K(0,-1,0)],dd=new Un,fd=new K,pd=new K;function md(e,t,n){let r=new aa,i=new G,a=new G,o=new Rn,s=new cs,c=new ls,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new is({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new G},radius:{value:4}},vertexShader:sd,fragmentShader:cd}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new yi;m.setAttribute(`position`,new ii(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new Ui(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(H(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){H(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){H(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Bn(i.x,i.y,{format:Le,type:De,minFilter:ve,magFilter:ve,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new ba(i.x,i.y,Ee),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Ne,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=he,d.map.depthTexture.magFilter=he}else l.isPointLight?(d.map=new Gc(i.x),d.map.depthTexture=new xa(i.x,Te)):(d.map=new Bn(i.x,i.y),d.map.depthTexture=new ba(i.x,i.y,Te)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Ne,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=ve,d.map.depthTexture.magFilter=ve):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=he,d.map.depthTexture.magFilter=he);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),fd.setFromMatrixPosition(l.matrixWorld),e.position.copy(fd),pd.copy(e.position),pd.add(ld[t]),e.up.copy(ud[t]),e.lookAt(pd),e.updateMatrixWorld(),n.makeTranslation(-fd.x,-fd.y,-fd.z),dd.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(dd,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new Bn(i.x,i.y,{format:Le,type:De}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function hd(e,t){function n(){let t=!1,n=new Rn,r=null,i=new Rn(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?oe(e.DEPTH_TEST):se(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Kt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?oe(e.STENCIL_TEST):se(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Y(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,F=e.getParameter(e.VERSION);F.indexOf(`WebGL`)===-1?F.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(F)[1]),N=P>=1);let I=null,ee={},te=e.getParameter(e.SCISSOR_BOX),ne=e.getParameter(e.VIEWPORT),re=new Rn().fromArray(te),L=new Rn().fromArray(ne);function ie(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ae={};ae[e.TEXTURE_2D]=ie(e.TEXTURE_2D,e.TEXTURE_2D,1),ae[e.TEXTURE_CUBE_MAP]=ie(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ae[e.TEXTURE_2D_ARRAY]=ie(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ae[e.TEXTURE_3D]=ie(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),oe(e.DEPTH_TEST),o.setFunc(3),he(!1),ge(1),oe(e.CULL_FACE),pe(0);function oe(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function se(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ce(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function le(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function ue(t){return h!==t&&(e.useProgram(t),h=t,!0)}let de={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};de[103]=e.MIN,de[104]=e.MAX;let fe={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function pe(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(se(e.BLEND),g=!1);else if(g===!1&&(oe(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:U(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:U(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:U(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:U(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a=a||n,o=o||r,s=s||i,(n!==v||a!==x)&&(e.blendEquationSeparate(de[n],de[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(fe[r],fe[i],fe[o],fe[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function me(t,n){t.side===2?se(e.CULL_FACE):oe(e.CULL_FACE);let r=t.side===1;n&&(r=!r),he(r),t.blending===1&&t.transparent===!1?pe(0):pe(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ve(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?oe(e.SAMPLE_ALPHA_TO_COVERAGE):se(e.SAMPLE_ALPHA_TO_COVERAGE)}function he(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ge(t){t===0?se(e.CULL_FACE):(oe(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function _e(t){t!==k&&(N&&e.lineWidth(t),k=t)}function ve(t,n,r){t?(oe(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):se(e.POLYGON_OFFSET_FILL)}function ye(t){t?oe(e.SCISSOR_TEST):se(e.SCISSOR_TEST)}function be(t){t===void 0&&(t=e.TEXTURE0+M-1),I!==t&&(e.activeTexture(t),I=t)}function xe(t,n,r){r===void 0&&(r=I===null?e.TEXTURE0+M-1:I);let i=ee[r];i===void 0&&(i={type:void 0,texture:void 0},ee[r]=i),(i.type!==t||i.texture!==n)&&(I!==r&&(e.activeTexture(r),I=r),e.bindTexture(t,n||ae[t]),i.type=t,i.texture=n)}function R(){let t=ee[I];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Se(){try{e.compressedTexImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ce(){try{e.compressedTexImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function we(){try{e.texSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Te(){try{e.texSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ee(){try{e.compressedTexSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function De(){try{e.compressedTexSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Oe(){try{e.texStorage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function ke(){try{e.texStorage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ae(){try{e.texImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function z(){try{e.texImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function je(t){return d[t]===void 0?e.getParameter(t):d[t]}function B(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function V(t){re.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),re.copy(t))}function Me(t){L.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),L.copy(t))}function Ne(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Pe(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Fe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},I=null,ee={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Y(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,re.set(0,0,e.canvas.width,e.canvas.height),L.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:oe,disable:se,bindFramebuffer:ce,drawBuffers:le,useProgram:ue,setBlending:pe,setMaterial:me,setFlipSided:he,setCullFace:ge,setLineWidth:_e,setPolygonOffset:ve,setScissorTest:ye,activeTexture:be,bindTexture:xe,unbindTexture:R,compressedTexImage2D:Se,compressedTexImage3D:Ce,texImage2D:Ae,texImage3D:z,pixelStorei:B,getParameter:je,updateUBOMapping:Ne,uniformBlockBinding:Pe,texStorage2D:Oe,texStorage3D:ke,texSubImage2D:we,texSubImage3D:Te,compressedTexSubImage2D:Ee,compressedTexSubImage3D:De,scissor:V,viewport:Me,reset:Fe}}function gd(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new G,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):zt(`canvas`)}function g(e,t,n){let r=1,i=z(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),H(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&H(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];H(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||H(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Mt:J.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,H(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function k(){O=0}function A(){return O}function j(e){O=e}function M(){let e=O;return e>=i.maxTextures&&H(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function N(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function P(t,i){let a=r.get(t);if(t.isVideoTexture&&ke(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)H(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)H(`WebGLRenderer: Texture marked for update but image is incomplete`);else{se(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function F(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?se(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function I(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?se(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ee(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?ce(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let te={[fe]:e.REPEAT,[pe]:e.CLAMP_TO_EDGE,[me]:e.MIRRORED_REPEAT},ne={[he]:e.NEAREST,[ge]:e.NEAREST_MIPMAP_NEAREST,[_e]:e.NEAREST_MIPMAP_LINEAR,[ve]:e.LINEAR,[ye]:e.LINEAR_MIPMAP_NEAREST,[be]:e.LINEAR_MIPMAP_LINEAR},re={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function L(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&H(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,te[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,te[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,te[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ne[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ne[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,re[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ie(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=N(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function ae(e,t,n){return Math.floor(Math.floor(e/n)/t)}function oe(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ae(n.start,r.width,4),c=ae(t.start,r.width,4);n.start<=i+1&&a===c&&ae(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function se(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ie(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=J.getPrimaries(J.workingColorSpace),r=o.colorSpace===``?null:J.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Ae(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);L(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===Pe,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&oe(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=dc(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=dc(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=z(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=z(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ce(t,o,s){if(o.image.length!==6)return;let c=ie(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=J.getPrimaries(J.workingColorSpace),r=o.colorSpace===``?null:J.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Ae(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);L(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=z(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function le(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Oe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,De(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ue(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Oe(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,De(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,De(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);Oe(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,De(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,De(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function de(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),L(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else P(i.depthTexture,0);let u=l.__webglTexture,d=De(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Oe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Oe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function xe(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)de(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?de(i.__webglFramebuffer[0],t,0):de(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),ue(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),ue(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function R(t,n,i){let a=r.get(t);n!==void 0&&le(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&xe(t)}function Se(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Oe(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=De(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),ue(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),L(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)le(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else le(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),L(c,a),le(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),L(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)le(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else le(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&xe(t)}function Ce(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let we=[],Te=[];function Ee(t){if(t.samples>0){if(Oe(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(we.length=0,Te.length=0,we.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(we.push(l),Te.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Te)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,we))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function De(e){return Math.min(i.maxSamples,e.samples)}function Oe(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function ke(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Ae(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(J.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&H(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):U(`WebGLTextures: Unsupported texture color space:`,n)),t}function z(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=M,this.resetTextureUnits=k,this.getTextureUnits=A,this.setTextureUnits=j,this.setTexture2D=P,this.setTexture2DArray=F,this.setTexture3D=I,this.setTextureCube=ee,this.rebindTextures=R,this.setupRenderTarget=Se,this.updateRenderTargetMipmap=Ce,this.updateMultisampleRenderTarget=Ee,this.setupDepthRenderbuffer=xe,this.setupFrameBufferTexture=le,this.useMultisampledRTT=Oe,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function _d(e,t){function n(n,r=``){let i,a=J.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var vd=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,yd=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,bd=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Sa(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new is({vertexShader:vd,fragmentShader:yd,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ui(new Yo(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},xd=class extends qt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new bd,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new G,C=null,w=null,T=new Us;T.viewport=new Rn;let E=new Us;E.viewport=new Rn;let D=[T,E],O=new Xs,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new yr,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new yr,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new yr,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function M(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,M),r.removeEventListener(`inputsourceschange`,N);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,L.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,M),r.addEventListener(`inputsourceschange`,N),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?Pe:Ne,a=_.stencil?Ae:Te);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Bn(d.textureWidth,d.textureHeight,{format:Me,type:xe,depthTexture:new ba(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Bn(f.framebufferWidth,f.framebufferHeight,{format:Me,type:xe,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),L.setContext(r),L.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function N(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let P=new K,F=new K;function I(e,t,n){P.setFromMatrixPosition(t.matrixWorld),F.setFromMatrixPosition(n.matrixWorld);let r=P.distanceTo(F),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ee(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;ee(O,i);for(let e=0;e<a.length;e++)ee(a[e],i);a.length===2?I(O,T,E):O.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),te(e,O,i)};function te(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Zt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let ne=null;function re(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new Us,o.layers.enable(n),o.viewport=new Rn,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Sa,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ne&&ne(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let L=new pc;L.setAnimationLoop(re),this.setAnimationLoop=function(e){ne=e},this.dispose=function(){}}},Sd=new Un,Cd=new q;Cd.set(-1,0,0,0,1,0,0,0,1);function wd(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,es(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Sd.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Cd),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Td(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return U(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?H(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):H(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Ed=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Dd=null;function Od(){return Dd===null&&(Dd=new Ki(Ed,16,16,Le,De),Dd.name=`DFG_LUT`,Dd.minFilter=ve,Dd.magFilter=ve,Dd.wrapS=pe,Dd.wrapT=pe,Dd.generateMipmaps=!1,Dd.needsUpdate=!0),Dd}var kd=class{constructor(e={}){let{canvas:t=Bt(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=xe}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([ze,Re,Ie]),g=new Set([xe,Te,Ce,Ae,Oe,ke]),_=new Uint32Array(4),v=new Int32Array(4),y=new K,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=At;let j=0,M=0,N=null,P=-1,F=null,I=new Rn,ee=new Rn,te=null,ne=new Y(0),re=0,L=t.width,ie=t.height,ae=1,oe=null,se=null,ce=new Rn(0,0,L,ie),le=new Rn(0,0,L,ie),ue=!1,de=new aa,fe=!1,pe=!1,me=new Un,he=new K,ge=new Rn,_e={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ve=!1;function ye(){return N===null?ae:1}let R=n;function Se(e,n){return t.getContext(e,n)}let we,Ee,z,je,B,V,Me,Ne,Pe,Fe,Le,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,et,!1),t.addEventListener(`webglcontextrestored`,tt,!1),t.addEventListener(`webglcontextcreationerror`,nt,!1),R===null){let t=`webgl2`;if(R=Se(t,e),R===null)throw Se(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Qe()}catch(e){throw t.removeEventListener(`webglcontextlost`,et,!1),t.removeEventListener(`webglcontextrestored`,tt,!1),t.removeEventListener(`webglcontextcreationerror`,nt,!1),U(`WebGLRenderer: `+e.message),e}function Qe(){we=new qc(R),we.init(),Ye=new _d(R,we),Ee=new Sc(R,we,e,Ye),z=new hd(R,we),Ee.reversedDepthBuffer&&d&&z.buffers.depth.setReversed(!0),O=R.createFramebuffer(),k=R.createFramebuffer(),A=R.createFramebuffer(),je=new Xc(R),B=new Yu,V=new gd(R,we,z,B,Ee,Ye,je),Me=new Kc(T),Ne=new mc(R),Xe=new bc(R,Ne),Pe=new Jc(R,Ne,je,Xe),Fe=new Qc(R,Pe,Ne,Xe,je),Ke=new Zc(R,Ee,V),Ue=new Cc(B),Le=new Ju(T,Me,we,Ee,Xe,Ue),Be=new wd(T,B),Ve=new $u,He=new od(we),Ge=new yc(T,Me,z,Fe,p,s),We=new md(T,Fe,Ee),Ze=new Td(R,je,Ee,z),qe=new xc(R,we,je),Je=new Yc(R,we,je),je.programs=Le.programs,T.capabilities=Ee,T.extensions=we,T.properties=B,T.renderLists=Ve,T.shadowMap=We,T.state=z,T.info=je}m!==1009&&(w=new el(m,t.width,t.height,o,r,i));let $e=new xd(T,R);this.xr=$e,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let e=we.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=we.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ae},this.setPixelRatio=function(e){e!==void 0&&(ae=e,this.setSize(L,ie,!1))},this.getSize=function(e){return e.set(L,ie)},this.setSize=function(e,n,r=!0){$e.isPresenting?H(`WebGLRenderer: Can't change size while VR device is presenting.`):(L=e,ie=n,t.width=Math.floor(e*ae),t.height=Math.floor(n*ae),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(L*ae,ie*ae).floor()},this.setDrawingBufferSize=function(e,n,r){L=e,ie=n,ae=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)U(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){H(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(I)},this.getViewport=function(e){return e.copy(ce)},this.setViewport=function(e,t,n,r){e.isVector4?ce.set(e.x,e.y,e.z,e.w):ce.set(e,t,n,r),z.viewport(I.copy(ce).multiplyScalar(ae).round())},this.getScissor=function(e){return e.copy(le)},this.setScissor=function(e,t,n,r){e.isVector4?le.set(e.x,e.y,e.z,e.w):le.set(e,t,n,r),z.scissor(ee.copy(le).multiplyScalar(ae).round())},this.getScissorTest=function(){return ue},this.setScissorTest=function(e){z.setScissorTest(ue=e)},this.setOpaqueSort=function(e){oe=e},this.setTransparentSort=function(e){se=e},this.getClearColor=function(e){return e.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor(...arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=Ge.getClearColor(),r=Ge.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,R.clearBufferuiv(R.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,R.clearBufferiv(R.COLOR,0,v))}else r|=R.COLOR_BUFFER_BIT}t&&(r|=R.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&R.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,et,!1),t.removeEventListener(`webglcontextrestored`,tt,!1),t.removeEventListener(`webglcontextcreationerror`,nt,!1),Ge.dispose(),Ve.dispose(),He.dispose(),B.dispose(),Me.dispose(),Fe.dispose(),Xe.dispose(),Ze.dispose(),Le.dispose(),$e.dispose(),$e.removeEventListener(`sessionstart`,lt),$e.removeEventListener(`sessionend`,ut),dt.stop()};function et(e){e.preventDefault(),Ht(`WebGLRenderer: Context Lost.`),E=!0}function tt(){Ht(`WebGLRenderer: Context Restored.`),E=!1;let e=je.autoReset,t=We.enabled,n=We.autoUpdate,r=We.needsUpdate,i=We.type;Qe(),je.autoReset=e,We.enabled=t,We.autoUpdate=n,We.needsUpdate=r,We.type=i}function nt(e){U(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function rt(e){let t=e.target;t.removeEventListener(`dispose`,rt),it(t)}function it(e){at(e),B.remove(e)}function at(e){let t=B.get(e).programs;t!==void 0&&(t.forEach(function(e){Le.releaseProgram(e)}),e.isShaderMaterial&&Le.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=_e);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=xt(e,t,n,r,i);z.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Pe.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Xe.setup(i,r,s,n,c);let h,g=qe;if(c!==null&&(h=Ne.get(c),g=Je,g.setIndex(h)),i.isMesh)r.wireframe===!0?(z.setLineWidth(r.wireframeLinewidth*ye()),g.setMode(R.LINES)):g.setMode(R.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),z.setLineWidth(e*ye()),i.isLineSegments?g.setMode(R.LINES):i.isLineLoop?g.setMode(R.LINE_LOOP):g.setMode(R.LINE_STRIP)}else i.isPoints?g.setMode(R.POINTS):i.isSprite&&g.setMode(R.TRIANGLES);if(i.isBatchedMesh){if(we.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ne.get(c).bytesPerElement:1,o=B.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(R,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ot(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),fe===!0&&Ue.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,_t(e,t,r),e.side=0,e.needsUpdate=!0,_t(e,t,r),e.side=2):_t(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=He.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),pe=this.localClippingEnabled,fe=Ue.init(this.clippingPlanes,pe),fe===!0&&Ue.setGlobalState(this.clippingPlanes,t),D!==null&&We.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];ot(o,n,t,e),r.add(o)}else ot(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=B.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}we.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let st=null;function ct(e){st&&st(e)}function lt(){dt.stop()}function ut(){dt.start()}let dt=new pc;dt.setAnimationLoop(ct),typeof self<`u`&&dt.setContext(self),this.setAnimationLoop=function(e){st=e,$e.setAnimationLoop(e),e===null?dt.stop():dt.start()},$e.addEventListener(`sessionstart`,lt),$e.addEventListener(`sessionend`,ut),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){U(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=$e.enabled===!0&&$e.isPresenting===!0,r=w!==null&&(N===null||n)&&w.begin(T,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),$e.enabled===!0&&$e.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&($e.cameraAutoUpdate===!0&&$e.updateCamera(t),t=$e.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,N),x=He.get(e,C.length),x.init(t),x.state.textureUnits=V.getTextureUnits(),C.push(x),me.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),de.setFromProjectionMatrix(me,It,t.reversedDepth),pe=this.localClippingEnabled,fe=Ue.init(this.clippingPlanes,pe),b=Ve.get(e,S.length),b.init(),S.push(b),$e.enabled===!0&&$e.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&ft(e,t,-1/0,T.sortObjects)}ft(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(oe,se),ve=$e.enabled===!1||$e.isPresenting===!1||$e.hasDepthSensing()===!1,ve&&Ge.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),fe===!0&&Ue.beginShadows();let i=x.state.shadowsArray;if(We.render(i,e,t),fe===!0&&Ue.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];mt(n,r,e,a)}ve&&Ge.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];pt(b,e,n,n.viewport)}}else r.length>0&&mt(n,r,e,t),ve&&Ge.render(e),pt(b,e,t)}N!==null&&M===0&&(V.updateMultisampleRenderTarget(N),V.updateRenderTargetMipmap(N)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Xe.resetDefaultState(),P=-1,F=null,C.pop(),C.length>0?(x=C[C.length-1],V.setTextureUnits(x.state.textureUnits),fe===!0&&Ue.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function ft(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(de)){r&&ge.setFromMatrixPosition(e.matrixWorld).applyMatrix4(me);let i=Fe.update(e),a=e.material;a.visible&&b.push(e,i,a,n,ge.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(de))){let i=Fe.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),ge.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),ge.copy(e.boundingSphere.center)),ge.applyMatrix4(e.matrixWorld).applyMatrix4(me)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,ge.z,s,t)}}else a.visible&&b.push(e,i,a,n,ge.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)ft(i[e],t,n,r)}function pt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),fe===!0&&Ue.setGlobalState(T.clippingPlanes,n),r&&z.viewport(I.copy(r)),i.length>0&&ht(i,t,n),a.length>0&&ht(a,t,n),o.length>0&&ht(o,t,n),z.buffers.depth.setTest(!0),z.buffers.depth.setMask(!0),z.buffers.color.setMask(!0),z.setPolygonOffset(!1)}function mt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=we.has(`EXT_color_buffer_half_float`)||we.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new Bn(1,1,{generateMipmaps:!0,type:e?De:xe,minFilter:be,samples:Math.max(4,Ee.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:J.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||I;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(ne),re=T.getClearAlpha(),re<1&&T.setClearColor(16777215,.5),T.clear(),ve&&Ge.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),fe===!0&&Ue.setGlobalState(T.clippingPlanes,r),ht(e,n,r),V.updateMultisampleRenderTarget(a),V.updateRenderTargetMipmap(a),we.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,gt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(V.updateMultisampleRenderTarget(a),V.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(ne,re),d!==void 0&&(r.viewport=d),T.toneMapping=u}function ht(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&gt(o,t,n,s,l,c)}}function gt(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function _t(e,t,n){t.isScene!==!0&&(t=_e);let r=B.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Le.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Le.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Me.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,rt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return yt(e,s),d}else s.uniforms=Le.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Le.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ue.uniform),yt(e,s),r.needsLights=Ct(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function vt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=su.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function yt(e,t){let n=B.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function bt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function xt(e,t,n,r,i){t.isScene!==!0&&(t=_e),V.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?T.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:J.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Me.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=B.get(r),y=x.state.lights;if(fe===!0&&(pe===!0||e!==F)){let t=e===F&&r.id===P;Ue.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ue.numPlanes||v.numIntersection!==Ue.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=_t(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),k=v.uniforms;if(z.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==P&&(P=r.id,w=!0),v.needsLights){let e=bt(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||F!==e){z.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(R,`projectionMatrix`,e.projectionMatrix),O.setValue(R,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(R,he.setFromMatrixPosition(e.matrixWorld)),Ee.logarithmicDepthBuffer&&O.setValue(R,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(R,`isOrthographic`,e.isOrthographicCamera===!0),F!==e&&(F=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(R,`sunShadowMap`,y.state.sunShadowMap,V),y.state.directionalShadowMap.length>0&&O.setValue(R,`directionalShadowMap`,y.state.directionalShadowMap,V),y.state.spotShadowMap.length>0&&O.setValue(R,`spotShadowMap`,y.state.spotShadowMap,V),y.state.pointShadowMap.length>0&&O.setValue(R,`pointShadowMap`,y.state.pointShadowMap,V)),i.isSkinnedMesh){O.setOptional(R,i,`bindMatrix`),O.setOptional(R,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(R,`boneTexture`,e.boneTexture,V))}i.isBatchedMesh&&(O.setOptional(R,i,`batchingTexture`),O.setValue(R,`batchingTexture`,i._matricesTexture,V),O.setOptional(R,i,`batchingIdTexture`),O.setValue(R,`batchingIdTexture`,i._indirectTexture,V),O.setOptional(R,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(R,`batchingColorTexture`,i._colorsTexture,V));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&Ke.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(R,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(k.envMapIntensity.value=t.environmentIntensity),k.dfgLUT!==void 0&&(k.dfgLUT.value=Od()),w){if(O.setValue(R,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&St(k,E),a&&r.fog===!0&&Be.refreshFogUniforms(k,a),Be.refreshMaterialUniforms(k,r,ae,ie,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;k.probesSH.value=e.texture,k.probesMin.value.copy(e.boundingBox.min),k.probesMax.value.copy(e.boundingBox.max),k.probesResolution.value.copy(e.resolution)}su.upload(R,vt(v),k,V)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(su.upload(R,vt(v),k,V),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(R,`center`,i.center),O.setValue(R,`modelViewMatrix`,i.modelViewMatrix),O.setValue(R,`normalMatrix`,i.normalMatrix),O.setValue(R,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ze.update(n,S),Ze.bind(n,S)}}return S}function St(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Ct(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=B.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),B.get(e.texture).__webglTexture=t,B.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=B.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,j=t,M=n;let r=null,i=!1,a=!1;if(e){let o=B.get(e);if(o.__useDefaultFramebuffer!==void 0){z.bindFramebuffer(R.FRAMEBUFFER,o.__webglFramebuffer),I.copy(e.viewport),ee.copy(e.scissor),te=e.scissorTest,z.viewport(I),z.scissor(ee),z.setScissorTest(te),P=-1;return}if(o.__webglFramebuffer===void 0)V.setupRenderTarget(e);else if(o.__hasExternalTextures)V.rebindTextures(e,B.get(e.texture).__webglTexture,B.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&B.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);V.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=B.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&V.useMultisampledRTT(e)===!1?B.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,I.copy(e.viewport),ee.copy(e.scissor),te=e.scissorTest}else I.copy(ce).multiplyScalar(ae).floor(),ee.copy(le).multiplyScalar(ae).floor(),te=ue;if(n!==0&&(r=O),z.bindFramebuffer(R.FRAMEBUFFER,r)&&z.drawBuffers(e,r),z.viewport(I),z.scissor(ee),z.setScissorTest(te),i){let r=B.get(e.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=B.get(e.textures[t]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=B.get(e.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,t.__webglTexture,n)}P=-1};function wt(e){let t=B.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ee.textureFormatReadable(e.format),t.__typeReadable=Ee.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=B.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){z.bindFramebuffer(R.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+s);let u=wt(o);if(u.__formatReadable===!1){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&R.readPixels(t,n,r,i,Ye.convert(c),Ye.convert(l),a)}finally{let e=N===null?null:B.get(N).__webglFramebuffer;z.bindFramebuffer(R.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=B.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){z.bindFramebuffer(R.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+s);let d=wt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,f),R.bufferData(R.PIXEL_PACK_BUFFER,a.byteLength,R.STREAM_READ),R.readPixels(t,n,r,i,Ye.convert(l),Ye.convert(u),0),R.bindBuffer(R.PIXEL_PACK_BUFFER,null);let p=N===null?null:B.get(N).__webglFramebuffer;z.bindFramebuffer(R.FRAMEBUFFER,p);let m=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Gt(R,m,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,f),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,a),R.bindBuffer(R.PIXEL_PACK_BUFFER,null),R.deleteBuffer(f),R.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;V.setTexture2D(e,0),R.copyTexSubImage2D(R.TEXTURE_2D,n,0,0,o,s,i,a),z.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ye.convert(t.format),_=Ye.convert(t.type),v;t.isData3DTexture?(V.setTexture3D(t,0),v=R.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(V.setTexture2DArray(t,0),v=R.TEXTURE_2D_ARRAY):(V.setTexture2D(t,0),v=R.TEXTURE_2D),z.activeTexture(R.TEXTURE0),z.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,t.flipY),z.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),z.pixelStorei(R.UNPACK_ALIGNMENT,t.unpackAlignment);let y=z.getParameter(R.UNPACK_ROW_LENGTH),b=z.getParameter(R.UNPACK_IMAGE_HEIGHT),x=z.getParameter(R.UNPACK_SKIP_PIXELS),S=z.getParameter(R.UNPACK_SKIP_ROWS),C=z.getParameter(R.UNPACK_SKIP_IMAGES);z.pixelStorei(R.UNPACK_ROW_LENGTH,h.width),z.pixelStorei(R.UNPACK_IMAGE_HEIGHT,h.height),z.pixelStorei(R.UNPACK_SKIP_PIXELS,l),z.pixelStorei(R.UNPACK_SKIP_ROWS,u),z.pixelStorei(R.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=B.get(e),r=B.get(t),h=B.get(n.__renderTarget),g=B.get(r.__renderTarget);z.bindFramebuffer(R.READ_FRAMEBUFFER,h.__webglFramebuffer),z.bindFramebuffer(R.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,B.get(e).__webglTexture,i,d+n),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,B.get(t).__webglTexture,a,m+n)),R.blitFramebuffer(l,u,o,s,f,p,o,s,R.DEPTH_BUFFER_BIT,R.NEAREST);z.bindFramebuffer(R.READ_FRAMEBUFFER,null),z.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||B.has(e)){let n=B.get(e),r=B.get(t);z.bindFramebuffer(R.READ_FRAMEBUFFER,k),z.bindFramebuffer(R.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,n.__webglTexture,i),T?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,r.__webglTexture,a),i===0?T?R.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):R.copyTexSubImage2D(v,a,f,p,l,u,o,s):R.blitFramebuffer(l,u,o,s,f,p,o,s,R.COLOR_BUFFER_BIT,R.NEAREST);z.bindFramebuffer(R.READ_FRAMEBUFFER,null),z.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?R.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?R.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):R.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):R.texSubImage2D(R.TEXTURE_2D,a,f,p,o,s,g,_,h);z.pixelStorei(R.UNPACK_ROW_LENGTH,y),z.pixelStorei(R.UNPACK_IMAGE_HEIGHT,b),z.pixelStorei(R.UNPACK_SKIP_PIXELS,x),z.pixelStorei(R.UNPACK_SKIP_ROWS,S),z.pixelStorei(R.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&R.generateMipmap(v),z.unbindTexture()},this.initRenderTarget=function(e){B.get(e).__webglFramebuffer===void 0&&V.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?V.setTextureCube(e,0):e.isData3DTexture?V.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?V.setTexture2DArray(e,0):V.setTexture2D(e,0),z.unbindTexture()},this.resetState=function(){j=0,M=0,N=null,z.reset(),Xe.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return It}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=J._getDrawingBufferColorSpace(e),t.unpackColorSpace=J._getUnpackColorSpace()}},Ad={type:`change`},jd={type:`start`},Md={type:`end`},Nd=new Ai,Pd=new Ci,Fd=Math.cos(70*bn.DEG2RAD),Id=new K,Ld=2*Math.PI,Rd={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},zd=1e-6,Bd=class extends uc{constructor(e,t=null){super(e,t),this.state=Rd.NONE,this.target=new K,this.cursor=new K,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:`ArrowLeft`,UP:`ArrowUp`,RIGHT:`ArrowRight`,BOTTOM:`ArrowDown`},this.mouseButtons={LEFT:ue.ROTATE,MIDDLE:ue.DOLLY,RIGHT:ue.PAN},this.touches={ONE:de.ROTATE,TWO:de.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle=`auto`,this._domElementKeyEvents=null,this._lastPosition=new K,this._lastQuaternion=new xn,this._lastTargetPosition=new K,this._quat=new xn().setFromUnitVectors(e.up,new K(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new lc,this._sphericalDelta=new lc,this._scale=1,this._panOffset=new K,this._rotateStart=new G,this._rotateEnd=new G,this._rotateDelta=new G,this._panStart=new G,this._panEnd=new G,this._panDelta=new G,this._dollyStart=new G,this._dollyEnd=new G,this._dollyDelta=new G,this._dollyDirection=new K,this._mouse=new G,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Hd.bind(this),this._onPointerDown=Vd.bind(this),this._onPointerUp=Ud.bind(this),this._onContextMenu=Xd.bind(this),this._onMouseWheel=Kd.bind(this),this._onKeyDown=qd.bind(this),this._onTouchStart=Jd.bind(this),this._onTouchMove=Yd.bind(this),this._onMouseDown=Wd.bind(this),this._onMouseMove=Gd.bind(this),this._interceptControlDown=Zd.bind(this),this._interceptControlUp=Qd.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e===`grab`?this.domElement.style.cursor=`grab`:this.domElement.style.cursor=`auto`}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener(`pointerdown`,this._onPointerDown),this.domElement.addEventListener(`pointercancel`,this._onPointerUp),this.domElement.addEventListener(`contextmenu`,this._onContextMenu),this.domElement.addEventListener(`wheel`,this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener(`keydown`,this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction=`none`}disconnect(){this.state=Rd.NONE,this.domElement.removeEventListener(`pointerdown`,this._onPointerDown),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.domElement.removeEventListener(`pointercancel`,this._onPointerUp),this.domElement.removeEventListener(`wheel`,this._onMouseWheel),this.domElement.removeEventListener(`contextmenu`,this._onContextMenu),this.stopListenToKeyEvents();let e=this.domElement.getRootNode();e.removeEventListener(`keydown`,this._interceptControlDown,{capture:!0}),e.removeEventListener(`keyup`,this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction=``,this.domElement.style.cursor=`auto`}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ad),this.update(),this.state=Rd.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;Id.copy(t).sub(this.target),Id.applyQuaternion(this._quat),this._spherical.setFromVector3(Id),this.autoRotate&&this.state===Rd.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=Ld:n>Math.PI&&(n-=Ld),r<-Math.PI?r+=Ld:r>Math.PI&&(r-=Ld),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let i=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let e=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),i=e!=this._spherical.radius}if(Id.setFromSpherical(this._spherical),Id.applyQuaternion(this._quatInverse),t.copy(this.target).add(Id),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let e=null;if(this.object.isPerspectiveCamera){let t=Id.length();e=this._clampDistance(t*this._scale);let n=t-e;this.object.position.addScaledVector(this._dollyDirection,n),this.object.updateMatrixWorld(),i=!!n}else if(this.object.isOrthographicCamera){let t=new K(this._mouse.x,this._mouse.y,0);t.unproject(this.object);let n=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),i=n!==this.object.zoom;let r=new K(this._mouse.x,this._mouse.y,0);r.unproject(this.object),this.object.position.sub(r).add(t),this.object.updateMatrixWorld(),e=Id.length()}else console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`),this.zoomToCursor=!1;e!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position):(Nd.origin.copy(this.object.position),Nd.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Nd.direction))<Fd?this.object.lookAt(this.target):(Pd.setFromNormalAndCoplanarPoint(this.object.up,this.target),Nd.intersectPlane(Pd,this.target))))}else if(this.object.isOrthographicCamera){let e=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),e!==this.object.zoom&&(this.object.updateProjectionMatrix(),i=!0)}return this._scale=1,this._performCursorZoom=!1,i||this._lastPosition.distanceToSquared(this.object.position)>zd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>zd||this._lastTargetPosition.distanceToSquared(this.target)>zd?(this.dispatchEvent(Ad),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e===null?Ld/60/60*this.autoRotateSpeed:Ld/60*this.autoRotateSpeed*e}_getZoomScale(e){let t=Math.abs(e*.01);return .95**(this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Id.setFromMatrixColumn(t,0),Id.multiplyScalar(-e),this._panOffset.add(Id)}_panUp(e,t){this.screenSpacePanning===!0?Id.setFromMatrixColumn(t,1):(Id.setFromMatrixColumn(t,0),Id.crossVectors(this.object.up,Id)),Id.multiplyScalar(e),this._panOffset.add(Id)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;Id.copy(r).sub(this.target);let i=Id.length();i*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*i/n.clientHeight,this.object.matrix),this._panUp(2*t*i/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,i=t-n.top,a=n.width,o=n.height;this._mouse.x=r/a*2-1,this._mouse.y=-(i/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Ld*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ld*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Ld*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Ld*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Ld*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Ld*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyStart.set(0,i)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateEnd.set(n,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Ld*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ld*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,i),this._dollyDelta.set(0,(this._dollyEnd.y/this._dollyStart.y)**+this.zoomSpeed),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new G,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Vd(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.ownerDocument.addEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.addEventListener(`pointerup`,this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType===`touch`?this._onTouchStart(e):this._onMouseDown(e),this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grabbing`)))}function Hd(e){this.enabled!==!1&&(e.pointerType===`touch`?this._onTouchMove(e):this._onMouseMove(e))}function Ud(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.dispatchEvent(Md),this.state=Rd.NONE,this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grab`);break;case 1:let t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y})}}function Wd(e){let t;switch(e.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case ue.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(e),this.state=Rd.DOLLY;break;case ue.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=Rd.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=Rd.ROTATE}break;case ue.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=Rd.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=Rd.PAN}break;default:this.state=Rd.NONE}this.state!==Rd.NONE&&this.dispatchEvent(jd)}function Gd(e){switch(this.state){case Rd.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case Rd.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case Rd.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e)}}function Kd(e){this.enabled!==!1&&this.enableZoom!==!1&&this.state===Rd.NONE&&(e.preventDefault(),this.dispatchEvent(jd),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(Md))}function qd(e){this.enabled!==!1&&this._handleKeyDown(e)}function Jd(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case de.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=Rd.TOUCH_ROTATE;break;case de.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=Rd.TOUCH_PAN;break;default:this.state=Rd.NONE}break;case 2:switch(this.touches.TWO){case de.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=Rd.TOUCH_DOLLY_PAN;break;case de.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=Rd.TOUCH_DOLLY_ROTATE;break;default:this.state=Rd.NONE}break;default:this.state=Rd.NONE}this.state!==Rd.NONE&&this.dispatchEvent(jd)}function Yd(e){switch(this._trackPointer(e),this.state){case Rd.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case Rd.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case Rd.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case Rd.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=Rd.NONE}}function Xd(e){this.enabled!==!1&&e.preventDefault()}function Zd(e){e.key===`Control`&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}function Qd(e){e.key===`Control`&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}var $d=e=>typeof e==`number`&&Number.isSafeInteger(e);function ef(e,t){return e.layouts&&e.layouts.A&&e.layouts.B&&e.layerPattern===`AB`?t%2==1?e.layouts.B:e.layouts.A:e.layout}function tf(e,t){if(!e||typeof e!=`object`||!$d(e.levels)||e.levels<=0||!$d(e.boxH)||e.boxH<=0)return null;let n=t!==`all`,r=0;if(n){if(!$d(t)||t<0||t>=e.levels)return null;r=t}let i=null;if(n)i=l(ef(e,r));else{let t=[ef(e,0)];e.layouts&&e.layouts.A&&e.layouts.B&&e.layerPattern===`AB`&&e.levels>=2&&t.push(e.layouts.B);for(let e of t){let t=l(e);if(!t)return null;if(!i)i=t;else{let e=Math.min(i.minX,t.minX),n=Math.min(i.minY,t.minY),r=Math.max(i.maxX,t.maxX),a=Math.max(i.maxY,t.maxY);if(!Number.isSafeInteger(r-e)||!Number.isSafeInteger(a-n))return null;i={minX:e,minY:n,maxX:r,maxY:a,width:r-e,height:a-n}}}}if(!i)return null;let a=n?e.boxH:e.levels*e.boxH;if(!$d(a))return null;let o=n?r*e.boxH:0;return $d(o)?{bounds:i,heightMm:a,stackBaseMm:o,scope:n?r:`all`}:null}var nf=[`cargoLength`,`cargoWidth`,`cargoHeight`,`palletLength`,`palletWidth`,`totalHeight`,`maxHeight`],rf={cargoLength:`cargo`,cargoWidth:`cargo`,cargoHeight:`height`,palletLength:`pallet`,palletWidth:`pallet`,totalHeight:`height`,maxHeight:`height`},af={cargoLength:`length`,cargoWidth:`width`,cargoHeight:`height`,palletLength:`length`,palletWidth:`width`,totalHeight:`height`,maxHeight:`height`},of=18,sf=18,cf=5,lf=8,uf=6;function df(e){throw Error(`dimension-overlay: ${e}`)}function ff(e){(!e||typeof e!=`object`)&&df(`input 需為物件`);let{width:t,height:n,modelRect:r,dimensions:i,measureText:a}=e;(!Number.isFinite(t)||!Number.isFinite(n)||t<=0||n<=0)&&df(`width/height 需為正數`),(!r||![`left`,`right`,`top`,`bottom`].every(e=>Number.isFinite(r[e])))&&df(`modelRect 需含 left/right/top/bottom`),(r.right<=r.left||r.bottom<=r.top)&&df(`modelRect 反轉`),typeof a!=`function`&&df(`measureText 需為函式`),Array.isArray(i)||df(`dimensions 需為陣列`);let o=new Set;for(let e of i){(!e||typeof e!=`object`)&&df(`dimensions 筆需為物件`),(typeof e.id!=`string`||!e.id)&&df(`dimension.id 需為字串`),o.has(e.id)&&df(`重複 id: ${e.id}`),o.add(e.id),(typeof e.text!=`string`||!e.text)&&df(`${e.id}: text 需為字串`),[`cargo`,`pallet`,`height`].includes(e.group)||df(`${e.id}: group 非法`),[`length`,`width`,`height`].includes(e.axis)||df(`${e.id}: axis 非法`),(!Array.isArray(e.projectedEndpoints)||e.projectedEndpoints.length!==2)&&df(`${e.id}: projectedEndpoints 需恰兩點`);for(let t of e.projectedEndpoints)(!t||!Number.isFinite(t.x)||!Number.isFinite(t.y))&&df(`${e.id}: projectedEndpoints 含非有限座標`)}e.profile!==void 0&&![`all`,`cargo`].includes(e.profile)&&df(`profile 需為 all 或 cargo`);let s=e.profile===`cargo`?nf.slice(0,3):nf;for(let e of s)o.has(e)||df(`缺少必要 id: ${e}`);for(let e of i)nf.includes(e.id)&&(e.group!==rf[e.id]&&df(`${e.id}: group 應為 ${rf[e.id]}`),e.axis!==af[e.id]&&df(`${e.id}: axis 應為 ${af[e.id]}`))}function pf(e){let t=e=>{let t=nf.indexOf(e.id);return t===-1?nf.length:t};return[...e].sort((n,r)=>t(n)-t(r)||e.indexOf(n)-e.indexOf(r))}function mf(e){if(typeof e.axisParallelToView==`boolean`)return e.axisParallelToView;let[t,n]=e.projectedEndpoints;return Math.hypot(n.x-t.x,n.y-t.y)<lf}function hf(e){return`投影退化：${{length:`長軸`,width:`寬軸`,height:`高度軸`}[e.axis]}在此視角不可見（正交視角提示）`}function gf(e){return`${{length:`長軸`,width:`寬軸`,height:`高軸`}[e.axis]}投影退化`}function _f(e){var t;ff(e);let{width:n,height:r,modelRect:i,measureText:a}=e,o=(t=e.fontSize)==null?13:t;(!Number.isFinite(o)||o<13)&&df(`fontSize 需為有限數且至少13px，不能靠縮字省位置`);let s=pf(e.dimensions).filter(t=>e.profile!==`cargo`||nf.slice(0,3).includes(t.id)),c=[],l=[],u=[],d={top:Math.floor((i.top-uf-4)/of),bottom:Math.floor((r-i.bottom-uf-4)/of),right:Math.floor((n-i.right-uf-4)/of),left:Math.floor((i.left-uf-4)/of)},f={top:0,bottom:0,right:0,left:0},p={top:0,bottom:0,right:0,left:0},m={top:`cargoTop`,bottom:`palletBottom`,right:`heightRight`,left:`heightLeft`},h={cargo:`top`,pallet:`bottom`,height:`right`},g={cargoTop:`cargo`,palletBottom:`pallet`,heightRight:`height`,heightLeft:`height`},_=(e,t=g[m[e]])=>{let n=t===g[m[e]]?m[e]:`${t}${e[0].toUpperCase()}${e.slice(1)}`;return c.some(e=>e.id===n)||c.push({id:n,side:e,group:t,linePos:e===`top`?i.top-sf:e===`bottom`?i.bottom+sf:e===`right`?i.right+sf:i.left-sf,capacity:d[e]}),n},v=[];for(let e of s){let t={id:e.id,text:e.text,group:e.group,axis:e.axis,projectedEndpoints:[{x:e.projectedEndpoints[0].x,y:e.projectedEndpoints[0].y},{x:e.projectedEndpoints[1].x,y:e.projectedEndpoints[1].y}]};if(mf(e)){v.push({d:e,base:t});continue}let s=h[e.group],[c,m]=e.projectedEndpoints,g=Math.abs(m.x-c.x),y=Math.abs(m.y-c.y);(s===`top`||s===`bottom`)&&g<lf&&y>=lf&&(s=`right`),s===`right`&&y<lf&&g>=lf&&(s=`top`),s===`right`&&d.right<1&&(s=`left`);let b=_(s,e.group),x=f[s]++;if(x>=d[s]){l.push({...t,status:`insufficient-space`,bandId:b,hint:null,dimensionLine:null,ticks:[],leader:null,label:null}),u.push(e.id);continue}let[S,C]=e.projectedEndpoints;if(s===`top`||s===`bottom`){let r=s===`top`?i.top-sf-x*of:i.bottom+sf+x*of,c=Math.round(Math.min(S.x,C.x)),d=Math.round(Math.max(S.x,C.x));if(c=Math.max(uf,c),d=Math.min(n-uf,d),d-c<lf){l.push({...t,status:`insufficient-space`,bandId:b,hint:hf(e),dimensionLine:null,ticks:[],leader:null,label:null}),u.push(e.id);continue}let f=s===`bottom`?S.y>=C.y?S:C:S.y<=C.y?S:C,p=Math.round(Math.min(Math.max(f.x,i.left),i.right)),m={p1:{x:p,y:s===`bottom`?Math.max(f.y,i.bottom):Math.min(f.y,i.top)},p2:{x:p,y:r}},h=[{p1:{x:c,y:r-cf},p2:{x:c,y:r+cf}},{p1:{x:d,y:r-cf},p2:{x:d,y:r+cf}}],g=a(e.text).width,_=Math.round(Math.min(Math.max((c+d)/2-g/2,uf),n-uf-g)),v=s===`bottom`?{text:e.text,x:_,y:r+4,w:g,h:o,textX:_,textY:r+4+o}:{text:e.text,x:_,y:r-4-o,w:g,h:o,textX:_,textY:r-4};l.push({...t,status:`placed`,bandId:b,hint:null,dimensionLine:{p1:{x:c,y:r},p2:{x:d,y:r}},ticks:h,leader:m,label:v})}else{let c=s===`right`?i.right+sf+x*of:i.left-sf-x*of,u=Math.round(Math.min(S.y,C.y)),d=Math.round(Math.max(S.y,C.y));u=Math.max(uf,u),d=Math.min(r-uf,d);let f=s===`right`?S.x>=C.x?S:C:S.x<=C.x?S:C,m=Math.round(Math.min(Math.max(f.y,i.top),i.bottom)),h={p1:{x:s===`right`?Math.max(f.x,i.right):Math.min(f.x,i.left),y:m},p2:{x:c,y:m}},g=[{p1:{x:c-cf,y:u},p2:{x:c+cf,y:u}},{p1:{x:c-cf,y:d},p2:{x:c+cf,y:d}}],_=a(e.text).width,v=p[s]++,y=i.top+v*of,w=s===`right`?c+4:c-4-_;w=Math.max(uf,Math.min(w,n-uf-_));let T={text:e.text,x:w,y,w:_,h:o,textX:w,textY:y+o};l.push({...t,status:`placed`,bandId:b,hint:null,dimensionLine:{p1:{x:c,y:u},p2:{x:c,y:d}},ticks:g,leader:h,label:T})}}let y=0,b=0;for(let{d:t,base:s}of v){let c=hf(t),d=e.profile===`cargo`?t.text:`${t.text}（${gf(t)}）`,p=a(d).width,m=h[t.group],g=_(m),v;if(m===`top`){let e=i.top-sf-(f.top+y)*of-4-o;v={text:d,x:uf,y:e,w:p,h:o,textX:uf,textY:e+o},y++}else{let e=i.bottom+sf+(f.bottom+b)*of+4;v={text:d,x:uf,y:e,w:p,h:o,textX:uf,textY:e+o},b++}let x=v.x>=0&&v.y>=0&&v.x+p<=n&&v.y+o<=r;l.push({...s,status:x?`degenerate`:`insufficient-space`,bandId:g,hint:c,dimensionLine:null,ticks:[],leader:null,label:x?v:null}),x||u.push(t.id)}for(let e of l){if(e.status!==`placed`)continue;let t=[[e.dimensionLine.p1,e.dimensionLine.p2],[e.leader.p1,e.leader.p2],...e.ticks.map(e=>[e.p1,e.p2])],a=!1;for(let[e,o]of t)e.x!==o.x&&e.y!==o.y&&(a=!0),(e.x<0||o.x<0||e.x>n||o.x>n||e.y<0||o.y<0||e.y>r||o.y>r)&&(a=!0),e.x===o.x&&e.x>i.left&&e.x<i.right&&Math.max(e.y,o.y)>i.top&&Math.min(e.y,o.y)<i.bottom&&(a=!0),e.y===o.y&&e.y>i.top&&e.y<i.bottom&&Math.max(e.x,o.x)>i.left&&Math.min(e.x,o.x)<i.right&&(a=!0);let o=e.label;(o.x<0||o.y<0||o.x+o.w>n||o.y+o.h>r)&&(a=!0),o.x<i.right&&o.x+o.w>i.left&&o.y<i.bottom&&o.y+o.h>i.top&&(a=!0),a&&(e.status=`insufficient-space`,e.label=null,e.dimensionLine=null,e.ticks=[],e.leader=null,u.push(e.id))}let x=l.filter(e=>e.label);for(let e=0;e<x.length;e++)for(let t=e+1;t<x.length;t++){let n=x[e].label,r=x[t].label;if(n&&r&&n.x<r.x+r.w&&r.x<n.x+n.w&&n.y<r.y+r.h&&r.y<n.y+n.h)for(let n of[x[e],x[t]])n.status!==`insufficient-space`&&(n.status=`insufficient-space`,n.label=null,n.dimensionLine=null,n.ticks=[],n.leader=null,u.push(n.id))}return{canvas:{width:n,height:r},modelRect:{left:i.left,right:i.right,top:i.top,bottom:i.bottom},fontSize:o,bands:c,items:l,status:u.length?`insufficient-space`:`ok`,unplaced:u}}function vf(e,t){if(!e||typeof e.beginPath!=`function`)throw Error(`dimension-overlay: draw 需 Canvas ctx`);if(!t||!Array.isArray(t.items))throw Error(`dimension-overlay: draw 需 layout`);e.save(),e.font=`${t.fontSize}px sans-serif`,e.strokeStyle=`#1f2937`,e.fillStyle=`#1f2937`,e.lineWidth=1;for(let n of t.items)if(n.status!==`placed`)n.status===`degenerate`&&n.label&&e.fillText(n.label.text,n.label.textX,n.label.textY);else{e.beginPath(),e.moveTo(n.dimensionLine.p1.x,n.dimensionLine.p1.y),e.lineTo(n.dimensionLine.p2.x,n.dimensionLine.p2.y);for(let t of n.ticks)e.moveTo(t.p1.x,t.p1.y),e.lineTo(t.p2.x,t.p2.y);e.moveTo(n.leader.p1.x,n.leader.p1.y),e.lineTo(n.leader.p2.x,n.leader.p2.y),e.stroke(),e.fillText(n.label.text,n.label.textX,n.label.textY)}e.restore()}var Q=1/100,yf=18,bf=18,xf=96,Sf=[`cargoHeight`,`totalHeight`,`maxHeight`];function Cf({dims:e,result:t,cargoDims:n,levelCount:r=1,currentLevel:i=`all`}={}){var a,o,s,c,l,u;if(!e||!t)return[];let d=e.L*Q,f=e.W*Q,p=((a=e.maxTotalH)==null?t.maxTotalH:a)*Q,m=e.H*Q,h=(n==null?void 0:n.bounds)||{minX:0,maxX:e.L,minY:0,maxY:e.W},g=m+((o=n==null?void 0:n.stackBaseMm)==null?0:o)*Q,_=g+((s=n==null?void 0:n.heightMm)==null?0:s)*Q,v=e.H+((c=t.levels)==null?r:c)*((l=t.boxH)==null?0:l),y=v*Q,b=(e,t,n)=>({x:e,y:t,z:n});return[{id:`cargoLength`,text:`貨物長 ${h.width}mm`,group:`cargo`,axis:`length`,worldEndpoints:[b(h.minX*Q,_,h.minY*Q),b(h.maxX*Q,_,h.minY*Q)]},{id:`cargoWidth`,text:`貨物寬 ${h.height}mm`,group:`cargo`,axis:`width`,worldEndpoints:[b(h.maxX*Q,_,h.minY*Q),b(h.maxX*Q,_,h.maxY*Q)]},{id:`cargoHeight`,text:`貨物高 ${(u=n==null?void 0:n.heightMm)==null?0:u}mm`,group:`height`,axis:`height`,worldEndpoints:[b(h.maxX*Q,g,h.maxY*Q),b(h.maxX*Q,_,h.maxY*Q)]},{id:`palletLength`,text:`棧板長 ${e.L}mm`,group:`pallet`,axis:`length`,worldEndpoints:[b(0,0,0),b(d,0,0)]},{id:`palletWidth`,text:`棧板寬 ${e.W}mm`,group:`pallet`,axis:`width`,worldEndpoints:[b(d,0,0),b(d,0,f)]},{id:`totalHeight`,text:`總高 ${v}mm`,group:`height`,axis:`height`,worldEndpoints:[b(0,0,0),b(0,y,0)]},{id:`maxHeight`,text:`上限 ${p/Q}mm`,group:`height`,axis:`height`,worldEndpoints:[b(0,0,f),b(0,p,f)]}]}function wf(e,t,{width:n,height:r}={}){let i=Number.isFinite(n)?n:1,a=Number.isFinite(r)?r:1,o=t=>{let n=new K(t.x,t.y,t.z).project(e);return{x:(n.x+1)*i/2,y:(1-n.y)*a/2}},s=e.getWorldDirection(new K),c=(t||[]).map(e=>({id:e.id,text:e.text,group:e.group,axis:e.axis,projectedEndpoints:e.worldEndpoints.map(o),axisParallelToView:Math.abs(new K().subVectors(e.worldEndpoints[1],e.worldEndpoints[0]).normalize().dot(s))>.999})),l=1/0,u=1/0,d=1/0,f=-1/0,p=-1/0,m=-1/0;for(let e of t||[])for(let t of e.worldEndpoints)l=Math.min(l,t.x),f=Math.max(f,t.x),u=Math.min(u,t.y),p=Math.max(p,t.y),d=Math.min(d,t.z),m=Math.max(m,t.z);let h={left:0,right:0,top:0,bottom:0};if(Number.isFinite(l)){let e=[];for(let t of[l,f])for(let n of[u,p])for(let r of[d,m])e.push(o({x:t,y:n,z:r}));h.left=Math.min(...e.map(e=>e.x)),h.right=Math.max(...e.map(e=>e.x)),h.top=Math.min(...e.map(e=>e.y)),h.bottom=Math.max(...e.map(e=>e.y))}return{modelRect:h,dimensions:c}}function Tf({width:e,height:t,degenerateIds:n=[],profile:r=`all`}={}){let i=r===`cargo`,a=(i?[`cargoHeight`]:Sf).filter(e=>n.includes(e)).length,o=19+((i?0:2)+a)*bf+yf,s=24+(i?0:2)*bf+xf,c=Math.max(0,t-o-37),l=Math.max(0,t-73-37),u=Math.max(0,e-24-37);return{top:Math.min(73,c),bottom:Math.min(o,l),right:Math.min(s,u),left:Math.min(24,Math.max(0,e-s-37))}}function Ef(e,t,{width:n,height:r,margins:i,sources:a=[],view:o=`iso`}={}){var s,c;let l={applied:!1,zoom:1,offsetX:0,offsetY:0,rect:null};if(o===`custom`||!e||!t||!i)return l;let u=Number.isFinite(n)?n:1,d=Number.isFinite(r)?r:1,f=t.L*Q,p=t.W*Q,m=Math.max(((s=t.maxTotalH)==null?0:s)*Q,...a.flatMap(e=>e.worldEndpoints.map(e=>e.y))),h=new K(f/2,((c=t.maxTotalH)==null?0:c)*Q/2,p/2),g=Math.max(1,u-i.left-i.right),_=Math.max(1,d-i.top-i.bottom);e.clearViewOffset(),e.updateMatrixWorld(!0),e.updateProjectionMatrix();let v=e.position.clone().sub(h),y=v.length();if(y<1e-9)return l;v.normalize();let b=a.flatMap(e=>e.worldEndpoints),x={x:[Math.min(0,...b.map(e=>e.x)),Math.max(f,...b.map(e=>e.x))],y:[Math.min(0,...b.map(e=>e.y)),m],z:[Math.min(0,...b.map(e=>e.z)),Math.max(p,...b.map(e=>e.z))]},S=[];for(let t of x.x)for(let n of x.y)for(let r of x.z){let i=new K(t,n,r).applyMatrix4(e.matrixWorldInverse);S.push({x:i.x,y:i.y,a:y+i.z})}let C=t=>{let n=Math.max(t-Math.max(...S.map(e=>e.a)),1e-6);Math.max(t-Math.min(...S.map(e=>e.a)),n);let r=(t,n)=>(t*e.projectionMatrix.elements[0]/n+1)*u/2,i=(t,n)=>(1-t*e.projectionMatrix.elements[5]/n)*d/2,a=1/0,o=-1/0,s=1/0,c=-1/0;for(let e of S){let n=Math.max(t-e.a,1e-6);a=Math.min(a,r(e.x,n)),o=Math.max(o,r(e.x,n)),s=Math.min(s,i(e.y,n)),c=Math.max(c,i(e.y,n))}return{left:a,right:o,top:s,bottom:c}},w=Math.max(...S.map(e=>e.a)),T=Math.min(...S.map(e=>e.a)),E=w+e.near*1.01,D=T+e.far*.99,O=e=>{let t=C(e);return e>E&&t.right-t.left<=g-.02&&t.bottom-t.top<=_-.02},k=y;if(!O(y)||y>=D){let e=Math.max(1e-6,E),t=D;if(t<=e||!O(t))return l;for(let n=0;n<60;n++){let n=(e+t)/2;O(n)?t=n:e=n}k=t}e.position.copy(h).addScaledVector(v,k),e.updateMatrixWorld(!0),e.updateProjectionMatrix(),l.zoom=k/y;let A=()=>{let t=[];for(let n of[0,f])for(let r of[0,m])for(let i of[0,p]){let a=new K(n,r,i).project(e);t.push({x:(a.x+1)*u/2,y:(1-a.y)*d/2})}return{left:Math.min(...t.map(e=>e.x)),right:Math.max(...t.map(e=>e.x)),top:Math.min(...t.map(e=>e.y)),bottom:Math.max(...t.map(e=>e.y))}},j=A(),M=(j.left+j.right)/2,N=(j.top+j.bottom)/2,P=i.left+g/2,F=i.top+_/2,I=P-M,ee=F-N;return(Math.abs(I)>.5||Math.abs(ee)>.5)&&(e.setViewOffset(u,d,-I,-ee,u,d),l.offsetX=-I,l.offsetY=-ee,e.updateMatrixWorld(!0),e.updateProjectionMatrix()),l.rect=A(),l.applied=!0,l}function Df(e,t,{dpr:n=1,cssWidth:r,cssHeight:i,fontPx:a=13,measureText:o}={}){return e.setTransform(n,0,0,n,0,0),e.clearRect(0,0,r,i),e.font=`${a}px sans-serif`,e.textBaseline=`alphabetic`,vf(e,t,{measureText:o}),{width:r*n,height:i*n}}var Of=3e3,kf=.985,Af={background:15986662,rot0:15233804,rot1:2785135,pallet:12160350,palletEdge:2826520,stackEdge:2826520,maxFrame:3108789,dimLine:3620922,cargoDim:2060172,labelText:`#1d241f`,labelBg:`rgba(250,247,240,0.94)`,labelBorder:`#2b2118`},jf=.82;function Mf(e){let t=0;for(let n of String(e))t+=n.codePointAt(0)>11904?1:.6;return t}function Nf(e,t,n){let r=[];for(let i of String(e).split(`
`)){let e=``,a=0;for(let o of i){let i=n?n(o):Mf(o);e&&a+i>t&&(r.push(e),e=``,a=0),e+=o,a+=i}r.push(e)}return r}function Pf(e,t={}){var n;let r=Math.max(120,t.canvasWidth||720),i=t.fontPx||26,a=t.pad||18,o=t.lineHeight||Math.round(i*1.5),s=Math.max(1,(r-2*a)/i),c=typeof t.measure==`function`?t.measure:null,l=r-2*a,u=[];for(let t of e)u=u.concat(c?Nf(t,l,c):Nf(t,s));let d=!1,f=(n=t.maxPanelH)==null?1/0:n;for(;u.length>1&&u.length*o+2*a>f;)u.pop(),d=!0;d&&(u[u.length-1]+=`…`);let p=u.length?u.length*o+2*a:0,m=e=>Math.ceil(c?[...e].reduce((e,t)=>e+c(t),0):Mf(e)*i),h=u.reduce((e,t)=>Math.max(e,m(t)),0);return{lines:u,fontPx:i,pad:a,lineHeight:o,panelH:p,textMaxWidth:h,canvasWidth:r}}function Ff(e,t,n,r){let i=t>0,a=[],o=r;for(let r=0;r<n&&!(o<=0);r++){let n=i&&r%2?t:e,s=Math.min(n,o);if(a.push(s),o-=s,s<n)break}return a.length===0&&a.push(0),{levelsAll:a.length,counts:a}}function If(e){let t=new kd({antialias:!0,preserveDrawingBuffer:!0});t.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),e.appendChild(t.domElement),t.domElement.style.touchAction=`none`,getComputedStyle(e).position===`static`&&(e.style.position=`relative`);let n=document.createElement(`canvas`);n.id=`dimensionOverlay`,n.style.position=`absolute`,n.style.inset=`0`,n.style.width=`100%`,n.style.height=`100%`,n.style.pointerEvents=`none`,n.setAttribute(`aria-hidden`,`true`),e.appendChild(n);let r=n.getContext(`2d`),i=e=>r.measureText(e),a=[],o=null,s=``,c=new Tr;c.background=new Y(Af.background);let l=new Us(45,1,.01,500),u=new Bd(l,t.domElement);u.enableDamping=!0,u.dampingFactor=.08,u.enablePan=!1,u.minDistance=.5,u.maxDistance=200,u.touches={ONE:de.ROTATE,TWO:de.DOLLY_ROTATE},c.add(new js(16777215,12564132,.65));let d=new Ks(16777215,.55);d.position.set(15,25,12),c.add(d);let f=null,p=null,m=0,h=`iso`,g=`all`,_=!0,v=0,y=!1,b=null;function x(){let t=l.position.clone().sub(u.target).normalize().toArray();e.dispatchEvent(new CustomEvent(`viewchange`,{detail:{view:h,direction:t}}))}u.addEventListener(`change`,()=>{!y&&b&&h!==`custom`&&l.position.clone().sub(u.target).normalize().dot(b)<.999999&&(h=`custom`,x())});function S(){_=!0}function C(e){let t=new Set;e.traverse(e=>{e.material&&(e.material.map&&(e.material.map.dispose(),e.material.map=null),t.has(e.material)||(t.add(e.material),e.material.dispose())),e.geometry&&!t.has(e.geometry)&&(t.add(e.geometry),e.geometry.dispose())})}function w(){f&&(C(f),c.remove(f),f=null)}function T(e,t,n,r){let i=new va(new ka(new Ca(e,t,n)),new oa({color:r}));return i.renderOrder=8,i}function E(){return new ka(new Ca(p.L*Q,p.maxTotalH*Q,p.W*Q))}function D(){let e=Math.max(.12,p.L*Q*.04);return new us({color:Af.maxFrame,dashSize:e,gapSize:e*.6,transparent:!0,opacity:.95})}function O(){if(!f||!p||!f.userData.result){a=[];return}let e=tf({layout:f.userData.result.layoutA,layouts:f.userData.result.ab?{A:f.userData.result.layoutA,B:f.userData.result.layoutB}:null,layerPattern:f.userData.result.ab?`AB`:null,levels:m,boxH:f.userData.result.boxH},g);f.userData.cargoDims=e,a=Cf({dims:p,result:{...f.userData.result,maxTotalH:p.maxTotalH},cargoDims:e,levelCount:m,currentLevel:g})}function k(e){w(),g=`all`,f=new _r;let t=!!(e.layouts&&e.layouts.A&&e.layouts.B&&e.layerPattern===`AB`),n=t?e.layouts.A:e.layout,r=t?e.layouts.B:null,i=n.length,a=t?r.length:0;p={L:e.palletL,W:e.palletW,H:e.palletH,maxTotalH:e.maxTotalH},m=e.levels,f.userData.result={boxH:e.boxH,palletH:e.palletH,perLevel:e.perLevel,totalHeightUsed:e.totalHeightUsed,levels:e.levels,ab:t,layoutA:n,layoutB:r,perLevelA:i,perLevelB:a,patternName:t?e.patternName||`A/B 交替`:null};let o=p.L*Q,s=p.W*Q,l=p.H*Q,u=p.maxTotalH*Q,d=(p.H+m*e.boxH)*Q,h=new Ui(new Ca(o,l,s),new ji({color:Af.pallet}));h.position.set(o/2,l/2,s/2),f.add(h);let _=T(o,l,s,Af.palletEdge);_.position.copy(h.position),f.add(_);let v=new va(E(),D());if(v.computeLineDistances(),v.position.set(o/2,u/2,s/2),v.renderOrder=8,f.add(v),f.userData.frame=v,m>0){let e=new va(new ka(new Yo(o,s)),new oa({color:Af.stackEdge}));e.rotation.x=-Math.PI/2,e.position.set(o/2,d+.002,s/2),f.add(e),f.userData.topRect=e}if(i>0&&e.totalBoxes>0&&m>0){let e=Ff(i,a,m,Of),t=Math.min(Of,Math.max(i,a)),n=0;for(let t of e.counts)n+=t;let r=Math.min(Of,Math.max(n,t)),o=new ta(new Ca(1,1,1),new ji({color:16777215}),r);o.frustumCulled=!1,o.userData.cap=r,f.add(o);let s=new va(new yi,new oa({color:5258022}));s.frustumCulled=!1,f.add(s),f.userData.boxOutlines=s,f.userData.inst=o,f.userData.levelsAll=e.levelsAll,f.userData.levelCounts=e.counts,f.userData.truncated=e.levelsAll<m||Math.max(i,a)>3e3,g!==`all`&&Number(g)>=m&&(g=`all`),A(g)}O(),c.add(f),I(),S()}function A(e){if(e=e===`all`?`all`:Number(e),g=e,!f||!f.userData.inst){S();return}let t=f.userData.result,n=f.userData.inst,r=n.userData.cap,i=new Un,a=new xn,o=new K,s=new K,c=new Y,l=e!==`all`,u=l?Number(e):0,d=l?Math.min(Number(e)+1,m):f.userData.levelsAll,p=0;for(let e=u;e<d&&p<r;e++){let u=t.ab&&e%2==1,d=u?t.layoutB:t.layoutA,m=l?Math.min(d.length,r):Math.min(d.length,f.userData.levelCounts[e]);for(let l=0;l<m&&p<r;l++){let r=d[l];s.set(r.w*Q*kf,t.boxH*Q*kf,r.h*Q*kf),o.set((r.x+r.w/2)*Q,(t.palletH+e*t.boxH+t.boxH/2)*Q,(r.y+r.h/2)*Q),i.compose(o,a,s),n.setMatrixAt(p,i),c.setHex(r.rot===1?Af.rot1:Af.rot0),u&&c.multiplyScalar(jf),n.setColorAt(p,c),p++}}n.count=p;let h=new Ca(1,1,1),_=new ka(h);h.dispose();let v=_.getAttribute(`position`),y=new Float32Array(p*v.count*3),b=new Un,x=new K;for(let e=0;e<p;e++){n.getMatrixAt(e,b);for(let t=0;t<v.count;t++)x.fromBufferAttribute(v,t).applyMatrix4(b),x.toArray(y,(e*v.count+t)*3)}_.dispose();let C=f.userData.boxOutlines;C.geometry.dispose(),C.geometry=new yi,C.geometry.setAttribute(`position`,new ii(y,3)),n.instanceMatrix.needsUpdate=!0,n.instanceColor&&(n.instanceColor.needsUpdate=!0),O(),S()}function j(e){if(!f||!e)return;p={L:e.palletL,W:e.palletW,H:e.palletH,maxTotalH:e.maxTotalH},m=e.levels,f.userData.result={...f.userData.result,boxH:e.boxH,palletH:e.palletH,perLevel:e.perLevel,totalHeightUsed:e.totalHeightUsed,levels:e.levels};let t=p.L*Q,n=p.W*Q,r=p.maxTotalH*Q,i=(p.H+m*e.boxH)*Q,a=f.userData.frame;if(a){let e=E();a.geometry.dispose(),a.geometry=e,a.position.set(t/2,r/2,n/2),a.computeLineDistances()}let o=f.userData.topRect;if(o){let e=new ka(new Yo(t,n));o.geometry.dispose(),o.geometry=e,o.position.set(t/2,i+.002,n/2)}O(),A(g),I(),S()}function M(){let t=e.clientWidth,n=e.clientHeight;return t>0&&n>0?{w:t,h:n}:null}function N(){return h===`top`?[...Sf]:[]}function P(){if(!p)return;let e=M();if(!e)return;let t=Tf({width:e.w,height:e.h,degenerateIds:N(),profile:`cargo`});Ef(l,p,{width:e.w,height:e.h,margins:t,sources:a,view:h})}function F(){if(!p||!f||!r)return;let t=M();if(!t)return;let c=Math.min(window.devicePixelRatio||1,2),u=Math.max(1,Math.round(t.w*c)),d=Math.max(1,Math.round(t.h*c));(n.width!==u||n.height!==d)&&(n.width=u,n.height=d),l.updateMatrixWorld(!0),l.updateProjectionMatrix();let m=wf(l,a,{width:t.w,height:t.h});o=_f({width:t.w,height:t.h,modelRect:m.modelRect,dimensions:m.dimensions,measureText:i,fontSize:13,profile:`cargo`}),Df(r,o,{dpr:c,cssWidth:t.w,cssHeight:t.h,fontPx:13,measureText:i});let h={status:o.status,unplaced:[...o.unplaced],items:o.items.map(e=>({id:e.id,status:e.status,text:e.text,bandId:e.bandId}))},g=JSON.stringify(h);g!==s&&(s=g,e.dataset.dimensionOverlay=g)}function I(){if(!p)return;let e=Math.max(p.L*Q,p.W*Q,p.maxTotalH*Q);u.minDistance=e*.3,u.maxDistance=e*8,h!==`custom`&&ee(h),P()}function ee(e){if(![`iso`,`top`,`front`].includes(e))return;y=!0;let t=u.enableDamping;if(u.enableDamping=!1,u.update(),h=e,!p){u.enableDamping=t,y=!1,S();return}let n=p.L*Q,r=p.W*Q,i=p.maxTotalH*Q,a=Math.max(n,r,i),o=n/2,s=i/2,c=r/2;u.target.set(o,s,c);let d=Math.atan(Math.tan(bn.degToRad(l.fov/2))*Math.min(1,l.aspect)),f=Math.hypot(n,r,i)/2/Math.sin(d)*1.22,m=e===`top`?new K(0,1,0):e===`front`?new K(0,0,-1):new K(.62,.45,-.62);l.up.set(0,1,0),b=m.clone().normalize(),l.position.copy(u.target).addScaledVector(b,f),l.near=a/100,l.far=a*20,l.updateProjectionMatrix(),u.update(),u.enableDamping=t,y=!1,P(),x(),S()}function te(){let n=e.clientWidth,r=e.clientHeight;if(n<=0||r<=0)return;t.setSize(n,r,!1);let i=Math.abs(l.aspect-n/r)>.001;l.aspect=n/r,l.updateProjectionMatrix(),i&&p&&I(),P(),S()}function ne(){F(),t.render(c,l)}function re(){if(!p||!f||!f.userData.result)return[];let e=f.userData.result,t=m*e.boxH,n=p.H+t,r=[`棧板 ${p.L}×${p.W}×${p.H} mm・貨箱高 ${e.boxH} mm`,`貨物堆疊高度 ${t} mm・共 ${m} 層`,`實際總高 ${n} mm／上限 ${p.maxTotalH} mm`];if(e.ab&&e.patternName&&r.push(`模式 ${e.patternName}（A/B 交替）`),g!==`all`){let t=Number(g),n=e.ab&&t%2==1,i=e.palletH+(t+1)*e.boxH,a=n?e.perLevelB:e.perLevelA;r.push(`目前顯示：第 ${t+1} 層（${n?`B`:`A`} 型・${a} 箱）頂高 ${i} mm（整垛共 ${m} 層）`)}else r.push(`目前顯示：全部層（整垛）`);let i=f.userData.cargoDims;if(i){let e=i.scope===`all`?`全部層`:`第 ${i.scope+1} 層`;r.push(`貨物實際占用（${e}）：長 ${i.bounds.width}×寬 ${i.bounds.height}×高 ${i.heightMm} mm`)}return r}function L(){te(),t.render(c,l),F();let e=t.domElement,r=re().map(e=>`• ${e}`);if(r.length===0){let t=document.createElement(`canvas`);t.width=e.width,t.height=e.height;let r=t.getContext(`2d`);return r.drawImage(e,0,0),r.drawImage(n,0,0,e.width,e.height),t.toDataURL(`image/png`)}let i=document.createElement(`canvas`),a=i.getContext(`2d`),o=Math.max(20,Math.round(e.width/28));a.font=`600 ${o}px "Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif`;let s=Pf(r,{canvasWidth:e.width,fontPx:o,measure:e=>a.measureText(e).width});return i.width=e.width,i.height=e.height+s.panelH,a.fillStyle=Af.labelBg,a.fillRect(0,0,i.width,s.panelH),a.strokeStyle=Af.labelBorder,a.lineWidth=2,a.beginPath(),a.moveTo(0,s.panelH-1),a.lineTo(i.width,s.panelH-1),a.stroke(),a.fillStyle=Af.labelText,a.font=`600 ${s.fontPx}px "Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif`,a.textBaseline=`middle`,s.lines.forEach((e,t)=>a.fillText(e,s.pad,s.pad+s.lineHeight*(t+.5))),a.drawImage(e,0,s.panelH),a.drawImage(n,0,s.panelH,e.width,e.height),window.__t4aPngPanel=s,i.toDataURL(`image/png`)}function ie(){if(v=requestAnimationFrame(ie),document.hidden||e.clientWidth<=0||e.clientHeight<=0)return;let n=u.update()===!0;(_||n)&&(F(),t.render(c,l),_=!1)}te();let ae=new ResizeObserver(()=>te());ae.observe(e),v=requestAnimationFrame(ie);function oe(){cancelAnimationFrame(v),ae.disconnect(),u.dispose(),w(),t.dispose(),t.domElement.parentNode===e&&e.removeChild(t.domElement),n.parentNode===e&&e.removeChild(n),delete e.dataset.dimensionOverlay,o=null,a=[]}return{build:k,applyLevel:A,setView:ee,resize:te,render:ne,pngDataUrl:L,setResultMeta:j,pngInfoLines:re,dispose:oe,getDimensionOverlay:()=>o?{status:o.status,unplaced:[...o.unplaced],items:o.items.map(e=>({id:e.id,status:e.status,text:e.text,bandId:e.bandId}))}:null}}var Lf=Object.freeze([`doorH`,`doorW`,`innerH`,`innerW`,`innerL`]),Rf=Object.freeze({"20GP":Object.freeze({doorH:2292,doorW:2340,innerH:2395,innerW:2352,innerL:5900}),"40GP":Object.freeze({doorH:2292,doorW:2340,innerH:2395,innerW:2352,innerL:12032}),"40HC":Object.freeze({doorH:2597,doorW:2340,innerH:2700,innerW:2350,innerL:12032})}),zf=Object.freeze([`20GP`,`40GP`,`40HC`,`custom`]),Bf=Object.freeze({"20GP":`20 呎標準乾貨櫃（20GP）`,"40GP":`40 呎標準乾貨櫃（40GP）`,"40HC":`40 呎高櫃（40HC）`,custom:`自訂`}),Vf=`參考值（Hapag-Lloyd 官方船隊範例，查核日期 2026-10-16）；請以實際貨櫃／船公司提供資料為準。40HC 內寬採官方表格 2350（示意圖 2352 之差異已保留，不宣稱官方展示一致）。`;function Hf(e){let t=Rf[e];return t?{...t}:null}function Uf(e,t){if(e===`custom`)return!0;let n=Rf[e];return!n||!t||typeof t!=`object`?!1:Lf.some(e=>t[e]!==n[e])}function Wf(e){return Hf(e)}function Gf(e,t,n,r=!1){return!zf.includes(n)||n===`custom`?{ok:!1,code:`UNKNOWN_PRESET`,presetKey:e,values:null,overridden:!1,needsConfirm:!1}:Uf(e,t)?r?{ok:!0,presetKey:n,values:Hf(n),overridden:!0,needsConfirm:!0}:{ok:!0,presetKey:e,values:{...t},overridden:!1,needsConfirm:!0}:{ok:!0,presetKey:n,values:Hf(n),overridden:!1,needsConfirm:!1}}function Kf(e){if(!e||typeof e!=`object`)return null;let t={};for(let n of Lf)t[n]=e[n];return t}var qf=15,Jf=[{key:`doorH`,label:`門高 (mm)`},{key:`doorW`,label:`門寬 (mm)`},{key:`innerH`,label:`內高 (mm)`},{key:`innerW`,label:`內寬 (mm)`},{key:`innerL`,label:`內長 (mm)`}],Yf=e=>e.trim()===``?void 0:Number(e);function Xf(e,t={}){if(!e||!e.appendChild)throw Error(`mountContainerUI: host 必須是可容納節點的元素`);let{onCalculate:n,onInvalidate:r,onExport:i}=t,a=`20GP`,o=null,s=[],c=(e,t,n)=>{e.addEventListener(t,n),s.push([e,t,n])},l=document.createElement(`section`);l.id=`containerUi`,l.className=`container-ui`,l.style.minWidth=`0`;let u=document.createElement(`div`);u.className=`container-ui__grid`,u.style.display=`grid`,u.style.gridTemplateColumns=`repeat(auto-fit, minmax(140px, 1fr))`,u.style.gap=`8px`;let d=document.createElement(`label`);d.className=`container-ui__field`,d.style.minWidth=`0`;let f=document.createElement(`span`);f.className=`container-ui__label`,f.textContent=`貨櫃類型`;let p=document.createElement(`select`);p.id=`containerPresetSelect`,p.style.minHeight=`44px`,p.style.minWidth=`0`,p.style.maxWidth=`100%`;for(let e of zf){let t=document.createElement(`option`);t.value=e,t.textContent=Bf[e],p.appendChild(t)}p.value=a,d.append(f,p);let m=document.createElement(`span`);m.id=`containerPresetStatus`,m.className=`container-ui__status`;let h={},g={};for(let{key:e,label:t}of Jf){let n=document.createElement(`label`);n.className=`container-ui__field`,n.style.minWidth=`0`;let r=document.createElement(`span`);r.className=`container-ui__label`,r.style.whiteSpace=`normal`,r.textContent=t;let i=document.createElement(`input`);i.id=`container${e[0].toUpperCase()}${e.slice(1)}Input`,i.type=`number`,i.step=`1`,i.min=`0`,i.style.minHeight=`44px`,i.style.width=`100%`,i.style.boxSizing=`border-box`,h[e]=i,g[e]=n,n.append(r,i),u.appendChild(n)}let _=document.createElement(`label`);_.className=`container-ui__field`,_.style.minWidth=`0`;let v=document.createElement(`span`);v.className=`container-ui__label`,v.textContent=`總箱數 totalBoxes`;let y=document.createElement(`input`);y.id=`containerTotalBoxesInput`,y.type=`number`,y.step=`1`,y.min=`0`,y.style.minHeight=`44px`,y.style.width=`100%`,y.style.boxSizing=`border-box`,_.append(v,y),u.appendChild(_);let b=document.createElement(`label`);b.className=`container-ui__field`,b.style.minWidth=`0`;let x=document.createElement(`span`);x.className=`container-ui__label`,x.textContent=`間距 gapMm (mm)`;let S=document.createElement(`input`);S.id=`containerGapMmInput`,S.type=`number`,S.step=`1`,S.min=`0`,S.value=`0`,S.style.minHeight=`44px`,S.style.width=`100%`,S.style.boxSizing=`border-box`,b.append(x,S),u.appendChild(b);let C=document.createElement(`label`);C.className=`container-ui__field`;let w=document.createElement(`input`);w.id=`containerAllowRotateInput`,w.type=`checkbox`,w.checked=!0;let T=document.createElement(`span`);T.className=`container-ui__label`,T.textContent=`允許板旋轉 allowRotate`,C.append(w,T),u.appendChild(C);let E=document.createElement(`div`);E.className=`container-ui__actions`,E.style.display=`flex`,E.style.flexWrap=`wrap`,E.style.gap=`8px`;let D=document.createElement(`button`);D.id=`containerRestoreBtn`,D.type=`button`,D.textContent=`恢復所選櫃型預設值`,D.style.minHeight=`44px`;let O=document.createElement(`button`);O.id=`containerCalculateBtn`,O.type=`button`,O.textContent=`計算`,O.style.minHeight=`44px`;let k=document.createElement(`button`);k.id=`containerExportBtn`,k.type=`button`,k.textContent=`匯出`,k.disabled=!0,k.style.minHeight=`44px`,E.append(D,O,k);let A=document.createElement(`p`);A.id=`containerSourceNote`,A.className=`container-ui__note`,A.style.overflowWrap=`break-word`,A.textContent=Vf;let j=document.createElement(`div`);j.id=`containerResult`,j.className=`container-ui__result`,j.style.overflowWrap=`break-word`,l.append(d,m,u,E,A,j),e.appendChild(l);let M=()=>Kf({doorH:Yf(h.doorH.value),doorW:Yf(h.doorW.value),innerH:Yf(h.innerH.value),innerW:Yf(h.innerW.value),innerL:Yf(h.innerL.value)}),N=()=>{m.textContent=Uf(a,M())?`已自訂（${Bf[a]||`自訂`}）`:`符合 ${Bf[a]} 預設`,D.disabled=a===`custom`||!Uf(a,M())},P=e=>{for(let{key:t}of Jf)h[t].value=String(e[t])};P(Hf(a)),N();let F=()=>{ee(),typeof r==`function`&&r()};for(let{key:e}of Jf)c(h[e],`input`,()=>{N(),F()});c(y,`input`,F),c(S,`input`,F),c(w,`change`,F),c(p,`change`,()=>{let e=p.value;if(e===`custom`){a=`custom`,N(),F();return}let t=Gf(a,M(),e,!1);if(t.needsConfirm){let t=window.confirm(`切換到「${Bf[e]}」將覆蓋已自訂的五欄數值。是否繼續？（取消則保留目前值與原櫃型）`),n=Gf(a,M(),e,t);if(!n.ok||!n.overridden){p.value=a;return}a=n.presetKey,n.overridden&&P(n.values)}else a=e,P(t.values);N(),F()}),c(D,`click`,()=>{let e=Wf(a);e&&P(e),N(),F()}),c(O,`click`,()=>{typeof n==`function`&&n(I())}),c(k,`click`,()=>{o&&typeof i==`function`&&i(o)});function I(){return{doorH:Yf(h.doorH.value),doorW:Yf(h.doorW.value),innerH:Yf(h.innerH.value),innerW:Yf(h.innerW.value),innerL:Yf(h.innerL.value),totalBoxes:Yf(y.value),gapMm:Yf(S.value),allowRotate:w.checked,boxH:void 0,boxL:void 0,boxW:void 0,palletH:void 0,palletL:void 0,palletW:void 0,userMaxHeight:void 0,layoutA:void 0,layoutB:void 0}}function ee(){o=null,k.disabled=!0,j.textContent=``}function te(e,t){let n=document.createElement(`p`);return n.className=t||`container-ui__line`,n.style.margin=`4px 0`,n.style.overflowWrap=`break-word`,n.textContent=e,n}function ne(e){var t,n,r;if(ee(),!e||typeof e!=`object`)return;if(!e.ok){var i,a,s;let t=e.error||{};j.append(te(`計算錯誤 [${String((i=t.code)==null?`UNKNOWN`:i)}]（stage: ${String((a=t.stage)==null?`unknown`:a)}）`,`container-ui__error`),te(String((s=t.message)==null?`（無訊息）`:s),`container-ui__error`));return}o=e,k.disabled=!1;let c=e.quantities||{};j.append(te(e.noFit?`結果：noFit（容量不足，仍可匯出合法 plan）`:e.unloadedBoxes>0?`結果：部分可行（尚有 ${e.unloadedBoxes} 箱未裝）`:`結果：可行`),te(`需求整板 ${(t=c.fullPallets)==null?e.requiredPallets:t} 板、尾板 ${(n=c.tailBoxes)==null?0:n} 箱（需求共 ${e.requiredPallets} 板）`),te(`已裝板 ${e.loadedPallets} 板 / ${e.loadedBoxes} 箱；未裝板 ${e.unplacedPallets} 板 / 未裝箱 ${e.unloadedBoxes} 箱`),te(`實際最高板高 ${e.maxPlacedPalletHeightMm} mm；每板容量 ${e.capacityPerPallet} 箱；底面容量 ${e.floorCapacity==null?`未搜尋`:`${e.floorCapacity} 板`}`));let l=Array.isArray(e.warnings)?e.warnings:[];l.length>0&&(j.append(te(`警示（${l.length} 條）：`,`container-ui__warn-title`)),l.slice(0,qf).forEach(e=>j.append(te(`• ${String(e)}`,`container-ui__warn`))),l.length>qf&&j.append(te(`…另 ${l.length-qf} 條警示（完整資料保留於 plan.warnings，未丟失）`,`container-ui__warn-more`))),j.append(te((r=e.scopeNote)==null?``:r,`container-ui__scope`))}function re(){for(let[e,t,n]of s)e.removeEventListener(t,n);s.length=0,l.parentNode&&l.parentNode.removeChild(l),o=null}return{readInputs:I,renderPlan:ne,clearResult:ee,destroy:re}}var Zf=1e5,Qf=200,$f=5e3,ep=5e4,tp=5e3,np=e=>typeof e==`number`&&Number.isSafeInteger(e),rp=(e,t,n={})=>({ok:!1,error:{code:e,message:t,...n}});function ip(e){if(!e||typeof e!=`object`)return rp(`INVALID_INPUT`,`輸入必須是含 boxH/palletH/userMaxHeight/doorH/innerH/boxesPerLayer/totalBoxes 的物件`);let{boxH:t,palletH:n,userMaxHeight:r,doorH:i,innerH:a,boxesPerLayer:o,totalBoxes:s}=e,c={boxH:t,palletH:n,userMaxHeight:r,doorH:i,innerH:a,boxesPerLayer:o,totalBoxes:s};for(let[e,t]of Object.entries(c))if(!np(t))return rp(`INVALID_INPUT`,`${e} 必須是有限整數（Number.isSafeInteger），收到 ${String(t)}`);if(t<=0)return rp(`INVALID_INPUT`,`boxH 必須 > 0`);if(n<0)return rp(`INVALID_INPUT`,`palletH 必須 >= 0`);for(let[e,t]of Object.entries({userMaxHeight:r,doorH:i,innerH:a}))if(t<=0)return rp(`INVALID_INPUT`,`${e} 必須 > 0`);if(o<1)return rp(`INVALID_INPUT`,`boxesPerLayer 必須 >= 1`);if(s<0)return rp(`INVALID_INPUT`,`totalBoxes 必須 >= 0`);for(let[e,o]of Object.entries({boxH:t,palletH:n,userMaxHeight:r,doorH:i,innerH:a}))if(o>Zf)return rp(`INPUT_LIMIT_EXCEEDED`,`${e}=${o} 超過尺寸上限 ${Zf} mm`);if(o>$f)return rp(`INPUT_LIMIT_EXCEEDED`,`boxesPerLayer=${o} 超過每層上限 ${$f}`);if(s>ep)return rp(`INPUT_LIMIT_EXCEEDED`,`totalBoxes=${s} 超過總箱上限 ${ep}`);let l=[],u=Math.min(r,i,a),d=u===r?`userMaxHeight`:u===i?`doorH`:`innerH`,f=u-n,p=f>=t?Math.floor(f/t):0,m=p>Qf;m&&(l.push(`可用層 ${p} 超過層數上限，截限為 ${Qf} 層`),p=Qf);let h=o*p;if(h>0&&s>0){let e=Math.ceil(s/h);if(e>tp)return rp(`PALLET_COUNT_EXCEEDS_LIMIT`,`至少需要 ${e} 板，超過板數硬限 ${tp}（每板容量 ${h}）`,{minPalletsRequired:e,maxPallets:tp})}if(h===0)return s>0&&l.push(`高度不足：有效總高 ${u} mm、板高 ${n} mm、淨高 ${f} mm 放不下 1 層 boxH=${t} mm，${s} 箱全部未裝`),{ok:!0,noFit:!0,effectiveLimitsMm:{userMaxHeight:r,doorH:i,innerH:a,palletH:n},effectiveTotalHeightMm:u,limitingFactor:d,netHeightMm:f,availableLayers:p,layerCapApplied:m,capacityPerPallet:0,fullPallets:0,tailBoxes:0,tailFullLayers:0,tailTopLayerBoxes:0,tailLayers:0,tailHeightMm:0,fullPalletHeightMm:n,tailsPartialTopLayer:!1,palletCount:0,placedBoxes:0,unplacedBoxes:s,warnings:l};let g=Math.floor(s/h),_=s%h,v=Math.floor(_/o),y=_%o,b=_>0?v+ +(y>0):0,x=_>0?n+b*t:0,S=n+p*t,C=y>0,w=g+ +(_>0),T=s;C&&l.push(`尾板頂層未滿：${y}/${o} 箱（尾板共 ${b} 層、含板高 ${x} mm），未滿層不冒稱完整平整外緣`);let E={ok:!0,noFit:!1,effectiveLimitsMm:{userMaxHeight:r,doorH:i,innerH:a,palletH:n},effectiveTotalHeightMm:u,limitingFactor:d,netHeightMm:f,availableLayers:p,layerCapApplied:m,capacityPerPallet:h,fullPallets:g,tailBoxes:_,tailFullLayers:v,tailTopLayerBoxes:y,tailLayers:b,tailHeightMm:x,fullPalletHeightMm:S,tailsPartialTopLayer:C,palletCount:w,placedBoxes:T,unplacedBoxes:0,warnings:l};for(let e of Object.keys(E))if(typeof E[e]==`number`&&!Number.isSafeInteger(E[e]))return rp(`INTERNAL_OVERFLOW`,`派生值 ${e}=${E[e]} 非 safe integer`);return E}var ap=1e5,op=200,sp=5e3,cp=5e4,lp=12,up=e=>typeof e==`number`&&Number.isSafeInteger(e),dp=e=>e===0||e===1,fp=e=>typeof e==`number`?`number ${String(e)}`:typeof e,pp=e=>`x=${e.x}, y=${e.y}, w=${e.w}, h=${e.h}`,mp=(e,t,n={})=>({ok:!1,error:{code:e,message:t,...n}});function hp(e,t){let n=Math.min(e.x+e.w,t.x+t.w)-Math.max(e.x,t.x),r=Math.min(e.y+e.h,t.y+t.h)-Math.max(e.y,t.y);return n>0&&r>0}function gp(e,t,n,r){let i=`layout${t}`;if(!Array.isArray(e))return{errors:[`${i} 必須是陣列（實際 ${e===null?`null`:typeof e}）`]};let a=e.length;if(a>sp)return{errors:[`${i} 箱數 ${a} 超過每層上限 ${sp}`]};let o=[],s=Array(a);for(let t=0;t<a;t++){if(!(t in e)){o.push(`${i}[${t}] 稀疏陣列（索引 ${t} 為洞）`);continue}let a=e[t];typeof a!=`object`||!a||Array.isArray(a)?o.push(`${i}[${t}] 必須是箱物件（實際 ${a===null?`null`:typeof a}）`):!up(a.x)||!up(a.y)?o.push(`${i}[${t}].x/y 必須是有限安全整數（實際 x=${String(a.x)}, y=${String(a.y)}）`):!up(a.w)||a.w<=0?o.push(`${i}[${t}].w 必須是正整數（實際 ${String(a.w)}）`):!up(a.h)||a.h<=0?o.push(`${i}[${t}].h 必須是正整數（實際 ${String(a.h)}）`):!up(a.x+a.w)||!up(a.y+a.h)?o.push(`${i}[${t}] x+w / y+h 超出安全整數範圍`):a.x<0||a.y<0?o.push(`${i}[${t}] 負座標越界（${pp(a)}）`):a.x+a.w>n||a.y+a.h>r?o.push(`${i}[${t}] 越界於棧板 ${n}x${r}（${pp(a)}）`):a.rot!==void 0&&!dp(a.rot)?o.push(`${i}[${t}].rot 必須是既有 solver 合法值 0 或 1（實際 ${fp(a.rot)}）`):s[t]=a.rot===void 0?{x:a.x,y:a.y,w:a.w,h:a.h}:{x:a.x,y:a.y,w:a.w,h:a.h,rot:a.rot}}if(o.length>0)return{errors:o.slice(0,lp),errorCount:o.length};let c=s.map((e,t)=>t).sort((e,t)=>s[e].x-s[t].x||s[e].y-s[t].y),l=[];for(let e of c){let t=s[e];for(let n=l.length-1;n>=0;n--){let r=l[n];s[r].x+s[r].w<=t.x?l.splice(n,1):hp(t,s[r])&&o.push(`${i} 重疊：[${r}]（${pp(s[r])}）與 [${e}]（${pp(t)}）`)}if(l.push(e),o.length>0)break}return o.length>0?{errors:o.slice(0,lp),errorCount:o.length}:{boxes:s}}function _p(e){var t,n;if(!e||typeof e!=`object`||Array.isArray(e))return mp(`INVALID_INPUT`,`輸入必須是含 layoutA/layoutB/boxH/palletH/palletL/palletW/boxCount 的物件`);let{layoutA:r,layoutB:i,boxH:a,palletH:o,palletL:s,palletW:c,boxCount:l}=e;if(!Array.isArray(r))return mp(`INVALID_INPUT`,`layoutA 必須是箱陣列（實際 ${r===null?`null`:typeof r}）`);if(!Array.isArray(i))return mp(`INVALID_INPUT`,`layoutB 必須是箱陣列（實際 ${i===null?`null`:typeof i}）`);for(let[e,t]of Object.entries({boxH:a,palletH:o,palletL:s,palletW:c,boxCount:l}))if(!up(t))return mp(`INVALID_INPUT`,`${e} 必須是有限安全整數（Number.isSafeInteger），收到 ${String(t)}`);if(a<=0)return mp(`INVALID_INPUT`,`boxH 必須 > 0`);if(o<0)return mp(`INVALID_INPUT`,`palletH 必須 >= 0`);if(s<=0)return mp(`INVALID_INPUT`,`palletL 必須 > 0`);if(c<=0)return mp(`INVALID_INPUT`,`palletW 必須 > 0`);if(l<0)return mp(`INVALID_INPUT`,`boxCount 必須 >= 0`);for(let[e,t]of Object.entries({boxH:a,palletH:o,palletL:s,palletW:c}))if(t>ap)return mp(`INPUT_LIMIT_EXCEEDED`,`${e}=${t} 超過尺寸上限 ${ap} mm`);if(l>cp)return mp(`INPUT_LIMIT_EXCEEDED`,`boxCount=${l} 超過單板箱數上限 ${cp}`);let u=r.length;if(i.length!==u)return mp(`INVALID_INPUT`,`A/B 箱數必須相等（layoutA ${u} vs layoutB ${i.length}）`,{layoutACount:u,layoutBCount:i.length});if(u>sp)return mp(`INPUT_LIMIT_EXCEEDED`,`每層箱數 ${u} 超過上限 ${sp}`);if(u===0&&l>0)return mp(`INVALID_INPUT`,`layout 為空但 boxCount=${l} > 0：無層可放`);let d=u===0?0:Math.ceil(l/u);if(d>op)return mp(`LAYER_COUNT_EXCEEDED`,`boxCount=${l} 以每層 ${u} 箱需要 ${d} 層，超過層數硬限 ${op}`,{requiredLayers:d,maxLayers:op,perLayerBoxes:u});let f=gp(r,`A`,s,c);if(f.errors)return mp(`LAYOUT_INVALID`,`layoutA 幾何非法：${f.errors.join(`；`)}`,{errors:f.errors,errorCount:(t=f.errorCount)==null?f.errors.length:t});let p=gp(i,`B`,s,c);if(p.errors)return mp(`LAYOUT_INVALID`,`layoutB 幾何非法：${p.errors.join(`；`)}`,{errors:p.errors,errorCount:(n=p.errorCount)==null?p.errors.length:n});let m=[],h={A:f.boxes,B:p.boxes},g=[],_=0,v=new Map;for(let e=0;e<d;e++){let t=e%2==0?`A`:`B`,n=e*u,r=Math.min(u,l-n),i=r<u,s=o+e*a,c=o+(e+1)*a,d={index:e,variant:t,templateRef:t,boxCount:r,fullLayerBoxes:u,partial:i,materialized:!1,zBaseMm:s,zTopMm:c};if(i&&(d.materialized=!0,d.boxes=h[t].slice(0,r),_+=r),e===0)d.support={kind:`pallet`,belowIndex:null,minRatio:1,hasHole:!1,insufficient:!1};else{let n=g[e-1],r=d.materialized?d.boxes:h[t],i=n.materialized?n.boxes:h[n.variant],a;if(d.materialized||n.materialized)a=M(r,i);else{let e=`${t}>${n.variant}`;a=v.get(e),a===void 0&&(a=M(r,i),v.set(e,a))}d.support={kind:`layer`,belowIndex:n.index,belowVariant:n.variant,minRatio:a.minRatio,hasHole:a.hasHole,insufficient:a.insufficient},a.insufficient?m.push(`第 ${e} 層（${t}）對第 ${n.index} 層（${n.variant}）支撐不足：minRatio ${a.minRatio}（最低箱 ${a.minBox?pp(a.minBox):`n/a`}）— 此為幾何評估，非海運安全認證`):a.hasHole&&m.push(`第 ${e} 層（${t}）對第 ${n.index} 層（${n.variant}）有未完全覆蓋處：minRatio ${a.minRatio}（幾何評估，非安全認證）`)}g.push(d)}let y=g.length>0&&g[g.length-1].partial;if(y){let e=g[g.length-1];m.push(`頂層未滿：第 ${e.index} 層（${e.variant}）僅 ${e.boxCount}/${u} 箱（依原 layout 固定順序截取前 ${e.boxCount} 箱），不冒稱全滿或平整外緣`)}l===0&&m.push(`單板 0 箱：無箱層，僅板高`);let b=o+d*a,x={ok:!0,perLayerBoxes:u,boxCount:l,layersRequired:d,boxH:a,palletH:o,palletL:s,palletW:c,templates:h,layers:g,materializedBoxTotal:_,topLayerPartial:y,topLayerBoxes:g.length>0?g[g.length-1].boxCount:0,stackHeightMm:b,warnings:m,scopeNote:`逐層 A/B 與尾板截取為純幾何資料；支撐為幾何評估非安全認證；未做 floor packing/門口通過/貨櫃 xy 配置，不得解讀為已裝櫃。`},S=g.reduce((e,t)=>e+t.boxCount,0);if(S!==l)return mp(`INTERNAL_OVERFLOW`,`層箱數合計 ${S} 不等於 boxCount ${l}`);for(let e of[`boxCount`,`layersRequired`,`stackHeightMm`,`materializedBoxTotal`,`topLayerBoxes`])if(!Number.isSafeInteger(x[e]))return mp(`INTERNAL_OVERFLOW`,`派生值 ${e}=${x[e]} 非 safe integer`);for(let e of g)for(let t of[`zBaseMm`,`zTopMm`])if(!Number.isSafeInteger(e[t]))return mp(`INTERNAL_OVERFLOW`,`派生值 layers[${e.index}].${t}=${e[t]} 非 safe integer`);return x}var vp=1e5,yp=5e3,bp=2e4,xp=e=>typeof e==`number`&&Number.isSafeInteger(e),Sp=(e,t,n={})=>({ok:!1,error:{code:e,message:t,...n}});function Cp(e,t,n){return t>e?0:Math.floor((e+n)/(t+n))}function wp(e,t,n){return e===1?{x:n,y:t}:{x:t,y:n}}function Tp(e,t,n){let{innerL:r,innerW:i,gapMm:a,palletL:o,palletW:s}=t,c=n.has(0),l=n.has(1);if(!c&&!l)return null;let u=wp(0,o,s),d=e===`rows`?u.x:u.y,f=e===`rows`?u.y:u.x,p=e===`rows`?i:r,m=e===`rows`?r:i,h=c?Cp(m,d,a):0,g=0,_=0,v=0;if(l){let t=wp(1,o,s);g=e===`rows`?t.x:t.y,_=e===`rows`?t.y:t.x,v=Cp(m,g,a)}if(h===0&&v===0)return null;let y=null,b=0,x=!1,S=c?Cp(p,f,a):0,C=Math.min(S,bp);for(let e=0;e<=C;e++){if(b>=bp){x=!0;break}b++;let t=0;if(v>0){let n=p+a-e*(f+a);n>=_&&(t=Math.floor(n/(_+a)))}if(e+t===0)continue;let n=e*h+t*v;(!y||n>=y.count)&&(y={count:n,k0:e,k1:t})}return y?{kind:e,count:y.count,ops:b,truncated:x,spec:{k0:y.k0,k1:y.k1,cA:h,cB:v,aStep:d,aDepth:f,bStep:g,bDepth:_}}:null}function Ep(e,t,n,r){let i=[],a=0,o=(e,o,s,c)=>{for(let c=0;c<o;c++){if(i.length>=r)return!1;t===`rows`?i.push({x:c*(s+n.gapMm),y:a,rot:e}):i.push({x:a,y:c*(s+n.gapMm),rot:e})}return a+=c+n.gapMm,!0};for(let t=0;t<e.spec.k0;t++)if(!o(0,e.spec.cA,e.spec.aStep,e.spec.aDepth))return i;for(let t=0;t<e.spec.k1;t++)if(!o(1,e.spec.cB,e.spec.bStep,e.spec.bDepth))return i;return i}function Dp(e,t,n){let r=wp(e,t.palletL,t.palletW),i=Cp(t.innerL,r.x,t.gapMm),a=Cp(t.innerW,r.y,t.gapMm),o=[];outer:for(let s=0;s<a;s++)for(let a=0;a<i;a++){if(o.length>=n)break outer;o.push({x:a*(r.x+t.gapMm),y:s*(r.y+t.gapMm),rot:e})}return o}function Op(e,t,n){let r=new Map,i=t===`strips`;for(let t of e){let e=i?t.x:t.y;r.has(e)||r.set(e,[]),r.get(e).push(t)}let a=e=>{let t=e.reduce((e,t)=>e+t.depth,0),r=n.innerW-t,i=e.length;if(!i)return;let a=r>=(i+1)*n.gapMm,o=a?r/(i+1):(r-(i-1)*n.gapMm)/2,s=0;e.forEach((e,t)=>{let r=Math.round(s+(a?(t+1)*o:o+t*n.gapMm));e.ps.forEach(e=>{e.y=r}),s+=e.depth})};if(i)for(let e of r.values())a(e.sort((e,t)=>e.y-t.y).map(e=>({ps:[e],depth:wp(e.rot,n.palletL,n.palletW).y})));else a([...r.entries()].sort((e,t)=>e[0]-t[0]).map(([,e])=>({ps:e,depth:Math.max(...e.map(e=>wp(e.rot,n.palletL,n.palletW).y))})))}function kp(e,t,n){let{innerL:r,innerW:i,doorW:a,gapMm:o,palletL:s,palletW:c}=t,l=[];for(let t of e){if(!n.has(t.rot))return`rot ${t.rot} 未獲准`;let e=wp(t.rot,s,c);if(!xp(t.x)||!xp(t.y)||t.x<0||t.y<0)return`非法座標`;if(t.x+e.x>r||t.y+e.y>i)return`越出內空`;if(e.y>a)return`朝門橫向 ${e.y} > doorW ${a}`;l.push({x1:t.x,x2:t.x+e.x,y1:t.y,y2:t.y+e.y})}for(let e=0;e<l.length;e++)for(let t=e+1;t<l.length;t++){let n=l[e],r=l[t],i=Math.min(n.x2,r.x2)-Math.max(n.x1,r.x1),a=Math.min(n.y2,r.y2)-Math.max(n.y1,r.y1);if(i>0&&a>0)return`重疊`;let s=Math.max(0,-i),c=Math.max(0,-a);if(Math.max(s,c)<o)return`間距不足（sepX ${s}, sepY ${c} < gap ${o}）`}return null}function Ap(e){if(!e||typeof e!=`object`)return Sp(`INVALID_INPUT`,`輸入必須是含 innerL/innerW/doorW/innerH/doorH/palletL/palletW/stackHeightMm/palletCount/gapMm/allowRotate 的物件`);let{innerL:t,innerW:n,doorW:r,innerH:i,doorH:a,palletL:o,palletW:s,stackHeightMm:c,palletCount:l,gapMm:u,allowRotate:d}=e;for(let[e,d]of Object.entries({innerL:t,innerW:n,doorW:r,innerH:i,doorH:a,palletL:o,palletW:s,stackHeightMm:c,palletCount:l,gapMm:u}))if(!xp(d))return Sp(`INVALID_INPUT`,`${e} 必須是有限整數（Number.isSafeInteger），收到 ${String(d)}`);if(typeof d!=`boolean`)return Sp(`INVALID_INPUT`,`allowRotate 必須顯式提供且為 boolean，收到 ${String(d)}`);for(let[e,c]of Object.entries({innerL:t,innerW:n,doorW:r,innerH:i,doorH:a,palletL:o,palletW:s}))if(c<1)return Sp(`INVALID_INPUT`,`${e} 必須 >= 1`);if(c<0)return Sp(`INVALID_INPUT`,`stackHeightMm 必須 >= 0`);if(u<0)return Sp(`INVALID_INPUT`,`gapMm 必須 >= 0（顯式必填）`);if(l<0)return Sp(`INVALID_INPUT`,`palletCount 必須 >= 0`);for(let[e,l]of Object.entries({innerL:t,innerW:n,doorW:r,innerH:i,doorH:a,palletL:o,palletW:s,stackHeightMm:c,gapMm:u}))if(l>vp)return Sp(`INPUT_LIMIT_EXCEEDED`,`${e}=${l} 超過尺寸上限 ${vp} mm`);if(l>yp)return Sp(`INPUT_LIMIT_EXCEEDED`,`palletCount=${l} 超過板數上限 ${yp}`);let f=[];c===0&&f.push(`stackHeightMm = 0：零高度板貨堆疊不尋常，僅依契約允許`);let p=Math.min(i,a);if(c>p)return T(`高度不足：stackHeightMm ${c} > ${a<i?`doorH`:`innerH`} ${p}（min innerH/doorH），${l} 板全部未裝`);let m=new Set;if(s<=r&&m.add(0),d&&(o<=r?m.add(1):f.push(`rot1 朝門橫向 ${o} > doorW ${r}：旋轉方向被門口寬排除`)),m.size===0)return T(`門口寬不足：rot0 朝門橫向 ${s} > doorW ${r}，且${d?`rot1 朝門橫向 ${o}`:`allowRotate=false 無 rot1 可用`}，${l} 板全部未裝`);m.has(0)||f.push(`rot0 朝門橫向 ${s} > doorW ${r}：rot0 被門口寬排除，僅以 rot1 搜尋`);let h={innerL:t,innerW:n,doorW:r,gapMm:u,palletL:o,palletW:s},g=[],_=0,v=!1;if(m.has(0)){let e=Cp(t,o,u)*Cp(n,s,u);e>0&&g.push({kind:`uniformRot0`,count:e,generator:e=>Dp(0,h,e)})}if(m.has(1)&&o!==s){let e=Cp(t,s,u)*Cp(n,o,u);e>0&&g.push({kind:`uniformRot1`,count:e,generator:e=>Dp(1,h,e)})}for(let e of[`rows`,`strips`]){let t=Tp(e,h,m);t&&(_+=t.ops,t.truncated&&(v=!0),g.push({kind:t.kind,count:t.count,generator:n=>Ep(t,e,h,n)}))}if(g.length===0)return T(`全方向不 fit：板 ${o}×${s}（含 rot1 ${s}×${o}）放不进 ${t}×${n}（gap ${u}），${l} 板全部未裝`);g.sort((e,t)=>t.count-e.count||e.kind.localeCompare(t.kind));let y=g[0],b=Math.min(l,y.count),x=y.generator(b);Op(x,y.kind,h);let S=l-b,C=kp(x,h,m);if(C)return Sp(`INTERNAL_VALIDATION_FAILED`,`選中配置重驗證失敗：${C}`);S>0&&f.push(`容量不足：最佳候選僅容 ${y.count} 板（有限搜尋 best-found，非全域最佳），${S} 板未配置`),v&&f.push(`候選搜尋達固定操作上限 ${bp}（truncated）：結果為 best-found，不保證全域最佳；兩種 uniform baseline 仍保留`);let w={ok:!0,noFit:!1,requestedPallets:l,capacityApplied:b<y.count,truncated:v,bestEffort:v,searchOperations:_,searchOperationCapPerCandidate:bp,allowedRots:[...m],heightLimitMm:p,dims:{innerL:t,innerW:n,doorW:r,innerH:i,doorH:a,palletL:o,palletW:s,stackHeightMm:c,gapMm:u,allowRotate:d},candidates:g.map(e=>({kind:e.kind,count:e.count})),best:{kind:y.kind,count:y.count,bestEffort:v},positions:x,placedPallets:b,unplacedPallets:S,warnings:f,scopeNote:`純底面矩形候選（板貨聯合外框、無外伸）：靜態 fit 不代表叉車轉彎動線/安裝順序可行，不模擬途中旋轉；有限搜尋 best-found 非全域最佳；未宣稱裝櫃箱數/loaded*（整板尾板整合屬 T6b）。`};for(let e of[`placedPallets`,`unplacedPallets`,`searchOperations`])if(!Number.isSafeInteger(w[e]))return Sp(`INTERNAL_OVERFLOW`,`派生值 ${e}=${w[e]} 非 safe integer`);return w.placedPallets+w.unplacedPallets===l?w:Sp(`INTERNAL_OVERFLOW`,`量守恆失敗：${w.placedPallets}+${w.unplacedPallets} != ${l}`);function T(e){return{ok:!0,noFit:!0,reason:e,requestedPallets:l,truncated:!1,bestEffort:!1,searchOperations:0,searchOperationCapPerCandidate:bp,heightLimitMm:p,dims:{innerL:t,innerW:n,doorW:r,innerH:i,doorH:a,palletL:o,palletW:s,stackHeightMm:c,gapMm:u,allowRotate:d},candidates:[],best:null,positions:[],placedPallets:0,unplacedPallets:l,warnings:[e],scopeNote:`純底面矩形候補：無可行配置；未宣稱裝櫃箱數/loaded*。`}}}var jp=5e3,Mp=(e,t,n,r={})=>({ok:!1,error:{code:e,message:t,stage:n,...r}}),Np={note:`local x/y 為板內座標（x 沿 palletL、y 沿 palletW）；rot1 板整體旋轉僅套用於 pose，local 模板不變。renderer 依下列公式換算世界座標（x 沿 innerL、y 沿 innerW），本模組不 materialize 全部世界箱。`,rot0:{xWorld:`pose.x + localX`,yWorld:`pose.y + localY`,wWorld:`w`,hWorld:`h`},rot1:{xWorld:`pose.x + palletW - (localY + h)`,yWorld:`pose.y + localX`,wWorld:`h`,hWorld:`w`},footprint:`rot1 footprint：wWorld=h、hWorld=w（rot0 直接加 w/h）`},Pp=`純整合契約：靜態 fit（底面矩形 + 高度上限），非叉車搬運動線/安裝順序/海運安全認證；底面配置為有限搜尋 best-found 非全域最佳；裝載採明示固定政策（先整板後尾板），非全域最佳箱數；支撐為幾何評估。`;function Fp(e){var t;if(!e||typeof e!=`object`||Array.isArray(e))return Mp(`INVALID_INPUT`,`輸入必須是含 boxH/palletH/userMaxHeight/doorH/innerH/totalBoxes/innerL/innerW/doorW/palletL/palletW/gapMm/allowRotate/layoutA/layoutB 的物件`,`input`);let{boxH:n,palletH:r,userMaxHeight:i,doorH:a,innerH:o,totalBoxes:s,innerL:c,innerW:l,doorW:u,palletL:d,palletW:f,gapMm:p,allowRotate:m,layoutA:h,layoutB:g}=e;if(!Array.isArray(h)||!Array.isArray(g))return Mp(`INVALID_INPUT`,`layoutA/layoutB 必須是箱陣列（實際 layoutA ${h===null?`null`:typeof h}、layoutB ${g===null?`null`:typeof g}）`,`input`);if(h.length!==g.length)return Mp(`INVALID_INPUT`,`layoutA/layoutB 箱數必須相等（${h.length} vs ${g.length}）`,`input`);if(h.length>jp)return Mp(`INPUT_LIMIT_EXCEEDED`,`每層箱數 ${h.length} 超過上限 ${jp}`,`input`);if(`boxesPerLayer`in e&&e.boxesPerLayer!==h.length)return Mp(`INVALID_INPUT`,`boxesPerLayer 由 layoutA.length=${h.length} 推得，不接受矛盾值 ${String(e.boxesPerLayer)}`,`input`);let _=h.length,v=ip({boxH:n,palletH:r,userMaxHeight:i,doorH:a,innerH:o,boxesPerLayer:_,totalBoxes:s});if(!v.ok)return{ok:!1,error:{...v.error,stage:`core`}};let y=_p({layoutA:h,layoutB:g,boxH:n,palletH:r,palletL:d,palletW:f,boxCount:0});if(!y.ok)return{ok:!1,error:{...y.error,stage:`layout`}};if(!y.templates||!Array.isArray(y.templates.A)||!Array.isArray(y.templates.B)||y.templates.A.length!==_||y.templates.B.length!==_)return Mp(`INTERNAL_VALIDATION_FAILED`,`layout 探针 templates 欄位異常`,`layout`);let b=[],x=v.palletCount;if(x===0){var S;let e=Ap({innerL:c,innerW:l,doorW:u,innerH:o,doorH:a,palletL:d,palletW:f,stackHeightMm:0,palletCount:0,gapMm:p,allowRotate:m});return e.ok?(v.noFit&&s>0&&b.push(`高度 noFit：容量 0，${s} 箱全部未裝（不除零、不產板）`),b.push(...((S=v.warnings)==null?[]:S).map(e=>`core: ${e}`)),{ok:!0,noFit:v.noFit,inputs:{boxH:n,palletH:r,userMaxHeight:i,doorH:a,innerH:o,totalBoxes:s,innerL:c,innerW:l,doorW:u,palletL:d,palletW:f,gapMm:p,allowRotate:m},quantities:v,floor:null,floorSearched:!1,floorInput:null,floorCapacity:null,requiredPallets:0,loadedPallets:0,unplacedPallets:0,tailPlaced:!1,maxPlacedPalletHeightMm:0,pallets:[],layerModels:{full:null,tail:null},loadedBoxes:0,unloadedBoxes:s,boxesPerLayer:_,capacityPerPallet:v.capacityPerPallet,worldTransform:Np,warnings:b,scopeNote:Pp}):{ok:!1,error:{...e.error,stage:`floor`}}}b.push(...((t=v.warnings)==null?[]:t).map(e=>`core: ${e}`));let C=v.fullPallets>0?v.fullPalletHeightMm:v.tailHeightMm,w=Ap({innerL:c,innerW:l,doorW:u,innerH:o,doorH:a,palletL:d,palletW:f,stackHeightMm:C,palletCount:x,gapMm:p,allowRotate:m});if(!w.ok)return{ok:!1,error:{...w.error,stage:`floor`}};b.push(...w.warnings);let T={full:null,tail:null};if(v.fullPallets>0){var E;let e=_p({layoutA:h,layoutB:g,boxH:n,palletH:r,palletL:d,palletW:f,boxCount:v.capacityPerPallet});if(!e.ok)return{ok:!1,error:{...e.error,stage:`layers`}};T.full=e,b.push(...((E=e.warnings)==null?[]:E).map(e=>`layers(full): ${e}`))}if(v.tailBoxes>0){var D;let e=_p({layoutA:h,layoutB:g,boxH:n,palletH:r,palletL:d,palletW:f,boxCount:v.tailBoxes});if(!e.ok)return{ok:!1,error:{...e.error,stage:`layers`}};T.tail=e,b.push(...((D=e.warnings)==null?[]:D).map(e=>`layers(tail): ${e}`))}let O=w.best?w.best.count:0,k=Math.min(v.fullPallets,O),A=v.tailBoxes>0&&k===v.fullPallets&&O>v.fullPallets,j=k+ +!!A,M=x-j,N=k*v.capacityPerPallet+(A?v.tailBoxes:0),P=s-N;v.tailBoxes>0&&!A&&k<v.fullPallets?b.push(`底面僅容 ${O} 板：整板未全配置，尾板不放（明示政策：先整板後尾板，非全域最佳箱數拆分）`):v.tailBoxes>0&&!A&&v.fullPallets>0?b.push(`底面僅容 ${O} 板：整板全配置但無額外 slot，尾板不放（明示政策，非全域最佳）`):v.tailBoxes>0&&!A&&b.push(`底面無可放入位置（capacity 0）：尾板不放（明示政策，非全域最佳）`),w.noFit&&b.push(`floor noFit：${w.best===null?`無可行底面配置`:`高度/門口不足`}，${x} 板全部未裝`),w.bestEffort&&b.push(`底面配置為有限搜尋 best-found，非全域最佳`);let F=[],I=0;for(let e=0;e<k;e++){let e=w.positions[I++];F.push({kind:`full`,pose:{x:e.x,y:e.y,rot:e.rot},heightMm:v.fullPalletHeightMm,boxCount:v.capacityPerPallet,layerModelRef:`full`})}if(A){let e=w.positions[I++];F.push({kind:`tail`,pose:{x:e.x,y:e.y,rot:e.rot},heightMm:v.tailHeightMm,boxCount:v.tailBoxes,layerModelRef:`tail`})}if(N+P!==s)return Mp(`INTERNAL_OVERFLOW`,`箱守恆失敗：${N}+${P} != ${s}`,`internal`);if(j+M!==x)return Mp(`INTERNAL_OVERFLOW`,`板守恆失敗：${j}+${M} != ${x}`,`internal`);let ee=F.reduce((e,t)=>e+t.boxCount,0);return ee===N?I>w.positions.length?Mp(`INTERNAL_OVERFLOW`,`板 pose 索引超出 floor positions`,`internal`):{ok:!0,noFit:v.noFit||w.noFit,inputs:{boxH:n,palletH:r,userMaxHeight:i,doorH:a,innerH:o,totalBoxes:s,innerL:c,innerW:l,doorW:u,palletL:d,palletW:f,gapMm:p,allowRotate:m},quantities:v,floor:w,floorSearched:!0,floorInput:{stackHeightMm:C,palletCount:x},floorCapacity:O,requiredPallets:x,loadedPallets:j,unplacedPallets:M,tailPlaced:A,maxPlacedPalletHeightMm:F.length>0?Math.max(...F.map(e=>e.heightMm)):0,pallets:F,layerModels:T,loadedBoxes:N,unloadedBoxes:P,boxesPerLayer:_,capacityPerPallet:v.capacityPerPallet,worldTransform:Np,warnings:b,scopeNote:Pp}:Mp(`INTERNAL_OVERFLOW`,`逐板 boxCount 合計 ${ee} != loadedBoxes ${N}`,`internal`)}var Ip=[`doorH`,`doorW`,`innerH`,`innerW`,`innerL`,`totalBoxes`,`gapMm`,`allowRotate`],Lp=(e,t,n=`input`)=>({ok:!1,error:{code:e,message:t,stage:n}}),Rp=e=>e&&typeof e==`object`&&!Array.isArray(e);function zp(e,t,n){if(!Rp(e))return Lp(`INVALID_CONTAINER_FIELDS`,`貨櫃輸入必須是物件（container-ui readInputs 的輸出）。`,`input`);if(!Rp(t))return Lp(`INVALID_MAIN_INPUTS`,`主尺寸輸入必須是物件（main readInputs 的輸出）。`,`input`);if(!Rp(n))return Lp(`NO_PALLET_RESULT`,`尚未計算出有效的棧板排法。請先按「計算最佳排法」產生棧板布局，再按貨櫃區「計算」進行裝櫃計算。`,`input`);let r=null,i=null;if(n.layerPattern===`AB`&&Rp(n.layouts)&&Array.isArray(n.layouts.A)&&Array.isArray(n.layouts.B))r=n.layouts.A,i=n.layouts.B;else if(Array.isArray(n.layout))r=n.layout,i=n.layout;else return Lp(`NO_PALLET_LAYOUT`,`目前棧板結果缺少可用的單層布局（layout/layouts）。請重新計算棧板後再計算裝櫃。`,`input`);if(r.length===0||i.length===0)return Lp(`EMPTY_PALLET_LAYOUT`,`目前棧板布局為空（0 箱/層），無法作為裝櫃的每層模板。請調整紙箱/棧板尺寸或層高後重新計算棧板。`,`input`);let a={};for(let t of Ip)a[t]=e[t];return a.boxH=t.boxH,a.palletH=t.palletH,a.palletL=t.palletL,a.palletW=t.palletW,a.userMaxHeight=t.maxTotalH,a.layoutA=r,a.layoutB=i,{ok:!0,input:a}}var Bp=1e4,Vp=5e3,Hp=e=>typeof e==`number`&&Number.isSafeInteger(e),Up=(e,t,n={})=>({ok:!1,error:{code:e,message:t,...n}});function Wp(e,t,n){if(!e||typeof e!=`object`||Array.isArray(e))return null;let r={};for(let n of t){if(!Hp(e[n]))return null;r[n]=e[n]}return r}function Gp(e,t={}){if(!t||typeof t!=`object`||Array.isArray(t))return Up(`INVALID_OPTIONS`,`options 必須是物件`);let{maxBoxes:n=1e4,selectedPallet:r=null,selectedLayer:i=null}=t;if(!e||typeof e!=`object`||Array.isArray(e))return Up(`INVALID_PLAN`,`plan 必須是 buildContainerPlan 的 ok:true 結果物件`);if(e.ok!==!0)return Up(`INVALID_PLAN`,`plan 必須是已驗證成功結果（ok === true），實際 ok=${String(e.ok)}`);let a=Wp(e.inputs,[`innerL`,`innerW`,`innerH`,`doorW`,`doorH`,`boxH`,`palletL`,`palletW`],`inputs`);if(!a)return Up(`INVALID_PLAN`,`plan.inputs 缺少或非法 innerL/innerW/innerH/doorW/doorH/boxH/palletL/palletW（safe 整數）`);if(!Array.isArray(e.pallets))return Up(`INVALID_PLAN`,`plan.pallets 必須是陣列`);if(e.pallets.length>Vp)return Up(`RENDER_LIMIT_EXCEEDED`,`板數 ${e.pallets.length} 超過渲染硬限 ${Vp}`);if(!e.layerModels||typeof e.layerModels!=`object`)return Up(`INVALID_PLAN`,`plan.layerModels 必須是 { full, tail } 物件`);if(!Hp(n)||n<=0||n>Bp)return Up(`INVALID_OPTIONS`,`maxBoxes 必須是 1..${Bp} 的安全整數（實際 ${typeof n==`number`?String(n):typeof n}）`);if(r!==null&&(!Hp(r)||r<0||r>=e.pallets.length))return Up(`INVALID_SELECTOR`,`selectedPallet 必須是 null 或 0-based 板索引 0..${e.pallets.length-1}（實際 ${String(r)}）`);if(i!==null&&(!Hp(i)||i<0))return Up(`INVALID_SELECTOR`,`selectedLayer 必須是 null 或 0-based 層索引（實際 ${String(i)}）`);let o=[];for(let t=0;t<e.pallets.length;t++){let n=e.pallets[t];if(!n||typeof n!=`object`||Array.isArray(n))return Up(`INVALID_PLAN`,`plan.pallets[${t}] 必須是板物件`);if(n.kind!==`full`&&n.kind!==`tail`)return Up(`INVALID_PLAN`,`plan.pallets[${t}].kind 必須是 'full' 或 'tail'（實際 ${String(n.kind)}）`);let r=Wp(n.pose,[`x`,`y`,`rot`],`pallets[${t}].pose`);if(!r||r.rot!==0&&r.rot!==1)return Up(`INVALID_PLAN`,`plan.pallets[${t}].pose 必須含 safe 整數 x/y 與 rot 0/1`);if(!Hp(n.heightMm)||n.heightMm<0)return Up(`INVALID_PLAN`,`plan.pallets[${t}].heightMm 必須是 >=0 safe 整數`);if(!Hp(n.boxCount)||n.boxCount<0)return Up(`INVALID_PLAN`,`plan.pallets[${t}].boxCount 必須是 >=0 safe 整數`);if(n.layerModelRef!==`full`&&n.layerModelRef!==`tail`)return Up(`INVALID_PLAN`,`plan.pallets[${t}].layerModelRef 必須是 'full' 或 'tail'`);let i=e.layerModels[n.layerModelRef];if(!i||typeof i!=`object`||!Array.isArray(i.layers)||!i.templates||typeof i.templates!=`object`||!Hp(i.boxH)||!Hp(i.palletL)||!Hp(i.palletW))return Up(`INVALID_PLAN`,`plan.layerModels.${n.layerModelRef} 缺失或欄位異常（需 layers/templates/boxH/palletL/palletW）`);o.push({index:t,pallet:n,pose:r,model:i})}let s=[],c=0,l=0;for(let e of o){if(r!==null&&e.index!==r)continue;let t=[];for(let n of e.model.layers){if(!n||typeof n!=`object`)return Up(`INVALID_PLAN`,`layerModels.${e.pallet.layerModelRef}.layers 含非法層物件`);if(!Hp(n.index)||!Hp(n.boxCount)||!Hp(n.zBaseMm))return Up(`INVALID_PLAN`,`layerModels.${e.pallet.layerModelRef}.layers[${n===null?`?`:n.index}] 缺 index/boxCount/zBaseMm safe 整數`);if(i!==null&&n.index!==i)continue;let r;if(n.partial){if(!Array.isArray(n.boxes)||n.boxes.length!==n.boxCount)return Up(`INVALID_PLAN`,`partial 層 ${n.index} 的 materialized boxes 缺失或箱數 ${n.boxes?n.boxes.length:`n/a`} != boxCount ${n.boxCount}`);r=n.boxes}else{let t=n.templateRef;if(r=e.model.templates[t],!Array.isArray(r)||r.length!==n.boxCount)return Up(`INVALID_PLAN`,`完整層 ${n.index} 的 templateRef '${String(t)}' 找不到 templates 或箱數不符`)}t.push({layer:n,boxes:r}),c+=n.boxCount,l+=1}s.push({...e,layers:t})}let u=[],d=[],f=0,p=c>n,m=0;for(let e of s){let{pose:t,model:r,pallet:i}=e,a=t.rot===1,o={palletIndex:e.index,kind:i.kind,pose:{x:t.x,y:t.y,rot:t.rot},footprint:{x:t.x,y:t.y,w:a?r.palletW:r.palletL,d:a?r.palletL:r.palletW},heightMm:i.heightMm,boxCount:i.boxCount,layersSelected:e.layers.length,layersRendered:0,renderedBoxCount:0};u.push(o);for(let{layer:i,boxes:s}of e.layers){if(f>=n)break;let c=!1;for(let l=0;l<s.length&&!(f>=n);l++){let n=s[l];if(!n||typeof n!=`object`)return Up(`INVALID_PLAN`,`templates/materialized 箱 ${l} 非法`);if(!Hp(n.x)||!Hp(n.y)||!Hp(n.w)||!Hp(n.h))return Up(`INVALID_PLAN`,`templates/materialized 箱 ${l} 缺 safe 整數 x/y/w/h`);if(n.rot!==void 0&&n.rot!==0&&n.rot!==1)return Up(`INVALID_PLAN`,`templates/materialized 箱 ${l}.rot 必須是 0/1（實際 ${String(n.rot)}）`);let u=n.rot===void 0?0:n.rot,p,m,h,g,_;a?(p=t.x+r.palletW-(n.y+n.h),m=t.y+n.x,h=n.h,g=n.w,_=(u+1)%2):(p=t.x+n.x,m=t.y+n.y,h=n.w,g=n.h,_=u),d.push({palletIndex:e.index,layerIndex:i.index,variant:i.variant,x:p,y:m,z:i.zBaseMm,w:h,d:g,h:r.boxH,rot:_,boxIndex:l}),f+=1,o.renderedBoxCount+=1,c=!0}c&&(m+=1,o.layersRendered+=1)}}let h={ok:!0,container:{innerL:a.innerL,innerW:a.innerW,innerH:a.innerH,doorW:a.doorW,doorH:a.doorH},pallets:u,boxes:d,stats:{totalBoxes:c,renderedBoxes:f,truncated:p,maxBoxes:n,palletsRendered:u.length,layersRendered:m,layersSelected:l,planTotalBoxes:Hp(e.loadedBoxes)?e.loadedBoxes:null},filters:{selectedPallet:r,selectedLayer:i},notes:[]};if(i!==null&&h.notes.push(`selectedLayer=${i}：超出該板層數的板貢獻 0 箱（合法 selector，非錯誤）`),p&&h.notes.push(`篩選總箱數 ${c} 超過 maxBoxes ${n}：僅渲染前 ${f} 箱`),h.stats.renderedBoxes!==d.length)return Up(`INTERNAL_OVERFLOW`,`renderedBoxes ${h.stats.renderedBoxes} != boxes.length ${d.length}`);for(let e of[`totalBoxes`,`renderedBoxes`,`palletsRendered`,`layersRendered`,`layersSelected`])if(!Number.isSafeInteger(h.stats[e]))return Up(`INTERNAL_OVERFLOW`,`stats.${e} 非 safe integer`);try{JSON.stringify(h)}catch{return Up(`INTERNAL_OVERFLOW`,`渲染結果不可 JSON 序列化`)}return h}var Kp=e=>typeof e==`number`&&Number.isSafeInteger(e);function qp(e){if(!e||typeof e!=`object`||Array.isArray(e))return null;let t=e.inputs?e.inputs.palletH:void 0;return!Kp(t)||t<0?null:t}function Jp(e,t){let n=e.container,r=e.stats,i=[];if(i.push(`櫃內尺寸：長 ${n.innerL} mm × 寬 ${n.innerW} mm × 高 ${n.innerH} mm`),i.push(`門框尺寸：寬 ${n.doorW} mm × 高 ${n.doorH} mm（藍色，位於櫃長端中央）`),t&&typeof t==`object`){let e=Kp(t.inputs&&t.inputs.totalBoxes)?t.inputs.totalBoxes:null,n=Kp(t.loadedBoxes)?t.loadedBoxes:r.planTotalBoxes;e!==null&&n!==null?i.push(`箱數：需求 ${e} 箱、已裝 ${n} 箱、未裝 ${e-n} 箱`):n!==null&&i.push(`箱數：已裝 ${n} 箱（需求不明）`)}let a=0,o=0;for(let t of e.pallets)t.kind===`tail`?o+=1:a+=1;i.push(`板：整板 ${a} 板、尾板 ${o} 板（尾板以不同板色區辨）`);let s=e.filters.selectedPallet,c=e.filters.selectedLayer,l=s===null?`全部板`:`第 ${s+1} 板`,u=c===null?`全部層`:`第 ${c+1} 層`;return i.push(`篩選：${l}／${u}；篩選應有 ${r.totalBoxes} 箱、實際繪製 ${r.renderedBoxes} 箱`),r.truncated&&i.push(`截限警示：篩選箱數超過上限 ${r.maxBoxes}，僅繪製前 ${r.renderedBoxes} 箱，其餘未顯示`),i.push(`注意：本畫面為幾何配置示意，不保證搬運動線、安裝順序或海運承壓安全。`),i}function Yp(e,t,n){let r=[];for(let i of String(e).split(`
`)){let e=``;for(let a of Array.from(i)){let i=e+a;e&&n(i)>t?(r.push(e),e=a):e=i}r.push(e)}return r}function Xp(e,t={}){let{padding:n=16,lineHeight:r=22,minPanelWidth:i=320}=t,a=t.measure||(e=>e.length*13),o=0;for(let t of e)o=Math.max(o,a(t));return{width:Math.max(i,o+2*n),height:e.length*r+2*n,padding:n,lineHeight:r}}function Zp(e,t,n,r=1.1){if(!(e>0)||!(t>0)||!(n>0)||!(r>=1))return null;let i=t*Math.PI/360,a=Math.atan(Math.tan(i)*n);return e/Math.sin(Math.min(i,a))*r}function Qp(e){switch(e){case`iso`:return{dir:[1,1,1],up:[0,1,0]};case`top`:return{dir:[0,1,0],up:[0,0,-1]};case`front`:return{dir:[1,.15,0],up:[0,1,0]};default:return null}}function $p(e){if(!e||typeof e!=`object`||Array.isArray(e))return null;let t=e.innerL,n=e.innerW;return!Kp(t)||!Kp(n)||t<=0||n<=0?null:[t/2e3,0,n/2e3]}function em(){let e=!1;return{get destroyed(){return e},markDestroyed(){let t=e;return e=!0,t},guard(){return e?{ok:!1,error:{code:`DESTROYED`,message:`場景已銷毀，請重新建立檢視器`}}:null}}}function tm(e){if(!e||typeof e.traverse!=`function`)return;let t=new Set;e.traverse(e=>{if(e.material){let n=Array.isArray(e.material)?e.material:[e.material];for(let e of n)e.map&&(e.map.dispose(),e.map=null),t.has(e)||(t.add(e),e.dispose())}e.geometry&&!t.has(e.geometry)&&(t.add(e.geometry),e.geometry.dispose()),e.isInstancedMesh&&!t.has(e)&&typeof e.dispose==`function`&&(t.add(e),e.dispose())})}var nm=1/1e3,rm={bg:16053490,floor:14211284,frame:3815994,door:1988310,boxA:13207359,boxB:6262724,palletFull:9072461,palletTail:11551038,outline:2500134},im=(e,t)=>({ok:!1,error:{code:e,message:t}});function am(e){if(!e||typeof e.appendChild!=`function`)throw TypeError(`createContainerScene：host 必須是 DOM 元素`);e.classList.add(`container-scene-host`),e.style.minWidth=`0`;let t=document.createElement(`div`);t.className=`container-scene-canvas`,t.style.cssText=`width:100%;min-width:0;height:max(300px, min(62vh, 480px));position:relative;`;let n=document.createElement(`div`);n.className=`container-scene-meta`,n.style.cssText=`font-size:13px;line-height:1.5;color:#222;min-width:0;word-break:break-word;`;let r=document.createElement(`div`);r.className=`container-scene-legend`,r.style.cssText=`display:flex;flex-wrap:wrap;gap:8px 14px;font-size:12px;margin-top:6px;min-width:0;`,e.appendChild(t),e.appendChild(n),e.appendChild(r);let i=[[`箱 A`,rm.boxA],[`箱 B`,rm.boxB],[`整板`,rm.palletFull],[`尾板`,rm.palletTail],[`門框`,rm.door]];for(let[e,t]of i){let n=document.createElement(`span`);n.className=`container-scene-legend-item`;let i=document.createElement(`span`);i.style.cssText=`display:inline-block;width:12px;height:12px;margin-right:5px;background:#${t.toString(16).padStart(6,`0`)};vertical-align:middle;`;let a=document.createElement(`span`);a.textContent=e,n.appendChild(i),n.appendChild(a),r.appendChild(n)}let a=!1,o=null,s=null,c=null,l=null;try{o=new kd({antialias:!0,preserveDrawingBuffer:!0}),o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.setClearColor(rm.bg),t.appendChild(o.domElement),o.domElement.style.cssText=`width:100%;height:100%;display:block;touch-action:none;`,s=new Tr,c=new Us(50,1,.05,500),l=new Bd(c,o.domElement),l.enableDamping=!1,l.touches={ONE:de.ROTATE,TWO:de.DOLLY_PAN},s.add(new js(16777215,9079434,1.1));let e=new Ks(16777215,.7);e.position.set(6,10,4),s.add(e)}catch{a=!0,n.textContent=`無法初始化 WebGL 3D 場景：此瀏覽器不支援或被封鎖。貨櫃尺寸與棧板計算不受影響。`}let u=null,d=null,f={},p=null,m=`iso`,h=1,g=new K,_=null,v=null,y=em();function b(){u&&(s&&(s.remove(u),tm(u)),u=null)}function x(e,t){b(),u=new _r;let n=e.container,r=new Ui(new Yo(n.innerL*nm,n.innerW*nm),new ss({color:rm.floor}));r.rotation.x=-Math.PI/2;let i=$p(n);i&&r.position.set(i[0],i[1],i[2]),u.add(r);let a=n.innerL*nm,o=n.innerW*nm,c=n.innerH*nm,l=[],d=[[0,0,0],[a,0,0],[a,0,o],[0,0,o]];for(let e=0;e<4;e++){let t=d[e],n=d[(e+1)%4];l.push(t[0],0,t[2],n[0],0,n[2]),l.push(t[0],c,t[2],n[0],c,n[2]),l.push(t[0],0,t[2],t[0],c,t[2])}let f=new yi;f.setAttribute(`position`,new si(l,3)),u.add(new va(f,new oa({color:rm.frame})));let p=(n.innerW-n.doorW)/2*nm,m=(n.innerW+n.doorW)/2*nm,_=n.doorH*nm,v=a,y=a-.06,x=[],S=e=>{x.push(e,0,p,e,0,m,e,0,m,e,_,m,e,_,m,e,_,p,e,_,p,e,0,p)};S(v),S(y),x.push(v,0,p,y,0,p,v,0,m,y,0,m,v,_,m,y,_,m,v,_,p,y,_,p);let C=new yi;C.setAttribute(`position`,new si(x,3)),u.add(new va(C,new oa({color:rm.door,linewidth:2})));let w=qp(t),T=new Map,E=new ss({color:rm.palletFull}),D=new ss({color:rm.palletTail});for(let t of e.pallets){let e=t.footprint,n=`${e.w}x${e.d}x${w===null?`flat`:w}`,r=T.get(n);r||(r=w===null||w===0?new Yo(e.w*nm,e.d*nm):new Ca(e.w*nm,w*nm,e.d*nm),T.set(n,r));let i=new Ui(r,t.kind===`tail`?D:E);(w===null||w===0)&&(i.rotation.x=-Math.PI/2),i.position.set((e.x+e.w/2)*nm,w===null||w===0?.001:w/2*nm,(e.y+e.d/2)*nm),u.add(i)}let O={A:[],B:[]};for(let t of e.boxes)O[t.variant===`B`||t.variant===`b`||t.variant===1?`B`:`A`].push(t);let k=new Ca(1,1,1),A=new ss({color:rm.boxA}),j=new ss({color:rm.boxB}),M=new Un;for(let[e,t]of[[`A`,A],[`B`,j]]){let n=O[e];if(!n.length)continue;let r=new ta(k,t,n.length);n.forEach((e,t)=>{M.makeScale(e.w*nm,e.h*nm,e.d*nm),M.setPosition((e.x+e.w/2)*nm,(e.z+e.h/2)*nm,(e.y+e.d/2)*nm),r.setMatrixAt(t,M)}),r.instanceMatrix.needsUpdate=!0,u.add(r)}let N=e.boxes.length;if(N>0){let t=new Float32Array(N*24*3),n=0;for(let r of e.boxes){let e=r.x*nm,i=(r.x+r.w)*nm,a=r.z*nm,o=(r.z+r.h)*nm,s=r.y*nm,c=(r.y+r.d)*nm,l=[[e,a,s],[i,a,s],[i,a,c],[e,a,c],[e,o,s],[i,o,s],[i,o,c],[e,o,c]];for(let[e,r]of[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]])t[n++]=l[e][0],t[n++]=l[e][1],t[n++]=l[e][2],t[n++]=l[r][0],t[n++]=l[r][1],t[n++]=l[r][2]}let r=new yi;r.setAttribute(`position`,new ii(t,3)),u.add(new va(r,new oa({color:rm.outline})))}s.add(u);let P=n.innerH*nm;for(let t of e.pallets)P=Math.max(P,(t.heightMm||0)*nm);for(let t of e.boxes)P=Math.max(P,(t.z+t.h)*nm);g.set(a/2,P/2,o/2),h=.5*Math.sqrt(a*a+o*o+P*P)+.05}function S(e=!0){if(a)return;let t=Qp(m)||Qp(`iso`),n=c.aspect||1,r=e?Zp(h,c.fov,n)||h*3:c.position.distanceTo(l.target);l.target.copy(g);let i=new K(t.dir[0],t.dir[1],t.dir[2]).normalize();c.up.set(t.up[0],t.up[1],t.up[2]),c.position.copy(g).addScaledVector(i,r),c.near=Math.max(.01,r/100),c.far=r*10+h*10,c.updateProjectionMatrix(),l.update()}function C(){!a&&o&&s&&o.render(s,c)}function w(e,t){n.textContent=``;for(let r of Jp(e,t)){let e=document.createElement(`div`);e.className=`container-scene-line`,e.textContent=r,n.appendChild(e)}}function T(){let e=Math.max(1,t.clientWidth),n=Math.max(1,t.clientHeight);o.setSize(e,n,!1),c.aspect=e/n,c.updateProjectionMatrix()}function E(e,t={}){let n=y.guard();if(n)return n;if(a)return im(`WEBGL_UNAVAILABLE`,`WebGL 場景不可用`);if(!t||typeof t!=`object`||Array.isArray(t))return im(`INVALID_OPTIONS`,`options 必須是物件`);let r=Gp(e,{maxBoxes:t.maxBoxes===void 0?1e4:t.maxBoxes,selectedPallet:null,selectedLayer:null});return r.ok?(d=e,f={maxBoxes:r.stats.maxBoxes},p=r,m=`iso`,x(r,e),T(),S(!0),w(r,e),C(),{ok:!0,container:r.container,stats:r.stats,filters:r.filters,notes:r.notes}):r}function D(e={}){let t=y.guard();if(t)return t;if(a)return im(`WEBGL_UNAVAILABLE`,`WebGL 場景不可用`);if(!d)return im(`NO_PLAN`,`尚未設定 plan，請先 setPlan`);if(!e||typeof e!=`object`||Array.isArray(e))return im(`INVALID_OPTIONS`,`filter 必須是物件`);let n=Gp(d,{maxBoxes:f.maxBoxes,selectedPallet:e.selectedPallet===void 0?null:e.selectedPallet,selectedLayer:e.selectedLayer===void 0?null:e.selectedLayer});return n.ok?(p=n,x(n,d),S(!0),w(n,d),C(),{ok:!0,stats:n.stats,filters:n.filters,notes:n.notes}):n}function O(e){return y.guard()||(a?im(`WEBGL_UNAVAILABLE`,`WebGL 場景不可用`):Qp(e)?(m=e,u&&(S(!0),C()),{ok:!0,view:e}):im(`INVALID_VIEW`,`view 必須是 'iso' | 'top' | 'front'（實際 ${String(e)}）`))}function k(){return y.guard()||(a?im(`WEBGL_UNAVAILABLE`,`WebGL 場景不可用`):(b(),d=null,f={},p=null,n.textContent=``,C(),{ok:!0}))}async function A(){let e=y.guard();if(e)return e;if(a)return im(`WEBGL_UNAVAILABLE`,`WebGL 場景不可用`);if(!p||!u)return im(`NO_PLAN`,`目前無 plan，無法匯出 PNG`);C();let t=o.domElement,n=Jp(p,d),r=`14px "Microsoft JhengHei", sans-serif`,i=document.createElement(`canvas`).getContext(`2d`);i.font=r;let s=e=>i.measureText(e).width,c=[];for(let e of n)c.push(...Yp(e,Math.max(240,t.width-32),s));let l=Xp(c,{padding:16,lineHeight:22,minPanelWidth:t.width,measure:s}),f=document.createElement(`canvas`);f.width=Math.max(t.width,l.width),f.height=t.height+l.height;let m=f.getContext(`2d`);m.fillStyle=`#f4f4f2`,m.fillRect(0,0,f.width,f.height),m.drawImage(t,0,0),m.fillStyle=`#ffffff`,m.fillRect(0,t.height,f.width,l.height),m.fillStyle=`#222222`,m.font=r,m.textBaseline=`top`,c.forEach((e,n)=>{m.fillText(e,l.padding,t.height+l.padding+n*l.lineHeight)});let h=await new Promise(e=>f.toBlob(e,`image/png`));return h?{ok:!0,blob:h,width:f.width,height:f.height}:im(`PNG_EXPORT_FAILED`,`PNG 匯出失敗（canvas.toBlob 回傳 null）`)}function j(){if(!y.markDestroyed()){try{_&&_.disconnect()}catch{}_=null;try{v&&l&&l.removeEventListener(`change`,v)}catch{}v=null;try{l&&l.dispose()}catch{}l=null;try{s&&tm(s)}catch{}u=null;try{if(o){o.dispose();try{o.forceContextLoss()}catch{}o.domElement&&o.domElement.parentNode&&o.domElement.parentNode.removeChild(o.domElement)}}catch{}o=null,s=null,c=null;try{for(let e of[t,n,r])e.parentNode&&e.parentNode.removeChild(e)}catch{}d=null,f={},p=null}}return a||(v=()=>C(),l.addEventListener(`change`,v),_=new ResizeObserver(()=>{o&&!y.destroyed&&(T(),u&&S(!0),C())}),_.observe(t)),{setPlan:E,clear:k,setView:O,setFilter:D,exportPng:A,destroy:j}}function om(e){if(e===`all`||e===``||e==null)return{ok:!0,index:null};let t;if(typeof e==`number`)t=e;else if(typeof e==`string`){let n=e.trim();if(n===``||!/^-?\d+$/.test(n))return{ok:!1,message:`篩選選擇「${e}」不是有效的選擇值`};t=Number(n)}else return{ok:!1,message:`篩選選擇類型非法（${typeof e}）`};return!Number.isSafeInteger(t)||t<0||t>1e6?{ok:!1,message:`篩選選擇必須是 0 起算的非負整數（實際 ${String(e)}）`}:{ok:!0,index:t}}function sm(e){if(!e||typeof e!=`object`||Array.isArray(e))return 0;let t=e.layerModels;if(!t||typeof t!=`object`||Array.isArray(t)||!Array.isArray(e.pallets))return 0;let n=0;for(let r of e.pallets){if(!r||typeof r!=`object`)continue;let e=r.layerModelRef;if(e!==`full`&&e!==`tail`)continue;let i=t[e];if(i&&typeof i==`object`&&Array.isArray(i.layers))for(let e of i.layers)e&&typeof e==`object`&&Number.isSafeInteger(e.index)&&e.index+1>n&&(n=e.index+1)}return n}function cm(e){let t=[{value:`all`,label:`全部板`}],n=e&&Array.isArray(e.pallets)?e.pallets:[];for(let e=0;e<n.length;e++){let r=n[e]&&n[e].kind===`tail`?`尾板`:`整板`;t.push({value:String(e),label:`第 ${e+1} 板（${r}）`})}return t}function lm(e){let t=[{value:`all`,label:`全部層`}];if(!Number.isSafeInteger(e)||e<=0)return t;for(let n=0;n<e;n++)t.push({value:String(n),label:`第 ${n+1} 層`});return t}var um={WEBGL_UNAVAILABLE:`WebGL 不可用`,INVALID_HOST:`host 非法`,INVALID_PLAN:`plan 非法`,INVALID_OPTIONS:`options 非法`,INVALID_SELECTOR:`篩選選擇非法`,INVALID_VIEW:`視角非法`,RENDER_LIMIT_EXCEEDED:`超出渲染限制`,EXPORT_FAILED:`PNG 匯出失敗`,PNG_EXPORT_FAILED:`PNG 匯出失敗`,DESTROYED:`場景已銷毀`,NO_PLAN:`尚未載入 plan`,INTERNAL_OVERFLOW:`內部溢出`,INTERNAL_RENDER_ERROR:`渲染內部錯誤`};function dm(e){if(!e||typeof e!=`object`)return`場景錯誤：未知錯誤`;let t=typeof e.code==`string`&&e.code?e.code:`UNKNOWN`;return`場景錯誤（${t}）${um[t]||`未知錯誤`}${typeof e.message==`string`&&e.message?`：${e.message}`:``}`}var fm=[{view:`iso`,label:`等角`},{view:`top`,label:`俯視`},{view:`front`,label:`正視（門端）`}];function pm(e,t={}){if(!e||typeof e.appendChild!=`function`)throw Error(`mountContainerSceneUI: host 必須是 DOM 元素`);let n=t.sceneFactory||am,r=document.createElement(`div`);r.className=`container-scene-canvas`;let i=document.createElement(`div`);i.className=`container-scene-controls`;let a=document.createElement(`div`);a.className=`container-scene-views`,a.setAttribute(`role`,`group`),a.setAttribute(`aria-label`,`場景視角`);let o=[];for(let e of fm){let t=document.createElement(`button`);t.type=`button`,t.className=`container-scene-view-btn`,t.dataset.view=e.view,t.textContent=e.label,a.appendChild(t),o.push(t)}let s=document.createElement(`select`);s.className=`container-scene-select`,s.setAttribute(`aria-label`,`板選擇`);let c=document.createElement(`select`);c.className=`container-scene-select`,c.setAttribute(`aria-label`,`層選擇`);let l=document.createElement(`button`);l.type=`button`,l.className=`container-scene-png-btn`,l.textContent=`匯出場景 PNG`,l.disabled=!0,i.appendChild(a),i.appendChild(s),i.appendChild(c),i.appendChild(l);let u=document.createElement(`div`);u.className=`container-scene-status`,u.setAttribute(`role`,`status`),e.appendChild(r),e.appendChild(i),e.appendChild(u);let d=n(r),f=null,p=!1,m=0,h=null,g=!1;function _(){m+=1,h=null,p=!1}function v(e,t){u.textContent=e||``,u.classList.toggle(`error`,!!t)}function y(e,t){e.replaceChildren();for(let n of t){let t=document.createElement(`option`);t.value=n.value,t.textContent=n.label,e.appendChild(t)}e.value=`all`}function b(e){for(let t of o)t.classList.toggle(`active`,t.dataset.view===e)}function x(){y(s,cm(null)),y(c,lm(0)),b(`iso`),l.disabled=!0}function S(){let e=om(s.value),t=om(c.value);if(!e.ok||!t.ok){v(`篩選選擇無效：${e.ok?t.message:e.message}`,!0);return}let n=d.setFilter({selectedPallet:e.index,selectedLayer:t.index});n.ok?v(``):v(dm(n.error),!0)}s.addEventListener(`change`,S),c.addEventListener(`change`,S);for(let e of o)e.addEventListener(`click`,()=>{let t=d.setView(e.dataset.view);t.ok?(b(e.dataset.view),v(``)):v(dm(t.error),!0)});return l.addEventListener(`click`,async()=>{if(g||p)return;let e=m,t={id:e};h=t,p=!0,l.disabled=!0;let n=()=>!g&&m===e&&h===t;try{let e=await d.exportPng();if(!n())return;if(!e.ok)v(dm(e.error),!0);else{let t=URL.createObjectURL(e.blob),n=document.createElement(`a`);n.href=t,n.download=`container-plan.png`,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(t),1e4),v(`已匯出場景 PNG：container-plan.png`)}}catch(e){if(!n())return;v(dm({code:`PNG_EXPORT_FAILED`,message:e&&e.message?String(e.message):`未知錯誤`}),!0)}finally{n()&&(p=!1,h=null,l.disabled=!f)}}),x(),{setPlan(e){if(g){let e={code:`DESTROYED`,message:`場景 UI 已銷毀，無法再載入 plan`};return v(dm(e),!0),{ok:!1,error:e}}_();let t=d.setPlan(e);return t.ok?(f=e,y(s,cm(e)),y(c,lm(sm(e))),b(`iso`),l.disabled=!1,v(``),t):(f=null,x(),v(dm(t.error),!0),t)},clear(){g||(_(),d.clear(),f=null,x(),v(``))},destroy(){g||(g=!0,_(),d.destroy(),f=null,x())}}}var mm=Object.freeze([`bottles`,`pouches`,`pallet`,`container`]),hm=`pallet`,gm=Object.freeze([{route:`bottles`,label:`瓶裝紙箱估算`},{route:`pouches`,label:`袋狀紙箱估算`},{route:`pallet`,label:`紙箱優化堆疊`},{route:`container`,label:`裝櫃優化估算`}]);function _m(e){if(typeof e!=`string`)return hm;let t=e.replace(/^#/,``).trim();return mm.includes(t)?t:hm}function vm(e={}){let t=typeof e!=`object`||!e?{}:e,n=t.window===void 0?globalThis.window===void 0?null:globalThis.window:t.window,r=t.document===void 0?globalThis.document===void 0?null:globalThis.document:t.document;if(!r||!n)return null;let i={},a={};for(let{route:e}of gm)i[e]=r.getElementById(`page-${e}`),a[e]=r.getElementById(`nav-${e}`);function o(){if(typeof n.requestAnimationFrame==`function`)n.requestAnimationFrame(()=>{try{n.dispatchEvent(new n.Event(`resize`))}catch{}});else try{n.dispatchEvent(new n.Event(`resize`))}catch{}}function s(e){let t=_m(e);for(let{route:e}of gm){let n=i[e];n&&(n.hidden=e!==t);let r=a[e];r&&(e===t?r.setAttribute(`aria-current`,`page`):r.removeAttribute(`aria-current`))}o()}return n.addEventListener(`hashchange`,()=>s(n.location?n.location.hash:``)),s(n.location?n.location.hash:``),{showRoute:s,resolveRoute:_m}}var ym=(e,t={})=>new os({color:e,roughness:.68,...t}),bm=(e,t,n,r,i=0,a=0,o=0)=>{let s=new Ui(n,r);return s.name=t,s.position.set(i,a,o),e.add(s),s};function xm(e=`round`){let t=new _r,n=ym(e===`round`?14543580:16774360),r=ym(2319441);if(e===`round`){bm(t,`body`,new Jo([[0,0],[.43,0],[.5,.035],[.5,.62],[.48,.68],[.35,.77],[.19,.83],[.19,.9],[0,.9]].map(([e,t])=>new G(e,t)),32),n),bm(t,`neck`,new wa(.19,.19,.09,24),n,0,.855,0),bm(t,`cap`,new wa(.22,.22,.1,32),r,0,.95,0);let e=ym(4227178);bm(t,`cap-band`,new wa(.225,.225,.018,32),e,0,.914,0)}else{let e=new oo;e.moveTo(-.5,0),e.lineTo(.5,0),e.lineTo(.5,.7),e.quadraticCurveTo(.5,.78,.36,.8),e.lineTo(-.06,.86),e.lineTo(-.34,.86),e.lineTo(-.46,.73),e.quadraticCurveTo(-.5,.69,-.5,.62),e.closePath();let i=new ao;i.moveTo(.18,.51),i.lineTo(.36,.51),i.quadraticCurveTo(.4,.51,.4,.55),i.lineTo(.4,.68),i.quadraticCurveTo(.4,.72,.36,.72),i.lineTo(.18,.72),i.quadraticCurveTo(.14,.72,.14,.68),i.lineTo(.14,.55),i.quadraticCurveTo(.14,.51,.18,.51),e.holes.push(i);let a=new Go(e,{depth:1,bevelEnabled:!1,curveSegments:12});a.translate(0,0,-.5),bm(t,`body`,a,n),bm(t,`neck`,new wa(.14,.14,.07,24),n,-.2,.865,0),bm(t,`cap`,new wa(.17,.17,.1,32),r,-.2,.95,0)}return t}function Sm(){let e=new _r;e.name=`pouch`;let t=.405,n=.405,r=new oo;r.moveTo(-.26325000000000004,-.405),r.lineTo(.26325000000000004,-.405),r.quadraticCurveTo(t,-.405,t,-.26325000000000004),r.lineTo(t,.26325000000000004),r.quadraticCurveTo(t,n,.26325000000000004,n),r.lineTo(-.26325000000000004,n),r.quadraticCurveTo(-.405,n,-.405,.26325000000000004),r.lineTo(-.405,-.26325000000000004),r.quadraticCurveTo(-.405,-.405,-.26325000000000004,-.405);let i=bm(e,`pouch-body`,new Go(r,{depth:.78,bevelEnabled:!0,bevelThickness:.11,bevelSize:.05,bevelSegments:3,curveSegments:6}),ym(10465469,{metalness:.55,roughness:.38}));return i.rotation.x=-Math.PI/2,i.position.y=.11,bm(e,`pouch-seal`,new Ca(.5265000000000001,.03,.5265000000000001),ym(7307147,{metalness:.4,roughness:.55}),0,.985,0),e}function Cm(e){let t=new Set,n=new Set;e.traverse(e=>{if(e.geometry&&t.add(e.geometry),e.material)for(let t of[].concat(e.material))n.add(t);e.isInstancedMesh&&e.dispose()});for(let e of t)e.dispose();for(let e of n)e.dispose()}function wm(e,t,n,r=400){if(!(t!=null&&t.ok)||!Number.isInteger(r)||r<1||r>1e4)throw Error(`Invalid packaging 3D result or cap`);for(let t of[`itemL`,`itemW`,`itemH`,`cols`,`rows`,`layers`])if(!Number.isFinite(e[t])||e[t]<=0)throw Error(`Invalid 3D item input`);if(![`round`,`rectangular`,`pouch`].includes(n))throw Error(`Unknown package kind`);let i=new _r,{length:a,width:o,height:s}=t.outer,c=t.itemCount,l=Math.min(c,r),u=e.boardThickness||0;i.userData={total:c,shown:l,kind:n,outer:{...t.outer}};let d=ym(11897171),f=ym(13018744,{transparent:!0,opacity:.1,depthWrite:!1,side:2}),p=new _r;p.name=`closed-carton`,i.add(p),bm(p,`sealed-box`,new Ca(a,s,o),d,a/2,s/2,o/2);let m=new va(new ka(new Ca(a,s,o)),new oa({color:6507570}));m.position.set(a/2,s/2,o/2),p.add(m);let h=new yi().setFromPoints([new K(0,s+.05,o/2),new K(a,s+.05,o/2)]);p.add(new ma(h,new oa({color:7953977})));let g=new _r;g.name=`open-carton`,i.add(g);let _=Math.min(Math.max(u,Math.min(a,o,s)*.003),a/4,o/4,s/4);bm(g,`base`,new Ca(a,_,o),d,a/2,_/2,o/2);for(let[e,t,n,r,i,c,l]of[[`back-wall`,a,s,_,a/2,s/2,o-_/2],[`front-wall`,a,s,_,a/2,s/2,_/2],[`left-wall`,_,s,o,_/2,s/2,o/2],[`right-wall`,_,s,o,a-_/2,s/2,o/2]])bm(g,e,new Ca(t,n,r),f,i,c,l);let v=m.clone();v.geometry=m.geometry.clone(),v.material=m.material.clone(),g.add(v);for(let e of[-1,1]){let t=new _r;t.position.set(a/2,s,e<0?0:o),t.rotation.x=e*Math.PI/3,bm(t,`open-flap`,new Ca(a,_,o*.3),d,0,0,e*o*.15),g.add(t)}let y=ym(8879463,{transparent:!0,opacity:.72});e.bottomPad>0&&bm(g,`bottom-pad`,new Ca(t.inner.length,e.bottomPad,t.inner.width),y,a/2,u+e.bottomPad/2,o/2),e.topPad>0&&bm(g,`top-pad`,new Ca(t.inner.length,e.topPad,t.inner.width),y,a/2,u+(e.bottomPad||0)+t.occupied.height+e.topPad/2,o/2),e.bottomPad>0||e.topPad>0||y.dispose();let b=n===`pouch`?Sm():xm(n);b.updateMatrixWorld(!0);let x=new _r;x.name=`items`,g.add(x);let S=new Un,C=new Un,w=new K,T=new xn,E=new K(e.itemL,e.itemH,e.itemW);return b.traverse(t=>{if(!t.isMesh)return;let n=new ta(t.geometry,t.material,l);n.name=t.name;for(let r=0;r<l;r++){let i=r%e.cols,a=Math.floor(r/e.cols)%e.rows,o=Math.floor(r/(e.cols*e.rows));w.set(u+(e.wallClearanceL||0)+e.itemL/2+i*(e.itemL+(e.gapL||0)),u+(e.bottomPad||0)+o*(e.itemH+(e.gapH||0)),u+(e.wallClearanceW||0)+e.itemW/2+a*(e.itemW+(e.gapW||0))),C.compose(w,T,E),S.multiplyMatrices(C,t.matrixWorld),n.setMatrixAt(r,S)}n.instanceMatrix.needsUpdate=!0,n.computeBoundingBox(),n.computeBoundingSphere(),x.add(n)}),p.visible=!0,g.visible=!1,i}function Tm(e){e.classList.add(`pack-scene`),e.hidden=!0,e.innerHTML=`<h3>紙箱與箱內堆疊 3D</h3>
 <div class="pack-scene-toolbar" role="group" aria-label="3D 顯示模式">
  <button type="button" data-mode="outside" aria-pressed="true">紙箱外觀</button>
  <button type="button" data-mode="inside" aria-pressed="false">箱內堆疊</button>
 </div>
 <p class="pack-scene-dimensions"></p>
 <div class="pack-scene-frame" aria-label="可拖曳旋轉及縮放的包裝 3D 示意"></div>
 <div class="pack-scene-toolbar" role="group" aria-label="3D 視角">
  <button type="button" data-view="top">俯視</button><button type="button" data-view="front">正視</button><button type="button" data-view="reset">重設視角</button>
 </div>
 <p class="pack-scene-status" role="status"></p><p class="pack-scene-note hint"></p>
 <p class="hint">拖曳旋轉；雙指縮放／滑鼠滾輪。尺寸為箱外長 × 寬 × 高；開啟的箱蓋不計入箱外尺寸。</p>`;let t=e.querySelector(`.pack-scene-frame`),n=e.querySelector(`.pack-scene-status`),r=e.querySelector(`.pack-scene-note`),i,a,o,s,c,l,u=0,d=!1,f=!1,p=`reset`,m=`outside`,h=new K;function g(){if(u=0,d||!i||e.hidden||!c||!t.getClientRects().length)return;let n=t.clientWidth,r=t.clientHeight;n&&r&&((i.domElement.width!==Math.round(n*i.getPixelRatio())||i.domElement.height!==Math.round(r*i.getPixelRatio()))&&(i.setSize(n,r,!1),s.aspect=n/r,s.updateProjectionMatrix(),v()),i.render(o,s))}function _(){!d&&!u&&(u=requestAnimationFrame(g))}function v(){if(!s||!c)return;let e=new Br().setFromObject(c);e.getCenter(h);let t=Math.max(e.getSize(new K).length()/2,.01),n=bn.degToRad(s.fov),r=2*Math.atan(Math.tan(n/2)*s.aspect),i=t/Math.sin(Math.min(n,r)/2)*1.16,o=p===`top`?new K(0,1,.001):p===`front`?new K(0,.001,1):new K(1,.8,1.2);s.position.copy(h).addScaledVector(o.normalize(),i),s.near=Math.max(i/1e4,1e-4),s.far=i+t*30,s.updateProjectionMatrix(),a.target.copy(h),a.minDistance=t*.2,a.maxDistance=i*6,a.update()}function y(){if(!(i||f))try{i=new kd({antialias:!0,alpha:!1}),i.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),i.setClearColor(15855075),i.outputColorSpace=At,i.domElement.setAttribute(`aria-label`,`包裝 3D 示意圖`),i.domElement.setAttribute(`role`,`img`),t.appendChild(i.domElement),o=new Tr,s=new Us(38,1,.01,1e6),o.add(new js(16777215,11969933,2.7));let e=new Ks(16777215,2.8);e.position.set(1,2,3),o.add(e),a=new Bd(s,i.domElement),a.enableDamping=!1,a.enablePan=!1,a.addEventListener(`change`,_),l=new ResizeObserver(_),l.observe(t),i.domElement.addEventListener(`webglcontextlost`,b)}catch{f=!0,a&&a.dispose(),i&&i.dispose(),i=null,t.textContent=`此瀏覽器無法顯示 3D，仍可使用上方尺寸與 2D 排列圖。`}}function b(e){e.preventDefault(),f=!0,n.textContent=`3D 顯示已中斷，請重新整理頁面；尺寸計算與帶入功能不受影響。`}function x(){u&&(cancelAnimationFrame(u),u=0),e.hidden=!0,delete e.dataset.total,delete e.dataset.shown,delete e.dataset.outer,c&&(o.remove(c),Cm(c),c=null,i==null||i.renderLists.dispose())}function S(){c&&(c.getObjectByName(`closed-carton`).visible=m===`outside`,c.getObjectByName(`open-carton`).visible=m===`inside`),e.dataset.mode=m;for(let t of e.querySelectorAll(`[data-mode]`))t.setAttribute(`aria-pressed`,String(t.dataset.mode===m))}function C(t,i,a){if(d)return;x(),e.hidden=!1,e.dataset.kind=a,e.dataset.total=String(i.itemCount),e.dataset.shown=String(Math.min(i.itemCount,400)),e.dataset.outer=JSON.stringify(i.outer);let s=e=>new Intl.NumberFormat(`zh-TW`,{maximumFractionDigits:2}).format(e);e.querySelector(`.pack-scene-dimensions`).textContent=`箱外長 × 寬 × 高：${s(i.outer.length)} × ${s(i.outer.width)} × ${s(i.outer.height)} mm`,r.textContent=a===`pouch`?`袋裝為示意性柔性鋁袋（內縮、鼓腹、封邊輪廓），逐包呈現；尺寸與包數採計算值，非物理仿真；與所選排列同步。`:`瓶型示意，非實際容器圖。瓶肩、瓶頸、含蓋及握把採固定比例；裝箱仍使用最大外包絡，不作互相嵌套。`,n.textContent=i.itemCount>400?`為保持操作順暢，僅顯示 400／${i.itemCount} 件（從底層依序顯示）；箱數、尺寸與帶入計算仍採全部件數。`:`共 ${i.itemCount} 件，全部顯示。`,y(),S(),f||(c=wm(t,i,a),o.add(c),S(),v(),_());for(let t of e.querySelectorAll(`button`))t.disabled=f}let w=e=>{let t=e.target.closest(`button[data-mode]`);t&&(m=t.dataset.mode,S(),v(),_())},T=e=>{let t=e.target.closest(`button[data-view]`);t&&(p=t.dataset.view,v(),_())};e.addEventListener(`click`,w),e.addEventListener(`click`,T),window.addEventListener(`hashchange`,_);let E=e=>{e.persisted||D()};window.addEventListener(`pagehide`,E);function D(){d||(x(),d=!0,l==null||l.disconnect(),a==null||a.dispose(),i&&(i.domElement.removeEventListener(`webglcontextlost`,b),i.dispose(),i.domElement.remove()),e.removeEventListener(`click`,w),e.removeEventListener(`click`,T),window.removeEventListener(`hashchange`,_),window.removeEventListener(`pagehide`,E))}return{update:C,clear:x,dispose:D}}var Em=[`itemL`,`itemW`,`itemH`],Dm=[`cols`,`rows`,`layers`],Om=[`gapL`,`gapW`,`gapH`,`wallClearanceL`,`wallClearanceW`,`headroom`,`topPad`,`bottomPad`,`boardThickness`],km={itemL:`物品長`,itemW:`物品寬`,itemH:`物品高`,cols:`列數`,rows:`行數`,layers:`層數`,gapL:`長向間距`,gapW:`寬向間距`,gapH:`高向間距`,wallClearanceL:`長向壁距`,wallClearanceW:`寬向壁距`,headroom:`上方淨高`,topPad:`上墊`,bottomPad:`下墊`,boardThickness:`板材厚`};function Am(e){let t=[],n={};for(let r of Em){let i=e[r];typeof i!=`number`||!Number.isFinite(i)?t.push(`${km[r]}必須是有限數字`):i<=0?t.push(`${km[r]}必須是正數`):i>m.maxDim?t.push(`${km[r]}不可超過 ${m.maxDim} mm（硬限制）`):n[r]=i}for(let r of Dm){let i=e[r];typeof i!=`number`||!Number.isSafeInteger(i)?t.push(`${km[r]}必須是正整數且不可超過安全整數範圍（不接受小數）`):i<=0?t.push(`${km[r]}必須是正數`):n[r]=i}for(let r of Om){let i=e[r];i===void 0?n[r]=0:typeof i!=`number`||!Number.isFinite(i)||i<0?t.push(`${km[r]}必須是有限且非負的數字`):n[r]=i}if(t.length===0||Dm.every(e=>e in n)){let e=n.cols*n.rows*n.layers;Number.isSafeInteger(e)?e>m.maxTotalBoxes&&t.push(`總箱數不可超過 ${m.maxTotalBoxes}（硬限制）`):t.push(`總箱數超出安全整數範圍（cols×rows×layers 不可無界膨脹）`)}return{errors:t,v:n}}function jm(e){if(typeof e!=`object`||!e||Array.isArray(e))return{ok:!1,errors:[`輸入必須是物件`]};let{errors:t,v:n}=Am(e);if(t.length>0)return{ok:!1,errors:t};let r={length:n.cols*n.itemL+(n.cols-1)*n.gapL,width:n.rows*n.itemW+(n.rows-1)*n.gapW,height:n.layers*n.itemH+(n.layers-1)*n.gapH},i={length:r.length+2*n.wallClearanceL,width:r.width+2*n.wallClearanceW,height:r.height+n.topPad+n.bottomPad+n.headroom},a={length:i.length+2*n.boardThickness,width:i.width+2*n.boardThickness,height:i.height+2*n.boardThickness},o={boxL:Math.ceil(a.length),boxW:Math.ceil(a.width),boxH:Math.ceil(a.height)},s=[];for(let e of[`length`,`width`,`height`])a[e]>m.maxDim&&s.push(`outer ${e}`);for(let e of[`boxL`,`boxW`,`boxH`])o[e]>m.maxDim&&s.push(`transfer ${e}`);return s.length>0?{ok:!1,errors:[`${s.join(`、`)}不可超過 ${m.maxDim} mm（硬限制）`]}:{ok:!0,itemCount:n.cols*n.rows*n.layers,occupied:r,inner:i,outer:a,transferBox:o}}var Mm=Object.freeze([`bottles`,`pouches`]),Nm=1e5,Pm=5e4,Fm=Object.freeze([`boxL`,`boxW`,`boxH`]);function Im(e){return{ok:!1,errors:e}}function Lm(e){return typeof e==`number`&&Number.isSafeInteger(e)&&e>0}function Rm(e,t){Array.isArray(e)?e.length>20?t.push(`assumptions must have at most 20 items`):e.forEach((e,n)=>{if(typeof e!=`string`){t.push(`assumptions[${n}] must be a string`);return}if(e.length>500){t.push(`assumptions[${n}] must be at most 500 characters`);return}let r=!1;try{r=JSON.parse(JSON.stringify(e))===e}catch{r=!1}r||t.push(`assumptions[${n}] must be JSON-safe`)}):t.push(`assumptions must be an array of strings`)}function zm(e){if(typeof e!=`object`||!e||Array.isArray(e))return Im([`input must be an object with source, revision, box, unitsPerCarton, assumptions`]);let t=[],{source:n,revision:r,box:i,unitsPerCarton:a,assumptions:o}=e;(typeof n!=`string`||!Mm.includes(n))&&t.push(`source must be one of: ${Mm.join(`, `)}`),Lm(r)||t.push(`revision must be a positive safe integer`);let s=null;if(typeof i!=`object`||!i||Array.isArray(i))t.push(`box must be an object with exactly boxL, boxW, boxH`);else{Object.keys(i).filter(e=>!Fm.includes(e)).length>0&&t.push(`box must contain exactly boxL, boxW, boxH`),s={};for(let e of Fm){let n=i[e];typeof n!=`number`||!Number.isFinite(n)||n<=0?t.push(`box.${e} must be a finite positive number`):n>1e5?t.push(`box.${e} must be at most ${Nm}`):s[e]=Math.ceil(n)}}return(!Lm(a)||a>5e4)&&t.push(`unitsPerCarton must be a positive safe integer at most ${Pm}`),Rm(o,t),t.length>0?Im(t):{ok:!0,snapshot:{schemaVersion:1,source:n,revision:r,box:{boxL:s.boxL,boxW:s.boxW,boxH:s.boxH},unitsPerCarton:a,assumptions:o.slice()}}}function Bm(e,t){let n=t==null?{}:t;if(typeof n!=`object`||!n||Array.isArray(n))return Im([`options must be an object`]);let{expectedRevision:r}=n;if(typeof e!=`object`||!e||Array.isArray(e))return Im([`snapshot must be an object`]);let i=[],{schemaVersion:a,source:o,revision:s,box:c,unitsPerCarton:l,assumptions:u}=e;a!==1&&i.push(`schemaVersion must be exactly 1`),(typeof o!=`string`||!Mm.includes(o))&&i.push(`source must be one of: ${Mm.join(`, `)}`),Lm(s)||i.push(`revision must be a positive safe integer`);let d=null;if(typeof c!=`object`||!c||Array.isArray(c))i.push(`box must be an object with exactly boxL, boxW, boxH`);else{Object.keys(c).filter(e=>!Fm.includes(e)).length>0&&i.push(`box must contain exactly boxL, boxW, boxH`),d={};for(let e of Fm){let t=c[e];Lm(t)?t>1e5?i.push(`box.${e} must be at most ${Nm}`):d[e]=t:i.push(`box.${e} must be a positive integer in millimetres`)}}return(!Lm(l)||l>5e4)&&i.push(`unitsPerCarton must be a positive safe integer at most ${Pm}`),Rm(u,i),r!==void 0&&(Lm(r)?Number.isSafeInteger(s)&&s!==r&&i.push(`snapshot revision ${s} does not match expectedRevision ${r} (stale)`):i.push(`expectedRevision must be a positive safe integer when provided`)),i.length>0?Im(i):{ok:!0,snapshot:{schemaVersion:a,source:o,revision:s,box:{boxL:d.boxL,boxW:d.boxW,boxH:d.boxH},unitsPerCarton:l,assumptions:u.slice()}}}var Vm=`http://www.w3.org/2000/svg`;function Hm(e,t,{integer:n=!1,allowNegative:r=!1}={}){let i=String(e==null?``:e).trim();if(i===``)return{ok:!1,error:`${t}不可留空（空白不會預設為 0）`};let a=Number(i);return Number.isFinite(a)?n&&!Number.isSafeInteger(a)?{ok:!1,error:`${t}必須是整數（不接受小數）`}:!r&&a<0?{ok:!1,error:`${t}不可為負數`}:{ok:!0,value:a}:{ok:!1,error:`${t}必須是有限數字`}}function Um(e,t){let n={},r=[];for(let i of t){let t=e(i.id),a=Hm(i.get?i.get():t?t.value:``,i.label,{integer:!!i.integer});a.ok?n[i.id]=a.value:r.push(a.error)}return{values:n,errors:r}}function Wm(e,t){e.textContent=``;let n=document.createElement(`ul`);for(let e of t){let t=document.createElement(`li`);t.textContent=e,n.appendChild(t)}e.appendChild(n),e.hidden=!1}function Gm(e){e.textContent=``,e.hidden=!0}function Km(e){return e.toFixed(2)}function qm(e,t,{countLabel:n=`件`}={}){e.textContent=``;let r=(t,n)=>{let r=document.createElement(`div`);r.className=`pack-stat`;let i=document.createElement(`span`);i.className=`k`,i.textContent=t;let a=document.createElement(`span`);a.className=`v`,a.textContent=n,r.append(i,a),e.appendChild(r)};r(`每箱數量`,`${t.itemCount} ${n}（${t.grid.cols} 列 × ${t.grid.rows} 行 × ${t.grid.layers} 層）`),r(`占用尺寸`,`${Km(t.occupied.length)} × ${Km(t.occupied.width)} × ${Km(t.occupied.height)} mm`),r(`紙箱內尺寸（估算）`,`${Km(t.inner.length)} × ${Km(t.inner.width)} × ${Km(t.inner.height)} mm`),r(`紙箱外尺寸（估算）`,`${Km(t.outer.length)} × ${Km(t.outer.width)} × ${Km(t.outer.height)} mm`),r(`帶入紙箱尺寸（整數 mm）`,`${t.transferBox.boxL} × ${t.transferBox.boxW} × ${t.transferBox.boxH}`),e.hidden=!1}function Jm(e){let{cols:t,rows:n,layers:r,itemL:i,itemW:a,itemH:o,gapL:s=0,gapW:c=0,shape:l,occupied:u,inner:d,outer:f,itemCount:p}=e,m=document.createElementNS(Vm,`svg`);m.setAttribute(`viewBox`,`0 0 ${f.length} ${f.width}`),m.setAttribute(`preserveAspectRatio`,`xMidYMid meet`),m.setAttribute(`role`,`img`),m.setAttribute(`aria-label`,`2D 頂視排列示意：${t} 列 × ${n} 行 × ${r} 層，物品單件 ${i} × ${a} mm，紙箱外 ${f.length} × ${f.width} mm，高度 ${o} mm`);let h=(e,t,n,r,i,a={})=>{let o=document.createElementNS(Vm,`rect`);o.setAttribute(`x`,e),o.setAttribute(`y`,t),o.setAttribute(`width`,Math.max(n,0)),o.setAttribute(`height`,Math.max(r,0)),o.setAttribute(`class`,i);for(let[e,t]of Object.entries(a))o.setAttribute(e,t);return o};m.appendChild(h(0,0,f.length,f.width,`pack-diagram-outer`)),m.appendChild(h((f.length-d.length)/2,(f.width-d.width)/2,d.length,d.width,`pack-diagram-inner`));let g=document.createElement(`p`);g.className=`pack-diagram-note`;let _=(f.length-u.length)/2,v=(f.width-u.width)/2;if(t*n<=200){let e=0;for(let r=0;r<t;r++)for(let t=0;t<n;t++){let n=_+r*(i+s),o=v+t*(a+c);if(l===`round`){let t=document.createElementNS(Vm,`circle`);t.setAttribute(`cx`,n+i/2),t.setAttribute(`cy`,o+a/2),t.setAttribute(`r`,Math.min(i,a)/2),t.setAttribute(`class`,`pack-diagram-item`),t.setAttribute(`data-item`,String(e)),m.appendChild(t)}else m.appendChild(h(n,o,i,a,`pack-diagram-item`,{"data-item":String(e)}));e++}g.textContent=`頂視每層 ${t*n} 件（每格一個圖元），共 ${p} 件；單件高 ${o} mm × ${r} 層，占用總高 ${Km(u.height)} mm。`}else m.appendChild(h(_,v,u.length,u.width,`pack-diagram-aggregate`)),g.textContent=`每層 ${t*n} 件，共 ${p} 件，每層超過逐一繪圖上限 200：僅顯示聚合區塊示意（非逐件）；單件高 ${o} mm × ${r} 層，占用總高 ${Km(u.height)} mm。`;return{svg:m,note:g}}function Ym(e,{sourceLabel:t,snapshot:n,oldBox:r}){e.textContent=``;let i=document.createElement(`p`);i.className=`pack-preview-title`,i.textContent=`確認帶入（來源：${t}）`,e.appendChild(i);let a=[[`目前紙箱（舊）`,r?`${r.boxL} × ${r.boxW} × ${r.boxH} mm`:`（目前值無法解讀）`],[`帶入紙箱（新，整數 mm）`,`${n.box.boxL} × ${n.box.boxW} × ${n.box.boxH} mm`],[`每箱件數`,`${n.unitsPerCarton} 件`],[`快照修訂號`,`#${n.revision}`]];for(let[t,n]of a){let r=document.createElement(`div`);r.className=`pack-stat`;let i=document.createElement(`span`);i.className=`k`,i.textContent=t;let a=document.createElement(`span`);a.className=`v`,a.textContent=n,r.append(i,a),e.appendChild(r)}let o=document.createElement(`p`);o.className=`pack-preview-assume-title`,o.textContent=`估算假設`,e.appendChild(o);let s=document.createElement(`ul`);s.className=`pack-preview-assumptions`;for(let e of n.assumptions){let t=document.createElement(`li`);t.textContent=e,s.appendChild(t)}e.appendChild(s),e.hidden=!1}var Xm=[{id:`b-dividerThickness`,label:`井字隔板厚度`},{id:`b-gapH`,label:`高向間距`},{id:`b-wallClearanceL`,label:`長向壁距`},{id:`b-wallClearanceW`,label:`寬向壁距`},{id:`b-headroom`,label:`上方淨高`},{id:`b-topPad`,label:`天板厚度`},{id:`b-bottomPad`,label:`地板厚度`},{id:`b-boardThickness`,label:`紙箱厚度`}];function Zm(e,t={}){let{onApply:n,getCurrentBox:r,onDraftChange:i}=t,a=t=>e.querySelector(`#`+t),o={shape:a(`b-shape`),diameter:a(`b-diameter`),itemL:a(`b-itemL`),itemW:a(`b-itemW`),itemH:a(`b-itemH`),cols:a(`b-cols`),rows:a(`b-rows`),layers:a(`b-layers`),calculate:a(`b-calculate`),result:a(`b-result`),errors:a(`b-errors`),diagram:a(`b-diagram`),transfer:a(`b-transfer`),preview:a(`b-transfer-preview`),previewBody:e.querySelector(`#b-transfer-preview-body`),confirm:a(`b-confirm`),cancel:a(`b-cancel`),roundFields:e.querySelector(`.b-round-fields`),rectFields:e.querySelector(`.b-rect-fields`)};for(let e of Xm)o[e.id]=a(e.id);let s=Tm(a(`b-scene`)),c=1,l=null;function u(e){o.transfer.disabled=!e}function d(){o.preview.hidden=!0,o.previewBody.textContent=``}function f(){c++,s.clear(),l=null,o.result.hidden=!0,o.result.textContent=``,o.diagram.hidden=!0,o.diagram.textContent=``,Gm(o.errors),d(),u(!1),typeof i==`function`&&i()}function p(){return o.shape.value===`round`}function m(){o.roundFields.classList.toggle(`is-inactive`,!p()),o.rectFields.classList.toggle(`is-inactive`,p())}function h(){let e=p()?[{id:`b-diameter`,label:`圓瓶最大外徑`}]:[{id:`b-itemL`,label:`方瓶長`},{id:`b-itemW`,label:`方瓶寬`}];e.push({id:`b-itemH`,label:`瓶子含蓋總高`}),e.push({id:`b-cols`,label:`列數`,integer:!0}),e.push({id:`b-rows`,label:`行數`,integer:!0}),e.push({id:`b-layers`,label:`層數`,integer:!0});for(let t of Xm)e.push({...t});let{values:t,errors:n}=Um(e=>a(e),e),r={itemL:p()?t[`b-diameter`]:t[`b-itemL`],itemW:p()?t[`b-diameter`]:t[`b-itemW`],itemH:t[`b-itemH`],cols:t[`b-cols`],rows:t[`b-rows`],layers:t[`b-layers`]};for(let e of Xm)e.id!==`b-dividerThickness`&&(r[e.id.replace(/^b-/,``)]=t[e.id]);return r.gapL=t[`b-dividerThickness`],r.gapW=t[`b-dividerThickness`],{raw:r,errors:n}}function g(e){let t=[];return t.push(p()?`圓形瓶以直徑 ${e.itemL} mm 之外接正方形計算占地（直立排列，不做交錯圓瓶搜尋）。`:`矩形物品以最大外長寬 ${e.itemL} × ${e.itemW} mm 直立排列計算。`),t.push(`高度採含蓋總高 ${e.itemH} mm × ${e.layers} 層（層間距 ${e.gapH} mm）。`),t.push(`內尺寸＝占用 + 長寬各 2×壁距（${e.wallClearanceL}/${e.wallClearanceW} mm）；內高 + 天板厚度 ${e.topPad} ＋ 地板厚度 ${e.bottomPad} ＋ 上方淨高 ${e.headroom} mm。`),t.push(`外尺寸＝內尺寸每軸各加 2×紙箱厚度 ${e.boardThickness} mm；帶入前各軸向上取整為整數毫米。`),t}function _(){let{raw:e,errors:t}=h(),n=jm(e),r=t.concat(n.ok?[]:n.errors);if(r.length>0){s.clear(),l=null,o.result.hidden=!0,o.result.textContent=``,o.diagram.hidden=!0,o.diagram.textContent=``,d(),u(!1),Wm(o.errors,r);return}Gm(o.errors);let i=zm({source:`bottles`,revision:c,box:{boxL:n.outer.length,boxW:n.outer.width,boxH:n.outer.height},unitsPerCarton:n.itemCount,assumptions:g(e)});if(!i.ok){s.clear(),l=null,o.result.hidden=!0,o.result.textContent=``,o.diagram.hidden=!0,o.diagram.textContent=``,d(),u(!1),Wm(o.errors,i.errors);return}l=i.snapshot,qm(o.result,{...n,grid:{cols:e.cols,rows:e.rows,layers:e.layers}},{countLabel:`瓶`}),o.diagram.textContent=``;let{svg:a,note:f}=Jm({cols:e.cols,rows:e.rows,layers:e.layers,itemL:e.itemL,itemW:e.itemW,itemH:e.itemH,gapL:e.gapL,gapW:e.gapW,shape:p()?`round`:`rectangular`,occupied:n.occupied,inner:n.inner,outer:n.outer,itemCount:n.itemCount});o.diagram.appendChild(a),o.diagram.appendChild(f),o.diagram.hidden=!1,s.update(e,n,p()?`round`:`rectangular`),d(),u(!0)}function v(){if(!l)return;let e=Bm(l,{expectedRevision:c});if(!e.ok){l=null,u(!1),d(),Wm(o.errors,e.errors);return}let t=typeof r==`function`?r():null;Ym(o.previewBody,{sourceLabel:`瓶裝`,snapshot:l,oldBox:t}),o.preview.hidden=!1}function y(){if(!l)return;let e=Bm(l,{expectedRevision:c});if(!e.ok){l=null,u(!1),d(),Wm(o.errors,e.errors);return}let t=typeof n==`function`?n(e.snapshot):{ok:!1,errors:[`未提供 onApply`]};t&&t.ok?(d(),o.transfer.disabled=!0):Wm(o.errors,t&&t.errors||[`帶入失敗`])}let b=[o.shape,o.diameter,o.itemL,o.itemW,o.itemH,o.cols,o.rows,o.layers,...Xm.map(e=>o[e.id])];for(let e of b)e.addEventListener(e===o.shape?`change`:`input`,()=>{e===o.shape&&m(),f()});return o.calculate.addEventListener(`click`,_),o.transfer.addEventListener(`click`,v),o.confirm.addEventListener(`click`,y),o.cancel.addEventListener(`click`,d),m(),u(!1),{invalidate:f,getRevision:()=>c,getSnapshot:()=>l}}var Qm=297/210,$m=.1,eh=10,th=m.maxDim,nh=`A4 effective-flat folded-seal approximation (experience-based, not a manufacturing guarantee)`;function rh(e){let t=[];if(typeof e!=`object`||!e||Array.isArray(e))return t.push(`輸入必須是包含 massG、bulkDensityGPerCm3、fillFraction 的物件`),{errors:t,values:null};let{massG:n,bulkDensityGPerCm3:r,fillFraction:i,sealMm:a}=e,o=[[`massG`,`重量 (massG)`],[`bulkDensityGPerCm3`,`堆積密度 (bulkDensityGPerCm3)`],[`fillFraction`,`填充率 (fillFraction)`]],s={};for(let[n,r]of o){let i=e[n];typeof i!=`number`||!Number.isFinite(i)?t.push(`${r}必須是有限數字`):s[n]=i}return a===void 0?s.sealMm=eh:typeof a!=`number`||!Number.isFinite(a)?t.push(`封邊寬度 (sealMm) 必須是有限數字`):a<0?t.push(`封邊寬度 (sealMm) 不可為負`):s.sealMm=a,s.massG!==void 0&&s.massG<=0&&t.push(`重量 (massG) 必須大於 0`),s.bulkDensityGPerCm3!==void 0&&s.bulkDensityGPerCm3<=0&&t.push(`堆積密度 (bulkDensityGPerCm3) 必須大於 0`),s.fillFraction!==void 0&&!(s.fillFraction>0&&s.fillFraction<=1)&&t.push(`填充率 (fillFraction) 必須在 (0, 1] 之間`),{errors:t,values:t.length===0?s:null}}function ih(e){let{errors:t,values:n}=rh(e);if(n===null)return{ok:!1,errors:t};let{massG:r,bulkDensityGPerCm3:i,fillFraction:a,sealMm:o}=n,s=1e3*r/i,c=s/a;if(!Number.isFinite(s)||s<=0)return{ok:!1,errors:[s===0?`計算結果 underflow：物料體積趨近 0，無法估算（請調整重量或堆積密度）`:`計算結果 overflow：物料體積超出可計算範圍（請調整重量或堆積密度）`]};if(!Number.isFinite(c)||c<=0)return{ok:!1,errors:[c===0?`計算結果 underflow：所需體積趨近 0，無法估算（請調整填充率）`:`計算結果 overflow：所需體積超出可計算範圍（請調整輸入）`]};let l=Math.cbrt(c/((Qm-2*$m)*.8*.2)),u=Qm*l,d=u-2*$m*l,f=.8*l,p=.2*l,m=u+2*o,h=l+2*o,g=[[`effectiveFlat.length`,u],[`effectiveFlat.width`,l],[`outerFlat.length`,m],[`outerFlat.width`,h],[`formed.length`,d],[`formed.width`,f],[`formed.height`,p]],_=[];for(let[e,t]of g)!Number.isFinite(t)||t<=0?_.push(`計算結果 ${e} 不是有限正值（${t}）`):t>th&&_.push(`${e} ${t.toFixed(1)} mm 超過上限 ${th} mm（硬限制）`);return _.length>0?{ok:!1,errors:_}:{ok:!0,model:nh,productVolumeMm3:s,requiredVolumeMm3:c,effectiveFlat:{length:u,width:l},outerFlat:{length:m,width:h},formed:{length:d,width:f,height:p}}}var ah=Nm,oh=Pm,sh={gapL:0,gapW:0,gapH:0,wallClearanceL:0,wallClearanceW:0,headroom:0,topPad:0,bottomPad:0,boardThickness:4};function ch(e){return{ok:!1,candidates:[],errors:e}}function lh(e){return typeof e==`number`&&Number.isFinite(e)&&e>0}function uh(e){return typeof e==`number`&&Number.isSafeInteger(e)&&e>0}function dh(e){if(typeof e!=`object`||!e||Array.isArray(e))return ch([`input must be an object with itemL, itemW, itemH, unitsPerStack, stackCount`]);let{itemL:t,itemW:n,itemH:r,unitsPerStack:i,stackCount:a}=e,o=[];for(let[e,i]of[[`itemL`,t],[`itemW`,n],[`itemH`,r]])lh(i)?i>ah&&o.push(`${e} must be at most ${ah}`):o.push(`${e} must be a finite positive number (mm)`);if((!uh(i)||i>5e4)&&o.push(`unitsPerStack must be a positive safe integer at most ${Pm}`),(!uh(a)||a>oh)&&o.push(`stackCount must be a positive safe integer at most ${oh}`),o.length>0)return ch(o);if(i*a>5e4)return ch([`unitsPerStack × stackCount must be at most ${Pm}`]);let s={};for(let[t,n]of Object.entries(sh)){let r=e[t];r===void 0?s[t]=n:typeof r!=`number`||!Number.isFinite(r)||r<0?o.push(`${t} must be a finite non-negative number`):s[t]=r}if(o.length>0)return ch(o);let c=e.allowedStackGrids,l=null;if(c!==void 0){if(!Array.isArray(c)||c.length===0||!c.every(e=>Array.isArray(e)&&e.length===2&&uh(e[0])&&uh(e[1])))return ch([`allowedStackGrids must be a non-empty array of [cols, rows] positive integer pairs`]);if(l=c.map(([e,t])=>({cols:e,rows:t})),!l.some(e=>e.cols*e.rows===a))return ch([`stackCount ${a} does not match any allowed stack grid (${l.map(e=>`${e.cols}×${e.rows}`).join(`, `)})`])}let u=i,d=t===n,f=[],p=[],m=new Set,h=0,g=l?l.filter(e=>e.cols*e.rows===a):Array.from({length:a},(e,t)=>t+1).filter(e=>a%e===0).map(e=>({cols:e,rows:a/e}));for(let{cols:e,rows:i}of g)if(!(d&&e>i))for(let a of[!1,!0]){if(a&&(e===i||d))continue;let o=a?`${i}x${e}xfalse`:`${e}x${i}xfalse`;if(m.has(o))continue;m.add(o);let c=a?n:t,l=a?t:n,g=jm({itemL:c,itemW:l,itemH:r,cols:e,rows:i,layers:u,gapL:s.gapL,gapW:s.gapW,gapH:s.gapH,wallClearanceL:s.wallClearanceL,wallClearanceW:s.wallClearanceW,headroom:s.headroom,topPad:s.topPad,bottomPad:s.bottomPad,boardThickness:s.boardThickness});g.ok?f.push({id:`arr-${h++}-${e}x${i}x${u}${a?`r`:``}`,cols:e,rows:i,layers:u,rotated:a,itemL:c,itemW:l,itemH:r,estimate:g}):p.push(...g.errors.map(t=>`cols=${e}×rows=${i}${a?`（旋轉）`:``}：${t}`))}return f.length===0?ch(p.length>0?p:[`no feasible stack arrangement for the given inputs`]):{ok:!0,candidates:f,errors:[]}}var fh=[{id:`p-dividerThickness`,label:`十字隔板厚度`},{id:`p-wallClearanceL`,label:`長向壁距`},{id:`p-wallClearanceW`,label:`寬向壁距`},{id:`p-headroom`,label:`上方淨高`},{id:`p-topPad`,label:`天板厚度`},{id:`p-bottomPad`,label:`地板厚度`},{id:`p-boardThickness`,label:`紙箱厚度`}],ph=[[1,2],[2,2]],mh=e=>e.toFixed(2);function hh(e,t={}){let{onApply:n,getCurrentBox:r,onDraftChange:i}=t,a=t=>e.querySelector(`#`+t),o={massG:a(`p-massG`),bulkDensity:a(`p-bulkDensity`),fillPercent:a(`p-fillPercent`),sealMm:a(`p-sealMm`),unitsPerStack:a(`p-unitsPerStack`),stackCount:a(`p-stackCount`),allowanceL:a(`p-allowanceL`),allowanceW:a(`p-allowanceW`),thicknessCorrection:a(`p-thicknessCorrection`),calculate:a(`p-calculate`),modelResult:a(`p-model-result`),result:a(`p-result`),errors:a(`p-errors`),diagram:a(`p-diagram`),arrangement:a(`p-arrangement`),transfer:a(`p-transfer`),preview:a(`p-transfer-preview`),previewBody:e.querySelector(`#p-transfer-preview-body`),confirm:a(`p-confirm`),cancel:a(`p-cancel`)};for(let e of fh)o[e.id]=a(e.id);let s=Tm(a(`p-scene`)),c=1,l=null,u=null,d=null;function f(e){o.transfer.disabled=!e}function p(){o.preview.hidden=!0,o.previewBody.textContent=``}function m(){s.clear(),o.modelResult.hidden=!0,o.modelResult.textContent=``,o.result.hidden=!0,o.result.textContent=``,o.diagram.hidden=!0,o.diagram.textContent=``,o.arrangement.innerHTML=``,p(),f(!1)}function h(){c++,l=null,u=null,d=null,m(),Gm(o.errors),typeof i==`function`&&i()}function g(){let e=[{id:`p-massG`,label:`每袋重量（g）`},{id:`p-bulkDensity`,label:`堆積密度（g/cm³）`},{id:`p-fillPercent`,label:`填充率（%）`},{id:`p-sealMm`,label:`每邊封邊（mm）`},{id:`p-unitsPerStack`,label:`每堆件數`,integer:!0},{id:`p-stackCount`,label:`堆數`,integer:!0},{id:`p-allowanceL`,label:`長向每邊追加（mm）`},{id:`p-allowanceW`,label:`寬向每邊追加（mm）`},{id:`p-thicknessCorrection`,label:`單袋厚度修正（mm）`}];for(let t of fh)e.push({...t});let{values:t,errors:n}=Um(e=>a(e),e),r={massG:t[`p-massG`],bulkDensityGPerCm3:t[`p-bulkDensity`],fillFraction:t[`p-fillPercent`]/100,sealMm:t[`p-sealMm`],unitsPerStack:t[`p-unitsPerStack`],stackCount:t[`p-stackCount`],allowanceL:t[`p-allowanceL`],allowanceW:t[`p-allowanceW`],thicknessCorrection:t[`p-thicknessCorrection`]};for(let e of fh)e.id!==`p-dividerThickness`&&(r[e.id.replace(/^p-/,``)]=t[e.id]);return r.gapL=t[`p-dividerThickness`],r.gapW=t[`p-dividerThickness`],r.gapH=0,r.allowanceL<0&&n.push(`長向每邊追加（mm）不可為負`),r.allowanceW<0&&n.push(`寬向每邊追加（mm）不可為負`),r.thicknessCorrection<0&&n.push(`單袋厚度修正（mm）不可為負`),{raw:r,errors:n}}function _(e,t){let n=[[`模型`,nh],[`產品容積 productVolume`,`${mh(e.productVolumeMm3)} mm³`],[`所需容積 requiredVolume（÷填充率）`,`${mh(e.requiredVolumeMm3)} mm³`],[`有效平面 effectiveFlat`,`${mh(e.effectiveFlat.length)} × ${mh(e.effectiveFlat.width)} mm`],[`外封邊平面 outerFlat（含每邊封邊 ${mh(t.sealMm)} mm）`,`${mh(e.outerFlat.length)} × ${mh(e.outerFlat.width)} mm`],[`成形尺寸 formed（長×寬×高）`,`${mh(e.formed.length)} × ${mh(e.formed.width)} × ${mh(e.formed.height)} mm`],[`裝箱物品尺寸（成形＋每邊追加＋厚度修正）`,`${mh(t.itemL)} × ${mh(t.itemW)} × ${mh(t.itemH)} mm`]];o.modelResult.textContent=``;for(let[e,t]of n){let n=document.createElement(`div`);n.className=`pack-result-row`;let r=document.createElement(`span`);r.className=`pack-result-label`,r.textContent=e;let i=document.createElement(`span`);i.className=`pack-result-value`,i.textContent=t,n.appendChild(r),n.appendChild(i),o.modelResult.appendChild(n)}let r=document.createElement(`p`);r.className=`hint`,r.textContent=`本模型為 A4 折封經驗近似（封邊折向袋身內側、無側風琴），非製箱保證；成形尺寸不得直接当作紙箱內尺寸使用。`,o.modelResult.appendChild(r),o.modelResult.hidden=!1}function v(e){return`${e.cols}×${e.rows} 堆 × ${e.layers} 層${e.rotated?`（整體旋轉90°）`:``}`}function y(e,t,n){return[`袋體模型：${nh}。`,`每袋 ${e.massG} g ÷ 堆積密度 ${e.bulkDensityGPerCm3} g/cm³ ÷ 填充率 ${mh(e.fillFraction)} → 所需容積 ${mh(t.requiredVolumeMm3)} mm³。`,`每邊封邊 ${e.sealMm} mm 折向袋身內側（無側風琴）；成形 ${mh(t.formed.length)} × ${mh(t.formed.width)} × ${mh(t.formed.height)} mm。`,`物品尺寸＝成形長寬各加 2×每邊追加（${e.allowanceL}/${e.allowanceW} mm）＋單袋厚度修正 ${e.thicknessCorrection} mm（只加一次）＝ ${mh(e.itemL)} × ${mh(e.itemW)} × ${mh(e.itemH)} mm。`,`排列候選 ${v(n)}（cols×rows＝堆數 ${e.stackCount}，每堆 ${e.unitsPerStack} 件；袋裝僅允許 2 堆 1×2 或 4 堆 2×2，不列 1×4／4×1）；共 ${n.estimate.itemCount} 件。`,`十字隔板厚度 ${e.gapL} mm 同時套用於長向與寬向間距（無十字隔板時預設 1 mm）；層與層之間不預留間隙（高向間距固定 0 mm），上方空間由上方淨高 ${e.headroom} mm 保留。`,`紙箱尺寸由 estimateCarton 直接估算（不提前取整）；本模型為經驗近似，非製箱保證，未含抗壓驗證。`]}function b(e){let t=zm({source:`pouches`,revision:c,box:{boxL:e.estimate.transferBox.boxL,boxW:e.estimate.transferBox.boxW,boxH:e.estimate.transferBox.boxH},unitsPerCarton:e.estimate.itemCount,assumptions:y(l.raw,l.model,e)});if(!t.ok){d=null,f(!1),Wm(o.errors,t.errors);return}d=t.snapshot,Gm(o.errors),qm(o.result,{...e.estimate,grid:{cols:e.cols,rows:e.rows,layers:e.layers}},{countLabel:`袋`});let n=l.raw;o.diagram.textContent=``;let{svg:r,note:i}=Jm({cols:e.cols,rows:e.rows,layers:e.layers,itemL:e.itemL,itemW:e.itemW,itemH:e.itemH,gapL:n.gapL,gapW:n.gapW,shape:`rectangular`,occupied:e.estimate.occupied,inner:e.estimate.inner,outer:e.estimate.outer,itemCount:e.estimate.itemCount});o.diagram.appendChild(r),o.diagram.appendChild(i),o.diagram.hidden=!1,s.update({...n,itemL:e.itemL,itemW:e.itemW,itemH:e.itemH,cols:e.cols,rows:e.rows,layers:e.layers},e.estimate,`pouch`),p(),f(!0)}function x(){let{raw:e,errors:t}=g(),n=ih({massG:e.massG,bulkDensityGPerCm3:e.bulkDensityGPerCm3,fillFraction:e.fillFraction,sealMm:e.sealMm}),r=t.concat(n.ok?[]:n.errors);if(r.length>0){l=null,u=null,d=null,m(),Wm(o.errors,r);return}e.itemL=n.formed.length+2*e.allowanceL,e.itemW=n.formed.width+2*e.allowanceW,e.itemH=n.formed.height+e.thicknessCorrection;let i=dh({itemL:e.itemL,itemW:e.itemW,itemH:e.itemH,unitsPerStack:e.unitsPerStack,stackCount:e.stackCount,allowedStackGrids:ph,gapL:e.gapL,gapW:e.gapW,gapH:e.gapH,wallClearanceL:e.wallClearanceL,wallClearanceW:e.wallClearanceW,headroom:e.headroom,topPad:e.topPad,bottomPad:e.bottomPad,boardThickness:e.boardThickness});i.ok?(Gm(o.errors),l={model:n,raw:e},u=i.candidates,_(n,e),o.arrangement.innerHTML=``,i.candidates.forEach((e,t)=>{let n=document.createElement(`option`);n.value=String(t),n.textContent=`${v(e)}｜箱 ${e.estimate.transferBox.boxL}×${e.estimate.transferBox.boxW}×${e.estimate.transferBox.boxH} mm`,o.arrangement.appendChild(n)}),o.arrangement.value=`0`,b(i.candidates[0])):(l=null,u=null,d=null,m(),Wm(o.errors,i.errors))}function S(){if(!d)return;let e=Bm(d,{expectedRevision:c});if(!e.ok){d=null,f(!1),p(),Wm(o.errors,e.errors);return}let t=typeof r==`function`?r():null;Ym(o.previewBody,{sourceLabel:`袋裝`,snapshot:d,oldBox:t}),o.preview.hidden=!1}function C(){if(!d)return;let e=Bm(d,{expectedRevision:c});if(!e.ok){d=null,f(!1),p(),Wm(o.errors,e.errors);return}let t=typeof n==`function`?n(e.snapshot):{ok:!1,errors:[`未提供 onApply`]};t&&t.ok?(p(),o.transfer.disabled=!0):Wm(o.errors,t&&t.errors||[`帶入失敗`])}let w=[o.massG,o.bulkDensity,o.fillPercent,o.sealMm,o.unitsPerStack,o.allowanceL,o.allowanceW,o.thicknessCorrection,...fh.map(e=>o[e.id])];for(let e of w)e.addEventListener(`input`,h);return o.stackCount.addEventListener(`change`,h),o.arrangement.addEventListener(`change`,()=>{if(!u)return;let e=Number(o.arrangement.value),t=u[e];t&&(c++,typeof i==`function`&&i(),b(t))}),o.calculate.addEventListener(`click`,x),o.transfer.addEventListener(`click`,S),o.confirm.addEventListener(`click`,C),o.cancel.addEventListener(`click`,p),f(!1),{invalidate:h,getRevision:()=>c,getSnapshot:()=>d}}var $=e=>document.getElementById(e),gh=[`palletL`,`palletW`,`palletH`,`boxL`,`boxW`,`boxH`,`maxTotalH`],_h=null,vh=null,yh=null,bh=0,xh=null,Sh=null,Ch=null,wh=null;function Th(){let e={};for(let t of gh){let n=$(t).value.trim();e[t]=n===``?void 0:Number(n)}return e}function Eh(){yh&&(clearTimeout(yh),yh=null)}function Dh(){Eh(),_h&&(_h.terminate(),_h=null),vh&&(URL.revokeObjectURL(vh),vh=null)}function Oh(){if(_h)return _h;try{let e=te(I,F),t=new Blob([e],{type:`application/javascript`});vh=URL.createObjectURL(t),_h=new Worker(vh),_h.onmessage=e=>{e.data&&e.data.reqId===bh&&(Eh(),Fh(e.data.result))},_h.onerror=e=>{e&&typeof e.preventDefault==`function`&&e.preventDefault();let t=yh!==null;Dh(),t&&Ph([`計算中斷（solver worker 異常結束）。請調整輸入後按「計算最佳排法」重試。`])}}catch{Dh()}return _h}function kh(){Ch&&Ch.clearResult(),wh&&wh.clear()}function Ah(){xh=null,zh=null,$(`statsCard`).hidden=!0,$(`viewerCard`).hidden=!0,$(`message`).hidden=!0,$(`candidateCard`).hidden=!0,Rh(),kh()}function jh(){let e=$(`modeSelect`);return e&&e.value===`templates`?`templates`:`classic`}function Mh(){bh++;let e=Th(),t=h(e);if(!t.ok){Dh(),Ah(),Ph(t.errors);return}Ah(),$(`compute`).disabled=!0,$(`compute`).textContent=`計算中…`;let n=jh(),r=Oh();if(r)r.postMessage({reqId:bh,input:e,mode:n}),yh=setTimeout(()=>{yh=null,Dh(),Ph([`計算逾時已中止（超過 ${Math.round((m.solverDeadlineMs+3e3)/1e3)} 秒）。請縮小尺寸或改用更大的紙箱後重試。`])},m.solverDeadlineMs+3e3);else{let t=bh,r=n===`templates`?P(e):T(e);setTimeout(()=>{t===bh&&Fh(r)},0)}}function Nh(){$(`compute`).disabled=!1,$(`compute`).textContent=`計算最佳排法`}function Ph(e){Nh(),xh=null,$(`statsCard`).hidden=!0,$(`viewerCard`).hidden=!0,Rh();let t=$(`errors`);t.hidden=!1,t.innerHTML=`<ul>`+e.map(e=>`<li>${e}</li>`).join(``)+`</ul>`,$(`message`).hidden=!0}function Fh(e){if(Nh(),$(`errors`).hidden=!0,!e.ok){Ph(e.errors);return}if(e.mode===`templates`||e.layerPattern===`AB`){Vh(e);return}xh=e,$(`candidateCard`).hidden=!0;let t=$(`message`);e.message?(t.hidden=!1,t.textContent=e.message):t.hidden=!0,$(`statPerLevel`).textContent=e.perLevel,$(`statLevels`).textContent=e.levels,$(`statTotal`).textContent=e.totalBoxes,$(`statHeight`).textContent=`${e.totalHeightUsed} mm（上限 ${e.maxTotalH}）`,$(`statUtil`).textContent=(e.utilization*100).toFixed(1)+`%`;let n=$(`statOpt`);e.optimality===`proved`?(n.textContent=`此直立逐層模型已證明最優`,n.className=`v proved`):(n.textContent=`最佳已找到方案`,n.className=`v found`);let r=$(`solverNote`);e.solverNote?(r.hidden=!1,r.textContent=e.solverNote):r.hidden=!0,$(`statsCard`).hidden=!1,$(`viewerCard`).hidden=e.perLevel===0||e.levels===0,$(`viewerCard`).hidden||Ih(e)}function Ih(e){Sh||(Sh=If($(`canvas3d`)),$(`canvas3d`).addEventListener(`viewchange`,e=>{document.querySelectorAll(`#viewerCard [data-view]`).forEach(t=>{let n=t.dataset.view===e.detail.view;t.classList.toggle(`active`,n),t.setAttribute(`aria-pressed`,String(n))})}),window.addEventListener(`resize`,()=>Sh.resize())),Sh.build(e),Sh.resize();let t=$(`layerSelect`);t.innerHTML=`<option value="all">全部層</option>`;let n=e.layerPattern===`AB`;for(let r=0;r<e.levels;r++){let i=document.createElement(`option`);i.value=String(r),i.textContent=n?`第 ${r+1} 層（${e.perLevel} 箱・層型 ${r%2==0?`A`:`B`}）`:`第 ${r+1} 層（${e.perLevel} 箱）`,t.appendChild(i)}let r=$(`renderNote`);e.totalBoxes>3e3?(r.hidden=!1,r.textContent=`總箱數 ${e.totalBoxes} 超過渲染上限 ${Of}，3D 僅顯示部分層（統計與匯出不受影響）。`):r.hidden=!0,Lh()}function Lh(){let e=$(`viewerSummary`);if(!e)return;if(!Sh){e.textContent=``;return}let t=Sh.pngInfoLines();if(!t||t.length===0){e.textContent=``;return}let n=document.createElement(`ul`);for(let e of t){let t=document.createElement(`li`);t.textContent=e,n.appendChild(t)}e.replaceChildren(n)}function Rh(){let e=$(`viewerSummary`);e&&(e.textContent=``)}var zh=null;function Bh(e){let t=[];return e.aOk||t.push(`A 變體放不下（${e.aError}）`),e.bOk||t.push(`B 變體放不下（${e.bError}）`),t.join(`；`)||`不適用`}function Vh(e){zh=e,xh=null;let t=$(`message`),n=$(`candidateCard`);n.hidden=!1;let r=$(`candidateList`);r.innerHTML=``;for(let t of e.candidates){let n=document.createElement(`li`);n.className=`candidate`+(t.applicable?``:` na`);let i=t.applicable?`<span class="cand-boxes">${t.boxCount} 箱/層</span>`:`<span class="cand-na">不適用</span>`;n.innerHTML=`<strong>${t.patternId} 箱・${t.patternName}</strong> ${i}`+(t.applicable?`<span class="cand-note">層數 ${e.levels}・總 ${t.boxCount*e.levels} 箱</span>`:`<span class="cand-note">${Bh(t)}</span>`),r.appendChild(n)}let i=$(`candidateSelect`);i.innerHTML=``;let a=e.candidates.filter(e=>e.applicable);for(let e of a){let t=document.createElement(`option`);t.value=e.patternId,t.textContent=`${e.patternId} 箱模板（${e.patternName}，${e.boxCount} 箱/層）`,i.appendChild(t)}a.length===0?(i.innerHTML=`<option value="">（無適用模板）</option>`,i.disabled=!0,$(`statsCard`).hidden=!0,$(`viewerCard`).hidden=!0,t.hidden=!1,t.textContent=e.message||`五種固定箱數模板在此棧板與紙箱尺寸下皆不適用（見上方各模板不適用原因）。可改用「通用最佳化」模式。`):(i.disabled=!1,i.value=e.bestPatternId,Hh(a.find(t=>t.patternId===e.bestPatternId)))}function Hh(e){let t=zh;kh(),xh={ok:!0,mode:`templates`,input:t.input,palletL:t.palletL,palletW:t.palletW,palletH:t.palletH,boxL:t.boxL,boxW:t.boxW,boxH:t.boxH,maxTotalH:t.maxTotalH,usableHeight:t.usableHeight,levels:t.levels,perLevel:e.boxCount,totalBoxes:e.boxCount*t.levels,totalHeightUsed:t.totalHeightUsed,utilization:e.boxCount*t.boxL*t.boxW/(t.palletL*t.palletW),areaUpperBound:t.areaUpperBound,layout:e.layouts.A,layouts:{A:e.layouts.A,B:e.layouts.B},layerPattern:`AB`,patternId:e.patternId,patternName:e.patternName,support:e.support,optimality:e.patternId===t.bestPatternId?`template-best`:`template-selected`,noFit:t.levels===0,message:null,limits:t.limits,algorithm:t.algorithm};let n=$(`message`);n.hidden=t.levels>0,t.levels===0&&(n.textContent=`扣除棧板高度後，可用高度不足一層紙箱高度，無法堆疊。`),$(`statPerLevel`).textContent=e.boxCount,$(`statLevels`).textContent=t.levels,$(`statTotal`).textContent=xh.totalBoxes,$(`statHeight`).textContent=`${t.totalHeightUsed} mm（上限 ${t.maxTotalH}，頂面高度）`,$(`statUtil`).textContent=(xh.utilization*100).toFixed(1)+`%`;let r=$(`statOpt`);r.textContent=e.patternId===t.bestPatternId?`五種固定模板中箱數最多者（非全域最佳證明）`:`手動選取模板（非五模板最多箱方案；非全域最佳證明）`,r.className=`v found`;let i=$(`solverNote`),a=[`模板 ${e.patternId}「${e.patternName}」：底層 A、二層 B 交替（每層同布局）。`];if(e.support){let t=e=>`${(e.minRatio*100).toFixed(1)}%`;a.push(`支撐比例：A→B 最低 ${t(e.support.aToB)}、B→A 最低 ${t(e.support.bToA)}（下層矩形不重疊，以聯集交集面積估算）。`),(e.support.aToB.hasHole||e.support.bToA.hasHole)&&a.push(`警示：模板含中央孔或局部支撐不足，上層可能有箱未獲完整支撐。`)}a.push(`注意：幾何可行不等同運輸安全認證；未完整支撐之排法請自行評估。`),i.hidden=!1,i.textContent=a.join(``),$(`statsCard`).hidden=!1,$(`viewerCard`).hidden=t.levels===0,t.levels>0&&Ih(xh)}$(`candidateSelect`).addEventListener(`change`,e=>{if(!zh)return;let t=zh.candidates.find(t=>t.applicable&&t.patternId===e.target.value);t&&Hh(t)}),$(`compute`).addEventListener(`click`,Mh);for(let e of[...gh,`modeSelect`])$(e).addEventListener(e===`modeSelect`?`change`:`input`,()=>{bh++,Dh(),Nh(),Ah(),$(`errors`).hidden=!0});var Uh={"1100x1100":[1100,1100],"1200x1000":[1200,1e3]};$(`palletPresetSelect`).addEventListener(`change`,e=>{let t=Uh[e.target.value];t&&($(`palletL`).value=String(t[0]),$(`palletW`).value=String(t[1]),$(`palletL`).dispatchEvent(new Event(`input`,{bubbles:!0})))});function Wh(){let e=Number($(`palletL`).value.trim()),t=Number($(`palletW`).value.trim()),n=Object.entries(Uh).find(([,[n,r]])=>e===n&&t===r);$(`palletPresetSelect`).value=n?n[0]:`custom`}$(`palletL`).addEventListener(`input`,Wh),$(`palletW`).addEventListener(`input`,Wh),Wh(),$(`layerSelect`).addEventListener(`change`,e=>{Sh&&(Sh.applyLevel(e.target.value),Lh())}),document.querySelectorAll(`#viewerCard [data-view]`).forEach(e=>{e.addEventListener(`click`,()=>{Sh&&Sh.setView(e.dataset.view)})}),$(`exportPng`).addEventListener(`click`,()=>{if(!Sh)return;let e=document.createElement(`a`);e.href=Sh.pngDataUrl(),e.download=`pallet-stack.png`,e.click()}),$(`exportJson`).addEventListener(`click`,()=>{if(!xh)return;let e=xh,t=e.layerPattern===`AB`,n=2e4,r=e.totalBoxes>n,i=n=>t&&n%2==1?e.layouts.B:e.layouts.A,a={generatedAt:new Date().toISOString(),model:e.algorithm,input:e.input,levels:e.levels,perLevel:e.perLevel,totalBoxes:e.totalBoxes,totalHeightUsed:e.totalHeightUsed,utilization:e.utilization,areaUpperBound:e.areaUpperBound,optimality:e.optimality,layout:t?e.layouts.A:e.layout,boxes3D:r?null:e.layout.flatMap((n,r)=>Array.from({length:e.levels},(a,o)=>{let s=t?i(o)[r]:n;return{index:o*e.perLevel+r,level:o+1,layerPattern:t?o%2==0?`A`:`B`:null,x:s.x,y:s.y,z:e.palletH+o*e.boxH,w:s.w,d:s.h,h:e.boxH,rot:s.rot}})),boxes3DNote:r?`總箱數 ${e.totalBoxes} 超過展開上限 ${n}：每層布局相同，請以 layout（單層座標）× levels 還原 3D 座標（z = palletH + (level-1) × boxH）。`:null};t&&(a.layerPattern=`AB`,a.patternId=e.patternId,a.patternName=e.patternName,a.layouts={A:e.layouts.A,B:e.layouts.B},a.support=e.support,a.layerPatternNote=`層型交替：level 為奇數（1,3,5…）用 layouts.A，偶數（2,4,6…）用 layouts.B。`,r&&(a.boxes3DNote=`總箱數 ${e.totalBoxes} 超過展開上限 ${n}：請以 layouts（A/B 單層座標）× levels 還原 3D 座標（z = palletH + (level-1) × boxH；level 奇數用 A、偶數用 B）。`));let o=new Blob([JSON.stringify(a,null,2)],{type:`application/json`}),s=document.createElement(`a`);s.href=URL.createObjectURL(o),s.download=`pallet-stack.json`,s.click(),setTimeout(()=>URL.revokeObjectURL(s.href),2e3)});var Gh=[`ok`,`noFit`,`error`,`inputs`,`quantities`,`floor`,`floorSearched`,`floorInput`,`floorCapacity`,`requiredPallets`,`loadedPallets`,`unplacedPallets`,`tailPlaced`,`maxPlacedPalletHeightMm`,`pallets`,`layerModels`,`loadedBoxes`,`unloadedBoxes`,`boxesPerLayer`,`capacityPerPallet`,`worldTransform`,`warnings`,`scopeNote`];function Kh(e){let t={generatedAt:new Date().toISOString()};for(let n of Gh)n in e&&(t[n]=e[n]);let n=new Blob([JSON.stringify(t,null,2)],{type:`application/json`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`container-plan.json`,i.click(),setTimeout(()=>URL.revokeObjectURL(r),2e3)}Ch=Xf($(`containerHost`),{onCalculate:e=>{let t=zp(e,Th(),xh),n=t.ok?Fp(t.input):t;Ch.renderPlan(n),n.ok?wh.setPlan(n):wh.clear()},onInvalidate:()=>{wh&&wh.clear()},onExport:e=>Kh(e)}),wh=pm($(`containerSceneHost`)),vm({window,document});var qh=$(`packagingSource`),Jh=null;function Yh(e,{stale:t=!1}={}){let n=`紙箱尺寸來源：${e.source===`bottles`?`瓶裝確認帶入`:e.source===`pouches`?`袋裝確認帶入`:e.source}（快照修訂 #${e.revision}，每箱 ${e.unitsPerCarton} 件，${e.box.boxL} × ${e.box.boxW} × ${e.box.boxH} mm）`;return t?`${n}；上游草稿已修改，此快照已過期（下游輸入與已確認結果不變，需重新確認帶入）`:n}function Xh(e){let t=Bm(e);if(!t.ok)return{ok:!1,errors:t.errors};let n=t.snapshot;$(`boxL`).value=String(n.box.boxL),$(`boxW`).value=String(n.box.boxW),$(`boxH`).value=String(n.box.boxH),Jh=n,qh.textContent=Yh(n),bh++,Dh(),Nh(),Ah();let r=$(`errors`);return r&&(r.textContent=``,r.hidden=!0),window.location.hash=`#pallet`,{ok:!0}}Zm($(`bottleHost`),{getCurrentBox:()=>{let e=Number($(`boxL`).value),t=Number($(`boxW`).value),n=Number($(`boxH`).value);return Number.isFinite(e)&&Number.isFinite(t)&&Number.isFinite(n)?{boxL:e,boxW:t,boxH:n}:null},onApply:Xh,onDraftChange:()=>{Jh&&Jh.source===`bottles`&&(qh.textContent=Yh(Jh,{stale:!0}))}}),hh($(`pouchHost`),{getCurrentBox:()=>{let e=Number($(`boxL`).value),t=Number($(`boxW`).value),n=Number($(`boxH`).value);return Number.isFinite(e)&&Number.isFinite(t)&&Number.isFinite(n)?{boxL:e,boxW:t,boxH:n}:null},onApply:Xh,onDraftChange:()=>{Jh&&Jh.source===`pouches`&&(qh.textContent=Yh(Jh,{stale:!0}))}});for(let e of[`boxL`,`boxW`,`boxH`])$(e).addEventListener(`input`,()=>{Jh=null,qh.textContent=`紙箱尺寸來源：手動修改`});