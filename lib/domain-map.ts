/**
 * Maps email domains → grocer IDs.
 * Multiple domains can map to the same grocer (e.g. Albertsons' many banners).
 */
const EXACT_DOMAIN_MAP: Record<string, string> = {
  // Walmart
  "walmart.com": "walmart",
  "wal-mart.com": "walmart",
  "samsclub.com": "walmart",

  // Kroger
  "kroger.com": "kroger",
  "krogerstorefeedback.com": "kroger",
  "fredmeyer.com": "kroger",
  "harristeeter.com": "kroger",
  "kingsoopers.com": "kroger",
  "smithsfoodanddrug.com": "kroger",
  "ralphs.com": "kroger",
  "frys食品.com": "kroger",
  "citymarket.com": "kroger",
  "dillons.com": "kroger",
  "marianos.com": "kroger",
  "qfc.com": "kroger",

  // Costco
  "costco.com": "costco",
  "costcotravel.com": "costco",

  // Albertsons
  "albertsons.com": "albertsons",
  "safeway.com": "albertsons",
  "vons.com": "albertsons",
  "jewelosco.com": "albertsons",
  "shaws.com": "albertsons",
  "acmemarkets.com": "albertsons",
  "tomthumb.com": "albertsons",
  "randalls.com": "albertsons",
  "unitedsupermarkets.com": "albertsons",
  "marketstreetunited.com": "albertsons",
  "pavilions.com": "albertsons",
  "carrs.com": "albertsons",

  // Aldi
  "aldi.us": "aldi",
  "aldi.com": "aldi",

  // Amazon / Whole Foods
  "amazon.com": "amazon-whole-foods",
  "wholefoodsmarket.com": "amazon-whole-foods",
  "wholefoods.com": "amazon-whole-foods",
  "amazonfresh.com": "amazon-whole-foods",
  "wfm.com": "amazon-whole-foods",

  // Publix
  "publix.com": "publix",

  // Target
  "target.com": "target",

  // H-E-B
  "heb.com": "heb",
  "centralmarket.com": "heb",
  "mih.com": "heb",   // Mi Tienda (H-E-B subsidiary)

  // Meijer
  "meijer.com": "meijer",
};

/**
 * Keyword fragments used as a fallback when no exact domain match is found.
 * Checks if the domain *contains* the keyword.
 */
const KEYWORD_MAP: { keyword: string; grocerId: string }[] = [
  { keyword: "walmart", grocerId: "walmart" },
  { keyword: "kroger", grocerId: "kroger" },
  { keyword: "costco", grocerId: "costco" },
  { keyword: "albertsons", grocerId: "albertsons" },
  { keyword: "safeway", grocerId: "albertsons" },
  { keyword: "aldi", grocerId: "aldi" },
  { keyword: "wholefood", grocerId: "amazon-whole-foods" },
  { keyword: "amazon", grocerId: "amazon-whole-foods" },
  { keyword: "publix", grocerId: "publix" },
  { keyword: "target", grocerId: "target" },
  { keyword: "heb", grocerId: "heb" },
  { keyword: "meijer", grocerId: "meijer" },
];

/**
 * Given an email address, returns the matching grocer ID or null.
 */
export function getGrocerIdFromEmail(email: string): string | null {
  const lower = email.toLowerCase().trim();
  const atIndex = lower.indexOf("@");
  if (atIndex === -1) return null;

  const domain = lower.slice(atIndex + 1);
  if (!domain) return null;

  // 1. Exact domain match
  if (EXACT_DOMAIN_MAP[domain]) return EXACT_DOMAIN_MAP[domain];

  // 2. Keyword fallback (domain contains the keyword)
  for (const { keyword, grocerId } of KEYWORD_MAP) {
    if (domain.includes(keyword)) return grocerId;
  }

  return null;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
