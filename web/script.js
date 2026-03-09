// ========== QUIZ DATA ==========
const quizData = {
  1: {
    title: "Passwords & Account Security",
    label: "// CHAPTER 01 — BEGINNER",
    color: "var(--neon)",
    questions: [
      {
        q: "You need to create a password for your school email. Which of these options is the MOST secure?",
        options: ["alex2008", "MySchoolEmail!", "T7#mP!2kLw@9xQ", "password123"],
        answer: 2,
        explanation: "A strong password uses a mix of uppercase, lowercase, numbers, and special characters, and is at least 12 characters long. 'T7#mP!2kLw@9xQ' meets all these criteria. Avoid names, years, and obvious words.",
        tip: "Think of a password like a lock — the more complex the combination, the harder to crack."
      },
      {
        q: "What does 2FA (Two-Factor Authentication) do to protect your account?",
        options: ["Makes your password twice as long", "Requires a second form of verification beyond your password", "Logs you in from two devices at once", "Stores two copies of your password"],
        answer: 1,
        explanation: "2FA adds a second layer of security. Even if someone steals your password, they still can't log in without the second factor (like a code sent to your phone or an authenticator app).",
        tip: "Always enable 2FA on important accounts like email, banking, and social media."
      },
      {
        q: "Your friend says they use the same password for every account because it's easy to remember. What's the BIGGEST risk?",
        options: ["Their accounts will load slower", "If one account is hacked, all accounts are at risk", "They might forget the password", "Nothing — it's a smart strategy"],
        answer: 1,
        explanation: "This is called 'credential stuffing'. Hackers take leaked passwords from one site and try them on others. If you reuse passwords, one breach could compromise ALL your accounts.",
        tip: "Use a password manager to generate and store unique passwords for every site."
      },
      {
        q: "Which of the following is the SAFEST place to store your passwords?",
        options: ["A sticky note on your monitor", "A text file called 'passwords.txt' on your desktop", "A trusted password manager app", "Your browser's basic autofill (no master password)"],
        answer: 2,
        explanation: "Password manager apps encrypt your passwords and require a master password. Sticky notes and unprotected files are easily seen by anyone with access to your computer.",
        tip: "Popular password managers include Bitwarden (free), 1Password, and Dashlane."
      },
      {
        q: "You get an alert: 'Your password was found in a data breach.' What should you do FIRST?",
        options: ["Ignore it — it's probably spam", "Change the password on that site immediately", "Delete your account", "Tell your friends about the breach"],
        answer: 1,
        explanation: "Change the compromised password immediately. Then check if you used that password anywhere else and change it there too. Use a site like haveibeenpwned.com to check your email.",
        tip: "Sites like HaveIBeenPwned let you check if your email appeared in any known data breaches."
      },
      {
        q: "What is a 'brute-force attack'?",
        options: ["Physically breaking into a server room", "A hacker guessing every possible password combination automatically", "Sending thousands of phishing emails", "Using a fake Wi-Fi hotspot"],
        answer: 1,
        explanation: "Brute-force attacks use automated tools to try millions of password combinations per second. Short, simple passwords can be cracked in seconds — complex, long ones take years.",
        tip: "Every extra character in a password dramatically increases the time needed to brute-force it."
      },
      {
        q: "A website you use was hacked and your hashed password was stolen. Why is hashing good?",
        options: ["It makes passwords invisible to everyone", "It converts passwords into a scrambled code that's hard to reverse", "It deletes passwords after 30 days", "It stores your password in two locations"],
        answer: 1,
        explanation: "Hashing is a one-way function — it converts your password into a fixed string of characters. Good websites never store your actual password, just the hash. Even if leaked, the original is hard to recover.",
        tip: "Websites using outdated hashing (like MD5) are more vulnerable. Strong algorithms include bcrypt."
      },
      {
        q: "Which is an example of a passphrase and why is it useful?",
        options: ["Xk!9#R2m", "correcthorsebatterystaple", "admin123", "JohnSmith1995"],
        answer: 1,
        explanation: "A passphrase uses multiple random words together. 'correcthorsebatterystaple' is long (28 chars), easy to remember, and much harder to crack than short complex passwords because of its length.",
        tip: "Length matters more than complexity. A 4-word passphrase beats a short jumble of symbols."
      },
      {
        q: "Your school account has been locked after too many failed login attempts. What likely happened?",
        options: ["You typed your password correctly too many times", "Someone attempted a brute-force or credential stuffing attack", "The school's internet went down", "Your account expired"],
        answer: 1,
        explanation: "Account lockouts are a security measure that triggers after multiple failed login attempts. This protects against automated brute-force attacks. Change your password and enable 2FA after unlocking.",
        tip: "Account lockouts are a feature, not a bug — they're protecting you!"
      },
      {
        q: "What is a 'dictionary attack'?",
        options: ["Looking up cybersecurity terms online", "An attack using common words and phrases as password guesses", "Stealing a physical dictionary", "Guessing every character combination randomly"],
        answer: 1,
        explanation: "Dictionary attacks use lists of common words, phrases, and passwords (like 'password', 'letmein', '123456') to guess login credentials. Avoid any real words or common phrases in passwords.",
        tip: "Millions of the most common passwords are compiled in lists hackers use for dictionary attacks."
      }
    ]
  },
  2: {
    title: "Phishing & Social Engineering",
    label: "// CHAPTER 02 — INTERMEDIATE",
    color: "var(--neon2)",
    questions: [
      {
        q: "You receive an email saying 'Your Netflix account has been suspended! Click here to verify your payment.' What should you do?",
        options: ["Click the link and enter your details", "Forward it to all your friends as a warning", "Go directly to Netflix.com in a new tab to check your account", "Reply asking for more information"],
        answer: 2,
        explanation: "Never click links in suspicious emails. Go directly to the website by typing the URL yourself. Phishing emails create fake urgency to trick you into clicking without thinking.",
        tip: "Legitimate companies never ask for your password via email."
      },
      {
        q: "What is 'spear phishing' different from regular phishing?",
        options: ["It uses fish-themed graphics", "It targets a specific person using their personal information", "It only happens on fishing websites", "It's a safer type of phishing"],
        answer: 1,
        explanation: "Spear phishing is highly targeted — attackers research the victim and personalize the message using real details (your name, employer, friends) to make it more convincing.",
        tip: "The more personal an unexpected email feels, the more suspicious you should be."
      },
      {
        q: "An email claims to be from your school IT department asking for your username and password to 'fix your account'. This is MOST LIKELY:",
        options: ["A legitimate request — IT needs your credentials to help you", "A phishing attack — IT staff never need your password", "A routine security check", "An automated system email"],
        answer: 1,
        explanation: "No legitimate IT professional or organization will ever ask for your password. They have backend access to fix accounts without needing your credentials. This is a classic social engineering trick.",
        tip: "Remember: Your password is YOUR secret. Not even your IT department should know it."
      },
      {
        q: "You get a text saying 'Congrats! You won a $500 gift card. Click to claim: bit.ly/claimprize99'. What should you do?",
        options: ["Click the link quickly before the offer expires", "Reply 'STOP' to unsubscribe", "Ignore and delete — this is a smishing (SMS phishing) attack", "Forward it to friends so they can claim prizes too"],
        answer: 2,
        explanation: "This is 'smishing' — phishing via SMS. Shortened URLs hide the real destination. Unsolicited prize messages are almost always scams designed to steal info or install malware.",
        tip: "If something sounds too good to be true — a prize you never entered — it's a scam."
      },
      {
        q: "What clues suggest an email might be phishing? (Choose the BEST answer)",
        options: ["The email has a company logo", "Urgency, misspellings, mismatched sender email, and suspicious links", "The email has a lot of images", "The email arrived on a weekend"],
        answer: 1,
        explanation: "Red flags include: fake urgency ('Act NOW!'), misspellings, sender email that doesn't match the company (e.g., support@netfl1x-help.com), and links that go to unexpected domains.",
        tip: "Hover over links (don't click!) to preview the actual URL destination."
      },
      {
        q: "What is 'vishing'?",
        options: ["Phishing through video calls", "Voice phishing — scam phone calls pretending to be trusted organizations", "A type of computer virus", "Phishing on gaming platforms"],
        answer: 1,
        explanation: "Vishing uses phone calls. Scammers impersonate banks, government agencies (like IRS/tax services), or tech support to extract personal info or money. Always verify by calling back on official numbers.",
        tip: "If someone calls you claiming urgency, hang up and call the organization back using their official number."
      },
      {
        q: "A hacker sends you a Facebook message pretending to be your friend, saying they're stranded and need money. How do you verify?",
        options: ["Send the money — it's an emergency!", "Call or text your friend directly using their phone number you already have", "Reply to the Facebook message asking for more details", "Send only half the money to be safe"],
        answer: 1,
        explanation: "Account hijacking is common. Hackers take over accounts and message all contacts with emergency stories. Always verify through a separate, trusted channel (phone call) before acting.",
        tip: "Scammers count on you acting fast without thinking. Always pause and verify independently."
      },
      {
        q: "What is a 'pretexting' attack?",
        options: ["Sending fake text messages", "Creating a fabricated scenario (pretext) to manipulate someone into revealing information", "Prefixing malware with innocent text", "A type of network attack"],
        answer: 1,
        explanation: "Pretexting involves making up a believable story to gain trust. For example, an attacker might impersonate a researcher, bank employee, or HR rep to get sensitive information.",
        tip: "Legitimate organizations won't call out of nowhere asking you to verify sensitive info."
      },
      {
        q: "You notice a link in an email reads 'www.paypa1.com' instead of 'www.paypal.com'. This technique is called:",
        options: ["Domain squatting", "Typosquatting / URL spoofing", "DNS poisoning", "Cross-site scripting"],
        answer: 1,
        explanation: "Typosquatting replaces characters with visually similar ones (l→1, o→0, rn→m). At a glance they look identical. Always check URLs carefully before entering credentials.",
        tip: "Look carefully at every character in a URL — especially on mobile where text is smaller."
      },
      {
        q: "After receiving a suspicious email, what's the BEST course of action?",
        options: ["Delete it and never think about it again", "Report it to your email provider as phishing AND alert your IT/school admin", "Reply to ask if it's really a scam", "Forward it to see what happens"],
        answer: 1,
        explanation: "Reporting phishing helps protect everyone. Email providers use reports to improve filters. Reporting to IT/school admins helps them warn others. Most email clients have a 'Report Phishing' button.",
        tip: "You might be the first to catch a phishing campaign — your report can protect hundreds of others."
      }
    ]
  },
  3: {
    title: "Networks, Privacy & Malware",
    label: "// CHAPTER 03 — ADVANCED",
    color: "var(--neon3)",
    questions: [
      {
        q: "You're at a coffee shop and see two Wi-Fi networks: 'CoffeeShopFree' and 'CoffeeShop_Official'. The staff says the official one is the second. Why is this important?",
        options: ["The first network has better speed", "The first could be a 'evil twin' fake hotspot set up by a hacker to intercept your traffic", "There's no difference between them", "The first is for employees only"],
        answer: 1,
        explanation: "An 'evil twin' is a fake Wi-Fi hotspot that mimics a legitimate one. When you connect, hackers can see all your unencrypted traffic, potentially stealing passwords and data. Always verify with staff.",
        tip: "On public Wi-Fi, use a VPN and avoid logging into sensitive accounts like banking."
      },
      {
        q: "What does a VPN (Virtual Private Network) do?",
        options: ["Makes your internet faster", "Encrypts your internet traffic and hides your IP address", "Blocks all ads", "Gives you free internet access"],
        answer: 1,
        explanation: "A VPN creates an encrypted tunnel for your internet traffic, making it unreadable to others on the network. It also masks your real IP address, adding privacy. Essential on public Wi-Fi.",
        tip: "Choose reputable paid VPNs — free VPNs often sell your data, defeating the purpose."
      },
      {
        q: "What is ransomware?",
        options: ["Software that speeds up your computer for a fee", "Malware that encrypts your files and demands payment to restore access", "A type of antivirus program", "Software that randomly deletes files"],
        answer: 1,
        explanation: "Ransomware encrypts your files so you can't access them, then demands a ransom (usually cryptocurrency) for the decryption key. Victims lose photos, documents, and more. Prevention: regular backups!",
        tip: "The 3-2-1 backup rule: 3 copies of data, on 2 different media, with 1 stored offsite."
      },
      {
        q: "You download a free game from an unofficial site. Shortly after, your computer gets slow and shows random ads. You likely have:",
        options: ["A hardware problem", "Adware or malware bundled with the fake software", "Too many browser tabs open", "A weak Wi-Fi signal"],
        answer: 1,
        explanation: "Malicious downloads often bundle adware, spyware, or trojans. Always download software from official sources. Free games from random sites are a common delivery method for malware.",
        tip: "Stick to official app stores and manufacturer websites for all software downloads."
      },
      {
        q: "What is 'HTTPS' and why does it matter when browsing?",
        options: ["A fast internet protocol", "An encrypted version of HTTP that protects data between your browser and the website", "A browser extension", "A type of firewall"],
        answer: 1,
        explanation: "HTTPS uses SSL/TLS encryption to protect data in transit. Without it (HTTP only), anyone on your network could read what you send — including passwords. Look for the padlock icon in your browser.",
        tip: "Never enter passwords on sites that show 'Not Secure' or lack the padlock icon."
      },
      {
        q: "What are 'cookies' in web browsing (the security context)?",
        options: ["Edible treats sent by websites", "Small data files stored by websites to remember your preferences and track activity", "Pop-up advertisements", "Cached images from websites"],
        answer: 1,
        explanation: "Cookies store session info, preferences, and tracking data. Third-party cookies from advertisers follow you across different websites to build a profile of your interests. You can manage or block them in settings.",
        tip: "Review cookie settings on sites you visit and periodically clear your browser cookies."
      },
      {
        q: "What's the difference between a virus and a trojan horse in malware terms?",
        options: ["There is no difference", "A virus self-replicates and spreads; a trojan disguises itself as legitimate software to trick you into installing it", "A trojan is more dangerous, a virus is harmless", "Trojans only affect Macs, viruses only affect Windows"],
        answer: 1,
        explanation: "Viruses attach to files and spread when those files are shared. Trojans appear as legitimate programs (games, tools) but contain hidden malicious code. Both cause serious harm but spread differently.",
        tip: "Keep your antivirus software updated — it knows the signatures of thousands of malware types."
      },
      {
        q: "You receive a pop-up that says 'VIRUS DETECTED! Call Microsoft Support at 1-800-XXX-XXXX immediately!' What should you do?",
        options: ["Call the number right away", "Close the browser tab — this is a 'scareware' social engineering scam", "Buy the antivirus they're selling", "Enter your credit card to remove the virus"],
        answer: 1,
        explanation: "This is 'scareware' — fake security alerts designed to scare you into calling scammers or buying fake software. Microsoft never contacts users this way. Close the tab (use Task Manager if needed).",
        tip: "Real security warnings come from your installed antivirus software — not random web pop-ups."
      },
      {
        q: "What is a 'firewall' and how does it protect you?",
        options: ["Physical barrier preventing fire from reaching servers", "Software/hardware that monitors and filters network traffic based on security rules", "A tool to encrypt your hard drive", "A backup system for your data"],
        answer: 1,
        explanation: "Firewalls act as gatekeepers, examining network traffic and blocking anything that doesn't meet security rules. They can stop unauthorized access to your device and block certain types of malware.",
        tip: "Keep your OS firewall turned on. Routers also have built-in firewalls for network protection."
      },
      {
        q: "Which practice BEST protects your privacy online over the long term?",
        options: ["Using the same email for everything to keep it simple", "Using unique emails per service, reviewing app permissions, using a VPN, and regularly updating software", "Keeping all social media profiles public so you 'have nothing to hide'", "Disabling automatic updates to avoid bugs"],
        answer: 1,
        explanation: "True privacy requires multiple layers: compartmentalizing accounts, minimal data sharing, strong access controls, encrypted connections, and keeping software updated to patch vulnerabilities.",
        tip: "Privacy isn't about hiding — it's about controlling who has access to your personal data."
      }
    ]
  }
};

