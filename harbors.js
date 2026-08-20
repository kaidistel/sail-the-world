window.SAIL_HARBORS=[
{name:'Nassauhafen Wilhelmshaven · Schwimmsteg',lat:53.51384,lon:8.15146,heading:10},
{name:'Borkum · Burkana-Hafen Steg',lat:53.55755,lon:6.74933,heading:35},
{name:'Juist · Segelklub Schwimmsteg',lat:53.67326,lon:6.99874,heading:20},
{name:'Norderney · SVN Yachthafen',lat:53.70288,lon:7.16567,heading:15},
{name:'Baltrum · BBC Yachthafen Ostseite',lat:53.72303,lon:7.36756,heading:25},
{name:'Langeoog · Seglerverein Steganlage',lat:53.72717,lon:7.49763,heading:345},
{name:'Spiekeroog · SSC Yachthafen',lat:53.76484,lon:7.69769,heading:18},
{name:'Wangerooge · WYC Steganlage',lat:53.77449,lon:7.86843,heading:20},
{name:'Norddeich · Yacht-Club Norden',lat:53.64492,lon:7.14838,heading:350},
{name:'Neßmersiel · Sportboothafen',lat:53.68272,lon:7.35895,heading:350},
{name:'Bensersiel · Yachthafen',lat:53.67704,lon:7.57297,heading:350},
{name:'Neuharlingersiel · NYC Schwimmsteg',lat:53.70236,lon:7.70625,heading:350},
{name:'Harlesiel · Sportboothafen',lat:53.70660,lon:7.80745,heading:350},
{name:'Emden · Emder Yacht Club Außenhafen',lat:53.33778,lon:7.18389,heading:260},
{name:'Helgoland · Südhafen Sportbootsteg',lat:54.17138,lon:7.89395,heading:350},
{name:'Cuxhaven · SVC Yachthafen Mittelschlengel',lat:53.87427,lon:8.70608,heading:105},
{name:'Cuxhaven · LCF Amerikahafen Steg',lat:53.86795,lon:8.71644,heading:100},
{name:'Hooksiel · Marina dritte Steganlage',lat:53.63378,lon:8.04564,heading:95},
{name:'Hooksiel · WSV Steganlage',lat:53.63149,lon:8.03942,heading:95},
{name:'Hooksiel · Werft erste Steganlage',lat:53.64038,lon:8.07774,heading:95},
{name:'Hooksiel · Alter Hafen',lat:53.62712,lon:8.02884,heading:90},
{name:'Bremerhaven · Lloyd Marina Neuer Hafen',lat:53.54437,lon:8.56805,heading:350},
{name:'Fedderwardersiel · BYC Yachthafen',lat:53.59462,lon:8.35980,heading:350},
{name:'Dangast · Hafen Steg',lat:53.44625,lon:8.10825,heading:20}
];

