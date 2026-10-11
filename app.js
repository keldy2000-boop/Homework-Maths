/* ---------- app ---------- */
const FRAC='text',SPEECH=false;
const $=id=>document.getElementById(id);
const picker=$('picker'),home=$('home'),lesson=$('lesson'),results=$('results'),tiles=$('tiles'),stage=$('stage'),sayEl=$('say'),dots=$('dots'),
      prevB=$('prev'),nextB=$('next'),fb=$('fb'),inputs=$('inputs'),how=$('how'),locked=$('locked'),
      showHow=$('showHow'),again=$('again');
const PRAISE=["Yes! That's right.","Brilliant, you got it!","Spot on! Well done.","Nailed it! Great thinking."];
let cur=0,step=0;
let KID=null,WEEK=null,Q=[],TOPICS=[],APP='';

/* ---- homework files ---- */
window.HW=window.HW||{};
HW.loaded=HW.loaded||{};
HW.week=def=>{HW.loaded[def.child+'/'+def.id]=def;};
const kids=()=>HW.children||{};
const storeKey=(c,w)=>w.store||('hw-'+c+'-'+w.id);
function loadWeek(c,w,cb){
  const k=c+'/'+w.id;
  if(HW.loaded[k]) return cb(HW.loaded[k]);
  const s=document.createElement('script');
  s.src=w.file+(w.v?'?v='+w.v:'');
  s.onload=()=>cb(HW.loaded[k]||null);
  s.onerror=()=>cb(null);
  document.head.appendChild(s);
}
function weekProgress(c,w){
  let S={};try{S=JSON.parse(localStorage.getItem(storeKey(c,w)+'-state')||'{}')||{};}catch(e){}
  let own=0,help=0;Object.values(S).forEach(x=>{if(x&&x.s){if(x.h)help++;else own++;}});
  return {own,help,done:own+help,n:w.count||0};
}
const fmtDate=d=>{try{return new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long'});}catch(e){return d;}};
const weekLabel=w=>w.title+(w.date?' · '+fmtDate(w.date):'');

/* ---- routing: #year6, #year4/2026-10-12 ---- */
function route(){
  stopSpeak();
  const [c,wid]=decodeURIComponent(location.hash.replace(/^#/,'')).split('/');
  const K=kids()[c];
  if(!K){showPicker();return;}
  KID=c;
  const weeks=K.weeks||[];
  const w=(wid&&weeks.find(x=>x.id===wid))||weeks[weeks.length-1];
  if(!w){WEEK=null;Q=[];showHome();return;}
  loadWeek(c,w,def=>{
    if(!def){WEEK=null;Q=[];showHome("Couldn't load this week's homework. Try refreshing the page.");return;}
    WEEK=w;Q=def.questions;TOPICS=def.topics||[];APP=storeKey(c,w);loadST();showHome();
  });
}
window.addEventListener('hashchange',route);
function go(c,wid){const h='#'+c+(wid?'/'+wid:'');if(location.hash===h)route();else location.hash=h;}

function showOnly(sec){[picker,home,lesson,results].forEach(x=>x.hidden=x!==sec);window.scrollTo(0,0);}
function showPicker(){
  document.title='Homework helper';
  $('who').innerHTML=Object.entries(kids()).map(([c,K],i)=>{
    const w=(K.weeks||[]).slice(-1)[0];
    let sub='No homework yet';
    if(w){const p=weekProgress(c,w);sub=`${w.title}: ${p.done} of ${p.n} done`;}
    return `<button class="kid k${i%2}" data-c="${c}"><span class="av">${K.name[0]}</span><span><b>${K.name}</b><span>${sub}</span></span></button>`;
  }).join('');
  showOnly(picker);
}
$('who').addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(b)go(b.dataset.c);});

/* ---- progress (kept on this device) ---- */
let ST={};
function loadST(){try{ST=JSON.parse(localStorage.getItem(APP+'-state')||'{}')||{};}catch(e){ST={};}}
function saveST(){try{localStorage.setItem(APP+'-state',JSON.stringify(ST));}catch(e){}}
function st(i){if(!ST[i])ST[i]={t:0,s:0,h:0,u:0,a:[]};if(!ST[i].a)ST[i].a=[];return ST[i];}
const qlab=i=>Q[i]&&Q[i].n!=null?Q[i].n:i+1;

/* ---- home ---- */
function showHome(err){
  const K=kids()[KID];
  document.title=K.name+"'s homework helper";
  $('homeTitle').textContent=K.name+"'s homework helper";
  $('wkName').textContent=WEEK?weekLabel(WEEK):'';
  $('homeBody').hidden=!WEEK;
  $('noWork').hidden=!!WEEK;
  $('noWork').textContent=err||'No homework here yet. Check back soon!';
  $('reset').hidden=!WEEK;
  if(WEEK) renderHome();
  const weeks=(K.weeks||[]).slice().reverse();
  $('past').innerHTML=weeks.length>1?'<h2>All my homework</h2><ul>'+weeks.map(w=>{
    const p=weekProgress(KID,w),me=WEEK&&w.id===WEEK.id;
    return `<li><button class="${me?'cur':''}" data-w="${w.id}"><span>${weekLabel(w)}</span><small>${p.done}/${p.n}${p.n&&p.done===p.n?' ✓':''}</small></button></li>`;
  }).join('')+'</ul>':'';
  showOnly(home);
}
function renderHome(){
  tiles.innerHTML=Q.map((q,i)=>{
    const S=ST[i];
    const mark=S&&S.s?(S.h?'<span class="star help" aria-label="solved with help">☆</span>':'<span class="star" aria-label="solved on your own">★</span>'):'';
    return `<button class="tile" data-i="${i}"><span class="n">${qlab(i)}</span><span class="tq">${q.tile||q.q}</span>${mark}</button>`;
  }).join('');
}
tiles.addEventListener('click',e=>{const b=e.target.closest('.tile');if(b)openQ(+b.dataset.i);});
$('past').addEventListener('click',e=>{const b=e.target.closest('[data-w]');if(b)go(KID,b.dataset.w);});
$('switchKid').addEventListener('click',()=>{location.hash='';});
let resetArmed=false;
$('reset').addEventListener('click',()=>{
  const b=$('reset');
  if(!resetArmed){resetArmed=true;b.textContent='Tap again to clear this week\'s answers and working out';setTimeout(()=>{resetArmed=false;b.textContent='Start this week again';},4000);return;}
  ST={};saveST();
  try{Object.keys(localStorage).filter(k=>k.indexOf(APP+'-w-')===0).forEach(k=>localStorage.removeItem(k));}catch(e){}
  resetArmed=false;b.textContent='Start this week again';renderHome();
});

/* ---- question view ---- */
function openQ(i){
  stopSpeak();
  cur=i;step=0;
  showOnly(lesson);
  const q=Q[i];
  $('qnum').textContent=q.n!=null?`Question ${q.n} (${i+1} of ${Q.length})`:`Question ${i+1} of ${Q.length}`;
  $('qbig').innerHTML=q.q;
  $('qbig').className='qbig'+(q.long?' long':'');
  $('pq').disabled=i===0;$('nq').disabled=false;$('nq').textContent=i===Q.length-1?'See my results ›':'Next question ›';
  how.hidden=true;how.dataset.open='0';
  buildAnswer();renderTries();updateHelp();
  loadWork();
  requestAnimationFrame(sizePad);
}
function goHome(){stopSpeak();showHome();}

function renderTries(){
  const S=st(cur);let h='';
  if(S.s) h=`<span class="tag ok">${S.h?'Solved with help':'Solved on your own'}</span>`;
  else if(Q[cur].open) h='';
  else if(S.u) h='<span class="tag">Help unlocked</span>';
  else{const left=3-S.t;h='<span>Tries left</span>'+[0,1,2].map(k=>`<i class="${k<left?'on':''}"></i>`).join('');}
  $('tries').innerHTML=h;
}
function updateHelp(){
  const S=st(cur),free=!!Q[cur].open;
  const open=!!(S.u||((S.s||free)&&how.dataset.open==='1'));
  locked.hidden=!!(S.u||S.s||free);
  showHow.hidden=!((S.s||free)&&!open);
  if(open&&how.hidden){how.hidden=false;step=0;draw();}
  if(!open) how.hidden=true;
}
showHow.addEventListener('click',()=>{how.dataset.open='1';updateHelp();setTimeout(()=>{try{how.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){}},80);});

function drawStep(q,s){return q.draw?q.draw(s):notesDraw(q,s);}
function draw(){
  const q=Q[cur],last=q.say.length-1;
  stage.innerHTML=drawStep(q,step);
  sayEl.innerHTML=q.say[step];
  dots.innerHTML=q.say.map((_,k)=>`<i class="${k<=step?'on':''}"></i>`).join('');
  prevB.disabled=step===0;
  nextB.disabled=step===last;
  again.hidden=!(step===last&&!st(cur).s&&!q.open);
  stopSpeak();
}
again.addEventListener('click',()=>{
  try{$('answerCard').scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}
  setTimeout(()=>{const x=$('a1');if(x)try{x.focus({preventScroll:true});}catch(e){}},450);
});

/* ---- answering ---- */
// answer types: number (default) · frac:true, ans:[top,bottom] · text:true, ans:'word' or ['ok1','ok2'] · choices:[...], ans:'the right choice' · open:true (no checking)
let picked=null;
function buildAnswer(){
  const q=Q[cur];
  fb.textContent='';fb.className='fb';$('stars').innerHTML='';picked=null;
  $('check').hidden=false;$('check').textContent=q.open?"I've done it":'Check';
  if(q.open) inputs.innerHTML='';
  else if(q.choices)
    {inputs.innerHTML='<span class="choices">'+q.choices.map((c,k)=>`<button class="btn choice" data-k="${k}">${c}</button>`).join('')+'</span>';$('check').hidden=true;}
  else if(q.frac&&FRAC==='stack')
    inputs.innerHTML='<span class="fin"><input class="ans" id="a1" inputmode="numeric" autocomplete="off" aria-label="Top number"><hr><input class="ans" id="a2" inputmode="numeric" autocomplete="off" aria-label="Bottom number"></span>';
  else if(q.frac||q.text)
    inputs.innerHTML=`<input class="ans ${q.text?'wide':''}" id="a1" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" ${q.frac?'placeholder="e.g. 1 3/4"':''} aria-label="Your answer">`;
  else
    inputs.innerHTML='<input class="ans" id="a1" type="text" inputmode="decimal" autocomplete="off" aria-label="Your answer">';
  const tip=q.tip||(q.frac&&FRAC==='text'?'Type a fraction like 7/4, or a mixed number like 1 3/4.':'');
  $('fhelp').textContent=tip;$('fhelp').hidden=!tip;
  inputs.querySelectorAll('input').forEach(x=>x.addEventListener('keydown',e=>{if(e.key==='Enter')check();}));
  $('toResults').hidden=true;
  const S=st(cur);
  if(S.s){offerResults();$('check').hidden=!!q.open;}
  if(S.s) setFb(q.open?'You finished this one. Nice work!':S.h?'You solved this one with help. Nice work!':'You solved this one on your own. Brilliant!','ok');
}
inputs.addEventListener('click',e=>{const b=e.target.closest('.choice');if(b){picked=+b.dataset.k;check();}});
function setFb(t,c){fb.textContent=t;fb.className='fb '+c;}
function parseNum(v){const t=String(v).replace(/[\s, £]/g,'').replace(/[a-zA-Z°%]+\.?$/,'');if(!/^-?\d*\.?\d+$/.test(t))return NaN;return parseFloat(t);}
function parseFrac(v){
  const t=String(v).trim().replace(/\s+/g,' ');let m;
  if((m=t.match(/^(\d+) (\d+) ?\/ ?(\d+)$/))) return {n:+m[1]*+m[3]+ +m[2],d:+m[3],fn:+m[2],fd:+m[3]};
  if((m=t.match(/^(\d+) ?\/ ?(\d+)$/))) return {n:+m[1],d:+m[2],fn:+m[1],fd:+m[2]};
  if(/^\d+$/.test(t)) return {n:+t,d:1,fn:0,fd:1};
  return null;
}
const normText=v=>String(v).toLowerCase().replace(/[‘’]/g,"'").replace(/\s+/g,' ').replace(/^\s|[\s.!]+$/g,'').trim();
const gcd=(a,b)=>b?gcd(b,a%b):a;
function judge(q){
  if(q.open) return {ok:true};
  if(q.choices){
    if(picked==null) return {empty:'Tap an answer.'};
    const c=q.choices[picked];
    if(normText(c)===normText(q.ans)) return {ok:true};
    return {ok:false,key:'c'+picked,special:q.special&&q.special[c]};
  }
  if(q.text){
    const v=normText(($('a1').value||''));
    if(!v) return {empty:'Type your answer in the box first.'};
    const okk=[].concat(q.ans).map(normText);
    if(okk.includes(v)) return {ok:true};
    const sp=q.special&&Object.keys(q.special).find(k=>normText(k)===v);
    return {ok:false,key:v,special:sp?q.special[sp]:null};
  }
  if(q.frac){
    let f;
    if(FRAC==='stack'){
      const a=($('a1').value||'').trim(),b=($('a2').value||'').trim();
      if(!a||!b) return {empty:'Fill in the top and the bottom numbers first.'};
      const n=parseInt(a,10),d=parseInt(b,10);
      if(isNaN(n)||isNaN(d)||d===0) return {empty:'Use whole numbers for the top and the bottom.'};
      f={n,d,fn:n,fd:d};
    } else {
      const v=($('a1').value||'').trim();
      if(!v) return {empty:'Type your answer in the box first.'};
      f=parseFrac(v);
      if(!f||f.d===0) return {empty:'Type it as a fraction like 7/4, or a mixed number like 1 3/4.'};
    }
    if(f.n*q.ans[1]===q.ans[0]*f.d)
      return {ok:true,msg:(f.fn>0&&gcd(f.fn,f.fd)>1)?"That's right! Bonus challenge: can you simplify it? The top and bottom share a factor.":null};
    const g=gcd(f.n,f.d)||1;
    return {ok:false,key:(f.n/g)+'/'+(f.d/g),special:q.special&&q.special[(f.n/g)+'/'+(f.d/g)]};
  }
  const v=($('a1').value||'').trim();
  if(!v) return {empty:'Type your answer in the box first.'};
  const n=parseNum(v);
  if(isNaN(n)) return {empty:'Type a number, like 12 or 3.5.'};
  if(Math.abs(n-q.ans)<1e-9) return {ok:true};
  return {ok:false,key:String(n),special:q.special&&q.special[String(n)]};
}
function win(msg){
  setFb(msg||PRAISE[Math.floor(Math.random()*PRAISE.length)],'ok');
  $('stars').innerHTML='<span class="bigstar pop" aria-hidden="true">★</span>';
}
function check(){
  const q=Q[cur],S=st(cur),r=judge(q);
  if(r.empty){setFb(r.empty,'');return;}
  if(r.ok){
    const fresh=!S.s,before=allSolved();
    if(!S.s){S.s=1;S.h=S.u?1:0;saveST();}
    win(q.open?'Well done for finishing it!':r.msg);renderTries();updateHelp();again.hidden=true;offerResults();
    if(q.open) $('check').hidden=true;
    if(fresh&&((!before&&allSolved())||cur===Q.length-1)){const q0=cur;setTimeout(()=>{if(cur===q0&&!lesson.hidden)showResults();},1800);}
    return;
  }
  // after help is unlocked (or already solved): give the targeted hint
  if(S.s||S.u){setFb(r.special||q.hint,'no');return;}
  if(S.a.indexOf(r.key)>=0){setFb("You've already tried that answer. Have another look at your working out.",'no');return;}
  S.a.push(r.key);S.t++;
  if(S.t>=3){
    S.u=1;saveST();renderTries();
    setFb("That's 3 tries. Let's work through it together below, then have another go.",'no');
    updateHelp();
    setTimeout(()=>{try{how.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){}},600);
    return;
  }
  saveST();renderTries();
  const left=3-S.t;
  setFb(`${r.special&&q.earlySpecial?r.special+' ':'Not quite. Have another look at your working out. '}${left} ${left===1?'try':'tries'} left.`,'no');
}

/* ---- working-out pad (squared paper) ---- */
const pad=$('pad'),wrap=$('padwrap');
const ctx=pad.getContext?pad.getContext('2d'):null;
let strokes=[],stash=null,curS=null,tool='pen',W=0,Hp=0;
function ink(){try{return getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()||'#1F2D48';}catch(e){return '#1F2D48';}}
function wkey(){return APP+'-w-'+cur;}
function loadWork(){try{strokes=JSON.parse(localStorage.getItem(wkey())||'[]')||[];}catch(e){strokes=[];}stash=null;}
function saveWork(){try{localStorage.setItem(wkey(),JSON.stringify(strokes));}catch(e){}}
function sizePad(){
  if(!ctx||lesson.hidden) return;
  const dpr=window.devicePixelRatio||1;
  W=wrap.clientWidth;Hp=wrap.clientHeight;
  if(!W||!Hp) return;
  pad.width=Math.round(W*dpr);pad.height=Math.round(Hp*dpr);
  pad.style.width=W+'px';pad.style.height=Hp+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  redraw();
}
function penStyle(s){
  ctx.globalCompositeOperation=s.e?'destination-out':'source-over';
  const c=ink();ctx.strokeStyle=c;ctx.fillStyle=c;
  ctx.lineWidth=s.e?22:2.8;ctx.lineCap='round';ctx.lineJoin='round';
}
function dot(s,p){ctx.save();penStyle(s);ctx.beginPath();ctx.arc(p[0]*W,p[1]*W,ctx.lineWidth/2,0,Math.PI*2);ctx.fill();ctx.restore();}
function seg(s,a,b){ctx.save();penStyle(s);ctx.beginPath();ctx.moveTo(a[0]*W,a[1]*W);ctx.lineTo(b[0]*W,b[1]*W);ctx.stroke();ctx.restore();}
function redraw(){
  if(!ctx) return;
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,pad.width,pad.height);ctx.restore();
  for(const s of strokes){
    if(s.p.length===1){dot(s,s.p[0]);continue;}
    ctx.save();penStyle(s);ctx.beginPath();ctx.moveTo(s.p[0][0]*W,s.p[0][1]*W);
    for(let k=1;k<s.p.length;k++) ctx.lineTo(s.p[k][0]*W,s.p[k][1]*W);
    ctx.stroke();ctx.restore();
  }
}
function pos(e){const r=pad.getBoundingClientRect();return [+((e.clientX-r.left)/W).toFixed(4),+((e.clientY-r.top)/W).toFixed(4)];}
if(ctx){
  pad.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0) return;
    try{pad.setPointerCapture(e.pointerId);}catch(err){}
    const p=pos(e);curS={e:tool==='rub'?1:0,p:[p]};strokes.push(curS);stash=null;dot(curS,p);
    e.preventDefault();
  });
  pad.addEventListener('pointermove',e=>{
    if(!curS) return;
    let evs=e.getCoalescedEvents?e.getCoalescedEvents():[];if(!evs||!evs.length) evs=[e];
    for(const ev of evs){
      const p=pos(ev),l=curS.p[curS.p.length-1];
      if(Math.hypot((p[0]-l[0])*W,(p[1]-l[1])*W)<1) continue;
      curS.p.push(p);seg(curS,l,p);
    }
    e.preventDefault();
  });
  const end=()=>{if(curS){curS=null;saveWork();}};
  pad.addEventListener('pointerup',end);pad.addEventListener('pointercancel',end);
}
function setTool(t){tool=t;$('tPen').setAttribute('aria-pressed',t==='pen');$('tRub').setAttribute('aria-pressed',t==='rub');}
$('tPen').addEventListener('click',()=>setTool('pen'));
$('tRub').addEventListener('click',()=>setTool('rub'));
$('tUndo').addEventListener('click',()=>{if(strokes.length)strokes.pop();else if(stash){strokes=stash;stash=null;}redraw();saveWork();});
$('tClear').addEventListener('click',()=>{if(!strokes.length)return;stash=strokes;strokes=[];redraw();saveWork();});
$('tMore').addEventListener('click',()=>{const t=wrap.classList.toggle('tall');$('tMore').textContent=t?'Less space':'More space';requestAnimationFrame(sizePad);});
let rz=0;window.addEventListener('resize',()=>{cancelAnimationFrame(rz);rz=requestAnimationFrame(sizePad);});
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',redraw);}catch(e){}

