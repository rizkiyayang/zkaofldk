const overlayType = document.body.dataset.overlay || "alert";
const params = new URLSearchParams(window.location.search);
const startedAt = new Date().toISOString();
const SOUND_FILES = {
  big_donation: "/uas/sound/radiant.wav",
  donation: "/uas/sound/payment.wav",
  media_share: "/uas/sound/highscore.wav",
  milestone: "/uas/sound/exam_finished.wav",
  top_donor: "/uas/sound/highscore.wav",
};

const state = {
  alertDuration: 8000,
  eventQueue: [],
  isShowingAlert: false,
  lastSeenAt: startedAt,
  refreshMs: 5000,
  seenIds: new Set(),
  settings: {},
  youtubeApiReady: null,
};

const elements = {
  alertStack: document.getElementById("alertStack"),
  leaderboardList: document.getElementById("leaderboardList"),
  leaderboardTitle: document.getElementById("leaderboardTitle"),
  milestoneCard: document.getElementById("milestoneCard"),
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

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value || 0));
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, Math.max(0, ms));
  });
}

function applySettings(settings = {}) {
  const paramSize = params.get("size");
  const size = ["compact", "large"].includes(paramSize)
    ? paramSize
    : settings.overlay_size || "large";

  document.body.classList.toggle("overlay-compact", size === "compact");
  document.body.classList.toggle("overlay-large", size !== "compact");
  document.body.classList.toggle("hide-amount", settings.leaderboard_show_amount === false);
  document.body.classList.toggle("hide-rank", settings.leaderboard_show_rank === false);
  document.body.classList.toggle("is-transparent", settings.leaderboard_transparent === true);
  state.refreshMs = Math.max(2000, Number(settings.refresh_seconds || 5) * 1000);
  state.alertDuration = Math.max(
    3000,
    Number(settings.alert_duration_seconds || 8) * 1000,
  );
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || "Fetch failed");
  return data;
}

function brandIcon() {
  return `
    <span class="brand-emblem">
      <picture>
        <source srcset="/img/icon.webp" type="image/webp" />
        <img src="/img/icon.jpg" alt="COKELAT MANIS" decoding="async" />
      </picture>
    </span>
  `;
}

function symbolIcon(symbol) {
  return `<span class="symbol-emblem">${escapeHtml(symbol)}</span>`;
}

function fillTemplate(template, values) {
  return String(template || "").replace(/\{([a-z_]+)\}/gi, (_, key) => values[key] ?? "");
}

function eventValues(event, settings = {}) {
  return {
    amount: rupiah(event.amount || 0),
    message: event.message || "",
    name: event.name || "Supporter",
    net_amount: rupiah(event.payload?.net_amount || 0),
    payment_label: event.payload?.payment_label || "Midtrans",
    shownAmount: settings.show_amount === false ? "" : ` • ${rupiah(event.amount || 0)}`,
  };
}

function eventContent(event, settings = {}) {
  const values = eventValues(event, settings);
  const isBig = event.event_type === "big_donation" || event.payload?.is_big_donation;
  const amountLine = settings.show_amount === false ? "" : `<div class="amount-line">${rupiah(event.amount)}</div>`;

  if (event.event_type === "media_share") {
    return {
      className: isBig ? "is-big is-media" : "is-media",
      icon: symbolIcon("▶"),
      message: escapeHtml(
        fillTemplate(settings.media_message_template || "{message}", values) ||
          "Media share masuk antrean.",
      ),
      title: escapeHtml(
        fillTemplate(settings.media_title_template || "{name} berbagi video", values),
      ),
      amountLine,
    };
  }

  if (event.event_type === "milestone") {
    return {
      className: "is-big is-milestone",
      icon: symbolIcon("✓"),
      message: escapeHtml(`${rupiah(event.amount)} terkumpul`),
      title: escapeHtml(event.payload?.title || "Milestone tercapai"),
      amountLine: "",
    };
  }

  if (event.event_type === "top_donor") {
    return {
      className: "is-big",
      icon: symbolIcon("#"),
      message: escapeHtml(`${values.name} masuk top supporter`),
      title: "Top supporter baru",
      amountLine,
    };
  }

  return {
    className: isBig ? "is-big" : "",
    icon: brandIcon(),
    message: escapeHtml(
      fillTemplate(settings.donation_message_template || "{message}", values) ||
        "Terima kasih supportnya.",
    ),
    title: escapeHtml(
      fillTemplate(settings.donation_title_template || "{name}", values),
    ),
    amountLine,
  };
}

function playSound(eventType, settings = {}) {
  if (settings.sound_enabled === false) return Promise.resolve();
  const audio = new Audio(SOUND_FILES[eventType] || SOUND_FILES.donation);
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
    audio.play().then(() => {}).catch(finish);
    window.setTimeout(finish, 2200);
  });
}

function loadYoutubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (state.youtubeApiReady) return state.youtubeApiReady;

  state.youtubeApiReady = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === "function") previous();
      resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
    window.setTimeout(() => resolve(window.YT || null), 2500);
  });

  return state.youtubeApiReady;
}

