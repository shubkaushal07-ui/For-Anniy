const chapterIds = [
  "chapter1", "chapter2", "chapter3",
  "chapter4", "chapter5", "chapter6"
];

const chapterNames = [
  "The Magical Entrance",
  "The Birthday Carnival",
  "The Friendship Arcade",
  "A Little Gallery",
  "The Secret Vault",
  "The Grand Finale"
];

const chapterEmojis = ["🌸", "🎂", "🎮", "📸", "🔐", "🌠"];
const STORAGE_KEY = "anniyBirthdayAdventure_v1";

let state = {
  unlocked: 1,
  completed: [],
  heartScore: 0,
  sound: false,
  music: false,
  quizWon: false
};

let toastTimer;
let typingTimer = null;
const $ = (id) => document.getElementById(id);

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && Number.isInteger(saved.unlocked)) {
      state.unlocked = Math.min(6, Math.max(1, saved.unlocked));
      state.completed = Array.isArray(saved.completed)
        ? saved.completed.filter(
            n => Number.isInteger(n) && n >= 1 && n <= 6
          )
        : [];
    }
  } catch (_) {}
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        unlocked: state.unlocked,
        completed: state.completed
      })
    );
  } catch (_) {}
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    el.classList.remove("show");
  }, 2600);
}

function showScreen(id) {
  const map = id === "chapterMap";

  if (!map && id !== "home") {
    const n = chapterIds.indexOf(id) + 1;

    if (n > state.unlocked) {
      toast("That chapter is still locked! Finish the previous chapter first 🔐");
      return;
    }
  }

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.toggle("active", screen.id === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (map) renderMap();
}

function completeChapter(n) {
  if (!state.completed.includes(n)) {
    state.completed.push(n);
  }

  state.unlocked = Math.max(
    state.unlocked,
    Math.min(6, n + 1)
  );

  saveState();
  updateProgress();
  renderMap();

  if (n < 6) {
    toast(
      `Chapter ${String(n).padStart(2, "0")} complete! Chapter ${String(n + 1).padStart(2, "0")} unlocked ✨`
    );

    showScreen(chapterIds[n]);
  } else {
    toast("Every chapter complete. The birthday magic is yours! 💗");
    showScreen("chapter6");
  }
}

function updateProgress() {
  $("progressText").textContent = `${state.completed.length} / 6`;

  $("progressBar").style.width =
    `${state.completed.length / 6 * 100}%`;

  chapterIds.forEach((id, i) => {
    const btn = $(id + "Complete");

    if (btn && state.completed.includes(i + 1)) {
      btn.disabled = false;
      btn.textContent = "Chapter completed ✓";
    }
  });
}

function renderMap() {
  const list = $("mapList");
  list.innerHTML = "";

  chapterIds.forEach((id, i) => {
    const n = i + 1;
    const unlocked = n <= state.unlocked;
    const done = state.completed.includes(n);

    const item = document.createElement("div");
    item.className = `map-item${unlocked ? "" : " locked"}`;

    item.innerHTML = `
      <span class="map-emoji">
        ${done ? "✅" : unlocked ? chapterEmojis[i] : "🔒"}
      </span>
      <div>
        <strong>Chapter ${String(n).padStart(2, "0")}: ${chapterNames[i]}</strong>
        <small>
          ${done ? "Completed" : unlocked ? "Ready to explore" : "Complete the previous chapter first"}
        </small>
      </div>
      <button ${unlocked ? "" : "disabled"} data-map-go="${id}">
        ${done ? "Replay" : unlocked ? "Open" : "Locked"}
      </button>
    `;

    list.appendChild(item);
  });
}

document.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-go]");

  if (nav) {
    showScreen(nav.dataset.go);
  }

  const mapBtn = e.target.closest("[data-map-go]");

  if (mapBtn && !mapBtn.disabled) {
    showScreen(mapBtn.dataset.mapGo);
  }
});

// CHAPTER 1: NICKNAME QUIZ
document.querySelectorAll("[data-answer]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-answer]").forEach(b => {
      b.classList.remove("selected");
    });

    btn.classList.add("selected");

    if (btn.dataset.answer === "right") {
      $("quizFeedback").textContent =
        "IDENTITY CONFIRMED. Welcome, Naekkeo. 🧸";

      $("chapter1Complete").disabled = false;
    } else {
      $("quizFeedback").textContent =
        "Hmm. The birthday bears request another attempt. 😂";
    }
  });
});

