const API = "/api/support-dashboard";
const PASSWORD_KEY = "support-dashboard-password";

const elements = {
  alertDuration: document.getElementById("alertDuration"),
  bigDonationThreshold: document.getElementById("bigDonationThreshold"),
  customStartAt: document.getElementById("customStartAt"),
  donationList: document.getElementById("donationList"),
  leaderboardLimit: document.getElementById("leaderboardLimit"),
  leaderboardMode: document.getElementById("leaderboardMode"),
  leaderboardShowAmount: document.getElementById("leaderboardShowAmount"),
  leaderboardShowRank: document.getElementById("leaderboardShowRank"),
  leaderboardTitle: document.getElementById("leaderboardTitle"),
  leaderboardTransparent: document.getElementById("leaderboardTransparent"),
  loginForm: document.getElementById("loginForm"),
  loginMessage: document.getElementById("loginMessage"),
  loginPanel: document.getElementById("loginPanel"),
  mediaBaseSeconds: document.getElementById("mediaBaseSeconds"),
  mediaMaxSeconds: document.getElementById("mediaMaxSeconds"),
  mediaMinAmount: document.getElementById("mediaMinAmount"),
  milestoneTargetAmount: document.getElementById("milestoneTargetAmount"),
  milestoneTitle: document.getElementById("milestoneTitle"),
  minimumAmount: document.getElementById("minimumAmount"),
  overlayLinks: document.getElementById("overlayLinks"),
  overlaySize: document.getElementById("overlaySize"),
  passwordInput: document.getElementById("passwordInput"),
  presetAmounts: document.getElementById("presetAmounts"),
  refreshButton: document.getElementById("refreshButton"),
  refreshSeconds: document.getElementById("refreshSeconds"),
  resetIntervalDays: document.getElementById("resetIntervalDays"),
  saveButton: document.getElementById("saveButton"),
  settingsForm: document.getElementById("settingsForm"),
  settingsMessage: document.getElementById("settingsMessage"),
  showAmount: document.getElementById("showAmount"),
  soundVolume: document.getElementById("soundVolume"),
  statsGrid: document.getElementById("statsGrid"),
  testMessage: document.getElementById("testMessage"),
  withdrawAmount: document.getElementById("withdrawAmount"),
  withdrawForm: document.getElementById("withdrawForm"),
  withdrawList: document.getElementById("withdrawList"),
  withdrawNote: document.getElementById("withdrawNote"),
  workspace: document.getElementById("workspace"),
};

let password = window.localStorage.getItem(PASSWORD_KEY) || "";

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function localInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function isoFromLocal(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function shortDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

async function adminRequest(action, payload = {}) {
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, password, ...payload }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || "Request gagal");
  return data;
}

function showWorkspace() {
  elements.loginPanel.classList.add("hidden");
  elements.workspace.classList.remove("hidden");
}

function showLogin(message = "") {
  elements.workspace.classList.add("hidden");
  elements.loginPanel.classList.remove("hidden");
  elements.loginMessage.textContent = message;
}

function fillForm(settings) {
  elements.alertDuration.value = settings.alert_duration_seconds || 8;
  elements.bigDonationThreshold.value = settings.big_donation_threshold || 50000;
  elements.customStartAt.value = localInputValue(settings.custom_start_at);
  elements.leaderboardLimit.value = settings.leaderboard_limit || 5;
  elements.leaderboardMode.value = settings.leaderboard_mode || "monthly";
  elements.leaderboardShowAmount.checked = settings.leaderboard_show_amount !== false;
  elements.leaderboardShowRank.checked = settings.leaderboard_show_rank !== false;
  elements.leaderboardTitle.value = settings.leaderboard_title || "Top Supporter";
  elements.leaderboardTransparent.checked = settings.leaderboard_transparent === true;
  elements.mediaBaseSeconds.value = settings.media_base_seconds || 30;
  elements.mediaMaxSeconds.value = settings.media_max_seconds || 300;
  elements.mediaMinAmount.value = settings.media_min_amount || 25000;
  elements.milestoneTargetAmount.value = settings.milestone_target_amount || 500000;
  elements.milestoneTitle.value = settings.milestone_title || "Target jajan hari ini";
  elements.minimumAmount.value = settings.minimum_amount || 5000;
  elements.overlaySize.value = settings.overlay_size || "large";
  elements.presetAmounts.value = (settings.preset_amounts || [5000, 10000, 20000, 100000]).join(",");
  elements.refreshSeconds.value = settings.refresh_seconds || 5;
  elements.resetIntervalDays.value = settings.reset_interval_days || 30;
  elements.showAmount.checked = settings.show_amount !== false;
  elements.soundVolume.value = Number(settings.sound_volume ?? 0.65);
}

