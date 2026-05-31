import { gradeUasAnswers } from "../server/uas-quiz.mjs";
import {
  findOrderByToken,
  isPaidStatus,
  json,
  patchOrder,
  readJson,
  supabaseRequest,
} from "../server/uas-core.mjs";
import { recordAttemptEvents } from "../server/uas-overlay.mjs";

async function fetchHandler(request) {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  try {
    const body = await readJson(request);
    const token = String(body.quizToken || body.token || "").trim();

    if (!token) {
      return json({ error: "quiz_token_required" }, 400);
    }

    const order = await findOrderByToken(token);

    if (!order) {
      return json({ error: "quiz_token_invalid" }, 404);
    }

    if (!isPaidStatus(order.payment_status, order.fraud_status)) {
      return json({ error: "payment_required" }, 402);
    }

    if (order.submitted_at) {
      return json({ error: "already_submitted" }, 409);
    }

    const graded = gradeUasAnswers(body.answers, token);
    const now = new Date();
    const startedAt = order.quiz_started_at
      ? new Date(order.quiz_started_at)
      : now;
    const durationSeconds = Math.max(
      1,
      Math.round((now.getTime() - startedAt.getTime()) / 1000),
    );

    const attemptRows = await supabaseRequest("uas_attempts", {
      method: "POST",
      body: {
        answer_detail: graded.detail,
        answers: body.answers || {},
        duration_seconds: durationSeconds,
        finished_at: now.toISOString(),
        name: order.name,
        order_id: order.order_id,
        player_id: order.player_id,
        rank: graded.rank,
        raw_score: graded.rawScore,
        score: graded.score,
      },
      prefer: "return=representation",
    });
    const attempt = attemptRows?.[0];

    await patchOrder(order.order_id, {
      submitted_at: now.toISOString(),
    });

    await recordAttemptEvents(attempt);

    return json({
      durationSeconds,
      maxRawScore: graded.maxRawScore,
      rank: graded.rank,
      rawScore: graded.rawScore,
      resultDetail: graded.detail,
      score: graded.score,
    });
  } catch (error) {
    return json(
      {
        error: "submit_failed",
        message: error.message,
      },
      500,
    );
  }
}

export default {
  fetch: fetchHandler,
};
