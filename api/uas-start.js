import {
  cleanEmail,
  cleanName,
  createOrderId,
  createQuizToken,
  isValidEmail,
  json,
  readJson,
  supabaseRequest,
} from "../server/uas-core.mjs";

async function fetchHandler(request) {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  try {
    const body = await readJson(request);
    const name = cleanName(body.name);
    const email = cleanEmail(body.email);

    if (!name) return json({ error: "name_required" }, 400);
    if (!isValidEmail(email)) return json({ error: "email_invalid" }, 400);

    const orderId = createOrderId();
    const quizToken = createQuizToken();
    const now = new Date().toISOString();

    const playerRows = await supabaseRequest("uas_players", {
      method: "POST",
      body: {
        email,
        name,
      },
      prefer: "return=representation",
    });

    const player = playerRows[0];

    await supabaseRequest("uas_orders", {
      method: "POST",
      body: {
        amount: 0,
        channel: "free",
        email,
        name,
        order_id: orderId,
        payment_status: "free",
        player_id: player.id,
        quiz_started_at: now,
        quiz_token: quizToken,
      },
      prefer: "return=representation",
    });

    return json({
      amount: 0,
      channel: "free",
      orderId,
      paid: true,
      quizToken,
      status: "free",
    });
  } catch (error) {
    return json(
      {
        error: "start_failed",
        message: error.message,
      },
      500,
    );
  }
}

export default {
  fetch: fetchHandler,
};
