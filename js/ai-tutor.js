const languageNames = {
  yoruba: 'Yorùbá',
  igbo: 'Igbo',
  hausa: 'Hausa'
};

const languageGreetings = {
  yoruba: 'Báwo Oba 👋',
  igbo: 'Ndewo Oba 👋',
  hausa: 'Sannu Oba 👋'
};

let currentLanguage = localStorage.getItem('learnnaija_language') || 'yoruba';

const chatArea = document.getElementById('chat-area');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const welcomeMessage = document.getElementById('welcome-message');
const tutorStatus = document.getElementById('tutor-status');

function getResponse(message) {
  const text = message.toLowerCase();
  const language = languageNames[currentLanguage];

  if (text.includes('quiz')) {
    return `Quick quiz time 🧠 In ${language}, try this: what do you think a common greeting means? Send your answer and I’ll guide you step by step.`;
  }

  if (text.includes('greeting') || text.includes('hello') || text.includes('teach')) {
    if (currentLanguage === 'yoruba') return 'Let’s start with “Báwo?” — a simple way to ask “How are you?” Try saying it back to me.';
    if (currentLanguage === 'igbo') return 'Let’s start with “Ndewo” as a friendly greeting. Try using it in a short sentence.';
    return 'Let’s start with “Sannu” as a common greeting. Try saying it naturally, then we can build a short conversation.';
  }

  if (text.includes('pronoun') || text.includes('pronounce') || text.includes('speak')) {
    return `Great choice 🎤 Pronunciation practice will let you hear a phrase, repeat it, and eventually receive feedback. For now, type the ${language} word you want to practise.`;
  }

  if (text.includes('practice') || text.includes('conversation') || text.includes('talk')) {
    return `Let’s practise ${language}. I’ll keep the conversation simple. Start by greeting me, and I’ll reply as your conversation partner.`;
  }

  if (text.includes('meaning') || text.includes('translate') || text.includes('what does')) {
    return `Send me the ${language} word or phrase you want to understand. I’ll explain its meaning and show you how it can fit into a real conversation.`;
  }

  return `Nice one 👍 Let’s use that as part of your ${language} practice. Ask me for a word, a translation, a quiz, or a conversation and we’ll take it one step at a time.`;
}

function addMessage(text, type = 'tutor') {
  const wrapper = document.createElement('div');
  wrapper.className = `chat-message ${type === 'user' ? 'user-message' : 'tutor-message'}`;

  if (type === 'tutor') {
    wrapper.innerHTML = `
      <div class="message-avatar"><i class="bi bi-stars"></i></div>
      <div class="message-bubble">
        <span class="message-label">AI TUTOR</span>
        <p></p>
      </div>`;
  } else {
    wrapper.innerHTML = '<div class="message-bubble"><p></p></div>';
  }

  wrapper.querySelector('p').textContent = text;
  chatArea.appendChild(wrapper);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function updateLanguage(language) {
  currentLanguage = language;
  localStorage.setItem('learnnaija_language', language);

  document.querySelectorAll('.language-tab').forEach((tab) => {
    const active = tab.dataset.language === language;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  const name = languageNames[language];
  tutorStatus.textContent = `${name} practice ready`;
  welcomeMessage.textContent = `${languageGreetings[language]} I’m ready to help you practice ${name}. What do you want to work on today?`;
  chatInput.placeholder = `Ask about ${name}...`;
}

document.querySelectorAll('.language-tab').forEach((tab) => {
  tab.addEventListener('click', () => updateLanguage(tab.dataset.language));
});

document.querySelectorAll('.quick-action').forEach((button) => {
  button.addEventListener('click', () => {
    const prompt = button.dataset.prompt;
    chatInput.value = prompt;
    chatForm.requestSubmit();
  });
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  chatInput.value = '';
  tutorStatus.textContent = 'Thinking...';

  window.setTimeout(() => {
    addMessage(getResponse(message));
    tutorStatus.textContent = `${languageNames[currentLanguage]} practice ready`;
  }, 450);
});

document.getElementById('voice-button').addEventListener('click', () => {
  addMessage('Voice practice is the next step 🎤 We’ll connect real speech input and pronunciation feedback after the AI backend is added.');
});

updateLanguage(currentLanguage);
