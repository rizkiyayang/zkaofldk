const overlayType = document.body.dataset.overlay || "full";
const params = new URLSearchParams(window.location.search);
const SOUND_FILES = {
  exam_finished: "/uas/sound/exam_finished.wav",
  highscore: "/uas/sound/highscore.wav",
  payment_success: "/uas/sound/payment.wav",
  radiant: "/uas/sound/radiant.wav",
};
const TEMPLATE_FALLBACKS = {
  exam_finished: "{name} menyelesaikan UAS Valorant dan mendapat {rank}",
  highscore: "{name} masuk highscore {position} dengan nilai {score}",
  payment_success: "{name} memasuki ruang UAS Valorant",
  radiant: "{name} meraih Radiant dengan nilai {score}",
};
const VISUAL_TEMPLATE_FALLBACKS = {
  exam_message: "{rank} • nilai {score} • waktu {duration}",
  exam_title: "{name} menyelesaikan UAS Valorant",
  highscore_message: "{name} • nilai {score} • {rank} • {duration}",
  highscore_title: "Highscore baru {position}",
  payment_message: "Ujian Akhir Season Valorant{shownAmount}",
  payment_title: "{name}\nmemasuki ruang",
  radiant_message: "Nilai {score} • waktu {duration}",
  radiant_title: "{name} meraih Radiant",
};
const state = {
  alertDuration: 7000,
  alertTimer: null,
  eventQueue: [],
  isShowingAlert: false,
  lastSeenAt:
    window.localStorage.getItem("uas-overlay-last-seen-at") ||
    new Date().toISOString(),
  refreshMs: 7000,
  seenIds: new Set(
    JSON.parse(window.localStorage.getItem("uas-overlay-seen-ids") || "[]"),
  ),
  settings: {},
};

const elements = {
  alertStack: document.getElementById("alertStack"),
  leaderboardList: document.getElementById("leaderboardList"),
  leaderboardTitle: document.getElementById("leaderboardTitle"),
  periodLabel: document.getElementById("periodLabel"),
};

const RANK_ICONS = {
  ascendant: "2309-valorant-ascendant-3",
  bronze: "4590-valorant-bronze-3",
  diamond: "6354-valorant-diamond-3",
  gold: "3293-valorant-gold-3",
  immortal: "5979-valorant-immortal-3",
  iron: "1854-valorant-iron-3",
  platinum: "5816-valorant-platinum-3",
  radiant: "5979-valorant-radiant",
  silver: "3293-valorant-silver-3",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function rankKey(rank) {
  const key = String(rank || "Iron").toLowerCase();
  return Object.hasOwn(RANK_ICONS, key) ? key : "iron";
}

function renderRankEmblem(rank, size = "") {
  const key = rankKey(rank);
  const icon = RANK_ICONS[key] || RANK_ICONS.iron;
  const safeRank = escapeHtml(rank || "Iron");
  const classes = ["rank-emblem", `rank-${key}`, size].filter(Boolean).join(" ");

  return `
    <span class="${classes}" aria-label="Rank ${safeRank}" title="${safeRank}">
      <picture>
        <source srcset="/uas/icon/${icon}.webp" type="image/webp" />
        <img src="/uas/icon/${icon}.png" alt="${safeRank}" decoding="async" />
      </picture>
    </span>
  `;
}

function renderBrandLogo(size = "") {
  const classes = ["brand-emblem", size].filter(Boolean).join(" ");

  return `
    <span class="${classes}" aria-label="COKELAT MANIS" title="COKELAT MANIS">
      <picture>
        <source srcset="/img/icon.webp" type="image/webp" />
        <img src="/img/icon.jpg" alt="COKELAT MANIS" decoding="async" />
      </picture>
    </span>
  `;
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value || 0);
}

function formatDuration(seconds) {
  const value = Number(seconds || 0);
  if (!value) return "-";
  const minutes = Math.floor(value / 60);
  const rest = value % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function numberToWords(value) {
  const number = Math.max(0, Math.floor(Number(value || 0)));
  const words = [
    "nol",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
  ];

  if (number < 12) return words[number];
  if (number < 20) return `${words[number - 10]} belas`;
  if (number < 100) {
    const tens = Math.floor(number / 10);
    const rest = number % 10;
    return `${words[tens]} puluh${rest ? ` ${words[rest]}` : ""}`;
  }
  if (number < 200) {
    return `seratus${number > 100 ? ` ${numberToWords(number - 100)}` : ""}`;
  }
  if (number < 1000) {
    const hundreds = Math.floor(number / 100);
    const rest = number % 100;
    return `${words[hundreds]} ratus${rest ? ` ${numberToWords(rest)}` : ""}`;
  }
  if (number < 2000) {
    return `seribu${number > 1000 ? ` ${numberToWords(number - 1000)}` : ""}`;
  }
  if (number < 1000000) {
    const thousands = Math.floor(number / 1000);
    const rest = number % 1000;
    return `${numberToWords(thousands)} ribu${rest ? ` ${numberToWords(rest)}` : ""}`;
  }

  return String(number);
}

function formatDurationSpeech(seconds) {
  const value = Number(seconds || 0);
  if (!value) return "nol detik";

  const minutes = Math.floor(value / 60);
  const rest = value % 60;
  const parts = [];
  if (minutes) parts.push(`${numberToWords(minutes)} menit`);
  if (rest) parts.push(`${numberToWords(rest)} detik`);
  return parts.join(" ");
}

function formatRupiahSpeech(value) {
  const amount = Math.max(0, Number(value || 0));
  if (!amount) return "nol rupiah";
  return `${numberToWords(amount)} rupiah`;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, Math.max(0, ms));
  });
}

