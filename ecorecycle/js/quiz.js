document.addEventListener('DOMContentLoaded', function () {
  const bins = [
    { key: 'plastic', label: 'Plastic' }, { key: 'paper', label: 'Paper' },
    { key: 'glass', label: 'Glass' }, { key: 'battery', label: 'Batteries' },
    { key: 'tech', label: 'Electronics' }, { key: 'trash', label: 'General bin' }
  ];
  
  const items = [
    { id: 1, name: 'Water bottle (PET)', answer: 'plastic', tip: 'Check that your point accepts PET bottles and follow its cap instructions.' },
    { id: 2, name: 'Old newspaper', answer: 'paper', tip: 'Keep paper clean and dry.' },
    { id: 3, name: 'Glass jar', answer: 'glass', tip: 'Look for a point that accepts glass jars and bottles.' },
    { id: 4, name: 'AA battery', answer: 'battery', tip: 'Use a dedicated battery collection point.' },
    { id: 5, name: 'Old phone', answer: 'tech', tip: 'Take phones to an electronics collection point.' },
    { id: 6, name: 'Greasy pizza box', answer: 'trash', tip: 'For this game, greasy cardboard goes in general waste. Separate clean parts and check local composting options.' },
    { id: 7, name: 'Yogurt cup (PP)', answer: 'plastic', tip: 'PP is plastic code 5. Check whether your point accepts cups.' },
    { id: 8, name: 'Wine bottle', answer: 'glass', tip: 'Look for a point that accepts container glass.' }
  ];

  const itemElement = document.getElementById('quiz-item');
  const options = document.getElementById('quiz-options');
  const feedback = document.getElementById('quiz-feedback');
  const nextButton = document.getElementById('quiz-next');
  const result = document.getElementById('quiz-result');
  let index = 0;
  let score = 0;
  let answered = false;

  function start() {
    index = 0;
    score = 0;
    result.hidden = true;
    itemElement.hidden = false;
    options.hidden = false;
    document.getElementById('quiz-counter').hidden = false;
    document.getElementById('quiz-total').textContent = items.length;
    showQuestion();
  }

  // The same eight questions stay in order: easier to explain and review.
  function showQuestion() {
    answered = false;
    itemElement.textContent = items[index].name;
    document.getElementById('quiz-num').textContent = index + 1;
    document.getElementById('quiz-score').textContent = score;
    document.getElementById('quiz-bar').style.width = (index / items.length * 100) + '%';
    feedback.textContent = '';
    feedback.className = 'quiz-fb';
    nextButton.hidden = true;
    options.replaceChildren();

    bins.forEach(function (bin, position) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'bin-btn b-' + bin.key;
      button.dataset.key = bin.key;
      button.textContent = (position + 1) + '. ' + bin.label;
      button.addEventListener('click', function () { answer(bin.key); });
      options.appendChild(button);
    });
  }

  function answer(key) {
    if (answered) return; // Prevent scoring twice on repeated clicks.
    answered = true;
    const question = items[index];
    const correct = key === question.answer;
    if (correct) score++;

    options.querySelectorAll('button').forEach(function (button) {
      button.disabled = true;
      if (button.dataset.key === question.answer) button.classList.add('correct');
      else if (button.dataset.key === key) button.classList.add('wrong');
    });

    const correctBin = bins.find(bin => bin.key === question.answer);
    feedback.textContent = (correct ? 'Correct! ' : 'Correct bin: ' + correctBin.label + '. ') + question.tip;
    feedback.className = 'quiz-fb ' + (correct ? 'ok' : 'bad');
    document.getElementById('quiz-score').textContent = score;
    nextButton.textContent = index === items.length - 1 ? 'See result' : 'Next item';
    nextButton.hidden = false;
    nextButton.focus({ preventScroll: true });
  }

  function finish() {
    const percent = Math.round(score / items.length * 100);
    document.getElementById('quiz-bar').style.width = '100%';
    document.getElementById('quiz-counter').hidden = true;
    itemElement.hidden = true;
    options.hidden = true;
    nextButton.hidden = true;
    feedback.textContent = '';
    document.getElementById('quiz-result-title').textContent = score + ' / ' + items.length + ' — ' + percent + '%';
    document.getElementById('quiz-result-text').textContent = percent === 100
      ? 'All eight sorted! Keep checking the rules at your local collection point.'
      : 'Good practice. Read the material guide below, then try again.';
    result.hidden = false;
    result.focus({ preventScroll: true });
  }

  nextButton.addEventListener('click', function () {
    if (!answered) return;
    if (index < items.length - 1) {
      index++;
      showQuestion();
      itemElement.focus({ preventScroll: true });
    } else finish();
  });
  document.getElementById('quiz-restart').addEventListener('click', function () {
    start();
    itemElement.focus({ preventScroll: true });
  });

  // Shortcuts only work inside the quiz and never intercept browser shortcuts.
  document.querySelector('.quiz').addEventListener('keydown', function (event) {
    if (answered || itemElement.hidden || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.target.matches('input, select, textarea, [contenteditable]')) return;
    const number = Number(event.key);
    if (number >= 1 && number <= bins.length) {
      event.preventDefault();
      answer(bins[number - 1].key);
    }
  });
  start();
});
