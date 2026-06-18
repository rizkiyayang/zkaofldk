import crypto from "node:crypto";

export const MIN_UAS_AMOUNT = 10000;

const PAID_STATUSES = new Set(["capture", "settlement", "free"]);
const FINAL_STATUSES = new Set(["cancel", "deny", "expire", "failure"]);

export function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function cleanName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 40);
}

export function cleanEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .slice(0, 120);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseAmount(value) {
  const amount = Number.parseInt(String(value || "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(amount) ? amount : 0;
}

export function createOrderId() {
  return `UAS-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

export function createQuizToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function isPaidStatus(status, fraudStatus) {
  if (!PAID_STATUSES.has(status)) return false;
  return !fraudStatus || fraudStatus === "accept";
}

export function isFinalStatus(status) {
  return FINAL_STATUSES.has(status);
}

export function verifyMidtransSignature(payload) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return false;

  const input = `${payload.order_id || ""}${payload.status_code || ""}${payload.gross_amount || ""}${serverKey}`;
  const expected = crypto.createHash("sha512").update(input).digest("hex");

  return expected === payload.signature_key;
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export async function supabaseRequest(path, options = {}) {
  const url = requireEnv("SUPABASE_URL")
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/, "");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data?.message || data?.hint || data?.details || response.statusText;
    throw new Error(`Supabase ${response.status}: ${message}`);
  }

  return data;
}

function midtransBaseUrl() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  return isProduction
    ? "https://api.midtrans.com"
    : "https://api.sandbox.midtrans.com";
}

function midtransSnapBaseUrl() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  return isProduction
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";
}

export function midtransAuthHeader() {
  const serverKey = requireEnv("MIDTRANS_SERVER_KEY");
  return `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;
}

function siteUrl(path = "/uas/") {
  return `${(process.env.SITE_URL || "https://zkaofldk.vercel.app").replace(
    /\/$/,
    "",
  )}${path}`;
}

export async function chargeMidtrans({
  amount,
  channel,
  email,
  name,
  orderId,
}) {
  const paymentType = channel === "qris" ? "qris" : "bank_transfer";
  const payload = {
    payment_type: paymentType,
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: name,
      email,
    },
    item_details: [
      {
        id: "uas-valorant",
        name: "UAS Valorant",
        price: amount,
        quantity: 1,
      },
    ],
    custom_expiry: {
      expiry_duration: 60,
      unit: "minute",
    },
    metadata: {
      source: "uas",
    },
  };

  if (paymentType === "bank_transfer") {
    payload.bank_transfer = {
      bank: channel,
    };
  }

  const headers = {
    Accept: "application/json",
    Authorization: midtransAuthHeader(),
    "Content-Type": "application/json",
  };

  if (process.env.SITE_URL) {
    headers["X-Override-Notification"] =
      `${process.env.SITE_URL.replace(/\/$/, "")}/api/uas-midtrans-webhook`;
  }

  const response = await fetch(`${midtransBaseUrl()}/v2/charge`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.status_message || "Midtrans charge failed");
  }

  return data;
}

export async function createSnapTransaction({
  amount,
  email,
  name,
  orderId,
}) {
  const finishUrl = siteUrl("/uas/");
  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: name,
      email,
    },
    item_details: [
      {
        id: "uas-valorant",
        name: "UAS Valorant",
        price: amount,
        quantity: 1,
      },
    ],
    callbacks: {
      finish: finishUrl,
    },
    expiry: {
      duration: 60,
      unit: "minutes",
    },
    metadata: {
      source: "uas",
    },
  };

  const headers = {
    Accept: "application/json",
    Authorization: midtransAuthHeader(),
    "Content-Type": "application/json",
  };

  if (process.env.SITE_URL) {
    headers["X-Override-Notification"] =
      `${process.env.SITE_URL.replace(/\/$/, "")}/api/uas-midtrans-webhook`;
  }

  const response = await fetch(`${midtransSnapBaseUrl()}/snap/v1/transactions`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_messages?.join(" ") || data.status_message || "Midtrans Snap failed");
  }

  return {
    ...data,
    order_id: orderId,
    payment_type: "snap",
    transaction_status: "pending",
  };
}

export async function getMidtransStatus(orderId) {
  const response = await fetch(
    `${midtransBaseUrl()}/v2/${encodeURIComponent(orderId)}/status`,
    {
      headers: {
        Accept: "application/json",
        Authorization: midtransAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.status_message || "Midtrans status failed");
  }

  return data;
}

export async function expireMidtransOrder(orderId) {
  const response = await fetch(
    `${midtransBaseUrl()}/v2/${encodeURIComponent(orderId)}/expire`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: midtransAuthHeader(),
      },
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.status_message || "Midtrans expire failed");
  }

  return data;
}

export function qrisImageUrlFromPayload(midtransPayload = {}) {
  const qrAction =
    midtransPayload.actions?.find(
      (action) => action.name === "generate-qr-code" && action.url,
    ) ||
    midtransPayload.actions?.find((action) =>
      /qr-code/i.test(action.url || ""),
    );

  if (qrAction?.url) return qrAction.url;

  if (
    midtransPayload.payment_type === "qris" &&
    midtransPayload.transaction_id
  ) {
    return `${midtransBaseUrl()}/v2/qris/${encodeURIComponent(
      midtransPayload.transaction_id,
    )}/qr-code`;
  }

  return null;
}