// ========== STATE ==========
let currentChapter = null;
let currentQ = 0;
let score = 0;
let xp = 0;
let answered = false;

// ========== COUNTER ANIMATION ==========
function animateCounter(id, target, suffix = '') {
  let current = 0;
  const increment = Math.ceil(target / 60);
  const el = document.getElementById(id);
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = current.toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, 30);
}

window.addEventListener('load', () => {
  setTimeout(() => {
    animateCounter('counter-students', 12847);
    animateCounter('counter-questions', 30);
    animateCounter('counter-chapters', 3);
  }, 500);
});

// ========== QUIZ FUNCTIONS ==========
function scrollToChapters() {
  document.getElementById('chapters').scrollIntoView({ behavior: 'smooth' });
}

function openQuiz(chapter) {
  currentChapter = chapter;
  currentQ = 0;
  score = 0;
  xp = 0;
  answered = false;

  const data = quizData[chapter];
  const colors = { 1: 'var(--neon)', 2: 'var(--neon2)', 3: 'var(--neon3)' };

  document.getElementById('quizChapterLabel').textContent = data.label;
  document.getElementById('quizChapterLabel').style.color = colors[chapter];
  document.getElementById('quizTitle').textContent = data.title;
  document.getElementById('progressFill').style.background = colors[chapter];
  document.getElementById('xpFill').style.background = colors[chapter];
  document.getElementById('nextBtn').style.background = colors[chapter];

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

  // Tip
  const tipBox = document.getElementById('tipBox');
  if (q.tip) {
    tipBox.style.display = 'block';
    document.getElementById('tipText').textContent = q.tip;
  } else {
    tipBox.style.display = 'none';
  }

  // Options
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

  // Feedback
  const fb = document.getElementById('feedbackBox');
  fb.classList.remove('show', 'correct-fb', 'wrong-fb');

  // Progress
  const pct = (currentQ / data.questions.length) * 100;
  document.getElementById('progressFill').style.width = pct + '%';

  // Score
  document.getElementById('scoreDisplay').textContent = score;

  // Next btn
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
    document.getElementById('scoreDisplay').textContent = score;
    const xpPct = Math.min((xp / 500) * 100, 100);
    document.getElementById('xpFill').style.width = xpPct + '%';
    document.getElementById('xpCount').textContent = xp + ' XP';
  } else {
    btn.classList.add('wrong');
    allBtns[q.answer].classList.add('correct');
    fb.className = 'feedback-box show wrong-fb';
    fbTitle.textContent = '✗ NOT QUITE';
    fbText.textContent = q.explanation;
    xp += 10;
    document.getElementById('xpFill').style.width = Math.min((xp / 500) * 100, 100) + '%';
    document.getElementById('xpCount').textContent = xp + ' XP';
  }

  document.getElementById('nextBtn').classList.add('show');
}

