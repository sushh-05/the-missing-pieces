const pieces = [
  {
    eyebrow: 'piece one · before you begin',
    question: 'What belongs before a treatment decision?',
    a: 'Someone else’s success story',
    b: 'A conversation about your health',
    answers: {
      surface: 'A success story can be interesting, but it cannot tell you what is appropriate for your health. Your history, medicines and questions belong in an individual clinical discussion.',
      care: 'That’s a useful place to start. A clinician can consider your health history, medicines, goals, possible benefits and risks with you.'
    },
    source: 'NICE guidance describes medicine as one part of a weight-management plan and recommends discussion with a healthcare professional.'
  },
  {
    eyebrow: 'piece two · more than the scale',
    question: 'What else deserves attention during weight loss?',
    a: 'Only the number on the scale',
    b: 'Muscle and strength, too',
    answers: {
      surface: 'The scale is one measure, but it does not describe strength or body composition. Those can be reasonable topics to raise with your care team.',
      care: 'Yes—strength and body composition deserve attention too. Resistance exercise during dietary weight loss may help limit lean-mass loss, though results vary. This is general weight-loss evidence, not a guarantee or proof about a specific medicine or programme.'
    },
    source: 'BMJ Open Sport & Exercise Medicine (2025), systematic review and meta-analysis of resistance exercise during dietary weight loss.'
  },
  {
    eyebrow: 'piece three · the longer view',
    question: 'When should you ask about long-term care?',
    a: 'Only after treatment ends',
    b: 'Before you start',
    answers: {
      surface: 'It can be harder to plan for changes after they happen. Asking early gives you space to understand follow-up and options if treatment changes.',
      care: 'Good question to raise early. Ask what ongoing support may involve and how you and your clinician would review a changing plan.'
    },
    source: 'The STEP 1 extension reported weight regain after trial treatment and structured lifestyle support ended. This study does not predict an individual’s outcome.'
  }
];

const questions = {
  right: [
    'What would you want to know about my health history before recommending a plan?',
    'What are the possible benefits, risks and side effects for me?',
    'What would make you change my treatment plan?'
  ],
  muscle: [
    'How will we monitor muscle and strength?',
    'What food and activity support would fit my routine?',
    'What would make you change my treatment plan?'
  ],
  longterm: [
    'What might ongoing treatment involve?',
    'How would we decide whether to continue, change or stop?',
    'What support is available if weight starts returning?'
  ]
};

const concernNames = {
  right: 'whether treatment is right for you',
  muscle: 'muscle and strength',
  longterm: 'long-term care'
};
const concernOrder = { right: [0, 1, 2], muscle: [1, 0, 2], longterm: [2, 0, 1] };
const topicNames = {
  0: { surface: 'Individual fit', care: 'Personal health discussion' },
  1: { surface: 'Beyond the scale', care: 'Muscle and strength' },
  2: { surface: 'Follow-up after treatment', care: 'Planning ahead' }
};
const $ = id => document.getElementById(id);
let concern = null;
let pieceIndex = 0;
let pieceOrder = concernOrder.right;
let currentPieceIndex = 0;
let answersChosen = {};
let soundEnabled = false;
let soundContext = null;

window.steerEvents = [];
function track(event, details = {}) {
  window.steerEvents.push({ event, ...details, at: new Date().toISOString() });
}
track('hook_seen', { hook: 'missing-pieces' });
$('progressCount').setAttribute('aria-live', 'polite');