function firstPresent(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "") || null;
}

function extractVirtualAccount(midtransPayload = {}) {
  const va = Array.isArray(midtransPayload.va_numbers)
    ? midtransPayload.va_numbers.find((item) => item?.va_number)
    : null;
  const billKey = firstPresent(midtransPayload.bill_key, midtransPayload.billKey);
  const billerCode = firstPresent(
    midtransPayload.biller_code,
    midtransPayload.billerCode,
  );

  return {
    acquirer: firstPresent(
      midtransPayload.acquirer,
      va?.bank,
      midtransPayload.bank,
      billerCode ? "mandiri" : null,
    ),
    billerCode,
    billKey,
    vaNumber: firstPresent(
      va?.va_number,
      midtransPayload.va_number,
      midtransPayload.permata_va_number,
      midtransPayload.bca_va_number,
      midtransPayload.bni_va_number,
      midtransPayload.bri_va_number,
      midtransPayload.payment_code,
    ),
  };
}

export function extractPaymentInstructions(midtransPayload) {
  const virtualAccount = extractVirtualAccount(midtransPayload);

  return {
    acquirer: virtualAccount.acquirer,
    billerCode: virtualAccount.billerCode,
    billKey: virtualAccount.billKey,
    expiryTime: midtransPayload.expiry_time || null,
    grossAmount: midtransPayload.gross_amount,
    orderId: midtransPayload.order_id,
    paymentType:
      midtransPayload.payment_type || (midtransPayload.redirect_url ? "snap" : null),
    qrImageUrl: qrisImageUrlFromPayload(midtransPayload),
    qrString: midtransPayload.qr_string || null,
    redirectUrl: midtransPayload.redirect_url || null,
    snapToken: midtransPayload.token || null,
    status: midtransPayload.transaction_status,
    transactionId: midtransPayload.transaction_id,
    vaNumber: virtualAccount.vaNumber,
  };
}

export async function findOrderByOrderId(orderId) {
  const rows = await supabaseRequest(
    `uas_orders?select=*&order_id=eq.${encodeURIComponent(orderId)}&limit=1`,
  );
  return rows?.[0] || null;
}

export async function findOrderByToken(token) {
  const rows = await supabaseRequest(
    `uas_orders?select=*&quiz_token=eq.${encodeURIComponent(token)}&limit=1`,
  );
  return rows?.[0] || null;
}

export async function patchOrder(orderId, patch) {
  const rows = await supabaseRequest(
    `uas_orders?order_id=eq.${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      body: patch,
      prefer: "return=representation",
    },
  );
  return rows?.[0] || null;
}

export async function sendReceipt(order) {
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.RESEND_FROM_EMAIL ||
    order.receipt_sent_at
  ) {
    return { sent: false };
  }

  const amount = new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(order.amount || 0);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `uas-receipt-${order.order_id}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [order.email],
      subject: "Struk UAS Valorant",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#3b2430">
          <h2>UAS Valorant</h2>
          <p>Halo ${escapeHtml(order.name)}, pembayaran kamu sudah sukses.</p>
          <table style="border-collapse:collapse">
            <tr><td style="padding:4px 12px 4px 0">Order ID</td><td><strong>${escapeHtml(order.order_id)}</strong></td></tr>
            <tr><td style="padding:4px 12px 4px 0">Nominal</td><td><strong>${amount}</strong></td></tr>
            <tr><td style="padding:4px 12px 4px 0">Status</td><td><strong>Lunas</strong></td></tr>
          </table>
          <p>Semangat ujiannya. Jangan sampai flash diri sendiri ya.</p>
        </div>
      `,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Resend receipt failed");
  }

  await patchOrder(order.order_id, {
    receipt_sent_at: new Date().toISOString(),
  });

  return { id: data.id, sent: true };
}

export async function markPaidAndMaybeSendReceipt(orderId, payload) {
  const paid = isPaidStatus(payload.transaction_status, payload.fraud_status);
  const currentOrder = await findOrderByOrderId(orderId).catch(() => null);
  const existingPayload = currentOrder?.midtrans_payload || {};
  const midtransPayload = {
    ...existingPayload,
    ...payload,
    actions: payload.actions || existingPayload.actions || null,
    permata_va_number:
      payload.permata_va_number || existingPayload.permata_va_number || null,
    qr_string: payload.qr_string || existingPayload.qr_string || null,
    va_numbers: payload.va_numbers || existingPayload.va_numbers || null,
  };
  const patch = {
    fraud_status: midtransPayload.fraud_status || null,
    midtrans_payload: midtransPayload,
    midtrans_transaction_id: midtransPayload.transaction_id || null,
    payment_status: midtransPayload.transaction_status || "pending",
  };

  if (paid) {
    patch.paid_at = new Date().toISOString();
  }

  const order = await patchOrder(orderId, patch);

  if (order && paid) {
    try {
      await sendReceipt(order);
    } catch {
      return order;
    }
  }

  return order;
}

export function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