$("chapter1Complete").addEventListener("click", () => {
  completeChapter(1);
});

// CHAPTER 2: BIRTHDAY CARNIVAL
$("wishButton").addEventListener("click", () => {
  $("cake").classList.remove("pop");
  void $("cake").offsetWidth;
  $("cake").classList.add("pop");

  $("wishMessage").textContent =
    "Wish sent! ✨ The universe has received one (1) very important birthday request.";

  $("chapter2Complete").disabled = false;

  burstConfetti();
});

document.querySelectorAll("[data-energy]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-energy]").forEach(b => {
      b.classList.remove("selected");
    });

    btn.classList.add("selected");

    const messages = {
      soft: "Blanket, snacks, and bear hugs. Excellent choice. 🧸",
      chaos: "The confetti has filed a formal complaint. 💥",
      sparkle: "Sparkle levels have exceeded legal limits. ✨"
    };

    $("energyMessage").textContent = messages[btn.dataset.energy];
    $("chapter2Complete").disabled = false;
  });
});

$("chapter2Complete").addEventListener("click", () => {
  completeChapter(2);
});

// ================================
// CHAPTER 3: MINI GAMES 🎮💗
// ================================

// QUIZ GAME
document.querySelectorAll("[data-arcade]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-arcade]").forEach(b => {
      b.classList.remove("selected");
    });

    btn.classList.add("selected");

    if (btn.dataset.arcade === "right") {
      $("arcadeFeedback").textContent =
        "Correct! You have excellent birthday-website taste. 🏆";

      state.quizWon = true;
      checkArcadeCompletion();
    } else {
      state.quizWon = false;

      $("arcadeFeedback").textContent =
        "Incorrect. The bear is staring at you in disappointment. 🐻";

      $("chapter3Complete").disabled = true;
    }
  });
});


// CHECK IF BOTH GAMES ARE COMPLETED
function checkArcadeCompletion() {
  if (state.quizWon && state.heartScore >= 5) {
    $("chapter3Complete").disabled = false;
  } else {
    $("chapter3Complete").disabled = true;
  }
}


// MOVE HEART TO A RANDOM POSITION 💗
function moveHeartRandomly() {
  const game = $("heartGame");
  const heart = $("heartTarget");

  const padding = 8;

  // Keep the heart inside the game area
  const maxX = Math.max(
    padding,
    game.clientWidth - heart.offsetWidth - padding
  );

  const maxY = Math.max(
    padding,
    game.clientHeight - heart.offsetHeight - padding
  );

  const x = padding + Math.random() * Math.max(0, maxX - padding);
  const y = padding + Math.random() * Math.max(0, maxY - padding);

  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.transform = "none";
}


// CATCH HEART GAME 💕
function catchHeart() {
  // Stop when the player has caught all 5 hearts
  if (state.heartScore >= 5) return;

  // Increase the score
  state.heartScore++;

  $("heartScore").textContent = state.heartScore;

  // Change the heart emoji after each catch
  $("heartTarget").textContent =
    ["💗", "💖", "💕", "💘", "💝"][state.heartScore - 1];

  // If all 5 hearts are caught
  if (state.heartScore >= 5) {
    $("heartFeedback").textContent =
      "Heart collector badge unlocked! You are too powerful. 🏆";

    $("heartTarget").style.display = "none";
  } else {
    $("heartFeedback").textContent =
      `Nice catch! ${5 - state.heartScore} more to go.`;

    // Make the heart jump to a random position
    moveHeartRandomly();
  }

  // Check whether Chapter 3 can be completed
  checkArcadeCompletion();
}


// MAKE THE HEART CLICKABLE
$("heartTarget").addEventListener("click", catchHeart);


