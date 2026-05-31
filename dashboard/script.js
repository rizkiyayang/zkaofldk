const API = "/api/uas-overlay-admin";
const PASSWORD_KEY = "uas-overlay-password";
const DEFAULT_TEMPLATES = {
  examMessage: "{rank} • nilai {score} • waktu {duration}",
  examTitle: "{name} menyelesaikan UAS Valorant",
  examTts: "{name} menyelesaikan UAS Valorant dan mendapat {rank}",
  highscoreMessage: "{name} • nilai {score} • {rank} • {duration}",
  highscoreTitle: "Highscore baru {position}",
  highscoreTts: "{name} masuk highscore {position} dengan nilai {score}",
  paymentMessage: "Ujian Akhir Season Valorant{shownAmount}",
  paymentTitle: "{name} memasuki ruang",
  paymentTts: "{name} memasuki ruang UAS Valorant",
  radiantMessage: "Nilai {score} • waktu {duration}",
  radiantTitle: "{name} meraih Radiant",
  radiantTts: "{name} meraih Radiant dengan nilai {score}",
};

const elements = {
  alertDuration: document.getElementById("alertDuration"),
  customStartAt: document.getElementById("customStartAt"),
  examMessageTemplate: document.getElementById("examMessageTemplate"),
  examTitleTemplate: document.getElementById("examTitleTemplate"),
  leaderboardLimit: document.getElementById("leaderboardLimit"),
  leaderboardMode: document.getElementById("leaderboardMode"),
  leaderboardTitle: document.getElementById("leaderboardTitle"),
  examTemplate: document.getElementById("examTemplate"),
  highscoreMessageTemplate: document.getElementById("highscoreMessageTemplate"),
  highscoreTitleTemplate: document.getElementById("highscoreTitleTemplate"),
  highscoreTemplate: document.getElementById("highscoreTemplate"),
  loginForm: document.getElementById("loginForm"),
  loginMessage: document.getElementById("loginMessage"),
  loginPanel: document.getElementById("loginPanel"),
  logoutButton: document.getElementById("logoutButton"),
  openPreview: document.getElementById("openPreview"),
  overlaySize: document.getElementById("overlaySize"),
  overlayLinks: document.getElementById("overlayLinks"),
  passwordInput: document.getElementById("passwordInput"),
  paymentMessageTemplate: document.getElementById("paymentMessageTemplate"),
  paymentTemplate: document.getElementById("paymentTemplate"),
  paymentTitleTemplate: document.getElementById("paymentTitleTemplate"),
  previewFrame: document.getElementById("previewFrame"),
  radiantMessageTemplate: document.getElementById("radiantMessageTemplate"),
  radiantTitleTemplate: document.getElementById("radiantTitleTemplate"),
  radiantTemplate: document.getElementById("radiantTemplate"),
  refreshButton: document.getElementById("refreshButton"),
  refreshSeconds: document.getElementById("refreshSeconds"),
  resetIntervalDays: document.getElementById("resetIntervalDays"),
  settingsForm: document.getElementById("settingsForm"),
  settingsMessage: document.getElementById("settingsMessage"),
  saveSettingsButton: document.getElementById("saveSettingsButton"),
  showAmount: document.getElementById("showAmount"),
  soundEnabled: document.getElementById("soundEnabled"),
  soundVolume: document.getElementById("soundVolume"),
  testMessage: document.getElementById("testMessage"),
  ttsEnabled: document.getElementById("ttsEnabled"),
  ttsRate: document.getElementById("ttsRate"),
  ttsVoice: document.getElementById("ttsVoice"),
  ttsVolume: document.getElementById("ttsVolume"),
  workspace: document.getElementById("workspace"),
};

let password = window.localStorage.getItem(PASSWORD_KEY) || "";
let currentSettings = null;
let browserVoices = [];

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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sortVoice(a, b) {
  const aId = /^id/i.test(a.lang || "") ? 0 : 1;
  const bId = /^id/i.test(b.lang || "") ? 0 : 1;
  return aId - bId || a.name.localeCompare(b.name);
}

