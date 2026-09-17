# Reisezeit 2027–2028

Kleine React/TypeScript/Vite-App für eine nachvollziehbare Reisezeit-Heatmap.

## Start

```bash
npm install
npm run dev
```

## Architektur

- `src/data/destinations.ts`: ~60 Reiseländer mit Referenzkoordinate und kuratierter touristischer Hochsaison-Kurve (0-100 je Monat).
- `src/data/travelMarkets.ts`: Herkunftsländer der Reisenden (Schulferien-Quelle + grobe Gewichtung nach Reisevolumen), inkl. großer außereuropäischer Märkte (USA, China, Japan, Südkorea, Russland, Indien, Australien, GB).
- `src/lib/holidayApi.ts`: Feiertagsadapter (Nager.Date, weltweit).
- `src/lib/schoolHolidayApi.ts`: Schulferienadapter (OpenHolidaysAPI, ersetzt den defekten schulferien.in-Zugriff).
- `src/lib/weatherApi.ts`: Klimaadapter (Open-Meteo/ERA5, 1991–2020), liefert monatliche Normalwerte je Zielkoordinate.
- `src/lib/scoring.ts`: einzige Stelle für die Score-Berechnung. Der "Menschen"-Score kombiniert die Hochsaison-Kurve des gewählten Reiseziels mit der gewichteten Ferien-/Reiseüberschneidung der ausgewählten Herkunftsländer.

## Reiseziel & Empfehlungen

Statt eines groben Kontinent-Klimawerts wählt man ein konkretes Reiseziel (Land) mit echter Referenzkoordinate für Klimadaten. Alternativ berechnet "🌍 Alle Länder (Empfehlung)" für jedes hinterlegte Land das beste Zeitfenster nach den aktuellen Filtern und zeigt die Top 10 im Vergleich. Die Dauer (z. B. 7/14 Tage) und der Start-Wochentag (z. B. immer Montag) sind einstellbar.

## Datenqualität

Deutschland 2027/28 ist mit den veröffentlichten KMK-Ferienterminen hinterlegt. Die Hochsaison-Kurven je Reiseziel und die Reise-Saisonmodelle für Märkte ohne freie Schulferien-API (USA, China, Japan, Südkorea, Russland, Indien, Australien, GB) sind ein **kuratiertes Erfahrungsmodell** aus bekannten Saisonmustern – keine amtliche Besucherstatistik. Fehlen Daten, erzeugt der Score keinen scheinpräzisen Wert.

## Datenquellen

- KMK: https://www.kmk.org/service/ferienregelung.html
- Nager.Date API: https://date.nager.at/api
- OpenHolidays API: https://www.openholidaysapi.org/de/
- Open-Meteo: https://open-meteo.com/en/docs/historical-weather-api
