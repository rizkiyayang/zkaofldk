import crypto from "node:crypto";
import { supabaseRequest } from "./uas-core.mjs";

export const DEFAULT_OVERLAY_SETTINGS = {
  alert_duration_seconds: 7,
  custom_start_at: null,
  id: "main",
  leaderboard_limit: 5,
  leaderboard_mode: "monthly",
  leaderboard_title: "UAS Valorant Highscore",
  refresh_seconds: 7,
  reset_interval_days: 30,
  show_amount: true,
};

const VALID_MODES = new Set([
  "all_time",
  "monthly",
  "weekly",
  "custom",
  "interval_days",
]);

function clampNumber(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function cleanText(value, fallback, max = 80) {
  const text = String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, max);
  return text || fallback;
}

function toBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function safeIso(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function sanitizeOverlaySettings(input = {}) {
  const mode = VALID_MODES.has(input.leaderboard_mode)
    ? input.leaderboard_mode
    : DEFAULT_OVERLAY_SETTINGS.leaderboard_mode;

  return {
    alert_duration_seconds: clampNumber(
      input.alert_duration_seconds,
      DEFAULT_OVERLAY_SETTINGS.alert_duration_seconds,
      3,
      20,
    ),
    custom_start_at: safeIso(input.custom_start_at),
    id: "main",
    leaderboard_limit: clampNumber(
      input.leaderboard_limit,
      DEFAULT_OVERLAY_SETTINGS.leaderboard_limit,
      1,
      20,
    ),
    leaderboard_mode: mode,
    leaderboard_title: cleanText(
      input.leaderboard_title,
      DEFAULT_OVERLAY_SETTINGS.leaderboard_title,
    ),
    refresh_seconds: clampNumber(
      input.refresh_seconds,
      DEFAULT_OVERLAY_SETTINGS.refresh_seconds,
      3,
      60,
    ),
    reset_interval_days: clampNumber(
      input.reset_interval_days,
      DEFAULT_OVERLAY_SETTINGS.reset_interval_days,
      1,
      365,
    ),
    show_amount: toBoolean(
      input.show_amount,
      DEFAULT_OVERLAY_SETTINGS.show_amount,
    ),
  };
}

export async function getOverlaySettings() {
  try {
    const rows = await supabaseRequest(
      "uas_overlay_settings?select=*&id=eq.main&limit=1",
    );
    return {
      ...DEFAULT_OVERLAY_SETTINGS,
      ...(rows?.[0] || {}),
    };
  } catch {
    return DEFAULT_OVERLAY_SETTINGS;
  }
}

export async function saveOverlaySettings(input) {
  const settings = sanitizeOverlaySettings(input);
  const rows = await supabaseRequest("uas_overlay_settings?on_conflict=id", {
    method: "POST",
    body: {
      ...settings,
      updated_at: new Date().toISOString(),
    },
    prefer: "resolution=merge-duplicates,return=representation",
  });

  return {
    ...DEFAULT_OVERLAY_SETTINGS,
    ...(rows?.[0] || settings),
  };
}

function wibParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Jakarta",
    weekday: "short",
    year: "numeric",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return {
    day: Number(parts.day),
    month: Number(parts.month),
    weekday: parts.weekday,
    year: Number(parts.year),
  };
}

function dateAtWibMidnight(year, month, day) {
  return new Date(
    `${String(year).padStart(4, "0")}-${String(month).padStart(
      2,
      "0",
    )}-${String(day).padStart(2, "0")}T00:00:00+07:00`,
  );
}

function weeklyStart(date = new Date()) {
  const parts = wibParts(date);
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    parts.weekday,
  );
  const mondayOffset = dayIndex === 0 ? 6 : dayIndex - 1;
  const today = dateAtWibMidnight(parts.year, parts.month, parts.day);
  today.setUTCDate(today.getUTCDate() - mondayOffset);
  return today;
}

function monthlyStart(date = new Date()) {
  const parts = wibParts(date);
  return dateAtWibMidnight(parts.year, parts.month, 1);
}

function intervalStart(settings, date = new Date()) {
  const days = clampNumber(
    settings.reset_interval_days,
    DEFAULT_OVERLAY_SETTINGS.reset_interval_days,
    1,
    365,
  );
  const anchor =
    safeIso(settings.custom_start_at) ||
    dateAtWibMidnight(wibParts(date).year, 1, 1).toISOString();
  const anchorDate = new Date(anchor);
  const diffMs = Math.max(0, date.getTime() - anchorDate.getTime());
  const intervalMs = days * 24 * 60 * 60 * 1000;
  const index = Math.floor(diffMs / intervalMs);
  return new Date(anchorDate.getTime() + index * intervalMs);
}

