/* LearnNaija learning engine — local-first MVP */
const USER_STORAGE_KEY="learnnaija_user";
const YORUBA_STORAGE_KEY="learnnaija_yoruba_progress";

const lessons={
 greetings:{id:"greetings",title:"Greetings",unit:"UNIT 01",xp:20,questions:[
  {type:"learn",title:"Good morning",yoruba:"Ẹ káàárọ̀",english:"Good morning",description:"Use this greeting when you meet someone in the morning."},
  {type:"multiple",title:"What does this mean?",question:"Ẹ káàsán",options:["Good morning","Good afternoon","Good evening"],answer:1},
  {type:"learn",title:"Good evening",yoruba:"Ẹ káalẹ́",english:"Good evening",description:"A warm greeting for the end of the day."},
  {type:"multiple",title:"What does this mean?",question:"Ẹ káàárọ̀",options:["Good night","Good morning","Thank you"],answer:1}]},
 introductions:{id:"introductions",title:"Introductions",unit:"UNIT 01",xp:20,questions:[
  {type:"learn",title:"My name is…",yoruba:"Orúkọ mi ni Oba",english:"My name is Oba",description:"Use this simple pattern when you introduce yourself."},
  {type:"multiple",title:"Choose the right meaning",question:"Kí ni orúkọ rẹ?",options:["Where are you going?","What is your name?","How are you?"],answer:1},
  {type:"multiple",title:"Complete the introduction",question:"Orúkọ mi ___ Oba",options:["rẹ","ni","káàárọ̀"],answer:1}]},
 courtesy:{id:"courtesy",title:"Courtesy",unit:"UNIT 01",xp:20,questions:[
  {type:"learn",title:"Thank you",yoruba:"Ẹ ṣé",english:"Thank you",description:"A small phrase that goes a long way."},
  {type:"multiple",title:"What does this mean?",question:"Pẹ̀lẹ́",options:["Sorry / take heart","Good afternoon","Please sit"],answer:0},
  {type:"multiple",title:"Choose the right reply",question:"Ẹ ṣé",options:["Ẹ káàárọ̀","Kò tọ́pẹ́","Orúkọ mi ni…"],answer:1}]},
 numbers:{id:"numbers",title:"Numbers",unit:"UNIT 01",xp:20,questions:[
  {type:"learn",title:"One",yoruba:"Ọ̀kan",english:"One",description:"Let’s start counting from the beginning."},
  {type:"multiple",title:"What number is this?",question:"Ẹ̀ẹ́ta",options:["Two","Three","Four"],answer:1},
  {type:"multiple",title:"Choose the Yorùbá word",question:"Two",options:["Ọ̀kan","Ẹjì","Ẹ̀ẹ́rin"],answer:1}]}
};
const lessonOrder=Object.keys(lessons);
const defaultUser={xp:240,streak:5,practiceCompleted:[],lastActive:null,weeklyActivity:{}};
let currentLesson=null,currentQuestionIndex=0,lessonScore=0,toastTimer;

