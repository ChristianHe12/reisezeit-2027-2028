export type SchoolHoliday={region:string;regionName:string;type:string;startDate:string;endDate:string;verified?:boolean};
export async function fetchSchoolHolidays(country:string,year:number,region?:string):Promise<SchoolHoliday[]>{
 const key=`school-${country}-${year}-${region||'all'}`;const cached=localStorage.getItem(key);if(cached)return JSON.parse(cached);
 try{const url=new URL(`https://schulferien.in/api/v1/holidays/${country}/${year}`);if(region)url.searchParams.set('region',region);const r=await fetch(url);if(!r.ok)return[];const data=await r.json();localStorage.setItem(key,JSON.stringify(data));return data}catch{return[]}
}
