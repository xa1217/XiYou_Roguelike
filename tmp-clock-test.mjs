import {pathToFileURL} from 'node:url';
const pw=(await import(pathToFileURL('C:/Users/wangxr/.codex/skills/playwright-skill/node_modules/playwright/index.js'))).default;
const b=await pw.chromium.launch({headless:true}); const c=await b.newContext({viewport:{width:390,height:844}}); const p=await c.newPage();
await p.clock.install({time:new Date('2026-01-01T00:00:00Z')});
await p.goto('http://127.0.0.1:8088/native.html',{waitUntil:'networkidle'});
console.log('home',await p.evaluate(()=>({now:performance.now(),screen:window.xiyou?.screen,status:window.xiyou?.engine?.state?.status,frame:window.xiyou?.frame,running:window.xiyou?.running,buttons:window.xiyou?.buttons?.map(b=>({label:b.label,x:b.x,y:b.y,w:b.w,h:b.h}))})));
// click first menu via mouse
await p.mouse.click(195,485); await p.waitForTimeout(300);
console.log('select',await p.evaluate(()=>({now:performance.now(),screen:window.xiyou?.screen,buttons:window.xiyou?.buttons?.map(b=>({label:b.label,x:b.x,y:b.y,w:b.w,h:b.h}))})));
await p.mouse.click(285,180); await p.waitForTimeout(300); console.log('selected',await p.evaluate(()=>({screen:window.xiyou?.screen,character:window.xiyou?.characterId,buttons:window.xiyou?.buttons?.map(b=>({label:b.label,x:b.x,y:b.y,w:b.w,h:b.h}))})));
await p.mouse.click(195,615); await p.waitForTimeout(100); console.log('game',await p.evaluate(()=>({now:performance.now(),screen:window.xiyou?.screen,status:window.xiyou?.engine?.state?.status,time:window.xiyou?.engine?.state?.time,frame:window.xiyou?.frame,running:window.xiyou?.running})));
await p.clock.runFor(1000); console.log('after 1s',await p.evaluate(()=>({now:performance.now(),status:window.xiyou?.engine?.state?.status,time:window.xiyou?.engine?.state?.time,frame:window.xiyou?.frame,running:window.xiyou?.running,metrics:window.xiyou?.getMetrics?.()})));
await b.close();