function populateVoices(selected = currentSettings?.tts_voice || "") {
  if (!elements.ttsVoice) return;

  if (!("speechSynthesis" in window)) {
    elements.ttsVoice.innerHTML = '<option value="">TTS tidak didukung browser ini</option>';
    elements.ttsVoice.disabled = true;
    return;
  }

  elements.ttsVoice.disabled = false;
  browserVoices = window.speechSynthesis.getVoices().sort(sortVoice);
  const options = [
    '<option value="">Default browser (id-ID)</option>',
    ...browserVoices.map((voice) => {
      const label = `${voice.name} (${voice.lang || "unknown"})`;
      return `<option value="${escapeHtml(voice.name)}">${escapeHtml(label)}</option>`;
    }),
  ];

  elements.ttsVoice.innerHTML = options.join("");
  elements.ttsVoice.value = browserVoices.some((voice) => voice.name === selected)
    ? selected
    : "";
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
  elements.alertDuration.value = settings.alert_duration_seconds || 7;
  elements.customStartAt.value = localInputValue(settings.custom_start_at);
  elements.examMessageTemplate.value =
    settings.exam_message_template || DEFAULT_TEMPLATES.examMessage;
  elements.examTitleTemplate.value =
    settings.exam_title_template || DEFAULT_TEMPLATES.examTitle;
  elements.examTemplate.value =
    settings.exam_template || DEFAULT_TEMPLATES.examTts;
  elements.highscoreMessageTemplate.value =
    settings.highscore_message_template || DEFAULT_TEMPLATES.highscoreMessage;
  elements.highscoreTitleTemplate.value =
    settings.highscore_title_template || DEFAULT_TEMPLATES.highscoreTitle;
  elements.highscoreTemplate.value =
    settings.highscore_template || DEFAULT_TEMPLATES.highscoreTts;
  elements.leaderboardLimit.value = settings.leaderboard_limit || 5;
  elements.leaderboardMode.value = settings.leaderboard_mode || "monthly";
  elements.leaderboardTitle.value = settings.leaderboard_title || "UAS Valorant Highscore";
  elements.overlaySize.value = settings.overlay_size || "large";
  elements.paymentMessageTemplate.value =
    settings.payment_message_template || DEFAULT_TEMPLATES.paymentMessage;
  elements.paymentTemplate.value =
    settings.payment_template || DEFAULT_TEMPLATES.paymentTts;
  elements.paymentTitleTemplate.value =
    settings.payment_title_template || DEFAULT_TEMPLATES.paymentTitle;
  elements.radiantMessageTemplate.value =
    settings.radiant_message_template || DEFAULT_TEMPLATES.radiantMessage;
  elements.radiantTitleTemplate.value =
    settings.radiant_title_template || DEFAULT_TEMPLATES.radiantTitle;
  elements.radiantTemplate.value =
    settings.radiant_template || DEFAULT_TEMPLATES.radiantTts;
  elements.refreshSeconds.value = settings.refresh_seconds || 7;
  elements.resetIntervalDays.value = settings.reset_interval_days || 30;
  elements.showAmount.checked = settings.show_amount !== false;
  elements.soundEnabled.checked = settings.sound_enabled !== false;
  elements.soundVolume.value = Number(settings.sound_volume ?? 0.65);
  elements.ttsEnabled.checked = settings.tts_enabled !== false;
  elements.ttsRate.value = Number(settings.tts_rate ?? 1);
  elements.ttsVolume.value = Number(settings.tts_volume ?? 0.9);
  populateVoices(settings.tts_voice || "");
}