function readForm() {
  return {
    alert_duration_seconds: Number(elements.alertDuration.value || 8),
    big_donation_threshold: Number(elements.bigDonationThreshold.value || 50000),
    custom_start_at: isoFromLocal(elements.customStartAt.value),
    leaderboard_limit: Number(elements.leaderboardLimit.value || 5),
    leaderboard_mode: elements.leaderboardMode.value,
    leaderboard_show_amount: elements.leaderboardShowAmount.checked,
    leaderboard_show_rank: elements.leaderboardShowRank.checked,
    leaderboard_title: elements.leaderboardTitle.value,
    leaderboard_transparent: elements.leaderboardTransparent.checked,
    media_base_seconds: Number(elements.mediaBaseSeconds.value || 30),
    media_max_seconds: Number(elements.mediaMaxSeconds.value || 300),
    media_min_amount: Number(elements.mediaMinAmount.value || 25000),
    milestone_target_amount: Number(elements.milestoneTargetAmount.value || 500000),
    milestone_title: elements.milestoneTitle.value,
    minimum_amount: Number(elements.minimumAmount.value || 5000),
    overlay_size: elements.overlaySize.value,
    preset_amounts: elements.presetAmounts.value,
    refresh_seconds: Number(elements.refreshSeconds.value || 5),
    reset_interval_days: Number(elements.resetIntervalDays.value || 30),
    show_amount: elements.showAmount.checked,
    sound_volume: Number(elements.soundVolume.value || 0.65),
  };
}

function renderStats(totals) {
  const rows = [
    ["Total kotor", totals.gross_amount],
    ["Potongan Midtrans", totals.midtrans_fee],
    ["Estimasi bersih", totals.net_amount],
    ["Sudah ditarik", totals.withdrawn_amount],
    ["Sisa estimasi", totals.remaining_amount],
  ];
  elements.statsGrid.innerHTML = rows
    .map(
      ([label, value]) => `
        <article class="stat-card">
          <span>${escapeHtml(label)}</span>
          <strong>${rupiah(value)}</strong>
        </article>
      `,
    )
    .join("");
}

function overlayUrl(path, extra = "") {
  return `${window.location.origin}${path}${extra}`;
}

function renderLinks(settings) {
  const limit = encodeURIComponent(settings.leaderboard_limit || 5);
  const size = encodeURIComponent(settings.overlay_size || "large");
  const links = [
    ["Alert", overlayUrl("/support/overlay/alert/", `?size=${size}`)],
    ["Milestone", overlayUrl("/support/overlay/milestone/", `?size=${size}`)],
    ["Leaderboard", overlayUrl("/support/overlay/leaderboard/", `?limit=${limit}&size=${size}`)],
  ];

  elements.overlayLinks.innerHTML = links
    .map(
      ([label, url]) => `
        <div class="link-row">
          <strong>${escapeHtml(label)}</strong>
          <input value="${escapeHtml(url)}" readonly />
          <button class="copy-button" data-copy="${escapeHtml(url)}" type="button">
            <i class="ri-file-copy-line"></i>
            Salin
          </button>
        </div>
      `,
    )
    .join("");
}

function renderDonations(donations = []) {
  elements.donationList.innerHTML = donations.length
    ? donations
        .map(
          (row) => `
            <article class="donation-row">
              <div class="meta">
                <strong>${escapeHtml(row.donor_name)}</strong>
                <span>${escapeHtml(row.payment_label || row.payment_type || "Midtrans")} • ${shortDate(row.paid_at)}</span>
                <em>${escapeHtml(row.message || "Tanpa pesan")}</em>
              </div>
              <div class="meta">
                <strong>${rupiah(row.amount)}</strong>
                <span>fee ${rupiah(row.midtrans_fee)} • net ${rupiah(row.net_amount)}</span>
              </div>
              <div class="meta">
                <strong>${row.media_type ? "Media share" : row.is_big_donation ? "Donate besar" : "Donate"}</strong>
                <span>${escapeHtml(row.media_video_id || row.order_id)}</span>
              </div>
              <button class="replay-button" data-replay="${escapeHtml(row.order_id)}" type="button">
                <i class="ri-replay-line"></i>
                Replay
              </button>
            </article>
          `,
        )
        .join("")
    : '<p class="note">Belum ada donate masuk.</p>';
}

