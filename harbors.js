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

// The custom boat asset is upright now but its visual bow axis is 90° off
// from the simulator's navigation heading. Apply only a horizontal heading
// correction; roll/pitch and the model's Z-up orientation remain untouched.
if(window.Cesium && Cesium.Transforms && !window.__SAIL_BOAT_HEADING_PATCH){
  window.__SAIL_BOAT_HEADING_PATCH=true;
  const originalHprToFixed=Cesium.Transforms.headingPitchRollToFixedFrame;
  Cesium.Transforms.headingPitchRollToFixedFrame=function(origin,hpr,ellipsoid,fixedFrameTransform,result){
    if(hpr){
      hpr=new Cesium.HeadingPitchRoll(hpr.heading+Cesium.Math.PI_OVER_TWO,hpr.pitch,hpr.roll);
    }
    return originalHprToFixed.call(this,origin,hpr,ellipsoid,fixedFrameTransform,result);
  };
}
