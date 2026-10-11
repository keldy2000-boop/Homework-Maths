/* Drawing helpers for the step-by-step walkthroughs.
   Every homework file can use these as globals. See .claude/skills/new-homework/visuals.md */
const NB=' ';
const BOX='<span class="qbox"></span>';
const fr=(n,d)=>`<span class="frac"><span>${n}</span><span>${d}</span></span>`;
const D=t=>`style="--d:${t}s"`;
function life(s,k,r=null,ad=0,rd=0,a='pop'){
  if(s<k) return null;
  if(s===k) return {c:a,d:ad};
  if(r!==null&&s===r) return {c:'away',d:rd};
  if(r!==null&&s>r) return {c:'gone',d:0};
  return {c:'',d:0};
}
const sty=(L,x='')=>`style="--d:${L.d}s;${x}"`;
const el=(tag,cls,L,inner='')=>L?`<${tag} class="${cls} ${L.c}" ${sty(L)}>${inner}</${tag}>`:'';
const pen=(t,cls='',anim='',d=0)=>`<div class="pen ${cls} ${anim}" ${anim?D(d):''}>${t}</div>`;
const R=(...c)=>({cells:c});
const CR=(...c)=>({cells:c,cr:1});
const QB={t:'<span class="qb">?</span>'};
const MQ='<span class="rose">?</span>';
const hc=(t,on)=>({t,c:on?'on':''});
const wd=(s,k,t,d=0)=>s>=k?{t:`<span class="wr ${s===k?'write':''}" ${s===k?D(d):''}>${t}</span>`}:QB;
const carry=(s,k,t,d,hx,hy,on)=>s>=k?{t:`<span class="${s===k?'hop':''}" style="--d:${d}s;--hx:${hx};--hy:${hy}">${t}</span>`,c:on?'on':''}:{t:''};
const rl=t=>({t:`<small class="rl">${t}</small>`});

