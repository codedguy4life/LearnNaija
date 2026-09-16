/* LearnNaija — a small, local-first language learning experience */

const USER_STORAGE_KEY = "learnnaija_user";
const YORUBA_STORAGE_KEY = "learnnaija_yoruba_progress";

const lessons = {
  greetings: {
    id: "greetings", title: "Greetings", unit: "UNIT 01", xp: 20,
    questions: [
      { type: "learn", title: "Good morning", yoruba: "Ẹ káàárọ̀", english: "Good morning", description: "Use this greeting when you meet someone in the morning." },
      { type: "multiple", title: "What does this mean?", question: "Ẹ káàsán", options: ["Good morning", "Good afternoon", "Good evening"], answer: 1 },
      { type: "learn", title: "Good evening", yoruba: "Ẹ káalẹ́", english: "Good evening", description: "A warm greeting for the end of the day." },
      { type: "multiple", title: "What does this mean?", question: "Ẹ káàárọ̀", options: ["Good night", "Good morning", "Thank you"], answer: 1 }
    ]
  },
  introductions: {
    id: "introductions", title: "Introductions", unit: "UNIT 01", xp: 20,
    questions: [
      { type: "learn", title: "My name is…", yoruba: "Orúkọ mi ni Oba", english: "My name is Oba", description: "Use this simple pattern when you introduce yourself." },
      { type: "multiple", title: "Choose the right meaning", question: "Kí ni orúkọ rẹ?", options: ["Where are you going?", "What is your name?", "How are you?"], answer: 1 },
      { type: "multiple", title: "Complete the introduction", question: "Orúkọ mi ___ Oba", options: ["rẹ", "ni", "káàárọ̀"], answer: 1 }
    ]
  },
  courtesy: {
    id: "courtesy", title: "Courtesy", unit: "UNIT 01", xp: 20,
    questions: [
      { type: "learn", title: "Thank you", yoruba: "Ẹ ṣé", english: "Thank you", description: "A small phrase that goes a long way." },
      { type: "multiple", title: "What does this mean?", question: "Pẹ̀lẹ́", options: ["Sorry / take heart", "Good afternoon", "Please sit"], answer: 0 },
      { type: "multiple", title: "Choose the right reply", question: "Ẹ ṣé", options: ["Ẹ káàárọ̀", "Kò tọ́pẹ́", "Orúkọ mi ni…"], answer: 1 }
    ]
  },
  numbers: {
    id: "numbers", title: "Numbers", unit: "UNIT 01", xp: 20,
    questions: [
      { type: "learn", title: "One", yoruba: "Ọ̀kan", english: "One", description: "Let’s start counting from the beginning." },
      { type: "multiple", title: "What number is this?", question: "Ẹ̀ẹ́ta", options: ["Two", "Three", "Four"], answer: 1 },
      { type: "multiple", title: "Choose the Yorùbá word", question: "Two", options: ["Ọ̀kan", "Ẹjì", "Ẹ̀ẹ́rin"], answer: 1 }
    ]
  }
};

const lessonOrder = Object.keys(lessons);
const defaultUser = { xp: 240, streak: 5, practiceCompleted: [] };
let currentLesson = null;
let currentQuestionIndex = 0;
let lessonScore = 0;
let toastTimer;

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function getUser() {
  try {
    const saved = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    return { ...defaultUser, ...(saved || {}), practiceCompleted: saved?.practiceCompleted || [] };
  } catch { return { ...defaultUser }; }
}

function saveUser(user) { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)); }

function getProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(YORUBA_STORAGE_KEY));
    return { completedLessons: Array.isArray(saved?.completedLessons) ? saved.completedLessons : [] };
  } catch { return { completedLessons: [] }; }
}

function saveProgress(progress) { localStorage.setItem(YORUBA_STORAGE_KEY, JSON.stringify(progress)); }
function completedCount() { return getProgress().completedLessons.filter((id) => lessons[id]).length; }
function percentage() { return Math.round((completedCount() / lessonOrder.length) * 100); }
function isComplete(id) { return getProgress().completedLessons.includes(id); }
function isUnlocked(id) { const index = lessonOrder.indexOf(id); return index === 0 || isComplete(lessonOrder[index - 1]); }
function nextLesson() { return lessonOrder.find((id) => !isComplete(id)) || lessonOrder[0]; }