const companion = document.createElement('aside');
companion.className = 'game-companion';
companion.innerHTML = '<div class="companion-avatar" aria-hidden="true"><svg viewBox="0 0 72 72"><path class="buddy-scarf" d="M23 40 12 54l18-4"/><path class="buddy-body" d="M22 30c0-12 8-20 18-20s18 8 18 20v19c0 6-5 11-11 11H31c-6 0-11-5-11-11V30Z"/><path class="buddy-patch" d="M42 10c9 0 16 7 16 16H42c-6 0-10-4-10-8s4-8 10-8Z"/><circle cx="32" cy="32" r="2"/><circle cx="47" cy="32" r="2"/><path class="buddy-smile" d="M34 40c3 4 8 4 11 0"/><path class="buddy-arm" d="M20 38 8 30m50 9 7-13"/><path class="buddy-piece" d="M56 14h10v8h-4v4h-6v-4h-4v-8h4Z"/></svg></div><div class="companion-talk"><span class="companion-name">Pip · your paper guide</span><p id="buddyMessage" role="status" aria-live="polite">Pick a question and let’s complete the picture together.</p></div><button class="sound-toggle" id="soundToggle" type="button" aria-pressed="false" aria-label="Turn sound on">♫ Sound off</button>';
const concernPanel = $('concernPanel');
$('experience').insertBefore(companion, concernPanel);

function say(message, mood = '') {
  $('buddyMessage').textContent = message;
  companion.classList.toggle('celebrating', mood === 'celebrate');
  if (mood === 'celebrate') setTimeout(() => companion.classList.remove('celebrating'), 800);
}

function playRewardSound() {
  if (!soundEnabled) return;
  const AudioAPI = window.AudioContext || window.webkitAudioContext;
  if (!AudioAPI) return;
  soundContext ||= new AudioAPI();
  if (soundContext.state === 'suspended') soundContext.resume();
  [659.25, 783.99, 987.77].forEach((frequency, index) => {
    const oscillator = soundContext.createOscillator();
    const gain = soundContext.createGain();
    const start = soundContext.currentTime + index * 0.075;
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.12, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
    oscillator.connect(gain);
    gain.connect(soundContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.23);
  });
}

function rewardBurst(slot) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scene = $('scene');
  const source = slot.getBoundingClientRect();
  const target = scene.getBoundingClientRect();
  for (let i = 0; i < 9; i += 1) {
    const spark = document.createElement('span');
    const angle = (Math.PI * 2 * i) / 9;
    const distance = 28 + (i % 3) * 12;
    spark.className = 'reward-spark';
    spark.textContent = i % 2 ? '✦' : '·';
    spark.style.left = `${source.left - target.left + source.width / 2}px`;
    spark.style.top = `${source.top - target.top + source.height / 2}px`;
    spark.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    spark.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    scene.append(spark);
    setTimeout(() => spark.remove(), 760);
  }
}

$('soundToggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  const AudioAPI = window.AudioContext || window.webkitAudioContext;
  if (!soundEnabled) {
    $('soundToggle').setAttribute('aria-pressed', 'false');
    $('soundToggle').setAttribute('aria-label', 'Turn sound on');
    $('soundToggle').textContent = '♫ Sound off';
    say('Sound off. The picture is still yours to complete.');
    return;
  }
  if (!AudioAPI) {
    soundEnabled = false;
    $('soundToggle').setAttribute('aria-pressed', 'false');
    $('soundToggle').setAttribute('aria-label', 'Sound is unavailable; continue without sound');
    $('soundToggle').textContent = 'Sound unavailable';
    say('No problem—your picture still comes to life without sound.');
    return;
  }
  $('soundToggle').setAttribute('aria-pressed', 'true');
  $('soundToggle').setAttribute('aria-label', 'Turn sound off');
  $('soundToggle').textContent = '♫ Sound on';
  soundContext ||= new AudioAPI();
  if (soundContext.state === 'suspended') soundContext.resume();
  say('Sound is on. You’ll hear a soft note when you place a piece.');
});

