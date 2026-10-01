/* LearnNaija — starter curricula for Igbo and Hausa */
const extraCourses={
 igbo:{name:"Igbo",native:"Asụsụ Ìgbò",tag:"BEGINNER PATH · A1",lessons:[
  {id:"greetings",title:"Greetings",desc:"Say hello, ask how someone is, and say thanks.",questions:[
   {type:"learn",title:"Hello",native:"Ndeewo",english:"Hello / greetings",description:"A general Igbo greeting."},
   {type:"multiple",title:"What does this mean?",question:"Kedụ?",options:["How are you?","Thank you","Goodbye"],answer:0},
   {type:"learn",title:"Thank you",native:"Daalụ",english:"Thank you",description:"A common way to express thanks."}]},
  {id:"introductions",title:"Introductions",desc:"Ask a name and introduce yourself.",questions:[
   {type:"learn",title:"What's your name?",native:"Kedụ aha gị?",english:"What is your name?",description:"A useful question when meeting someone."},
   {type:"learn",title:"My name is Oba",native:"Aha m bụ Oba",english:"My name is Oba",description:"Use this pattern to introduce yourself."},
   {type:"multiple",title:"Choose the meaning",question:"Kedụ aha gị?",options:["Where are you from?","What is your name?","How are you?"],answer:1}]},
  {id:"courtesy",title:"Courtesy",desc:"Use simple polite expressions.",questions:[
   {type:"learn",title:"Please",native:"Biko",english:"Please",description:"A useful polite word."},
   {type:"multiple",title:"What does this mean?",question:"Ị meela",options:["Thank you","Please","Sorry"],answer:0},
   {type:"learn",title:"Sorry",native:"Ndo",english:"Sorry",description:"A simple apology."}]},
  {id:"numbers",title:"Numbers",desc:"Start counting in Igbo.",questions:[
   {type:"multiple",title:"One",question:"otu",options:["One","Two","Three"],answer:0},
   {type:"multiple",title:"Two",question:"abụọ",options:["One","Two","Four"],answer:1},
   {type:"learn",title:"Three",native:"atọ",english:"Three",description:"The beginning of your Igbo counting practice."}]}
 ]},
 hausa:{name:"Hausa",native:"Harshen Hausa",tag:"BEGINNER PATH · A1",lessons:[
  {id:"greetings",title:"Greetings",desc:"Start a simple Hausa conversation.",questions:[
   {type:"learn",title:"Hello",native:"Sannu",english:"Hello / welcome",description:"A common general greeting."},
   {type:"multiple",title:"How are you?",question:"Kana lahiya?",options:["How are you?","Thank you","What's your name?"],answer:0},
   {type:"learn",title:"Thank you",native:"Na gode",english:"Thank you",description:"A common way to say thank you."}]},
  {id:"introductions",title:"Introductions",desc:"Ask a name and introduce yourself.",questions:[
   {type:"learn",title:"What's your name?",native:"Mi sunanka?",english:"What is your name? (to a male)",description:"Hausa changes some forms by gender."},
   {type:"learn",title:"My name is Oba",native:"Sunana Oba",english:"My name is Oba",description:"Use this pattern to introduce yourself."},
   {type:"multiple",title:"Choose the meaning",question:"Daga ina ka fito?",options:["Where are you from?","How are you?","Good morning"],answer:0}]},
  {id:"courtesy",title:"Courtesy",desc:"Build a polite everyday vocabulary.",questions:[
   {type:"learn",title:"Please",native:"Don Allah",english:"Please",description:"A common polite expression."},
   {type:"multiple",title:"What does this mean?",question:"Yi haƙuri",options:["Sorry / be patient","Thank you","Hello"],answer:0},
   {type:"learn",title:"You're welcome",native:"Ba kome",english:"You're welcome / no problem",description:"A reply to thanks."}]},
  {id:"numbers",title:"Numbers",desc:"Start counting in Hausa.",questions:[
   {type:"multiple",title:"One",question:"ɗaya",options:["One","Two","Three"],answer:0},
   {type:"multiple",title:"Two",question:"biyu",options:["One","Two","Four"],answer:1},
   {type:"learn",title:"Three",native:"uku",english:"Three",description:"Keep building your Hausa counting vocabulary."}]}
 ]}}
