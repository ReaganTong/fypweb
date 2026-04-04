// ========== SUPABASE CONFIGURATION ==========
const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co'; 
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabaseClient = null;
try {
    if (SUPABASE_URL.startsWith('http')) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch(e) {
    console.warn("Supabase not fully configured. Running in offline mode.");
}

const sessionId = 'AGENT_' + Math.random().toString(36).substr(2, 5);

// ========== GAME STATE ==========
let unlockedChapter = 4;
let totalPlayerXP = 0;

let currentChapter = null;
let currentQ = 0;
let score = 0;
let xp = 0;
let answered = false;

// ========== QUIZ DATA ==========
const quizData = {
  1: {
    title: "The Logic of Passwords",
    label: "// CHAPTER 01 — IDENTITY PROTECTION",
    color: "var(--neon)",
    questions: [
      { 
        q: "To protect your Student Portal, which password structure is mathematically the hardest for a hacker to crack?", 
        options: ["Uts@2026", "Reagan_030628", "Sibu_Kampua_Enak!", "Password_123!"], 
        answer: 2, 
        explanation: "The logic here is Entropy. Long passphrases (sentences with spaces) are harder for computers to 'brute-force' than short passwords with symbols. A sentence is easy for you to remember but impossible for a bot to guess.",
        tip: "Think Length > Complexity." 
      },
      { 
        q: "What is the primary danger of using the same password for Games and Social Media?", 
        options: ["Account loading delays", "Credential Stuffing attacks", "Social media shadowbans", "2FA will stop working"], 
        answer: 1, 
        explanation: "Hackers use 'Credential Stuffing' logic: if they steal your password from one site, they will immediately try that same password on your IG, Gmail, and Bank accounts. One leak equals total loss.",
        tip: "Unique passwords isolate your risks." 
      },
      { 
        q: "When using a public PC, why is clicking 'Never Save' not enough security?", 
        options: ["It saves it anyway", "It creates a slow connection", "It doesn't clear the current session", "It alerts the admin"], 
        answer: 2, 
        explanation: "The logic of public privacy: 'Never' only stops future saves. If you don't manually clear the cache and Log Out, your active 'Session Cookie' stays in the browser, allowing the next user to enter your account.",
        tip: "Always clear history and Log Out on public PCs." 
      }
    ]
  },
  2: {
    title: "The 'App-First' Rule",
    label: "// CHAPTER 02 — LOCAL SCAM DETECTION",
    color: "var(--neon2)",
    questions: [
      { 
        q: "A WhatsApp message from 'S Pay Global' claims you won RM50 with a link. Your move?", 
        options: ["Click to check", "Verify only via the official App", "Forward to friends", "Use a fake phone number"], 
        answer: 1, 
        explanation: "The 'App-First' logic: Official platforms will NEVER send a link in a chat to give you money. If a message has a link, it is a redirect trap. Always open the official App manually to check notifications.",
        tip: "If it's real, it's in the App." 
      },
      { 
        q: "An SMS says your parcel is held for a RM1.50 fee. Why is this 'low fee' dangerous?", 
        options: ["The fee is too high", "It is a credit card data harvester", "Courier apps are always free", "It tracks your GPS"], 
        answer: 1, 
        explanation: "Scammers use the 'Low Friction' logic. They ask for a tiny amount (RM1.50) so you don't think twice before entering your card details. Once you enter them, they have your full card info for future thefts.",
        tip: "Never pay fees via SMS links." 
      },
      { 
        q: "A TikTok ad for DBOS Bank asks to download an APK file. Why is this a red flag?", 
        options: ["APK files are for iPhones only", "DBOS doesn't have an app", "Third-party APKs can bypass phone security", "The interest rate is too low"], 
        answer: 2, 
        explanation: "The 'Trusted Source' logic: APK files installed from browsers bypass official store security. These files often contain 'SmsSpy' which silently steals your Bank OTPs from your text messages.",
        tip: "Only install from official stores." 
      },
      { 
        q: "A Facebook post asks for your phone number to claim a subsidy. The risk?", 
        options: ["Your phone will ring too much", "Data harvesting for targeted scams", "Facebook will ban you", "No risk, it's public info"], 
        answer: 1, 
        explanation: "The 'Data Harvesting' logic: Scammers collect phone numbers to create a 'Sucker List'. They will call you later pretending to be your Bank or the Government, using your name to sound more believable.",
        tip: "Your identity info is not for comments." 
      }
    ]
  },
  3: {
    title: "Permission Logic",
    label: "// CHAPTER 03 — DATA PRIVACY",
    color: "var(--neon3)",
    questions: [
      { 
        q: "A simple 'Compass App' requests access to your 'Contacts'. What is wrong here?", 
        options: ["The Speed Principle", "The Least Privilege Principle", "The Open Source Rule", "The Data Sync Rule"], 
        answer: 1, 
        explanation: "The logic of 'Least Privilege': An app should only have the permissions it needs to function. A compass needs GPS, not your contacts. Excessive requests are a sign of data harvesting.",
        tip: "Question every permission." 
      },
      { 
        q: "Why is it risky to log into your bank while using 'Free Wi-Fi' at a cafe?", 
        options: ["The Wi-Fi is too slow", "Risk of a Man-in-the-Middle attack", "Your battery will drain", "Cafe Wi-Fi is only for browsing"], 
        answer: 1, 
        explanation: "The 'Evil Twin' logic: A hacker can create a Wi-Fi hotspot with the same name as the cafe. If you connect, they can act as a 'Man-in-the-Middle', seeing exactly what you type into your banking app.",
        tip: "Use Mobile Data for sensitive tasks." 
      },
      { 
        q: "You post a selfie at UTS with your Student ID visible. Why is blurring it necessary?", 
        options: ["To look more professional", "To prevent identity theft via barcodes", "To hide your age", "To avoid school punishment"], 
        answer: 1, 
        explanation: "The 'Digital Footprint' logic: Barcodes and IDs contain encoded data that can be used to track your location, clone your student card, or find your home address. Once posted, it is permanent.",
        tip: "The background matters as much as your face." 
      },
      { 
        q: "A Facebook quiz game asks for access to your 'Friends List'. Why?", 
        options: ["To show results to them", "To build a social map for future scams", "To verify you are human", "To help you find new friends"], 
        answer: 1, 
        explanation: "The 'API Scraping' logic: Quiz apps are often fronts for data firms. By accessing your friends list, they can target your friends with fake messages that look like they came from you.",
        tip: "Don't trade privacy for a quiz result." 
      }
    ]
  },
  4: {
    title: "The Human Element",
    label: "// CHAPTER 04 — SOCIAL RISK",
    color: "var(--neon4)",
    questions: [
      { 
        q: "A 'Pro' gamer offers to boost your rank if you share your password. The risk?", 
        options: ["He wants to see your skins", "Account hijacking and resale", "He needs to verify your level", "There is no scam"], 
        answer: 1, 
        explanation: "The 'Authority' logic: Scammers pretend to be experts to make you lower your guard. Once they have your password, they will change your recovery email and sell your account.",
        tip: "Skill is earned, passwords are kept." 
      },
      { 
        q: "An email warns your account will be banned in 1 hour. Why the short time limit?", 
        options: ["System server resets", "To force 'Panic-Mode' thinking", "Official policy rule", "To save storage space"], 
        answer: 1, 
        explanation: "The 'Urgency' logic: Fear and rush bypass your logical brain. If you are panicked, you won't notice the fake sender email address. Real companies give you days to resolve issues.",
        tip: "Panic is the scammer's best friend." 
      },
      { 
        q: "A friend DMs you: 'OMG, is this you in this video?? [Link]'. Why call them first?", 
        options: ["To see if the video is funny", "To verify their account hasn't been hacked", "To ask for the video name", "To check their data connection"], 
        answer: 1, 
        explanation: "The 'Social Trust' logic: Scammers hack one person, then send phishing links to everyone on their list. If it looks out of character, verify via a different channel (like a call).",
        tip: "Verify outside the chat." 
      },
      { 
        q: "Someone is being bullied in your group chat. Why is 'Reporting' the best move?", 
        options: ["Reporting is faster", "It creates a digital evidence trail", "Fighting back uses too much data", "Bullies are always right"], 
        answer: 1, 
        explanation: "The 'Evidence' logic: Fighting back escalates the anger and can make YOU look like the bully. Reporting creates a timestamped log that platform admins can use to take action.",
        tip: "Report to end the cycle." 
      }
    ]
  }
};

// ========== COUNTER ANIMATION ==========
function animateCounter(id, target, suffix = '') {
  let current = 0;
  const increment = Math.ceil(target / 60);
  const el = document.getElementById(id);
  if(!el) return;
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = current.toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, 30);
}