// RESET HEART GAME 🔄
$("resetHearts").addEventListener("click", () => {
  state.heartScore = 0;

  $("heartScore").textContent = "0";
  $("heartTarget").textContent = "💗";

  // Show the heart again
  $("heartTarget").style.display = "block";

  // Reset its position
  $("heartTarget").style.left = "50%";
  $("heartTarget").style.top = "50%";
  $("heartTarget").style.transform = "translate(-50%, -50%)";

  $("heartFeedback").textContent = "Ready, set, catch!";

  // Move it to a random position
  moveHeartRandomly();

  checkArcadeCompletion();
});


// COMPLETE CHAPTER 3
$("chapter3Complete").addEventListener("click", () => {
  completeChapter(3);
});

// CHAPTER 4: FRIENDSHIP MUSEUM
$("noteButton").addEventListener("click", () => {
  $("noteText").classList.add("show");
  $("noteButton").textContent = "Note opened 💗";
  $("chapter4Complete").disabled = false;
});

$("chapter4Complete").addEventListener("click", () => {
  completeChapter(4);
});

// CHAPTER 5: TYPING LETTER
const letterText = `Dear Anniy (aka Naekkeo), 🧸💗

HAPPIEST BIRTHDAYYYYY!! 🎂🎉💌

FIRST OF ALL, HOW DARE YOU GET OLDER AND EXPECT ME TO ACT NORMAL ABOUT IT?! 😭 Like excuse me, who gave you permission to have another birthday? Who authorised this level of ageing? I would like to speak to the management immediately. 🤨☝️

Okay, okay, jokes aside… HAPPY BIRTHDAY TO YOUUU!! 💗✨

Today is your day, and I genuinely hope it turns out to be as lovely, special, and wonderful as you deserve. I hope you get to smile so much that your cheeks hurt, laugh so hard that you forget what you were even laughing about, eat something delicious, receive the sweetest wishes, and make memories that you'll look back on with the biggest smile.

And honestly, I hope you know how lovely it is to have someone like you around. Everyone has their own little way of making the world feel different, and I hope you never underestimate the little things that make you YOU. Your personality, your humour, your random moments, your little quirks, and your own special brand of chaos are all part of what makes you such a memorable person. Never feel like you have to become someone else just to fit into somebody else's idea of who you should be. Being yourself is already something worth celebrating. 💗

I hope this new chapter of your life brings you countless reasons to smile. I hope you discover new things you love, try things you've always wanted to try, visit beautiful places, meet good people, and collect stories that you'll be telling for years. I hope some of your biggest wishes slowly turn into reality, even the ones you haven't told anyone about yet. And when life doesn't go exactly as planned, I hope you find the patience to keep going and the courage to give yourself another chance. 🌷✨

I also hope this year is gentle with you. Not every day has to be extraordinary, and not every moment has to be perfect. Sometimes, the best days are the quiet ones: listening to your favourite music, laughing at the most ridiculous thing imaginable, having a conversation that lasts longer than expected, watching the sky change colours, or simply enjoying a peaceful moment without worrying about everything else.

You deserve those little moments of happiness, too. Not just on your birthday, but on random Tuesdays, ordinary afternoons, sleepy mornings, and all the days when nobody is celebrating anything in particular. 🫶🏻

And please, for the love of everything adorable, NEVER let this world convince you that you have to be perfect to be appreciated. You are allowed to make mistakes. You're allowed to have bad days, change your mind, feel confused, take breaks, and figure things out at your own pace. You don't have to have your entire life planned out already. One step at a time is still progress, and growing into the person you want to become is a journey, not a competition. 💗

I hope you surround yourself with people who make you feel comfortable being yourself. People who listen when you speak, celebrate your little achievements, respect your boundaries, remember the things that matter to you, and make you laugh when you need it most. I hope you always find kindness in unexpected places and friendships that feel easy, safe, genuine, and full of silly memories.

And speaking of silly memories… please continue being your iconic self. 😭💀 The world has enough serious people already. We need more random conversations, ridiculous jokes, unnecessary drama over the smallest things, and moments where someone says something so stupid that everybody starts laughing again five minutes later.

Basically, keep being YOU. Keep your wonderful little personality, keep finding reasons to laugh, keep being curious about life, and keep collecting those tiny moments that somehow end up meaning the most.

Also, a very important birthday reminder:

YOU ARE OFFICIALLY REQUIRED TO HAVE A GOOD DAY TODAY. 🎂☝️

You must accept the birthday wishes. You must enjoy at least one delicious treat. You must smile at something silly. You must allow yourself to feel appreciated. And if anybody tries to make your birthday boring, I am afraid their application for friendship renewal will be placed under review. 😤💗

But genuinely, Anniy, thank you for being the person you are. Thank you for all the little things that make you memorable, for the moments of laughter, and for simply being someone worth appreciating. I hope the coming year gives you back some of the happiness, warmth, and kindness that you bring into the lives of others.

If I could wish a few things for you, I'd wish you a peaceful mind on difficult days, confidence when you doubt yourself, courage when something scares you, good people when you need company, and enough beautiful surprises to remind you that life can still be wonderfully unexpected.

I hope future-you looks back at this birthday and smiles, knowing that another year brought new experiences, new lessons, new memories, and more reasons to be proud of how far you've come.

So here's to another year of growing, laughing, learning, making questionable decisions that turn into funny stories, discovering new favourites, and becoming an even more wonderful version of yourself. Here's to birthday cake, little surprises, happy tears, ridiculous jokes, cosy moments, and all the adventures waiting just around the corner. 🧸🎀✨

And finally, if there's one thing I really want you to remember after reading this, it's this:

**You matter. Your happiness matters. Your dreams matter. And you deserve to experience plenty of good things, not because you have to earn them by being perfect, but simply because you're a person who deserves kindness and care.**

Never forget to give yourself the same patience and understanding that you give to other people. Be proud of your little achievements, forgive yourself for the things you're still learning, and remember that even on ordinary days, there are still reasons to smile.

I hope your birthday is filled with warmth, laughter, lovely surprises, and people who make you feel appreciated. I hope this next year is kinder, brighter, and full of moments that make you think, "Yeah, life can actually be pretty wonderful sometimes." 💗

HAPPIEST BIRTHDAY ONCE AGAIN, ANNIY AKA NAEKKEO!! 🎂💌

Now go and enjoy your special day, birthday human. Eat your cake, collect your wishes, take your pictures, laugh at absolutely everything, and make the most of being today's main character.

Stay happy. Stay healthy. Stay wonderfully weird. Keep shining in your own way, and please never stop being iconic. 😭🫶🏻

Sending you a giant bundle of friendship, birthday wishes, imaginary bear hugs, an unreasonable number of tiny hearts, and enough birthday magic to last the entire year. 🧸💗🎀✨

With lots of friendship, endless birthday wishes, and a little bit of certified nonsense,

Your friend,  
who clearly spent WAY too long writing this instead of behaving normally. 💌😭💗
`;

