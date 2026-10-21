import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pw = await loadPlaywright();
const browser = await pw.chromium.launch(browserLaunchOptions());
const page = await browser.newPage();
await page.goto(process.env.XIYOU_URL || 'http://127.0.0.1:8088/', {waitUntil:'networkidle'});
await page.mouse.click(100, 100); // real input unlocks the page's audio policy
const results = await page.evaluate(async () => {
  const {AudioManager} = await import('./src/audio.js');
  const rows=[];
  for (const event of ['attack','hit','hurt','kill','elite','boss','pickup','dash','click','level','crit','win','lose']) {
    const a=new AudioManager(); a.unlock(); await a.ctx.resume();
    const meter=a.ctx.createAnalyser(); meter.fftSize=512; a.master.connect(meter);
    const buffer=new Float32Array(meter.fftSize); a.play(event);
    let peak=0;
    for(let i=0;i<6;i++){await new Promise(r=>setTimeout(r,20));meter.getFloatTimeDomainData(buffer);for(const v of buffer)peak=Math.max(peak,Math.abs(v));}
    rows.push({event,peak:Number(peak.toFixed(5)),audible:peak>0.001}); a.dispose();
  }
  const a=new AudioManager(); a.unlock(); await a.ctx.resume(); a.startMusic('fire');
  const musicRunning=Boolean(a.timer); a.setMuted(true); await new Promise(r=>setTimeout(r,180));
  const mutedGain=a.master.gain.value; a.stopMusic(); const timerStopped=a.timer===null; a.dispose();
  return {rows,musicRunning,mutedGain,timerStopped,disposed:a.ctx===null};
});
await browser.close();
const pass=results.rows.every(x=>x.audible)&&results.musicRunning&&results.mutedGain<0.001&&results.timerStopped&&results.disposed;
const report={generatedAt:new Date().toISOString(),result:pass?'PASS':'FAIL',scope:'Real Chromium AudioContext analyser; synthesis and lifecycle, not a subjective listening review',...results};
fs.mkdirSync(path.join(root,'evidence/current'),{recursive:true});fs.writeFileSync(path.join(root,'evidence/current/audio.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));if(!pass)process.exitCode=1;
