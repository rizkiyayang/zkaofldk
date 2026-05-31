import { json, supabaseRequest } from "../server/uas-core.mjs";
import { getOverlaySettings } from "../server/uas-overlay.mjs";

function safeAfter(value) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

async function fetchHandler(request) {
  if (request.method !== "GET") {
    return json({ error: "method_not_allowed" }, 405);
  }

  try {
    const url = new URL(request.url);
    const after = safeAfter(url.searchParams.get("after"));
    const limit = Math.max(
      1,
      Math.min(20, Number.parseInt(url.searchParams.get("limit") || "8", 10)),
    );
    const rows = await supabaseRequest(
      `uas_overlay_events?select=*&created_at=gt.${encodeURIComponent(after)}&order=created_at.asc&limit=${limit}`,
    );

    return json({
      events: rows || [],
      settings: await getOverlaySettings(),
    });
  } catch (error) {
    return json(
      {
        error: "overlay_events_failed",
        message: error.message,
      },
      500,
    );
  }
}

export default {
  fetch: fetchHandler,
};