/* ---- read aloud (off) ---- */
const canSpeak=SPEECH&&('speechSynthesis' in window);
function stopSpeak(){try{if(canSpeak)speechSynthesis.cancel();}catch(e){}}

/* ---- controls ---- */
prevB.addEventListener('click',()=>{if(step>0){step--;draw();}});
nextB.addEventListener('click',()=>{if(step<Q[cur].say.length-1){step++;draw();}});
$('replay').addEventListener('click',draw);
$('homeBtn').addEventListener('click',goHome);
$('check').addEventListener('click',check);
$('pq').addEventListener('click',()=>{if(cur>0)openQ(cur-1);});
$('nq').addEventListener('click',()=>{if(cur<Q.length-1)openQ(cur+1);else showResults();});

/* ---- results page ---- */
function qStatus(i){const S=ST[i];return S&&S.s?(S.h?'help':'own'):'todo';}
function tally(){const r={own:[],help:[],todo:[]};Q.forEach((q,i)=>r[qStatus(i)].push(i));return r;}
function allSolved(){return Q.every((q,i)=>qStatus(i)!=='todo');}
function offerResults(){$('toResults').hidden=!(allSolved()||cur===Q.length-1);}
function showResults(){stopSpeak();showOnly(results);renderResults();}
function renderResults(){
  const N=Q.length,t=tally(),own=t.own.length,help=t.help.length,todo=t.todo.length,solved=own+help,name=kids()[KID].name;
  $('resTitle').textContent=solved===N?`All done, ${name}!`:'Your results so far';
  const C=2*Math.PI*50,a=own/N*C,b=help/N*C;
  $('ringWrap').innerHTML=`<svg class="ring" viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg" cx="60" cy="60" r="50"/><circle class="ring-own" cx="60" cy="60" r="50" stroke-dasharray="${a.toFixed(2)} ${C.toFixed(2)}"/><circle class="ring-help" cx="60" cy="60" r="50" stroke-dasharray="${b.toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-a).toFixed(2)}"/></svg>`;
  const el=$('scoreNum');
  let reduce=false;try{reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
  if(reduce||!own) el.textContent=own;
  else{let t0=null;const tick=ts=>{if(t0===null)t0=ts;const k=Math.min(1,(ts-t0)/900);el.textContent=Math.round(own*k);if(k<1)requestAnimationFrame(tick);};el.textContent='0';requestAnimationFrame(tick);}
  $('scoreOf').innerHTML=`out of ${N}<br>on your own`;
  let msg;
  if(own===N) msg='Every single question on your own. Amazing work!';
  else if(solved===N) msg=`All ${N} done! Try your ☆ ones again to turn them into gold stars.`;
  else if(own>=N*0.75) msg='Brilliant work! Just a few left to go.';
  else if(solved>=N/2) msg='Great progress. Keep going!';
  else if(solved>0) msg='A good start. Every question you try makes you stronger.';
  else msg="You haven't answered any questions yet. Pick one to start!";
  $('resMsg').textContent=msg;
  $('cOwn').textContent=own;$('cHelp').textContent=help;$('cTodo').textContent=todo;
  $('qgrid').innerHTML=Q.map((q,i)=>{const s=qStatus(i);const lab=s==='own'?'solved on your own':s==='help'?'solved with help':'still to do';return `<button class="qc ${s} pop" style="--d:${(i*0.03).toFixed(2)}s" data-i="${i}" aria-label="Question ${qlab(i)}, ${lab}">${qlab(i)}<small>${s==='own'?'★':s==='help'?'☆':''}</small></button>`;}).join('');
  const order={practise:0,unfinished:1,strong:2};
  const rows=TOPICS.map(([name,qs])=>{const sts=qs.map(n=>qStatus(n-1));const kind=sts.includes('help')?'practise':sts.includes('todo')?'unfinished':'strong';return {name,qs,sts,kind};}).sort((x,y)=>order[x.kind]-order[y.kind]);
  const tagText={practise:'Practise this',unfinished:'Not finished yet',strong:'Strong'};
  $('topicsWrap').hidden=!TOPICS.length;
  $('topics').innerHTML=rows.map(r=>`<div class="topic"><div class="th"><span class="tn">${r.name}</span><span class="ttag ${r.kind}">${tagText[r.kind]}</span></div><div class="chips">${r.qs.map((n,k)=>`<button class="chip ${r.sts[k]}" data-i="${n-1}" aria-label="Question ${qlab(n-1)}">${qlab(n-1)}</button>`).join('')}</div></div>`).join('');
  $('retryHelp').hidden=!help;
  $('goTodo').hidden=!todo;
  $('goTodo').textContent=todo===1?'Do the last one still to do':`Do the ${todo} still to do`;
}
$('qgrid').addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)openQ(+b.dataset.i);});
$('topics').addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)openQ(+b.dataset.i);});
$('retryHelp').addEventListener('click',()=>{const t=tally();t.help.forEach(i=>{ST[i]={t:0,s:0,h:0,u:0,a:[]};try{localStorage.removeItem(APP+'-w-'+i);}catch(e){}});saveST();if(t.help.length)openQ(t.help[0]);});
$('goTodo').addEventListener('click',()=>{const t=tally();if(t.todo.length)openQ(t.todo[0]);});
$('resBack').addEventListener('click',goHome);
$('homeResults').addEventListener('click',showResults);
$('toResults').addEventListener('click',showResults);

