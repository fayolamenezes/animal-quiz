const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const questionContainer = document.getElementById('question-container');
const answersContainer = document.getElementById('answers-container');
const nextButton = document.getElementById('next-btn');
const endQuizBtn = document.getElementById('end-quiz-btn');
const resultScreen = document.getElementById('result-screen');
const finalScore = document.getElementById('final-score');
const usernameInput = document.getElementById('username');
const saveScoreButton = document.getElementById('save-score');
const timerDisplay = document.getElementById('time-left');

// New leaderboard sections for each difficulty:
const leaderboardEasy = document.getElementById('leaderboard-easy');
const leaderboardMedium = document.getElementById('leaderboard-medium');
const leaderboardHard = document.getElementById('leaderboard-hard');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timer;
let currentDifficulty = '';  // Track current difficulty

// Difficulty buttons fetch quiz and set difficulty
document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentDifficulty = btn.getAttribute('data-difficulty');
    fetchQuizData(currentDifficulty);
  });
});

async function fetchQuizData(difficulty) {
  const url = `https://opentdb.com/api.php?amount=10&category=27&difficulty=${difficulty}&type=multiple`;
  const response = await fetch(url);
  const data = await response.json();
  questions = data.results.map(q => {
    const answers = [...q.incorrect_answers];
    const correctIndex = Math.floor(Math.random() * 4);
    answers.splice(correctIndex, 0, q.correct_answer);
    return {
      question: decodeHTML(q.question),
      answers: answers.map(a => decodeHTML(a)),
      correct: decodeHTML(q.correct_answer)
    };
  });
  homeScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  showQuestion();
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function showQuestion() {
  resetState();
  startTimer();
  endQuizBtn.classList.remove('hidden');

  let q = questions[currentQuestionIndex];
  questionContainer.innerText = `Q${currentQuestionIndex + 1}. ${q.question}`;
  q.answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.innerText = answer;
    btn.addEventListener('click', () => selectAnswer(answer, q.correct));
    answersContainer.appendChild(btn);
  });
}

function resetState() {
  clearInterval(timer);
  timeLeft = 15;
  timerDisplay.innerText = timeLeft;
  nextButton.style.display = 'none';
  answersContainer.innerHTML = '';
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoRevealAnswer();
    }
  }, 1000);
}

function autoRevealAnswer() {
  const q = questions[currentQuestionIndex];
  const buttons = answersContainer.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === q.correct) btn.style.background = '#a5d6a7';
  });
  nextButton.style.display = 'block';
}

function selectAnswer(selected, correct) {
  clearInterval(timer);
  const buttons = answersContainer.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === correct) btn.style.background = '#a5d6a7';
    else if (btn.innerText === selected) btn.style.background = '#ef9a9a';
  });

  if (selected === correct) score++;
  nextButton.style.display = 'block';
}

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  clearInterval(timer);
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  endQuizBtn.classList.add('hidden');

  let message = '';
  if (score >= 8) message = '🎉 Excellent!';
  else if (score >= 5) message = '😊 Good job!';
  else message = '😅 Try again!';

  finalScore.innerText = `Your Score: ${score}/10 - ${message}`;

  // Reset save button and username input
  saveScoreButton.disabled = false;
  usernameInput.disabled = false;
}

saveScoreButton.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username && !saveScoreButton.disabled && currentDifficulty) {
    const leaderboardKey = `animalLeaderboard-${currentDifficulty}`;
    const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey) || '[]');
    leaderboard.push({ name: username, score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard.slice(0, 5)));
    displayLeaderboard();

    // Prevent resubmission
    saveScoreButton.disabled = true;
    usernameInput.disabled = true;
  }
});

function displayLeaderboard() {
  // For each difficulty, load leaderboard and display
  ['easy', 'medium', 'hard'].forEach(diff => {
    const listElement = document.getElementById(`leaderboard-${diff}`);
    listElement.innerHTML = '';
    const leaderboard = JSON.parse(localStorage.getItem(`animalLeaderboard-${diff}`) || '[]');
    if (leaderboard.length === 0) {
      const li = document.createElement('li');
      li.innerText = 'No scores yet.';
      listElement.appendChild(li);
    } else {
      leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `${entry.name}: ${entry.score}/10`;
        listElement.appendChild(li);
      });
    }
  });
}

function showHome() {
  clearInterval(timer);
  currentQuestionIndex = 0;
  score = 0;
  questions = [];
  quizScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  homeScreen.classList.remove('hidden');
  endQuizBtn.classList.add('hidden');
  nextButton.style.display = 'none';
  timerDisplay.innerText = '15';
  usernameInput.value = '';
  usernameInput.disabled = false;
  saveScoreButton.disabled = false;
  currentDifficulty = '';
  displayLeaderboard();
}

endQuizBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to quit the quiz?")) {
    showHome();
  }
});

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  displayLeaderboard();
});
