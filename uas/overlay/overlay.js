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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
              <div class="name">
                <strong>${escapeHtml(row.name || "Peserta")}</strong>
                <span>${escapeHtml(row.rank || "Iron")} • ${formatDuration(row.duration_seconds)}</span>
              </div>
              <div class="score">
                <strong>${Number(row.score || 0)}</strong>
                <span>nilai</span>
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
      icon: "$",
      message: `Pembayaran sukses${amount}`,
      title: name,
    };
  }

  if (event.event_type === "highscore") {
    return {
      icon: "#",
      message: `${position} highscore • ${score} nilai • ${duration}`,
      title: name,
    };
  }

  if (event.event_type === "radiant") {
    return {
      icon: "R",
      message: `${score} nilai • ${duration}`,
      title: `${name} Radiant`,
    };
  }

  return {
    icon: "U",
    message: `Rank ${rank} • ${score} nilai • ${duration}`,
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
    <article class="alert-card">
      <div class="alert-icon">${escapeHtml(content.icon)}</div>
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