function show(id) {
  document.querySelectorAll('.step-panel').forEach(panel => panel.classList.remove('active'));
  $(id).classList.add('active');
  $(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateProgress() {
  const count = document.querySelectorAll('.collection-piece.found').length;
  $('progressCount').textContent = `${count} / 3 pieces`;
  $('progressBar').style.width = `${(count / 3) * 100}%`;
  $('progressLabel').textContent = count === 3 ? 'Picture complete!' : count ? 'Complete the picture' : 'Your starting question';
}

function resetCollection() {
  document.querySelectorAll('.piece-slot').forEach(slot => slot.classList.remove('filled'));
  document.querySelectorAll('.collection-piece').forEach(piece => {
    piece.classList.remove('found');
    piece.querySelector('i').textContent = 'Locked';
  });
  $('scene').querySelector('.band').style.opacity = 0;
  $('scene').querySelector('.calendar').style.opacity = 0;
  updateProgress();
}

function renderPiece() {
  currentPieceIndex = pieceOrder[pieceIndex];
  const piece = pieces[currentPieceIndex];
  $('pieceEyebrow').textContent = `piece ${pieceIndex + 1} of 3 · ${piece.eyebrow.split('· ')[1]}`;
  $('pieceQuestion').textContent = piece.question;
  $('answerA').textContent = piece.a;
  $('answerB').textContent = piece.b;
  $('reveal').classList.remove('visible');
  $('nextButton').classList.remove('visible');
  $('nextButton').disabled = true;
  $('placePieceButton').disabled = true;
  $('placePieceButton').textContent = 'Add this piece to my picture ✦';
  document.querySelectorAll('.answer').forEach(button => {
    button.classList.remove('chosen');
    button.disabled = false;
  });
}

function toast(message) {
  $('toast').textContent = message;
  $('toast').classList.add('show');
  setTimeout(() => $('toast').classList.remove('show'), 2200);
}

function chosenTopics() {
  return pieceOrder.map(index => topicNames[index][answersChosen[index]]).filter(Boolean);
}

function renderFinal() {
  const topics = chosenTopics();
  $('cardContext').textContent = `Your starting question: ${concernNames[concern]}. Topics you chose: ${topics.join(' · ')}.`;
  $('questionList').replaceChildren(...questions[concern].map(question => {
    const item = document.createElement('li');
    item.textContent = question;
    return item;
  }));
  $('finalPanel').classList.add('picture-complete');
  track('question_card_ready', { concern, topics });
}

function cardText() {
  return `Before I decide — my questions for a doctor\nMy starting question: ${concernNames[concern]}\nTopics I chose: ${chosenTopics().join(', ')}\n\n${questions[concern].map((question, i) => `${i + 1}. ${question}`).join('\n')}`;
}

function escapeXml(value) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
}

$('startButton').addEventListener('click', () => {
  say('Pick the part of care you’re curious about first.');
  show('concernPanel');
  $('experience').scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll('[data-concern]').forEach(button => {
  button.addEventListener('click', () => {
    concern = button.dataset.concern;
    pieceOrder = concernOrder[concern];
    pieceIndex = 0;
    answersChosen = {};
    $('finalPanel').classList.remove('picture-complete');
    resetCollection();
    track('concern_selected', { concern, hook: 'missing-pieces' });
    say('Great choice. Let’s find the first piece.');
    renderPiece();
    show('piecePanel');
  });
});

document.querySelectorAll('[data-quick-concern]').forEach(button => {
  button.addEventListener('click', () => {
    track('hero_quick_start', { concern: button.dataset.quickConcern });
    document.querySelector(`[data-concern="${button.dataset.quickConcern}"]`).click();
  });
});

$('backToConcern').addEventListener('click', () => {
  pieceIndex = 0;
  answersChosen = {};
  resetCollection();
  show('concernPanel');
});

document.querySelectorAll('.answer').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.answer').forEach(answer => answer.classList.remove('chosen'));
    button.classList.add('chosen');
    answersChosen[currentPieceIndex] = button.dataset.answer;
    track('piece_answered', { concern, piece: currentPieceIndex + 1, answer: button.dataset.answer });
    $('revealText').textContent = pieces[currentPieceIndex].answers[button.dataset.answer];
    $('sourceCaption').textContent = pieces[currentPieceIndex].source;
    $('reveal').classList.add('visible');
    $('placePieceButton').disabled = false;
    say('Your choice opens a useful conversation. Add this piece when you’re ready.');
  });
});

