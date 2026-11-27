/* eslint-disable */
const puppeteer=require('puppeteer-core');
(async()=>{
 const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});
 const p=await b.newPage();await p.setViewport({width:412,height:900});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 const base='http://localhost:3100',H=process.env.HOME+'/pshots/';
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 for(const k of ['artikel','konjugation','perfekt','kasus','satzbau']){
  await p.goto(base+'/practice/'+k+'?lang=ar&dark=0');await sleep(700);
  await p.evaluate(()=>[...document.querySelectorAll('button')].find(x=>x.textContent.includes('ابدأي')).click());
  let n=0;
  for(;n<12;n++){
   await sleep(50);
   if(k==='satzbau'){
    const r=await p.evaluate(()=>{const btns=[...document.querySelectorAll('main button')];if(!document.body.innerText.includes('رتّبي الجملة'))return null;return true});
    if(!r)break;
    // build correct answer: need solution; read via exposing? click words in order by matching target from first-run attempt: brute force by sorting using known sentences
    const sol=await p.evaluate(()=>document.body.innerText);
    // find arabic prompt and look up solution in content.json via node side
    const ar=(await p.evaluate(()=>document.querySelector('main p.text-xl').textContent.trim()));
    const c=require(process.env.HOME+'/wortgarten-web/data/content.json');
    const s=c.units.flatMap(u=>u.sentences).find(x=>x.ar===ar);
    const words=s.de.split(' ');
    for(const w of words){
     await p.evaluate((w)=>{const pool=[...document.querySelectorAll('main div.mt-3 button')].filter(x=>!x.disabled&&x.textContent===w);pool[0].click()},w);
    }
    if(n===2){await p.screenshot({path:H+'prac-order.png'})}
    await p.evaluate(()=>[...document.querySelectorAll('main button')].find(x=>x.textContent.includes('تحقق')).click());
    await sleep(30);
    await p.evaluate(()=>[...document.querySelectorAll('main button')].filter(x=>!x.className.includes('border-2')).pop().click());
   } else {
    const o=await p.evaluate(()=>[...document.querySelectorAll('main button')].filter(x=>x.className.includes('border-2')).length);
    if(!o)break;
    if(n===1&&k==='kasus'){await p.evaluate(()=>[...document.querySelectorAll('main button')].filter(x=>x.className.includes('border-2'))[0].click());await sleep(50);await p.screenshot({path:H+'prac-kasus.png'});}
    else await p.evaluate(()=>[...document.querySelectorAll('main button')].filter(x=>x.className.includes('border-2'))[0].click());
    await p.evaluate(()=>[...document.querySelectorAll('main button')].filter(x=>!x.className.includes('border-2')).pop().click());
   }
  }
  const txt=await p.evaluate(()=>document.querySelector('main').innerText.replace(/\n/g,' | ').slice(0,120));
  console.log(k,'questions',n,'->',txt);
 }
 console.log('xp',await p.evaluate(()=>localStorage.getItem('wg_progress_v1')));
 await p.goto(base+'/practice?lang=ar&dark=1');await sleep(700);await p.screenshot({path:H+'prac-menu.png'});
 console.log('errors',errs);await b.close();
})();
