import Medusa from "@medusajs/js-sdk";

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export const medusa = new Medusa({
  baseUrl: MEDUSA_URL,
  publishableKey: PUBLISHABLE_KEY,
  debug: process.env.NODE_ENV === "development",
});

export default medusa;
