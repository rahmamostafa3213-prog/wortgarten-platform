/* eslint-disable */
const puppeteer=require('puppeteer-core');const fs=require('fs');
const c=JSON.parse(fs.readFileSync(process.env.HOME+'/wortgarten-web/data/content.json'));
const de2ar={},ar2de={};for(const u of c.units)for(const w of u.words){de2ar[w.de.replace(/^(der|die|das) /,'')]=w.ar;de2ar[w.de]=w.ar;ar2de[w.ar]=w.de}
const art={};for(const u of c.units)for(const w of u.words){const m=/^(der|die|das) (.+)$/.exec(w.de);if(m)art[m[2]]=m[1];else if(w.gender)art[w.de]={m:'der',f:'die',n:'das'}[w.gender]}
const verbs={};for(const v of c.verbs)verbs[v.inf]=v.forms;
const pron=["ich","du","er/sie/es","wir","ihr","sie/Sie"];
(async()=>{
 const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});
 const p=await b.newPage();await p.setViewport({width:412,height:900});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 const base='http://localhost:3100';
 const run=async(kind,wrongEvery)=>{
  await p.goto(base+'/test/'+kind+'?lang=ar&dark=0');await new Promise(r=>setTimeout(r,800));
  await p.evaluate(()=>[...document.querySelectorAll('button')].find(x=>x.textContent.includes('ابدأي')).click());
  let n=0;
  for(;;){
   const q=await p.evaluate(()=>{const h=document.querySelector('h1');const opts=[...document.querySelectorAll('main button')].filter(x=>x.className.includes('border-2')).map(x=>x.textContent.trim());return {prompt:h&&h.textContent.trim(),opts,p:document.querySelector('p.text-sm.font-semibold')?.textContent}});
   if(!q.opts.length)break;
   let ans;const pr=q.prompt;
   if(art[pr]&&q.opts.includes('der'))ans=art[pr];
   else if(pr.includes('(')&&pr.includes('...')){const m=/^(.+?) \.\.\. \((.+)\)$/.exec(pr);ans=verbs[m[2]][pron.indexOf(m[1])]}
   else if(de2ar[pr]&&q.opts.includes(de2ar[pr]))ans=de2ar[pr];
   else if(ar2de[pr]&&q.opts.includes(ar2de[pr]))ans=ar2de[pr];
   if(ans===undefined){errs.push('no answer for '+JSON.stringify(q));ans=q.opts[0]}
   let idx=q.opts.indexOf(ans);if(wrongEvery&&n%wrongEvery===0)idx=(idx+1)%q.opts.length;
   await p.evaluate((i)=>[...document.querySelectorAll('main button')].filter(x=>x.className.includes('border-2'))[i].click(),idx);
   await p.evaluate(()=>[...document.querySelectorAll('main button')].filter(x=>!x.className.includes('border-2')).pop().click());
   n++;await new Promise(r=>setTimeout(r,60));
  }
  return {n,text:await p.evaluate(()=>document.body.innerText.slice(0,400))};
 };
 console.log('A1 perfect',JSON.stringify(await run('A1',0)));
 await p.screenshot({path:process.env.HOME+'/pshots/test-result.png'});
 console.log('progress',await p.evaluate(()=>localStorage.getItem('wg_progress_v1')));
 await p.goto(base+'/learn/14?lang=ar&dark=0');await new Promise(r=>setTimeout(r,800));
 console.log('A2 unit after gate:',await p.evaluate(()=>document.body.innerText.includes('مقفول')?'LOCKED':'OPEN'));
 await p.goto(base+'/?lang=ar&dark=0');await new Promise(r=>setTimeout(r,800));
 await p.screenshot({path:process.env.HOME+'/pshots/home-progress.png',fullPage:false});
 console.log('A2 test with wrong every 3rd',JSON.stringify(await run('A2',3)));
 await p.screenshot({path:process.env.HOME+'/pshots/test-fail.png'});
 // fresh profile: A2 locked
 await p.evaluate(()=>localStorage.clear());await p.goto(base+'/learn/14?lang=ar&dark=0');await new Promise(r=>setTimeout(r,800));
 console.log('fresh A2 unit:',await p.evaluate(()=>document.body.innerText.includes('مقفول')?'LOCKED':'OPEN'));
 await p.screenshot({path:process.env.HOME+'/pshots/locked.png'});
 console.log('errors',errs);
 await b.close();
})();
