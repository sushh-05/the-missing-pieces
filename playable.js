const lessons = [
  {
    kicker: 'piece 1 · before you begin',
    q: 'What belongs before a treatment decision?',
    a: 'Someone else’s success story',
    b: 'A conversation about your health',
    explain: {
      surface: 'A success story cannot tell you what is appropriate for your health. Your history, medicines and questions belong in an individual clinical discussion.',
      care: 'A clinician can discuss your health history, possible benefits, risks and side effects. These vary by product and person, so ask about the exact option.'
    },
    source: 'NICE weight-management guidance (UK): medicines are considered as part of a broader, individualized plan.',
    href: 'https://www.nice.org.uk/guidance/ng246/chapter/medicines-and-surgery'
  },
  {
    kicker: 'piece 2 · more than the scale',
    q: 'What else deserves attention during weight loss?',
    a: 'Only the number on the scale',
    b: 'Muscle and strength, too',
    explain: {
      surface: 'The scale does not describe strength or body composition. Those can be reasonable topics to raise with your care team.',
      care: 'Resistance exercise during dietary weight loss may help limit lean-mass loss. Results vary. This is general weight-loss evidence, not a guarantee or proof about a specific medicine or programme.'
    },
    source: 'BMJ Open Sport & Exercise Medicine (2025), systematic review of resistance exercise during dietary weight loss.',
    href: 'https://bmjopensem.bmj.com/content/11/3/e002363'
  },
  {
    kicker: 'piece 3 · the longer view',
    q: 'When should you ask about long-term care?',
    a: 'Only after treatment ends',
    b: 'Before you start',
    explain: {
      surface: 'Asking early gives you space to understand follow-up and options if treatment changes.',
      care: 'Ask what ongoing support may involve and how you and your clinician would review a changing plan.'
    },
    source: 'STEP 1 trial extension: weight regain was observed after trial treatment and structured lifestyle support ended; individual outcomes vary.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/35441470/'
  }
];

const questions = {
  right: [
    'What would you want to know about my health history before recommending a plan?',
    'What are possible benefits, risks and side effects for me?',
    'What would make you change my treatment plan?'
  ],
  muscle: [
    'How will we monitor muscle and strength?',
    'What food and activity support could fit my routine?',
    'What would make you change my treatment plan?'
  ],
  longterm: [
    'What might ongoing treatment involve?',
    'How would we decide whether to continue, change or stop?',
    'What support is available if weight starts returning?'
  ]
};

const concernNames = {
  right: 'whether care is right for me',
  muscle: 'muscle and strength',
  longterm: 'long-term care'
};
const concernOrders = { right: [0, 1, 2], muscle: [1, 0, 2], longterm: [2, 0, 1] };
const hooks = {
  missing: {
    kicker: 'medical weight management · a 45-second guide',
    heading: 'Everyone talks about <em>the injection.</em><br>What’s missing?',
    copy: 'Build a fuller picture of care. Leave with questions for a doctor.',
    cta: 'Tap to choose what matters'
  },
  question: {
    kicker: 'your questions deserve a place',
    heading: 'What would you ask <em>before starting?</em>',
    copy: 'Pick what matters to you. Leave with questions for a doctor.',
    cta: 'Choose my first question'
  },
  calendar: {
    kicker: 'think beyond day one',
    heading: 'What happens if <em>treatment changes?</em>',
    copy: 'Explore the longer view of care, at your own pace.',
    cta: 'Explore the longer view'
  },
  routine: {
    kicker: 'care meets everyday life',
    heading: 'Could a care plan fit <em>real life?</em>',
    copy: 'Start with the question that matters most to you.',
    cta: 'Choose what matters to me'
  }
};

const $ = id => document.getElementById(id);
const hookId = 'missing';
let selectedConcern = null;
let currentStep = 0;
let sequence = concernOrders.right;
let selectedAnswers = [];

// Demo-only, in-memory events. Nothing is sent to Steer or stored remotely.
window.playableEvents = [{ event: 'hook_seen', hook: hookId, at: new Date().toISOString() }];
function track(event, details = {}) {
  window.playableEvents.push({ event, ...details, at: new Date().toISOString() });
}

function showScreen(id) {
  document.querySelectorAll('.ad-screen').forEach(screen => screen.classList.remove('active'));
  $(id).classList.add('active');
  $(id).scrollTop = 0;
}

