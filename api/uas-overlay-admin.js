import { json, readJson } from "../server/uas-core.mjs";
import {
  createOverlayEvent,
  getOverlayLeaderboard,
  getOverlaySettings,
  saveOverlaySettings,
  verifyOverlayPassword,
} from "../server/uas-overlay.mjs";

async function fetchHandler(request) {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  try {
    const body = await readJson(request);

    if (!verifyOverlayPassword(body.password)) {
      return json({ error: "unauthorized" }, 401);
    }

    const action = String(body.action || "get");

    if (action === "save") {
      const settings = await saveOverlaySettings(body.settings || {});
      return json({
        ok: true,
        settings,
      });
    }

    if (action === "test_event") {
      const type = String(body.eventType || "exam_finished");
      await createOverlayEvent({
        amount: 10000,
        durationSeconds: 87,
        eventKey: `test-${type}-${Date.now()}`,
        eventType: type,
        name: "COKELAT MANIS",
        orderId: `TEST-${Date.now()}`,
        payload: {
          period: "Preview",
          position: 1,
        },
        rank: type === "payment_success" ? null : "Radiant",
        score: type === "payment_success" ? null : 100,
      });

      return json({ ok: true });
    }

    const settings = await getOverlaySettings();
    const leaderboard = await getOverlayLeaderboard({ settings });

    return json({
      leaderboard,
      settings,
    });
  } catch (error) {
    return json(
      {
        error: "overlay_admin_failed",
        message: error.message,
      },
      500,
    );
  }
}

export default {
  fetch: fetchHandler,
};