window.addEventListener('load', () => {
  setTimeout(() => {
    animateCounter('counter-students', 12847);
    animateCounter('counter-questions', 40); // 40 Questions total now
    animateCounter('counter-chapters', 4);   // 4 Chapters total
  }, 500);
});

// ========== QUIZ FUNCTIONS ==========
function scrollToChapters() {
  document.getElementById('chapters').scrollIntoView({ behavior: 'smooth' });
}

function openQuiz(chapter) {
  if (chapter > unlockedChapter) return; // Prevent opening locked chapters

  currentChapter = chapter;
  currentQ = 0;
  score = 0;
  xp = 0;
  answered = false;

  const data = quizData[chapter];
  const color = data.color;

  document.getElementById('quizChapterLabel').textContent = data.label;
  document.getElementById('quizChapterLabel').style.color = color;
  document.getElementById('quizTitle').textContent = data.title;
  document.getElementById('progressFill').style.background = color;
  document.getElementById('xpFill').style.background = color;
  document.getElementById('nextBtn').style.background = color;

  document.getElementById('quizBody').style.display = 'block';
  document.getElementById('resultsScreen').classList.remove('show');
  document.getElementById('quizOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';

  renderQuestion();
}

function renderQuestion() {
  const data = quizData[currentChapter];
  const q = data.questions[currentQ];
  answered = false;

  document.getElementById('questionCounter').textContent = `QUESTION ${currentQ + 1} OF ${data.questions.length}`;
  document.getElementById('questionText').textContent = q.q;

  const tipBox = document.getElementById('tipBox');
  if (q.tip) {
    tipBox.style.display = 'block';
    document.getElementById('tipText').textContent = q.tip;
  } else {
    tipBox.style.display = 'none';
  }

  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${opt}</span>`;
    btn.onclick = () => selectAnswer(i, btn);
    grid.appendChild(btn);
  });

  const fb = document.getElementById('feedbackBox');
  fb.classList.remove('show', 'correct-fb', 'wrong-fb');

  const pct = (currentQ / data.questions.length) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('scoreDisplay').textContent = score;
  document.getElementById('nextBtn').classList.remove('show');
}

function selectAnswer(index, btn) {
  if (answered) return;
  answered = true;

  const q = quizData[currentChapter].questions[currentQ];
  const allBtns = document.querySelectorAll('.option-btn');

  allBtns.forEach(b => b.disabled = true);

  const fb = document.getElementById('feedbackBox');
  const fbTitle = document.getElementById('feedbackTitle');
  const fbText = document.getElementById('feedbackText');

  if (index === q.answer) {
    btn.classList.add('correct');
    fb.className = 'feedback-box show correct-fb';
    fbTitle.textContent = '✓ CORRECT!';
    fbText.textContent = q.explanation;
    score += 100;
    xp += 50;
  } else {
    btn.classList.add('wrong');
    allBtns[q.answer].classList.add('correct');
    fb.className = 'feedback-box show wrong-fb';
    fbTitle.textContent = '✗ NOT QUITE';
    fbText.textContent = q.explanation;
    xp += 10;
  }
  
  document.getElementById('scoreDisplay').textContent = score;
  // XP bar maxes visually at 500 XP per chapter for nice aesthetics
  document.getElementById('xpFill').style.width = Math.min((xp / 500) * 100, 100) + '%';
  document.getElementById('xpCount').textContent = xp + ' XP';
  document.getElementById('nextBtn').classList.add('show');
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= quizData[currentChapter].questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

async function showResults() {
  // 1. 切换 UI 界面
  document.getElementById('quizBody').style.display = 'none';
  const results = document.getElementById('resultsScreen');
  results.classList.add('show');

  // 2. 计算成绩
  const data = quizData[currentChapter];
  const total = data.questions.length;
  const correct = score / 100;
  const wrong = total - correct;
  const pct = Math.round((correct / total) * 100);

  // 3. 更新进度条
  document.getElementById('progressFill').style.width = '100%';

  let icon, title, msg;
  
  // 4. 处理及格/不及格逻辑
  if (pct >= 50) { 
      icon = '🏆'; 
      title = 'SECTOR SECURED!'; 
      msg = "Great work! You have successfully mastered this chapter."; 
      
      totalPlayerXP += score;
      const navXpEl = document.getElementById('navXpCount');
      if(navXpEl) navXpEl.textContent = totalPlayerXP + " XP";

      if (currentChapter === unlockedChapter && unlockedChapter < 4) {
          unlockedChapter++;
          const nextCard = document.getElementById(`chCard${unlockedChapter}`);
          if (nextCard) nextCard.classList.remove('locked');
      }

      // 存储进度到 game_scores 表
      if (supabaseClient) {
          try {
              await supabaseClient.from('game_scores').upsert({ 
                  session_id: sessionId, 
                  score: totalPlayerXP, 
                  level: unlockedChapter 
              });
          } catch(e) { console.log("Offline mode: Score not saved."); }
      }

  } else { 
      icon = '🔄'; 
      title = 'KEEP LEARNING!'; 
      msg = "Cybersecurity takes practice. Review the chapter materials and try again."; 
  }
  
  // 5. 生成风险评估
  let riskAnalysis = "";
  if (pct < 60) {
    riskAnalysis = "CRITICAL RISK: You are highly vulnerable to local scams. Your instinct to trust digital requests needs immediate adjustment.";
  } else if (pct < 90) {
    riskAnalysis = "MODERATE RISK: You understand the basics, but 'ambiguous' traps still catch you. Focus on verifying official channels.";
  } else {
    riskAnalysis = "LOW RISK: Agent, your digital defense is solid. You have successfully internalized the core logic of cybersecurity.";
  }

  // 6. 更新 UI 内容（注意：这里只赋值一次，避免覆盖）
  document.getElementById('resultsIcon').textContent = icon;
  document.getElementById('resultsTitle').textContent = title;
  document.getElementById('resultsScoreBig').textContent = pct + '%';
  document.getElementById('rbCorrect').textContent = correct;
  document.getElementById('rbWrong').textContent = wrong;
  document.getElementById('rbXP').textContent = xp;
  
  // 使用 innerHTML 显示加粗的风险评估和消息内容
  document.getElementById('resultsMessage').innerHTML = `<strong>${riskAnalysis}</strong><br><br>${msg}`;

  // 7. 存储详细结果到 game_results 表供分析
  if (supabaseClient) {
      try {
          await supabaseClient.from('game_results').insert({
              unique_id: sessionId, 
              chapter: currentChapter,
              score: pct,
              status: riskAnalysis
          });
      } catch(e) { console.log("Offline mode: Results not saved."); }
  }
}

function retryQuiz() { openQuiz(currentChapter); }

function closeQuiz() {
  document.getElementById('quizOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// Close on backdrop click
document.getElementById('quizOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeQuiz();
});

// Keyboard Accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
      closeQuiz();
      closeMinigame();
  }
  if (!answered && document.getElementById('quizOverlay').classList.contains('active')) {
    const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
    if (map[e.key] !== undefined) {
      const btns = document.querySelectorAll('.option-btn');
      if (btns[map[e.key]]) btns[map[e.key]].click();
    }
  }
});


// ========== PHISHING MINIGAME LOGIC ==========
let flagsFound = 0;
let currentMgLevel = 0;

// 10 Diverse Scenarios (Emails, SMS, Pop-ups, DMs) - Exactly 3 Flags Each
const mgScenarios = [
  // 1. EMAIL: PayPal Typosquatting
  {
    htmlContent: `
    <div class="fake-email">
      <div class="email-header">
        <div class="email-row"><strong>From:</strong> <span class="clickable-flag" onclick="flagFound(this, 'Sender is typosquatting (paypa1 instead of paypal).')">Support Team &lt;security@paypa1-update.com&gt;</span></div>
        <div class="email-row"><strong>To:</strong> Undisclosed Recipients</div>
        <div class="email-row"><strong>Subject:</strong> <span style="color:#d32f2f; font-weight:bold;">URGENT: Your Account Will Be Suspended!</span></div>
      </div>
      <div class="email-body">
        <p><span class="clickable-flag" onclick="flagFound(this, 'Generic greeting. Real companies use your actual name.')">Dear Valued Customer,</span></p>
        <p>We have detected unusual activity on your account. For your protection, your access has been temporarily restricted.</p>
        <p>You must verify your identity within <strong>24 hours</strong> or your account will be permanently deleted.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span class="clickable-flag btn-fake" onclick="flagFound(this, 'Hovering shows a suspicious URL that does not go to the real website.')">VERIFY ACCOUNT NOW</span>
          <div style="font-size:0.7rem; color:gray; margin-top:5px;">(Link points to: http://login-verify-account123.net)</div>
        </div>
        <p>Thank you,<br>The Security Team</p>
      </div>
    </div>`
  },
  // 2. SMS: Fake Package Delivery
  {
    htmlContent: `
    <div class="fake-phone">
      <div class="phone-header">
        <span class="clickable-flag" onclick="flagFound(this, 'Official delivery services use 5-6 digit shortcodes, not random full phone numbers.')">+1 (402) 883-9182</span>
      </div>
      <div class="phone-body">
        <div class="sms-bubble">
          <span class="clickable-flag" onclick="flagFound(this, 'Misspelled company name (UPS-Express instead of UPS) to avoid spam filters.')">UPS-Express:</span> Your package delivery has been <span class="clickable-flag" onclick="flagFound(this, 'Creating fake urgency/panic to make you click without thinking.')">halted due to an unpaid shipping fee of $1.99.</span><br><br>
          Please pay immediately to release your package:<br>
          <span style="color:#007aff; text-decoration:underline;">http://bit.ly/ups-fee-442</span>
        </div>
      </div>
    </div>`
  },
  // 3. SOCIAL DM: Discord Nitro Scam
  {
    htmlContent: `
    <div class="fake-dm">
      <div class="dm-header">@GamerKing99 (Not in server)</div>
      <div class="dm-body">
        <div class="dm-avatar" style="background:#5865f2;">G</div>
        <div>
          <div style="font-weight:bold; margin-bottom:5px;">GamerKing99 <span style="font-size:0.7rem; color:#72767d;">Today at 2:14 PM</span></div>
          <div style="line-height: 1.5;">
            <span class="clickable-flag" onclick="flagFound(this, 'Random DMs offering expensive things for free are almost always scams.')">Yo! I accidentally bought an extra Discord Nitro subscription for 1 year.</span><br><br>
            I don't need it, so <span class="clickable-flag" onclick="flagFound(this, 'Scammers try to pressure you by saying you are the first one they asked.')">first person to click gets it!</span><br><br>
            <span class="clickable-flag" onclick="flagFound(this, 'Typosquatting URL (dlscord instead of discord).')">https://dlscord-gift.com/claim/x8H2k9L</span>
          </div>
        </div>
      </div>
    </div>`
  },
  // 4. WEB POP-UP: Fake Antivirus
  {
    htmlContent: `
    <div class="fake-popup">
      <div class="popup-header">
        <span>Windows Defender Alert</span>
        <span>✕</span>
      </div>
      <div class="popup-body">
        <div style="font-size:3rem; margin-bottom:10px;">⚠️</div>
        <h3 style="color:var(--danger); margin-bottom:10px;"><span class="clickable-flag" onclick="flagFound(this, 'Scareware uses terrifying language to bypass your logic.')">CRITICAL SYSTEM INFECTION</span></h3>
        <p style="margin-bottom:20px;">Your PC is infected with <span class="clickable-flag" onclick="flagFound(this, 'Web browsers cannot scan your hard drive. Popups claiming to find viruses are fake.')">5 Trojans and Spyware. Your data is being stolen.</span></p>
        <p style="font-weight:bold; margin-bottom:20px;">DO NOT RESTART YOUR COMPUTER.</p>
        <div style="background:#f5f5f5; padding:10px; border:1px solid #ddd; margin-bottom:20px;">
          Call Tech Support Immediately:<br>
          <strong style="font-size:1.2rem; color:#0070ba;"><span class="clickable-flag" onclick="flagFound(this, 'Microsoft or Apple will NEVER ask you to call a random 1-800 number via a pop-up.')">1-800-449-3321</span></strong>
        </div>
      </div>
    </div>`
  },
  // 5. EMAIL: Fake Job/Internship Offer
  {
    htmlContent: `
    <div class="fake-email">
      <div class="email-header">
        <div class="email-row"><strong>From:</strong> Google HR &lt;<span class="clickable-flag" onclick="flagFound(this, 'Big companies do not use free @gmail.com addresses for official hiring.')">google.careers2026@gmail.com</span>&gt;</div>
        <div class="email-row"><strong>Subject:</strong> Remote Internship Offer - $45/hr!</div>
      </div>
      <div class="email-body">
        <p>Congratulations!</p>
        <p>After reviewing your resume online, we are excited to offer you a remote Data Entry internship. <span class="clickable-flag" onclick="flagFound(this, 'Too good to be true: High pay for a simple job with no interview.')">You will be paid $45 per hour and require no prior experience.</span></p>
        <p>To secure your spot and receive your company laptop, <span class="clickable-flag" onclick="flagFound(this, 'Advance-fee scam: Legitimate jobs NEVER ask you to pay money to get hired.')">you must first pay a $50 processing fee for the background check.</span></p>
        <div style="text-align: center; margin: 20px 0;">
          <span class="btn-fake">PAY PROCESSING FEE</span>
        </div>
      </div>
    </div>`
  },
  // 6. SMS: Fake Bank Transfer (Zelle)
  {
    htmlContent: `
    <div class="fake-phone">
      <div class="phone-header">Bank Fraud Alert</div>
      <div class="phone-body">
        <div class="sms-bubble">
          <span class="clickable-flag" onclick="flagFound(this, 'Urgent financial threat designed to make you act without thinking.')">Did you attempt a Zelle transfer of $850.00 to John Doe?</span><br><br>
          If NO, reply N.
        </div>
        <div class="sms-bubble" style="background:#007aff; color:white; align-self:flex-end;">N</div>
        <div class="sms-bubble">
          To stop this transfer, <span class="clickable-flag" onclick="flagFound(this, 'Scammers trigger a password reset on your account, then ask YOU to send them the code.')">please reply with the 6-digit verification code</span> we just sent to your device. <span class="clickable-flag" onclick="flagFound(this, 'Banks explicitly state they will NEVER ask for your 2FA code over text.')">Do not share this code with anyone.</span>
        </div>
      </div>
    </div>`
  },
  // 7. SOCIAL DM: Instagram "Is this you?"
  {
    htmlContent: `
    <div class="fake-dm" style="background:#fff; color:#000;">
      <div class="dm-header" style="background:#fafafa; color:#000; border-bottom:1px solid #dbdbdb;">@BestFriend99</div>
      <div class="dm-body">
        <div class="dm-avatar" style="background:#e1306c;">BF</div>
        <div>
          <div style="font-weight:bold; margin-bottom:5px;">BestFriend99</div>
          <div style="line-height: 1.5; color:#262626;">
            <span class="clickable-flag" onclick="flagFound(this, 'High emotional manipulation. Hackers hijack friends accounts to send these.')">OMG is this you in this video??? 😭😭 Everyone is sharing it!</span><br><br>
            <span class="clickable-flag" onclick="flagFound(this, 'Fake login page designed to steal your Instagram credentials.')">http://instagram-login-secure.com/video-leak</span><br><br>
            <span class="clickable-flag" onclick="flagFound(this, 'Pressuring you to act fast before you check the URL.')">You need to delete this right now before more people see it!</span>
          </div>
        </div>
      </div>
    </div>`
  },
  // 8. EMAIL: Netflix Payment Declined
  {
    htmlContent: `
    <div class="fake-email">
      <div class="email-header">
        <div class="email-row"><strong>From:</strong> Netflix Support &lt;<span class="clickable-flag" onclick="flagFound(this, 'Real Netflix emails come from @netflix.com, not hyphenated domains.')">billing@netflix-update-alert.com</span>&gt;</div>
        <div class="email-row"><strong>Subject:</strong> Payment Declined - Update Required</div>
      </div>
      <div class="email-body">
        <p><span class="clickable-flag" onclick="flagFound(this, 'Generic greeting instead of your actual profile name.')">Hi there,</span></p>
        <p>We were unable to process your last payment. Your subscription will be canceled at the end of the day.</p>
        <p>Please update your payment details immediately to avoid losing access to your favorite shows.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span class="clickable-flag btn-fake" onclick="flagFound(this, 'Suspicious non-official domain for payment update.')">UPDATE PAYMENT METHOD</span>
          <div style="font-size:0.7rem; color:gray; margin-top:5px;">(Link: http://netflix.billing-update-99.com/login)</div>
        </div>
      </div>
    </div>`
  },
  // 9. EMAIL: School IT Password Reset
  {
    htmlContent: `
    <div class="fake-email">
      <div class="email-header">
        <div class="email-row"><strong>From:</strong> IT Helpdesk &lt;<span class="clickable-flag" onclick="flagFound(this, 'Official school emails end in .edu or .edu.my, not .org.')">admin@university-portal.org</span>&gt;</div>
        <div class="email-row"><strong>Subject:</strong> Mandatory Password Reset</div>
      </div>
      <div class="email-body">
        <p><span class="clickable-flag" onclick="flagFound(this, 'Impersonal greeting from what should be an internal university department.')">Attention Student,</span></p>
        <p>Due to a recent security update, all students must reset their portal passwords.</p>
        <p>Failure to do so will result in immediate lockout from the campus Wi-Fi and student dashboard.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span class="clickable-flag btn-fake" onclick="flagFound(this, 'IT departments do not use URL shorteners (like bit.ly) for official password resets.')">RESET PASSWORD</span>
          <div style="font-size:0.7rem; color:gray; margin-top:5px;">(Link: http://bit.ly/univ-reset-332)</div>
        </div>
      </div>
    </div>`
  },
  // 10. SOCIAL DM: Celebrity Crypto Scam (MrBeast - EXACTLY 3 FLAGS)
  {
    htmlContent: `
    <div class="fake-dm" style="background:#15202b;">
      <div class="dm-header" style="background:#15202b; border-bottom:1px solid #38444d;">MrBeast Official <span style="color:#1d9bf0; margin-left:5px;">✔️</span></div>
      <div class="dm-body">
        <div class="dm-avatar" style="background:#1da1f2;">MB</div>
        <div>
          <div style="font-weight:bold; margin-bottom:5px; color:#fff;">
            MrBeast 
            <span class="clickable-flag" onclick="flagFound(this, 'Scammers buy verified checkmarks to look legitimate.')" style="color:#1d9bf0;">✔️ @MrBeast_Real_Giveaway</span>
          </div>
          <div class="dm-message" style="color:#fff; line-height: 1.5;">
            <span class="clickable-flag" onclick="flagFound(this, 'Celebrities do not randomly message fans offering double returns on crypto.')">I am giving back to my fans! Send any amount of Bitcoin to my wallet below and I will send DOUBLE back immediately!</span><br><br>
            Wallet Address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa<br><br>
            <span class="clickable-flag" onclick="flagFound(this, 'Fake scarcity to force you to send money without verifying.')">Hurry, this event ends in 30 minutes and only the first 100 people get paid!</span>
          </div>
        </div>
      </div>
    </div>`
  }
];

function openMinigame() {
  currentMgLevel = 0;
  document.getElementById('minigameOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  loadMgScenario();
}

function loadMgScenario() {
  flagsFound = 0;
  document.getElementById('flagsCount').textContent = '0';
  document.getElementById('mgProgressFill').style.width = '0%';
  document.getElementById('mgFeedback').innerHTML = '';
  
  const displayLevel = document.getElementById('mgLevelDisplay');
  if(displayLevel) displayLevel.textContent = `(SCENARIO ${currentMgLevel + 1} OF ${mgScenarios.length})`;
  
  const s = mgScenarios[currentMgLevel];
  
  const mgBody = document.getElementById('mgBodyContainer');
  if(mgBody) mgBody.innerHTML = s.htmlContent;
}

function flagFound(element, rationale) {
  if (element.classList.contains('found')) return; // Already clicked

  element.classList.add('found');
  flagsFound++;
  
  document.getElementById('flagsCount').textContent = flagsFound;
  document.getElementById('mgProgressFill').style.width = (flagsFound / 3) * 100 + '%';
  
  const feedback = document.getElementById('mgFeedback');
  
  // Show the rationale for the current flag
  feedback.innerHTML = `<strong>FLAG ISOLATED:</strong> <span style="color:white;">${rationale}</span>`;

  // Grant XP safely
  totalPlayerXP += 25;
  const navXpEl = document.getElementById('navXpCount');
  if (navXpEl) navXpEl.textContent = totalPlayerXP + " XP";

  if (flagsFound === 3) {
    // We use += so the explanation of the 3rd flag is NOT erased!
    if (currentMgLevel < mgScenarios.length - 1) {
        feedback.innerHTML += `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
            <span style="color:var(--neon2); font-weight:bold; font-size:1.1rem;">SCENARIO SECURED!</span><br>All phishing indicators identified. You earned +75 Bonus XP!
            <br><button class="btn-primary" style="margin-top:10px; padding:10px 20px; font-size:0.7rem; background:var(--neon2);" onclick="nextMgScenario()">NEXT SIMULATION →</button>
          </div>
        `;
    } else {
        feedback.innerHTML += `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
            <span style="color:var(--neon2); font-weight:bold; font-size:1.1rem;">TRAINING COMPLETE!</span><br>You have mastered all 10 threat scenarios.
            <br><button class="btn-primary" style="margin-top:10px; padding:10px 20px; font-size:0.7rem; background:var(--neon2);" onclick="closeMinigame()">FINISH SIMULATION</button>
          </div>
        `;
    }
  }
}

function nextMgScenario() {
    currentMgLevel++;
    loadMgScenario();
}

function closeMinigame() {
  const overlay = document.getElementById('minigameOverlay');
  if(overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ========== RANDOM ENCOUNTER TRAPS LOGIC ==========

window.addEventListener('load', () => {
    // 1. The Reward Popup (Triggers at 1.5 seconds)
    setTimeout(() => {
        const overlay = document.getElementById('initial-scam-overlay');
        if(overlay) overlay.style.display = 'flex';
    }, 1500);

    // 2. The Evil Cookie Banner (Triggers at 6 seconds)
    setTimeout(() => {
        const cookieBanner = document.getElementById('evil-cookie-banner');
        if (cookieBanner) cookieBanner.style.bottom = '0'; // Slides up
    }, 6000);

    // 3. The Fake Support Widget (Triggers at 12 seconds)
    setTimeout(() => {
        const widget = document.getElementById('fake-support-widget');
        if (widget) widget.style.transform = 'translateY(0)'; // Bounces up
    }, 12000);
});

// Reward Trap Logic
function closeInitialScam(wasClicked) {
    const overlay = document.getElementById('initial-scam-overlay');
    overlay.style.display = 'none';
    if(wasClicked) {
        alert("🚨 ALERT: You just got scammed!\n\nThis is a classic phishing trap. In the real world, clicking buttons like this could install malware on your device. Stay alert!");
    } else {
        alert("🎯 EXCELLENT VIGILANCE!\n\nYou successfully identified and avoided a potential threat. (+50 Bonus XP Awarded)");
        grantGlobalXP(50);
    }
}

// Cookie Trap Logic
function handleCookieTrap(accepted) {
    const banner = document.getElementById('evil-cookie-banner');
    banner.style.bottom = '-200px'; // Hide it
    
    if (accepted) {
        alert("🚨 PRIVACY BREACH!\n\nYou just blindly clicked 'Accept All'! The fine print explicitly stated you were sharing your location and microphone data with advertisers.\n\nAlways read or manage preferences instead of blindly accepting cookies.");
    } else {
        alert("🛡️ PRIVACY DEFENDED!\n\nGreat job. You chose to manage your preferences instead of blindly handing over your data to trackers. (+25 Bonus XP)");
        grantGlobalXP(25);
    }
}

// Fake Chatbot Trap Logic
function handleSupportTrap() {
    const widget = document.getElementById('fake-support-widget');
    widget.style.transform = 'translateY(150px)'; // Hide it
    
    alert("🚨 SCAREWARE AVOIDED!\n\nThat wasn't a real support agent. Scammers inject fake chat boxes and 'System Error' alerts into websites to make you panic and click malicious links.\n\nReal websites don't suddenly warn you about your IP leaking through a generic chat widget.");
}

// Helper function to safely grant XP
function grantGlobalXP(amount) {
    totalPlayerXP += amount;
    const navXpEl = document.getElementById('navXpCount');
    if (navXpEl) navXpEl.textContent = totalPlayerXP + " XP";
}