function setText(selector, value) { const element = $(selector); if (element) element.textContent = value; }
function setWidth(selector, value) { const element = $(selector); if (element) element.style.width = `${value}%`; }

function updateDashboard() {
  const user = getUser();
  const completed = completedCount();
  const progress = percentage();
  const next = lessons[nextLesson()];
  const goal = Math.min(completed, 3);

  setText("#xp-value", user.xp);
  setText("#streak-value", user.streak);
  setText("#header-streak-value", user.streak);
  setText("#completed-lessons-value", completed);
  setText("#week-status", `${user.streak} day streak`);
  setText("#daily-goal-value", `${completed ? 1 : 0}/1`);
  setText("#home-progress-text", `${progress}%`);
  setWidth("#home-progress-fill", progress);
  setText("#continue-lesson-name", next.title);
  setText("#continue-lesson-detail", isComplete(next.id) ? "A beautiful habit is worth revisiting." : "Start with the words that open every conversation.");

  setText("#yoruba-lessons", completed);
  setText("#lesson-total", lessonOrder.length);
  setText("#yoruba-percentage", `${progress}%`);
  setWidth("#yoruba-progress-fill", progress);
  setText("#yoruba-status", completed === lessonOrder.length ? "Path complete" : completed ? "In progress" : "Ready to begin");
  setText("#course-progress-text", `${completed} of ${lessonOrder.length} complete`);
  setText("#course-progress-number", `${progress}%`);
  const ring = $("#course-progress-ring");
  if (ring) ring.style.strokeDashoffset = String(182.2 * (1 - progress / 100));

  setText("#profile-xp", user.xp);
  setText("#profile-streak", user.streak);
  setText("#profile-lessons", completed);
  setText("#profile-goal-value", `${goal}/3`);
  setText("#profile-goal-copy", goal === 3 ? "Goal reached — you showed up for yourself." : goal ? `${3 - goal} more lesson${3 - goal === 1 ? "" : "s"} to reach your goal.` : "You are ready for your first one.");
  setWidth("#profile-goal-fill", (goal / 3) * 100);

  $$(".course-lesson").forEach((button) => {
    const id = button.dataset.lesson;
    const done = isComplete(id);
    const open = isUnlocked(id);
    button.disabled = !open;
    button.classList.toggle("completed", done);
    const icon = $(".lesson-row-status i", button);
    if (icon) icon.className = done ? "bi bi-check-circle-fill" : open ? "bi bi-arrow-right" : "bi bi-lock-fill";
  });
}

function updateWelcome() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "GOOD MORNING · YOUR DAILY PRACTICE" : hour < 18 ? "GOOD AFTERNOON · YOUR DAILY PRACTICE" : "GOOD EVENING · YOUR DAILY PRACTICE";
  setText("#today-label", greeting);
}

