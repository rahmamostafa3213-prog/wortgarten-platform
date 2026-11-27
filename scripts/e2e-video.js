/* eslint-disable */
const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage();await p.setViewport({width:412,height:1000});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('requestfailed',r=>errs.push('REQFAIL '+r.url()));
 p.on('response',r=>{if(r.status()>=400)errs.push(r.status()+' '+r.url())});
 const base='http://localhost:3100',H=process.env.HOME+'/pshots/';
 await p.goto(base+'/videos?lang=ar&dark=0');await sleep(1200);await p.screenshot({path:H+'vid-list.png'});
 await p.goto(base+'/videos/7?lang=ar&dark=0');await sleep(1500);
 const clickBtn=(txt)=>p.evaluate((t)=>{[...document.querySelectorAll('main button')].find(x=>x.textContent.trim()===t).click()},txt);
 await clickBtn('1.5x');
 await clickBtn('ترجمة ألماني');
 await p.evaluate(()=>{const v=document.querySelector('video');v.currentTime=24.0;v.playbackRate=0.75;return v.play()}).catch(e=>errs.push('play '+e.message));
 await sleep(900);
 const info=await p.evaluate(()=>{const v=document.querySelector('video');const out=[];for(const t of v.textTracks)out.push({lang:t.language,mode:t.mode,cues:t.cues&&t.cues.length,active:[...(t.activeCues||[])].map(c=>c.text)});return {rate:v.playbackRate,time:v.currentTime,dur:v.duration,ready:v.readyState,tracks:out,buttons:[...document.querySelectorAll('main button')].map(x=>x.textContent.trim())}});
 console.log(JSON.stringify(info));
 await p.screenshot({path:H+'vid-player.png'});
 // video with no captions
 await p.goto(base+'/videos/2?lang=ar&dark=1');await sleep(1200);await p.screenshot({path:H+'vid-nocaps.png'});
 console.log('errors',errs);await b.close();
})();
