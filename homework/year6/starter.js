/* Year 6: first set (the original 28 questions). Uses store 'y6old' so progress saved before the update is kept. */
HW.week({child:'year6',id:'starter',
topics:[
  ['Times tables and mental maths',[1,6,10,17]],
  ['Squares and cubes',[2,5,12]],
  ['× and ÷ by 10, 100 and 1000',[4,7,8,18]],
  ['Decimals',[3,8,18,21,23]],
  ['Fractions',[9,13,15,16]],
  ['Missing numbers',[3,5,6,7,10,12,17,24,25,26]],
  ['Column adding and taking away',[14,21,23,24,27]],
  ['Multiplying (short and long)',[19,22,28]],
  ['Short division',[11,20,25,26]]
],
questions:[{q:`${BOX} = 30 × 0`,ans:0,
 hint:"Not quite. 30 lots of nothing… how much is that altogether?",
 say:["The box is on the left, and that's fine: = means <b>is the same as</b>. So just work out 30 × 0.",
      "30 × 0 means 30 lots of nothing. Picture 30 plates with nothing on them.",
      "Your turn! How much is on all 30 plates altogether?"],
 draw(s){
  let h=pen(`${BOX} is the same as 30 × 0`);
  if(s>=1){h+='<div class="plates small">';for(let i=0;i<30;i++)h+=`<span class="plate ${s===1?'pop':''}" ${D(i*0.03)}></span>`;h+='</div>';}
  if(s>=2) h+=pen('30 lots of 0 = ?','rose','fade');
  return h;
 }},

{q:`9<sup>2</sup> = ${BOX}`,ans:81,special:{18:"Careful! 9² isn't 9 × 2. The little 2 means 9 × 9."},
 hint:"Not quite. Work out 90 − 9.",
 say:["The little ² means <b>squared</b>: a number times itself. So 9² means 9 × 9, <b>not</b> 9 × 2.",
      "Picture it as a square of tiles, 9 wide and 9 tall.",
      "Quick trick: if the square were 10 tiles wide, it would have 9 × 10 = 90 tiles.",
      "But it's only 9 wide, so take away that extra column of 9 tiles.",
      "Your turn! What is 90 − 9? That's 9²."],
 draw(s){
  let h='<div class="sqg" style="grid-template-columns:repeat(10,1.25rem)">';
  for(let r=0;r<9;r++)for(let c=0;c<10;c++){
    const L=c<9?life(s,1,null,r*0.12+c*0.012):life(s,2,3,r*0.08,r*0.06);
    h+=L?`<span class="tl ${c===9?'extra':''} ${L.c}" ${sty(L)}></span>`:'<span class="tl blank"></span>';
  }
  h+='</div>';
  const notes=['9² = 9 × 9','9 wide, 9 tall','10 wide: 9 × 10 = 90','90 − 9','9² = 90 − 9 = ?'];
  return h+pen(notes[s],s>=2?'rose':'',s<4?'write':'',s===1?1.2:0.4);
 }},

{q:`${BOX} + 0.8 = 2`,ans:1.2,special:{2.8:"That's 2 + 0.8. The box is one of the parts, so take 0.8 away from 2 instead."},
 hint:"Not quite. Count the unshaded tenths: one whole and how many tenths?",
 say:["Something add 0.8 makes 2. Let's look at 2 wholes, each cut into tenths.",
      "Each whole is 10 tenths, so 2 wholes is 20 tenths.",
      "0.8 is 8 tenths. Shade those at the end.",
      "The part that's left is the missing number. Your turn! It's 1 whole and how many tenths? Write it as a decimal."],
 draw(s){
  let h=pen(`${BOX} + 0.8 = 2`);
  h+=`<div class="sbar ${s===0?'fade':''}" style="grid-template-columns:repeat(20,1fr)">`;
  for(let i=0;i<20;i++){
    const first=i%10===0,rose=i>=12;
    const L=rose?life(s,2,null,(19-i)*0.12):life(s,3,null,i*0.05,0,'fade');
    h+=`<i class="${first&&i>0?'thick':''} ${!first&&s>=1?'thin on':''} ${!first&&s===1?'grow':''}" ${s===1?D(i*0.03):''}>${L?`<b class="${rose?'rb':'mb'} ${L.c}" ${sty(L)}></b>`:''}</i>`;
  }
  h+='</div>';
  if(s>=1) h+=`<div class="halves ${s===1?'fade':''}" ${D(.6)}><span>1 whole</span><span>1 whole</span></div>`;
  const notes=['','2 wholes = 20 tenths','0.8 = 8 tenths','? = 1 whole and ? tenths'];
  if(notes[s]) h+=pen(notes[s],s>=2?'rose':'','write',s===1?1:0.4);
  return h;
 }},

{q:`800 ÷ 10 = ${BOX}`,ans:80,special:{8000:"That's 800 × 10. Dividing makes the number smaller."},
 hint:"Not quite. Move each digit of 800 one place to the right.",
 say:["Dividing by 10 makes a number 10 times smaller: every digit moves <b>one place to the right</b>. Let's watch it with 600 first.",
      "Here's 600 in a place value grid.",
      "÷ 10: every digit slides one place to the right. The 6 hundreds become 6 tens.",
      "600 ÷ 10 = 60. The 0 that slid into the tenths isn't needed, so we leave it off.",
      "Your turn! Do the same with 800 ÷ 10."],
 draw(s){
  let h=s===0?pen('÷ 10: every digit moves 1 place right','','write',.2):'';
  if(s>=1) h+=pvGrid(s,{cols:['H','T','O','.','t'],from:{0:'6',1:'0',2:'0'},shift:1,k0:1,kShift:2,faint:{i:4,k:3}});
  if(s===3) h+=pen('600 ÷ 10 = 60','rose','write',.4);
  if(s>=4) h+=pen('Your turn: 800 ÷ 10 = ?','rose','fade');
  return h;
 }},

{q:`49 = ${BOX}<sup>2</sup>`,ans:7,special:{24.5:"That's 49 ÷ 2. The little ² means a number times itself."},
 hint:"Not quite. Count how many tiles wide the 49-tile square is.",
 say:["We need a number that, times <b>itself</b>, makes 49. Imagine 49 tiles arranged in a perfect square. How wide is it?",
      "Try 5: a 5 by 5 square has 25 tiles. Too small.",
      "Try 6: a 6 by 6 square has 36 tiles. Still too small.",
      "One size bigger gives exactly 49 tiles. Your turn! How many tiles wide is this square?"],
 draw(s){
  const n=[0,5,6,7][s],p=[0,0,5,6][s];
  let h='<div class="sqg" style="grid-template-columns:repeat(7,1.55rem)">';
  for(let r=0;r<7;r++)for(let c=0;c<7;c++){
    const inside=r<n&&c<n,isNew=inside&&!(r<p&&c<p);
    h+=inside?`<span class="tl big ${isNew?'pop':''}" ${isNew?D((r+c)*0.06):''}></span>`:'<span class="tl big blank"></span>';
  }
  h+='</div>';
  const notes=['? × ? = 49','5 × 5 = 25: too small','6 × 6 = 36: too small','? × ? = 49'];
  return h+pen(notes[s],s===3?'rose':'','write',.5);
 }},

{q:`5 = ${BOX} ÷ 9`,ans:45,
 hint:"Not quite. The whole is 9 lots of 5.",
 say:["The box is the number we <b>start</b> with. Split it into 9 equal groups and there are 5 in each group.",
      "As a bar: the whole is split into 9 equal parts, and each part is worth 5.",
      "To find the whole, do the opposite of dividing: <b>multiply</b>. That's 9 lots of 5.",
      "Your turn! What is 9 × 5? Check: your answer ÷ 9 should give 5."],
 draw(s){
  let h=pen(`5 = ${BOX} ÷ 9`);
  if(s>=1) h+=bar(s,1,MQ,Array.from({length:9},()=>({t:'5',f:1})),1);
  if(s>=2) h+=pen(s===2?'9 lots of 5':'9 × 5 = ?','rose','write',.4);
  return h;
 }},

{q:`90 × ${BOX} = 9000`,ans:100,special:{10:"Close! 90 × 10 only makes 900. Count the jumps again.",1000:"That would make 90 000. Count the jumps again."},
 hint:"Not quite. Two jumps left is × 10, then × 10 again.",
 say:["90 times something makes 9000. Let's see how far the 9 has to move.",
      "In 90, the 9 is in the tens column.",
      "In 9000, the 9 is in the thousands column. It has jumped 2 places to the left.",
      "Each jump to the left means × 10. So 2 jumps means × 10, then × 10 again. Your turn! What did we multiply by?"],
 draw(s){
  let h='<div class="pvg" style="grid-template-columns:repeat(4,2.4rem)">';
  ['Th','H','T','O'].forEach(c=>h+=`<span class="pvgh">${c}</span>`);
  h+=`<span class="pvgc"></span><span class="pvgc"></span><span class="pvgc"><span class="${s>=1?'rose':''} ${s===1?'pulse':''}">9</span></span><span class="pvgc">0</span>`;
  if(s>=2){
    h+=`<span class="pvgc jr"><b class="jmp ${s===2?'pop':''}" ${D(1)}>×10</b></span><span class="pvgc jr"><b class="jmp ${s===2?'pop':''}" ${D(.5)}>×10</b></span><span class="pvgc jr"></span><span class="pvgc jr"></span>`;
    h+=['9','0','0','0'].map((d,i)=>`<span class="pvgc"><span class="${i===0?'rose':''} ${s===2?'pop':''}" ${D(1.5+i*.1)}>${d}</span></span>`).join('');
  }
  h+='</div>';
  const notes=['90 × ? = 9000','the 9 is in the tens','the 9 jumped 2 places left','× 10 × 10 = × ?'];
  return h+pen(notes[s],s>=2?'rose':'','write',s===2?1.9:.4);
 }},

{q:`32.32 × 10 = ${BOX}`,ans:323.2,special:{32.32:"That's the same number. × 10 moves every digit one place left.",3232:"Too far! × 10 moves the digits just one place left."},
 hint:"Not quite. Move every digit of 32.32 one place to the left. The decimal point stays still.",
 say:["Multiplying by 10 makes a number 10 times bigger: every digit moves <b>one place to the left</b>. The decimal point stays still! Let's watch with 45.67 first.",
      "Here's 45.67 in a place value grid.",
      "× 10: every digit slides one place to the left.",
      "45.67 × 10 = 456.7. The digits moved; the decimal point didn't.",
      "Your turn! Do the same with 32.32 × 10."],
 draw(s){
  let h=s===0?pen('× 10: every digit moves 1 place left','','write',.2):'';
  if(s>=1) h+=pvGrid(s,{cols:['H','T','O','.','t','h'],from:{1:'4',2:'5',4:'6',5:'7'},shift:-1,k0:1,kShift:2});
  if(s===3) h+=pen('45.67 × 10 = 456.7','rose','write',.4);
  if(s>=4) h+=pen('Your turn: 32.32 × 10 = ?','rose','fade');
  return h;
 }},

{q:`${BOX} = ${fr(2,3)} of 24`,ans:16,special:{8:"That's one third. Two thirds is two of the groups."},
 hint:"Not quite. Count the counters in two of the groups.",
 say:["To find two thirds: first find <b>one third</b> by splitting into 3 equal groups. Then take <b>2</b> of those groups.",
      "Deal the 24 counters into 3 equal groups.",
      "Each group is one third. We want two thirds, so take 2 groups.",
      "Your turn! How many counters are in 2 groups altogether?"],
 draw(s){
  let h='<div class="pile24">'+Array.from({length:24},(_,i)=>el('span','dot d-one',life(s,0,1,i*0.025,0.2+i*0.1))).join('')+'</div>';
  h+=deal(s,24,3,1,2,[0,1]);
  const notes=['24 counters','24 ÷ 3: one third each','2 groups = two thirds',`${fr(2,3)} of 24 = ?`];
  return h+pen(notes[s],s>=2?'rose':'','write',s===1?2.6:.3);
 }},

{q:`3 × ${BOX} = 17 − 2`,ans:5,
 hint:"Not quite. Count the dots in one group.",
 say:["Both sides of = must be worth the same. Start with the side you can work out: 17 − 2.",
      `17 − 2 = 15. So now we have 3 × ${BOX} = 15.`,
      "3 lots of the mystery number make 15. Share 15 into 3 equal groups.",
      "Your turn! How many are in each group?"],
 draw(s){
  let h=`<div class="row"><span class="nc expr">3 × ${BOX}</span><span class="op">=</span>${s>=1?`<span class="nc expr ${s===1?'pop':''}" ${D(.3)}>15</span>`:'<span class="nc expr">17 − 2</span>'}</div>`;
  if(s>=2) h+=deal(s,15,3,2,3,[0]);
  const notes=['work out 17 − 2 first','3 × ? = 15','15 shared into 3 groups','one group = ?'];
  return h+pen(notes[s],s>=3?'rose':'','write',.5);
 }},

{q:`3248 ÷ 8 = ${BOX}`,ans:406,special:{46:"Careful, you've skipped the zero! When 8 doesn't go into 4, write a 0 on top."},
 hint:"Not quite. Work out 32 ÷ 8 and 48 ÷ 8, and keep the 0 in the middle.",
 say:["Bus stop method. 8 waits outside, and 3248 goes inside. Work from left to right.",
      "How many 8s go into 3? None! So carry the 3 over to the next digit to make 32.",
      "How many 8s go into 32? That goes on top of the 2.",
      "Next, how many 8s go into 4? None! So write a <b>0</b> on top and carry the 4 to make 48. Don't skip the zero!",
      "Your turn! Work out 32 ÷ 8 and 48 ÷ 8, keeping that 0 in the middle. What's the answer?"],
 draw(s){
  let h=bus(s,{dv:'8',ds:['3','2','4','8'],k0:0,top:[null,{q:2},{w:3,t:'0'},{q:4}],carries:[{i:1,t:'3',k:1},{i:3,t:'4',k:3,d:1}],hl:s=>[-1,0,1,2,3][s]});
  const notes=['',"8 into 3? Doesn't go. Carry 3.",'32 ÷ 8 = ?',"8 into 4? Doesn't go. Write 0, carry 4.",'48 ÷ 8 = ?'];
  if(notes[s]) h+=pen(notes[s],'rose','write',.6);
  return h;
 }},

{q:`216 = ${BOX}<sup>3</sup>`,ans:6,special:{72:"Careful! ³ means a number × itself × itself, not × 3."},
 hint:"Not quite. Try the number after 5: multiply it by itself, then by itself again.",
 say:["The little ³ means <b>cubed</b>: a number times itself, then times itself again. It's like counting the little cubes in a big cube.",
      "Let's list some cube numbers: 1³ = 1, 2³ = 8, 3³ = 27, 4³ = 64.",
      "5³ = 5 × 5 × 5 = 125. Still too small, but we're getting close.",
      "Your turn! Try the next number up. Tip: 216 ends in 6. Which number cubed ends in 6?"],
 draw(s){
  if(s===0) return isoCube()+pen('3 × 3 × 3 = 27 little cubes','','write',.5);
  const rows=[['1 × 1 × 1','1'],['2 × 2 × 2','8'],['3 × 3 × 3','27'],['4 × 4 × 4','64'],['5 × 5 × 5','125'],['? × ? × ?','216']];
  let h='<div class="ctab">';
  rows.forEach((r,i)=>{
    const k=i<4?1:i===4?2:3;
    const L=life(s,k,null,k===1?i*0.35:0.2,0,'fade');
    if(L){const c=`${L.c} ${i===5?'rose':''}`;h+=`<span class="${c}" ${sty(L)}>${r[0]}</span><span class="${c}" ${sty(L)}>= ${r[1]}</span>`;}
  });
  h+='</div>';
  const notes=['','',"125 is too small, but we're close",'216 ends in 6…'];
  if(notes[s]) h+=pen(notes[s],'rose','write',.6);
  return h;
 }},

{q:`${fr(4,5)} + ${fr(16,15)} = ${BOX}`,ans:[28,15],frac:true,
 hint:"Not quite. Change 4/5 into fifteenths first (× 3 top and bottom), then add the top numbers.",
 say:["The denominators are different: fifths and fifteenths. We can only add fractions when the pieces are the <b>same size</b>.",
      `Here's ${fr(4,5)}: a bar cut into 5 equal pieces, with 4 shaded.`,
      "15 is 5 × 3, so cut every fifth into 3 smaller pieces. Now the bar is in fifteenths. That's the same as multiplying the top and the bottom by 3.",
      `Now both fractions are in fifteenths. ${fr(16,15)} is one whole and one more fifteenth. To add, add the top numbers; the bottom stays 15.`,
      "Your turn! Count the shaded fifteenths in the top bar, add 16, and put it over 15. It's bigger than 1, so you can write it as a mixed number too."],
 draw(s){
  let h=splitBar(s,{n:5,m:3,shade:4,k0:0,kShade:1,kSplit:2});
  if(s<3){
    const labs=[`${fr(4,5)} + ${fr(16,15)}`,`${fr(4,5)} shaded`,`${fr(4,5)} = ${fr('?',15)}`];
    return h+pen(labs[s],s===2?'rose':'','write',s===2?1.4:.3);
  }
  h+=pen(`${fr(4,5)} = ${fr('?',15)}`,'rose');
  h+=`<div class="stack ${s===3?'fade':''}" ${D(.3)}>${plainBar(15,15,'alt')}${plainBar(15,1,'alt')}</div>`;
  h+=pen(s===3?`${fr(16,15)}: one whole and ${fr(1,15)}`:`${fr('?',15)} + ${fr(16,15)} = ${fr('?',15)}`,'rose','write',.7);
  return h;
 }},

{q:`${BOX} = 800 − 524`,ans:276,special:{324:"Careful! You can't swap the digits round in a column. When the top digit is smaller, exchange from the next column."},
 hint:"Not quite. After exchanging, work out 10 − 4, 9 − 2 and 7 − 5.",
 say:["Work out 800 − 524 in columns. Start with the ones.",
      "Ones: 0 − 4. Not enough ones! And there are no tens to exchange either, so we have to go to the hundreds.",
      "Exchange 1 hundred for 10 tens. The 8 hundreds become 7, and the tens become 10.",
      "Now exchange 1 of those tens for 10 ones. The tens become 9, and the ones become 10.",
      "Your turn! Subtract each column: 10 − 4, 9 − 2 and 7 − 5. (Shortcut: 799 − 523 gives the same answer with no exchanging!)"],
 draw(s){
  const a2=s===2,a3=s===3;
  const sup=(a)=>`<span class="sup ${a?'hop':''}" style="--d:.9s;--hx:-2.5rem;--hy:0rem">1</span>`;
  let h=colm(4,[
    CR('',s>=2?{t:`<span class="${a2?'write':''}" ${a2?D(.4):''}>7</span>`}:'',s>=3?{t:`<span class="${a3?'write':''}" ${a3?D(.4):''}>9</span>`}:'',''),
    R('',{t:'8',c:s>=2?'strike '+(a2?'anim':''):''},
         {t:(s>=2?sup(a2):'')+'0',c:(s>=3?'strike '+(a3?'anim':''):'')+(s===1?' on':'')},
         {t:(s>=3?sup(a3):'')+'0',c:s===1?'on':''}),
    R('−','5','2',hc('4',s===1)),
    '-',
    R('',QB,QB,QB)
  ]);
  const notes=['','0 − 4? No ones, and no tens either!','1 hundred → 10 tens','1 ten → 10 ones','10 − 4,   9 − 2,   7 − 5'];
  if(notes[s]) h+=pen(notes[s],'rose',s<4?'write':'',(a2||a3)?1.4:.3);
  return h;
 }},

{q:`${fr(5,7)} + ${fr(9,21)} = ${BOX}`,ans:[8,7],frac:true,
 hint:"Not quite. Change 5/7 into twenty-firsts first (× 3 top and bottom), then add the top numbers.",
 say:["Sevenths and twenty-firsts are different sized pieces. Let's make them the same.",
      `Here's ${fr(5,7)}: a bar cut into 7 equal pieces, with 5 shaded.`,
      "21 is 7 × 3, so cut every seventh into 3 smaller pieces. Now the bar is in twenty-firsts. That's multiplying the top and the bottom by 3.",
      "Now both are twenty-firsts, so add the top numbers. The bottom stays 21.",
      "Your turn! Add the top numbers and put them over 21. Then simplify: the top and bottom can both be divided by 3. You can write it as a mixed number too."],
 draw(s){
  let h=splitBar(s,{n:7,m:3,shade:5,k0:0,kShade:1,kSplit:2});
  if(s<3){
    const labs=[`${fr(5,7)} + ${fr(9,21)}`,`${fr(5,7)} shaded`,`${fr(5,7)} = ${fr('?',21)}`];
    return h+pen(labs[s],s===2?'rose':'','write',s===2?1.8:.3);
  }
  h+=pen(`${fr(5,7)} = ${fr('?',21)}`,'rose');
  h+=`<div class="stack ${s===3?'fade':''}" ${D(.3)}>${plainBar(21,9,'alt')}</div>`;
  h+=pen(s===3?`+ ${fr(9,21)}`:`${fr('?',21)} + ${fr(9,21)} = ${fr('?',21)}, then simplify`,'rose','write',.7);
  return h;
 }},

{q:`${fr(7,10)} of 80 = ${BOX}`,ans:56,special:{8:"That's one tenth. Now take 7 of those tenths."},
 hint:"Not quite. One tenth of 80 is 80 ÷ 10. Then multiply that by 7.",
 say:[`To find ${fr(7,10)} of 80: first find <b>one tenth</b> by dividing by 10. Then take 7 of those tenths.`,
      "Split 80 into 10 equal parts. Each part is one tenth: 80 ÷ 10.",
      "Now shade 7 of the parts. That's seven tenths.",
      "Your turn! Work out one part (80 ÷ 10), then multiply it by 7."],
 draw(s){
  let h=`<div class="bm"><div class="whole ${s===0?'fade':''}">80</div>`;
  if(s>=1){
    h+='<div class="parts">';
    for(let i=0;i<10;i++){const sh=s>=2&&i<7;h+=`<div class="part ${sh?'shade':''} ${s===1?'pop':''} ${s===2&&sh?'pulse':''}" style="flex:1 1 0px;--d:${s===1?0.2+i*0.08:s===2?i*0.2:0}s">${MQ}</div>`;}
    h+='</div>';
  }
  h+='</div>';
  const notes=[`${fr(7,10)} of 80`,'10 equal parts: 80 ÷ 10 each','shade 7 parts','7 × (80 ÷ 10) = ?'];
  return h+pen(notes[s],s>=2?'rose':'','write',.5);
 }},

{q:`${BOX} − 3 = 5 × 6`,ans:33,special:{27:"That's 30 − 3. But the box is the starting number: something take away 3 leaves 30. Try adding instead."},
 hint:"Not quite. The mystery number is the whole bar, so add the parts: 30 + 3.",
 say:["Both sides of = must be worth the same. Work out the side you can: 5 × 6.",
      `5 × 6 = 30. So now it's ${BOX} − 3 = 30.`,
      "Start with the mystery number, take away 3, and 30 is left. So the mystery number is the whole bar, made of 30 and 3.",
      "Your turn! To find the whole, add the parts: 30 + 3."],
 draw(s){
  let h=`<div class="row"><span class="nc expr">${BOX} − 3</span><span class="op">=</span>${s>=1?`<span class="nc expr ${s===1?'pop':''}" ${D(.3)}>30</span>`:'<span class="nc expr">5 × 6</span>'}</div>`;
  if(s>=2) h+=bar(s,2,MQ,[{t:'30 left',f:80},{t:'3',f:20,c:'hatch'}],2);
  const notes=['work out 5 × 6 first','? − 3 = 30','start with ?, take 3 away, 30 left','30 + 3 = ?'];
  return h+pen(notes[s],s>=3?'rose':'','write',.5);
 }},

{q:`65.4 ÷ 100 = ${BOX}`,ans:0.654,special:{6.54:"That's ÷ 10. Dividing by 100 moves the digits two places.",654:"That's bigger! Dividing makes the number smaller."},
 hint:"Not quite. Move every digit of 65.4 two places to the right, and put a 0 in the ones.",
 say:["Dividing by 100 makes a number 100 times smaller: every digit moves <b>two places to the right</b>. Let's watch with 38.2 first.",
      "Here's 38.2 in a place value grid.",
      "÷ 100: every digit slides two places to the right.",
      "The ones column is empty now, so put a 0 there as a placeholder. 38.2 ÷ 100 = 0.382.",
      "Your turn! Do the same with 65.4 ÷ 100."],
 draw(s){
  let h=s===0?pen('÷ 100: every digit moves 2 places right','','write',.2):'';
  if(s>=1) h+=pvGrid(s,{cols:['T','O','.','t','h','th'],from:{0:'3',1:'8',3:'2'},shift:2,k0:1,kShift:2,zeros:[{i:1,k:3}]});
  if(s===3) h+=pen('38.2 ÷ 100 = 0.382','rose','write',.6);
  if(s>=4) h+=pen('Your turn: 65.4 ÷ 100 = ?','rose','fade');
  return h;
 }},

{q:`2303 × 6 = ${BOX}`,ans:13818,
 hint:"Not quite. Check each column, and remember to add the carries.",
 say:["Short multiplication. Multiply each digit by 6, starting with the ones.",
      "Ones: 3 × 6 = 18. Write the 8 and carry the 1 into the tens.",
      "Tens: 0 × 6 = 0. But don't forget the 1 you carried!",
      "Your turn! Finish the tens, then the hundreds (3 × 6) and the thousands (2 × 6), adding any carries. What's the answer?"],
 draw(s){
  let h=colm(6,[
    CR('','','','',carry(s,1,'1',0.9,'2.1rem','7.2rem',s===2),''),
    R('','','2','3',hc('0',s===2),hc('3',s===1)),
    R('×','','','','',hc('6',true)),
    '-',
    R('',QB,QB,QB,QB,wd(s,1,'8',.2))
  ],'tight');
  const notes=['','3 × 6 = 18: write 8, carry 1','0 × 6 + the carried 1','3 × 6 = ?   2 × 6 = ?'];
  if(notes[s]) h+=pen(notes[s],'rose',s<3?'write':'',.5);
  return h;
 }},

{q:`3604 ÷ 4 = ${BOX}`,ans:901,special:{91:"Careful, you've skipped the zero! When 4 doesn't go into 0, write a 0 on top."},
 hint:"Not quite. Work out 36 ÷ 4 and 4 ÷ 4, and keep the 0 in the middle.",
 say:["Bus stop method. 4 waits outside, and 3604 goes inside.",
      "How many 4s go into 3? None. Carry the 3 over to make 36.",
      "How many 4s go into 36? That goes on top of the 6.",
      "How many 4s go into 0? None, so write a <b>0</b> on top. Don't skip it!",
      "Your turn! Then how many 4s go into 4? Put it all together for the answer."],
 draw(s){
  let h=bus(s,{dv:'4',ds:['3','6','0','4'],k0:0,top:[null,{q:2},{w:3,t:'0'},{q:4}],carries:[{i:1,t:'3',k:1}],hl:s=>[-1,0,1,2,3][s]});
  const notes=['',"4 into 3? Doesn't go. Carry 3.",'36 ÷ 4 = ?','0 ÷ 4 = 0: write 0','4 ÷ 4 = ?'];
  if(notes[s]) h+=pen(notes[s],'rose','write',.6);
  return h;
 }},

{q:`5.47 + 32.9 = ${BOX}`,ans:38.37,special:{8.76:"Careful: line up the decimal points, not the last digits."},
 hint:"Not quite. Check the tenths: 4 + 9 is more than 10, so carry 1 into the ones.",
 say:["Adding decimals: the most important thing is to <b>line up the decimal points</b>.",
      "Write the numbers in columns with the points in a straight line: ones under ones, tenths under tenths.",
      "32.9 has no hundredths, so fill the gap with a 0. 32.9 is the same as 32.90.",
      "Start on the right. Hundredths: 7 + 0 = 7.",
      "Your turn! Keep going left: tenths, ones, then tens. Put the decimal point in the answer, lined up with the others."],
 draw(s){
  if(s===0) return pen('5.47 + 32.9')+pen('line up the decimal points!','rose','write',.5);
  const P={t:'.',c:'ptc'+(s===1?' on':'')};
  const zt=s>=2?`<span class="rose ${s===2?'pop':''}" ${D(.3)}>0</span>`:'';
  const ap=s>=4?{t:`<span class="rose ${s===4?'pop':''}" ${D(.3)}>.</span>`}:'';
  let h=`<div class="${s===1?'fade':''}">`+colm(['c','c','c','.','c','c'],[
    R('','','5',P,'4',hc('7',s===3)),
    R('+','3','2',P,'9',{t:zt,c:s===3?'on':''}),
    '-',
    R('',QB,QB,ap,QB,wd(s,3,'7',.2))
  ])+'</div>';
  const notes=['','points in a straight line','32.9 = 32.90','7 + 0 = 7','keep going left'];
  return h+pen(notes[s],'rose',s<4?'write':'',.5);
 }},

{q:`891 × 36 = ${BOX}`,ans:32076,
 hint:"Not quite. Check both rows (891 × 6 and 891 × 30), then add them carefully.",
 say:["Long multiplication! 891 × 36 is 891 × 6, plus 891 × 30. We'll make two rows, then add them.",
      "Row 1 is 891 × 6. Ones: 1 × 6 = 6.",
      "Tens: 9 × 6 = 54. Write the 4 and carry the 5.",
      "Row 2 is 891 × 30. We're multiplying by 3 <b>tens</b>, so first put a <b>0</b> in the ones column as a placeholder.",
      "Now multiply by 3: 1 × 3 = 3, which goes in the tens.",
      "Your turn! Finish both rows, adding carries as you go, then add the two rows together."],
 draw(s){
  let h=colm(6,[
    CR('','','',carry(s,2,'5',0.9,'2.1rem','7.2rem',false),'',''),
    R('','','',hc('8',false),hc('9',s===2),hc('1',s===1||s===4)),
    R('×','','','',hc('3',s===3||s===4),hc('6',s===1||s===2)),
    '-',
    R(rl('×6'),'',QB,QB,wd(s,2,'4',.2),wd(s,1,'6',.2)),
    R(rl('×30'),QB,QB,QB,wd(s,4,'3',.2),wd(s,3,'0',.2)),
    '-',
    R('',QB,QB,QB,QB,QB)
  ],'tight');
  const notes=['891 × 6, then 891 × 30','1 × 6 = 6','9 × 6 = 54: write 4, carry 5','0 placeholder','1 × 3 = 3','finish both rows, then add'];
  return h+pen(notes[s],s>=1?'rose':'','write',.5);
 }},

{q:`${BOX} = 32.98 − 2.9`,ans:30.08,special:{32.69:"Careful: line up the decimal points, not the last digits.",30.8:"So close! Don't drop the 0 in the tenths. It's holding the place."},
 hint:"Not quite. Line up the points, make 2.9 into 2.90, and subtract column by column.",
 say:["The box is on the left, so just work out 32.98 − 2.9. First, <b>line up the decimal points</b>.",
      "Write the numbers in columns with the points in a straight line.",
      "2.9 has no hundredths, so fill the gap with a 0: 2.90.",
      "Start on the right. Hundredths: 8 − 0 = 8.",
      "Your turn! Now the tenths (9 − 9), the ones, then the tens. Don't forget the decimal point, and keep any zeros!"],
 draw(s){
  if(s===0) return pen(`${BOX} = 32.98 − 2.9`)+pen('line up the decimal points!','rose','write',.5);
  const P={t:'.',c:'ptc'+(s===1?' on':'')};
  const zt=s>=2?`<span class="rose ${s===2?'pop':''}" ${D(.3)}>0</span>`:'';
  const ap=s>=4?{t:`<span class="rose ${s===4?'pop':''}" ${D(.3)}>.</span>`}:'';
  let h=`<div class="${s===1?'fade':''}">`+colm(['c','c','c','.','c','c'],[
    R('','3','2',P,'9',hc('8',s===3)),
    R('−','','2',P,'9',{t:zt,c:s===3?'on':''}),
    '-',
    R('',QB,QB,ap,QB,wd(s,3,'8',.2))
  ])+'</div>';
  const notes=['','points in a straight line','2.9 = 2.90','8 − 0 = 8','9 − 9, then the ones and tens'];
  return h+pen(notes[s],'rose',s<4?'write':'',.5);
 }},

{q:`18${NB}238 − ${BOX} = 5183`,ans:13055,special:{23421:"That's 18 238 + 5183. The box is a part, not the whole, so subtract instead."},
 hint:"Not quite. Work out 18 238 − 5183 carefully, then check by adding your answer to 5183.",
 say:["Start with 18 238, take something away, and 5183 is left. The missing number is one of the <b>parts</b>.",
      "As a bar: the whole is 18 238. The parts are the mystery number and 5183.",
      "To find a missing part: the whole take away the part you know. So 18 238 − 5183.",
      "Column subtraction. Ones: 8 − 3 = 5.",
      "Tens: 3 − 8? Not enough tens, so exchange 1 hundred for 10 tens. The 2 hundreds become 1, and the 3 tens become 13.",
      "Your turn! Finish the tens (13 − 8), then the hundreds, thousands and ten thousands. Check: your answer + 5183 should make 18 238."],
 draw(s){
  if(s<3){
    let h=pen(`18${NB}238 − ${BOX} = 5183`);
    if(s>=1) h+=bar(s,1,`18${NB}238`,[{t:MQ,f:13},{t:'5183',f:5}],1);
    if(s>=2) h+=pen(`18${NB}238 − 5183`,'rose','write',.3);
    return h;
  }
  const ex=s>=4,a=s===4;
  let h=colm(6,[
    CR('','','',ex?{t:`<span class="${a?'write':''}" ${a?D(.4):''}>1</span>`}:'','',''),
    R('','1','8',{t:'2',c:ex?'strike '+(a?'anim':''):''},{t:(ex?`<span class="sup ${a?'hop':''}" style="--d:.9s;--hx:-2.1rem;--hy:0rem">1</span>`:'')+'3',c:a?'on':''},hc('8',s===3)),
    R('−','','5','1',hc('8',a),hc('3',s===3)),
    '-',
    R('',QB,QB,QB,QB,wd(s,3,'5',.2))
  ],'tight');
  const notes=['','','','8 − 3 = 5','exchange: 2 hundreds → 1, 3 tens → 13','13 − 8, then keep going left'];
  return h+pen(notes[s],'rose',s<5?'write':'',a?1.3:.3);
 }},

{q:`4332 = ${BOX} × 3`,ans:1444,
 hint:"Not quite. Carry on with the bus stop: 13 ÷ 3, then the next digits, carrying remainders.",
 say:["Something × 3 makes 4332. Do the opposite of multiplying: <b>divide</b>. So work out 4332 ÷ 3.",
      "Bus stop method. 3 waits outside, and 4332 goes inside.",
      "How many 3s go into 4? One, with 1 left over. Write 1 on top and carry the 1 to make 13.",
      "Your turn! How many 3s go into 13? Keep going along, carrying any remainders. What's the answer?"],
 draw(s){
  if(s===0) return pen(`4332 = ${BOX} × 3`)+pen('so ? = 4332 ÷ 3','rose','write',.5);
  let h=bus(s,{dv:'3',ds:['4','3','3','2'],k0:1,top:[{w:2,t:'1'},{q:3},{q:3},{q:3}],carries:[{i:1,t:'1',k:2,d:1}],hl:s=>s===2?0:s===3?1:-1});
  const notes=['','4332 ÷ 3','4 ÷ 3 = 1 r 1: write 1, carry 1','13 ÷ 3 = ?   …keep going'];
  return h+pen(notes[s],'rose','write',.5);
 }},

{q:`63${NB}782 ÷ ${BOX} = 2`,ans:31891,special:{127564:"That's 63 782 × 2. If dividing by the mystery number gives 2, the mystery number is half of 63 782."},
 hint:"Not quite. The mystery number is half of 63 782. Carry on with the bus stop.",
 say:["63 782 ÷ something = 2. That means the mystery number fits into 63 782 exactly <b>2 times</b>.",
      "As a bar: 63 782 is made of 2 equal parts. Each part is the mystery number.",
      "So the mystery number is half of 63 782. Work out 63 782 ÷ 2.",
      "Bus stop: how many 2s go into 6? Three. Write 3 on top.",
      "How many 2s go into 3? One, with 1 left over. Write 1 on top and carry the 1 to make 17.",
      "Your turn! How many 2s go into 17? Keep going along the digits. What's the answer?"],
 draw(s){
  if(s<3){
    let h=pen(`63${NB}782 ÷ ${BOX} = 2`);
    if(s>=1) h+=bar(s,1,`63${NB}782`,[{t:MQ,f:1},{t:MQ,f:1}],1);
    if(s>=2) h+=pen(`? = 63${NB}782 ÷ 2`,'rose','write',.3);
    return h;
  }
  let h=bus(s,{dv:'2',ds:['6','3','7','8','2'],k0:3,top:[{w:3,t:'3'},{w:4,t:'1'},{q:5},{q:5},{q:5}],carries:[{i:2,t:'1',k:4,d:1}],hl:s=>s===3?0:s===4?1:s===5?2:-1});
  const notes=['','','','6 ÷ 2 = 3','3 ÷ 2 = 1 r 1: carry 1','17 ÷ 2 = ?   …keep going'];
  return h+pen(notes[s],'rose','write',.5);
 }},

{q:`322${NB}684 + 979 + 88${NB}002 = ${BOX}`,ans:411665,
 hint:"Not quite. Check each column again, and add the carried numbers.",
 say:["Adding three numbers in columns. Line them up from the <b>right</b>: ones under ones, tens under tens.",
      "Ones column first: 4 + 9 + 2 = 15. Write the 5 and carry the 1 into the tens.",
      "Tens: 8 + 7 + 0, plus the 1 you carried.",
      "Your turn! Keep going left, column by column, adding any carries. What's the total?"],
 draw(s){
  let h=colm(7,[
    CR('','','','','',carry(s,1,'1',0.9,'2.1rem','9.5rem',s===2),''),
    R('','3','2','2','6',hc('8',s===2),hc('4',s===1)),
    R('+','','','','9',hc('7',s===2),hc('9',s===1)),
    R('+','','8','8','0',hc('0',s===2),hc('2',s===1)),
    '-',
    R('',QB,QB,QB,QB,QB,wd(s,1,'5',.2))
  ],'tight');
  const notes=['line up from the right','4 + 9 + 2 = 15: write 5, carry 1','8 + 7 + 0 + 1 = ?','keep going left'];
  return h+pen(notes[s],s>=1?'rose':'',s<3?'write':'',.5);
 }},

{q:`883 × 74 = ${BOX}`,ans:65342,
 hint:"Not quite. Check both rows (883 × 4 and 883 × 70), then add them carefully.",
 say:["Long multiplication! 883 × 74 is 883 × 4, plus 883 × 70. Two rows, then add them.",
      "Row 1 is 883 × 4. Ones: 3 × 4 = 12. Write the 2 and carry the 1.",
      "Row 2 is 883 × 70. We're multiplying by 7 <b>tens</b>, so put a <b>0</b> placeholder in the ones first.",
      "Now multiply by 7. 3 × 7 = 21: write the 1 in the tens and carry the 2.",
      "Your turn! Finish both rows, adding carries as you go, then add the two rows together."],
 draw(s){
  const r2h=s>=3?{t:QB.t+`<span class="sub ${s===3?'hop':''}" style="--d:.9s;--hx:2.1rem;--hy:0rem">2</span>`}:QB;
  let h=colm(6,[
    CR('','','','',carry(s,1,'1',0.9,'2.1rem','7.2rem',false),''),
    R('','','',hc('8',false),hc('8',false),hc('3',s===1||s===3)),
    R('×','','','',hc('7',s===2||s===3),hc('4',s===1)),
    '-',
    R(rl('×4'),'',QB,QB,QB,wd(s,1,'2',.2)),
    R(rl('×70'),QB,QB,r2h,wd(s,3,'1',.2),wd(s,2,'0',.2)),
    '-',
    R('',QB,QB,QB,QB,QB)
  ],'tight');
  const notes=['883 × 4, then 883 × 70','3 × 4 = 12: write 2, carry 1','0 placeholder','3 × 7 = 21: write 1, carry 2','finish both rows, then add'];
  return h+pen(notes[s],s>=1?'rose':'','write',.5);
 }}
]});
