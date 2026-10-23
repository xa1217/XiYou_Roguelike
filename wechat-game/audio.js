// Native wx audio Adapter: all resources are generated locally by scripts/generate-audio.mjs.
class WxAudio {
  constructor(api){this.wx=api;this.muted=false;this.volume=.65;this.nodes={};this.last={};this.bgm=null;this.theme='forest';this.failed=false;}
  get(type){if(this.nodes[type])return this.nodes[type];const a=this.wx.createInnerAudioContext?.();if(!a)return null;a.src=`assets/audio/${type}.wav`;a.volume=this.muted?0:this.volume;a.onError?.(()=>{this.failed=true;});this.nodes[type]=a;return a;}
  play(type){const aliases={attack:'attack',hurt:'hurt',hit:'hit',crit:'hit',kill:'kill',elite:'boss',boss:'boss',pickup:'pickup',dash:'dash',click:'click',level:'level',win:'win',lose:'lose'};type=aliases[type];if(!type||this.muted)return;const now=Date.now(),gap=['hit','kill','pickup','attack'].includes(type)?100:40;if(now-(this.last[type]||0)<gap)return;this.last[type]=now;const a=this.get(type);if(a){a.stop();a.play();}}
  startMusic(theme='forest'){this.theme=theme;if(!this.bgm){this.bgm=this.wx.createInnerAudioContext?.();if(!this.bgm)return;this.bgm.loop=true;this.bgm.onError?.(()=>{this.failed=true;});}this.bgm.src=`assets/audio/bgm-${theme}.mp3`;this.bgm.volume=this.muted?0:this.volume*.45;this.bgm.play();}
  stopMusic(){this.bgm?.stop();}
  setMuted(v){this.muted=!!v;Object.values(this.nodes).forEach(a=>a.volume=v?0:this.volume);if(this.bgm)this.bgm.volume=v?0:this.volume*.45;}
  dispose(){this.stopMusic();this.bgm?.destroy();Object.values(this.nodes).forEach(a=>a.destroy());this.nodes={};this.bgm=null;}
}
module.exports={WxAudio};
