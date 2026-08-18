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

(function(){
if(!window.Cesium||window.__SAIL_RUNTIME_PATCH_V5)return;
window.__SAIL_RUNTIME_PATCH_V5=true;

// Keep the current boat heading behavior unchanged. The model itself now owns
// its final bow orientation; this patch focuses only on streaming and sea visuals.

// Aggressive world streaming: more requests, more cached tiles, finer LOD and
// surrounding siblings/ancestors preloaded before they enter the view.
try{
  Cesium.RequestScheduler.maximumRequests=180;
  Cesium.RequestScheduler.maximumRequestsPerServer=20;
}catch(_){ }

try{
  const NativeViewer=Cesium.Viewer;
  Cesium.Viewer=new Proxy(NativeViewer,{
    construct(Target,args,newTarget){
      const viewer=Reflect.construct(Target,args,newTarget);
      try{
        const globe=viewer.scene.globe;
        globe.maximumScreenSpaceError=.65;
        globe.preloadAncestors=true;
        globe.preloadSiblings=true;
        globe.loadingDescendantLimit=8;
        if('tileCacheSize' in globe) globe.tileCacheSize=1100;
        viewer.scene.fog.density=0.000022;
        viewer.scene.fog.screenSpaceErrorFactor=1.0;
        viewer.scene.highDynamicRange=true;
      }catch(_){ }

      // Stronger visible swell highlights. They stay well away from the centre
      // line so the translucent wave geometry never washes over the boat model.
      try{
        const waveMats=[];
        const crestMats=[];
        const waveCount=34;
        for(let i=0;i<waveCount;i++){
          const mat=new Cesium.ColorMaterialProperty(new Cesium.Color(.40,.76,.84,0));
          waveMats.push(mat);
          viewer.entities.add({
            position:new Cesium.CallbackProperty(function(){
              const carto=Cesium.Cartographic.fromCartesian(viewer.camera.positionWC);
              if(!carto)return Cesium.Cartesian3.ZERO;
              const sea=+(document.getElementById('sea')?.value||2);
              const t=performance.now()/1000;
              const row=i-waveCount/2;
              const phase=t*(.72+sea*.075)+i*.61;
              const forward=45+row*15+Math.sin(phase)*12;
              const sign=i%2?1:-1;
              const side=sign*(32+(i%8)*13+Math.sin(i*1.37+t*.14)*8);
              const hd=viewer.camera.heading||0;
              const north=forward*Math.cos(hd)-side*Math.sin(hd);
              const east=forward*Math.sin(hd)+side*Math.cos(hd);
              const lat=carto.latitude*180/Math.PI+north/111320;
              const lon=carto.longitude*180/Math.PI+east/(111320*Math.cos(carto.latitude));
              return Cesium.Cartesian3.fromDegrees(lon,lat,.115+.035*Math.sin(phase));
            },false),
            ellipse:{
              semiMajorAxis:new Cesium.CallbackProperty(function(){const sea=+(document.getElementById('sea')?.value||2);return 22+sea*8+(i%5)*7;},false),
              semiMinorAxis:new Cesium.CallbackProperty(function(){const sea=+(document.getElementById('sea')?.value||2);return .75+sea*.34+(i%3)*.22;},false),
              height:.12,
              rotation:(i%7)*.11,
              material:mat
            }
          });
        }

        // Foam crests only become obvious in medium/heavy weather.
        for(let i=0;i<18;i++){
          const mat=new Cesium.ColorMaterialProperty(new Cesium.Color(.92,.98,1,0));
          crestMats.push(mat);
          viewer.entities.add({
            position:new Cesium.CallbackProperty(function(){
              const carto=Cesium.Cartographic.fromCartesian(viewer.camera.positionWC);
              if(!carto)return Cesium.Cartesian3.ZERO;
              const sea=+(document.getElementById('sea')?.value||2);
              const t=performance.now()/1000;
              const phase=t*(.62+sea*.09)+i*.93;
              const forward=65+(i%9)*26+Math.sin(phase)*15;
              const sign=i%2?1:-1;
              const side=sign*(42+(i%6)*17);
              const hd=viewer.camera.heading||0;
              const north=forward*Math.cos(hd)-side*Math.sin(hd);
              const east=forward*Math.sin(hd)+side*Math.cos(hd);
              const lat=carto.latitude*180/Math.PI+north/111320;
              const lon=carto.longitude*180/Math.PI+east/(111320*Math.cos(carto.latitude));
              return Cesium.Cartesian3.fromDegrees(lon,lat,.15+.04*Math.sin(phase));
            },false),
            ellipse:{
              semiMajorAxis:new Cesium.CallbackProperty(function(){const sea=+(document.getElementById('sea')?.value||2);return 10+sea*4+(i%4)*4;},false),
              semiMinorAxis:new Cesium.CallbackProperty(function(){const sea=+(document.getElementById('sea')?.value||2);return .24+sea*.11;},false),
              height:.155,
              material:mat
            }
          });
        }

        viewer.scene.preRender.addEventListener(function(){
          const sea=+(document.getElementById('sea')?.value||2);
          const waterAlpha=sea===0?0:Math.min(.22,.045+sea*.032);
          waveMats.forEach((m,i)=>m.color.setValue(new Cesium.Color(.32,.72,.82,waterAlpha*(.55+(i%4)*.12))));
          const foamAlpha=sea<2?0:Math.min(.36,(sea-1)*.075);
          crestMats.forEach((m,i)=>m.color.setValue(new Cesium.Color(.94,.99,1,foamAlpha*(.62+(i%3)*.13))));
        });
      }catch(_){ }
      return viewer;
    }
  });
}catch(_){ }
})();
