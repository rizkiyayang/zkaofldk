import {
  json,
  markPaidAndMaybeSendReceipt,
  readJson,
  verifyMidtransSignature,
} from "../server/uas-core.mjs";
import { recordPaymentEvent } from "../server/uas-overlay.mjs";

async function fetchHandler(request) {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  try {
    const payload = await readJson(request);

    if (!payload.order_id || !payload.signature_key) {
      return json({ error: "invalid_notification" }, 400);
    }

    if (!verifyMidtransSignature(payload)) {
      return json({ error: "invalid_signature" }, 401);
    }

    const order = await markPaidAndMaybeSendReceipt(payload.order_id, payload);

    if (order?.paid_at) {
      await recordPaymentEvent(order);
    }

    return json({
      ok: true,
    });
  } catch (error) {
    return json(
      {
        error: "webhook_failed",
        message: error.message,
      },
      500,
    );
  }
}

export default {
  fetch: fetchHandler,
};
