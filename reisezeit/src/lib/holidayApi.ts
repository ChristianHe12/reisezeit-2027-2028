export type RawHoliday={date:string;name:string;countryCode:string;global?:boolean;counties?:string[]};
const countries=['DE','CH','AT','FR','IT','ES','NL','BE','LU','GB','IE','DK','SE','NO','FI','PL','CZ','US','CA'];
export async function fetchHolidayData(year:number):Promise<RawHoliday[]>{
 const key=`holidays-${year}`; const cached=localStorage.getItem(key); if(cached) return JSON.parse(cached);
 const chunks=await Promise.all(countries.map(async c=>{try{const r=await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${c}`);if(!r.ok)return[];const data=await r.json();return data.map((x:any)=>({date:x.date,name:x.localName||x.name,countryCode:c,global:x.global,counties:x.counties}))}catch{return[]}}));
 const all=chunks.flat(); localStorage.setItem(key,JSON.stringify(all)); return all;
}
