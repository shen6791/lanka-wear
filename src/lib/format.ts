export const lkr = (n: number) =>
  "Rs. " + Number(n).toLocaleString("en-LK", { maximumFractionDigits: 0 });

export const DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota",
  "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle",
] as const;

export const COLOMBO_AREA = ["Colombo", "Gampaha", "Kalutara"];

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
}

export function normalizePhone(p: string) {
  const d = p.replace(/[^\d+]/g, "");
  if (d.startsWith("+94")) return "0" + d.slice(3);
  if (d.startsWith("94") && d.length === 11) return "0" + d.slice(2);
  return d;
}

export const isLkMobile = (p: string) => /^0(7\d)\d{7}$/.test(normalizePhone(p));

export const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
