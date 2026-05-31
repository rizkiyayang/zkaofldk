const overlayType = document.body.dataset.overlay || "full";
const params = new URLSearchParams(window.location.search);
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
  const name = escapeHtml(event.name || "Peserta");
  const amount = settings.show_amount ? ` • ${formatRupiah(event.amount)}` : "";
  const score = Number(event.score || 0);
  const rank = escapeHtml(event.rank || "Iron");
  const duration = formatDuration(event.duration_seconds);
  const position = event.payload?.position ? `#${event.payload.position}` : "";

  if (event.event_type === "payment_success") {
    return {
      className: "is-payment",
      icon: '<span class="alert-symbol">UAS</span>',
      message: `Donasi masuk${amount}`,
      title: `${name} memulai ujian`,
    };
  }

  if (event.event_type === "highscore") {
    return {
      className: "is-highscore",
      icon: renderRankEmblem(rank, "rank-emblem-alert"),
      message: `${position} highscore • nilai ${score} • ${duration}`,
      title: `${name} masuk highscore`,
    };
  }

  if (event.event_type === "radiant") {
    return {
      className: "is-radiant",
      icon: renderRankEmblem("Radiant", "rank-emblem-alert"),
      message: `nilai ${score} • ${duration}`,
      title: `${name} dapat Radiant`,
    };
  }

  return {
    className: "is-result",
    icon: renderRankEmblem(rank, "rank-emblem-alert"),
    message: `${rank} • nilai ${score} • ${duration}`,
    title: `${name} selesai UAS`,
  };
}

function showNextAlert(settings = {}) {
  if (!elements.alertStack || state.isShowingAlert || !state.eventQueue.length) {
    return;
  }

  state.isShowingAlert = true;
  const event = state.eventQueue.shift();
  const content = eventContent(event, settings);
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
  state.alertTimer = window.setTimeout(() => {
    const card = elements.alertStack.querySelector(".alert-card");
    card?.classList.add("is-out");
    window.setTimeout(() => {
      elements.alertStack.innerHTML = "";
      state.isShowingAlert = false;
      showNextAlert(settings);
    }, 320);
  }, state.alertDuration);
}

async function loadEvents() {
  if (!elements.alertStack) return;

  const query = new URLSearchParams({
    after: state.lastSeenAt,
  });
  const data = await fetchJson(`/api/uas-overlay-events?${query}`);
  const settings = data.settings || {};
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

window.localStorage.setItem("uas-overlay-last-seen-at", state.lastSeenAt);
loop();
