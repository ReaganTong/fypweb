// ========== SUPABASE CONFIGURATION ==========
const SUPABASE_URL = 'https://niskjnpwpejqsrwgpkqe.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pc2tqbnB3cGVqcXNyd2dwa3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MDgxMTksImV4cCI6MjA4MjI4NDExOX0.7DyzhGvT2AGlaIIjv0F9iOV-OuccVkOg1yBmQR-ksr8';

let supabaseClient = null;
try {
    if (SUPABASE_URL.startsWith('http')) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch(e) {
    console.warn("Supabase not fully configured. Running in offline mode.");
}

// Default session ID, will be overwritten if user types in the input box
let sessionId = 'AGENT_' + Math.random().toString(36).substr(2, 5);

// ========== GAME STATE ==========
let unlockedChapter = 4; // ALL CHAPTERS UNLOCKED FOR EXAMINER
let totalPlayerXP = 0;

let currentChapter = null;
let currentQ = 0;
let score = 0;
let xp = 0;
let answered = false;

// Dynamic Brands to prevent rote memorization
const scamBrands = ["S Pay Global", "ShopeePay", "GrabPay", "Sarawak Energy", "NinjaVan"];

// ========== 10-QUESTION CORE LOGIC DATA (FYP OPTIMIZED) ==========
const quizData = {
  1: {
    title: "The Logic of Passwords",
    label: "// MISSION 01",
    color: "var(--neon)",
    questions: [
      { 
        q: "Applying the principle of 'Entropy', which password strategy makes it mathematically hardest for a hacker's bot to guess?", 
        options: ["Adding symbols to short words (Uts@2026)", "Using significant personal dates (Reagan_030628)", "Using a long, memorable passphrase (Sibu_Kampua_Enak!)", "Following a common keyboard pattern (Password_123!)"], 
        answer: 2, 
        explanation: "Entropy Logic: Length is the ultimate defense. Increasing character count slows down cracking software exponentially. A passphrase is easy for you to remember but a nightmare for a machine to brute-force.",
        tip: "Length creates the strongest mathematical barrier." 
      },
      { 
        q: "If you use the same password for multiple accounts, how does the 'Credential Stuffing' logic affect your security?", 
        options: ["It makes your internet connection slower", "One security breach on a weak site leads to total account loss", "It triggers a social media shadowban", "It only affects the account that was hacked"], 
        answer: 1, 
        explanation: "Credential Stuffing Logic: Hackers assume people reuse passwords. If they steal your password from a low-security site, they will immediately 'stuff' it into your Bank, IG, and Gmail. Unique passwords isolate the damage.",
        tip: "A single password is a single point of failure." 
      }
    ]
  },
  2: {
    title: "The App-First Rule",
    label: "// MISSION 02",
    color: "var(--neon2)",
    questions: [
      { 
        q: "You receive a message from {BRAND} about a reward. According to the 'App-First' rule, what is the ONLY safe way to confirm this?", 
        options: ["Click the link to see the official terms", "Manually open the official App and check notifications", "Reply to the message asking for proof", "Ask a friend if they received the same link"], 
        answer: 1, 
        explanation: "The App-First Rule: Official platforms like S Pay Global or Grab never use external links in a chat to give you money. The app is the only 'Trusted Environment'. If it's not in the app, it's a scam.",
        tip: "Trust the App, never the link." 
      },
      { 
        q: "A parcel scam asks for a tiny RM1.50 'redelivery fee'. What is the 'Low-Friction' trap being used here?", 
        options: ["The fee is too high for a student to afford", "The small amount lowers your suspicion to steal your card details", "Courier services are always 100% free in Sarawak", "The link tracks your GPS location in real-time"], 
        answer: 1, 
        explanation: "Low-Friction Logic: Scammers don't want your RM1.50; they want your credit card numbers. By asking for a tiny fee, they hope you will type in your card info without thinking, enabling much larger future thefts.",
        tip: "Small fees are often bait for big data theft." 
      }
    ]
  },
  3: {
    title: "Privacy & Permissions",
    label: "// MISSION 03",
    color: "var(--neon3)",
    questions: [
      { 
        q: "A basic flashlight app requests access to your 'Location' and 'Contacts'. Which core security principle does this violate?", 
        options: ["The Speed Principle", "The Principle of Least Privilege", "The Open Source Rule", "The Data Synchronization Rule"], 
        answer: 1, 
        explanation: "Least Privilege Logic: An app should only have the permissions it absolutely needs to function. A flashlight doesn't need your contacts. If it asks for unrelated permissions, it is likely harvesting your data.",
        tip: "If the permission doesn't fit the function, deny it." 
      },
      { 
        q: "When using 'Free Public Wi-Fi' in a cafe, what is the 'Man-in-the-Middle' logic that puts your banking data at risk?", 
        options: ["Public Wi-Fi is too slow to support encryption", "An attacker can intercept and read every piece of data you send", "Your device's battery will drain faster on public networks", "Public Wi-Fi is only meant for social media, not banking"], 
        answer: 1, 
        explanation: "The Man-in-the-Middle: An attacker can create a fake hotspot with the same name as the cafe. If you connect, all your traffic passes through them first, allowing them to record your passwords.",
        tip: "Use a VPN or Mobile Data for sensitive tasks." 
      }
    ]
  },
  4: {
    title: "The Human Element",
    label: "// MISSION 04",
    color: "var(--neon4)",
    questions: [
      { 
        q: "A scam message says you must 'ACT NOW' within 10 minutes. Why is 'Urgency' the scammer's best friend?", 
        options: ["Servers need to reset every 10 minutes", "Panic bypasses the logical, critical-thinking part of your brain", "It is an official security policy for all platforms", "It ensures the system doesn't overload with users"], 
        answer: 1, 
        explanation: "Urgency Logic: When panicked, you focus on the threat and stop noticing red flags like fake email addresses. Scammers use time pressure to force you into making a mistake.",
        tip: "High urgency is a high-level red flag." 
      },
      { 
        q: "To hold a cyberbully accountable, what is the 'Digital Evidence' logic you must follow before blocking them?", 
        options: ["Delete the chat so they can't see your reaction", "Insult them back to show you are not afraid", "Capture screenshots of the messages and their ID profile", "Ignore the messages until the person gets bored"], 
        answer: 2, 
        explanation: "Evidence Logic: Moderators and police cannot act on your word alone. Deleting the chat removes the proof. You must capture clear screenshots of the messages and the bully's unique ID to build a valid case.",
        tip: "Screenshots are the only receipts in the digital world." 
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
    animateCounter('counter-questions', 10); // Changed to 10
    animateCounter('counter-chapters', 4);
  }, 500);
});

// ========== NAVIGATION & QUIZ LOGIC ==========
function scrollToChapters() {
  const idInput = document.getElementById('participantId');
  const mainContent = document.getElementById('main-content');
  
  // 1. 验证：如果输入框是空的，或者全是空格
  if (!idInput || idInput.value.trim() === "") {
    alert("ACCESS DENIED: Please enter your Name / Unique ID to initialize the simulation.");
    idInput.focus(); // 自动把光标移回输入框
    return; // 结束函数，不执行跳转，也不解锁
  }

  // 2. 验证通过：保存 ID 供数据库使用
  sessionId = idInput.value.trim();
  
  // 3. 关键：显示原本隐藏的下方内容
  if (mainContent) {
    mainContent.style.display = 'block';
  }

  // 4. 执行跳转：现在下方内容已经存在了，可以顺利划到章节位置
  const target = document.getElementById('chapters');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function openQuiz(chapter) {
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
  let q = data.questions[currentQ];
  answered = false;

  let randomBrand = scamBrands[Math.floor(Math.random() * scamBrands.length)];
  let dynamicText = q.q.replace(/{BRAND}/g, randomBrand);

  document.getElementById('questionCounter').textContent = `QUESTION ${currentQ + 1} OF ${data.questions.length}`;
  document.getElementById('questionText').textContent = dynamicText;

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

  // 修复点：在这里重新获取当前关卡的数据
  const data = quizData[currentChapter]; 
  const q = data.questions[currentQ];
  const allBtns = document.querySelectorAll('.option-btn');

  allBtns.forEach(b => b.disabled = true);

  const fb = document.getElementById('feedbackBox');
  const fbTitle = document.getElementById('feedbackTitle');
  const fbText = document.getElementById('feedbackText');

  if (index === q.answer) {
    btn.classList.add('correct');
    fb.className = 'feedback-box show correct-fb';
    fbTitle.textContent = '✓ LOGIC VERIFIED';
    fbText.textContent = q.explanation;
    score += 100;
    xp += 50;
  } else {
    btn.classList.add('wrong');
    allBtns[q.answer].classList.add('correct');
    fb.className = 'feedback-box show wrong-fb';
    fbTitle.textContent = '✗ LOGIC ERROR';
    fbText.textContent = q.explanation;
    xp += 10;
  }
  
  document.getElementById('scoreDisplay').textContent = score;
  // 修复点：使用重新获取的 data 计算进度
  document.getElementById('xpFill').style.width = Math.min((xp / (data.questions.length * 50)) * 100, 100) + '%';
  document.getElementById('xpCount').textContent = xp + ' XP';
  
  // 这行代码现在可以正常运行了
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
  document.getElementById('quizBody').style.display = 'none';
  const results = document.getElementById('resultsScreen');
  results.classList.add('show');

  const data = quizData[currentChapter];
  const total = data.questions.length;
  const correct = score / 100;
  const wrong = total - correct;
  const pct = Math.round((correct / total) * 100);

  document.getElementById('progressFill').style.width = '100%';

  let icon = pct >= 50 ? '🏆' : '🔄';
  let title = pct >= 50 ? 'SECTOR SECURED!' : 'KEEP LEARNING!';
  
  if (pct >= 50) { 
      totalPlayerXP += score;
      const navXpEl = document.getElementById('navXpCount');
      if(navXpEl) navXpEl.textContent = totalPlayerXP + " XP";
  }

  let riskAnalysis = "";
  if (pct < 60) {
    riskAnalysis = "CRITICAL RISK: You are highly vulnerable to local scams. Your instinct to trust digital requests needs immediate adjustment.";
  } else if (pct < 90) {
    riskAnalysis = "MODERATE RISK: You understand the basics, but 'ambiguous' traps still catch you. Focus on verifying official channels.";
  } else {
    riskAnalysis = "LOW RISK: Agent, your digital defense is solid. You have successfully internalized the core logic of cybersecurity.";
  }

  document.getElementById('resultsIcon').textContent = icon;
  document.getElementById('resultsTitle').textContent = title;
  document.getElementById('resultsScoreBig').textContent = pct + '%';
  document.getElementById('rbCorrect').textContent = correct;
  document.getElementById('rbWrong').textContent = wrong;
  document.getElementById('rbXP').textContent = xp;
  document.getElementById('resultsMessage').innerHTML = `<strong>AGENT DOSSIER:</strong><br>${riskAnalysis}`;

  if (supabaseClient) {
      try {
          await supabaseClient.from('game_results').insert({
              unique_id: sessionId, 
              chapter: currentChapter,
              score: pct,
              status: riskAnalysis
          });
      } catch(e) { console.log("Offline mode: Data not saved."); }
  }
}

function retryQuiz() { openQuiz(currentChapter); }

function closeQuiz() {
  document.getElementById('quizOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('quizOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeQuiz();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
      closeQuiz();
      closeMinigame();
  }
});

// ========== NEW: HACKER SIMULATION (CONSEQUENCE LEARNING) ==========
function triggerHackerSim(message) {
    const overlay = document.getElementById('hacker-overlay');
    const textEl = document.getElementById('hacker-text');
    if(!overlay || !textEl) return;
    
    overlay.style.display = 'block';
    textEl.innerHTML = "";
    
    let logs = [
        "> [SYSTEM ALERT] UNAUTHORIZED DATA UPLOAD DETECTED",
        "> BYPASSING FIREWALL...",
        "> ACCESSING: /Users/Local_Device/Contacts.json",
        "> UPLOADING 243 CONTACTS TO EXTERNAL SERVER...",
        "> HARVESTING: Precise_Location_GPS...",
        "> LOCATION PINPOINTED: Sarawak, Malaysia",
        "> ENCRYPTING DRIVE...",
        "--------------------------------------------------",
        "<span style='color:red; font-weight:bold;'>" + message + "</span>",
        "--------------------------------------------------",
        "> REBOOTING IN SAFE MODE IN 4 SECONDS..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
        textEl.innerHTML += logs[i] + "<br><br>";
        i++;
        if(i >= logs.length) {
            clearInterval(interval);
            setTimeout(() => { 
                overlay.style.display = 'none'; 
                textEl.innerHTML = ""; 
            }, 5000);
        }
    }, 600);
}

