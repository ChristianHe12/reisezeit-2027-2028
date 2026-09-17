import {TRAVEL_MARKETS} from './travelMarkets';
export type CountryCode = string;
export const COUNTRIES: { code: CountryCode; name: string }[] = TRAVEL_MARKETS.map(m => ({ code: m.code, name: m.name }));
