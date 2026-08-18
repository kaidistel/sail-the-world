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
if(!window.Cesium||window.__SAIL_RUNTIME_PATCH_V3)return;
window.__SAIL_RUNTIME_PATCH_V3=true;

// Boat: previous +90° correction made the yacht upright but visually backwards.
// Add another 180° around the local vertical axis only.
const originalHprToFixed=Cesium.Transforms.headingPitchRollToFixedFrame;
Cesium.Transforms.headingPitchRollToFixedFrame=function(origin,hpr,ellipsoid,fixedFrameTransform,result){
  if(hpr){hpr=new Cesium.HeadingPitchRoll(hpr.heading-Cesium.Math.PI_OVER_TWO,hpr.pitch,hpr.roll);}
  return originalHprToFixed.call(this,origin,hpr,ellipsoid,fixedFrameTransform,result);
};

// Ask Cesium for more surrounding terrain/imagery before it becomes visible.
// This costs some extra bandwidth/RAM but makes fast boating much less pop-in heavy.
try{
  Cesium.RequestScheduler.maximumRequests=100;
  Cesium.RequestScheduler.maximumRequestsPerServer=12;
}catch(_){ }

// Patch Viewer construction so every instance gets the same streaming settings.
try{
  const NativeViewer=Cesium.Viewer;
  Cesium.Viewer=new Proxy(NativeViewer,{
    construct(Target,args,newTarget){
      const viewer=Reflect.construct(Target,args,newTarget);
      try{
        const globe=viewer.scene.globe;
        globe.maximumScreenSpaceError=1.15;
        globe.preloadAncestors=true;
        globe.preloadSiblings=true;
        if('tileCacheSize' in globe) globe.tileCacheSize=500;
        viewer.scene.fog.density=0.000035;
      }catch(_){ }

      // Subtle moving wave bands around the camera. These are deliberately
      // blue/grey translucent highlights, not the old white grid lines.
      try{
        const waveMats=[];
        const waveCount=22;
        for(let i=0;i<waveCount;i++){
          const mat=new Cesium.ColorMaterialProperty(new Cesium.Color(.72,.88,.92,0));
          waveMats.push(mat);
          viewer.entities.add({
            position:new Cesium.CallbackProperty(function(){
              const carto=Cesium.Cartographic.fromCartesian(viewer.camera.positionWC);
              if(!carto)return Cesium.Cartesian3.ZERO;
              const sea=+(document.getElementById('sea')?.value||2);
              const t=performance.now()/1000;
              const band=i-waveCount/2;
              const phase=t*(1.4+sea*.12)+i*.74;
              const forward=band*13 + Math.sin(phase)*8;
              const side=Math.sin(i*1.91+t*.18)*95;
              const hd=viewer.camera.heading||0;
              const north=forward*Math.cos(hd)-side*Math.sin(hd);
              const east=forward*Math.sin(hd)+side*Math.cos(hd);
              const lat=carto.latitude*180/Math.PI+north/111320;
              const lon=carto.longitude*180/Math.PI+east/(111320*Math.cos(carto.latitude));
              return Cesium.Cartesian3.fromDegrees(lon,lat,.16+.025*Math.sin(phase));
            },false),
            ellipse:{
              semiMajorAxis:new Cesium.CallbackProperty(function(){const sea=+(document.getElementById('sea')?.value||2);return 18+sea*5+(i%4)*6;},false),
              semiMinorAxis:new Cesium.CallbackProperty(function(){const sea=+(document.getElementById('sea')?.value||2);return .55+sea*.22+(i%3)*.18;},false),
              height:.17,
              rotation:(i%5)*.13,
              material:mat
            }
          });
        }
        viewer.scene.preRender.addEventListener(function(){
          const sea=+(document.getElementById('sea')?.value||2);
          const base=sea===0?0:Math.min(.085,.015+sea*.012);
          waveMats.forEach((m,i)=>m.color.setValue(new Cesium.Color(.72,.88,.92,base*(.55+(i%4)*.12))));
        });
      }catch(_){ }
      return viewer;
    }
  });
}catch(_){ }
})();