const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function getUser(){return {...defaultUser,...(read(USER_STORAGE_KEY,{})||{})}}
function saveUser(u){localStorage.setItem(USER_STORAGE_KEY,JSON.stringify(u))}
function getProgress(){const p=read(YORUBA_STORAGE_KEY,{completedLessons:[]});return {completedLessons:Array.isArray(p?.completedLessons)?p.completedLessons:[]}}
function saveProgress(p){localStorage.setItem(YORUBA_STORAGE_KEY,JSON.stringify(p))}
function getLanguageProgress(language){return read(`learnnaija_${language}_progress`,{completedLessons:[]})||{completedLessons:[]}}
function completedCount(){return getProgress().completedLessons.filter(id=>lessons[id]).length}
function percentage(){return Math.round(completedCount()/lessonOrder.length*100)}
function isComplete(id){return getProgress().completedLessons.includes(id)}
function isUnlocked(id){const i=lessonOrder.indexOf(id);return i===0||isComplete(lessonOrder[i-1])}
function nextLesson(){return lessonOrder.find(id=>!isComplete(id))||lessonOrder[0]}
function allCompleted(){return ["yoruba","igbo","hausa"].reduce((n,l)=>n+getLanguageProgress(l).completedLessons.length,0)}
function totalLessons(){return lessonOrder.length+(window.extraCourses?Object.values(window.extraCourses).reduce((n,c)=>n+c.lessons.length,0):8)}
function vocabularyCount(){return 24+allCompleted()*6}
function todayKey(){return new Date().toISOString().slice(0,10)}
function touchActivity(kind="practice"){
 const u=getUser(),today=todayKey(),last=u.lastActive;
 if(last!==today){if(last){const d=(new Date(today)-new Date(last))/86400000;if(d===1)u.streak=(u.streak||0)+1;else if(d>1)u.streak=1}else u.streak=u.streak||1;u.lastActive=today}
 u.weeklyActivity={...(u.weeklyActivity||{})};u.weeklyActivity[today]=(u.weeklyActivity[today]||0)+1;saveUser(u)
}
function setText(s,v){const e=$(s);if(e)e.textContent=v}
function setWidth(s,v){const e=$(s);if(e)e.style.width=`${v}%`}
function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]))}