function colm(c,rows,cls=''){
  const tpl=Array.isArray(c)?c.map(w=>w==='.'?'.9rem':'var(--cw)').join(' '):`repeat(${c},var(--cw))`;
  let h=`<div class="colm ${cls}" style="grid-template-columns:${tpl}">`;
  for(const r of rows){
    if(r==='-'){h+='<i class="rule"></i>';continue;}
    for(const cell of r.cells){
      const o=(cell&&typeof cell==='object')?cell:{t:cell||''};
      h+=`<span class="${r.cr?'cr ':''}${o.c||''}">${o.t||''}</span>`;
    }
  }
  return h+'</div>';
}
function bar(s,k,whole,parts,kp,wcls=''){
  let h=`<div class="bm"><div class="whole ${wcls} ${s===k?'fade':''}">${whole}</div>`;
  if(s>=kp){
    h+='<div class="parts">';
    parts.forEach((p,i)=>{h+=`<div class="part ${p.c||''} ${s===kp?'pop':''}" style="flex:${p.f} 1 0px;--d:${s===kp?0.3+i*0.15:0}s">${p.t}</div>`;});
    h+='</div>';
  }
  return h+'</div>';
}
function bus(s,o){
  const n=o.ds.length,hi=o.hl?o.hl(s):-1;
  let top='',ins='';
  for(let i=0;i<n;i++){
    const tp=o.top[i];let c='';
    if(tp){
      if(tp.w!=null&&s>=tp.w) c=`<span class="wr ${s===tp.w?'write':''}" ${s===tp.w?D(.3):''}>${tp.t}</span>`;
      else if(tp.q!=null&&s>=tp.q) c=QB.t;
    }
    top+=`<span class="c">${c}</span>`;
    const cr=(o.carries||[]).find(x=>x.i===i);
    const sup=(cr&&s>=cr.k)?`<span class="sup ${s===cr.k?'hop':''}" style="--d:${cr.d??0.8}s;--hx:-2.3rem;--hy:0rem">${cr.t}</span>`:'';
    ins+=`<span class="c ${i===hi?'on':''}">${sup}${o.ds[i]}</span>`;
  }
  return `<div class="bus ${s===o.k0?'fade':''}"><span></span><div class="top">${top}</div><span class="dv">${o.dv}</span><div class="in">${ins}</div></div>`;
}
function pvGrid(s,o){
  const W=o.cols.map(c=>c==='.'?0.9:2.3);
  const X=[];let acc=0;W.forEach(w=>{X.push(acc+w/2);acc+=w;});
  const dcols=o.cols.map((c,i)=>c==='.'?-1:i).filter(i=>i>=0);
  const cells=o.cols.map(c=>c==='.'?'<b class="pt">.</b>':'');
  const sh=s>=o.kShift;
  for(const [k,dig] of Object.entries(o.from)){
    const ci=+k;
    if(!sh){cells[ci]=`<span>${dig}</span>`;continue;}
    const ni=dcols[dcols.indexOf(ci)+o.shift];
    const dx=(X[ci]-X[ni]).toFixed(2);
    const faint=o.faint&&o.faint.i===ni&&s>=o.faint.k;
    cells[ni]=`<span class="${s===o.kShift?'slide':''} ${faint?'faint':''}" style="--d:.3s;--hx:${dx}rem">${dig}</span>`;
  }
  (o.zeros||[]).forEach(z=>{if(s>=z.k)cells[z.i]=`<span class="rose ${s===z.k?'pop':''}" ${D(.3)}>0</span>`;});
  let h=`<div class="pvg ${s===o.k0?'fade':''}" style="grid-template-columns:${W.map(w=>w+'rem').join(' ')}">`;
  o.cols.forEach(c=>h+=`<span class="pvgh">${c==='.'?'':c}</span>`);
  cells.forEach((c,i)=>h+=`<span class="pvgc ${o.cols[i]==='.'?'ptc':''}">${c}</span>`);
  return h+'</div>';
}
function splitBar(s,o){
  const N=o.n*o.m;
  let h=`<div class="sbar ${s===o.k0?'fade':''}" style="grid-template-columns:repeat(${N},1fr)">`;
  for(let i=0;i<N;i++){
    const big=Math.floor(i/o.m),first=i%o.m===0;
    const L=big<o.shade?life(s,o.kShade,null,big*0.25):null;
    const on=!first&&s>=o.kSplit,grow=on&&s===o.kSplit;
    h+=`<i class="${first&&i>0?'thick':''} ${first?'':'thin'} ${on?'on':''} ${grow?'grow':''}" ${grow?D(0.2+big*0.2):''}>${L?`<b class="${L.c}" ${sty(L)}></b>`:''}</i>`;
  }
  return h+'</div>';
}
function plainBar(N,shaded,cls=''){
  let h=`<div class="sbar solid" style="grid-template-columns:repeat(${N},1fr)">`;
  for(let i=0;i<N;i++) h+=`<i>${i<shaded?`<b class="${cls}"></b>`:''}</i>`;
  return h+'</div>';
}
function isoCube(){
  const A=[60,8],B=[112,38],C=[60,68],Dp=[8,38],F=[112,98],G=[60,128],H=[8,98];
  const L=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
  const ln=(p,q)=>`<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}"/>`;
  const pts=a=>a.map(p=>p.join(',')).join(' ');
  let g=`<svg class="cube3 pop" viewBox="0 0 120 136" aria-hidden="true"><polygon class="ct" points="${pts([A,B,C,Dp])}"/><polygon class="cl" points="${pts([Dp,C,G,H])}"/><polygon class="cr2" points="${pts([C,B,F,G])}"/><g class="cg">`;
  for(const t of [1/3,2/3]){
    g+=ln(L(A,Dp,t),L(B,C,t))+ln(L(A,B,t),L(Dp,C,t));
    g+=ln(L(Dp,C,t),L(H,G,t))+ln(L(Dp,H,t),L(C,G,t));
    g+=ln(L(C,B,t),L(G,F,t))+ln(L(C,G,t),L(B,F,t));
  }
  return g+'</g></svg>';
}
function deal(s,n,groups,kDeal,kPick,picks){
  // n counters dealt round-robin into groups
  let h='<div class="groups">';
  const per=n/groups;
  for(let g=0;g<groups;g++){
    h+=`<div class="grp ${s>=kPick&&picks.includes(g)?'pick':''}">`;
    for(let j=0;j<per;j++) h+=el('span','dot d-one',life(s,kDeal,null,0.2+(j*groups+g)*0.1));
    h+='</div>';
  }
  return h+'</div>';
}

