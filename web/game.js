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

// 网络安全MCQ题库
const quizQuestions = [
    {
        id: 1,
        question: "What is the MOST likely sign of a phishing email?",
        options: [
            "Urgent action required message",
            "Professional company logo",
            "Correct spelling and grammar",
            "Legitimate sender email address"
        ],
        correctAnswer: 0,
        rationale: "Phishing emails often create a sense of urgency to pressure victims into acting quickly without thinking."
    },
    {
        id: 2,
        question: "You receive an email asking for your password. What should you do?",
        options: [
            "Reply with your password",
            "Ignore and delete the email",
            "Forward to friends to warn them",
            "Check if it's from a real company"
        ],
        correctAnswer: 1,
        rationale: "Legitimate companies will never ask for your password via email. Always delete such requests."
    },
    {
        id: 3,
        question: "Which URL is MOST suspicious?",
        options: [
            "https://google.com",
            "https://g00gle-security.com",
            "https://accounts.google.com",
            "https://drive.google.com"
        ],
        correctAnswer: 1,
        rationale: "The URL 'g00gle-security.com' uses zeros instead of 'o's - a common trick in phishing attempts."
    },
    {
        id: 4,
        question: "What should you do before clicking any link in an email?",
        options: [
            "Hover to see the actual URL",
            "Check the sender's name",
            "Look for spelling errors",
            "All of the above"
        ],
        correctAnswer: 3,
        rationale: "Always verify email authenticity by checking multiple indicators before clicking any links."
    },
    {
        id: 5,
        question: "You accidentally clicked a phishing link. What's your FIRST step?",
        options: [
            "Close the browser tab",
            "Run antivirus scan",
            "Change your passwords",
            "Report to IT/authorities"
        ],
        correctAnswer: 3,
        rationale: "Immediately reporting helps protect others and allows experts to contain the threat."
    }
];

// 游戏反馈内容
const feedbackMessages = {
    inspect: {
        title: "Good Analysis!",
        message: "You identified key red flags:<br>• Suspicious sender address (g00gle-security.com)<br>• Urgent/threatening language<br>• Zero in 'G00gle' instead of 'o'<br>• Unusual link structure"
    },
    report: {
        title: "Excellent Decision!",
        message: "Reporting phishing emails helps protect everyone. By reporting, you:<br>• Alert security teams<br>• Prevent others from falling victim<br>• Help improve email filters<br>• Contribute to community safety"
    },
    click: {
        title: "Learning Moment!",
        message: "Clicking suspicious links can lead to:<br>• Malware installation<br>• Password theft<br>• Identity fraud<br>• Financial loss<br><br>Always verify links before clicking!"
    }
};

// 初始化游戏
function initGame() {
    loadPlayerInfo();
    loadCurrentQuestion();
    setupEventListeners();
    updateProgress();
}

// 加载玩家信息
function loadPlayerInfo() {
    const name = localStorage.getItem('cyberDefender_playerName') || GameState.playerName;
    document.getElementById('player-display-name').textContent = name;
    GameState.playerName = name;
}

// 设置事件监听器
function setupEventListeners() {
    // 选项按钮点击
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', handleActionClick);
    });
    
    // 可疑链接点击
    document.querySelector('.suspicious-link').addEventListener('click', function(e) {
        e.preventDefault();
        showFeedback('click');
        addScore(-50);
    });
    
    // MCQ选项点击
    document.addEventListener('click', function(e) {
        if (e.target.closest('.option')) {
            handleOptionClick(e.target.closest('.option'));
        }
    });
    
    // 导航按钮
    document.getElementById('prev-btn').addEventListener('click', showPreviousQuestion);
    document.getElementById('next-btn').addEventListener('click', showNextQuestion);
    
    // 菜单按钮
    document.getElementById('menu-btn').addEventListener('click', toggleMenu);
    document.getElementById('close-menu').addEventListener('click', toggleMenu);
    document.getElementById('menu-overlay').addEventListener('click', toggleMenu);
    
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// 处理行动选择
function handleActionClick(e) {
    const action = e.currentTarget.dataset.action;
    showFeedback(action);
    
    // 更新进度
    if (action === 'report' || action === 'inspect') {
        addScore(100);
        updateProgress(20);
    }
    
    // 高亮选择
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    e.currentTarget.classList.add('selected');
}

// 显示反馈
function showFeedback(action) {
    const feedback = feedbackMessages[action];
    const feedbackBox = document.getElementById('feedback-box');
    const feedbackContent = document.getElementById('feedback-content');
    
    if (feedback) {
        feedbackContent.innerHTML = `
            <h4 style="color: var(--neon-green); margin-bottom: 10px;">${feedback.title}</h4>
            <p>${feedback.message}</p>
        `;
        
        // 添加动画效果
        feedbackBox.style.animation = 'none';
        setTimeout(() => {
            feedbackBox.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    }
}

// 处理MCQ选项点击
function handleOptionClick(optionElement) {
    const questionContainer = optionElement.closest('.quiz-question');
    const questionId = parseInt(questionContainer.dataset.questionId);
    const optionIndex = Array.from(optionElement.parentNode.children).indexOf(optionElement);
    
    // 保存答案
    GameState.selectedAnswers[questionId] = optionIndex;
    
    // 清除其他选项的选择状态
    questionContainer.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // 标记选中的选项
    optionElement.classList.add('selected');
    
    // 如果已回答，启用下一个按钮
    checkQuizCompletion();
}

// 加载当前问题
function loadCurrentQuestion() {
    const container = document.getElementById('quiz-container');
    const question = quizQuestions[GameState.currentQuestion];
    
    container.innerHTML = `
        <div class="quiz-question" data-question-id="${question.id}">
            <div class="question-text">${question.id}. ${question.question}</div>
            <div class="options-container">
                ${