$('placePieceButton').addEventListener('click', () => {
  const slot = $('scene').querySelector(`[data-piece="${currentPieceIndex}"]`);
  slot.classList.add('filled');
  rewardBurst(slot);
  playRewardSound();
  if (currentPieceIndex === 1) $('scene').querySelector('.band').style.opacity = 1;
  if (currentPieceIndex === 2) $('scene').querySelector('.calendar').style.opacity = 1;
  const token = document.querySelector(`[data-collection-piece="${currentPieceIndex}"]`);
  token.classList.add('found');
  token.querySelector('i').textContent = 'Found';
  $('placePieceButton').textContent = 'Piece added ✓';
  $('placePieceButton').disabled = true;
  document.querySelectorAll('.answer').forEach(button => { button.disabled = true; });
  $('nextButton').disabled = false;
  $('nextButton').classList.add('visible');
  updateProgress();
  track('piece_placed', { concern, piece: currentPieceIndex + 1 });
  const remaining = 3 - document.querySelectorAll('.collection-piece.found').length;
  say(remaining ? `Piece found! ${remaining} ${remaining === 1 ? 'more piece' : 'more pieces'} to complete your picture.` : 'Picture complete! Your questions are ready to take with you.', 'celebrate');
  toast(`Piece ${pieceIndex + 1} of 3 added to your picture`);
});

$('nextButton').addEventListener('click', () => {
  pieceIndex += 1;
  updateProgress();
  if (pieceIndex < 3) {
    renderPiece();
    show('piecePanel');
  } else {
    renderFinal();
    say('You did it! Three pieces, a fuller picture, and questions that are yours to keep.', 'celebrate');
    show('finalPanel');
  }
});

$('copyButton').addEventListener('click', async () => {
  const text = cardText();
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
  track('question_card_copied', { concern, topics: chosenTopics() });
  toast('Question card copied');
});