function readForm() {
  return {
    alert_duration_seconds: Number(elements.alertDuration.value || 7),
    custom_start_at: isoFromLocal(elements.customStartAt.value),
    exam_message_template: elements.examMessageTemplate.value,
    exam_title_template: elements.examTitleTemplate.value,
    exam_template: elements.examTemplate.value,
    highscore_message_template: elements.highscoreMessageTemplate.value,
    highscore_title_template: elements.highscoreTitleTemplate.value,
    highscore_template: elements.highscoreTemplate.value,
    leaderboard_limit: Number(elements.leaderboardLimit.value || 5),
    leaderboard_mode: elements.leaderboardMode.value,
    leaderboard_title: elements.leaderboardTitle.value,
    overlay_size: elements.overlaySize.value,
    payment_message_template: elements.paymentMessageTemplate.value,
    payment_title_template: elements.paymentTitleTemplate.value,
    payment_template: elements.paymentTemplate.value,
    radiant_message_template: elements.radiantMessageTemplate.value,
    radiant_title_template: elements.radiantTitleTemplate.value,
    radiant_template: elements.radiantTemplate.value,
    refresh_seconds: Number(elements.refreshSeconds.value || 7),
    reset_interval_days: Number(elements.resetIntervalDays.value || 30),
    show_amount: elements.showAmount.checked,
    sound_enabled: elements.soundEnabled.checked,
    sound_volume: Number(elements.soundVolume.value || 0.65),
    tts_enabled: elements.ttsEnabled.checked,
    tts_rate: Number(elements.ttsRate.value || 1),
    tts_voice: elements.ttsVoice.value,
    tts_volume: Number(elements.ttsVolume.value || 0.9),
  };
}

function setSaveState(message, isSaving = false) {
  elements.settingsMessage.textContent = message;
  elements.saveSettingsButton.disabled = isSaving;
  elements.saveSettingsButton.innerHTML = isSaving
    ? '<i class="ri-loader-4-line"></i> Menyimpan'
    : '<i class="ri-save-3-line"></i> Simpan';
}

function renderLinks(settings) {
  const limit = encodeURIComponent(settings.leaderboard_limit || 5);
  const size = encodeURIComponent(settings.overlay_size || "large");
  const links = [
    ["Leaderboard", overlayUrl("/uas/overlay/leaderboard/", `?limit=${limit}&size=${size}`)],
    ["Alert", overlayUrl("/uas/overlay/alerts/", `?size=${size}`)],
    ["Full", overlayUrl("/uas/overlay/full/", `?limit=${limit}&size=${size}`)],
    [
      "Sepanjang Masa",
      overlayUrl(
        "/uas/overlay/leaderboard/",
        `?mode=all_time&limit=${limit}&size=${size}`,
      ),
    ],
    [
      "Bulanan",
      overlayUrl(
        "/uas/overlay/leaderboard/",
        `?mode=monthly&limit=${limit}&size=${size}`,
      ),
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

  elements.previewFrame.src = overlayUrl(
    "/uas/overlay/full/",
    `?limit=${limit}&size=${size}`,
  );
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
  setSaveState("Menyimpan...", true);

  try {
    const data = await adminRequest("save", { settings: readForm() });
    currentSettings = data.settings;
    fillForm(currentSettings);
    renderLinks(currentSettings);
    setSaveState("Tersimpan.");
  } catch (error) {
    setSaveState(error.message);
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
  if (test) {
    elements.testMessage.textContent = "Mengirim test...";

    try {
      await adminRequest("test_event", {
        eventType: test.dataset.testEvent,
      });
      elements.testMessage.textContent = "Test terkirim ke overlay.";
    } catch (error) {
      elements.testMessage.textContent = error.message;
    }
    return;
  }
});

populateVoices();
if ("speechSynthesis" in window) {
  const refreshVoices = () => populateVoices(elements.ttsVoice.value);
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
  } else {
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
}

if (password) {
  loadSettings().catch(() => showLogin("Password perlu diisi ulang."));
} else {
  showLogin("");
}
