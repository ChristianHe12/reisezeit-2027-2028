export type MonthlyClimate = { temperature: number; precipitation: number; sunshine: number }; // sunshine in h/Tag
export type ClimateNormals = { lat: number; lon: number; months: MonthlyClimate[]; source: string }; // months[0] = Januar

// Klimareferenz je Zielland: monatliche Normalwerte 1991-2020 (Open-Meteo/ERA5) an einer
// dokumentierten Referenzkoordinate. Ersetzt das alte Kontinent-Modell (ein einziger Punkt für
// ganz Asien/Europa/...) durch eine Koordinate je gewähltem Reiseziel – siehe README-Hinweis
// zur nächsten Ausbaustufe. Ergebnis wird pro Koordinate im Browser gecacht.
export async function fetchMonthlyClimate(lat: number, lon: number): Promise<ClimateNormals | null> {
  const key = `climate-normals-${lat.toFixed(2)}-${lon.toFixed(2)}`;
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=1991-01-01&end_date=2020-12-31&daily=temperature_2m_mean,precipitation_sum,sunshine_duration&timezone=UTC`;
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const d = await r.json();
    const dates: string[] = d.daily?.time ?? [];
    const t: (number | null)[] = d.daily?.temperature_2m_mean ?? [];
    const p: (number | null)[] = d.daily?.precipitation_sum ?? [];
    const s: (number | null)[] = d.daily?.sunshine_duration ?? [];
    if (!dates.length) return null;
    const months: MonthlyClimate[] = Array.from({ length: 12 }, () => ({ temperature: 0, precipitation: 0, sunshine: 0 }));
    const counts = Array.from({ length: 12 }, () => 0);
    for (let i = 0; i < dates.length; i++) {
      if (t[i] == null) continue;
      const m = Number(dates[i].slice(5, 7)) - 1;
      months[m].temperature += t[i] as number;
      months[m].precipitation += p[i] ?? 0;
      months[m].sunshine += (s[i] ?? 0) / 3600;
      counts[m]++;
    }
    for (let m = 0; m < 12; m++) {
      if (counts[m] === 0) continue;
      months[m].temperature /= counts[m];
      months[m].precipitation = months[m].precipitation / counts[m] * 30; // ~monatliche Summe
      months[m].sunshine /= counts[m];
    }
    const result: ClimateNormals = { lat, lon, months, source: `Open-Meteo / ERA5 Reanalyse 1991–2020, ${lat.toFixed(2)},${lon.toFixed(2)}` };
    localStorage.setItem(key, JSON.stringify(result));
    return result;
  } catch {
    return null;
  }
}