$('downloadButton').addEventListener('click', () => {
  const topics = chosenTopics();
  const rows = questions[concern].map((question, i) =>
    `<text x="60" y="${370 + i * 74}" font-family="Arial" font-size="23" fill="#351d1d">${i + 1}. ${escapeXml(question)}</text>`
  ).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="900"><rect width="100%" height="100%" fill="#f5ebdf"/><rect x="28" y="28" width="1024" height="844" rx="8" fill="#f8f2eb" stroke="#e6cbbd" stroke-width="3"/><text x="60" y="100" font-family="Arial" font-size="23" letter-spacing="4" fill="#b58777">BEFORE I DECIDE · STEER</text><text x="60" y="205" font-family="Georgia" font-size="54" fill="#351d1d">My questions for a doctor</text><text x="60" y="270" font-family="Arial" font-size="24" fill="#c04e2a">My starting question: ${escapeXml(concernNames[concern])}</text><text x="60" y="320" font-family="Arial" font-size="18" fill="#9d7566">Topics I chose: ${escapeXml(topics.join(' · '))}</text>${rows}<text x="60" y="820" font-family="Arial" font-size="18" fill="#b58777">Bring these questions to a clinician. Educational resource; not medical advice.</text></svg>`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  link.download = 'steer-question-card.svg';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  track('question_card_saved', { concern, topics });
  toast('Question card saved as an image');
});

function openSources() { $('sourceDialog').showModal(); }
$('sourceButton').addEventListener('click', openSources);
$('footerSourceButton').addEventListener('click', openSources);
$('dialogClose').addEventListener('click', () => $('sourceDialog').close());

$('handoffButton').addEventListener('click', () => {
  $('consentDialog').showModal();
  track('handoff_opened', { concern });
});
$('consentClose').addEventListener('click', () => $('consentDialog').close());
$('consentCancel').addEventListener('click', () => $('consentDialog').close());
$('consentCheckbox').addEventListener('change', event => { $('consentContinue').disabled = !event.target.checked; });
$('consentContinue').addEventListener('click', () => {
  track('handoff_continued', { concern });
  $('consentDialog').close();
  window.open('https://steerclub.com', '_blank', 'noopener,noreferrer');
});
$('programmeButton').addEventListener('click', () => window.open('https://steerclub.com', '_blank', 'noopener,noreferrer'));

$('restartButton').addEventListener('click', () => {
  track('restart');
  concern = null;
  pieceIndex = 0;
  answersChosen = {};
  $('finalPanel').classList.remove('picture-complete');
  resetCollection();
  say('Pick a question and let’s complete the picture together.');
  show('concernPanel');
});

// A brief, no-wrong-answer playable hook before the full guide.
const openingPieces = {
  personal: 'A personal conversation belongs in the picture.',
  strength: 'Strength and muscle deserve a place in the conversation.',
  longview: 'Long-term support belongs in the plan, too.'
};
const openingIcons = {
  personal: '<svg viewBox="0 0 32 32" fill="none"><path d="M16 27s-10-6.2-10-13a5.5 5.5 0 0 1 10-2.8A5.5 5.5 0 0 1 26 14c0 6.8-10 13-10 13Z"/><path d="M12 16h8m-4-4v8"/></svg>',
  strength: '<svg viewBox="0 0 32 32" fill="none"><path d="M8 11v10m-4-7v4m24-7v10m-4-7v4M8 16h16M12 12v8m8-8v8"/></svg>',
  longview: '<svg viewBox="0 0 32 32" fill="none"><rect x="5" y="7" width="22" height="21" rx="3"/><path d="M10 4v6m12-6v6M5 13h22m-11 4v5l4 2"/></svg>'
};
document.querySelectorAll('[data-opening-piece]').forEach(button => {
  button.querySelector('.opening-piece-icon').innerHTML = openingIcons[button.dataset.openingPiece];
});
const openingMascot = document.createElement('div');
openingMascot.className = 'opening-mascot';
openingMascot.setAttribute('aria-hidden', 'true');
openingMascot.innerHTML = '<svg viewBox="0 0 92 100" fill="none"><path class="mascot-arm" d="m20 56-13 13m65-15 10-13"/><path class="mascot-paper" d="M23 21 66 15l9 60-43 8-9-62Z"/><path d="m31 28 29-4m-27 11 21-3m-20 10 24-4" stroke="#d9b7a6" stroke-width="2" stroke-linecap="round"/><circle cx="41" cy="56" r="2.5" fill="#351d1d"/><circle cx="55" cy="54" r="2.5" fill="#351d1d"/><path d="M43 64c3 4 8 3 10-1" stroke="#c04e2a" stroke-width="2" stroke-linecap="round"/><path class="mascot-scarf" d="m36 72 14-3 5 11-15 3-4-11Z"/><path d="m16 23 2-5m55 3 4-5m5 24 5 1" stroke="#c04e2a" stroke-width="2" stroke-linecap="round"/></svg><span>Tap a piece!</span>';
document.querySelector('#openingBoard').append(openingMascot);
let openingFound = new Set();
let openingFinished = false;
function finishOpening() {
  if (openingFinished) return;
  openingFinished = true;
  document.body.classList.remove('opening-active');
  $('openingGame').classList.add('is-leaving');
  track('opening_game_completed', { pieces: [...openingFound] });
  setTimeout(() => {
    $('openingGame').hidden = true;
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, 360);
}
document.querySelectorAll('[data-opening-piece]').forEach(button => {
  button.addEventListener('click', () => {
    if (openingFinished) return;
    const piece = button.dataset.openingPiece;
    if (openingFound.has(piece)) return;
    openingFound.add(piece);
    button.classList.add('is-placed');
    button.setAttribute('aria-pressed', 'true');
    button.querySelector('.piece-check').textContent = '✓';
    $('openingProgressText').textContent = `${openingFound.size} of 3 pieces found`;
    $('openingProgressBar').style.width = `${openingFound.size / 3 * 100}%`;
    track('opening_piece_found', { piece, count: openingFound.size });
    if (openingFound.size === 3) {
      $('openingBoard').classList.add('is-complete');
      $('openingFeedback').textContent = 'A fuller picture. Better questions.';
      setTimeout(finishOpening, 950);
    } else {
      $('openingFeedback').textContent = openingPieces[piece];
    }
  });
});
$('skipOpening').addEventListener('click', () => {
  track('opening_game_skipped', { pieces_found: openingFound.size });
  finishOpening();
});