function applyHook() {
  const hook = hooks[hookId];
  $('hookKicker').textContent = hook.kicker;
  $('introHeading').innerHTML = hook.heading;
  $('introCopy').textContent = hook.copy;
  $('startExperience').firstChild.textContent = `${hook.cta} `;
  document.title = `The Missing Pieces · ${hookId} hook`;
}

function renderQuestion() {
  const lesson = lessons[sequence[currentStep]];
  $('stepLabel').textContent = `piece ${currentStep + 1} of 3`;
  $('stepFill').style.width = `${((currentStep + 1) / 3) * 100}%`;
  $('quizKicker').textContent = lesson.kicker;
  $('quizQuestion').textContent = lesson.q;
  $('choiceA').textContent = lesson.a;
  $('choiceB').textContent = lesson.b;
  $('adReveal').hidden = true;
  $('sourceNote').hidden = true;
  $('quizNext').disabled = true;
  $('placePieceButton').disabled = true;
  $('placePieceButton').textContent = 'Add this piece to the picture ✦';
  document.querySelectorAll('.quiz-answer').forEach(button => { button.disabled = false; });
  $('quizNext').innerHTML = currentStep === 2 ? 'See my questions <b>→</b>' : 'Next piece <b>→</b>';
}

function exploredTopics() {
  const labels = {
    0: { surface: 'Individual fit', care: 'Personal health discussion' },
    1: { surface: 'Beyond the scale', care: 'Muscle and strength' },
    2: { surface: 'Follow-up after treatment', care: 'Planning ahead' }
  };
  return sequence.map((lessonIndex, step) => labels[lessonIndex][selectedAnswers[step]]);
}

function renderResult() {
  showScreen('result');
  $('summary').textContent = `Starting question: ${concernNames[selectedConcern]}. Your answers stay in this browser.`;
  $('selectedTopics').textContent = `Topics you chose: ${exploredTopics().join(' · ')}.`;
  $('adQuestions').replaceChildren(...questions[selectedConcern].map(question => {
    const item = document.createElement('li');
    item.textContent = question;
    return item;
  }));
  track('question_card_ready', { concern: selectedConcern });
}

function cardText() {
  return `Before I decide — questions for a doctor\nStarting question: ${concernNames[selectedConcern]}\nTopics I chose: ${exploredTopics().join(', ')}\n\n${questions[selectedConcern].map((question, i) => `${i + 1}. ${question}`).join('\n')}`;
}