export function getOverlayPeriod(settings, modeOverride = "") {
  const mode = VALID_MODES.has(modeOverride)
    ? modeOverride
    : settings.leaderboard_mode;
  const now = new Date();

  if (mode === "all_time") {
    return {
      label: "Sepanjang Masa",
      mode,
      startAt: null,
    };
  }

  if (mode === "weekly") {
    return {
      label: "Minggu Ini",
      mode,
      startAt: weeklyStart(now).toISOString(),
    };
  }

  if (mode === "custom") {
    const startAt = safeIso(settings.custom_start_at);
    return {
      label: "Custom",
      mode,
      startAt,
    };
  }

  if (mode === "interval_days") {
    return {
      label: `Reset ${settings.reset_interval_days || 30} Hari`,
      mode,
      startAt: intervalStart(settings, now).toISOString(),
    };
  }

  return {
    label: "Bulan Ini",
    mode: "monthly",
    startAt: monthlyStart(now).toISOString(),
  };
}

export async function getOverlayLeaderboard(options = {}) {
  const settings = {
    ...(await getOverlaySettings()),
    ...(options.settings || {}),
  };
  const limit = clampNumber(
    options.limit,
    settings.leaderboard_limit,
    1,
    20,
  );
  const period = getOverlayPeriod(settings, options.mode);
  const filters = period.startAt
    ? `&finished_at=gte.${encodeURIComponent(period.startAt)}`
    : "";
  const rows = await supabaseRequest(
    `uas_attempts?select=id,order_id,name,score,rank,duration_seconds,finished_at,created_at${filters}&order=score.desc,duration_seconds.asc,finished_at.desc&limit=${limit}`,
  );

  return {
    leaderboard: rows || [],
    period,
    settings,
  };
}

export async function createOverlayEvent({
  amount = null,
  durationSeconds = null,
  eventKey,
  eventType,
  name,
  orderId = null,
  payload = {},
  rank = null,
  score = null,
}) {
  if (!eventType || !eventKey) return null;

  try {
    const rows = await supabaseRequest(
      "uas_overlay_events?on_conflict=event_key",
      {
        method: "POST",
        body: {
          amount,
          duration_seconds: durationSeconds,
          event_key: eventKey,
          event_type: eventType,
          name: cleanText(name, "Peserta", 40),
          order_id: orderId,
          payload,
          rank,
          score,
        },
        prefer: "resolution=ignore-duplicates,return=representation",
      },
    );
    return rows?.[0] || null;
  } catch {
    return null;
  }
}

export async function recordPaymentEvent(order) {
  if (!order?.order_id) return null;

  return createOverlayEvent({
    amount: order.amount || null,
    eventKey: `payment-success-${order.order_id}`,
    eventType: "payment_success",
    name: order.name,
    orderId: order.order_id,
    payload: {
      email: order.email,
      status: order.payment_status,
    },
  });
}

export async function recordAttemptEvents(attempt) {
  if (!attempt?.id) return [];

  const events = [
    await createOverlayEvent({
      durationSeconds: attempt.duration_seconds,
      eventKey: `exam-finished-${attempt.id}`,
      eventType: "exam_finished",
      name: attempt.name,
      orderId: attempt.order_id,
      rank: attempt.rank,
      score: attempt.score,
    }),
  ];

  if (attempt.rank === "Radiant") {
    events.push(
      await createOverlayEvent({
        durationSeconds: attempt.duration_seconds,
        eventKey: `radiant-${attempt.id}`,
        eventType: "radiant",
        name: attempt.name,
        orderId: attempt.order_id,
        rank: attempt.rank,
        score: attempt.score,
      }),
    );
  }

  const settings = await getOverlaySettings();
  const { leaderboard, period } = await getOverlayLeaderboard({ settings });
  const position = leaderboard.findIndex((row) => row.id === attempt.id);

  if (position >= 0) {
    events.push(
      await createOverlayEvent({
        durationSeconds: attempt.duration_seconds,
        eventKey: `highscore-${period.mode}-${attempt.id}`,
        eventType: "highscore",
        name: attempt.name,
        orderId: attempt.order_id,
        payload: {
          period: period.label,
          position: position + 1,
        },
        rank: attempt.rank,
        score: attempt.score,
      }),
    );
  }

  return events.filter(Boolean);
}

export function verifyOverlayPassword(password) {
  const expected = process.env.UAS_ADMIN_PASSWORD || "";
  const received = String(password || "");

  if (!expected || !received) return false;

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}
