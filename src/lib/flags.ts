/** FIFA country names and flagcdn.com ISO codes (alpha-2 lowercase). */
export const COUNTRY_META: Record<
  string,
  { fifaName: string; flagCode: string; primary: string; secondary: string }
> = {
  ALG: { fifaName: "Algeria", flagCode: "dz", primary: "#006233", secondary: "#FFFFFF" },
  ARG: { fifaName: "Argentina", flagCode: "ar", primary: "#74ACDF", secondary: "#FFFFFF" },
  AUS: { fifaName: "Australia", flagCode: "au", primary: "#FFCD00", secondary: "#00843D" },
  AUT: { fifaName: "Austria", flagCode: "at", primary: "#ED2939", secondary: "#FFFFFF" },
  BEL: { fifaName: "Belgium", flagCode: "be", primary: "#EF3340", secondary: "#FAE042" },
  BIH: { fifaName: "Bosnia and Herzegovina", flagCode: "ba", primary: "#002395", secondary: "#FECB00" },
  BRA: { fifaName: "Brazil", flagCode: "br", primary: "#009C3B", secondary: "#FFDF00" },
  CAN: { fifaName: "Canada", flagCode: "ca", primary: "#FF0000", secondary: "#FFFFFF" },
  COD: { fifaName: "DR Congo", flagCode: "cd", primary: "#007FFF", secondary: "#F7D618" },
  COL: { fifaName: "Colombia", flagCode: "co", primary: "#FCD116", secondary: "#003893" },
  CPV: { fifaName: "Cabo Verde", flagCode: "cv", primary: "#003893", secondary: "#FFFFFF" },
  CRO: { fifaName: "Croatia", flagCode: "hr", primary: "#FF0000", secondary: "#FFFFFF" },
  CIV: { fifaName: "Côte d'Ivoire", flagCode: "ci", primary: "#FF8200", secondary: "#009A44" },
  CUW: { fifaName: "Curaçao", flagCode: "cw", primary: "#002B7F", secondary: "#F9E814" },
  CZE: { fifaName: "Czechia", flagCode: "cz", primary: "#11457E", secondary: "#D7141A" },
  ECU: { fifaName: "Ecuador", flagCode: "ec", primary: "#FFD100", secondary: "#003087" },
  EGY: { fifaName: "Egypt", flagCode: "eg", primary: "#CE1126", secondary: "#FFFFFF" },
  ENG: { fifaName: "England", flagCode: "gb-eng", primary: "#FFFFFF", secondary: "#CE1124" },
  ESP: { fifaName: "Spain", flagCode: "es", primary: "#AA151B", secondary: "#F1BF00" },
  FRA: { fifaName: "France", flagCode: "fr", primary: "#002395", secondary: "#ED2939" },
  GER: { fifaName: "Germany", flagCode: "de", primary: "#000000", secondary: "#DD0000" },
  GHA: { fifaName: "Ghana", flagCode: "gh", primary: "#006B3F", secondary: "#FCD116" },
  HAI: { fifaName: "Haiti", flagCode: "ht", primary: "#00209F", secondary: "#D21034" },
  IRN: { fifaName: "IR Iran", flagCode: "ir", primary: "#239F40", secondary: "#FFFFFF" },
  IRQ: { fifaName: "Iraq", flagCode: "iq", primary: "#CE1126", secondary: "#FFFFFF" },
  JOR: { fifaName: "Jordan", flagCode: "jo", primary: "#007A3D", secondary: "#000000" },
  JPN: { fifaName: "Japan", flagCode: "jp", primary: "#BC002D", secondary: "#FFFFFF" },
  KOR: { fifaName: "Republic of Korea", flagCode: "kr", primary: "#CD2E3A", secondary: "#0047A0" },
  MAR: { fifaName: "Morocco", flagCode: "ma", primary: "#C1272D", secondary: "#006233" },
  MEX: { fifaName: "Mexico", flagCode: "mx", primary: "#006847", secondary: "#CE1126" },
  NED: { fifaName: "Netherlands", flagCode: "nl", primary: "#FF6600", secondary: "#21468B" },
  NOR: { fifaName: "Norway", flagCode: "no", primary: "#BA0C2F", secondary: "#00205B" },
  NZL: { fifaName: "New Zealand", flagCode: "nz", primary: "#000000", secondary: "#FFFFFF" },
  PAN: { fifaName: "Panama", flagCode: "pa", primary: "#DA121A", secondary: "#072357" },
  PAR: { fifaName: "Paraguay", flagCode: "py", primary: "#D52B1E", secondary: "#0038A8" },
  POR: { fifaName: "Portugal", flagCode: "pt", primary: "#006600", secondary: "#FF0000" },
  QAT: { fifaName: "Qatar", flagCode: "qa", primary: "#8A1538", secondary: "#FFFFFF" },
  RSA: { fifaName: "South Africa", flagCode: "za", primary: "#007A4D", secondary: "#FFB612" },
  SAU: { fifaName: "Saudi Arabia", flagCode: "sa", primary: "#006C35", secondary: "#FFFFFF" },
  SCO: { fifaName: "Scotland", flagCode: "gb-sct", primary: "#005EB8", secondary: "#FFFFFF" },
  SEN: { fifaName: "Senegal", flagCode: "sn", primary: "#00853F", secondary: "#FDEF42" },
  SUI: { fifaName: "Switzerland", flagCode: "ch", primary: "#FF0000", secondary: "#FFFFFF" },
  SWE: { fifaName: "Sweden", flagCode: "se", primary: "#006AA7", secondary: "#FECC00" },
  TUN: { fifaName: "Tunisia", flagCode: "tn", primary: "#E70013", secondary: "#FFFFFF" },
  TUR: { fifaName: "Türkiye", flagCode: "tr", primary: "#E30A17", secondary: "#FFFFFF" },
  URU: { fifaName: "Uruguay", flagCode: "uy", primary: "#0038A8", secondary: "#FFFFFF" },
  USA: { fifaName: "USA", flagCode: "us", primary: "#002868", secondary: "#BF0A30" },
  UZB: { fifaName: "Uzbekistan", flagCode: "uz", primary: "#1EB53A", secondary: "#0099B5" },
};

export function resolveFlagCode(tla: string): string {
  return COUNTRY_META[tla]?.flagCode ?? tla.toLowerCase();
}

/** Unicode subregional flags (England, Scotland). */
const SUBREGIONAL_EMOJI: Record<string, string> = {
  "gb-eng": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
  "gb-sct": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
};

function isoToEmoji(iso: string): string {
  if (SUBREGIONAL_EMOJI[iso]) return SUBREGIONAL_EMOJI[iso];
  if (iso.length !== 2) return "🏳️";
  return String.fromCodePoint(
    ...iso.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0))
  );
}

/** Unicode flag emoji for a FIFA TLA — no external images. */
export function flagEmoji(tla: string): string {
  const code = resolveFlagCode(tla);
  return isoToEmoji(code);
}

/** @deprecated Use flagEmoji — kept for crest field compatibility */
export function flagUrl(tla: string, _width = 80): string {
  return flagEmoji(tla);
}

export function fifaName(tla: string, fallback: string): string {
  return COUNTRY_META[tla]?.fifaName ?? fallback;
}

export function kitColors(tla: string): { primary: string; secondary: string } {
  const meta = COUNTRY_META[tla];
  return {
    primary: meta?.primary ?? "#1a1a2e",
    secondary: meta?.secondary ?? "#ffd700",
  };
}

export const ALL_TLAS = Object.keys(COUNTRY_META);