/* Lightweight cockpit HUD */
addEventListener('DOMContentLoaded',()=>{
 const css=document.createElement('style');css.textContent=`
 :root{--glass:rgba(5,22,32,.88);--edge:rgba(255,255,255,.16);--muted:#aebcc4}
 #hud{top:16px!important;left:16px!important;width:220px!important;text-shadow:none!important;pointer-events:none}#hud h3,.stats{display:none!important}.help{display:none!important}
 #conceptControls,#boatInfo,#speedDial,#statusBars,#headingTape{position:fixed;z-index:28;color:#fff;pointer-events:none}.glass{background:var(--glass);border:1px solid var(--edge);border-radius:10px;box-shadow:0 10px 28px rgba(0,0,0,.28);backdrop-filter:blur(8px)}
 #conceptControls{left:16px;top:16px;width:220px;padding:12px 13px}.ctitle{font-size:13px;font-weight:900;border-bottom:1px solid #ffffff22;padding-bottom:8px;margin-bottom:6px}.crow{display:grid;grid-template-columns:48px 1fr;gap:8px;align-items:center;font-size:11px;padding:5px 0}.key{background:#0a1a22;border-radius:5px;padding:4px 5px;text-align:center;font-weight:900}.desc{color:#e5edf1}
 #headingTape{top:12px;left:50%;transform:translateX(-50%);width:540px;text-align:center}.tape{height:45px;border-bottom:1px solid #ffffff99;background:linear-gradient(90deg,transparent,#07162555,transparent)}.ticks{display:flex;justify-content:space-around;font-size:11px;padding-top:5px}.courseBadge{display:inline-block;margin-top:7px;padding:3px 9px;border-radius:5px;background:#263d4bcc;font-size:17px;font-weight:800}
 #miniBox{width:360px!important;height:280px!important}#miniHead{height:34px!important}#mini{height:246px!important}
 #boatInfo{left:16px;bottom:290px;width:205px;padding:12px}.irow{display:flex;justify-content:space-between;font-size:10px;padding:4px 0}
 #speedDial{left:18px;bottom:78px;width:178px;height:178px;border-radius:50%;border:9px solid #263b44;background:radial-gradient(circle,#122630 0 58%,#08151c 59% 100%);display:flex;flex-direction:column;align-items:center;justify-content:center}.dialN{font-size:18px;font-weight:900}.dialBoat{font-size:30px}.dialSpeed{font-size:25px;font-weight:900}.dialUnit{font-size:9px;color:var(--muted)}
 #statusBars{left:16px;bottom:14px;width:220px;padding:9px 12px}.barrow{display:grid;grid-template-columns:25px 1fr 34px;gap:8px;align-items:center;font-size:10px;margin:5px 0}.bar{height:8px;background:#33444b;border-radius:5px;overflow:hidden}.fill{height:100%;background:#35d77d;border-radius:5px}
 @media(max-width:900px){#conceptControls,#boatInfo,#speedDial,#statusBars{display:none}#headingTape{width:44vw}#miniBox{width:290px!important;height:215px!important}#mini{height:181px!important}}
 `;document.head.appendChild(css);
 const controls=document.createElement('div');controls.id='conceptControls';controls.className='glass';controls.innerHTML='<div class="ctitle">STEUERUNG</div>'+[['W / S','Gas / Rückwärts'],['A / D','Steuerung'],['MAUS','Kamera drehen'],['RAD','Kamera-Zoom'],['G','Anlegen / Ablegen'],['M','Karte öffnen'],['C','Kamera zentrieren']].map(x=>`<div class="crow"><span class="key">${x[0]}</span><span class="desc">${x[1]}</span></div>`).join('');document.body.appendChild(controls);
 const tape=document.createElement('div');tape.id='headingTape';tape.innerHTML='<div class="tape"><div class="ticks"><span>240</span><span>270</span><span>300</span><span>330</span><span>N</span><span>30</span><span>60</span></div></div><div id="courseBadge" class="courseBadge">190°</div>';document.body.appendChild(tape);
 const info=document.createElement('div');info.id='boatInfo';info.className='glass';info.innerHTML='<div class="ctitle">BOOT</div><div class="irow"><span>Geschwindigkeit</span><b id="ciSpeed">0.0 kn</b></div><div class="irow"><span>Kurs</span><b id="ciCourse">190°</b></div><div class="irow"><span>Seegang</span><b id="ciSea">2 / 5</b></div><div class="irow"><span>Wellenhöhe</span><b id="ciWave">ca. 0,6 m</b></div><div class="irow"><span>Motordrehzahl</span><b id="ciRpm">900 rpm</b></div>';document.body.appendChild(info);
 const dial=document.createElement('div');dial.id='speedDial';dial.innerHTML='<div class="dialN">N</div><div class="dialBoat">⌁</div><div id="dialSpeed" class="dialSpeed">0.0</div><div class="dialUnit">KNOTEN</div>';document.body.appendChild(dial);
 const bars=document.createElement('div');bars.id='statusBars';bars.className='glass';bars.innerHTML='<div class="barrow"><span>⛽</span><div class="bar"><div class="fill" style="width:78%"></div></div><b>78%</b></div><div class="barrow"><span>⚙</span><div class="bar"><div id="engineFill" class="fill" style="width:8%"></div></div><b id="enginePct">8%</b></div>';document.body.appendChild(bars);
 const sync=()=>{const sp=parseFloat(document.getElementById('sp')?.textContent)||0,hd=parseInt(document.getElementById('hd')?.textContent)||0,th=Math.abs(parseInt(document.getElementById('th')?.textContent)||0),sea=document.getElementById('sea')?.value||2,w=document.getElementById('waveTxt')?.textContent||'~ 0,6 m';document.getElementById('ciSpeed').textContent=sp.toFixed(1)+' kn';document.getElementById('ciCourse').textContent=hd+'°';document.getElementById('courseBadge').textContent=hd+'°';document.getElementById('dialSpeed').textContent=sp.toFixed(1);document.getElementById('ciSea').textContent=sea+' / 5';document.getElementById('ciWave').textContent='ca. '+w.replace('~ ','');document.getElementById('ciRpm').textContent=Math.round(850+th*42)+' rpm';document.getElementById('engineFill').style.width=Math.max(8,th)+'%';document.getElementById('enginePct').textContent=Math.max(8,th)+'%';requestAnimationFrame(sync)};requestAnimationFrame(sync);
});