// ========== RANDOM ENCOUNTER TRAPS LOGIC ==========
window.addEventListener('load', () => {
    setTimeout(() => {
        const overlay = document.getElementById('initial-scam-overlay');
        if(overlay) overlay.style.display = 'flex';
    }, 2000);

    setTimeout(() => {
        const cookieBanner = document.getElementById('evil-cookie-banner');
        if (cookieBanner) cookieBanner.style.bottom = '0';
    }, 6000);

    setTimeout(() => {
        const widget = document.getElementById('fake-support-widget');
        if (widget) widget.style.transform = 'translateY(0)';
    }, 12000);
});

async function closeInitialScam(wasClicked) {
    const overlay = document.getElementById('initial-scam-overlay');
    overlay.style.display = 'none';
    
    let result = wasClicked ? 'Failed' : 'Passed';
    
    // 存入 Supabase
    if (supabaseClient) {
        await supabaseClient.from('behavior_logs').insert({
            unique_id: sessionId,
            event_type: 'Starter Bonus Trap',
            action: result
        });
    }

    if(wasClicked) {
        triggerHackerSim("LOGIC ERROR: You clicked a random 'Bonus XP' button...");
    } else {
        alert("🎯 EXCELLENT VIGILANCE!");
        grantGlobalXP(50);
    }
}

