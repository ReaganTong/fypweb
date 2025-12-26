// 游戏状态管理
const GameState = {
    playerName: 'Cyber_Explorer',
    score: 850,
    level: 2,
    xp: 45,
    missionProgress: 60,
    currentQuestion: 0,
    selectedAnswers: {},
    quizCompleted: false,
    badges: ['Account Defender', 'Password Master', 'Vigilant Observer']
};

const quizQuestions = [
    {
        id: 1,
        question: "What is the MOST likely sign of a phishing email?",
        options: ["Urgent action required message", "Professional company logo", "Correct spelling and grammar", "Legitimate sender email address"],
        correctAnswer: 0,
        rationale: "Phishing emails often create a sense of urgency to pressure victims."
    },
    {
        id: 2,
        question: "Which URL is MOST suspicious?",
        options: ["https://google.com", "https://g00gle-security.com", "https://accounts.google.com", "https://drive.google.com"],
        correctAnswer: 1,
        rationale: "The URL 'g00gle-security.com' uses zeros instead of 'o's - a common trick."
    }
];

const feedbackMessages = {
    inspect: { title: "Good Analysis!", message: "You identified red flags: suspicious sender address and urgent language." },
    report: { title: "Excellent Decision!", message: "Reporting phishing emails protects the community and alerts security teams." },
    click: { title: "Learning Moment!", message: "Clicking links can lead to malware. Always verify links before clicking!" }
};

// --- Core Game Functions ---

function initGame() {
    loadPlayerInfo();
    loadCurrentQuestion();
    setupEventListeners();
    updateProgress(0); // Initialize progress display
}

function loadPlayerInfo() {
    const name = localStorage.getItem('cyberDefender_playerName') || GameState.playerName;
    document.getElementById('player-display-name').textContent = name;
}

function setupEventListeners() {
    document.querySelectorAll('.option-btn').forEach(btn => btn.addEventListener('click', handleActionClick));
    document.querySelector('.suspicious-link').addEventListener('click', (e) => {
        e.preventDefault();
        showFeedback('click');
        addScore(-50);
    });
    document.getElementById('prev-btn').addEventListener('click', () => navigateQuiz(-1));
    document.getElementById('next-btn').addEventListener('click', () => navigateQuiz(1));
    document.getElementById('menu-btn').addEventListener('click', toggleMenu);
    document.getElementById('close-menu').addEventListener('click', toggleMenu);
    document.getElementById('menu-overlay').addEventListener('click', toggleMenu);
}

function handleActionClick(e) {
    const action = e.currentTarget.dataset.action;
    showFeedback(action);
    if (action === 'report' || action === 'inspect') {
        addScore(action === 'report' ? 100 : 20);
        updateProgress(10);
    }
}

function showFeedback(action) {
    const feedback = feedbackMessages[action];
    const content = document.getElementById('feedback-content');
    content.innerHTML = `<h4 style="color:var(--neon-green)">${feedback.title}</h4><p>${feedback.message}</p>`;
}

function addScore(points) {
    GameState.score += points;
    document.querySelector('.stat-box span').textContent = `Score: ${GameState.score}`;
}

function updateProgress(inc) {
    GameState.missionProgress = Math.min(100, GameState.missionProgress + inc);
    document.querySelector('.progress-fill').style.width = `${GameState.missionProgress}%`;
    document.querySelector('.progress-text').textContent = `Mission Progress: ${GameState.missionProgress}% Complete`;
}

function toggleMenu() {
    document.getElementById('side-menu').classList.toggle('active');
    document.getElementById('menu-overlay').classList.toggle('active');
}

// --- Quiz Logic ---

function loadCurrentQuestion() {
    const q = quizQuestions[GameState.currentQuestion];
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="quiz-question">
            <div class="question-text">${q.question}</div>
            <div class="options-container">
                ${q.options.map((opt, i) => `
                    <div class="option" onclick="selectOption(${i})">${opt}</div>
                `).join('')}
            </div>
        </div>`;
    document.getElementById('question-counter').textContent = `Question ${GameState.currentQuestion + 1} of ${quizQuestions.length}`;
}

function selectOption(index) {
    const q = quizQuestions[GameState.currentQuestion];
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));
    
    if (index === q.correctAnswer) {
        options[index].classList.add('correct');
        addScore(50);
    } else {
        options[index].classList.add('incorrect');
        options[q.correctAnswer].classList.add('correct');
    }
}

function navigateQuiz(direction) {
    GameState.currentQuestion = Math.max(0, Math.min(quizQuestions.length - 1, GameState.currentQuestion + direction));
    loadCurrentQuestion();
}

// Start the game on load
window.onload = initGame;