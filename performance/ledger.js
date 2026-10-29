/* NC State Day of Giving concept. All records and historical patterns are invented.
 * No uploaded workbook values, donor records, credentials or external data are used.
 * Gift = one completed transaction. This fixture has one designation per transaction.
 */
(function(root){
'use strict';
const YEAR=2027, YEARS=Array.from({length:8},(_,i)=>2019+i);
const units=['Agriculture and Life Sciences','Engineering','Sciences','Education','Humanities and Social Sciences','Design','University Libraries','Student Success'].map((name,i)=>({id:'U'+(i+1),name}));
const funds=units.flatMap((u,i)=>['Student Opportunity','Academic Innovation','Community Impact'].map((n,j)=>({id:'F'+String(i*3+j+1).padStart(3,'0'),unit:u.id,name:n+' - '+u.name,number:'DEMO-'+String(i*3+j+1).padStart(4,'0')})));
const leaders=['Jordan Example','Taylor Sample','Morgan Demo','Casey Example','Riley Sample','Avery Demo','Parker Example','Drew Sample'].map((name,i)=>({id:'P'+(i+1),name}));
const names=['Morgan Example','Avery Sample','Jordan Demo','Taylor Example','Riley Sample','Cameron Demo','Casey Example','Parker Sample'];
const donorName=id=>{const n=Number(id.split('-').pop());return names[n-1]||'Sample Donor '+String(n).padStart(5,'0');};
const weights=[10,4,3,2,3,7,18,35,63,75,83,73,68,81,91,93,78,72,75,84,94,108,94,76];
const ledger=[];let uid=0;
function random(seed){let s=seed>>>0;return()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296;};}
for(const year of [...YEARS,YEAR]){
 const r=random(year*73+919), n=12000+(year-2019)*610, total=weights.reduce((a,b)=>a+b,0);
 function add(t,donor,amount,channel,fund,status,leader){ledger.push(Object.freeze({id:'SIM-'+String(++uid).padStart(7,'0'),year,t,donor:'D-'+String(donor).padStart(5,'0'),cents:Math.round(amount*100),channel,fund,status,leader,restricted:donor%29===0}));}
 for(let h=0;h<24;h++){
  const curve=1+.15*Math.sin(h*.7+year)+(year===YEAR&&h>=12&&h<=14?-.12:0)+(year===YEAR&&h>=18?.16:0);
  const count=Math.round(n*weights[h]/total*curve);
  for(let k=0;k<count;k++){
   const donor=10+Math.floor(r()*Math.floor(n*.66)), q=r(), a=q<.38?25:q<.64?50:q<.80?100:q<.90?250:q<.97?500:1000;
   let fi=Math.floor(r()*funds.length);if(year===YEAR&&h>=12&&h<17&&fi<3)fi=5;
   const channel=r()<.955?'online':'offline', amount=channel==='offline'?a*(8+Math.floor(r()*20)):a;
   const qstatus=r(),status=qstatus<.007?'failed':qstatus<.012?'pending':qstatus<.018?'refunded':'completed';
   add(h*3600+Math.floor(r()*3600),donor,amount,channel,funds[fi].id,status,r()<.23?leaders[Math.floor(r()*8)].id:null);
  }
 }
 for(let k=0;k<360+(year-2019)*23;k++)add(-1-Math.floor(r()*604800),10+Math.floor(r()*8500),[50,100,250,500,1000][k%5],k%13===0?'offline':'online',funds[k%24].id,'completed',k%5===0?leaders[k%8].id:null);
 for(let k=0;k<10;k++)add((7+k)*3600+900,100+k,[10000,15000,25000,50000,12500,30000,20000,10000,75000,40000][k]*(.8+(year-2019)*.025),'online',funds[k*2%24].id,'completed',k%2===0?leaders[k%8].id:null);
 add(9*3600,8888,4500000+(year-2019)*180000,'offline','F005','completed',null);
 if(year===YEAR){
  for(let k=1;k<=80;k++)add(1200+(k-1)*1030,1,25+(k%4)*25,'online',funds[k%24].id,'completed','P1');
  for(let k=1;k<=55;k++)add(1800+(k-1)*1480,2,50,'online',funds[k%18].id,'completed','P2');
  add(14*3600+45*60,3,10000,'online','F004','completed','P3');
  add(14*3600+51*60,29,15000,'online','F008','completed',null);
 }
}
ledger.sort((a,b)=>a.year-b.year||a.t-b.t||a.id.localeCompare(b.id));
const byYear=new Map([...YEARS,YEAR].map(y=>[y,ledger.filter(g=>g.year===y)]));
const fundMap=new Map(funds.map(f=>[f.id,f]));
const sum=(a,fn=x=>x)=>a.reduce((v,x)=>v+fn(x),0),mean=a=>a.length?sum(a)/a.length:null;
const ratio=(a,b)=>b>0?a/b:null;
const scopeMatch=(g,scope='all',priority=[])=>scope==='all'||(scope==='priority'?priority.includes(g.fund):scope.startsWith('U')?fundMap.get(g.fund).unit===scope:g.fund===scope);
function rows(o={}){const {year=YEAR,cut=86400,period='day',channel='combined',scope='all',priority=[]}=o;return (byYear.get(year)||[]).filter(g=>g.status==='completed'&&g.t<cut&&(period==='campaign'||(period==='vip'?g.t<0:g.t>=0))&&(channel==='combined'||g.channel===channel)&&scopeMatch(g,scope,priority));}
function stats(gs){const ds=new Set(gs.map(g=>g.donor));return {gifts:gs.length,cents:sum(gs,g=>g.cents),donors:ds.size,gpd:ds.size?gs.length/ds.size:0,average:gs.length?sum(gs,g=>g.cents)/gs.length:0};}
function hourly(o={}){const a=Array.from({length:24},()=>({gifts:0,cents:0,onlineGifts:0,onlineCents:0}));for(const g of rows({...o,period:'day',cut:86400})){const h=Math.floor(g.t/3600);a[h].gifts++;a[h].cents+=g.cents;if(g.channel==='online'){a[h].onlineGifts++;a[h].onlineCents+=g.cents;}}return a;}
function baseline(o,ys,key){if(!ys.length)return null;const arrays=ys.map(year=>hourly({...o,year}));return Array.from({length:24},(_,h)=>mean(arrays.map(a=>a[h][key])));}
function forecast(o,ys,key,gate=.15){
 const cut=Math.floor(o.cut/3600)*3600,n=cut/3600,b=baseline(o,ys,key),actual=hourly(o).map(r=>r[key]);
 const live=rows(o),vip=o.period==='campaign'?rows({...o,period:'vip'}):[];
 const pick=gs=>key==='gifts'?gs.length:sum(gs,g=>g.cents), observed=pick(live),v=pick(vip);
 if(o.period==='vip')return {ready:false,reason:'VIP only - no day forecast',actual:observed,gate};
 const day=sum(actual.slice(0,n)),hist=b?sum(b.slice(0,n)):null,full=b?sum(b):null,share=ratio(hist,full),ready=n===24||(n>0&&share!==null&&share>=gate);
 const raw=n===24?observed:share>0?v+day/share:null;
 const rate=n?day/n:null,three=n?mean(actual.slice(Math.max(0,n-3),n)):null,remaining=24-n;
 const recent=three===null?null:Math.max(observed,v+day+remaining*three),run=rate===null?null:Math.max(observed,v+day+remaining*rate),stretch=three===null?null:Math.max(observed,v+day+remaining*three*1.1);
 const shapes=ys.map(year=>{const a=hourly({...o,year}).map(r=>r[key]),s=ratio(sum(a.slice(0,n)),sum(a));return s>0?v+day/s:null;}).filter(x=>x!==null);
 const history=raw===null?null:Math.max(observed,raw);
 return {ready,reason:ready?'Readiness gate met':n?'Historical day share below '+Math.round(gate*100)+'%':'No completed hour',actual:observed,day,vip:v,share,history,projection:ready?history:null,rate,three,run, recent,stretch,low:ready&&shapes.length?Math.max(observed,Math.min(...shapes)):null,high:ready&&shapes.length?Math.max(observed,Math.max(...shapes)):null,gate,n,remaining};
}
function donors(gs,cut){const m=new Map();for(const g of gs){let d=m.get(g.donor);if(!d){d={id:g.donor,name:donorName(g.donor),gifts:0,cents:0,recent:0,last:-Infinity,funds:new Set(),restricted:false};m.set(g.donor,d);}d.gifts++;d.cents+=g.cents;d.recent+=g.t>=Math.max(0,cut-7200)?1:0;d.last=Math.max(d.last,g.t);d.funds.add(g.fund);d.restricted||=g.restricted;}return [...m.values()];}
function recognition(cut,threshold,milestones){const gs=rows({cut,channel:'online',period:'day'}),counts=new Map(),events=[];for(const g of gs){const n=(counts.get(g.donor)||0)+1;counts.set(g.donor,n);if(g.cents>=threshold)events.push({key:g.id+'-amount',type:'Significant online gift',gift:g,count:n});if(milestones.includes(n))events.push({key:g.donor+'-'+n,type:'Gift-count milestone',gift:g,count:n});}return events.sort((a,b)=>b.gift.t-a.gift.t||a.key.localeCompare(b.key));}
function defaults(){const goals={};for(const period of ['day','campaign'])for(const channel of ['online','combined']){
 const baseG=channel==='online'?20000:22000,baseC=channel==='online'?360000000:1000000000;
 for(const id of ['all',...units.map(u=>u.id),...funds.map(f=>f.id)]){const factor=id==='all'?1:id.startsWith('U')?1/8:1/24;goals[period+'|'+channel+'|'+id]={gifts:Math.round((baseG+(period==='campaign'?700:0))*factor),cents:Math.round((baseC+(period==='campaign'?45000000:0))*factor)};}
 }return {giftYears:YEARS.filter(y=>y!==2020),dollarYears:[...YEARS],compare:[2025,2026],prior:2026,gate:.15,alert:.10,major:1000000,milestones:[5000,10000,15000,20000],donorMilestones:[10,25,50,75,100],priority:funds.filter((f,i)=>i%4===0).map(f=>f.id),goals};}
function goal(cfg,period,channel,scope,key){const p=period==='vip'?'campaign':period; if(scope==='priority')return sum(cfg.priority,id=>cfg.goals[p+'|'+channel+'|'+id]?.[key]||0);return cfg.goals[p+'|'+channel+'|'+scope]?.[key]??null;}
function momentum(a,b,n){if(!n||!b)return null;return ratio(sum(a.slice(Math.max(0,n-3),n)),sum(b.slice(Math.max(0,n-3),n)));}
function classification(v){return v===null?'Unavailable':v>=1.3?'Surging':v>=1.1?'Strong':v<.9?'Below pattern':'Monitor';}
function csvParse(text){const out=[];let row=[],field='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(field);field='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(v=>v.trim()))out.push(row);row=[];field='';}else field+=c;}if(quoted)throw Error('Unclosed CSV quotation.');row.push(field);if(row.some(v=>v.trim()))out.push(row);return out;}
const api={YEAR,YEARS,units,funds,leaders,donorName,ledger,rows,stats,hourly,baseline,forecast,donors,recognition,defaults,goal,momentum,classification,sum,mean,ratio,csvParse,fundMap};
root.DOG=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
