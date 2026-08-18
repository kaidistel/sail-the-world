window.SAIL_HARBORS=[
{name:'Nassauhafen Wilhelmshaven',lat:53.513611,lon:8.151944,heading:190},
{name:'Borkum Burkana-Hafen',lat:53.55740,lon:6.74917,heading:35},
{name:'Juist Hafen',lat:53.673528,lon:6.996059,heading:20},
{name:'Norderney Yachthafen',lat:53.702383,lon:7.163700,heading:15},
{name:'Baltrum Hafen',lat:53.722883,lon:7.366883,heading:25},
{name:'Langeoog Yachthafen',lat:53.72697,lon:7.49645,heading:345},
{name:'Spiekeroog Yachthafen',lat:53.74883,lon:7.68956,heading:18},
{name:'Wangerooge Hafen',lat:53.7820,lon:7.9130,heading:20},
{name:'Norddeich Yachthafen',lat:53.626839,lon:7.158161,heading:350},
{name:'Neßmersiel Hafen',lat:53.685697,lon:7.360754,heading:350},
{name:'Bensersiel Hafen',lat:53.678136,lon:7.572488,heading:350},
{name:'Neuharlingersiel Hafen',lat:53.701439,lon:7.705300,heading:350},
{name:'Harlesiel Hafen',lat:53.7067,lon:7.8075,heading:350},
{name:'Emden Außenhafen',lat:53.342610,lon:7.187333,heading:260},
{name:'Helgoland Südhafen',lat:54.17125,lon:7.89920,heading:350}
];