function showScreen(screenId, updateHash = true) {
  const target = document.getElementById(screenId);
  if (!target) return;
  $$(".app-screen").forEach((screen) => screen.classList.toggle("active-screen", screen === target));
  $$(".nav-item").forEach((item) => item.classList.toggle("active", item.getAttribute("href") === `#${screenId}`));
  if (updateHash) history.replaceState(null, "", `#${screenId}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function startLesson(id) {
  if (!lessons[id] || !isUnlocked(id)) { showToast("Complete the lesson before this one to unlock it."); return; }
  currentLesson = lessons[id];
  currentQuestionIndex = 0;
  lessonScore = 0;
  setText("#lesson-unit", currentLesson.unit);
  setText("#lesson-title", currentLesson.title);
  showScreen("lesson");
  renderQuestion();
}

function renderQuestion() {
  if (!currentLesson) return;
  const question = currentLesson.questions[currentQuestionIndex];
  const total = currentLesson.questions.length;
  const content = $("#lesson-content");
  setText("#lesson-counter", `${currentQuestionIndex + 1} / ${total}`);
  setWidth("#lesson-progress-fill", ((currentQuestionIndex + 1) / total) * 100);

  if (question.type === "learn") {
    content.innerHTML = `
      <p class="lesson-label">LISTEN & LEARN</p>
      <h1>${escapeHtml(question.title)}</h1>
      <p class="lesson-description">${escapeHtml(question.description)}</p>
      <article class="word-card"><small>YORÙBÁ</small><h2>${escapeHtml(question.yoruba)}</h2><p>${escapeHtml(question.english)}</p><button class="listen-button" id="listen-word" type="button"><i class="bi bi-volume-up-fill"></i> Hear it</button></article>
      <button class="lesson-continue" id="next-question" type="button">Continue <i class="bi bi-arrow-right"></i></button>`;
    $("#listen-word").addEventListener("click", () => speak(question.yoruba));
    $("#next-question").addEventListener("click", advanceQuestion);
  } else {
    content.innerHTML = `
      <p class="lesson-label">QUICK CHECK</p>
      <h1>${escapeHtml(question.title)}</h1>
      <p class="lesson-description">Choose the answer that feels right.</p>
      <article class="word-card"><small>YORÙBÁ</small><h2>${escapeHtml(question.question)}</h2><button class="listen-button" id="listen-word" type="button"><i class="bi bi-volume-up-fill"></i> Hear it</button></article>
      <div class="answer-list">${question.options.map((option, index) => `<button class="answer-option" data-answer="${index}" type="button"><span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span></button>`).join("")}</div>
      <button class="lesson-continue hidden" id="next-question" type="button">Continue <i class="bi bi-arrow-right"></i></button>`;
    $("#listen-word").addEventListener("click", () => speak(question.question));
    setUpAnswers(question);
  }
}

function setUpAnswers(question) {
  const buttons = $$(".answer-option");
  const nextButton = $("#next-question");
  let answered = false;
  buttons.forEach((button) => button.addEventListener("click", () => {
    if (answered) return;
    answered = true;
    const selected = Number(button.dataset.answer);
    buttons.forEach((option, index) => {
      option.disabled = true;
      if (index === question.answer) option.classList.add("correct");
    });
    if (selected === question.answer) lessonScore += 1;
    else button.classList.add("wrong");
    nextButton.classList.remove("hidden");
  }));
  nextButton.addEventListener("click", advanceQuestion);
}

function advanceQuestion() {
  currentQuestionIndex += 1;
  if (currentQuestionIndex >= currentLesson.questions.length) completeLesson();
  else renderQuestion();
}

function completeLesson() {
  const alreadyComplete = isComplete(currentLesson.id);
  if (!alreadyComplete) {
    const progress = getProgress();
    progress.completedLessons.push(currentLesson.id);
    saveProgress(progress);
    const user = getUser();
    user.xp += currentLesson.xp;
    saveUser(user);
  }
  const scoreText = lessonScore ? `${lessonScore} quick check${lessonScore === 1 ? "" : "s"} right` : "You showed up and learned something new";
  const content = $("#lesson-content");
  content.innerHTML = `
    <div class="lesson-complete"><div class="completion-icon"><i class="bi bi-check2"></i></div><p class="lesson-label">LESSON COMPLETE</p><h1>Ẹ ṣe, Oba!</h1><p>${alreadyComplete ? "You gave this lesson another thoughtful review." : `You finished ${escapeHtml(currentLesson.title)}. ${scoreText}.`}</p><div class="xp-earned"><i class="bi bi-stars"></i>${alreadyComplete ? "Lesson reviewed" : `+${currentLesson.xp} XP earned`}</div><div class="completion-progress"><div class="completion-progress-header"><span>Yorùbá beginner path</span><strong>${percentage()}%</strong></div><div class="completion-progress-bar"><div style="width:${percentage()}%"></div></div></div><button class="completion-button" id="finish-lesson" type="button">Back to path <i class="bi bi-arrow-right"></i></button></div>`;
  setText("#lesson-counter", "DONE");
  setWidth("#lesson-progress-fill", 100);
  updateDashboard();
  $("#finish-lesson").addEventListener("click", () => { showScreen("yoruba-course"); updateDashboard(); });
}

function speak(text) {
  if (!("speechSynthesis" in window)) { showToast("Audio playback is not available in this browser."); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = .72;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

const practiceItems = {
  vocabulary: { label: "VOCABULARY REVIEW", prompt: "What is the meaning of “Ẹ ṣé”?", options: ["Thank you", "Good morning", "My name is…"], answer: 0 },
  listening: { label: "LISTENING PRACTICE", prompt: "Listen, then choose the phrase you hear.", options: ["Ẹ káàárọ̀", "Ẹ káàsán", "Pẹ̀lẹ́"], answer: 0, audio: "Ẹ káàárọ̀" },
  speaking: { label: "SPEAKING PRACTICE", prompt: "Say this phrase out loud, then tap when you are ready.", options: ["I said it with confidence", "Let me listen once more"], answer: 0, phrase: "Orúkọ mi ni Oba" },
  "quick-quiz": { label: "DAILY REVIEW", prompt: "Which greeting would you use in the evening?", options: ["Ẹ káàárọ̀", "Ẹ káalẹ́", "Ẹ ṣé"], answer: 1 }
};

function startPractice(type) {
  const item = practiceItems[type];
  if (!item) return;
  showScreen("practice");
  const session = $("#practice-session");
  session.hidden = false;
  session.innerHTML = `<article class="practice-session-card"><div class="practice-session-header"><small>${item.label}</small><button id="close-practice" type="button"><i class="bi bi-x-lg"></i> Close</button></div>${item.phrase ? `<article class="word-card"><small>SAY THIS OUT LOUD</small><h2>${escapeHtml(item.phrase)}</h2><button class="listen-button" id="practice-listen" type="button"><i class="bi bi-volume-up-fill"></i> Hear it</button></article>` : ""}<h2>${escapeHtml(item.prompt)}</h2>${item.audio ? `<button class="listen-button" id="practice-listen" type="button"><i class="bi bi-play-fill"></i> Play phrase</button>` : ""}<div class="practice-options">${item.options.map((option, index) => `<button class="practice-option" data-practice-answer="${index}" type="button">${escapeHtml(option)}</button>`).join("")}</div><div class="practice-result" id="practice-result" hidden></div></article>`;
  $("#close-practice").addEventListener("click", closePractice);
  if ($("#practice-listen")) $("#practice-listen").addEventListener("click", () => speak(item.audio || item.phrase));
  $$("[data-practice-answer]").forEach((button) => button.addEventListener("click", () => finishPractice(type, item, Number(button.dataset.practiceAnswer))));
  requestAnimationFrame(() => session.scrollIntoView({ behavior: "smooth", block: "start" }));
}

function finishPractice(type, item, answer) {
  const result = $("#practice-result");
  if (!result || !result.hidden) return;
  const correct = answer === item.answer;
  result.hidden = false;
  result.textContent = correct ? "Lovely work — that is right." : "Nice try. Listen once more, then keep practicing.";
  $$("[data-practice-answer]").forEach((button, index) => { button.disabled = true; if (index === item.answer) button.style.borderColor = "#08754c"; });
  if (correct) {
    const user = getUser();
    if (!user.practiceCompleted.includes(type)) { user.practiceCompleted.push(type); user.xp += 10; saveUser(user); updateDashboard(); showToast("+10 XP for your thoughtful practice"); }
  }
}

function closePractice() { const session = $("#practice-session"); session.hidden = true; session.innerHTML = ""; }

function modalContent(type) {
  const completed = completedCount();
  if (type === "notifications") return `<header><div><p class="eyebrow">YOUR UPDATES</p><h2 id="modal-title">A little nudge</h2></div><button class="modal-close" data-close-modal type="button" aria-label="Close"><i class="bi bi-x-lg"></i></button></header><p>Everything you need is waiting in your Yorùbá path.</p><div class="notification-list"><div class="notification-item"><i class="bi bi-fire"></i><div><strong>Your ${getUser().streak}-day streak is glowing</strong><span>One focused lesson keeps it alive today.</span></div></div><div class="notification-item"><i class="bi bi-lightning-charge"></i><div><strong>Daily challenge is ready</strong><span>Match a few phrases for an extra 30 XP.</span></div></div></div>`;
  if (type === "achievements") return `<header><div><p class="eyebrow">MILESTONES</p><h2 id="modal-title">Your bright spots</h2></div><button class="modal-close" data-close-modal type="button" aria-label="Close"><i class="bi bi-x-lg"></i></button></header><p>Every practice session adds up to something meaningful.</p><div class="achievement-grid"><div class="achievement"><i class="bi bi-fire"></i><strong>On a roll</strong><span>${getUser().streak}-day streak</span></div><div class="achievement"><i class="bi bi-stars"></i><strong>First steps</strong><span>${completed ? "First lesson finished" : "Complete a lesson"}</span></div><div class="achievement ${completed < 3 ? "locked" : ""}"><i class="bi bi-trophy"></i><strong>Habit maker</strong><span>Finish 3 lessons</span></div><div class="achievement locked"><i class="bi bi-gem"></i><strong>Path finder</strong><span>Finish the full path</span></div></div>`;
  if (type === "settings") return `<header><div><p class="eyebrow">PREFERENCES</p><h2 id="modal-title">Make it yours</h2></div><button class="modal-close" data-close-modal type="button" aria-label="Close"><i class="bi bi-x-lg"></i></button></header><div class="settings-row"><div><strong>Lesson sounds</strong><span>Hear phrases as you learn</span></div><input type="checkbox" checked aria-label="Lesson sounds"></div><div class="settings-row"><div><strong>Daily reminder</strong><span>A gentle nudge to practise</span></div><input type="checkbox" aria-label="Daily reminder"></div><div class="settings-row"><div><strong>Celebrate progress</strong><span>Show XP and milestone moments</span></div><input type="checkbox" checked aria-label="Celebrate progress"></div><button class="modal-action" data-close-modal type="button">Save preferences</button>`;
  if (type === "my-language") return `<header><div><p class="eyebrow">YOUR PATH</p><h2 id="modal-title">Yorùbá · Beginner</h2></div><button class="modal-close" data-close-modal type="button" aria-label="Close"><i class="bi bi-x-lg"></i></button></header><p>You are learning the everyday building blocks — greetings, introductions, courtesy, and numbers.</p><div class="modal-list"><div><i class="bi bi-collection"></i><div><strong>${completed} of ${lessonOrder.length} lessons complete</strong><span>${percentage()}% through the beginner path</span></div></div><div><i class="bi bi-award"></i><div><strong>${completed * 20} path XP earned</strong><span>Keep your words warm with daily review</span></div></div></div><button class="modal-action" id="open-course-from-modal" type="button">Open Yorùbá path</button>`;
  return `<header><div><p class="eyebrow">HELP US GROW</p><h2 id="modal-title">Which language next?</h2></div><button class="modal-close" data-close-modal type="button" aria-label="Close"><i class="bi bi-x-lg"></i></button></header><p>Igbo and Hausa are already on the roadmap. We are listening closely as LearnNaija grows.</p><div class="modal-list"><div><i class="bi bi-chat-dots"></i><div><strong>Tell us what you want to learn</strong><span>Your feedback will help shape the next path.</span></div></div></div><button class="modal-action" data-close-modal type="button">I’m excited for more</button>`;
}

function openModal(type) {
  const layer = $("#modal-layer");
  $("#modal-card").innerHTML = modalContent(type);
  layer.hidden = false;
  document.body.style.overflow = "hidden";
  if (type === "my-language") $("#open-course-from-modal")?.addEventListener("click", () => { closeModal(); showScreen("yoruba-course"); });
}

function closeModal() { $("#modal-layer").hidden = true; document.body.style.overflow = ""; }
function showToast(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 3200); }

function attachEvents() {
  $$(".nav-item").forEach((item) => item.addEventListener("click", (event) => { event.preventDefault(); closePractice(); showScreen(item.getAttribute("href").slice(1)); }));
  $$(".language-card").forEach((card) => card.addEventListener("click", () => card.dataset.language === "yoruba" ? showScreen("yoruba-course") : showToast(`${card.querySelector("strong").textContent} lessons are coming soon.`)));
  $("#back-to-languages").addEventListener("click", () => showScreen("learn"));
  $$(".course-lesson").forEach((button) => button.addEventListener("click", () => startLesson(button.dataset.lesson)));
  $("#continue-learning").addEventListener("click", () => startLesson(nextLesson()));
  $("#lesson-back").addEventListener("click", () => showScreen("yoruba-course"));
  $("#challenge-button").addEventListener("click", () => startPractice("quick-quiz"));
  $$("[data-practice]").forEach((button) => button.addEventListener("click", () => startPractice(button.dataset.practice)));
  $("#notification-trigger").addEventListener("click", () => { $(".notification-dot")?.remove(); openModal("notifications"); });
  $$("[data-modal]").forEach((button) => button.addEventListener("click", () => openModal(button.dataset.modal)));
  $("#modal-layer").addEventListener("click", (event) => { if (event.target === event.currentTarget || event.target.closest("[data-close-modal]")) closeModal(); });
  window.addEventListener("keydown", (event) => { if (event.key === "Escape" && !$("#modal-layer").hidden) closeModal(); });
}

function initialize() {
  updateWelcome();
  updateDashboard();
  attachEvents();
  const initialScreen = window.location.hash.slice(1);
  showScreen(document.getElementById(initialScreen) ? initialScreen : "home", false);
}

initialize();
