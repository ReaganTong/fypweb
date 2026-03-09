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
let unlockedChapter = 1;
let totalPlayerXP = 0;

let currentChapter = null;
let currentQ = 0;
let score = 0;
let xp = 0;
let answered = false;

// ========== QUIZ DATA ==========
const quizData = {
  1: {
    title: "Passwords & Account Security",
    label: "// CHAPTER 01 — BEGINNER",
    color: "var(--neon)",
    questions: [
      { q: "You need to create a password for your school email. Which of these options is the MOST secure?", options: ["alex2008", "MySchoolEmail!", "T7#mP!2kLw@9xQ", "password123"], answer: 2, explanation: "A strong password uses a mix of uppercase, lowercase, numbers, and special characters, and is at least 12 characters long. 'T7#mP!2kLw@9xQ' meets all these criteria. Avoid names, years, and obvious words.", tip: "Think of a password like a lock — the more complex the combination, the harder to crack." },
      { q: "What does 2FA (Two-Factor Authentication) do to protect your account?", options: ["Makes your password twice as long", "Requires a second form of verification beyond your password", "Logs you in from two devices at once", "Stores two copies of your password"], answer: 1, explanation: "2FA adds a second layer of security. Even if someone steals your password, they still can't log in without the second factor (like a code sent to your phone or an authenticator app).", tip: "Always enable 2FA on important accounts like email, banking, and social media." },
      { q: "Your friend says they use the same password for every account because it's easy to remember. What's the BIGGEST risk?", options: ["Their accounts will load slower", "If one account is hacked, all accounts are at risk", "They might forget the password", "Nothing — it's a smart strategy"], answer: 1, explanation: "This is called 'credential stuffing'. Hackers take leaked passwords from one site and try them on others. If you reuse passwords, one breach could compromise ALL your accounts.", tip: "Use a password manager to generate and store unique passwords for every site." },
      { q: "Which of the following is the SAFEST place to store your passwords?", options: ["A sticky note on your monitor", "A text file called 'passwords.txt' on your desktop", "A trusted password manager app", "Your browser's basic autofill (no master password)"], answer: 2, explanation: "Password manager apps encrypt your passwords and require a master password. Sticky notes and unprotected files are easily seen by anyone with access to your computer.", tip: "Popular password managers include Bitwarden (free), 1Password, and Dashlane." },
      { q: "You get an alert: 'Your password was found in a data breach.' What should you do FIRST?", options: ["Ignore it — it's probably spam", "Change the password on that site immediately", "Delete your account", "Tell your friends about the breach"], answer: 1, explanation: "Change the compromised password immediately. Then check if you used that password anywhere else and change it there too. Use a site like haveibeenpwned.com to check your email.", tip: "Sites like HaveIBeenPwned let you check if your email appeared in any known data breaches." },
      { q: "What is a 'brute-force attack'?", options: ["Physically breaking into a server room", "A hacker guessing every possible password combination automatically", "Sending thousands of phishing emails", "Using a fake Wi-Fi hotspot"], answer: 1, explanation: "Brute-force attacks use automated tools to try millions of password combinations per second. Short, simple passwords can be cracked in seconds — complex, long ones take years.", tip: "Every extra character in a password dramatically increases the time needed to brute-force it." },
      { q: "A website you use was hacked and your hashed password was stolen. Why is hashing good?", options: ["It makes passwords invisible to everyone", "It converts passwords into a scrambled code that's hard to reverse", "It deletes passwords after 30 days", "It stores your password in two locations"], answer: 1, explanation: "Hashing is a one-way function — it converts your password into a fixed string of characters. Good websites never store your actual password, just the hash. Even if leaked, the original is hard to recover.", tip: "Websites using outdated hashing (like MD5) are more vulnerable. Strong algorithms include bcrypt." },
      { q: "Which is an example of a passphrase and why is it useful?", options: ["Xk!9#R2m", "correcthorsebatterystaple", "admin123", "JohnSmith1995"], answer: 1, explanation: "A passphrase uses multiple random words together. 'correcthorsebatterystaple' is long (28 chars), easy to remember, and much harder to crack than short complex passwords because of its length.", tip: "Length matters more than complexity. A 4-word passphrase beats a short jumble of symbols." },
      { q: "Your school account has been locked after too many failed login attempts. What likely happened?", options: ["You typed your password correctly too many times", "Someone attempted a brute-force or credential stuffing attack", "The school's internet went down", "Your account expired"], answer: 1, explanation: "Account lockouts are a security measure that triggers after multiple failed login attempts. This protects against automated brute-force attacks. Change your password and enable 2FA after unlocking.", tip: "Account lockouts are a feature, not a bug — they're protecting you!" },
      { q: "What is a 'dictionary attack'?", options: ["Looking up cybersecurity terms online", "An attack using common words and phrases as password guesses", "Stealing a physical dictionary", "Guessing every character combination randomly"], answer: 1, explanation: "Dictionary attacks use lists of common words, phrases, and passwords (like 'password', 'letmein', '123456') to guess login credentials. Avoid any real words or common phrases in passwords.", tip: "Millions of the most common passwords are compiled in lists hackers use for dictionary attacks." }
    ]
  },
  2: {
    title: "Phishing & Social Engineering",
    label: "// CHAPTER 02 — INTERMEDIATE",
    color: "var(--neon2)",
    questions: [
      { q: "You receive an email saying 'Your Netflix account has been suspended! Click here to verify your payment.' What should you do?", options: ["Click the link and enter your details", "Forward it to all your friends as a warning", "Go directly to Netflix.com in a new tab to check your account", "Reply asking for more information"], answer: 2, explanation: "Never click links in suspicious emails. Go directly to the website by typing the URL yourself. Phishing emails create fake urgency to trick you into clicking without thinking.", tip: "Legitimate companies never ask for your password via email." },
      { q: "What is 'spear phishing' different from regular phishing?", options: ["It uses fish-themed graphics", "It targets a specific person using their personal information", "It only happens on fishing websites", "It's a safer type of phishing"], answer: 1, explanation: "Spear phishing is highly targeted — attackers research the victim and personalize the message using real details (your name, employer, friends) to make it more convincing.", tip: "The more personal an unexpected email feels, the more suspicious you should be." },
      { q: "An email claims to be from your school IT department asking for your username and password to 'fix your account'. This is MOST LIKELY:", options: ["A legitimate request — IT needs your credentials to help you", "A phishing attack — IT staff never need your password", "A routine security check", "An automated system email"], answer: 1, explanation: "No legitimate IT professional or organization will ever ask for your password. They have backend access to fix accounts without needing your credentials. This is a classic social engineering trick.", tip: "Remember: Your password is YOUR secret. Not even your IT department should know it." },
      { q: "You get a text saying 'Congrats! You won a $500 gift card. Click to claim: bit.ly/claimprize99'. What should you do?", options: ["Click the link quickly before the offer expires", "Reply 'STOP' to unsubscribe", "Ignore and delete — this is a smishing (SMS phishing) attack", "Forward it to friends so they can claim prizes too"], answer: 2, explanation: "This is 'smishing' — phishing via SMS. Shortened URLs hide the real destination. Unsolicited prize messages are almost always scams designed to steal info or install malware.", tip: "If something sounds too good to be true — a prize you never entered — it's a scam." },
      { q: "What clues suggest an email might be phishing? (Choose the BEST answer)", options: ["The email has a company logo", "Urgency, misspellings, mismatched sender email, and suspicious links", "The email has a lot of images", "The email arrived on a weekend"], answer: 1, explanation: "Red flags include: fake urgency ('Act NOW!'), misspellings, sender email that doesn't match the company (e.g., support@netfl1x-help.com), and links that go to unexpected domains.", tip: "Hover over links (don't click!) to preview the actual URL destination." },
      { q: "What is 'vishing'?", options: ["Phishing through video calls", "Voice phishing — scam phone calls pretending to be trusted organizations", "A type of computer virus", "Phishing on gaming platforms"], answer: 1, explanation: "Vishing uses phone calls. Scammers impersonate banks, government agencies (like IRS/tax services), or tech support to extract personal info or money. Always verify by calling back on official numbers.", tip: "If someone calls you claiming urgency, hang up and call the organization back using their official number." },
      { q: "A hacker sends you a Facebook message pretending to be your friend, saying they're stranded and need money. How do you verify?", options: ["Send the money — it's an emergency!", "Call or text your friend directly using their phone number you already have", "Reply to the Facebook message asking for more details", "Send only half the money to be safe"], answer: 1, explanation: "Account hijacking is common. Hackers take over accounts and message all contacts with emergency stories. Always verify through a separate, trusted channel (phone call) before acting.", tip: "Scammers count on you acting fast without thinking. Always pause and verify independently." },
      { q: "What is a 'pretexting' attack?", options: ["Sending fake text messages", "Creating a fabricated scenario (pretext) to manipulate someone into revealing information", "Prefixing malware with innocent text", "A type of network attack"], answer: 1, explanation: "Pretexting involves making up a believable story to gain trust. For example, an attacker might impersonate a researcher, bank employee, or HR rep to get sensitive information.", tip: "Legitimate organizations won't call out of nowhere asking you to verify sensitive info." },
      { q: "You notice a link in an email reads 'www.paypa1.com' instead of 'www.paypal.com'. This technique is called:", options: ["Domain squatting", "Typosquatting / URL spoofing", "DNS poisoning", "Cross-site scripting"], answer: 1, explanation: "Typosquatting replaces characters with visually similar ones (l→1, o→0, rn→m). At a glance they look identical. Always check URLs carefully before entering credentials.", tip: "Look carefully at every character in a URL — especially on mobile where text is smaller." },
      { q: "After receiving a suspicious email, what's the BEST course of action?", options: ["Delete it and never think about it again", "Report it to your email provider as phishing AND alert your IT/school admin", "Reply to ask if it's really a scam", "Forward it to see what happens"], answer: 1, explanation: "Reporting phishing helps protect everyone. Email providers use reports to improve filters. Reporting to IT/school admins helps them warn others. Most email clients have a 'Report Phishing' button.", tip: "You might be the first to catch a phishing campaign — your report can protect hundreds of others." }
    ]
  },
  3: {
    title: "Networks, Privacy & Malware",
    label: "// CHAPTER 03 — ADVANCED",
    color: "var(--neon3)",
    questions: [
      { q: "You're at a coffee shop and see two Wi-Fi networks: 'CoffeeShopFree' and 'CoffeeShop_Official'. The staff says the official one is the second. Why is this important?", options: ["The first network has better speed", "The first could be a 'evil twin' fake hotspot set up by a hacker to intercept your traffic", "There's no difference between them", "The first is for employees only"], answer: 1, explanation: "An 'evil twin' is a fake Wi-Fi hotspot that mimics a legitimate one. When you connect, hackers can see all your unencrypted traffic, potentially stealing passwords and data. Always verify with staff.", tip: "On public Wi-Fi, use a VPN and avoid logging into sensitive accounts like banking." },
      { q: "What does a VPN (Virtual Private Network) do?", options: ["Makes your internet faster", "Encrypts your internet traffic and hides your IP address", "Blocks all ads", "Gives you free internet access"], answer: 1, explanation: "A VPN creates an encrypted tunnel for your internet traffic, making it unreadable to others on the network. It also masks your real IP address, adding privacy. Essential on public Wi-Fi.", tip: "Choose reputable paid VPNs — free VPNs often sell your data, defeating the purpose." },
      { q: "What is ransomware?", options: ["Software that speeds up your computer for a fee", "Malware that encrypts your files and demands payment to restore access", "A type of antivirus program", "Software that randomly deletes files"], answer: 1, explanation: "Ransomware encrypts your files so you can't access them, then demands a ransom (usually cryptocurrency) for the decryption key. Victims lose photos, documents, and more. Prevention: regular backups!", tip: "The 3-2-1 backup rule: 3 copies of data, on 2 different media, with 1 stored offsite." },
      { q: "You download a free game from an unofficial site. Shortly after, your computer gets slow and shows random ads. You likely have:", options: ["A hardware problem", "Adware or malware bundled with the fake software", "Too many browser tabs open", "A weak Wi-Fi signal"], answer: 1, explanation: "Malicious downloads often bundle adware, spyware, or trojans. Always download software from official sources. Free games from random sites are a common delivery method for malware.", tip: "Stick to official app stores and manufacturer websites for all software downloads." },
      { q: "What is 'HTTPS' and why does it matter when browsing?", options: ["A fast internet protocol", "An encrypted version of HTTP that protects data between your browser and the website", "A browser extension", "A type of firewall"], answer: 1, explanation: "HTTPS uses SSL/TLS encryption to protect data in transit. Without it (HTTP only), anyone on your network could read what you send — including passwords. Look for the padlock icon in your browser.", tip: "Never enter passwords on sites that show 'Not Secure' or lack the padlock icon." },
      { q: "What are 'cookies' in web browsing (the security context)?", options: ["Edible treats sent by websites", "Small data files stored by websites to remember your preferences and track activity", "Pop-up advertisements", "Cached images from websites"], answer: 1, explanation: "Cookies store session info, preferences, and tracking data. Third-party cookies from advertisers follow you across different websites to build a profile of your interests. You can manage or block them in settings.", tip: "Review cookie settings on sites you visit and periodically clear your browser cookies." },
      { q: "What's the difference between a virus and a trojan horse in malware terms?", options: ["There is no difference", "A virus self-replicates and spreads; a trojan disguises itself as legitimate software to trick you into installing it", "A trojan is more dangerous, a virus is harmless", "Trojans only affect Macs, viruses only affect Windows"], answer: 1, explanation: "Viruses attach to files and spread when those files are shared. Trojans appear as legitimate programs (games, tools) but contain hidden malicious code. Both cause serious harm but spread differently.", tip: "Keep your antivirus software updated — it knows the signatures of thousands of malware types." },
      { q: "You receive a pop-up that says 'VIRUS DETECTED! Call Microsoft Support at 1-800-XXX-XXXX immediately!' What should you do?", options: ["Call the number right away", "Close the browser tab — this is a 'scareware' social engineering scam", "Buy the antivirus they're selling", "Enter your credit card to remove the virus"], answer: 1, explanation: "This is 'scareware' — fake security alerts designed to scare you into calling scammers or buying fake software. Microsoft never contacts users this way. Close the tab (use Task Manager if needed).", tip: "Real security warnings come from your installed antivirus software — not random web pop-ups." },
      { q: "What is a 'firewall' and how does it protect you?", options: ["Physical barrier preventing fire from reaching servers", "Software/hardware that monitors and filters network traffic based on security rules", "A tool to encrypt your hard drive", "A backup system for your data"], answer: 1, explanation: "Firewalls act as gatekeepers, examining network traffic and blocking anything that doesn't meet security rules. They can stop unauthorized access to your device and block certain types of malware.", tip: "Keep your OS firewall turned on. Routers also have built-in firewalls for network protection." },
      { q: "Which practice BEST protects your privacy online over the long term?", options: ["Using the same email for everything to keep it simple", "Using unique emails per service, reviewing app permissions, using a VPN, and regularly updating software", "Keeping all social media profiles public so you 'have nothing to hide'", "Disabling automatic updates to avoid bugs"], answer: 1, explanation: "True privacy requires multiple layers: compartmentalizing accounts, minimal data sharing, strong access controls, encrypted connections, and keeping software updated to patch vulnerabilities.", tip: "Privacy isn't about hiding — it's about controlling who has access to your personal data." }
    ]
  },
  4: {
    title: "Social Media & Privacy",
    label: "// CHAPTER 04 — EXPERT",
    color: "var(--neon4)",
    questions: [
      { q: "You are going on a two-week family vacation. When is the safest time to post your vacation photos on Instagram/TikTok?", options: ["As soon as you arrive at the hotel", "Live-stream your daily activities", "Tag your location in every post", "After you have returned home"], answer: 3, explanation: "Posting while you are away announces to the world that your house is empty, which is a major security risk for burglary.", tip: "Enjoy the moment, post the memories later." },
      { q: "You download a free 'Flashlight' app, but it asks for permission to access your Contacts and Microphone. What should you do?", options: ["Allow it, apps need permissions to work", "Deny those permissions or uninstall the app", "Only allow Contacts, not Microphone", "Pay for the premium version"], answer: 1, explanation: "A flashlight app only needs access to your camera's flash. Apps asking for unrelated permissions are often harvesting and selling your personal data.", tip: "Always practice the 'Principle of Least Privilege' — only give apps exactly what they need." },
      { q: "Someone in a gaming Discord server starts harassing you and calling you names. What is the BEST response?", options: ["Insult them back to defend yourself", "Challenge them to a 1v1 match", "Block, report them to moderators, and ignore them", "Share their username on social media to cancel them"], answer: 2, explanation: "Engaging with cyberbullies or trolls usually escalates the situation. Blocking and reporting cuts off their access to you and alerts platform admins.", tip: "Don't feed the trolls. Your mental peace is more important than an online argument." },
      { q: "You see an influencer posting: 'Tag 3 friends and click the link in my bio to win a free PS5!' Why is this dangerous?", options: ["It's usually a scam to farm engagement and lead you to a phishing link", "The PS5 might be broken", "You might have to pay shipping", "There is no danger, it's just marketing"], answer: 0, explanation: "Scammers frequently hijack verified accounts or create fake ones to run fake giveaways. The link usually steals login credentials or installs malware.", tip: "If you have to click a shady link to claim a prize, you are the product." },
      { q: "What does it mean when experts say 'The internet is forever' regarding your Digital Footprint?", options: ["Servers never run out of power", "Deleted posts can still be saved via screenshots or archived by search engines", "Social media companies legally can't delete your account", "Your Wi-Fi history is saved forever"], answer: 1, explanation: "Once something is online, you lose control of it. Even if you delete a bad post or embarrassing photo, someone else may have already screenshotted it.", tip: "Before you post, ask yourself: 'Would I want a future employer or college admissions officer to see this?'" },
      { q: "You take a great selfie on your first day of school, but your school ID badge is clearly visible. What should you do?", options: ["Post it everywhere", "Blur or crop out the ID badge before posting", "Only post it on your public story", "Add a location tag so people know what school it is"], answer: 1, explanation: "School IDs often contain full names, barcodes, or student numbers. Posting this publicly exposes your identity and exact daily location to strangers.", tip: "Always review photos for sensitive background information before hitting send." },
      { q: "Why is it highly recommended to set your personal social media accounts (like Instagram or TikTok) to 'Private'?", options: ["It stops algorithms from showing you ads", "It gives you total control over who can view, save, and comment on your posts", "It makes your internet connection faster", "It prevents you from getting banned"], answer: 1, explanation: "Public accounts can be viewed by anyone, meaning your photos and data can be scraped by scammers or stalkers. A private account acts as a firewall for your personal life.", tip: "Your personal life isn't public property. Gatekeep your privacy." },
      { q: "You find a fun quiz app that asks you to 'Log in with Facebook/Google' to see your results. What is the risk?", options: ["The quiz might be boring", "You are giving a third-party app access to your profile data, contacts, and email", "It will log you out of your account", "It will change your password automatically"], answer: 1, explanation: "Using 'Single Sign-On' (SSO) is convenient, but shady apps use it to harvest your personal data. Always check what permissions the app is requesting before agreeing.", tip: "If you must use these apps, review and revoke third-party app access regularly in your account settings." },
      { q: "You love using the 'Check-in' feature or location stickers on Snapchat/Instagram every time you visit your favorite cafe. What is the danger?", options: ["You might run out of data", "It drains your battery faster", "It creates a predictable pattern of your daily routines for stalkers", "It costs money to use location features"], answer: 2, explanation: "Constantly broadcasting your real-time location creates a map of your habits. Malicious individuals can use this to know exactly where you are—and where you aren't.", tip: "Turn off precise location sharing for social media apps in your phone settings." },
      { q: "You see a viral video on TikTok of a politician or celebrity saying something incredibly offensive and out of character. What should you consider FIRST?", options: ["Share it immediately to spread awareness", "It might be an AI-generated 'Deepfake' designed to spread misinformation", "Leave an angry comment", "Assume it is 100% real because it's a video"], answer: 1, explanation: "Deepfakes use AI to manipulate audio and video, making it look like someone said or did something they didn't. Always verify shocking videos through multiple reliable news sources.", tip: "Seeing is no longer believing. Think critically and verify before you share." }
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
  if (pct >= 50) { 
      icon = '🏆'; 
      title = 'SECTOR SECURED!'; 
      msg = "Great work! You have successfully mastered this chapter."; 
      
      // Update Global XP safely without crashing
      totalPlayerXP += score;
      const navXpEl = document.getElementById('navXpCount');
      if(navXpEl) navXpEl.textContent = totalPlayerXP + " XP";

      // Unlock next chapter logic visually (Cap at Chapter 4)
      if (currentChapter === unlockedChapter && unlockedChapter < 4) {
          unlockedChapter++;
          const nextCard = document.getElementById(`chCard${unlockedChapter}`);
          if (nextCard) nextCard.classList.remove('locked');
      }

      // Safely save progress to Supabase
      if (supabaseClient) {
          try {
              await supabaseClient.from('game_scores').upsert({ session_id: sessionId, score: totalPlayerXP, level: unlockedChapter });
          } catch(e) { console.log("Offline mode: Score not saved to database."); }
      }

  } else { 
      icon = '🔄'; 
      title = 'KEEP LEARNING!'; 
      msg = "Cybersecurity takes practice. Review the chapter materials and try again."; 
  }

  document.getElementById('resultsIcon').textContent = icon;
  document.getElementById('resultsTitle').textContent = title;
  document.getElementById('resultsScoreBig').textContent = pct + '%';
  document.getElementById('rbCorrect').textContent = correct;
  document.getElementById('rbWrong').textContent = wrong;
  document.getElementById('rbXP').textContent = xp;
  document.getElementById('resultsMessage').textContent = msg;
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