applyHook();
const playableCollection = document.createElement('div');
playableCollection.className = 'playable-collection';
playableCollection.setAttribute('aria-label', 'Three picture pieces to collect');
playableCollection.innerHTML = '<span data-collection="0"><b>01</b><small>Before</small><i>Locked</i></span><span data-collection="1"><b>02</b><small>Strength</small><i>Locked</i></span><span data-collection="2"><b>03</b><small>Long view</small><i>Locked</i></span>';
document.querySelector('.ad-progress').insertAdjacentElement('afterend', playableCollection);
const adCompanion = document.createElement('aside');
adCompanion.className = 'ad-companion';
adCompanion.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 18c0-9 6-14 13-14s13 5 13 14v14c0 5-4 9-9 9h-8c-5 0-9-4-9-9V18Z" fill="#fffaf2" stroke="#9d553e" stroke-width="1.5"/><path d="M26 4c7 0 13 6 13 13H27c-5 0-8-3-8-7s3-6 7-6Z" fill="#c04e2a"/><circle cx="21" cy="21" r="1.7" fill="#351d1d"/><circle cx="31" cy="21" r="1.7" fill="#351d1d"/><path d="M22 27c2 3 6 3 8 0M13 24l-7-5m32 4 4-7" fill="none" stroke="#9d553e" stroke-width="2" stroke-linecap="round"/><path d="M37 7h6v5h-3v3h-4v-3h-3V7h4Z" fill="#e7a04c"/></svg><span class="ad-buddy-copy" id="adBuddyCopy">I’m Pip. Let’s find the missing pieces.</span><button type="button" id="adSoundToggle" aria-pressed="false">♫ Sound off</button>';
playableCollection.insertAdjacentElement('afterend', adCompanion);
let adSoundEnabled = false;
let adAudioContext = null;
function adSay(message, celebrate = false) {
  $('adBuddyCopy').textContent = message;
  adCompanion.classList.toggle('celebrating', celebrate);
  if (celebrate) setTimeout(() => adCompanion.classList.remove('celebrating'), 700);
}
function adRewardSound() {
  if (!adSoundEnabled) return;
  const AudioAPI = window.AudioContext || window.webkitAudioContext;
  if (!AudioAPI) return;
  adAudioContext ||= new AudioAPI();
  [659.25, 783.99, 987.77].forEach((frequency, index) => {
    const oscillator = adAudioContext.createOscillator();
    const gain = adAudioContext.createGain();
    const start = adAudioContext.currentTime + index * 0.07;
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.1, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
    oscillator.connect(gain);
    gain.connect(adAudioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.21);
  });
}
document.getElementById('adSoundToggle').addEventListener('click', event => {
  adSoundEnabled = !adSoundEnabled;
  event.currentTarget.setAttribute('aria-pressed', String(adSoundEnabled));
  event.currentTarget.textContent = adSoundEnabled ? '♫ Sound on' : '♫ Sound off';
  adSay(adSoundEnabled ? 'Sound on. A soft chime plays when you place a piece.' : 'Sound off. Keep building your picture.');
  if (adSoundEnabled) {
    const AudioAPI = window.AudioContext || window.webkitAudioContext;
    if (AudioAPI) {
      adAudioContext ||= new AudioAPI();
      if (adAudioContext.state === 'suspended') adAudioContext.resume();
    } else {
      adSoundEnabled = false;
      event.currentTarget.setAttribute('aria-pressed', 'false');
      event.currentTarget.textContent = 'Sound unavailable';
      adSay('Your picture still comes to life without sound.');
    }
  }
});
const placePieceButton = document.createElement('button');
placePieceButton.className = 'ad-place-piece';
placePieceButton.id = 'placePieceButton';
placePieceButton.type = 'button';
placePieceButton.disabled = true;
placePieceButton.textContent = 'Add this piece to the picture ✦';
$('sourceToggle').insertAdjacentElement('beforebegin', placePieceButton);
for (let i = 0; i < lessons.length; i += 1) {
  const piece = document.createElement('span');
  piece.className = 'mini-piece';
  piece.dataset.piece = i;
  piece.textContent = '✦';
  piece.setAttribute('aria-hidden', 'true');
  document.querySelector('.mini-scene').append(piece);
}

$('startExperience').addEventListener('click', () => {
  track('hook_started', { hook: hookId });
  showScreen('concerns');
});

document.querySelectorAll('[data-back]').forEach(button => {
  button.addEventListener('click', () => showScreen(button.dataset.back));
});

document.querySelectorAll('[data-concern]').forEach(button => {
  button.addEventListener('click', () => {
    selectedConcern = button.dataset.concern;
    sequence = concernOrders[selectedConcern];
    currentStep = 0;
    selectedAnswers = [];
    document.querySelectorAll('.mini-piece').forEach(piece => piece.classList.remove('filled'));
    playableCollection.querySelectorAll('[data-collection]').forEach(piece => {
      piece.classList.remove('found');
      piece.querySelector('i').textContent = 'Locked';
    });
    track('concern_selected', { concern: selectedConcern, hook: hookId });
    renderQuestion();
    showScreen('quiz');
  });
});

document.querySelectorAll('.quiz-answer').forEach(button => {
  button.addEventListener('click', () => {
    const lessonIndex = sequence[currentStep];
    const lesson = lessons[lessonIndex];
    selectedAnswers[currentStep] = button.dataset.answer;
    document.querySelectorAll('.quiz-answer').forEach(answer => { answer.disabled = true; });
    $('answerFeedback').textContent = lesson.explain[button.dataset.answer];
    $('sourceNote').replaceChildren(
      document.createTextNode(`${lesson.source} `),
      Object.assign(document.createElement('a'), {
        href: lesson.href,
        target: '_blank',
        rel: 'noreferrer',
        textContent: 'Read source ↗'
      })
    );
    $('adReveal').hidden = false;
    $('placePieceButton').disabled = false;
    track('piece_answered', { concern: selectedConcern, piece: lessonIndex + 1, answer: button.dataset.answer });
  });
});

