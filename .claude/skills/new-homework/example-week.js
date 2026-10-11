/* EXAMPLE week file: a template showing every answer type and the younger-child visuals.
   Not listed in homework/weeks.js, so the girls never see it. Copy patterns from here. */
HW.week({child:'year4',id:'example',
topics:[
  ['Adding and taking away',[1,2]],
  ['Place value',[3]],
  ['Time',[4]],
  ['Odd and even',[5]],
  ['Word problems',[6]],
],
questions:[

/* 1: number answer, number line jumps, a 'special' message for a predictable mistake */
{q:`47 + 25 = ${BOX}`,ans:72,special:{62:"Close! When the ones make more than 10, that extra ten has to be added on too."},
 hint:"Not quite. Jump on 20 from 47, then on 5 more.",
 say:["Let's add on a number line. Start at the bigger number, 47.",
      "25 is 2 tens and 5 ones. Jump on 2 tens first: 47, 57, 67.",
      "Now jump on the 5 ones. Your turn! Where do you land?"],
 draw(s){
  return numLine(s,{a:45,b:75,step:5,k0:0,
    marks:[{v:47,t:'47',k:0}],
    jumps:[{from:47,to:57,t:'+10',k:1,d:.2},{from:57,to:67,t:'+10',k:1,d:.9},{from:67,to:72,t:'+5',k:2}]})
   +pen(['47 + 25','47 + 10 + 10 = 67','67 + 5 = ?'][s],s?'rose':'','write',.5);
 }},

/* 2: missing number using a bar model */
{q:`${BOX} − 8 = 15`,ans:23,special:{7:"That's 15 − 8. The box is the number we start with, so it must be bigger than 15."},
 hint:"Not quite. The mystery number is the whole bar: add 15 and 8.",
 say:["Something take away 8 leaves 15. The mystery number is where we <b>start</b>.",
      "As a bar: the whole is the mystery number. Taking 8 away leaves 15.",
      "Your turn! To find the whole, add the two parts: 15 + 8."],
 draw(s){
  let h=pen(`${BOX} − 8 = 15`);
  if(s>=1) h+=bar(s,1,MQ,[{t:'15 left',f:65},{t:'8',f:35,c:'hatch'}],1);
  if(s>=2) h+=pen('15 + 8 = ?','rose','write',.4);
  return h;
 }},

/* 3: place value with base 10 blocks */
{q:`What number is 3 hundreds, 4 tens and 6 ones?`,long:true,tile:'3 hundreds, 4 tens, 6 ones',ans:346,
 hint:"Not quite. Write the hundreds digit, then the tens digit, then the ones digit.",
 say:["Let's build it with base 10 blocks.",
      "3 hundreds, 4 tens and 6 ones.",
      "Your turn! Write the digits in order: hundreds, tens, ones."],
 draw(s){
  return base10(s,1,3,4,6)+pen(['H T O','300 + 40 + 6','? ? ?'][s],s?'rose':'','write',.4);
 }},

/* 4: text answer with several accepted spellings + a tip under the box */
{q:`What time does the clock show?`+clock(3,30),tile:'What time is it? '+clock(3,30),long:true,
 text:true,ans:['3:30','03:30','3.30','half past 3','half past three'],tip:'Write it like 3:30, or in words.',
 hint:"Not quite. The long hand is on the 6, which means half past. The short hand has just passed the 3.",
 say:["The <b>long</b> hand shows the minutes. The <b>short</b> hand shows the hour.",
      "The long hand points at 6. That means 30 minutes: half past.",
      "The short hand is just past the 3. Your turn! What time is it?"],
 notes:['long hand = minutes','long hand on 6 = half past','half past ?']},

/* 5: multiple choice (ans must exactly match one of the choices) */
{q:`Is 27 odd or even?`,long:true,choices:['odd','even'],ans:'odd',
 hint:"Not quite. Look at the ones digit: 7. Can 7 counters be put into pairs with none left over?",
 say:["To tell if a number is odd or even, look at the <b>ones</b> digit.",
      "27 ends in 7. Let's put 7 counters into pairs.",
      "Your turn! Is there one left over?"],
 draw(s){return pen('27 → ones digit is 7')+counters(s,1,7,0,2)+(s>=2?pen('one left over?','rose','write',.3):'');}},

/* 6: an "explain"/"draw" question that can't be auto-marked: open:true (help is available straight away) */
{n:'6a',q:`Draw a shape with 4 sides and 4 right angles on your squared paper.`,long:true,tile:'Draw a shape…',open:true,
 say:["A right angle is a square corner, like the corner of a book.",
      "A shape with 4 sides and 4 square corners is a <b>square</b> or a <b>rectangle</b>."],
 notes:['right angle = square corner','square or rectangle']}
]});
