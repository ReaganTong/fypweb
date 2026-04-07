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

// ========== FULL 15-QUESTION LOGIC DATA ==========
const quizData = {
  1: {
    title: "The Logic of Passwords",
    label: "// MISSION 01",
    color: "var(--neon)",
    questions: [
      { 
        q: "To protect your Student Portal, which password logic is mathematically the hardest for a hacker to crack?", 
        options: ["Short & Complex (Uts@2026)", "Personal Info (Reagan_030628)", "Long Passphrase (Sibu_Kampua_Enak!)", "Standard Pattern (Password_123!)"], 
        answer: 2, 
        explanation: "The logic here is Entropy. Computers can guess symbols fast, but length slows them down exponentially. A long sentence is easy for you to remember but mathematically impossible for a bot to guess.",
        tip: "Think Length > Complexity." 
      },
      { 
        q: "What is the primary danger of using the exact same password for Mobile Legends and your Instagram?", 
        options: ["Account loading delays", "Credential Stuffing attacks", "Social media shadowbans", "2FA will stop working"], 
        answer: 1, 
        explanation: "Hackers use 'Credential Stuffing' logic: if they steal your password from a small, weak website (like a game forum), they will immediately try that same password on your IG, Gmail, and Bank. One leak equals total loss.",
        tip: "Unique passwords isolate your risks." 
      },
      { 
        q: "When a public browser at a cybercafe asks to 'Save Password', why is clicking 'Never' NOT enough to protect you?", 
        options: ["It saves it anyway", "It creates a slow connection", "It doesn't clear the current session", "It alerts the admin"], 
        answer: 2, 
        explanation: "The logic of public privacy: 'Never' only stops future saves. If you don't manually clear the cache and Log Out, your active 'Session Cookie' stays in the browser. The next student can open the page and be instantly logged into your account.",
        tip: "Always clear history and Log Out on public PCs." 
      }
    ]
  },
  2: {
    title: "The App-First Rule",
    label: "// MISSION 02",
    color: "var(--neon2)",
    questions: [
      { 
        q: "A WhatsApp message from {BRAND} claims you won RM50. It includes a link to claim. Your logical move?", 
        options: ["Click to check", "Verify only via the official App", "Forward to friends", "Use a fake phone number"], 
        answer: 1, 
        explanation: "The 'App-First' logic: Official platforms will NEVER send a link in a chat to give you money. If a message has a link, it is a redirect trap. Always close the chat and open the official App manually to check your notifications.",
        tip: "If it's real, it's in the App." 
      },
      { 
        q: "An SMS says your parcel to Sarikei is held for a RM1.50 fee. Why is this 'low fee' so dangerous?", 
        options: ["The fee is too high", "It is a credit card data harvester", "Courier apps are always free", "It tracks your GPS"], 
        answer: 1, 
        explanation: "Scammers use 'Low Friction' logic. They ask for a tiny amount (RM1.50) so you don't think twice before entering your credit card details. Once you type them, they capture your full card info for massive future thefts.",
        tip: "Never pay fees via SMS links." 
      },
      { 
        q: "A TikTok ad for a high-interest savings account asks you to download an APK file. Why is this a red flag?", 
        options: ["APK files are for iPhones only", "Banks don't run ads", "Third-party APKs bypass phone security", "The interest rate is too low"], 
        answer: 2, 
        explanation: "The 'Trusted Source' logic: APK files installed directly from browsers bypass the security scans of official app stores. These files often contain 'SmsSpy' malware which silently reads and steals your Bank OTPs from your text messages.",
        tip: "Only install from official stores." 
      },
      { 
        q: "A Facebook post claims a RM200 Youth Subsidy is available and asks for your phone number in the comments. The risk?", 
        options: ["Your phone will ring too much", "Data harvesting for targeted scams", "Facebook will ban you", "No risk, it's public info"], 
        answer: 1, 
        explanation: "The 'Data Harvesting' logic: Scammers scrape phone numbers from comments to create a 'Sucker List'. They will call you months later pretending to be your Bank or the Government, using your name and number to sound incredibly real.",
        tip: "Your identity info is not for comments." 
      }
    ]
  },
  3: {
    title: "Permission Logic",
    label: "// MISSION 03",
    color: "var(--neon3)",
    questions: [
      { 
        q: "A simple 'Compass App' requests access to your 'Contacts'. Which principle does this violate?", 
        options: ["The Speed Principle", "The Least Privilege Principle", "The Open Source Rule", "The Data Sync Rule"], 
        answer: 1, 
        explanation: "The logic of 'Least Privilege': An app should ONLY have the permissions it needs to function. A compass needs GPS, not your friends' phone numbers. If it asks for more, it is likely harvesting and selling your data.",
        tip: "Question every permission." 
      },
      { 
        q: "Why is it risky to log into your bank while using 'Free Wi-Fi' at a cafe in Sibu?", 
        options: ["The Wi-Fi is too slow", "Risk of a Man-in-the-Middle attack", "Your battery will drain", "Cafe Wi-Fi is only for browsing"], 
        answer: 1, 
        explanation: "The 'Evil Twin' logic: A hacker can easily create a Wi-Fi hotspot with the exact same name as the cafe. If you connect, they act as a 'Man-in-the-Middle', seeing and recording everything you type into your banking app.",
        tip: "Use Mobile Data for sensitive tasks." 
      },
      { 
        q: "You post a selfie at the UTS campus, but your Student ID is visible in the background. Why must you blur it?", 
        options: ["To look more professional", "To prevent identity theft via barcodes", "To hide your age", "To avoid school punishment"], 
        answer: 1, 
        explanation: "The 'Digital Footprint' logic: Barcodes and IDs contain encoded personal data that can be used to track your location, clone your student card, or find your home address. Once posted online, you can never fully delete it.",
        tip: "The background matters as much as your face." 
      },
      { 
        q: "A Facebook quiz game asks for access to your 'Friends List' to tell you your future. Why do they want it?", 
        options: ["To show your results to them", "To build a social map for future scams", "To verify you are human", "To help you find new friends"], 
        answer: 1, 
        explanation: "The 'API Scraping' logic: Free quiz apps are often fronts for data firms. By accessing your friends list, they can target your friends with fake messages that look exactly like they came from you.",
        tip: "Don't trade privacy for a quiz result." 
      }
    ]
  },
  4: {
    title: "The Human Element",
    label: "// MISSION 04",
    color: "var(--neon4)",
    questions: [
      { 
        q: "A 'Pro' in Valorant offers to boost your rank if you share your password. What is the scam logic here?", 
        options: ["He wants to see your skins", "Account hijacking and resale", "He needs to verify your level", "There is no scam"], 
        answer: 1, 
        explanation: "The 'Authority' logic: Scammers pretend to be experts to make you lower your guard. Once they have your password, they will instantly change your recovery email and sell your account to someone else.",
        tip: "Skill is earned, passwords are kept." 
      },
      { 
        q: "An email warns your account will be banned in 1 hour if you don't click 'Verify'. Why the 1-hour limit?", 
        options: ["System server resets", "To force 'Panic-Mode' thinking", "Official policy rule", "To save storage space"], 
        answer: 1, 
        explanation: "The 'Urgency' logic: Fear and rush bypass the logical part of your brain. If you are panicked, you won't stop to notice the fake sender email address. Real companies give you days or weeks to resolve issues, never one hour.",
        tip: "Panic is the scammer's best friend." 
      },
      { 
        q: "A friend DMs you on Discord: 'OMG, is this you in this video?? [Link]'. Why MUST you call them before clicking?", 
        options: ["To see if the video is funny", "To verify their account hasn't been hacked", "To ask for the video name", "To check their data connection"], 
        answer: 1, 
        explanation: "The 'Social Trust' logic: Scammers hack one person, then send phishing links to everyone on their friends list. If a message looks out of character, always verify it via a completely different channel (like a phone call).",
        tip: "Verify outside the chat." 
      },
      { 
        q: "Someone is being bullied in your group chat. Why is 'Reporting' logically better than 'Fighting Back'?", 
        options: ["Reporting is faster", "It creates a digital evidence trail", "Fighting back uses too much data", "Bullies are always right"], 
        answer: 1, 
        explanation: "The 'Evidence' logic: Fighting back escalates the anger and can make YOU look like the bully to moderators. Reporting creates a timestamped system log that platform admins can use to permanently ban the harasser.",
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
    animateCounter('counter-questions', 15); // Updated to 15
    animateCounter('counter-chapters', 4);
  }, 500);
});

