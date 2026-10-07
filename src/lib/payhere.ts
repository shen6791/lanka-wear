import { createHash } from "crypto";

const md5 = (s: string) => createHash("md5").update(s).digest("hex").toUpperCase();

export const payhereUrl = (sandbox: boolean) =>
  sandbox ? "https://sandbox.payhere.lk/pay/checkout" : "https://www.payhere.lk/pay/checkout";

export const money = (n: number) => Number(n).toFixed(2);

/** Hash sent with the checkout request. */
export const checkoutHash = (merchantId: string, orderId: string, amount: number, currency: string, secret: string) =>
  md5(merchantId + orderId + money(amount) + currency + md5(secret));

/** Signature PayHere puts on the server-to-server notification. */
export const notifySig = (merchantId: string, orderId: string, amount: string, currency: string, statusCode: string, secret: string) =>
  md5(merchantId + orderId + amount + currency + statusCode + md5(secret));
