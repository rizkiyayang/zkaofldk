import { json } from "../server/uas-core.mjs";
import { getOverlayLeaderboard } from "../server/uas-overlay.mjs";

async function fetchHandler(request) {
  if (request.method !== "GET") {
    return json({ error: "method_not_allowed" }, 405);
  }

  try {
    const url = new URL(request.url);
    const mode = url.searchParams.get("mode") || "";
    const limit = url.searchParams.get("limit") || "";
    const data = await getOverlayLeaderboard({ limit, mode });

    return json(data);
  } catch (error) {
    return json(
      {
        error: "overlay_leaderboard_failed",
        message: error.message,
      },
      500,
    );
  }
}

export default {
  fetch: fetchHandler,
};
