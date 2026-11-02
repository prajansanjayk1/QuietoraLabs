export const SITE_NAME = "QuietoraLabs";
export const LINKEDIN_URL = "https://www.linkedin.com/company/quietoralabs/";
export const CONTACT_PHONE = "+91 7603933715";
export const CONTACT_PHONE_TEL = "tel:+917603933715";
export const WHATSAPP_URL = "https://wa.me/917603933715";

export function pageMeta(title: string, description: string) {
  const full = title.includes("QuietoraLabs") ? title : `${title} — QuietoraLabs`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: full },
      { name: "twitter:description", content: description },
    ],
  };
}
