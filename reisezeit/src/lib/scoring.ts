import type {CountryCode} from '../data/countries';
import type {RawHoliday} from './holidayApi';
import type {ClimateNormals} from './weatherApi';
import type {SchoolHoliday} from './schoolHolidayApi';
import type {germanSchoolHolidays} from '../data/germany';
import {DESTINATION_BY_CODE, type Category} from '../data/destinations';
import {TRAVEL_MARKETS, DE_TRAVEL_WEIGHT, CH_TRAVEL_WEIGHT} from '../data/travelMarkets';

export type Preferences={
  year:number;deStates:string[];chCantons:string[];countries:CountryCode[];
  germanOn:boolean;swissOn:boolean;otherOn:boolean;weatherOn:boolean;holidaysOn:boolean;
  peopleWeight:number;destination:string;categories:Category[];
};
export type ScoreResult={overall:number|null;crowd:number|null;weather:number|null;holiday:number|null;reasons:{kind:'positive'|'negative';text:string}[];missing:string[]};
type Inputs={germanSchoolHolidays:Record<string,{start:string;end:string;name:string}[]>;holidayData:RawHoliday[];climate:ClimateNormals|null;seaTemp:number[]|null;schoolHolidayData:SchoolHoliday[]};

const dateIn=(d:string,s:string,e:string)=>d>=s&&d<=e;
const monthOf=(date:string)=>Number(date.slice(5,7));

function deFraction(date:string,p:Preferences,data:Inputs):number{
  if(!p.germanOn)return 0;
  const states=p.deStates.length?p.deStates:Object.keys(data.germanSchoolHolidays);
  if(!states.length)return 0;
  const hit=states.filter(st=>(data.germanSchoolHolidays[st]||[]).some(x=>dateIn(date,x.start,x.end))).length;
  return hit/states.length;
}
function chFraction(date:string,p:Preferences,data:Inputs):number{
  if(!p.swissOn)return 0;
  const active=data.schoolHolidayData.filter(x=>(x.region==='CH'||x.region.startsWith('CH-'))&&dateIn(date,x.startDate,x.endDate));
  const selected=p.chCantons.length?new Set(p.chCantons):null;
  const regions=new Set(active.filter(x=>!selected||x.region==='CH'||selected.has(x.region)).map(x=>x.region));
  if(!selected)return active.length?1:0; // ganze Schweiz ausgewählt: jede Ferienmeldung zählt voll
  return selected.size?regions.size/selected.size:0;
}
// 0-100 Reise-Intensität eines einzelnen Herkunftsmarkts an diesem Datum.
function marketIntensity(date:string,code:string,data:Inputs):number{
  const market=TRAVEL_MARKETS.find(m=>m.code===code);
  if(!market)return 0;
  if(market.school==='openholidays'){
    const hit=data.schoolHolidayData.some(x=>(x.region===code||x.region.startsWith(code+'-'))&&dateIn(date,x.startDate,x.endDate));
    return hit?100:0;
  }
  if(market.school==='curated'&&market.curatedTravelShare){
    return market.curatedTravelShare[monthOf(date)-1];
  }
  const isHoliday=data.holidayData.some(h=>h.date===date&&h.countryCode===code);
  return isHoliday?55:0;
}
function originDemand(date:string,p:Preferences,data:Inputs):{value:number|null;activeMarkets:string[]}{
  const parts:{weight:number;value:number;name:string}[]=[];
  if(p.germanOn)parts.push({weight:DE_TRAVEL_WEIGHT,value:deFraction(date,p,data)*100,name:'Deutschland'});
  if(p.swissOn)parts.push({weight:CH_TRAVEL_WEIGHT,value:chFraction(date,p,data)*100,name:'Schweiz'});
  if(p.otherOn)for(const code of p.countries){
    const market=TRAVEL_MARKETS.find(m=>m.code===code);
    if(!market)continue;
    parts.push({weight:market.weight,value:marketIntensity(date,code,data),name:market.name});
  }
  if(!parts.length)return {value:null,activeMarkets:[]};
  const totalWeight=parts.reduce((s,x)=>s+x.weight,0);
  const value=parts.reduce((s,x)=>s+x.value*x.weight,0)/totalWeight;
  const activeMarkets=parts.filter(x=>x.value>=50).map(x=>x.name);
  return {value,activeMarkets};
}
function seaComfort(temp:number):number{return Math.max(0,Math.min(100,(temp-17)*12.5))}
function weatherScoreFor(date:string,climate:ClimateNormals|null,seaTemp:number[]|null,wantsBeach:boolean):{score:number|null;seaC:number|null}{
  if(!climate)return {score:null,seaC:null};
  const m=climate.months[monthOf(date)-1];
  if(!m)return {score:null,seaC:null};
  const tempSuit=100-Math.min(100,Math.abs(m.temperature-24)*4);
  const precipPenalty=Math.min(50,m.precipitation/6);
  const sunshineBonus=Math.min(30,m.sunshine*3);
  const airScore=Math.max(0,Math.min(100,tempSuit-precipPenalty+sunshineBonus));
  if(!wantsBeach||!seaTemp)return {score:airScore,seaC:null};
  const seaC=seaComfort(seaTemp[monthOf(date)-1]);
  // Zum Baden muss BEIDES stimmen: kaltes Meer darf nicht durch sonniges/trockenes Wetter überdeckt werden.
  let combined=airScore*0.4+seaC*0.6;
  if(seaC<50)combined=Math.min(combined,seaC+10);
  return {score:Math.max(0,Math.min(100,combined)),seaC};
}

