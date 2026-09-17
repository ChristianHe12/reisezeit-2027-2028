export type SchoolHoliday = { region: string; regionName: string; type: string; startDate: string; endDate: string; verified?: boolean };

// openholidaysapi.org: kostenlos, ohne Key, deckt v.a. Europa + BR/MX/ZA ab.
// Ersetzt den früheren schulferien.in-Adapter, der inzwischen einen kostenpflichtigen API-Key verlangt
// und daher nur noch leere Daten lieferte (Bug: "Andere Länder"/Schweiz-Schulferien wirkten wie 0 Faktoren).
export async function fetchSchoolHolidays(country: string, year: number): Promise<SchoolHoliday[]> {
  const key = `openholidays-school-${country}-${year}`;
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);
  try {
    const url = `https://openholidaysapi.org/SchoolHolidays?countryIsoCode=${country}&languageIsoCode=DE&validFrom=${year}-01-01&validTo=${year}-12-31`;
    const r = await fetch(url);
    if (!r.ok) return [];
    const data = await r.json();
    const out: SchoolHoliday[] = (data as any[]).flatMap(h => {
      const name = h.name?.[0]?.text || h.name?.find((n: any) => n.language === 'DE')?.text || 'Schulferien';
      if (h.nationwide || !h.subdivisions?.length) {
        return [{ region: country, regionName: country, type: name, startDate: h.startDate, endDate: h.endDate, verified: true }];
      }
      return h.subdivisions.map((s: any) => ({ region: s.code, regionName: s.shortName || s.code, type: name, startDate: h.startDate, endDate: h.endDate, verified: true }));
    });
    localStorage.setItem(key, JSON.stringify(out));
    return out;
  } catch {
    return [];
  }
}