let letterOpened = false;


$("envelope").addEventListener("click", () => {
  if (letterOpened) return;

  letterOpened = true;

  const envelope = $("envelope");
  const output = $("letter");

  // Reset the letter
  output.textContent = "";
  output.classList.remove("emerging", "typing");

  // Keep the envelope's child elements intact!
  // Do not use envelope.textContent = "💗" here.

  if (typingTimer) {
    clearInterval(typingTimer);
    typingTimer = null;
  }

  // STEP 1: Shake the closed envelope
  envelope.classList.add("opening");

  setTimeout(() => {
    // STEP 2: Open the flap
    envelope.classList.remove("opening");
    envelope.classList.add("opened");

    // STEP 3: Wait for the paper to slide out
    setTimeout(() => {
      output.classList.add("emerging");

      // STEP 4: Start typing after the letter appears
      setTimeout(() => {
        output.classList.add("typing");

        let i = 0;

        typingTimer = setInterval(() => {
          output.textContent += letterText[i] || "";
          i++;

          // STEP 5: Finish the letter
          if (i >= letterText.length) {
            clearInterval(typingTimer);
            typingTimer = null;

            output.classList.remove("typing");
            $("chapter5Complete").disabled = false;

            toast("A little birthday magic, just for you 💗");
          }
        }, 18);

      }, 300);

    }, 850);

  }, 450);
});


$("secretButton").addEventListener("click", () => {
  if ($("secretInput").value.trim().toLowerCase() === "naekkeo") {
    $("secretFeedback").textContent =
      "Vault password accepted! You found a bonus heart. 💗";
    burstConfetti();
  } else {
    $("secretFeedback").textContent =
      "Not quite! Check the hint and try again. 🔎";
  }
});

