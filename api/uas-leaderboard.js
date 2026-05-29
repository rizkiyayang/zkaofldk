import { json, supabaseRequest } from "../server/uas-core.mjs";

async function fetchHandler() {
  try {
    const rows = await supabaseRequest(
      "uas_attempts?select=name,score,rank,duration_seconds,finished_at&order=score.desc,duration_seconds.asc,finished_at.desc&limit=20",
    );

    return json({
      leaderboard: rows || [],
    });
  } catch (error) {
    return json(
      {
        error: "leaderboard_unavailable",
        message: error.message,
      },
      503,
    );
  }
}

export default {
  fetch: fetchHandler,
};