async function handleCookieTrap(accepted) {
    const banner = document.getElementById('evil-cookie-banner');
    banner.style.bottom = '-200px'; 
    
    let result = accepted ? 'Failed' : 'Passed';

    // 存入 Supabase
    if (supabaseClient) {
        await supabaseClient.from('behavior_logs').insert({
            unique_id: sessionId,
            event_type: 'Cookie Privacy Trap',
            action: result
        });
    }

    if (accepted) {
        triggerHackerSim("PRIVACY BREACH: You clicked 'Accept All'...");
    } else {
        alert("🛡️ PRIVACY DEFENDED!");
        grantGlobalXP(25);
    }
}

async function handleSupportTrap() {
    const widget = document.getElementById('fake-support-widget');
    widget.style.transform = 'translateY(150px)'; 
    
    // 1. 存入 Supabase：记录用户中计的行为
    if (supabaseClient) {
        await supabaseClient.from('behavior_logs').insert({
            unique_id: sessionId,
            event_type: 'Support Widget Trap',
            action: 'Failed' // 只要点击就是中计了
        });
    }
    
    // 2. 触发视觉惩罚
    triggerHackerSim("SCAREWARE TRIGGERED: That wasn't a real support agent. Scammers inject fake chat boxes to make you panic and click malicious links.");
}

function grantGlobalXP(amount) {
    totalPlayerXP += amount;
    const navXpEl = document.getElementById('navXpCount');
    if (navXpEl) navXpEl.textContent = totalPlayerXP + " XP";
}

// ========== MINIGAME (PHISHING INSPECTOR) RESTORED ==========
let flagsFound = 0;
let currentMgLevel = 0;

const mgScenarios = [
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
  if (element.classList.contains('found')) return; 

  element.classList.add('found');
  flagsFound++;
  
  document.getElementById('flagsCount').textContent = flagsFound;
  document.getElementById('mgProgressFill').style.width = (flagsFound / 3) * 100 + '%';
  
  const feedback = document.getElementById('mgFeedback');
  feedback.innerHTML = `<strong>FLAG ISOLATED:</strong> <span style="color:white;">${rationale}</span>`;

  totalPlayerXP += 25;
  const navXpEl = document.getElementById('navXpCount');
  if (navXpEl) navXpEl.textContent = totalPlayerXP + " XP";

  if (flagsFound === 3) {
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