$("secretInput").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    $("secretButton").click();
  }
});

$("chapter5Complete").addEventListener("click", () => {
  completeChapter(5);
});
    burstConfetti();
{
    $("secretFeedback").textContent =
      "Not quite! Check the hint and try again. 🔎";
  }
;

$("secretInput").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    $("secretButton").click();
  }
});

$("chapter5Complete").addEventListener("click", () => {
  completeChapter(5);
});

// CHAPTER 6: GRAND FINALE
$("openGift").addEventListener("click", () => {
  $("giftBox").textContent = "🎊";
  $("finaleTitle").textContent = "SURPRISE, NAEKKEO!!";

  $("finaleText").textContent =
    "You completed every chapter. The bears are cheering for you.";

  $("finaleMessage").classList.remove("hidden");
  $("openGift").textContent = "Gift opened ✓";
  $("openGift").disabled = true;

  burstConfetti();
  completeChapter(6);
});

// RESTART THE ADVENTURE
$("restartButton").addEventListener("click", () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}

  if (typingTimer) {
    clearInterval(typingTimer);
    typingTimer = null;
  }

  state = {
    unlocked: 1,
    completed: [],
    heartScore: 0,
    sound: false,
    music: false,
    quizWon: false
  };

  letterOpened = false;

  [
    "chapter1Complete",
    "chapter2Complete",
    "chapter3Complete",
    "chapter4Complete",
    "chapter5Complete"
  ].forEach(id => {
    $(id).disabled = true;
  });

  $("wishMessage").textContent = "";
  $("energyMessage").textContent = "";
  $("arcadeFeedback").textContent = "";
  $("heartFeedback").textContent = "";
  $("quizFeedback").textContent = "";
  $("secretFeedback").textContent = "";
  $("secretInput").value = "";

  document.querySelectorAll(".choice").forEach(btn => {
    btn.classList.remove("selected");
  });

  $("heartScore").textContent = "0";
  $("heartTarget").textContent = "💗";

  $("noteText").classList.remove("show");
  $("noteButton").textContent = "Open a note";

  $("letter").textContent = "";
  $("envelope").innerHTML = "💌<span>Tap to open</span>";

  $("finaleMessage").classList.add("hidden");
  $("openGift").disabled = false;
  $("openGift").textContent = "Open the final gift 🎀";
  $("giftBox").textContent = "🎁";
  $("finaleTitle").textContent = "The last surprise is waiting…";
  $("finaleText").textContent =
    "Tap the gift to open your birthday message.";

  updateProgress();
  renderMap();
  showScreen("home");

  toast("Adventure reset. Ready for another round? 💗");
});

// CONFETTI EFFECT
function burstConfetti() {
  const symbols = ["💗", "✨", "🌸", "🎉", "🧸"];

  for (let i = 0; i < 18; i++) {
    const el = document.createElement("span");

    el.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    Object.assign(el.style, {
      position: "fixed",
      left: Math.random() * 100 + "vw",
      top: "-30px",
      zIndex: 50,
      pointerEvents: "none",
      fontSize: (16 + Math.random() * 18) + "px",
      transition: "transform 2s ease-in, opacity 2s ease",
      opacity: "1"
    });

    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform =
        `translate(${(Math.random() - 0.5) * 150}px, ${window.innerHeight + 80}px) rotate(${Math.random() * 540}deg)`;

      el.style.opacity = "0";
    });

    setTimeout(() => el.remove(), 2200);
  }
}

// MUSIC BUTTON — add an audio file to enable actual music
$("musicToggle").addEventListener("click", () => {
  toast("The music player needs an audio file before it can play music 🎵");
});

// SOUND PREFERENCE BUTTON
$("soundToggle").addEventListener("click", () => {
  state.sound = !state.sound;

  $("soundLabel").textContent =
    state.sound ? "Sounds: on" : "Sounds: off";

  $("soundToggle").setAttribute(
    "aria-pressed",
    String(state.sound)
  );

  toast(
    state.sound
      ? "Sound effects preference enabled 🔔"
      : "Sound effects off."
  );
});

// INITIALISE WEBSITE
loadState();
updateProgress();
renderMap();