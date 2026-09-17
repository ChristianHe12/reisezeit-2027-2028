// Herkunftsländer der Reisenden ("wer hat wann frei / reist viel").
// weight = grobe, kuratierte Größenordnung des Outbound-Reisevolumens (1–10, keine amtliche Statistik).
// school: 'openholidays' -> Schulferien über OpenHolidaysAPI (openholidaysapi.org, ISO-Code passt).
//         'curated'      -> keine freie Schulferien-API verfügbar; grobe, dokumentierte Reise-Saisonkurve.
//         'none'         -> nur Feiertage (Nager.Date) als Signal, keine Schulferien-/Saisonkurve.
export type TravelMarket = {
  code: string;
  name: string;
  weight: number;
  school: 'openholidays' | 'curated' | 'none';
  curatedTravelShare?: number[]; // 12 Werte (Jan..Dez), 0–100: Anteil der Bevölkerung, der in dem Monat typischerweise reist
};

export const TRAVEL_MARKETS: TravelMarket[] = [
  // Europa (OpenHolidaysAPI deckt Schulferien ab)
  { code: 'AT', name: 'Österreich', weight: 3, school: 'openholidays' },
  { code: 'FR', name: 'Frankreich', weight: 6, school: 'openholidays' },
  { code: 'IT', name: 'Italien', weight: 5, school: 'openholidays' },
  { code: 'ES', name: 'Spanien', weight: 4, school: 'openholidays' },
  { code: 'NL', name: 'Niederlande', weight: 4, school: 'openholidays' },
  { code: 'BE', name: 'Belgien', weight: 3, school: 'openholidays' },
  { code: 'LU', name: 'Luxemburg', weight: 1, school: 'openholidays' },
  { code: 'PL', name: 'Polen', weight: 4, school: 'openholidays' },
  { code: 'CZ', name: 'Tschechien', weight: 2, school: 'openholidays' },
  { code: 'PT', name: 'Portugal', weight: 2, school: 'openholidays' },
  { code: 'HU', name: 'Ungarn', weight: 2, school: 'openholidays' },
  { code: 'RO', name: 'Rumänien', weight: 2, school: 'openholidays' },
  { code: 'HR', name: 'Kroatien', weight: 1, school: 'openholidays' },
  { code: 'IE', name: 'Irland', weight: 2, school: 'openholidays' },
  { code: 'SE', name: 'Schweden', weight: 3, school: 'openholidays' },
  { code: 'SI', name: 'Slowenien', weight: 1, school: 'openholidays' },
  { code: 'SK', name: 'Slowakei', weight: 1, school: 'openholidays' },
  { code: 'BR', name: 'Brasilien', weight: 3, school: 'openholidays' },
  { code: 'MX', name: 'Mexiko', weight: 3, school: 'openholidays' },
  { code: 'ZA', name: 'Südafrika', weight: 1, school: 'openholidays' },

  // Keine Schulferien-API, aber relevant per Feiertage
  { code: 'GB', name: 'Vereinigtes Königreich', weight: 6, school: 'curated', curatedTravelShare: [45, 40, 35, 55, 45, 55, 80, 85, 45, 55, 35, 65] },
  { code: 'DK', name: 'Dänemark', weight: 2, school: 'none' },
  { code: 'NO', name: 'Norwegen', weight: 2, school: 'none' },
  { code: 'FI', name: 'Finnland', weight: 2, school: 'none' },
  { code: 'CA', name: 'Kanada', weight: 4, school: 'curated', curatedTravelShare: [35, 35, 35, 40, 45, 60, 85, 85, 55, 40, 35, 55] },

  // Große außereuropäische Reisemärkte ohne freie Schulferien-API: kuratierte Saisonkurve
  // (Golden Week / Chunyun, Thanksgiving/Summer, Obon/Golden Week, Diwali/Summer, Jan-Ferien etc.)
  { code: 'US', name: 'USA', weight: 9, school: 'curated', curatedTravelShare: [45, 30, 40, 40, 35, 70, 90, 85, 40, 40, 55, 80] },
  { code: 'CN', name: 'China', weight: 10, school: 'curated', curatedTravelShare: [70, 85, 30, 45, 50, 30, 55, 60, 55, 90, 30, 35] },
  { code: 'JP', name: 'Japan', weight: 4, school: 'curated', curatedTravelShare: [55, 30, 45, 55, 85, 30, 40, 80, 30, 45, 40, 55] },
  { code: 'KR', name: 'Südkorea', weight: 3, school: 'curated', curatedTravelShare: [50, 60, 30, 30, 35, 30, 55, 70, 45, 40, 30, 45] },
  { code: 'RU', name: 'Russland', weight: 4, school: 'curated', curatedTravelShare: [55, 30, 30, 30, 40, 55, 80, 75, 40, 30, 30, 55] },
  { code: 'IN', name: 'Indien', weight: 4, school: 'curated', curatedTravelShare: [45, 35, 30, 35, 55, 65, 40, 35, 35, 60, 70, 55] },
  { code: 'AU', name: 'Australien', weight: 3, school: 'curated', curatedTravelShare: [70, 40, 35, 45, 30, 30, 45, 30, 35, 35, 40, 75] },
];

export const CH_TRAVEL_WEIGHT = 3;
export const DE_TRAVEL_WEIGHT = 8;