/* Concept-style cockpit HUD. Kept here so the hosted simulator can be upgraded without another framework. */
addEventListener('DOMContentLoaded',()=>{
 const css=document.createElement('style');css.textContent=`
 :root{--glass:rgba(5,22,32,.88);--edge:rgba(255,255,255,.16);--muted:#aebcc4;--green:#35d77d}
 #hud{top:16px!important;left:16px!important;width:220px!important;text-shadow:none!important;pointer-events:none}
 #hud h3,.stats{display:none!important}.help{width:220px!important;margin:0!important;padding:0!important;background:transparent!important;font-size:0!important}
 #conceptControls,#boatInfo,#speedDial,#statusBars,#headingTape{position:fixed;z-index:28;color:#fff;pointer-events:none}
 .glass{background:var(--glass);border:1px solid var(--edge);border-radius:10px;box-shadow:0 10px 28px rgba(0,0,0,.28);backdrop-filter:blur(8px)}
 #conceptControls{left:16px;top:16px;width:220px;padding:12px 13px} .ctitle{font-size:13px;font-weight:900;border-bottom:1px solid #ffffff22;padding-bottom:8px;margin-bottom:6px}.crow{display:grid;grid-template-columns:48px 1fr;gap:8px;align-items:center;font-size:11px;padding:5px 0}.key{background:#0a1a22;border-radius:5px;padding:4px 5px;text-align:center;font-weight:900}.desc{color:#e5edf1}
 #headingTape{top:12px;left:50%;transform:translateX(-50%);width:540px;text-align:center}.tape{height:45px;position:relative;border-bottom:1px solid #ffffff99;background:linear-gradient(90deg,transparent,#07162555,transparent)}.ticks{display:flex;justify-content:space-around;font-size:11px;padding-top:5px;color:#f5f7f8}.courseBadge{display:inline-block;margin-top:7px;padding:3px 9px;border-radius:5px;background:#263d4bcc;font-size:17px;font-weight:800}
 #miniBox{width:360px!important;height:280px!important;border-radius:10px!important;background:var(--glass)!important}#miniHead{height:34px!important;font-size:10px!important}#mini{height:246px!important}
 #boatInfo{left:16px;bottom:290px;width:205px;padding:12px}.irow{display:flex;justify-content:space-between;font-size:10px;padding:4px 0}.irow b{font-weight:800}
 #speedDial{left:18px;bottom:78px;width:178px;height:178px;border-radius:50%;border:9px solid #263b44;background:radial-gradient(circle,#122630 0 58%,#08151c 59% 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 8px 24px #0008}.dialN{font-size:18px;font-weight:900}.dialBoat{font-size:30px;line-height:1;margin:10px 0 4px}.dialSpeed{font-size:25px;font-weight:900}.dialUnit{font-size:9px;color:var(--muted)}
 #statusBars{left:16px;bottom:14px;width:220px;padding:9px 12px}.barrow{display:grid;grid-template-columns:25px 1fr 34px;gap:8px;align-items:center;font-size:10px;margin:5px 0}.bar{height:8px;background:#33444b;border-radius:5px;overflow:hidden}.fill{height:100%;background:linear-gradient(90deg,#25b964,#55e087);border-radius:5px}
 #sim{width:245px!important;padding:13px!important}.title{font-size:13px!important}.row{font-size:11px!important;margin:8px 0!important}.hint{font-size:9px!important;line-height:1.4}
 @media(max-width:900px){#conceptControls,#boatInfo,#speedDial,#statusBars{display:none}#headingTape{width:44vw}#miniBox{width:290px!important;height:215px!important}#mini{height:181px!important}}
 `;document.head.appendChild(css);
 const controls=document.createElement('div');controls.id='conceptControls';controls.className='glass';controls.innerHTML='<div class="ctitle">STEUERUNG</div>'+[['W / S','Gas / Rückwärts'],['A / D','Steuerung'],['MAUS','Kamera drehen'],['RAD','Kamera-Zoom'],['G','Anlegen / Ablegen'],['M','Karte öffnen'],['C','Kamera zentrieren']].map(x=>`<div class="crow"><span class="key">${x[0]}</span><span class="desc">${x[1]}</span></div>`).join('');document.body.appendChild(controls);
 const tape=document.createElement('div');tape.id='headingTape';tape.innerHTML='<div class="tape"><div class="ticks"><span>240</span><span>270</span><span>300</span><span>330</span><span>N</span><span>30</span><span>60</span></div></div><div id="courseBadge" class="courseBadge">190°</div>';document.body.appendChild(tape);
 const info=document.createElement('div');info.id='boatInfo';info.className='glass';info.innerHTML='<div class="ctitle">BOOT</div><div class="irow"><span>Geschwindigkeit</span><b id="ciSpeed">0.0 kn</b></div><div class="irow"><span>Kurs</span><b id="ciCourse">190°</b></div><div class="irow"><span>Wind</span><b>15 kn</b></div><div class="irow"><span>Windrichtung</span><b>NW</b></div><div class="irow"><span>Seegang</span><b id="ciSea">2 / 5</b></div><div class="irow"><span>Wellenhöhe</span><b id="ciWave">ca. 0,6 m</b></div><div class="irow"><span>Motordrehzahl</span><b id="ciRpm">900 rpm</b></div>';document.body.appendChild(info);
 const dial=document.createElement('div');dial.id='speedDial';dial.innerHTML='<div class="dialN">N</div><div class="dialBoat">⌁</div><div id="dialSpeed" class="dialSpeed">0.0</div><div class="dialUnit">KNOTEN</div>';document.body.appendChild(dial);
 const bars=document.createElement('div');bars.id='statusBars';bars.className='glass';bars.innerHTML='<div class="barrow"><span>⛽</span><div class="bar"><div class="fill" style="width:78%"></div></div><b>78%</b></div><div class="barrow"><span>⚙</span><div class="bar"><div id="engineFill" class="fill" style="width:10%"></div></div><b id="enginePct">10%</b></div>';document.body.appendChild(bars);
 const sync=()=>{const sp=parseFloat(document.getElementById('sp')?.textContent)||0,hd=parseInt(document.getElementById('hd')?.textContent)||0,th=Math.abs(parseInt(document.getElementById('th')?.textContent)||0),sea=document.getElementById('sea')?.value||2,w=document.getElementById('waveTxt')?.textContent||'~ 0,6 m';document.getElementById('ciSpeed').textContent=sp.toFixed(1)+' kn';document.getElementById('ciCourse').textContent=hd+'°';document.getElementById('courseBadge').textContent=hd+'°';document.getElementById('dialSpeed').textContent=sp.toFixed(1);document.getElementById('ciSea').textContent=sea+' / 5';document.getElementById('ciWave').textContent='ca. '+w.replace('~ ','');document.getElementById('ciRpm').textContent=Math.round(850+th*42)+' rpm';document.getElementById('engineFill').style.width=Math.max(8,th)+'%';document.getElementById('enginePct').textContent=Math.max(8,th)+'%';requestAnimationFrame(sync)};requestAnimationFrame(sync);
});