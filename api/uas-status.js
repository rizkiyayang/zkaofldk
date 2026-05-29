import {
  cleanEmail,
  extractPaymentInstructions,
  findOrderByOrderId,
  getMidtransStatus,
  isFinalStatus,
  isPaidStatus,
  json,
  markPaidAndMaybeSendReceipt,
  patchOrder,
  readJson,
} from "../server/uas-core.mjs";

async function fetchHandler(request) {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  try {
    const body = await readJson(request);
    const orderId = String(body.orderId || body.order_id || "").trim();
    const email = cleanEmail(body.email);

    if (!orderId || !email) {
      return json({ error: "order_and_email_required" }, 400);
    }

    let order = await findOrderByOrderId(orderId);

    if (!order || order.email !== email) {
      return json({ error: "order_not_found" }, 404);
    }

    if (
      !isPaidStatus(order.payment_status, order.fraud_status) &&
      !isFinalStatus(order.payment_status)
    ) {
      try {
        const statusPayload = await getMidtransStatus(orderId);
        order = await markPaidAndMaybeSendReceipt(orderId, statusPayload);
      } catch (error) {
        if (order.channel !== "snap") throw error;
      }
    }

    const paid = isPaidStatus(order.payment_status, order.fraud_status);

    if (paid && !order.quiz_started_at) {
      order = await patchOrder(orderId, {
        quiz_started_at: new Date().toISOString(),
      });
    }

    return json({
      amount: order.amount,
      channel: order.channel,
      paid,
      orderId,
      payment: order.midtrans_payload
        ? extractPaymentInstructions(order.midtrans_payload)
        : null,
      quizToken: paid && !order.submitted_at ? order.quiz_token : null,
      status: order.payment_status,
      submitted: Boolean(order.submitted_at),
    });
  } catch (error) {
    return json(
      {
        error: "status_failed",
        message: error.message,
      },
      500,
    );
  }
}

export default {
  fetch: fetchHandler,
};