function applyOverlaySize(settings = {}) {
  const paramSize = params.get("size");
  const size = ["compact", "large"].includes(paramSize)
    ? paramSize
    : settings.overlay_size || "large";

  document.body.classList.toggle("overlay-compact", size === "compact");
  document.body.classList.toggle("overlay-large", size !== "compact");
}

function eventValues(event, settings = {}) {
  const amountText = formatRupiah(event.amount || 0);
  const position = event.payload?.position ? `#${event.payload.position}` : "";

  return {
    amount: amountText,
    duration: formatDuration(event.duration_seconds),
    name: event.name || "Peserta",
    period: event.payload?.period || "",
    position,
    rank: event.rank || "Iron",
    score: String(Number(event.score || 0)),
    shownAmount: settings.show_amount ? ` • ${amountText}` : "",
  };
}

function eventSpeechValues(event, settings = {}) {
  const values = eventValues(event, settings);
  const amountText = formatRupiahSpeech(event.amount || 0);

  return {
    ...values,
    amount: amountText,
    duration: formatDurationSpeech(event.duration_seconds),
    shownAmount: settings.show_amount ? ` senilai ${amountText}` : "",
  };
}

function fillTemplate(template, values) {
  return String(template || "").replace(/\{([a-z_]+)\}/gi, (_, key) => {
    return values[key] ?? "";
  });
}

function getTtsTemplate(eventType, settings = {}) {
  if (eventType === "payment_success") {
    return settings.payment_template || TEMPLATE_FALLBACKS.payment_success;
  }

  if (eventType === "highscore") {
    return settings.highscore_template || TEMPLATE_FALLBACKS.highscore;
  }

  if (eventType === "radiant") {
    return settings.radiant_template || TEMPLATE_FALLBACKS.radiant;
  }

  return settings.exam_template || TEMPLATE_FALLBACKS.exam_finished;
}

function visualTemplate(key, settings = {}) {
  return settings[`${key}_template`] || VISUAL_TEMPLATE_FALLBACKS[key];
}

function playAlertSound(eventType, settings = {}) {
  if (!settings.sound_enabled) return Promise.resolve();

  const audio = new Audio(SOUND_FILES[eventType] || SOUND_FILES.exam_finished);
  audio.volume = Math.max(0, Math.min(1, Number(settings.sound_volume ?? 0.65)));

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    audio.addEventListener("ended", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });
    audio.play().catch(finish);
    window.setTimeout(finish, 4500);
  });
}

function getBrowserVoices() {
  if (!("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices();
}

function waitForVoices() {
  if (getBrowserVoices().length) return Promise.resolve(getBrowserVoices());

  return new Promise((resolve) => {
    const finish = () => resolve(getBrowserVoices());
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", finish, {
        once: true,
      });
    } else {
      window.speechSynthesis.onvoiceschanged = finish;
    }
    window.setTimeout(finish, 700);
  });
}

async function speakAlert(text, settings = {}) {
  if (!settings.tts_enabled || !text || !("speechSynthesis" in window)) return;

  const voices = await waitForVoices();
  const selected =
    voices.find((voice) => voice.name === settings.tts_voice) ||
    voices.find((voice) => /^id/i.test(voice.lang || "")) ||
    null;

  await new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    let settled = false;
    let timeoutId = 0;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve();
    };
    if (selected) utterance.voice = selected;
    utterance.lang = selected?.lang || "id-ID";
    utterance.rate = Math.max(0.7, Math.min(1.3, Number(settings.tts_rate ?? 1)));
    utterance.volume = Math.max(0, Math.min(1, Number(settings.tts_volume ?? 0.9)));
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
    window.setTimeout(() => window.speechSynthesis.resume(), 80);
    timeoutId = window.setTimeout(() => {
      if (settled) return;
      window.speechSynthesis.cancel();
      finish();
    }, 9000);
  });
}

async function playAlertMedia(event, content, settings = {}) {
  await playAlertSound(event.event_type, settings);
  await speakAlert(content.ttsText, settings);
}

function saveSeen(event) {
  state.seenIds.add(event.id);
  state.lastSeenAt = event.created_at || new Date().toISOString();
  const ids = [...state.seenIds].slice(-80);
  window.localStorage.setItem("uas-overlay-seen-ids", JSON.stringify(ids));
  window.localStorage.setItem("uas-overlay-last-seen-at", state.lastSeenAt);
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || "Fetch failed");
  return data;
}

