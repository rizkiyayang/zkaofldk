const API = {
  leaderboard: "/api/uas-leaderboard",
  start: "/api/uas-start",
  status: "/api/uas-status",
  submit: "/api/uas-submit",
};

// Edit soal dummy di sini. Kalau jawaban benar diubah, samakan juga di
// /server/uas-quiz.mjs supaya scoring server tetap benar.
const QUIZ_QUESTIONS = [
  {
    id: "map-bind",
    type: "image",
    badge: "Tebak Map",
    title: "Map apa ini dari potongan screenshot?",
    description: "Yang kelihatan sengaja cuma secuil biar tidak terlalu gratis.",
    image: "../img/bind.avif",
    imageClass: "crop-map",
    revealText: "Full screenshot kebuka setelah kamu pilih jawaban.",
    choices: ["Bind", "Haven", "Abyss", "Sunset"],
  },
  {
    id: "sage-ulti",
    badge: "Tebak Skill",
    title: "Skill ultimate Sage yang bisa balikin teman hidup namanya apa?",
    description: "Kalau dipakai pas teman baru mati di depan mata, biasanya panik dulu.",
    choices: ["Resurrection", "Healing Orb", "Barrier Orb", "Slow Orb"],
  },
  {
    id: "omen-skill-name",
    badge: "Nama Skill",
    title: "Smoke bulat milik Omen itu nama skill-nya apa?",
    description: "Bukan cuma asap, ini penyelamat kalau entry-nya ragu.",
    choices: ["Dark Cover", "Paranoia", "Shrouded Step", "From the Shadows"],
  },
  {
    id: "weapon-vandal",
    type: "image",
    badge: "Tebak Senjata",
    title: "Senjata apa dari potongan gambar ini?",
    description: "Potongannya kecil, tapi recoil-nya tetap berasa.",
    image: "../img/vandal.avif",
    imageClass: "crop-weapon",
    revealText: "Gambar full senjata muncul setelah jawab.",
    choices: ["Vandal", "Phantom", "Bulldog", "Guardian"],
  },
  {
    id: "trailblazer-owner",
    badge: "Skillnya Siapa",
    title: "Trailblazer itu skill milik agent siapa?",
    description: "Kalau kena stun, biasanya langsung salahin ping.",
    choices: ["Skye", "Fade", "Gekko", "Breach"],
  },
  {
    id: "skin-prime",
    badge: "Tebak Skin",
    title: "Skin line yang punya finisher serigala emas dan suara tembakan clean banget?",
    description: "Dummy dulu, nanti bisa kamu ganti pakai gambar skin asli.",
    choices: ["Prime Vandal", "Reaver Vandal", "Oni Phantom", "RGX Vandal"],
  },
  {
    id: "voice-chamber",
    badge: "Voice Line",
    title: "\"You want to play? Let's play.\" Itu ulti siapa?",
    description: "Kalau dengar ini, biasanya langsung cari tembok.",
    choices: ["Chamber", "Jett", "Reyna", "Phoenix"],
  },
  {
    id: "blend-yoru",
    type: "agent-blend",
    badge: "Tebak Agent Susah",
    title: "Agent utama di gambar gabungan ini siapa?",
    description: "Soal akhir bobotnya gede. Jangan ketipu warna dan siluet.",
    images: ["../img/omen.avif", "../img/yoru.avif", "../img/sage.avif"],
    revealImage: "../img/yoru.avif",
    revealText: "Agent full muncul setelah kamu lock jawaban.",
    choices: ["Yoru", "Omen", "Sage", "Iso"],
  },
  {
    id: "blend-clove",
    type: "agent-blend",
    badge: "Tebak Agent Susah",
    title: "Ini campuran beberapa agent. Yang dimaksud siapa?",
    description: "Kalau ragu, percaya insting controller kamu.",
    images: ["../img/viper.avif", "../img/clove.avif", "../img/killjoy.avif"],
    revealImage: "../img/clove.avif",
    revealText: "Agent full muncul setelah kamu pilih jawaban.",
    choices: ["Clove", "Viper", "Killjoy", "Fade"],
  },
  {
    id: "blend-gekko",
    type: "agent-blend",
    badge: "Tebak Agent Susah",
    title: "Siapa agent yang disembunyikan di blend terakhir?",
    description: "Ini soal penentu. Salah dikit bisa turun rank.",
    images: ["../img/raze.avif", "../img/gekko.avif", "../img/neon.avif"],
    revealImage: "../img/gekko.avif",
    revealText: "Agent full muncul setelah kamu jawab.",
    choices: ["Gekko", "Raze", "Neon", "Phoenix"],
  },
];