function renderWithdrawals(withdrawals = []) {
  elements.withdrawList.innerHTML = withdrawals.length
    ? withdrawals
        .map(
          (row) => `
            <article class="withdraw-row">
              <div class="meta">
                <strong>${rupiah(row.amount)}</strong>
                <span>${shortDate(row.withdrawn_at)}${row.note ? ` • ${escapeHtml(row.note)}` : ""}</span>
              </div>
              <button class="delete-button" data-delete-withdrawal="${escapeHtml(row.id)}" type="button">
                <i class="ri-delete-bin-line"></i>
                Hapus
              </button>
            </article>
          `,
        )
        .join("")
    : '<p class="note">Belum ada catatan penarikan.</p>';
}

function render(data) {
  showWorkspace();
  fillForm(data.settings);
  renderStats(data.totals || {});
  renderLinks(data.settings || {});
  renderDonations(data.donations || []);
  renderWithdrawals(data.totals?.withdrawals || []);
}

async function load() {
  try {
    const data = await adminRequest("get");
    render(data);
  } catch (error) {
    window.localStorage.removeItem(PASSWORD_KEY);
    password = "";
    showLogin(error.message);
  }
}

elements.loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  password = elements.passwordInput.value;
  window.localStorage.setItem(PASSWORD_KEY, password);
  await load();
});

elements.settingsForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});

elements.saveButton?.addEventListener("click", async () => {
  elements.settingsMessage.textContent = "Menyimpan...";
  elements.saveButton.disabled = true;
  try {
    const data = await adminRequest("save", { settings: readForm() });
    render(data);
    elements.settingsMessage.textContent = "Tersimpan.";
  } catch (error) {
    elements.settingsMessage.textContent = error.message;
  } finally {
    elements.saveButton.disabled = false;
  }
});

elements.refreshButton?.addEventListener("click", load);

elements.withdrawForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const data = await adminRequest("add_withdrawal", {
      amount: elements.withdrawAmount.value,
      note: elements.withdrawNote.value,
    });
    elements.withdrawAmount.value = "";
    elements.withdrawNote.value = "";
    render(data);
  } catch (error) {
    elements.settingsMessage.textContent = error.message;
  }
});

document.addEventListener("click", async (event) => {
  const copyButton = event.target.closest("[data-copy]");
  if (copyButton) {
    await navigator.clipboard.writeText(copyButton.dataset.copy || "");
    copyButton.innerHTML = '<i class="ri-check-line"></i> Tersalin';
    setTimeout(() => {
      copyButton.innerHTML = '<i class="ri-file-copy-line"></i> Salin';
    }, 1200);
  }

  const testButton = event.target.closest("[data-event]");
  if (testButton) {
    elements.testMessage.textContent = "Mengirim test...";
    try {
      await adminRequest("test_event", { eventType: testButton.dataset.event });
      elements.testMessage.textContent = "Test terkirim.";
    } catch (error) {
      elements.testMessage.textContent = error.message;
    }
  }

  const replayButton = event.target.closest("[data-replay]");
  if (replayButton) {
    replayButton.disabled = true;
    try {
      await adminRequest("replay", { orderId: replayButton.dataset.replay });
      replayButton.innerHTML = '<i class="ri-check-line"></i> Terkirim';
    } catch (error) {
      replayButton.innerHTML = escapeHtml(error.message);
    }
    setTimeout(() => {
      replayButton.disabled = false;
      replayButton.innerHTML = '<i class="ri-replay-line"></i> Replay';
    }, 1400);
  }

  const deleteButton = event.target.closest("[data-delete-withdrawal]");
  if (deleteButton) {
    const data = await adminRequest("delete_withdrawal", {
      id: deleteButton.dataset.deleteWithdrawal,
    });
    render(data);
  }
});

if (password) {
  load();
}
