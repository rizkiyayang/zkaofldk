import {
  cleanEmail,
  findOrderByOrderId,
  midtransAuthHeader,
} from "../server/uas-core.mjs";

async function fetchHandler(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return Response.json({ error: "method_not_allowed" }, { status: 405 });
  }

  try {
    const url = new URL(request.url);
    const orderId = String(url.searchParams.get("orderId") || "").trim();
    const email = cleanEmail(url.searchParams.get("email"));

    if (!orderId || !email) {
      return Response.json({ error: "order_and_email_required" }, { status: 400 });
    }

    const order = await findOrderByOrderId(orderId);

    if (!order || order.email !== email) {
      return Response.json({ error: "order_not_found" }, { status: 404 });
    }

    const qrAction =
      order.midtrans_payload?.actions?.find(
        (action) => action.name === "generate-qr-code" && action.url,
      ) ||
      order.midtrans_payload?.actions?.find((action) =>
        /qr-code/i.test(action.url || ""),
      );

    if (!qrAction) {
      return Response.json({ error: "qris_not_available" }, { status: 404 });
    }

    const qrResponse = await fetch(qrAction.url, {
      headers: {
        Accept: "image/png,image/*",
        Authorization: midtransAuthHeader(),
      },
    });

    if (!qrResponse.ok) {
      return Response.json(
        { error: "qris_fetch_failed" },
        { status: qrResponse.status },
      );
    }

    if (request.method === "HEAD") {
      return new Response(null, {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": qrResponse.headers.get("content-type") || "image/png",
        },
      });
    }

    return new Response(await qrResponse.arrayBuffer(), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": qrResponse.headers.get("content-type") || "image/png",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: "qris_proxy_failed",
        message: error.message,
      },
      { status: 500 },
    );
  }
}

export default {
  fetch: fetchHandler,
};
