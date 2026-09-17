export type CountryCode='AT'|'FR'|'IT'|'ES'|'NL'|'BE'|'LU'|'GB'|'IE'|'DK'|'SE'|'NO'|'FI'|'PL'|'CZ'|'US'|'CA';
export const COUNTRIES:{code:CountryCode,name:string}[]=[
['AT','Österreich'],['FR','Frankreich'],['IT','Italien'],['ES','Spanien'],['NL','Niederlande'],['BE','Belgien'],['LU','Luxemburg'],['GB','Vereinigtes Königreich'],['IE','Irland'],['DK','Dänemark'],['SE','Schweden'],['NO','Norwegen'],['FI','Finnland'],['PL','Polen'],['CZ','Tschechien'],['US','USA'],['CA','Kanada']
].map(([code,name])=>({code:code as CountryCode,name}));