const SAMPLE_LEADERBOARD = [
  {
    name: "cokelatmanis",
    score: 97,
    rank: "Immortal",
    duration_seconds: 352,
  },
  {
    name: "yoru enjoyer",
    score: 89,
    rank: "Diamond",
    duration_seconds: 420,
  },
  {
    name: "flash sendiri",
    score: 63,
    rank: "Gold",
    duration_seconds: 510,
  },
];

const state = {
  answers: {},
  current: 0,
  email: "",
  orderId: "",
  quizToken: "",
};

const elements = {
  amountInput: document.getElementById("amountInput"),
  checkPayment: document.getElementById("checkPayment"),
  emailInput: document.getElementById("emailInput"),
  examPanel: document.getElementById("examPanel"),
  introPanel: document.getElementById("introPanel"),
  leaderboard: document.getElementById("leaderboard"),
  leaderboardPanel: document.getElementById("leaderboardPanel"),
  localPreview: document.getElementById("localPreview"),
  nameInput: document.getElementById("nameInput"),
  nextQuestion: document.getElementById("nextQuestion"),
  openStart: document.getElementById("openStart"),
  paymentInstructions: document.getElementById("paymentInstructions"),
  paymentMessage: document.getElementById("paymentMessage"),
  paymentPanel: document.getElementById("paymentPanel"),
  paymentStatus: document.getElementById("paymentStatus"),
  prevQuestion: document.getElementById("prevQuestion"),
  progressPill: document.getElementById("progressPill"),
  questionCard: document.getElementById("questionCard"),
  refreshLeaderboard: document.getElementById("refreshLeaderboard"),
  resultPanel: document.getElementById("resultPanel"),
  startForm: document.getElementById("startForm"),
  startMessage: document.getElementById("startMessage"),
  startPanel: document.getElementById("startForm"),
  submitExam: document.getElementById("submitExam"),
};

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatDuration(seconds) {
  if (!seconds) return "-";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}m ${String(rest).padStart(2, "0")}d`;
}

function isLocalPreview() {
  return ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
}

async function readResponseJson(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: response.ok
        ? ""
        : "API backend belum aktif di server ini. Di Vercel akan aktif setelah env var diisi.",
    };
  }
}

function renderLeaderboard(rows = SAMPLE_LEADERBOARD) {
  const list = rows.length ? rows : SAMPLE_LEADERBOARD;

  elements.leaderboard.innerHTML = list
    .map(
      (row, index) => `
        <div class="leaderboard-row">
          <div class="leaderboard-position">${index + 1}</div>
          <div class="leaderboard-name">
            <strong>${row.name || "Anonim"}</strong>
            <span>${row.rank || "Iron"} • ${formatDuration(row.duration_seconds)}</span>
          </div>
          <div class="leaderboard-score">
            <strong>${row.score || 0}</strong>
            <span>nilai</span>
          </div>
        </div>
      `,
    )
    .join("");
}

async function loadLeaderboard() {
  elements.leaderboard.innerHTML = '<div class="loading-row">Memuat highscore...</div>';

  try {
    const response = await fetch(API.leaderboard);
    const data = await readResponseJson(response);

    if (!response.ok) throw new Error(data.message || "Gagal memuat highscore");

    renderLeaderboard(data.leaderboard);
  } catch {
    renderLeaderboard(SAMPLE_LEADERBOARD);
  }
}

function selectedChannel() {
  return new FormData(elements.startForm).get("channel") || "qris";
}

function setStartMessage(text, isError = false) {
  elements.startMessage.textContent = text;
  elements.startMessage.style.color = isError ? "#d92d67" : "";
}

function setPaymentMessage(text, isError = false) {
  elements.paymentMessage.textContent = text;
  elements.paymentMessage.style.color = isError ? "#d92d67" : "";
}

function renderPayment(payment, amount) {
  const qr = payment.qrImageUrl
    ? `
      <div class="payment-qr">
        <img src="${payment.qrImageUrl}" alt="QRIS pembayaran UAS Valorant" />
      </div>
    `
    : "";

  const va = payment.vaNumber
    ? `
      <div class="payment-line">
        <span>${(payment.acquirer || "VA").toUpperCase()}</span>
        <strong>${payment.vaNumber}</strong>
      </div>
    `
    : "";

  elements.paymentInstructions.innerHTML = `
    <div class="payment-box">
      ${qr}
      ${va}
      <div class="payment-line">
        <span>Order ID</span>
        <strong>${payment.orderId || state.orderId}</strong>
      </div>
      <div class="payment-line">
        <span>Nominal</span>
        <strong>${formatRupiah(amount)}</strong>
      </div>
    </div>
  `;
}

elements.startForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = elements.nameInput.value.trim();
  const email = elements.emailInput.value.trim();
  const amount = Number(elements.amountInput.value || 0);
  const channel = selectedChannel();

  if (!name || !email || amount < 10000) {
    setStartMessage("Nama, email, dan donasi minimal 10k wajib diisi.", true);
    return;
  }

  const submitButton = elements.startForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  setStartMessage("Membuat checkout...");

  try {
    const response = await fetch(API.start, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        channel,
        email,
        name,
      }),
    });
    const data = await readResponseJson(response);

    if (!response.ok) throw new Error(data.message || "Checkout gagal dibuat");

    state.email = email;
    state.orderId = data.orderId;
    elements.startPanel.classList.add("hidden");
    elements.paymentPanel.classList.remove("hidden");
    elements.paymentStatus.textContent = data.status || "pending";
    renderPayment(data.payment, amount);
    setStartMessage("Checkout siap. Selesaikan pembayaran dulu ya.");
    setPaymentMessage("Klik cek status setelah bayar. Sistem juga menerima webhook Midtrans otomatis.");
    elements.paymentPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    setStartMessage(error.message, true);

    if (isLocalPreview()) {
      elements.startPanel.classList.add("hidden");
      elements.paymentPanel.classList.remove("hidden");
      elements.localPreview.classList.remove("hidden");
      elements.paymentInstructions.innerHTML = `
        <div class="payment-box">
          <div class="payment-line">
            <span>Preview lokal</span>
            <strong>API Vercel belum aktif di server lokal ini.</strong>
          </div>
        </div>
      `;
      setPaymentMessage("Mode preview hanya muncul di localhost supaya layout kuis bisa dicek.", true);
    }
  } finally {
    submitButton.disabled = false;
  }
});

async function checkPaymentStatus() {
  if (!state.orderId || !state.email) {
    setPaymentMessage("Order belum dibuat.", true);
    return;
  }

  elements.checkPayment.disabled = true;
  setPaymentMessage("Mengecek status pembayaran...");

  try {
    const response = await fetch(API.status, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: state.email,
        orderId: state.orderId,
      }),
    });
    const data = await readResponseJson(response);

    if (!response.ok) throw new Error(data.message || "Status belum bisa dicek");

    elements.paymentStatus.textContent = data.status;

    if (data.paid && data.quizToken) {
      unlockQuiz(data.quizToken);
      return;
    }

    setPaymentMessage("Belum lunas. Kalau baru bayar, tunggu beberapa detik lalu cek lagi.");
  } catch (error) {
    setPaymentMessage(error.message, true);
  } finally {
    elements.checkPayment.disabled = false;
  }
}

elements.checkPayment.addEventListener("click", checkPaymentStatus);

elements.localPreview.addEventListener("click", () => {
  unlockQuiz("local-preview");
});

elements.openStart.addEventListener("click", () => {
  elements.introPanel.classList.add("hidden");
  elements.leaderboardPanel.classList.add("hidden");
  elements.startPanel.classList.remove("hidden");
  elements.nameInput.focus();
  elements.startPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

function questionMedia(question, answered) {
  if (!question.type) return "";

  const revealedClass = answered ? "is-revealed" : "";

  if (question.type === "agent-blend") {
    return `
      <div class="question-media agent-blend ${revealedClass}">
        ${question.images
          .map(
            (src) => `<img src="${src}" alt="" decoding="async" loading="lazy" />`,
          )
          .join("")}
        <img class="reveal-agent" src="${question.revealImage}" alt="" decoding="async" loading="lazy" />
      </div>
    `;
  }

  return `
    <div class="question-media ${revealedClass}">
      <img class="${answered ? "" : question.imageClass || ""}" src="${question.image}" alt="" decoding="async" loading="lazy" />
    </div>
  `;
}

function renderQuestion() {
  const question = QUIZ_QUESTIONS[state.current];
  const selected = state.answers[question.id];
  const answered = Boolean(selected);

  elements.progressPill.textContent = `${state.current + 1}/${QUIZ_QUESTIONS.length}`;
  elements.questionCard.innerHTML = `
    ${questionMedia(question, answered)}
    <p class="question-meta">${question.badge}</p>
    <h3 class="question-title">${question.title}</h3>
    <p class="question-copy">${question.description}</p>
    <div class="choice-list">
      ${question.choices
        .map(
          (choice) => `
            <button class="choice-button ${choice === selected ? "is-selected" : ""}" data-answer="${choice}" type="button">
              ${choice}
            </button>
          `,
        )
        .join("")}
    </div>
    ${
      answered && question.revealText
        ? `<div class="reveal-note">${question.revealText}</div>`
        : ""
    }
  `;

  elements.prevQuestion.disabled = state.current === 0;
  elements.nextQuestion.classList.toggle(
    "hidden",
    state.current === QUIZ_QUESTIONS.length - 1,
  );
  elements.submitExam.classList.toggle(
    "hidden",
    state.current !== QUIZ_QUESTIONS.length - 1,
  );
  elements.submitExam.disabled =
    Object.keys(state.answers).length !== QUIZ_QUESTIONS.length;

  elements.questionCard.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.answers[question.id] = button.dataset.answer;
      renderQuestion();
    });
  });
}

function unlockQuiz(token) {
  state.quizToken = token;
  elements.startPanel.classList.add("hidden");
  elements.paymentPanel.classList.add("hidden");
  elements.examPanel.classList.remove("hidden");
  renderQuestion();
  elements.examPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

elements.prevQuestion.addEventListener("click", () => {
  state.current = Math.max(0, state.current - 1);
  renderQuestion();
});

elements.nextQuestion.addEventListener("click", () => {
  state.current = Math.min(QUIZ_QUESTIONS.length - 1, state.current + 1);
  renderQuestion();
});

function renderResult(result) {
  elements.examPanel.classList.add("hidden");
  elements.resultPanel.classList.remove("hidden");
  elements.resultPanel.innerHTML = `
    <p class="eyebrow">Hasil UAS</p>
    <h2>Rank kamu: ${result.rank}</h2>
    <div class="result-score">
      <div>
        <strong>${result.score}</strong>
        <span>nilai</span>
      </div>
    </div>
    <p class="hero-copy" style="margin-left:auto;margin-right:auto">
      Raw score ${result.rawScore}/${result.maxRawScore}. Waktu pengerjaan ${formatDuration(result.durationSeconds)}.
    </p>
    <div class="answer-review">
      ${(result.resultDetail || [])
        .map(
          (item, index) => `
            <div class="review-row">
              <strong>${index + 1}. ${item.correct ? "Benar" : "Salah"}</strong>
              • jawaban kamu: ${item.answer || "-"} • kunci: ${item.correctAnswer}
            </div>
          `,
        )
        .join("")}
    </div>
  `;
  elements.resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

elements.submitExam.addEventListener("click", async () => {
  if (Object.keys(state.answers).length !== QUIZ_QUESTIONS.length) {
    return;
  }

  elements.submitExam.disabled = true;
  elements.submitExam.textContent = "Mengirim...";

  if (state.quizToken === "local-preview") {
    const localKey = {
      "map-bind": "Bind",
      "sage-ulti": "Resurrection",
      "omen-skill-name": "Dark Cover",
      "weapon-vandal": "Vandal",
      "trailblazer-owner": "Skye",
      "skin-prime": "Prime Vandal",
      "voice-chamber": "Chamber",
      "blend-yoru": "Yoru",
      "blend-clove": "Clove",
      "blend-gekko": "Gekko",
    };
    let rawScore = 0;
    let maxRawScore = 0;
    const resultDetail = QUIZ_QUESTIONS.map((question) => {
      const maxPoints = question.badge.includes("Susah") ? 25 : 10;
      maxRawScore += maxPoints;
      const correct = state.answers[question.id] === localKey[question.id];
      rawScore += correct ? maxPoints : 0;
      return {
        answer: state.answers[question.id],
        correct,
        correctAnswer: localKey[question.id],
      };
    });
    const score = Math.round((rawScore / maxRawScore) * 100);
    renderResult({
      durationSeconds: 1,
      maxRawScore,
      rank: score >= 90 ? "Ascendant" : score >= 70 ? "Platinum" : "Gold",
      rawScore,
      resultDetail,
      score,
    });
    return;
  }

  try {
    const response = await fetch(API.submit, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: state.answers,
        quizToken: state.quizToken,
      }),
    });
    const data = await readResponseJson(response);

    if (!response.ok) throw new Error(data.message || "Submit gagal");

    renderResult(data);
    loadLeaderboard();
  } catch (error) {
    elements.submitExam.disabled = false;
    elements.submitExam.innerHTML = '<i class="ri-send-plane-line"></i> Submit Ujian';
    alert(error.message);
  }
});

elements.refreshLeaderboard.addEventListener("click", loadLeaderboard);

loadLeaderboard();
