const API = "/api/uas-overlay-admin";
const PASSWORD_KEY = "uas-overlay-password";

const elements = {
  alertDuration: document.getElementById("alertDuration"),
  customStartAt: document.getElementById("customStartAt"),
  leaderboardLimit: document.getElementById("leaderboardLimit"),
  leaderboardMode: document.getElementById("leaderboardMode"),
  leaderboardTitle: document.getElementById("leaderboardTitle"),
  loginForm: document.getElementById("loginForm"),
  loginMessage: document.getElementById("loginMessage"),
  loginPanel: document.getElementById("loginPanel"),
  logoutButton: document.getElementById("logoutButton"),
  openPreview: document.getElementById("openPreview"),
  overlayLinks: document.getElementById("overlayLinks"),
  passwordInput: document.getElementById("passwordInput"),
  previewFrame: document.getElementById("previewFrame"),
  refreshButton: document.getElementById("refreshButton"),
  refreshSeconds: document.getElementById("refreshSeconds"),
  resetIntervalDays: document.getElementById("resetIntervalDays"),
  settingsForm: document.getElementById("settingsForm"),
  settingsMessage: document.getElementById("settingsMessage"),
  showAmount: document.getElementById("showAmount"),
  testMessage: document.getElementById("testMessage"),
  workspace: document.getElementById("workspace"),
};

let password = window.localStorage.getItem(PASSWORD_KEY) || "";
let currentSettings = null;

function overlayUrl(path, extra = "") {
  return `${window.location.origin}${path}${extra}`;
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

async function adminRequest(action, payload = {}) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      password,
      ...payload,
    }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request gagal");
  }

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
  elements.alertDuration.value = settings.alert_duration_seconds;
  elements.customStartAt.value = localInputValue(settings.custom_start_at);
  elements.leaderboardLimit.value = settings.leaderboard_limit;
  elements.leaderboardMode.value = settings.leaderboard_mode;
  elements.leaderboardTitle.value = settings.leaderboard_title;
  elements.refreshSeconds.value = settings.refresh_seconds;
  elements.resetIntervalDays.value = settings.reset_interval_days;
  elements.showAmount.checked = Boolean(settings.show_amount);
}

function readForm() {
  return {
    alert_duration_seconds: Number(elements.alertDuration.value || 7),
    custom_start_at: isoFromLocal(elements.customStartAt.value),
    leaderboard_limit: Number(elements.leaderboardLimit.value || 5),
    leaderboard_mode: elements.leaderboardMode.value,
    leaderboard_title: elements.leaderboardTitle.value,
    refresh_seconds: Number(elements.refreshSeconds.value || 7),
    reset_interval_days: Number(elements.resetIntervalDays.value || 30),
    show_amount: elements.showAmount.checked,
  };
}

function renderLinks(settings) {
  const limit = encodeURIComponent(settings.leaderboard_limit || 5);
  const links = [
    ["Leaderboard", overlayUrl("/uas/overlay/leaderboard/", `?limit=${limit}`)],
    ["Alert", overlayUrl("/uas/overlay/alerts/")],
    ["Full", overlayUrl("/uas/overlay/full/", `?limit=${limit}`)],
    [
      "Sepanjang Masa",
      overlayUrl("/uas/overlay/leaderboard/", `?mode=all_time&limit=${limit}`),
    ],
    [
      "Bulanan",
      overlayUrl("/uas/overlay/leaderboard/", `?mode=monthly&limit=${limit}`),
    ],
  ];

  elements.overlayLinks.innerHTML = links
    .map(
      ([label, url]) => `
        <div class="link-item">
          <strong>${label}</strong>
          <div class="link-copy">
            <input value="${url}" readonly />
            <button class="ghost-button compact" data-copy="${url}" type="button">
              <i class="ri-file-copy-line"></i>
              Salin
            </button>
          </div>
        </div>
      `,
    )
    .join("");

  elements.previewFrame.src = overlayUrl("/uas/overlay/full/", `?limit=${limit}`);
}

async function loadSettings() {
  const data = await adminRequest("get");
  currentSettings = data.settings;
  fillForm(currentSettings);
  renderLinks(currentSettings);
  showWorkspace();
}

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  password = elements.passwordInput.value;
  elements.loginMessage.textContent = "Memeriksa...";

  try {
    await loadSettings();
    window.localStorage.setItem(PASSWORD_KEY, password);
    elements.loginMessage.textContent = "";
  } catch (error) {
    showLogin(error.message);
  }
});

elements.settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  elements.settingsMessage.textContent = "Menyimpan...";

  try {
    const data = await adminRequest("save", { settings: readForm() });
    currentSettings = data.settings;
    fillForm(currentSettings);
    renderLinks(currentSettings);
    elements.settingsMessage.textContent = "Tersimpan.";
  } catch (error) {
    elements.settingsMessage.textContent = error.message;
  }
});

elements.logoutButton.addEventListener("click", () => {
  password = "";
  window.localStorage.removeItem(PASSWORD_KEY);
  showLogin("");
});

elements.refreshButton.addEventListener("click", () => {
  loadSettings().catch((error) => {
    elements.settingsMessage.textContent = error.message;
  });
});

elements.openPreview.addEventListener("click", () => {
  window.open(elements.previewFrame.src, "_blank", "noopener,noreferrer");
});

document.addEventListener("click", async (event) => {
  const copy = event.target.closest("[data-copy]");
  if (copy) {
    await navigator.clipboard?.writeText(copy.dataset.copy);
    copy.innerHTML = '<i class="ri-check-line"></i> Tersalin';
    window.setTimeout(() => {
      copy.innerHTML = '<i class="ri-file-copy-line"></i> Salin';
    }, 1200);
    return;
  }

  const test = event.target.closest("[data-test-event]");
  if (!test) return;

  elements.testMessage.textContent = "Mengirim test...";

  try {
    await adminRequest("test_event", {
      eventType: test.dataset.testEvent,
    });
    elements.testMessage.textContent = "Test terkirim.";
  } catch (error) {
    elements.testMessage.textContent = error.message;
  }
});

if (password) {
  loadSettings().catch(() => showLogin("Password perlu diisi ulang."));
} else {
  showLogin("");
}
