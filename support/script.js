const form = document.getElementById("supportForm");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const amountInput = document.getElementById("amountInput");
const statusCard = document.getElementById("statusCard");
const statusTitle = document.getElementById("statusTitle");
const statusText = document.getElementById("statusText");
const paymentLink = document.getElementById("paymentLink");
const checkStatus = document.getElementById("checkStatus");
const amountPresets = document.getElementById("amountPresets");
const minimumPill = document.getElementById("minimumPill");
const STORAGE_KEY = "cokelat-support-checkout";
let publicSettings = {
  mediaMinAmount: 25000,
  minimumAmount: 5000,
  presetAmounts: [5000, 10000, 20000, 100000],
};

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value || 0));
}

function setMessage(message) {
  formMessage.textContent = message;
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.innerHTML = isLoading
    ? '<i class="ri-loader-4-line"></i> Membuat checkout'
    : '<i class="ri-bank-card-line"></i> Lanjut Bayar';
}

function saveCheckout(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function readCheckout() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function showCheckout(data) {
  if (!data?.orderId || !data?.redirectUrl) return;
  statusCard.classList.remove("hidden");
  statusTitle.textContent = "Checkout siap";
  statusText.textContent = `${rupiah(data.amount)} sudah dibuat. Lanjutkan pembayaran di Midtrans.`;
  paymentLink.href = data.redirectUrl;
}

async function refreshStatus() {
  const checkout = readCheckout();
  if (!checkout?.orderId) return;

  checkStatus.disabled = true;
  checkStatus.innerHTML = '<i class="ri-loader-4-line"></i> Mengecek';
  try {
    const response = await fetch(
      `/api/support-status?orderId=${encodeURIComponent(checkout.orderId)}`,
      { cache: "no-store" },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.error || "Gagal cek status");

    if (data.isPaid) {
      statusTitle.textContent = "Support sudah masuk";
      statusText.textContent = "Makasih, alert akan muncul di live kalau overlay sedang aktif.";
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      statusTitle.textContent = "Menunggu pembayaran";
      statusText.textContent = "Kalau sudah bayar, status akan masuk otomatis dari Midtrans.";
    }
  } catch (error) {
    statusText.textContent = error.message;
  } finally {
    checkStatus.disabled = false;
    checkStatus.innerHTML = '<i class="ri-refresh-line"></i> Cek Status';
  }
}

function bindPresetButtons() {
  document.querySelectorAll(".amount-presets button").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".amount-presets button")
        .forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      amountInput.value = button.dataset.amount || "10000";
    });
  });
}

function renderPresetButtons() {
  if (!amountPresets) return;
  const presets = publicSettings.presetAmounts?.length
    ? publicSettings.presetAmounts
    : [5000, 10000, 20000, 100000];
  amountPresets.innerHTML = presets
    .map((amount) => {
      const selected = Number(amountInput.value || 0) === Number(amount);
      return `<button class="${selected ? "is-selected" : ""}" data-amount="${amount}" type="button">${Math.round(amount / 1000)}k</button>`;
    })
    .join("");
  bindPresetButtons();
}

async function loadPublicSettings() {
  try {
    const response = await fetch("/api/support-settings", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.error || "Gagal memuat setting");
    publicSettings = { ...publicSettings, ...data };
    minimumPill.textContent = `min. ${Math.round(publicSettings.minimumAmount / 1000)}k`;
    amountInput.min = publicSettings.minimumAmount;
    document.getElementById("mediaInput").placeholder =
      `Optional, min. ${Math.round(publicSettings.mediaMinAmount / 1000)}k`;
    renderPresetButtons();
  } catch {
    renderPresetButtons();
  }
}

bindPresetButtons();

amountInput?.addEventListener("input", () => {
  const value = Number(amountInput.value || 0);
  document.querySelectorAll(".amount-presets button").forEach((button) => {
    button.classList.toggle("is-selected", Number(button.dataset.amount) === value);
  });
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setLoading(true);
  setMessage("");

  const body = {
    amount: amountInput.value,
    email: document.getElementById("emailInput").value,
    mediaUrl: document.getElementById("mediaInput").value,
    message: document.getElementById("messageInput").value,
    name: document.getElementById("nameInput").value,
  };

  try {
    const response = await fetch("/api/support-start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (data.error === "media_amount_minimum") {
        throw new Error(`YouTube share minimal ${rupiah(data.minimum)}.`);
      }
      if (data.error === "amount_minimum") {
        throw new Error(`Support minimal ${rupiah(data.minimum)}.`);
      }
      throw new Error(data.message || data.error || "Checkout gagal");
    }

    saveCheckout({
      amount: data.amount,
      orderId: data.orderId,
      redirectUrl: data.redirectUrl,
    });
    showCheckout({
      amount: data.amount,
      orderId: data.orderId,
      redirectUrl: data.redirectUrl,
    });
    window.location.href = data.redirectUrl;
  } catch (error) {
    setMessage(error.message);
  } finally {
    setLoading(false);
  }
});

checkStatus?.addEventListener("click", refreshStatus);

const existingCheckout = readCheckout();
if (existingCheckout) {
  showCheckout(existingCheckout);
  refreshStatus();
}

loadPublicSettings();
