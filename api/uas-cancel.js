import {
  cleanEmail,
  expireMidtransOrder,
  findOrderByOrderId,
  getMidtransStatus,
  isFinalStatus,
  isPaidStatus,
  json,
  markPaidAndMaybeSendReceipt,
  patchOrder,
  readJson,
} from "../server/uas-core.mjs";

async function syncFinalOrderStatus(orderId) {
  const statusPayload = await getMidtransStatus(orderId);
  return markPaidAndMaybeSendReceipt(orderId, statusPayload);
}

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

    if (isPaidStatus(order.payment_status, order.fraud_status)) {
      return json(
        {
          error: "already_paid",
          message: order.submitted_at
            ? "Ujian dari pembayaran ini sudah pernah disubmit."
            : "Pembayaran sudah sukses. Ujian akan dibuka.",
          paid: true,
          quizToken: order.submitted_at ? null : order.quiz_token,
          status: order.payment_status,
          submitted: Boolean(order.submitted_at),
        },
        409,
      );
    }

    if (isFinalStatus(order.payment_status)) {
      return json({
        ok: true,
        paid: false,
        status: order.payment_status,
      });
    }

    let payload;

    try {
      payload = await expireMidtransOrder(orderId);
    } catch (error) {
      order = await syncFinalOrderStatus(orderId);

      if (
        isPaidStatus(order?.payment_status, order?.fraud_status) ||
        isFinalStatus(order?.payment_status)
      ) {
        return json({
          ok: true,
          paid: isPaidStatus(order.payment_status, order.fraud_status),
          quizToken:
            isPaidStatus(order.payment_status, order.fraud_status) &&
            !order.submitted_at
              ? order.quiz_token
              : null,
          status: order.payment_status,
          submitted: Boolean(order.submitted_at),
        });
      }

      throw error;
    }

    order = await patchOrder(orderId, {
      fraud_status: payload.fraud_status || null,
      midtrans_payload: payload,
      midtrans_transaction_id:
        payload.transaction_id || order.midtrans_transaction_id || null,
      payment_status: payload.transaction_status || "expire",
    });

    return json({
      ok: true,
      status: order?.payment_status || "expire",
    });
  } catch (error) {
    return json(
      {
        error: "cancel_failed",
        message: error.message,
      },
      500,
    );
  }
}

export default {
  fetch: fetchHandler,
};