export function calculateTravelScore(date:string,p:Preferences,data:Inputs):ScoreResult{
  const reasons:{kind:'positive'|'negative';text:string}[]=[];
  const missing:string[]=[];
  const destination=DESTINATION_BY_CODE[p.destination]||null;
  const baseline=destination?destination.peakSeason[monthOf(date)-1]:null;
  const demand=originDemand(date,p,data);

  let crowd:number|null=null;
  if(baseline!=null&&demand.value!=null)crowd=baseline*0.55+demand.value*0.45;
  else if(baseline!=null)crowd=baseline;
  else crowd=demand.value;

  if(crowd!=null){
    if(baseline!=null&&baseline>=75)reasons.push({kind:'negative',text:`${destination!.name}: touristische Hochsaison am Zielort${destination!.note?' – '+destination!.note:''}`});
    if(baseline!=null&&baseline<=30)reasons.push({kind:'positive',text:`${destination!.name}: touristische Nebensaison am Zielort`});
    if(demand.activeMarkets.length)reasons.push({kind:'negative',text:`Hohe Reisezeit in: ${demand.activeMarkets.slice(0,4).join(', ')}${demand.activeMarkets.length>4?' u.a.':''}`});
    else if(demand.value!=null&&demand.value<20)reasons.push({kind:'positive',text:'Kaum überlappende Ferien-/Reisezeiten der berücksichtigten Herkunftsländer'});
  }
  if(!destination&&p.weatherOn===false&&crowd==null)missing.push('Auslastungsfaktoren');

  const holidayCountAtDest=p.holidaysOn?data.holidayData.filter(h=>h.date===date&&(h.countryCode==='DE'&&p.germanOn||h.countryCode==='CH'&&p.swissOn||p.otherOn&&p.countries.includes(h.countryCode as CountryCode))).length:0;
  let holiday:number|null=null;
  if(p.holidaysOn){
    holiday=Math.max(0,100-holidayCountAtDest*18);
    if(holidayCountAtDest===0)reasons.push({kind:'positive',text:'Keine ausgewählten Feiertage am Tag'});
    else reasons.push({kind:'negative',text:`${holidayCountAtDest} ausgewählte Feiertagsfaktoren`});
  }

  let weather:number|null=null;
  const wantsBeach=p.categories.includes('beach');
  if(p.weatherOn){
    if(!destination)missing.push('Wetter (kein Reiseziel gewählt)');
    else{
      const w=weatherScoreFor(date,data.climate,data.seaTemp,wantsBeach);
      weather=w.score;
      if(weather==null)missing.push(`Wetter (${destination.name})`);
      else if(wantsBeach&&w.seaC!=null&&w.seaC<50)reasons.push({kind:'negative',text:`Meerestemperatur in ${destination.name} in diesem Monat zu kühl zum Baden`});
      else if(weather>=70)reasons.push({kind:'positive',text:`Günstiges Klima in ${destination.name}${wantsBeach?' inkl. angenehmer Wassertemperatur':''} für den Referenzpunkt`});
      else reasons.push({kind:'negative',text:`Klima in ${destination.name} außerhalb des bevorzugten Bereichs`});
    }
  }

  const crowdGood=crowd==null?null:100-crowd;
  const components:number[]=[];const weights:number[]=[];
  if(crowdGood!=null){components.push(crowdGood);weights.push(p.peopleWeight)}
  if(weather!=null){components.push(weather);weights.push(100-p.peopleWeight)}
  if(holiday!=null){components.push(holiday);weights.push(10)}
  if(!components.length)return {overall:null,crowd,weather,holiday,reasons,missing};
  const overall=components.reduce((sum,v,i)=>sum+v*weights[i],0)/weights.reduce((a,b)=>a+b,0);
  return {overall,crowd,weather,holiday,reasons,missing};
}
