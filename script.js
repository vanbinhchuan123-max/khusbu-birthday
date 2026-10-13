const scenes = [...document.querySelectorAll(".scene")];
const dots = [...document.querySelectorAll(".progress-dot")];
let currentScene = 1;
let magicInterval = null;

// Birthday music: the browser may block autoplay, so start it from a real tap.
const birthdayMusic = document.getElementById("birthdayMusic");
const musicButton = document.getElementById("musicButton");
const musicStatus = document.getElementById("musicStatus");

async function startBirthdayMusic() {
  if (!birthdayMusic) return;
  try {
    await birthdayMusic.play();
    if (musicButton) {
      musicButton.textContent = "🔇 Pause birthday music";
      musicButton.setAttribute("aria-pressed", "true");
    }
    if (musicStatus) musicStatus.textContent = "Playing softly just for you ♡";
  } catch (error) {
    if (musicStatus) musicStatus.textContent = "Tap the music button to start ♡";
    console.warn("Music playback was blocked or the audio file could not load.", error);
  }
}

function pauseBirthdayMusic() {
  if (!birthdayMusic) return;
  birthdayMusic.pause();
  if (musicButton) {
    musicButton.textContent = "🎵 Play birthday music";
    musicButton.setAttribute("aria-pressed", "false");
  }
  if (musicStatus) musicStatus.textContent = "A little melody for you ♡";
}

if (musicButton && birthdayMusic) {
  musicButton.addEventListener("click", async () => {
    if (birthdayMusic.paused) await startBirthdayMusic();
    else pauseBirthdayMusic();
  });
}

function showScene(number) {
  currentScene = number;
  scenes.forEach((scene, index) => {
    scene.classList.toggle("active", index === number - 1);
  });
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === number - 1);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (number === 5) {
    burstMagic(18);
  }
}

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => showScene(Number(button.dataset.next)));
});

document.querySelectorAll("[data-prev]").forEach(button => {
  button.addEventListener("click", () => showScene(Number(button.dataset.prev)));
});

// Create a gentle star field.
const sparkleField = document.getElementById("sparkleField");
for (let i = 0; i < 55; i++) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.textContent = Math.random() > 0.5 ? "✦" : "✧";
  sparkle.style.left = Math.random() * 100 + "vw";
  sparkle.style.top = Math.random() * 100 + "vh";
  sparkle.style.fontSize = (7 + Math.random() * 15) + "px";
  sparkle.style.animationDelay = (Math.random() * 4) + "s";
  sparkleField.appendChild(sparkle);
}

// Envelope opens on touch or click.
const envelopeButton = document.getElementById("envelopeButton");
const envelopeNext = document.getElementById("envelopeNext");
const envelopeHint = document.getElementById("envelopeHint");

envelopeButton.addEventListener("click", () => {
  // Tapping the envelope is a user gesture, so try to start music here too.
  startBirthdayMusic();
  envelopeButton.classList.add("open");
  envelopeHint.textContent = "A little love is waiting inside ♡";
  envelopeNext.hidden = false;
  burstMagic(12);
});

// Floating hearts and stars.
function createFloatingItem(symbol) {
  const item = document.createElement("span");
  item.className = "floating-item";
  const choices = ["♡", "💗", "💖", "✨", "⭐", "✧"];
  item.textContent = symbol || choices[Math.floor(Math.random() * choices.length)];
  item.style.left = Math.random() * 100 + "vw";
  item.style.fontSize = (18 + Math.random() * 22) + "px";
  item.style.animationDuration = (4 + Math.random() * 4) + "s";
  document.getElementById("floatingField").appendChild(item);
  setTimeout(() => item.remove(), 8500);
}

setInterval(() => createFloatingItem(), 850);

function burstMagic(amount = 24) {
  for (let i = 0; i < amount; i++) {
    setTimeout(() => createFloatingItem(), i * 70);
  }
}

// Tap the wish button to release a bigger burst.
document.getElementById("wishButton").addEventListener("click", () => {
  burstMagic(65);
  const button = document.getElementById("wishButton");
  button.textContent = "Your wish is on its way ♡";
  button.disabled = true;
  setTimeout(() => {
    button.textContent = "Release the magic ✨";
    button.disabled = false;
  }, 2600);
});

// Add a tiny heart where the visitor taps, except on buttons.
document.addEventListener("click", event => {
  if (event.target.closest("button")) return;
  const heart = document.createElement("span");
  heart.className = "floating-item";
  heart.textContent = "💗";
  heart.style.left = Math.min(event.clientX, window.innerWidth - 28) + "px";
  heart.style.bottom = (window.innerHeight - event.clientY) + "px";
  heart.style.animationDuration = "2.4s";
  document.getElementById("floatingField").appendChild(heart);
  setTimeout(() => heart.remove(), 2600);
});

// Replay from the beginning.
document.getElementById("replayButton").addEventListener("click", () => {
  envelopeButton.classList.remove("open");
  envelopeNext.hidden = true;
  envelopeHint.textContent = "Tap the envelope to open it ✨";
  showScene(1);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