;
const extraState={language:null,lesson:null,index:0,score:0};
function extraKey(){return `learnnaija_${extraState.language}_progress`}
function extraProgress(){try{const x=JSON.parse(localStorage.getItem(extraKey()));return {completedLessons:Array.isArray(x?.completedLessons)?x.completedLessons:[]}}catch{return {completedLessons:[]}}}
function saveExtraProgress(p){localStorage.setItem(extraKey(),JSON.stringify(p))}
function extraShow(id){if(typeof showScreen==="function")showScreen(id)}
function extraRenderCourse(language){
 const course=extraCourses[language];extraState.language=language;
 const section=document.getElementById("yoruba-course"); if(!section)return;
 const p=extraProgress();
 section.innerHTML=`<button class="back-button" id="extra-back" type="button"><i class="bi bi-arrow-left"></i> All languages</button><div class="course-hero"><div><p class="eyebrow">${course.tag}</p><h1 id="course-title">${course.name} <em>basics</em></h1><p>Learn useful everyday phrases for greetings, introductions, courtesy and numbers.</p></div><div class="course-progress-ring"><svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="29"></circle><circle id="course-progress-ring" class="ring-progress" cx="36" cy="36" r="29"></circle></svg><strong id="course-progress-number">0<small>%</small></strong></div></div><div class="course-meta"><span><i class="bi bi-layers"></i> 1 unit</span><span><i class="bi bi-clock"></i> About 20 minutes</span><span><i class="bi bi-award"></i> 80 XP available</span></div><div class="unit-heading"><div><p>UNIT 01</p><h2>Everyday beginnings</h2></div><span id="course-progress-text">${p.completedLessons.length} of ${course.lessons.length} complete</span></div><div class="lesson-path"><span class="path-line" aria-hidden="true"></span>${course.lessons.map((l,i)=>{const done=p.completedLessons.includes(l.id),open=i===0||p.completedLessons.includes(course.lessons[i-1].id);return `<button class="lesson-row extra-lesson ${done?"completed":""}" data-extra-lesson="${l.id}" ${open?"":"disabled"} type="button"><span class="path-node"><i class="bi bi-${i===0?"chat-heart":i===1?"person-heart":i===2?"heart":"123"}"></i></span><span class="lesson-row-copy"><small>LESSON 0${i+1}</small><strong>${l.title}</strong><em>${l.desc}</em></span><span class="lesson-row-status"><b>20 XP</b><i class="bi bi-${done?"check-circle-fill":open?"arrow-right":"lock-fill"}"></i></span></button>`}).join("")}</div>`;
 section.querySelector("#extra-back").addEventListener("click",()=>extraShow("learn"));
 section.querySelectorAll(".extra-lesson").forEach(b=>b.addEventListener("click",()=>extraStartLesson(b.dataset.extraLesson)));
 const percent=Math.round(p.completedLessons.length/course.lessons.length*100);document.getElementById("course-progress-number").innerHTML=`${percent}<small>%</small>`;document.getElementById("course-progress-ring").style.strokeDashoffset=String(182.2*(1-percent/100));
}
function extraStartLesson(id){const course=extraCourses[extraState.language];const lesson=course.lessons.find(x=>x.id===id);if(!lesson)return;extraState.lesson=lesson;extraState.index=0;extraState.score=0;document.getElementById("lesson-unit").textContent="UNIT 01";document.getElementById("lesson-title").textContent=lesson.title;extraShow("lesson");extraRenderQuestion()}
function extraRenderQuestion(){const q=extraState.lesson.questions[extraState.index],total=extraState.lesson.questions.length;document.getElementById("lesson-counter").textContent=`${extraState.index+1} / ${total}`;document.getElementById("lesson-progress-fill").style.width=`${(extraState.index+1)/total*100}%`;const content=document.getElementById("lesson-content");if(q.type==="learn"){content.innerHTML=`<p class="lesson-label">LISTEN & LEARN</p><h1>${q.title}</h1><p class="lesson-description">${q.description}</p><article class="word-card"><small>${extraCourses[extraState.language].name.toUpperCase()}</small><h2>${q.native}</h2><p>${q.english}</p><button class="listen-button" id="extra-listen" type="button"><i class="bi bi-volume-up-fill"></i> Hear it</button></article><button class="lesson-continue" id="extra-next" type="button">Continue <i class="bi bi-arrow-right"></i></button>`;document.getElementById("extra-listen").addEventListener("click",()=>speakExtra(q.native));document.getElementById("extra-next").addEventListener("click",extraNext)}else{content.innerHTML=`<p class="lesson-label">QUICK CHECK</p><h1>${q.title}</h1><p class="lesson-description">Choose the answer that feels right.</p><article class="question-card"><p class="question-prompt">${q.question}</p><div class="answer-list">${q.options.map((x,i)=>`<button class="answer-option" data-extra-answer="${i}" type="button">${x}</button>`).join("")}</div><button class="lesson-continue hidden" id="extra-next" type="button">Continue <i class="bi bi-arrow-right"></i></button></article>`;content.querySelectorAll("[data-extra-answer]").forEach(b=>b.addEventListener("click",()=>{content.querySelectorAll("[data-extra-answer]").forEach(x=>x.disabled=true);const selected=Number(b.dataset.extraAnswer);if(selected===q.answer){extraState.score++;b.classList.add("correct")}else{b.classList.add("wrong");content.querySelector(`[data-extra-answer="${q.answer}"]`).classList.add("correct")}document.getElementById("extra-next").classList.remove("hidden")}));document.getElementById("extra-next").addEventListener("click",extraNext)}}
function extraNext(){extraState.index++;if(extraState.index<extraState.lesson.questions.length)extraRenderQuestion();else extraComplete()}
function extraComplete(){const p=extraProgress(),already=p.completedLessons.includes(extraState.lesson.id);if(!already){p.completedLessons.push(extraState.lesson.id);saveExtraProgress(p);try{if(window.LearnNaija){const u=window.LearnNaija.getUser();u.xp=(u.xp||0)+20;window.LearnNaija.saveUser(u);window.LearnNaija.touchActivity("lesson")}else{const u=JSON.parse(localStorage.getItem("learnnaija_user"))||{xp:240,streak:5,practiceCompleted:[]};u.xp=(u.xp||0)+20;localStorage.setItem("learnnaija_user",JSON.stringify(u))}}catch{}window.dispatchEvent(new CustomEvent("learnnaija:progress"))}const pct=Math.round(p.completedLessons.length/extraCourses[extraState.language].lessons.length*100);document.getElementById("lesson-progress-fill").style.width="100%";document.getElementById("lesson-content").innerHTML=`<div class="lesson-complete"><div class="completion-icon"><i class="bi bi-check2"></i></div><p class="lesson-label">LESSON COMPLETE</p><h1>Ẹ ṣe! 🎉</h1><p>You completed ${extraState.lesson.title} in ${extraCourses[extraState.language].name}.</p><div class="xp-earned"><i class="bi bi-stars"></i>${already?"Lesson reviewed":"+20 XP earned"}</div><div class="completion-progress"><div class="completion-progress-header"><span>${extraCourses[extraState.language].name} beginner path</span><strong>${pct}%</strong></div><div class="completion-progress-bar"><div style="width:${pct}%"></div></div></div><button class="completion-button" id="extra-finish" type="button">Back to path <i class="bi bi-arrow-right"></i></button></div>`;document.getElementById("extra-finish").addEventListener("click",()=>{extraShow("yoruba-course");extraRenderCourse(extraState.language)})}
function speakExtra(text){if("speechSynthesis"in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.72;u.lang=extraState.language==="igbo"?"ig-NG":"ha-NG";speechSynthesis.speak(u)}}
document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll('.language-card[data-language="igbo"],.language-card[data-language="hausa"]').forEach(card=>card.addEventListener("click",event=>{event.stopImmediatePropagation();extraRenderCourse(card.dataset.language);extraShow("yoruba-course")},true))});

window.extraCourses=extraCourses;