$('placePieceButton').addEventListener('click', () => {
  const lessonIndex = sequence[currentStep];
  const scenePiece = document.querySelector(`.mini-piece[data-piece="${lessonIndex}"]`);
  scenePiece.classList.add('filled');
  adRewardSound();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const sparkle = document.createElement('span');
    sparkle.className = 'ad-reward-spark';
    sparkle.textContent = '✦';
    sparkle.setAttribute('aria-hidden', 'true');
    document.querySelector('.mini-scene').append(sparkle);
    setTimeout(() => sparkle.remove(), 650);
  }
  const token = playableCollection.querySelector(`[data-collection="${lessonIndex}"]`);
  token.classList.add('found');
  token.querySelector('i').textContent = 'Found';
  $('placePieceButton').textContent = 'Piece added ✓';
  $('placePieceButton').disabled = true;
  $('quizNext').disabled = false;
  const remaining = 3 - playableCollection.querySelectorAll('.found').length;
  adSay(remaining ? `Piece found! ${remaining} left to complete the picture.` : 'Picture complete! Your doctor questions are ready.', true);
  track('piece_placed', { concern: selectedConcern, piece: lessonIndex + 1 });
});

$('sourceToggle').addEventListener('click', () => {
  $('sourceNote').hidden = !$('sourceNote').hidden;
  track('source_opened', { piece: sequence[currentStep] + 1 });
});

$('quizNext').addEventListener('click', () => {
  currentStep += 1;
  if (currentStep < lessons.length) {
    renderQuestion();
  } else {
    renderResult();
  }
});

$('copyCard').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(cardText());
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = cardText();
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
  track('question_card_copied', { concern: selectedConcern });
  $('copyCard').textContent = 'Copied ✓';
  setTimeout(() => { $('copyCard').textContent = 'Copy questions'; }, 1500);
});

$('saveCard').addEventListener('click', () => {
  const escapeXml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
  const lineHeight = 58;
  const lines = questions[selectedConcern].map((question, i) =>
    `<text x="54" y="${320 + i * lineHeight}" font-family="Arial" font-size="20" fill="#351d1d">${i + 1}. ${escapeXml(question)}</text>`
  ).join('');
  const topics = exploredTopics().join(' · ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700"><rect width="100%" height="100%" fill="#f5ebdf"/><rect x="22" y="22" width="856" height="656" rx="7" fill="#f8f2eb" stroke="#e6cbbd" stroke-width="2"/><text x="54" y="88" font-family="Arial" font-size="20" fill="#b58777">BEFORE I DECIDE · STEER</text><text x="54" y="170" font-family="Georgia" font-size="43" fill="#351d1d">Questions for a doctor</text><text x="54" y="232" font-family="Arial" font-size="18" fill="#c04e2a">Starting question: ${escapeXml(concernNames[selectedConcern])}</text><text x="54" y="275" font-family="Arial" font-size="15" fill="#9d7566">Topics I chose: ${escapeXml(topics)}</text>${lines}<text x="54" y="638" font-family="Arial" font-size="14" fill="#9d7566">Bring these questions to a clinician. Educational resource; not medical advice.</text></svg>`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  link.download = 'steer-question-card.svg';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  track('question_card_saved', { concern: selectedConcern });
});

$('adHandoff').addEventListener('click', () => {
  track('handoff_opened', { concern: selectedConcern });
  showScreen('leave');
});
$('acknowledge').addEventListener('change', event => { $('leaveForSteer').disabled = !event.target.checked; });
$('leaveForSteer').addEventListener('click', () => {
  track('handoff_continued', { concern: selectedConcern });
  window.open('https://steerclub.com', '_blank', 'noopener,noreferrer');
});
$('playAgain').addEventListener('click', () => {
  selectedConcern = null;
  currentStep = 0;
  document.querySelectorAll('.mini-piece').forEach(piece => piece.classList.remove('filled'));
  playableCollection.querySelectorAll('[data-collection]').forEach(piece => {
    piece.classList.remove('found');
    piece.querySelector('i').textContent = 'Locked';
  });
  $('acknowledge').checked = false;
  $('leaveForSteer').disabled = true;
  track('restart', { hook: hookId });
  showScreen('intro');
});