async function playYoutube(event, container) {
  if (!event.media_video_id || !container) return wait(0);
  const durationMs = Math.max(5000, Number(event.media_duration_seconds || 30) * 1000);
  const playerId = `yt-${event.id}`;
  container.innerHTML = `<div id="${playerId}"></div>`;

  const yt = await loadYoutubeApi();
  if (!yt?.Player) {
    container.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${encodeURIComponent(event.media_video_id)}?autoplay=1&playsinline=1&rel=0&modestbranding=1"
        title="YouTube media share"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
    return wait(durationMs);
  }

  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    const timeoutId = window.setTimeout(finish, durationMs);
    new yt.Player(playerId, {
      videoId: event.media_video_id,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
      },
      events: {
        onReady(playerEvent) {
          playerEvent.target.playVideo();
        },
        onStateChange(playerEvent) {
          if (playerEvent.data === yt.PlayerState.ENDED) {
            window.clearTimeout(timeoutId);
            finish();
          }
        },
        onError() {
          window.clearTimeout(timeoutId);
          finish();
        },
      },
    });
  });
}

function markSeen(event) {
  state.seenIds.add(event.id);
  state.lastSeenAt = event.created_at || new Date().toISOString();
}

async function showNextAlert(settings = state.settings || {}) {
  if (!elements.alertStack || state.isShowingAlert || !state.eventQueue.length) {
    return;
  }

  state.isShowingAlert = true;
  const event = state.eventQueue.shift();
  const content = eventContent(event, settings);
  elements.alertStack.innerHTML = `
    <article class="alert-card ${content.className}">
      <div class="alert-icon">${content.icon}</div>
      <div class="alert-copy">
        <strong>${content.title}</strong>
        <span>${content.message}</span>
        ${content.amountLine}
      </div>
      ${
        event.event_type === "media_share"
          ? '<div class="media-stage" id="mediaStage"></div>'
          : ""
      }
    </article>
  `;

  const started = Date.now();
  await playSound(event.event_type, settings).catch(() => {});
  if (event.event_type === "media_share") {
    await wait(900);
    await playYoutube(event, document.getElementById("mediaStage"));
  } else {
    await wait(state.alertDuration - (Date.now() - started));
  }

  const card = elements.alertStack.querySelector(".alert-card");
  card?.classList.add("is-out");
  await wait(320);
  elements.alertStack.innerHTML = "";
  state.isShowingAlert = false;
  showNextAlert(settings);
}

async function loadEvents() {
  if (!elements.alertStack) return;
  const query = new URLSearchParams({ after: state.lastSeenAt });
  const data = await fetchJson(`/api/support-overlay-events?${query}`);
  const settings = data.settings || {};
  state.settings = settings;
  applySettings(settings);

  (data.events || []).forEach((event) => {
    if (state.seenIds.has(event.id)) return;
    markSeen(event);
    state.eventQueue.push(event);
  });

  showNextAlert(settings);
}

async function loadLeaderboard() {
  if (!elements.leaderboardList) return;
  const query = new URLSearchParams();
  const mode = params.get("mode");
  const limit = params.get("limit");
  if (mode) query.set("mode", mode);
  if (limit) query.set("limit", limit);
  const data = await fetchJson(`/api/support-overlay-leaderboard?${query}`);
  const settings = data.settings || {};
  applySettings(settings);

  elements.leaderboardTitle.textContent = settings.leaderboard_title || "Top Supporter";
  elements.periodLabel.textContent = data.period?.label || "Top Supporter";
  elements.leaderboardList.innerHTML = (data.leaderboard || []).length
    ? data.leaderboard
        .map(
          (row) => `
            <div class="leaderboard-row">
              <div class="place">${row.position}</div>
              <div class="name">
                <strong>${escapeHtml(row.name || "Supporter")}</strong>
                <span>${row.donation_count}x support</span>
              </div>
              <div class="score">
                <span>total</span>
                <strong>${rupiah(row.total_amount)}</strong>
              </div>
            </div>
          `,
        )
        .join("")
    : '<div class="empty">Belum ada support</div>';
}

async function loadMilestone() {
  if (!elements.milestoneCard) return;
  const data = await fetchJson("/api/support-milestone");
  const settings = data.settings || {};
  const totals = data.totals || {};
  applySettings(settings);

  const target = Number(settings.milestone_target_amount || 0);
  const total = Number(totals.gross_amount || 0);
  const percent = target ? Math.min(100, Math.round((total / target) * 100)) : 0;

  elements.milestoneCard.innerHTML = `
    <p class="eyebrow">Milestone</p>
    <div class="milestone-top">
      <h1>${escapeHtml(settings.milestone_title || "Target support")}</h1>
      <div class="milestone-amount">${percent}%</div>
    </div>
    <div class="progress-track">
      <div class="progress-fill" style="width:${percent}%"></div>
    </div>
    <div class="name" style="margin-top:12px">
      <strong>${rupiah(total)}</strong>
      <span>dari ${rupiah(target)}</span>
    </div>
  `;
}

function loop() {
  if (overlayType === "alert") loadEvents().catch(() => {});
  if (overlayType === "leaderboard") loadLeaderboard().catch(() => {});
  if (overlayType === "milestone") loadMilestone().catch(() => {});
  window.setTimeout(loop, state.refreshMs);
}

applySettings();
loop();