function nextQuestion() {
  const data = quizData[currentChapter];
  currentQ++;

  if (currentQ >= data.questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  document.getElementById('quizBody').style.display = 'none';
  const results = document.getElementById('resultsScreen');
  results.classList.add('show');

  const data = quizData[currentChapter];
  const total = data.questions.length;
  const correct = score / 100;
  const wrong = total - correct;
  const pct = Math.round((correct / total) * 100);

  document.getElementById('progressFill').style.width = '100%';

  let icon, title, msg;
  if (pct >= 90) { icon = '🏆'; title = 'ELITE DEFENDER!'; msg = "Outstanding! You've mastered this chapter. You're thinking like a cybersecurity pro."; }
  else if (pct >= 70) { icon = '⚡'; title = 'GREAT WORK!'; msg = "You've got solid cybersecurity instincts. Review the questions you missed and try again for a perfect score!"; }
  else if (pct >= 50) { icon = '🛡️'; title = 'GOOD EFFORT!'; msg = "You're getting there! A few more reviews of the material and you'll be protecting yourself like a pro."; }
  else { icon = '🔄'; title = 'KEEP LEARNING!'; msg = "Cybersecurity takes practice. Review the chapter materials and try again — you've got this!"; }

  document.getElementById('resultsIcon').textContent = icon;
  document.getElementById('resultsTitle').textContent = title;
  document.getElementById('resultsScoreBig').textContent = pct + '%';
  document.getElementById('rbCorrect').textContent = correct;
  document.getElementById('rbWrong').textContent = wrong;
  document.getElementById('rbXP').textContent = xp;
  document.getElementById('resultsMessage').textContent = msg;
}

function retryQuiz() {
  openQuiz(currentChapter);
}

function closeQuiz() {
  document.getElementById('quizOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// Close on backdrop click
document.getElementById('quizOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeQuiz();
});

// Keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeQuiz();
  if (!answered && document.getElementById('quizOverlay').classList.contains('active')) {
    const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
    if (map[e.key] !== undefined) {
      const btns = document.querySelectorAll('.option-btn');
      if (btns[map[e.key]]) btns[map[e.key]].click();
    }
  }
});