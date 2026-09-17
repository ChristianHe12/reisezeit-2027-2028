# Reisezeit 2027–2028

Kleine React/TypeScript/Vite-App für eine nachvollziehbare Reisezeit-Heatmap.

## Start

```bash
npm install
npm run dev
```

## Architektur

- `src/data/*`: Rohdaten und Länderlisten.
- `src/lib/holidayApi.ts`: Feiertagsadapter.
- `src/lib/weatherApi.ts`: Klimaadapter (Open-Meteo/ERA5, 1991–2020, Referenzpunkte).
- `src/lib/scoring.ts`: einzige Stelle für die Score-Berechnung.
- `src/components`: für die nächste Ausbaustufe vorgesehen; die V1 hält die UI bewusst kompakt.

## Datenqualität

Deutschland 2027/28 ist mit den veröffentlichten KMK-Ferienterminen hinterlegt. Schweiz und weitere Länder werden über Datenadapter angebunden; fehlen Daten, erzeugt der Score keinen scheinpräzisen Wert.

Wichtig: Die V1 nennt Wetter ausdrücklich einen **Klimaindikator für einen Referenzpunkt** je Kontinent. Das ist keine Behauptung, dass damit jedes Reiseziel eines Kontinents repräsentiert wird. Für eine echte Zielreiseplanung sollte als nächste Ausbaustufe ein konkretes Reiseziel (Koordinaten) gewählt werden.

## Datenquellen

- KMK: https://www.kmk.org/service/ferienregelung.html
- EDK: https://edk.ch/de/bildungssystem/kantonale-schulorganisation/Schulferien
- Nager.Date API: https://date.nager.at/api
- OpenHolidays API: https://www.openholidaysapi.org/de/
- Open-Meteo: https://open-meteo.com/en/docs/historical-weather-api