/* ---- self-test, used when adding new homework (run in the browser console) ----
   HW.selfTest('year4','2026-10-12').then(console.log)  →  [] when everything is fine */
HW.selfTest=(c,id)=>new Promise(res=>{
  const K=kids()[c],w=K&&(K.weeks||[]).find(x=>x.id===id);const errs=[];
  if(!w) return res(['week not in homework/weeks.js']);
  loadWeek(c,w,def=>{
    if(!def) return res(['file did not load or HW.week() child/id mismatch: '+w.file]);
    const qs=def.questions||[];
    if(w.count!==qs.length) errs.push(`weeks.js count ${w.count} but file has ${qs.length} questions`);
    qs.forEach((q,i)=>{
      const tag='Q'+(q.n!=null?q.n:i+1)+': ';
      if(!q.q) errs.push(tag+'missing q');
      if(!q.open&&q.ans==null) errs.push(tag+'missing ans');
      if(q.frac&&!(Array.isArray(q.ans)&&q.ans.length===2)) errs.push(tag+'frac ans must be [top,bottom]');
      if(q.choices&&!q.choices.some(x=>normText(x)===normText(q.ans))) errs.push(tag+'ans is not one of the choices');
      if(!q.frac&&!q.text&&!q.choices&&!q.open&&typeof q.ans!=='number') errs.push(tag+'number ans must be a number');
      if(!q.open&&!q.hint) errs.push(tag+'missing hint');
      if(!Array.isArray(q.say)||!q.say.length) errs.push(tag+'missing say steps');
      else q.say.forEach((_,s)=>{try{const h=drawStep(q,s);if(typeof h!=='string'||!h) errs.push(tag+'step '+s+' draws nothing');}catch(e){errs.push(tag+'step '+s+' draw error: '+e.message);}});
      if(!q.draw&&q.notes&&q.notes.length!==q.say.length) errs.push(tag+'notes and say lengths differ');
    });
    (def.topics||[]).forEach(([nm,ns])=>ns.forEach(n=>{if(!(n>=1&&n<=qs.length))errs.push(`topic "${nm}" points at question ${n}, which doesn't exist`);}));
    res(errs);
  });
});

/* old link (index-1.html) and old saved progress keep working: Year 6's first set uses store 'y6old' */
route();
