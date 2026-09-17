// Reiseziele mit Referenzkoordinate (für Klimadaten) und einer kuratierten touristischen
// Hochsaison-Kurve (0-100 je Monat, Jan..Dez). Das ist ein Erfahrungsmodell aus bekannten
// Saisonmustern (Trockenzeit, Schulferien vor Ort, Klima) – KEINE echte Besucherstatistik.
// Zweck: verhindern, dass z. B. Thailand im Dezember/Januar als "wenig Menschen" erscheint,
// nur weil in Europa keine Schulferien mit dieser Zeit überlappen.
export type Continent = 'Europa' | 'Asien' | 'Afrika' | 'Nordamerika' | 'Südamerika' | 'Ozeanien';
export type Destination = {
  code: string;
  name: string;
  continent: Continent;
  lat: number;
  lon: number;
  peakSeason: number[]; // 12 Werte Jan..Dez, 0-100
  note?: string;
};

export const DESTINATIONS: Destination[] = [
  // Europa
  { code: 'DE', name: 'Deutschland', continent: 'Europa', lat: 52.52, lon: 13.405, peakSeason: [20, 20, 25, 30, 40, 55, 85, 90, 60, 35, 25, 45] },
  { code: 'AT', name: 'Österreich', continent: 'Europa', lat: 47.5162, lon: 14.5501, peakSeason: [55, 60, 45, 30, 35, 45, 80, 85, 45, 30, 30, 60] },
  { code: 'CH', name: 'Schweiz', continent: 'Europa', lat: 46.948, lon: 7.4474, peakSeason: [60, 65, 45, 30, 35, 45, 80, 85, 45, 30, 30, 65] },
  { code: 'FR', name: 'Frankreich', continent: 'Europa', lat: 48.8566, lon: 2.3522, peakSeason: [30, 45, 35, 35, 40, 50, 85, 95, 55, 35, 30, 45] },
  { code: 'IT', name: 'Italien', continent: 'Europa', lat: 41.9028, lon: 12.4964, peakSeason: [30, 35, 45, 60, 70, 75, 90, 95, 70, 55, 35, 30] },
  { code: 'ES', name: 'Spanien', continent: 'Europa', lat: 40.4168, lon: -3.7038, peakSeason: [30, 35, 45, 55, 65, 75, 90, 95, 70, 55, 35, 30] },
  { code: 'PT', name: 'Portugal', continent: 'Europa', lat: 38.7223, lon: -9.1393, peakSeason: [30, 35, 45, 55, 65, 75, 90, 95, 70, 55, 35, 30] },
  { code: 'GR', name: 'Griechenland', continent: 'Europa', lat: 37.9838, lon: 23.7275, peakSeason: [25, 30, 40, 55, 65, 75, 90, 95, 75, 55, 35, 25] },
  { code: 'HR', name: 'Kroatien', continent: 'Europa', lat: 43.5081, lon: 16.4402, peakSeason: [15, 15, 20, 30, 45, 70, 90, 95, 70, 40, 20, 15] },
  { code: 'NL', name: 'Niederlande', continent: 'Europa', lat: 52.3676, lon: 4.9041, peakSeason: [35, 35, 45, 55, 65, 75, 80, 80, 60, 45, 35, 45] },
  { code: 'BE', name: 'Belgien', continent: 'Europa', lat: 50.8503, lon: 4.3517, peakSeason: [30, 30, 40, 50, 60, 70, 80, 80, 60, 40, 30, 40] },
  { code: 'GB', name: 'Vereinigtes Königreich', continent: 'Europa', lat: 51.5074, lon: -0.1278, peakSeason: [35, 35, 40, 50, 60, 70, 80, 85, 65, 45, 35, 50] },
  { code: 'IE', name: 'Irland', continent: 'Europa', lat: 53.3498, lon: -6.2603, peakSeason: [25, 25, 35, 45, 55, 70, 80, 80, 60, 40, 25, 30] },
  { code: 'DK', name: 'Dänemark', continent: 'Europa', lat: 55.6761, lon: 12.5683, peakSeason: [25, 25, 30, 40, 55, 70, 85, 85, 60, 35, 25, 35] },
  { code: 'SE', name: 'Schweden', continent: 'Europa', lat: 59.3293, lon: 18.0686, peakSeason: [20, 20, 25, 35, 55, 75, 90, 85, 55, 30, 20, 30] },
  { code: 'NO', name: 'Norwegen', continent: 'Europa', lat: 59.9139, lon: 10.7522, peakSeason: [20, 20, 25, 35, 50, 75, 90, 85, 55, 30, 20, 30] },
  { code: 'FI', name: 'Finnland', continent: 'Europa', lat: 60.1699, lon: 24.9384, peakSeason: [25, 25, 30, 35, 45, 65, 85, 80, 50, 30, 25, 35] },
  { code: 'IS', name: 'Island', continent: 'Europa', lat: 64.1466, lon: -21.9426, peakSeason: [30, 25, 25, 30, 45, 80, 95, 90, 55, 30, 25, 35] },
  { code: 'PL', name: 'Polen', continent: 'Europa', lat: 52.2297, lon: 21.0122, peakSeason: [20, 20, 30, 40, 50, 65, 80, 80, 55, 35, 25, 35] },
  { code: 'CZ', name: 'Tschechien', continent: 'Europa', lat: 50.0755, lon: 14.4378, peakSeason: [30, 30, 40, 55, 65, 75, 85, 85, 65, 45, 30, 45] },
  { code: 'HU', name: 'Ungarn', continent: 'Europa', lat: 47.4979, lon: 19.0402, peakSeason: [25, 25, 35, 50, 60, 70, 85, 85, 60, 40, 25, 35] },
  { code: 'RO', name: 'Rumänien', continent: 'Europa', lat: 44.4268, lon: 26.1025, peakSeason: [20, 20, 30, 40, 50, 65, 80, 80, 55, 35, 20, 30] },
  { code: 'TR', name: 'Türkei', continent: 'Europa', lat: 36.8969, lon: 30.7133, peakSeason: [30, 30, 40, 55, 70, 85, 95, 95, 80, 55, 35, 30] },

  // Asien
  { code: 'TH', name: 'Thailand', continent: 'Asien', lat: 13.7563, lon: 100.5018, peakSeason: [95, 90, 70, 60, 45, 40, 40, 40, 45, 50, 80, 95], note: 'Trockenzeit Nov-Feb = touristische Hochsaison' },
  { code: 'VN', name: 'Vietnam', continent: 'Asien', lat: 16.0544, lon: 108.2022, peakSeason: [85, 80, 70, 55, 45, 40, 35, 35, 45, 55, 70, 85] },
  { code: 'ID', name: 'Indonesien (Bali)', continent: 'Asien', lat: -8.65, lon: 115.2167, peakSeason: [70, 60, 50, 55, 60, 75, 90, 90, 75, 60, 55, 75] },
  { code: 'MY', name: 'Malaysia', continent: 'Asien', lat: 3.139, lon: 101.6869, peakSeason: [55, 55, 50, 50, 50, 55, 60, 65, 55, 50, 50, 60] },
  { code: 'SG', name: 'Singapur', continent: 'Asien', lat: 1.3521, lon: 103.8198, peakSeason: [60, 55, 50, 50, 50, 55, 60, 65, 55, 50, 55, 70] },
  { code: 'PH', name: 'Philippinen', continent: 'Asien', lat: 14.5995, lon: 120.9842, peakSeason: [85, 80, 75, 65, 60, 45, 40, 40, 45, 50, 60, 80] },
  { code: 'IN', name: 'Indien', continent: 'Asien', lat: 28.6139, lon: 77.209, peakSeason: [85, 80, 60, 40, 25, 20, 20, 25, 35, 60, 80, 90], note: 'Kühle Trockenzeit Okt-Mär bevorzugt, Monsun/Hitze im Sommer gemieden' },
  { code: 'LK', name: 'Sri Lanka', continent: 'Asien', lat: 6.9271, lon: 79.8612, peakSeason: [90, 85, 60, 50, 40, 35, 40, 45, 45, 50, 60, 85] },
  { code: 'MV', name: 'Malediven', continent: 'Asien', lat: 4.1755, lon: 73.5093, peakSeason: [90, 85, 75, 70, 55, 45, 45, 50, 55, 60, 75, 90] },
  { code: 'NP', name: 'Nepal', continent: 'Asien', lat: 27.7172, lon: 85.324, peakSeason: [40, 45, 60, 75, 50, 30, 25, 25, 45, 90, 80, 45], note: 'Beste Trekking-Fenster Okt/Nov und Mär/Apr' },
  { code: 'CN', name: 'China', continent: 'Asien', lat: 39.9042, lon: 116.4074, peakSeason: [55, 70, 45, 60, 55, 45, 50, 55, 65, 90, 45, 45], note: 'Chunyun (Neujahr) und Golden Week (Okt) sind lokale Reisespitzen' },
  { code: 'JP', name: 'Japan', continent: 'Asien', lat: 35.6762, lon: 139.6503, peakSeason: [55, 40, 80, 90, 70, 45, 55, 80, 50, 75, 65, 50], note: 'Kirschblüte (Mär-Apr), Golden Week (Mai), Obon (Aug), Herbstlaub (Okt/Nov)' },
  { code: 'KR', name: 'Südkorea', continent: 'Asien', lat: 37.5665, lon: 126.978, peakSeason: [35, 35, 55, 75, 60, 50, 70, 75, 45, 70, 40, 45] },
  { code: 'AE', name: 'Vereinigte Arabische Emirate', continent: 'Asien', lat: 25.2048, lon: 55.2708, peakSeason: [90, 85, 70, 55, 35, 25, 25, 30, 40, 60, 80, 90], note: 'Winter bevorzugt, Sommer sehr heiß' },
  { code: 'IL', name: 'Israel', continent: 'Asien', lat: 31.7683, lon: 35.2137, peakSeason: [45, 45, 55, 70, 60, 55, 65, 70, 60, 55, 45, 55] },
  { code: 'JO', name: 'Jordanien', continent: 'Asien', lat: 31.9454, lon: 35.9284, peakSeason: [45, 50, 60, 70, 55, 45, 50, 55, 65, 70, 55, 45] },

  // Afrika
  { code: 'MA', name: 'Marokko', continent: 'Afrika', lat: 31.6295, lon: -7.9811, peakSeason: [55, 60, 70, 80, 70, 50, 40, 40, 60, 75, 65, 55] },
  { code: 'EG', name: 'Ägypten', continent: 'Afrika', lat: 30.0444, lon: 31.2357, peakSeason: [85, 80, 70, 60, 45, 30, 25, 25, 35, 55, 75, 90] },
  { code: 'ZA', name: 'Südafrika', continent: 'Afrika', lat: -33.9249, lon: 18.4241, peakSeason: [90, 85, 60, 45, 35, 30, 30, 35, 45, 55, 70, 90], note: 'Südhalbkugel: Sommer Dez-Feb ist Hochsaison' },
  { code: 'KE', name: 'Kenia', continent: 'Afrika', lat: -1.2921, lon: 36.8219, peakSeason: [65, 65, 50, 35, 35, 75, 90, 90, 70, 50, 40, 65], note: 'Große Migration Jun-Okt zusätzlich zu Dez/Jan' },
  { code: 'TZ', name: 'Tansania', continent: 'Afrika', lat: -3.3869, lon: 36.683, peakSeason: [65, 65, 50, 35, 35, 75, 90, 90, 70, 50, 40, 65] },
  { code: 'MU', name: 'Mauritius', continent: 'Afrika', lat: -20.1609, lon: 57.5012, peakSeason: [55, 50, 55, 60, 65, 60, 60, 60, 60, 70, 75, 70] },
  { code: 'NA', name: 'Namibia', continent: 'Afrika', lat: -22.5594, lon: 17.0832, peakSeason: [40, 40, 45, 55, 65, 80, 85, 85, 75, 60, 45, 40] },

  // Nordamerika
  { code: 'US', name: 'USA', continent: 'Nordamerika', lat: 38.9072, lon: -77.0369, peakSeason: [55, 45, 50, 55, 60, 80, 90, 85, 60, 55, 60, 80], note: 'Referenzpunkt Washington D.C.; Sommer + Thanksgiving/Weihnachten als Spitzen' },
  { code: 'CA', name: 'Kanada', continent: 'Nordamerika', lat: 45.4215, lon: -75.6972, peakSeason: [35, 35, 35, 40, 50, 75, 90, 85, 65, 45, 35, 45] },
  { code: 'MX', name: 'Mexiko (Cancún)', continent: 'Nordamerika', lat: 21.1619, lon: -86.8515, peakSeason: [85, 80, 85, 75, 60, 50, 55, 55, 50, 50, 65, 85] },
  { code: 'CR', name: 'Costa Rica', continent: 'Nordamerika', lat: 9.9281, lon: -84.0907, peakSeason: [90, 90, 85, 75, 55, 45, 50, 50, 45, 45, 60, 85] },
  { code: 'CU', name: 'Kuba', continent: 'Nordamerika', lat: 23.1136, lon: -82.3666, peakSeason: [85, 85, 80, 70, 55, 45, 50, 50, 50, 55, 65, 85] },
  { code: 'DO', name: 'Dominikanische Republik', continent: 'Nordamerika', lat: 18.4861, lon: -69.9312, peakSeason: [85, 80, 80, 70, 60, 55, 55, 55, 55, 55, 65, 85] },
  { code: 'JM', name: 'Jamaika', continent: 'Nordamerika', lat: 17.9712, lon: -76.7936, peakSeason: [85, 80, 80, 70, 60, 55, 55, 55, 55, 55, 65, 85] },

  // Südamerika
  { code: 'BR', name: 'Brasilien', continent: 'Südamerika', lat: -22.9068, lon: -43.1729, peakSeason: [90, 85, 60, 45, 35, 35, 55, 45, 40, 45, 60, 90], note: 'Südhalbkugel: Karneval (Feb/Mär) und Dez-Feb Hochsaison' },
  { code: 'AR', name: 'Argentinien', continent: 'Südamerika', lat: -34.6037, lon: -58.3816, peakSeason: [85, 80, 55, 40, 30, 30, 45, 40, 35, 45, 60, 85] },
  { code: 'CL', name: 'Chile', continent: 'Südamerika', lat: -33.4489, lon: -70.6693, peakSeason: [80, 80, 55, 40, 35, 45, 55, 45, 40, 45, 55, 80] },
  { code: 'PE', name: 'Peru (Cusco)', continent: 'Südamerika', lat: -13.5319, lon: -71.9675, peakSeason: [40, 35, 45, 55, 70, 85, 90, 90, 75, 55, 45, 40], note: 'Trockenzeit Mai-Sep für Machu Picchu bevorzugt' },
  { code: 'CO', name: 'Kolumbien', continent: 'Südamerika', lat: 4.711, lon: -74.0721, peakSeason: [75, 70, 55, 45, 45, 50, 70, 65, 45, 45, 50, 80] },
  { code: 'EC', name: 'Ecuador', continent: 'Südamerika', lat: -0.1807, lon: -78.4678, peakSeason: [70, 60, 45, 40, 45, 55, 80, 80, 60, 45, 45, 70] },

  // Ozeanien
  { code: 'AU', name: 'Australien', continent: 'Ozeanien', lat: -33.8688, lon: 151.2093, peakSeason: [90, 85, 60, 45, 35, 30, 35, 40, 45, 55, 65, 90], note: 'Südhalbkugel: Sommer Dez-Feb Hochsaison' },
  { code: 'NZ', name: 'Neuseeland', continent: 'Ozeanien', lat: -36.8485, lon: 174.7633, peakSeason: [85, 80, 55, 40, 35, 45, 50, 45, 45, 50, 60, 85] },
  { code: 'FJ', name: 'Fidschi', continent: 'Ozeanien', lat: -18.1416, lon: 178.4419, peakSeason: [55, 50, 45, 45, 60, 75, 85, 85, 75, 60, 50, 55] },
];

export const DESTINATION_BY_CODE: Record<string, Destination> = Object.fromEntries(DESTINATIONS.map(d => [d.code, d]));