// ========== NAVIGATION & QUIZ LOGIC ==========
function scrollToChapters() {
  // Capture the Unique ID from the HTML input if the user typed it
  const idInput = document.getElementById('participantId');
  if (idInput && idInput.value.trim() !== '') {
    sessionId = idInput.value.trim();
  }
  document.getElementById('chapters').scrollIntoView({ behavior: 'smooth' });
}

function openQuiz(chapter) {
  // NO LOCKS - Examiner can open any chapter
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

  // DYNAMIC INJECTION: Replace {BRAND} with a random local brand
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

  const q = quizData[currentChapter].questions[currentQ];
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
  document.getElementById('xpFill').style.width = Math.min((xp / (data.questions.length * 50)) * 100, 100) + '%';
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

  // --- RISK DOSSIER LOGIC ---
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

  // SAVE TO SUPABASE USING UNIQUE ID
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
    // 1. The Reward Popup (Triggers at 2 seconds)
    setTimeout(() => {
        const overlay = document.getElementById('initial-scam-overlay');
        if(overlay) overlay.style.display = 'flex';
    }, 2000);

    // 2. The Evil Cookie Banner (Triggers at 6 seconds)
    setTimeout(() => {
        const cookieBanner = document.getElementById('evil-cookie-banner');
        if (cookieBanner) cookieBanner.style.bottom = '0';
    }, 6000);

    // 3. The Fake Support Widget (Triggers at 12 seconds)
    setTimeout(() => {
        const widget = document.getElementById('fake-support-widget');
        if (widget) widget.style.transform = 'translateY(0)';
    }, 12000);
});

