import { initDonateModal } from "/assets/js/modal.js";

const JAKARTA_TIME_ZONE = "Asia/Jakarta";

function getJakartaHour(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: JAKARTA_TIME_ZONE,
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Number(parts.find((part) => part.type === "hour")?.value ?? 0);
}

export function updateLiveStatus() {
  const hour = getJakartaHour();
  const isLive = hour >= 22 || hour < 5;

  document.querySelectorAll("[data-live-status]").forEach((pill) => {
    pill.textContent = isLive ? "Live" : "Offline";
    pill.classList.toggle("is-live", isLive);
    pill.classList.toggle("is-offline", !isLive);
  });

  document.querySelectorAll("[data-live-hint]").forEach((hint) => {
    hint.textContent = isLive
      ? "Support • VIP • Top Up"
      : "Live mulai 22.00 WIB";
  });

  document.documentElement.dataset.liveStatus = isLive ? "live" : "offline";
}

function initLiveClock() {
  let timerId = null;

  const stop = () => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  const start = () => {
    stop();
    updateLiveStatus();
    if (!document.hidden) {
      timerId = window.setInterval(updateLiveStatus, 60_000);
    }
  };

  document.addEventListener("visibilitychange", start);
  start();
}

function initPressFeedback() {
  document.querySelectorAll(".links a, .header-icons a").forEach((element) => {
    element.addEventListener("click", () => {
      element.classList.remove("release");
      void element.offsetWidth;
      element.classList.add("release");
    });
  });
}

function initAvatarGlitch() {
  const avatarWrap = document.querySelector(".avatar-wrap");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!avatarWrap || reduceMotion.matches) return;

  let intervalId = null;
  let cleanupId = null;

  const glitch = () => {
    if (document.hidden) return;
    avatarWrap.classList.remove("glitching");
    void avatarWrap.offsetWidth;
    avatarWrap.classList.add("glitching");
    window.clearTimeout(cleanupId);
    cleanupId = window.setTimeout(() => {
      avatarWrap.classList.remove("glitching");
    }, 700);
  };

  const stop = () => {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const start = () => {
    stop();
    if (!document.hidden) intervalId = window.setInterval(glitch, 3000);
  };

  document.addEventListener("visibilitychange", start);
  reduceMotion.addEventListener?.("change", () => {
    if (reduceMotion.matches) stop();
    else start();
  });
  start();
}


export function initCommonPage() {
  initPressFeedback();
  initAvatarGlitch();
  initDonateModal();
  initLiveClock();
}