function updateDashboard(){
 const u=getUser(),done=completedCount(),progress=percentage(),next=lessons[nextLesson()],goal=Math.min(allCompleted(),3);
 setText("#xp-value",u.xp);setText("#streak-value",u.streak);setText("#header-streak-value",u.streak);setText("#completed-lessons-value",done);
 setText("#week-status",`${u.streak} day streak`);setText("#daily-goal-value",done?"1/1":"0/1");setText("#home-progress-text",`${progress}%`);setWidth("#home-progress-fill",progress);
 setText("#continue-lesson-name",next.title);setText("#continue-lesson-detail",isComplete(next.id)?"Review a lesson to keep the words warm.":"Start with the words that open every conversation.");
 setText("#yoruba-lessons",done);setText("#lesson-total",lessonOrder.length);setText("#yoruba-percentage",`${progress}%`);setWidth("#yoruba-progress-fill",progress);
 setText("#yoruba-status",done===lessonOrder.length?"Path complete":done?"In progress":"Ready to begin");setText("#course-progress-text",`${done} of ${lessonOrder.length} complete`);setText("#course-progress-number",`${progress}%`);
 const ring=$("#course-progress-ring");if(ring)ring.style.strokeDashoffset=String(182.2*(1-progress/100));
 setText("#profile-xp",u.xp);setText("#profile-streak",u.streak);setText("#profile-lessons",allCompleted());setText("#profile-goal-value",`${goal}/3`);
 setText("#profile-goal-copy",goal===3?"Goal reached — you showed up for yourself.":goal?`${3-goal} more lesson${3-goal===1?"":"s"} to reach your goal.`:"You are ready for your first one.");setWidth("#profile-goal-fill",goal/3*100);
 $$(".course-lesson").forEach(b=>{const id=b.dataset.lesson,done=isComplete(id),open=isUnlocked(id);b.disabled=!open;b.classList.toggle("completed",done);const i=$(".lesson-row-status i",b);if(i)i.className=done?"bi bi-check-circle-fill":open?"bi bi-arrow-right":"bi bi-lock-fill"})
}
function updateWelcome(){const h=new Date().getHours();setText("#today-label",h<12?"GOOD MORNING · YOUR DAILY PRACTICE":h<18?"GOOD AFTERNOON · YOUR DAILY PRACTICE":"GOOD EVENING · YOUR DAILY PRACTICE")}
function showScreen(id,updateHash=true){const t=document.getElementById(id);if(!t)return;$$(".app-screen").forEach(s=>s.classList.toggle("active-screen",s===t));if(updateHash)history.replaceState(null,"",`#${id}`);window.scrollTo({top:0,behavior:"smooth"});window.dispatchEvent(new CustomEvent("learnnaija:screen",{detail:{id}}))}
function startLesson(id){if(!lessons[id]||!isUnlocked(id)){showToast("Complete the lesson before this one to unlock it.");return}currentLesson=lessons[id];currentQuestionIndex=0;lessonScore=0;setText("#lesson-unit",currentLesson.unit);setText("#lesson-title",currentLesson.title);showScreen("lesson");renderQuestion()}
function renderQuestion(){
 const q=currentLesson?.questions[currentQuestionIndex],total=currentLesson?.questions.length,content=$("#lesson-content");if(!q||!content)return;
 setText("#lesson-counter",`${currentQuestionIndex+1} / ${total}`);setWidth("#lesson-progress-fill",(currentQuestionIndex+1)/total*100);
 if(q.type==="learn"){content.innerHTML=`<p class="lesson-label">LISTEN & LEARN</p><h1>${escapeHtml(q.title)}</h1><p class="lesson-description">${escapeHtml(q.description)}</p><article class="word-card"><small>YORÙBÁ</small><h2>${escapeHtml(q.yoruba)}</h2><p>${escapeHtml(q.english)}</p><button class="listen-button" id="listen-word" type="button"><i class="bi bi-volume-up-fill"></i> Hear it</button></article><button class="lesson-continue" id="next-question" type="button">Continue <i class="bi bi-arrow-right"></i></button>`;$(" #listen-word")?.addEventListener("click",()=>speak(q.yoruba));$("#next-question").addEventListener("click",advanceQuestion)}
 else{content.innerHTML=`<p class="lesson-label">QUICK CHECK</p><h1>${escapeHtml(q.title)}</h1><p class="lesson-description">Choose the answer that feels right.</p><article class="word-card"><small>YORÙBÁ</small><h2>${escapeHtml(q.question)}</h2><button class="listen-button" id="listen-word" type="button"><i class="bi bi-volume-up-fill"></i> Hear it</button></article><div class="answer-list">${q.options.map((o,i)=>`<button class="answer-option" data-answer="${i}" type="button"><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${escapeHtml(o)}</span></button>`).join("")}</div><button class="lesson-continue hidden" id="next-question" type="button">Continue <i class="bi bi-arrow-right"></i></button>`;$(" #listen-word")?.addEventListener("click",()=>speak(q.question));setUpAnswers(q)}
}
function setUpAnswers(q){const bs=$$(".answer-option"),next=$("#next-question");let answered=false;bs.forEach(b=>b.addEventListener("click",()=>{if(answered)return;answered=true;const s=Number(b.dataset.answer);bs.forEach((x,i)=>{x.disabled=true;if(i===q.answer)x.classList.add("correct")});if(s===q.answer)lessonScore++;else b.classList.add("wrong");next.classList.remove("hidden")}));next.addEventListener("click",advanceQuestion)}
function advanceQuestion(){currentQuestionIndex++;if(currentQuestionIndex>=currentLesson.questions.length)completeLesson();else renderQuestion()}
function completeLesson(){
 const already=isComplete(currentLesson.id);if(!already){const p=getProgress();p.completedLessons.push(currentLesson.id);saveProgress(p);const u=getUser();u.xp+=currentLesson.xp;saveUser(u);touchActivity("lesson")}
 const scoreText=lessonScore?`${lessonScore} quick check${lessonScore===1?"":"s"} right`:"You showed up and learned something new";
 $("#lesson-content").innerHTML=`<div class="lesson-complete"><div class="completion-icon"><i class="bi bi-check2"></i></div><p class="lesson-label">LESSON COMPLETE</p><h1>Ẹ ṣe, Oba!</h1><p>${already?"You gave this lesson another thoughtful review.":`You finished ${escapeHtml(currentLesson.title)}. ${scoreText}.`}</p><div class="xp-earned"><i class="bi bi-stars"></i>${already?"Lesson reviewed":`+${currentLesson.xp} XP earned`}</div><div class="completion-progress"><div class="completion-progress-header"><span>Yorùbá beginner path</span><strong>${percentage()}%</strong></div><div class="completion-progress-bar"><div style="width:${percentage()}%"></div></div></div><button class="completion-button" id="finish-lesson" type="button">Back to path <i class="bi bi-arrow-right"></i></button></div>`;
 setText("#lesson-counter","DONE");setWidth("#lesson-progress-fill",100);updateDashboard();window.dispatchEvent(new CustomEvent("learnnaija:progress"));$("#finish-lesson").addEventListener("click",()=>{showScreen("yoruba-course");updateDashboard()})
}
function speak(text){if(!("speechSynthesis"in window)){showToast("Audio playback is not available in this browser.");return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.72;speechSynthesis.speak(u)}
const practiceItems={
 vocabulary:{label:"VOCABULARY REVIEW",prompt:"What is the meaning of “Ẹ ṣé”?",options:["Thank you","Good morning","My name is…"],answer:0},
 listening:{label:"LISTENING PRACTICE",prompt:"Listen, then choose the phrase you hear.",options:["Ẹ káàárọ̀","Ẹ káàsán","Pẹ̀lẹ́"],answer:0,audio:"Ẹ káàárọ̀"},
 speaking:{label:"SPEAKING PRACTICE",prompt:"Say this phrase out loud, then tap when you are ready.",options:["I said it with confidence","Let me listen once more"],answer:0,phrase:"Orúkọ mi ni Oba"},
 "quick-quiz":{label:"DAILY REVIEW",prompt:"Which greeting would you use in the evening?",options:["Ẹ káàárọ̀","Ẹ káalẹ́","Ẹ ṣé"],answer:1}
};
function startPractice(type){
 const item=practiceItems[type];if(!item)return;touchActivity("practice");showScreen("practice");const s=$("#practice-session");if(!s)return;s.hidden=false;
 s.innerHTML=`<article class="practice-session-card"><div class="practice-session-header"><small>${item.label}</small><button id="close-practice" type="button"><i class="bi bi-x-lg"></i> Close</button></div>${item.phrase?`<article class="word-card"><small>SAY THIS OUT LOUD</small><h2>${item.phrase}</h2><button class="listen-button" id="practice-listen" type="button"><i class="bi bi-volume-up-fill"></i> Hear it</button></article>`:""}<h2>${escapeHtml(item.prompt)}</h2>${item.audio?`<button class="listen-button" id="practice-listen" type="button"><i class="bi bi-play-fill"></i> Play phrase</button>`:""}<div class="practice-options">${item.options.map((o,i)=>`<button class="practice-option" data-practice-answer="${i}" type="button">${escapeHtml(o)}</button>`).join("")}</div><div class="practice-result" id="practice-result" hidden></div></article>`;
 $("#close-practice").addEventListener("click",closePractice);$("#practice-listen")?.addEventListener("click",()=>speak(item.audio||item.phrase));$$("[data-practice-answer]").forEach(b=>b.addEventListener("click",()=>finishPractice(type,item,Number(b.dataset.practiceAnswer))));requestAnimationFrame(()=>s.scrollIntoView({behavior:"smooth",block:"start"}))
}
function finishPractice(type,item,answer){const result=$("#practice-result");if(!result||!result.hidden)return;const correct=answer===item.answer;result.hidden=false;result.textContent=correct?"Lovely work — that is right.":"Nice try. Listen once more, then keep practicing.";$$("[data-practice-answer]").forEach((b,i)=>{b.disabled=true;if(i===item.answer)b.classList.add("correct")});if(correct){const u=getUser();if(!u.practiceCompleted.includes(type)){u.practiceCompleted.push(type);u.xp+=10;saveUser(u);touchActivity("practice");updateDashboard();showToast("+10 XP for practice")}}}
function closePractice(){const s=$("#practice-session");if(s){s.hidden=true;s.innerHTML=""}}
function modalContent(type){
 const c=allCompleted(),u=getUser();
 if(type==="notifications")return `<header><div><p class="eyebrow">YOUR UPDATES</p><h2 id="modal-title">A little nudge</h2></div><button class="modal-close" data-close-modal type="button"><i class="bi bi-x-lg"></i></button></header><p>Keep the loop simple: learn, listen, speak, repeat.</p><div class="notification-list"><div class="notification-item"><i class="bi bi-fire"></i><div><strong>Your ${u.streak}-day streak is glowing</strong><span>One focused session keeps the habit moving.</span></div></div><div class="notification-item"><i class="bi bi-stars"></i><div><strong>AI practice is ready</strong><span>Try a conversation or pronunciation session.</span></div></div></div>`;
 if(type==="achievements")return `<header><div><p class="eyebrow">MILESTONES</p><h2 id="modal-title">Your bright spots</h2></div><button class="modal-close" data-close-modal type="button"><i class="bi bi-x-lg"></i></button></header><p>Every session adds up.</p><div class="achievement-grid"><div class="achievement"><i class="bi bi-fire"></i><strong>On a roll</strong><span>${u.streak}-day streak</span></div><div class="achievement ${c<1?"locked":""}"><i class="bi bi-stars"></i><strong>First steps</strong><span>${c?"First lesson finished":"Complete a lesson"}</span></div><div class="achievement ${c<3?"locked":""}"><i class="bi bi-trophy"></i><strong>Habit maker</strong><span>Finish 3 lessons</span></div><div class="achievement ${c<12?"locked":""}"><i class="bi bi-gem"></i><strong>Path finder</strong><span>Finish 12 lessons</span></div></div>`;
 if(type==="settings")return `<header><div><p class="eyebrow">PREFERENCES</p><h2 id="modal-title">Make it yours</h2></div><button class="modal-close" data-close-modal type="button"><i class="bi bi-x-lg"></i></button></header><div class="settings-row"><div><strong>Lesson sounds</strong><span>Hear phrases as you learn</span></div><input type="checkbox" checked></div><div class="settings-row"><div><strong>Daily reminder</strong><span>A gentle nudge to practise</span></div><input type="checkbox"></div><div class="settings-row"><div><strong>Celebrate progress</strong><span>Show XP and milestone moments</span></div><input type="checkbox" checked></div><button class="modal-action" data-close-modal>Save preferences</button>`;
 return `<header><div><p class="eyebrow">YOUR PATH</p><h2 id="modal-title">Yorùbá · Beginner</h2></div><button class="modal-close" data-close-modal type="button"><i class="bi bi-x-lg"></i></button></header><p>${completedCount()} of ${lessonOrder.length} Yorùbá lessons complete. Explore Igbo and Hausa from the Learn tab.</p><button class="modal-action" data-close-modal>Keep learning</button>`
}
function openModal(type){const l=$("#modal-layer"),c=$("#modal-card");if(!l||!c)return;c.innerHTML=modalContent(type);l.hidden=false;document.body.style.overflow="hidden"}
function closeModal(){const l=$("#modal-layer");if(l)l.hidden=true;document.body.style.overflow=""}
function showToast(m){const t=$("#toast");if(!t)return;t.textContent=m;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2800)}
function attachEvents(){
 $$("[data-practice]").forEach(b=>b.addEventListener("click",()=>startPractice(b.dataset.practice)));
 $$("[data-modal]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.modal)));
 $("#modal-layer")?.addEventListener("click",e=>{if(e.target===e.currentTarget||e.target.closest("[data-close-modal]"))closeModal()});
 $("#back-to-languages")?.addEventListener("click",()=>showScreen("learn"));$("#lesson-back")?.addEventListener("click",()=>showScreen("yoruba-course"));
 $("#challenge-button")?.addEventListener("click",()=>startPractice("quick-quiz"));$("#notification-trigger")?.addEventListener("click",()=>openModal("notifications"));
 $$(".course-lesson").forEach(b=>b.addEventListener("click",()=>startLesson(b.dataset.lesson)));
 window.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#modal-layer")?.hidden)closeModal()});
}
function initialize(){updateWelcome();updateDashboard();attachEvents();const initial=location.hash.slice(1);showScreen(document.getElementById(initial)?initial:"home",false)}
initialize();
window.LearnNaija={getUser,saveUser,getProgress,saveProgress,getLanguageProgress,allCompleted,totalLessons,vocabularyCount,touchActivity,showToast,showScreen,speak,updateDashboard};