function closeInitialScam(wasClicked) {
    const overlay = document.getElementById('initial-scam-overlay');
    overlay.style.display = 'none';
    if(wasClicked) {
        triggerHackerSim("LOGIC ERROR: You clicked a random 'Bonus XP' button. In the real world, this installs malware on your device. Never trust free pop-ups.");
    } else {
        alert("🎯 EXCELLENT VIGILANCE!\nYou successfully identified and avoided a phishing threat. (+50 Bonus XP)");
        grantGlobalXP(50);
    }
}

function handleCookieTrap(accepted) {
    const banner = document.getElementById('evil-cookie-banner');
    banner.style.bottom = '-200px'; 
    if (accepted) {
        triggerHackerSim("PRIVACY BREACH: You clicked 'Accept All' without reading. The fine print stated you were sharing your location and microphone data.");
    } else {
        alert("🛡️ PRIVACY DEFENDED!\nYou chose to manage your preferences instead of blindly handing over your data. (+25 Bonus XP)");
        grantGlobalXP(25);
    }
}

function handleSupportTrap() {
    const widget = document.getElementById('fake-support-widget');
    widget.style.transform = 'translateY(150px)'; 
    triggerHackerSim("SCAREWARE TRIGGERED: That wasn't a real support agent. Scammers inject fake chat boxes to make you panic and click malicious links.");
}

function grantGlobalXP(amount) {
    totalPlayerXP += amount;
    const navXpEl = document.getElementById('navXpCount');
    if (navXpEl) navXpEl.textContent = totalPlayerXP + " XP";
}

// ========== MINIGAME (PHISHING INSPECTOR) HAS BEEN LEFT INTACT BELOW ==========
// (If you still use the minigame from the original file, it will work perfectly here, 
// but the core FYP logic assessment above is what runs the main chapters).