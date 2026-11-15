export const DEFAULT_SETTINGS = {
  contact_email: "info@mbinga.com",
  contact_whatsapp: "+27 66 457 0911",
  // Upward buffer applied on top of the live USD/ZAR rate before rounding,
  // to protect Rand selling value against market fluctuation.
  usd_zar_margin_percent: "6",
};

export type SettingsKey = keyof typeof DEFAULT_SETTINGS;
