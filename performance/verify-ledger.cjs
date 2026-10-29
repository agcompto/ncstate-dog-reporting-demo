// Run from this directory with: node verify-ledger.cjs
const assert=require('assert/strict'),D=require('./ledger.js'),cfg=D.defaults();let checks=0;
function eq(a,b,msg){assert.equal(a,b,msg);checks++;}
for(const cut of [0,900,3600,14400,53100,54000,86400])for(const period of ['day','campaign','vip'])for(const channel of ['online','combined'])for(const scope of ['all','priority','U2','F004']){
 const o={cut,period,channel,scope,priority:cfg.priority},gs=D.rows(o),s=D.stats(gs),ds=D.donors(gs,cut);
 eq(D.sum(ds,d=>d.gifts),s.gifts,'donor gifts reconcile');eq(D.sum(ds,d=>d.cents),s.cents,'donor dollars reconcile');eq(ds.length,s.donors,'donor IDs reconcile');
 const funded=D.funds.map(f=>gs.filter(g=>g.fund===f.id));eq(D.sum(funded,a=>a.length),s.gifts,'fund gifts reconcile');eq(D.sum(funded,a=>D.sum(a,g=>g.cents)),s.cents,'fund dollars reconcile');
 const v=D.stats(D.rows({...o,period:'vip'})),d=D.stats(D.rows({...o,period:'day'})),c=D.stats(D.rows({...o,period:'campaign'}));eq(v.gifts+d.gifts,c.gifts,'VIP+day gifts');eq(v.cents+d.cents,c.cents,'VIP+day dollars');
 assert(gs.every(g=>g.status==='completed'&&g.t<cut));checks++;
 const f=D.forecast(o,cfg.giftYears,'gifts');if(period!=='vip'&&cut===86400){eq(f.projection,s.gifts,'at end projection is actual');eq(f.run,s.gifts,'end run is actual');eq(f.recent,s.gifts,'end recent is actual');eq(f.stretch,s.gifts,'end stretch is actual');}
 for(const key of ['projection','run','recent','stretch'])if(f[key]!=null)assert(f[key]>=s.gifts,'No forecast below observed '+key);
}
const e=D.recognition(54000,cfg.major,cfg.donorMilestones),keys=e.map(x=>x.key);eq(new Set(keys).size,keys.length,'recognition has no duplicate IDs');assert(e.every(e=>e.gift.channel==='online'&&e.gift.status==='completed'&&e.gift.t>=0&&e.gift.t<54000));
const fiftieth=e.find(e=>e.gift.donor==='D-00001'&&e.count===50&&e.type==='Gift-count milestone');assert(fiftieth);const support=D.rows({cut:fiftieth.gift.t+1,channel:'online',period:'day'}).filter(g=>g.donor===fiftieth.gift.donor);eq(support.length,50,'50th is supported by exactly 50 records');
const after=D.recognition(86400,cfg.major,cfg.donorMilestones).filter(e=>e.key===fiftieth.key);eq(after.length,1,'50th is emitted only once');
eq(D.stats(D.rows({cut:86400,channel:'combined'})).gifts,D.sum(D.hourly(),h=>h.gifts),'hourly sums reconcile');
assert(D.forecast({cut:0},cfg.giftYears,'gifts').projection===null,'no pre-event forecast');assert(D.forecast({cut:3600},[],'gifts').projection===null,'missing baseline not zero');
console.log('PASS',checks,'reconciliation assertions; recognition sequence, missing baseline, forecast floor and event boundaries checked.');
