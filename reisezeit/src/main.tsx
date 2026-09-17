import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronDown, ChevronUp, Info, SlidersHorizontal, X } from 'lucide-react';
import './index.css';
import { germanSchoolHolidays } from './data/germany';
import { COUNTRIES, type CountryCode } from './data/countries';
import { DESTINATIONS, DESTINATION_BY_CODE, CATEGORIES, type Destination, type Category } from './data/destinations';
import { calculateTravelScore, type Preferences, type ScoreResult } from './lib/scoring';
import { fetchHolidayData } from './lib/holidayApi';
import { fetchSchoolHolidays, type SchoolHoliday } from './lib/schoolHolidayApi';
import { fetchMonthlyClimate, fetchMonthlySeaTemperature, type ClimateNormals } from './lib/weatherApi';

const years=[2027,2028] as const;
const months=Array.from({length:12},(_,i)=>i);
const DE_STATES=Object.keys(germanSchoolHolidays);
const CH_CANTONS=['CH-AG','CH-AR','CH-AI','CH-BL','CH-BS','CH-BE','CH-FR','CH-GE','CH-GL','CH-GR','CH-JU','CH-LU','CH-NE','CH-NW','CH-OW','CH-SG','CH-SH','CH-SO','CH-SZ','CH-TG','CH-TI','CH-UR','CH-VD','CH-VS','CH-ZG','CH-ZH'];
const CH_NAMES=['Aargau','Appenzell Ausserrhoden','Appenzell Innerrhoden','Basel-Landschaft','Basel-Stadt','Bern','Freiburg','Genf','Glarus','Graubünden','Jura','Luzern','Neuenburg','Nidwalden','Obwalden','St. Gallen','Schaffhausen','Solothurn','Schwyz','Thurgau','Tessin','Uri','Waadt','Wallis','Zug','Zürich'];
const CONTINENTS=['Europa','Asien','Afrika','Nordamerika','Südamerika','Ozeanien'] as const;
const WEEKDAY_LABELS=['So','Mo','Di','Mi','Do','Fr','Sa'];

