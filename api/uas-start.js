import {
  MIN_UAS_AMOUNT,
  cleanEmail,
  cleanName,
  createSnapTransaction,
  createOrderId,
  createQuizToken,
  extractPaymentInstructions,
  isValidEmail,
  json,
  parseAmount,
  readJson,
  supabaseRequest,
} from "../server/uas-core.mjs";

const LEGACY_CHANNELS = new Set(["snap", "qris", "bca", "bni", "bri"]);

async function fetchHandler(request) {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  try {
    const body = await readJson(request);
    const name = cleanName(body.name);
    const email = cleanEmail(body.email);
    const amount = parseAmount(body.amount);
    const requestedChannel = String(body.channel || "snap").toLowerCase();
    const channel = "snap";

    if (!name) return json({ error: "name_required" }, 400);
    if (!isValidEmail(email)) return json({ error: "email_invalid" }, 400);
    if (amount < MIN_UAS_AMOUNT) {
      return json({ error: "amount_minimum", minimum: MIN_UAS_AMOUNT }, 400);
    }
    if (!LEGACY_CHANNELS.has(requestedChannel)) {
      return json({ error: "channel_invalid" }, 400);
    }

    const orderId = createOrderId();
    const quizToken = createQuizToken();

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
        amount,
        channel,
        email,
        name,
        order_id: orderId,
        payment_status: "created",
        player_id: player.id,
        quiz_token: quizToken,
      },
      prefer: "return=representation",
    });

    const midtrans = await createSnapTransaction({
      amount,
      email,
      name,
      orderId,
    });

    await supabaseRequest(
      `uas_orders?order_id=eq.${encodeURIComponent(orderId)}`,
      {
        method: "PATCH",
        body: {
          fraud_status: midtrans.fraud_status || null,
          midtrans_payload: midtrans,
          midtrans_transaction_id: midtrans.transaction_id || null,
          payment_status: midtrans.transaction_status || "pending",
        },
        prefer: "return=representation",
      },
    );

    return json({
      amount,
      channel,
      orderId,
      payment: extractPaymentInstructions(midtrans),
      status: midtrans.transaction_status || "pending",
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
