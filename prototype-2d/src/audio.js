/** Procedural audio for 西游·八十一难. Browser only; wx adapter can call the same semantic methods. */
const PENTATONIC = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33];
const MUSIC_PATTERNS = {
  forest: [0,2,4,2,5,4,2,1], sand:[0,0,3,4,3,1,0,5], snow:[4,2,1,2,5,4,2,0], fire:[0,3,4,6,4,3,1,0], water:[0,2,5,4,2,3,1,0], temple:[0,4,5,4,2,1,4,5]
};
const performanceNow = () => Number(globalThis.performance?.now?.() || Date.now());

export class AudioManager {
  constructor(){ this.ctx=null; this.master=null; this.muted=false; this.volume=0.72; this.timer=null; this.step=0; this.theme='forest'; this.lastPlay={}; }
  unlock(){
    if(!this.ctx){ const C=globalThis.AudioContext||globalThis.webkitAudioContext; if(!C) return false; this.ctx=new C(); this.master=this.ctx.createGain(); this.master.gain.value=this.volume; this.master.connect(this.ctx.destination); }
    if(this.ctx.state==='suspended') this.ctx.resume(); return true;
  }
  setMuted(value){ this.muted=!!value; if(this.master) this.master.gain.setTargetAtTime(this.muted?0:this.volume,this.ctx.currentTime,0.02); }
  setVolume(value){ this.volume=Math.max(0,Math.min(1,Number(value)||0)); if(this.master&&!this.muted) this.master.gain.setTargetAtTime(this.volume,this.ctx.currentTime,0.02); }
  startMusic(theme='forest'){ this.theme=theme; this.unlock(); if(!this.ctx||this.timer) return; this.step=0; const tick=()=>{ if(!this.ctx) return; const pattern=MUSIC_PATTERNS[this.theme]||MUSIC_PATTERNS.forest; const n=pattern[this.step++%pattern.length]; this.tone(PENTATONIC[n],0.34,0.11,'triangle',0.055); if(this.step%4===0) this.tone(PENTATONIC[(n+2)%7]/2,0.45,0.16,'sine',0.032); }; tick(); this.timer=setInterval(tick,420); }
  stopMusic(){ if(this.timer){ clearInterval(this.timer); this.timer=null; } }
  tone(freq,duration=0.12,gain=0.08,type='sine',delay=0){ if(!this.ctx||this.muted) return; const t=this.ctx.currentTime+delay, osc=this.ctx.createOscillator(), g=this.ctx.createGain(); osc.type=type; osc.frequency.setValueAtTime(freq,t); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(Math.max(0.001,gain),t+0.012); g.gain.exponentialRampToValueAtTime(0.0001,t+duration); osc.connect(g); g.connect(this.master); osc.start(t); osc.stop(t+duration+0.03); }
  noise(duration=0.12,gain=0.045){ if(!this.ctx||this.muted) return; const len=Math.floor(this.ctx.sampleRate*duration), buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate), data=buf.getChannelData(0); for(let i=0;i<len;i++) data[i]=(Math.random()*2-1)*(1-i/len); const src=this.ctx.createBufferSource(), g=this.ctx.createGain(); g.gain.value=gain; src.buffer=buf; src.connect(g); g.connect(this.master); src.start(); }
  play(type){ this.unlock(); const map={attack:[280,0.10,0.06,'square'],hit:[392,0.05,0.045,'square'],hurt:[145,0.21,0.08,'sawtooth'],crit:[740,0.10,0.07,'triangle'],kill:[523.25,0.09,0.07,'triangle'],elite:[220,0.16,0.08,'sawtooth'],boss:[130.81,0.4,0.12,'sawtooth'],pickup:[659.25,0.12,0.055,'sine'],level:[523.25,0.13,0.08,'triangle'],dash:[784,0.07,0.06,'square'],click:[440,0.045,0.04,'square'],win:[523.25,0.18,0.08,'triangle'],lose:[196,0.32,0.08,'sawtooth'],gong:[130.81,0.5,0.12,'sine']}; const v=map[type]; if(v){ const now=performanceNow(); const gap=type==='hit'?70:type==='attack'?35:type==='pickup'?90:35; if(now-(this.lastPlay[type]||-Infinity)<gap)return; this.lastPlay[type]=now; this.tone(v[0],v[1],v[2],v[3]); if(type==='crit'){ this.tone(v[0]*1.25,v[1]*.8,v[2]*.75,v[3],0.06); } if(type==='level'||type==='win'){ this.tone(v[0]*1.25,v[1],v[2]*0.72,v[3],0.12); this.tone(v[0]*1.5,v[1],v[2]*0.5,v[3],0.24); } } else if(type==='whoosh') this.noise(0.12,0.04); }
  dispose(){ this.stopMusic(); if(this.ctx){ this.ctx.close(); this.ctx=null; this.master=null; } }
}
export const audioManager = new AudioManager();