/* ---- extra helpers for younger work (Year 4) ---- */
// number line from a to b; marks: [{v,t,k}] shown from step k; jumps: [{from,to,t,k}] arcs shown from step k
function numLine(s,o){
  const a=o.a,b=o.b,span=b-a,step=o.step||1,W=300,pad=14,x=v=>pad+(v-a)/span*(W-2*pad);
  let g=`<svg class="nline ${s===o.k0?'fade':''}" viewBox="0 0 ${W} 96" aria-hidden="true"><line x1="${pad}" y1="64" x2="${W-pad}" y2="64" class="nl-axis"/>`;
  for(let v=a;v<=b+1e-9;v+=step){
    const lab=o.labelEvery?((Math.round((v-a)/step)%o.labelEvery)===0):true;
    g+=`<line x1="${x(v)}" y1="58" x2="${x(v)}" y2="70" class="nl-tick"/>`;
    if(lab) g+=`<text x="${x(v)}" y="88" class="nl-lab">${+v.toFixed(4)}</text>`;
  }
  (o.jumps||[]).forEach((j,i)=>{if(s<j.k)return;const x1=x(j.from),x2=x(j.to),mx=(x1+x2)/2,h=Math.min(40,Math.abs(x2-x1)/2+8);
    g+=`<path d="M${x1} 60 Q${mx} ${60-h*1.6} ${x2} 60" class="nl-jump ${s===j.k?'draw':''}" style="--d:${(j.d??i*0.5)}s"/>`;
    if(j.t) g+=`<text x="${mx}" y="${60-h*0.9}" class="nl-jt ${s===j.k?'fade':''}" style="--d:${(j.d??i*0.5)+.3}s">${j.t}</text>`;});
  (o.marks||[]).forEach(m=>{if(s<m.k)return;g+=`<circle cx="${x(m.v)}" cy="64" r="6" class="nl-mark ${s===m.k?'pop':''}"/>`;if(m.t)g+=`<text x="${x(m.v)}" y="40" class="nl-mt">${m.t}</text>`;});
  return g+'</svg>';
}
// analogue clock showing h:m
function clock(h,m,cls=''){
  const ang=(v,max)=>v/max*Math.PI*2,hx=(r,a)=>(60+r*Math.sin(a)).toFixed(1),hy=(r,a)=>(60-r*Math.cos(a)).toFixed(1);
  let g=`<svg class="clock ${cls}" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" class="ck-face"/>`;
  for(let i=1;i<=12;i++){const a=ang(i,12);g+=`<text x="${hx(38,a)}" y="${hy(38,a)}" class="ck-n">${i}</text>`;}
  for(let i=0;i<60;i++){const a=ang(i,60),r1=i%5?51:48;g+=`<line x1="${hx(r1,a)}" y1="${hy(r1,a)}" x2="${hx(53,a)}" y2="${hy(53,a)}" class="ck-t"/>`;}
  const ha=ang((h%12)+m/60,12),ma=ang(m,60);
  g+=`<line x1="60" y1="60" x2="${hx(28,ha)}" y2="${hy(28,ha)}" class="ck-h"/><line x1="60" y1="60" x2="${hx(44,ma)}" y2="${hy(44,ma)}" class="ck-m"/><circle cx="60" cy="60" r="3.5" class="ck-c"/>`;
  return g+'</svg>';
}
// Base 10: h hundreds squares, t tens sticks, o ones cubes; shown from step k
function base10(s,k,h,t,o){
  const L=life(s,k);if(!L) return '';
  let g=`<div class="b10 ${L.c}" ${sty(L)}>`;
  for(let i=0;i<h;i++) g+='<span class="b10h"></span>';
  for(let i=0;i<t;i++) g+='<span class="b10t"></span>';
  g+='<span class="b10o">'+'<i></i>'.repeat(o)+'</span>';
  return g+'</div>';
}
// simple row of n counters, first `hl` highlighted
function counters(s,k,n,hl=0,perRow=10){
  const L=life(s,k);if(!L) return '';
  let g=`<div class="ctrs" style="grid-template-columns:repeat(${Math.min(n,perRow)},1.05rem)">`;
  for(let i=0;i<n;i++) g+=`<span class="dot ${i<hl?'':'d-one'} ${s===k?'pop':''}" ${s===k?D(i*0.04):''}></span>`;
  return g+'</div>';
}
// plain walkthrough when a question has no custom draw(): shows the question, then notes[s]
function notesDraw(q,s){
  let h=pen(q.q);
  const n=q.notes&&q.notes[s];
  if(n) h+=pen(n,'rose','write',.3);
  return h;
}