async function loadLeaderboard() {
  if (!elements.leaderboardList) return;

  const query = new URLSearchParams();
  const mode = params.get("mode");
  const limit = params.get("limit");
  if (mode) query.set("mode", mode);
  if (limit) query.set("limit", limit);

  const data = await fetchJson(`/api/uas-overlay-leaderboard?${query}`);
  const settings = data.settings || {};
  const rows = data.leaderboard || [];

  state.settings = settings;
  applyOverlaySize(settings);
  state.refreshMs = Math.max(3000, Number(settings.refresh_seconds || 7) * 1000);
  state.alertDuration = Math.max(
    3000,
    Number(settings.alert_duration_seconds || 7) * 1000,
  );
  elements.leaderboardTitle.textContent =
    settings.leaderboard_title || "UAS Valorant Highscore";
  elements.periodLabel.textContent = data.period?.label || "Highscore";
  elements.leaderboardList.innerHTML = rows.length
    ? rows
        .map(
          (row, index) => `
            <div class="leaderboard-row">
              <div class="place">${index + 1}</div>
              <div class="rank-cell">${renderRankEmblem(row.rank)}</div>
              <div class="name">
                <strong>${escapeHtml(row.name || "Peserta")}</strong>
                <span>${escapeHtml(row.rank || "Iron")} • ${formatDuration(row.duration_seconds)}</span>
              </div>
              <div class="score">
                <span>nilai</span>
                <strong>${Number(row.score || 0)}</strong>
              </div>
            </div>
          `,
        )
        .join("")
    : '<div class="empty">Belum ada highscore</div>';
}

function eventContent(event, settings) {
  const values = eventValues(event, settings);
  const ttsText = fillTemplate(
    getTtsTemplate(event.event_type, settings),
    eventSpeechValues(event, settings),
  );

  if (event.event_type === "payment_success") {
    return {
      className: "is-payment",
      icon: renderBrandLogo("brand-emblem-alert"),
      message: escapeHtml(fillTemplate(visualTemplate("payment_message", settings), values)),
      ttsText,
      title: escapeHtml(fillTemplate(visualTemplate("payment_title", settings), values)),
    };
  }

  if (event.event_type === "highscore") {
    return {
      className: "is-highscore",
      icon: renderRankEmblem(values.rank, "rank-emblem-alert"),
      message: escapeHtml(fillTemplate(visualTemplate("highscore_message", settings), values)),
      ttsText,
      title: escapeHtml(fillTemplate(visualTemplate("highscore_title", settings), values)),
    };
  }

  if (event.event_type === "radiant") {
    return {
      className: "is-radiant",
      icon: renderRankEmblem("Radiant", "rank-emblem-alert"),
      message: escapeHtml(fillTemplate(visualTemplate("radiant_message", settings), values)),
      ttsText,
      title: escapeHtml(fillTemplate(visualTemplate("radiant_title", settings), values)),
    };
  }

  return {
    className: "is-result",
    icon: renderRankEmblem(values.rank, "rank-emblem-alert"),
    message: escapeHtml(fillTemplate(visualTemplate("exam_message", settings), values)),
    ttsText,
    title: escapeHtml(fillTemplate(visualTemplate("exam_title", settings), values)),
  };
}

async function showNextAlert(settings = state.settings || {}) {
  if (!elements.alertStack || state.isShowingAlert || !state.eventQueue.length) {
    return;
  }

  state.isShowingAlert = true;
  const event = state.eventQueue.shift();
  const content = eventContent(event, settings);
  const startedAt = Date.now();
  elements.alertStack.innerHTML = `
    <article class="alert-card ${content.className || ""}">
      <div class="alert-icon">${content.icon}</div>
      <div class="alert-copy">
        <strong>${content.title}</strong>
        <span>${content.message}</span>
      </div>
    </article>
  `;

  window.clearTimeout(state.alertTimer);
  await playAlertMedia(event, content, settings).catch(() => {});
  await wait(state.alertDuration - (Date.now() - startedAt));

  const card = elements.alertStack.querySelector(".alert-card");
  card?.classList.add("is-out");
  await wait(320);
  elements.alertStack.innerHTML = "";
  state.isShowingAlert = false;
  showNextAlert(settings);
}

async function loadEvents() {
  if (!elements.alertStack) return;

  const query = new URLSearchParams({
    after: state.lastSeenAt,
  });
  const data = await fetchJson(`/api/uas-overlay-events?${query}`);
  const settings = data.settings || {};
  state.settings = settings;
  applyOverlaySize(settings);
  state.refreshMs = Math.max(3000, Number(settings.refresh_seconds || 7) * 1000);
  state.alertDuration = Math.max(
    3000,
    Number(settings.alert_duration_seconds || 7) * 1000,
  );

  (data.events || []).forEach((event) => {
    if (state.seenIds.has(event.id)) return;
    saveSeen(event);
    state.eventQueue.push(event);
  });

  showNextAlert(settings);
}

function loop() {
  if (overlayType !== "alerts") {
    loadLeaderboard().catch(() => {});
  }

  if (overlayType !== "leaderboard") {
    loadEvents().catch(() => {});
  }

  window.setTimeout(loop, state.refreshMs);
}

applyOverlaySize();
window.localStorage.setItem("uas-overlay-last-seen-at", state.lastSeenAt);
loop();