function iso(y:number,m:number,d:number){return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
function daysInMonth(y:number,m:number){return new Date(Date.UTC(y,m+1,0)).getUTCDate()}
function dow(y:number,m:number,d:number){return new Date(Date.UTC(y,m,d)).getUTCDay()}
function fmt(date:string){return new Intl.DateTimeFormat('de-CH',{weekday:'long',day:'2-digit',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'))}
function weekdayOf(date:string){return new Date(date+'T12:00:00Z').getUTCDay()}

type Range={start:string;end:string;score:number;dates:string[]};
type CountryRecommendation=Range&{destination:Destination};

function App(){
 const [year,setYear]=React.useState<2027|2028>(2027);
 const [deStates,setDeStates]=React.useState<string[]>(DE_STATES);
 const [chCantons,setChCantons]=React.useState<string[]>(CH_CANTONS);
 const [countries,setCountries]=React.useState<CountryCode[]>(COUNTRIES.map(c=>c.code));
 const [weatherOn,setWeatherOn]=React.useState(true);
 const [holidaysOn,setHolidaysOn]=React.useState(true);
 const [germanOn,setGermanOn]=React.useState(true);
 const [swissOn,setSwissOn]=React.useState(true);
 const [otherOn,setOtherOn]=React.useState(true);
 const [destination,setDestination]=React.useState('ES');
 const [categories,setCategories]=React.useState<Category[]>([]);
 const [seaTemp,setSeaTemp]=React.useState<number[]|null>(null);
 const [peopleWeight,setPeopleWeight]=React.useState(50);
 const [duration,setDuration]=React.useState(7);
 const [startWeekday,setStartWeekday]=React.useState<'any'|number>(1);
 const [selectedDate,setSelectedDate]=React.useState(iso(2027,4,15));
 const [showDetails,setShowDetails]=React.useState(true);
 const [range,setRange]=React.useState<string[]>([]);
 const [holidayData,setHolidayData]=React.useState<any[]>([]);
 const [schoolHolidayData,setSchoolHolidayData]=React.useState<SchoolHoliday[]>([]);
 const [climate,setClimate]=React.useState<ClimateNormals|null>(null);
 const [loading,setLoading]=React.useState(false);
 const [error,setError]=React.useState<string|null>(null);
 const [countryRecs,setCountryRecs]=React.useState<CountryRecommendation[]>([]);
 const [recsLoading,setRecsLoading]=React.useState(false);
 const [recsProgress,setRecsProgress]=React.useState(0);

 const isRecommendMode=destination==='';
 const activeDestination=DESTINATION_BY_CODE[destination]||null;
 const wantsBeach=categories.includes('beach');
 const matchesCategories=(d:Destination)=>categories.every(c=>d.categories.includes(c));
 const eligibleDestinations=React.useMemo(()=>categories.length?DESTINATIONS.filter(matchesCategories):DESTINATIONS,[categories.join(',')]);
 const prefs:Preferences={year, deStates, chCantons, countries, germanOn, swissOn, otherOn, weatherOn, holidaysOn, peopleWeight, destination, categories};
 React.useEffect(()=>{setSelectedDate(iso(year,4,15));setRange([]);setCountryRecs([])},[year]);
 React.useEffect(()=>{if(destination&&!eligibleDestinations.some(d=>d.code===destination))setDestination('')},[eligibleDestinations]);
 React.useEffect(()=>{
   let alive=true; setLoading(true); setError(null);
   const beachSpot=activeDestination?(activeDestination.beachSpot||{lat:activeDestination.lat,lon:activeDestination.lon}):null;
   Promise.all([
     fetchHolidayData(year).catch(()=>[]),
     activeDestination?fetchMonthlyClimate(activeDestination.lat,activeDestination.lon).catch(()=>null):Promise.resolve(null),
     wantsBeach&&beachSpot?fetchMonthlySeaTemperature(beachSpot.lat,beachSpot.lon).catch(()=>null):Promise.resolve(null),
     fetchSchoolHolidays('CH',year).catch(()=>[]),
     ...(otherOn ? countries.map(c=>fetchSchoolHolidays(c,year).catch(()=>[])) : [])
   ]).then(([h,c,st,ch,...others])=>{if(alive){setHolidayData(h);setClimate(c);setSeaTemp(st as number[]|null);setSchoolHolidayData([...(ch as SchoolHoliday[]), ...(others as SchoolHoliday[][]).flat()])}}).catch(()=>alive&&setError('Externe Daten konnten nicht geladen werden. Die betroffenen Faktoren werden als „keine Daten“ behandelt.')).finally(()=>alive&&setLoading(false));
   return()=>{alive=false};
 },[year,destination,otherOn,countries.join(','),wantsBeach]);

 const scoreFor=(date:string):ScoreResult=>calculateTravelScore(date,prefs,{germanSchoolHolidays,holidayData,climate,seaTemp,schoolHolidayData});
 const dateList=React.useMemo(()=>{const out:string[]=[]; for(let m=0;m<12;m++)for(let d=1;d<=daysInMonth(year,m);d++)out.push(iso(year,m,d)); return out},[year]);
 const bestRanges=React.useMemo(()=>findBestRanges(dateList,duration,startWeekday,scoreFor),[dateList,duration,startWeekday,peopleWeight,climate,seaTemp,holidayData,deStates,chCantons,countries,germanOn,swissOn,otherOn,weatherOn,holidaysOn,destination,categories.join(',')]);
 const selected=scoreFor(selectedDate);

 async function computeCountryRecommendations(){
   setRecsLoading(true); setRecsProgress(0); setCountryRecs([]);
   const pool=eligibleDestinations;
   const results:CountryRecommendation[]=[];
   const batchSize=6;
   for(let i=0;i<pool.length;i+=batchSize){
     const batch=pool.slice(i,i+batchSize);
     const climates=await Promise.all(batch.map(d=>fetchMonthlyClimate(d.lat,d.lon).catch(()=>null)));
     const seaTemps=await Promise.all(batch.map(d=>{
       if(!wantsBeach)return Promise.resolve(null);
       const spot=d.beachSpot||{lat:d.lat,lon:d.lon};
       return fetchMonthlySeaTemperature(spot.lat,spot.lon).catch(()=>null);
     }));
     for(let j=0;j<batch.length;j++){
       const dest=batch[j];
       const destClimate=climates[j];
       const destPrefs:Preferences={...prefs,destination:dest.code};
       const destScoreFor=(date:string)=>calculateTravelScore(date,destPrefs,{germanSchoolHolidays,holidayData,climate:destClimate,seaTemp:seaTemps[j],schoolHolidayData});
       const ranges=findBestRanges(dateList,duration,startWeekday,destScoreFor,1);
       if(ranges[0])results.push({...ranges[0],destination:dest});
     }
     setRecsProgress(Math.min(pool.length,i+batchSize));
   }
   results.sort((a,b)=>b.score-a.score);
   setCountryRecs(results.slice(0,10));
   setRecsLoading(false);
 }

 return <main className="min-h-screen bg-slate-50 text-slate-900">
   <div className="mx-auto max-w-[1500px] px-3 py-4 sm:px-6 sm:py-7">
     <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
       <div><p className="mb-1 text-xs font-semibold uppercase tracking-[.18em] text-slate-500">Reiseplanung</p><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Reisezeit 2027–2028</h1><p className="mt-1 max-w-2xl text-sm text-slate-600">Schulferien, Feiertage, globale Reisesaison und Klima als nachvollziehbarer Tages-Score. Die Auslastung ist ein modelliertes Indiz – keine Besucherprognose.</p></div>
       <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm" role="tablist" aria-label="Jahr"><button className={`focus-ring rounded-lg px-5 py-2 text-sm font-medium ${year===2027?'bg-slate-900 text-white':'text-slate-600'}`} onClick={()=>setYear(2027)}>2027</button><button className={`focus-ring rounded-lg px-5 py-2 text-sm font-medium ${year===2028?'bg-slate-900 text-white':'text-slate-600'}`} onClick={()=>setYear(2028)}>2028</button></div>
     </header>

     <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
       <div className="mb-4 flex items-center gap-2"><SlidersHorizontal size={18}/><h2 className="font-semibold">Was möchtest du berücksichtigen?</h2></div>
       <div className="mb-4">
         <span className="text-sm font-medium">Urlaubskategorie <span className="font-normal text-slate-400">(mehrere möglich, leer = alle Länder)</span></span>
         <div className="mt-2 flex flex-wrap gap-2">{CATEGORIES.map(c=>{const on=categories.includes(c.code);return <button key={c.code} type="button" title={c.description} onClick={()=>setCategories(on?categories.filter(x=>x!==c.code):[...categories,c.code])} className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-medium transition ${on?'border-slate-900 bg-slate-900 text-white':'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{c.label}</button>})}</div>
         {categories.length>1&&<p className="mt-1.5 text-[11px] text-slate-500">Nur Länder, die <b>alle</b> gewählten Kategorien erfüllen, werden berücksichtigt – z. B. liefert „Ski“ + „Strand & Sonne“ kaum bis keine Treffer.</p>}
       </div>
       <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">
         <Factor label="Schulferien Deutschland" on={germanOn} setOn={setGermanOn}><Multi label="Bundesländer" values={DE_STATES} selected={deStates} onChange={setDeStates}/></Factor>
         <Factor label="Schulferien Schweiz" on={swissOn} setOn={setSwissOn}><Multi label="Kantone · leer = ganze Schweiz" values={CH_CANTONS.map((c,i)=>`${c}|${CH_NAMES[i]}`)} selected={chCantons} onChange={setChCantons} display/></Factor>
         <Factor label="Weitere Reisemärkte (weltweit)" on={otherOn} setOn={setOtherOn}><Multi label="Länder" values={COUNTRIES.map(c=>c.code)} selected={countries} onChange={(v)=>setCountries(v as CountryCode[])} displayCountry/></Factor>
       </div>
       <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">
         <label className="rounded-xl border border-slate-200 p-3"><span className="text-sm font-medium">Reiseziel</span><select value={destination} onChange={e=>{setDestination(e.target.value);setCountryRecs([])}} className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="">🌍 Alle Länder (Empfehlung)</option>{CONTINENTS.map(cont=>{const opts=eligibleDestinations.filter(d=>d.continent===cont);return opts.length?<optgroup key={cont} label={cont}>{opts.map(d=><option key={d.code} value={d.code}>{d.name}</option>)}</optgroup>:null})}</select><Check on={weatherOn} setOn={setWeatherOn}/><p className="mt-1 text-[11px] text-slate-500">Klima wird pro Reiseziel geladen (Referenzkoordinate). Ohne festes Ziel: Länder-Empfehlung unten.</p></label>
         <Factor label="Feiertage & Brückentage" on={holidaysOn} setOn={setHolidaysOn}/>
         <div className="rounded-xl border border-slate-200 p-3"><div className="flex items-center justify-between"><span className="text-sm font-medium">Was ist dir wichtiger?</span><span className="text-xs font-semibold text-slate-500">{peopleWeight}% Menschen · {100-peopleWeight}% Wetter</span></div><input aria-label="Gewichtung Menschen gegen Wetter" type="range" min="0" max="100" value={peopleWeight} onChange={e=>setPeopleWeight(+e.target.value)} className="mt-4 w-full"/><div className="mt-1 flex justify-between text-xs text-slate-500"><span>Wenig Menschen</span><span>Gutes Wetter</span></div></div>
       </div>
       {loading&&<p className="mt-3 text-xs text-slate-500">Daten werden aktualisiert …</p>}{error&&<p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">{error}</p>}
     </section>

     {isRecommendMode?
       <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
         <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
           <div><h2 className="font-semibold">Top 10 Länder-Empfehlungen</h2><p className="text-xs text-slate-500">Berechnet für {eligibleDestinations.length} Länder{categories.length?` (Kategorie: ${categories.map(c=>CATEGORIES.find(x=>x.code===c)?.label).join(' + ')})`:''} den besten Zeitraum nach deinen Filtern.</p></div>
           <div className="flex items-center gap-2">
             <DurationSelect duration={duration} setDuration={setDuration}/>
             <WeekdaySelect startWeekday={startWeekday} setStartWeekday={setStartWeekday}/>
             <button onClick={computeCountryRecommendations} disabled={recsLoading||eligibleDestinations.length===0} className="focus-ring rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{recsLoading?`Lädt … ${recsProgress}/${eligibleDestinations.length}`:'Berechnen'}</button>
           </div>
         </div>
         {eligibleDestinations.length===0&&<p className="text-sm text-amber-700">Keine Länder erfüllen alle gewählten Kategorien gleichzeitig.</p>}
         {countryRecs.length>0&&<div className="grid gap-2 sm:grid-cols-2">{countryRecs.map((r,i)=><button key={r.destination.code} onClick={()=>{setDestination(r.destination.code);setSelectedDate(r.start);setRange(r.dates)}} className="focus-ring rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50"><div className="flex items-center justify-between"><span className="text-sm font-medium">{i+1}. {r.destination.name}</span><b className="text-sm">{Math.round(r.score)}/100</b></div><div className="mt-1 text-xs text-slate-500">{shortRange(r.start,r.end)}</div></button>)}</div>}
         {!recsLoading&&countryRecs.length===0&&eligibleDestinations.length>0&&<p className="text-sm text-slate-500">Klicke „Berechnen“, um alle passenden Länder anhand deiner aktuellen Filter zu vergleichen.</p>}
       </section>
     :
     <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
       <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
         <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Jahresübersicht {year} · {activeDestination?.name}</h2><p className="text-xs text-slate-500">Klick auf einen Tag für Details. Die Farben zeigen den konfigurierten Reisezeit-Score.</p></div><Legend/></div>
         <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{months.map(m=><Month key={m} year={year} month={m} scoreFor={scoreFor} selectedDate={selectedDate} setSelectedDate={setSelectedDate} range={range}/>)}</div>
       </div>
       <aside className="space-y-4">
         <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ausgewählter Tag</p><h2 className="mt-1 font-semibold">{fmt(selectedDate)}</h2></div><button className="focus-ring rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={()=>setShowDetails(v=>!v)} aria-label="Details ein-/ausblenden">{showDetails?<ChevronUp/>:<ChevronDown/>}</button></div>{showDetails&&<Details result={selected} date={selectedDate}/>}</div>
         <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
           <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Urlaubszeitraum</p><h2 className="mt-1 font-semibold">Beste zusammenhängende Zeit</h2></div></div>
           <div className="mt-3 flex flex-wrap gap-2"><DurationSelect duration={duration} setDuration={setDuration}/><WeekdaySelect startWeekday={startWeekday} setStartWeekday={setStartWeekday}/></div>
           <div className="mt-3 space-y-2">{bestRanges.slice(0,10).map((r,i)=><button key={r.start} className="focus-ring w-full rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50" onClick={()=>{setSelectedDate(r.start);setRange(r.dates)}}><div className="flex items-center justify-between"><span className="text-sm font-medium">{i+1}. {shortRange(r.start,r.end)}</span><b className="text-sm">{Math.round(r.score)}/100</b></div><div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-slate-800" style={{width:`${r.score}%`}}/></div></button>)}{bestRanges.length===0&&<p className="text-sm text-slate-500">Noch nicht genügend Daten für eine Rangliste.</p>}</div>
         </div>
         <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600 shadow-sm"><div className="mb-1 flex items-center gap-2 font-semibold text-slate-800"><Info size={15}/> Keine Fake-Präzision</div>„Geschätzte Auslastung“ kombiniert Ferien/Feiertage vieler Herkunftsländer (gewichtet nach grober Reisevolumen-Größe) mit einer kuratierten Saisonkurve des Reiseziels. Wetterwerte sind Klimanormalwerte je Zielkoordinate, keine Wettervorhersage für 2027/2028. Fehlt eine belastbare Quelle, bleibt der Faktor ohne Score.</div>
       </aside>
     </section>}
     <footer className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">Datenadapter: KMK (Deutschland), OpenHolidaysAPI (Schweiz &amp; weitere Länder), Nager.Date (Feiertage weltweit), kuratierte Reise-Saisonmodelle für große außereuropäische Märkte, Open-Meteo für Klimadaten. Quellen und Rohdaten sind im Code als getrennte Adapter dokumentiert.</footer>
   </div>
 </main>
}

function DurationSelect({duration,setDuration}:{duration:number,setDuration:(v:number)=>void}){return <select value={duration} onChange={e=>setDuration(+e.target.value)} className="focus-ring rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"><option value={3}>3 Tage</option><option value={5}>5 Tage</option><option value={7}>7 Tage</option><option value={10}>10 Tage</option><option value={14}>14 Tage</option></select>}
function WeekdaySelect({startWeekday,setStartWeekday}:{startWeekday:'any'|number,setStartWeekday:(v:'any'|number)=>void}){return <select value={startWeekday} onChange={e=>setStartWeekday(e.target.value==='any'?'any':+e.target.value)} className="focus-ring rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm" aria-label="Start-Wochentag"><option value="any">Beliebiger Starttag</option>{WEEKDAY_LABELS.map((l,i)=><option key={i} value={i}>Start: {l}</option>)}</select>}
function Factor({label,on,setOn,children}:{label:string,on:boolean,setOn:(v:boolean)=>void,children?:React.ReactNode}){return <div className="rounded-xl border border-slate-200 p-3"><div className="flex items-center justify-between"><span className="text-sm font-medium">{label}</span><Check on={on} setOn={setOn}/></div>{on&&children}</div>}
function Check({on,setOn}:{on:boolean,setOn:(v:boolean)=>void}){return <button type="button" aria-pressed={on} onClick={()=>setOn(!on)} className={`focus-ring relative h-6 w-10 rounded-full transition ${on?'bg-slate-900':'bg-slate-200'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${on?'left-5':'left-1'}`}/></button>}
function Multi({label,values,selected,onChange,display,displayCountry}:{label:string,values:string[],selected:string[],onChange:(v:string[])=>void,display?:boolean,displayCountry?:boolean}){const [open,setOpen]=React.useState(false);return <div className="relative mt-2"><button type="button" onClick={()=>setOpen(!open)} className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm">{selected.length?`${selected.length} ausgewählt`:'Alle / keine Auswahl'} <span className="float-right">⌄</span></button>{open&&<div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">{values.map(raw=>{const [code,name]=raw.split('|');const labelText=displayCountry?(COUNTRIES.find(c=>c.code===code)?.name||code):display?(name||code):code;return <label key={raw} className="flex cursor-pointer gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50"><input type="checkbox" checked={selected.includes(code)} onChange={()=>onChange(selected.includes(code)?selected.filter(x=>x!==code):[...selected,code])}/>{labelText}</label>})}<button onClick={()=>setOpen(false)} className="mt-1 w-full rounded-lg bg-slate-900 py-1.5 text-xs text-white">Fertig</button></div>}<span className="sr-only">{label}</span></div>}
function Legend(){return <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500"><span><i className="mr-1 inline-block h-3 w-3 rounded heat-green"/>90–100</span><span><i className="mr-1 inline-block h-3 w-3 rounded heat-lime"/>75–89</span><span><i className="mr-1 inline-block h-3 w-3 rounded heat-yellow"/>60–74</span><span><i className="mr-1 inline-block h-3 w-3 rounded heat-orange"/>40–59</span><span><i className="mr-1 inline-block h-3 w-3 rounded heat-red"/>0–39</span><span><i className="mr-1 inline-block h-3 w-3 rounded heat-none"/>keine Daten</span></div>}
function Month({year,month,scoreFor,selectedDate,setSelectedDate,range}:{year:number,month:number,scoreFor:(d:string)=>ScoreResult,selectedDate:string,setSelectedDate:(d:string)=>void,range:string[]}){const name=new Intl.DateTimeFormat('de-DE',{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(year,month,1)));const first=dow(year,month,1);return <div className="rounded-xl border border-slate-100 p-2"><div className="mb-2 px-1 text-sm font-semibold capitalize">{name}</div><div className="mb-1 grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400">{['S','M','D','M','D','F','S'].map((x,i)=><span key={i}>{x}</span>)}</div><div className="grid grid-cols-7 gap-1">{Array.from({length:first}).map((_,i)=><span key={'e'+i}/>) }{Array.from({length:daysInMonth(year,month)},(_,i)=>{const d=i+1;const date=iso(year,month,d);const s=scoreFor(date);return <button key={date} title={`${d}. ${name}: ${s.overall==null?'keine Daten':Math.round(s.overall)+'/100'}`} onClick={()=>setSelectedDate(date)} className={`calendar-day focus-ring rounded-md text-xs font-medium ${heatClass(s.overall)} ${selectedDate===date?'ring-2 ring-slate-900 ring-offset-1':''} ${range.includes(date)?'outline outline-2 outline-slate-500':''}`}>{d}</button>})}</div></div>}
function heatClass(v:number|null){if(v==null)return'heat-none text-slate-500';if(v>=90)return'heat-green';if(v>=75)return'heat-lime';if(v>=60)return'heat-yellow';if(v>=40)return'heat-orange';return'heat-red'}
function Details({result,date}:{result:ScoreResult,date:string}){return <div className="mt-4 border-t border-slate-100 pt-4"><div className="grid grid-cols-3 gap-2"><Metric label="Reisezeit" value={result.overall}/><Metric label="Menschen" value={result.crowd}/><Metric label="Wetter" value={result.weather}/></div><div className="mt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Gründe</p><ul className="space-y-1.5 text-sm">{result.reasons.map((r,i)=><li key={i} className="flex gap-2"><span>{r.kind==='positive'?'✓':'•'}</span><span>{r.text}</span></li>)}</ul></div>{result.missing.length>0&&<p className="mt-3 rounded-lg bg-slate-50 p-2 text-xs text-slate-500">Keine Daten: {result.missing.join(', ')}.</p>}</div>}
function Metric({label,value}:{label:string,value:number|null}){return <div className="rounded-xl bg-slate-50 p-2"><div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-lg font-semibold">{value==null?'—':Math.round(value)}</div></div>}
function shortRange(a:string,b:string){const fa=new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit',timeZone:'UTC'}).format(new Date(a+'T12:00:00Z'));const fb=new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(new Date(b+'T12:00:00Z'));return `${fa}–${fb}`}
function findBestRanges(
  dates: string[],
  duration: number,
  startWeekday: 'any'|number,
  scoreFor: (d: string) => ScoreResult,
  limit=10,
): Range[] {
  const out: Range[] = [];

  for (let i = 0; i <= dates.length - duration; i++) {
    const ds = dates.slice(i, i + duration);
    if(startWeekday!=='any'&&weekdayOf(ds[0])!==startWeekday)continue;
    const nums = ds
      .map((d) => scoreFor(d).overall)
      .filter((v): v is number => v != null);

    if (nums.length !== duration) continue;

    out.push({
      start: ds[0],
      end: ds[ds.length - 1],
      score: nums.reduce((a, b) => a + b, 0) / duration,
      dates: ds,
    });
  }

  return out
    .sort((a, b) => b.score - a.score)
    .filter((r, i, arr) =>
      arr.slice(0, i).every((x) => !overlap(r.dates, x.dates))
    )
    .slice(0, limit);
}
function overlap(a:string[],b:string[]){return a.some(x=>b.includes(x))}
createRoot(document.getElementById('root')!).render(<App/>);
