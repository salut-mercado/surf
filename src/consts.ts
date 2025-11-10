import clientLibPackage from "@salut-mercado/octo-client/package.json";

// export const FEEDBACK_PHONE = "34664566837";
export const FEEDBACK_PHONE = "33748641722";
export const FEEDBACK_URL_BASE = `https://api.whatsapp.com/send?phone=${FEEDBACK_PHONE}&text=`;
export const APP_VERSION = clientLibPackage.version;
