/* eslint-disable */
const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});
 const p=await b.newPage();await p.setViewport({width:412,height:900});
 const errs=[],calls=[];p.on('pageerror',e=>errs.push(e.message));
 let mode='ok';
 await p.setRequestInterception(true);
 p.on('request',r=>{
  if(r.url().includes('generativelanguage.googleapis.com')){
   const h=r.headers();const body=JSON.parse(r.postData()||'{}');
   calls.push({model:r.url().split('/models/')[1].split(':')[0],key:h['x-goog-api-key'],sys:!!body.systemInstruction,turns:(body.contents||[]).length,m:r.method()});
   const cors={'access-control-allow-origin':'*','access-control-allow-headers':'*'};
   if(r.method()==='OPTIONS')return r.respond({status:204,headers:cors});
   if(mode==='key')return r.respond({status:403,headers:cors,contentType:'application/json',body:'{"error":{}}'});
   const first=!calls.some((c,i)=>i<calls.length-1&&c.model);
   if(mode==='ok'&&calls.filter(c=>c.m==='POST').length===1)return r.respond({status:429,headers:cors,contentType:'application/json',body:'{"error":{}}'});
   return r.respond({status:200,headers:cors,contentType:'application/json',body:JSON.stringify({candidates:[{content:{parts:[{text:'Ich gehe zur Schule.\nDu hast "ich gehe in Schule" geschrieben. Richtig: zur Schule.\nWohin gehst du?'}]}}]})});
  } else r.continue();
 });
 const base='http://localhost:3100',H=process.env.HOME+'/pshots/';
 await p.goto(base+'/tutor?lang=ar&dark=0');await sleep(1000);await p.screenshot({path:H+'tutor-setup.png'});
 await p.type('input[type=password]','TESTKEY123');
 await p.evaluate(()=>[...document.querySelectorAll('main button')].find(x=>x.textContent.includes('حفظ')).click());await sleep(300);
 await p.type('input[placeholder]','Ich gehe in Schule');await p.keyboard.press('Enter');await sleep(1500);
 console.log('calls',JSON.stringify(calls.filter(c=>c.m==='POST')));
 await p.screenshot({path:H+'tutor-chat.png'});
 mode='key';calls.length=0;
 await p.type('input[placeholder]','Hallo');await p.keyboard.press('Enter');await sleep(1200);
 console.log('key-error text:',await p.evaluate(()=>document.querySelector('[aria-live]').innerText.slice(-90)),'calls',calls.filter(c=>c.m==='POST').length);
 console.log('stored key in localStorage:',await p.evaluate(()=>localStorage.getItem('wg_gemini_key')));
 console.log('errors',errs);await b.close();
})();
