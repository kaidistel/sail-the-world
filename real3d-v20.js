(()=>{
  const layers=[{id:'frankfurt-photo',name:'Frankfurt echtes Photogrammetrie-Mesh',lat:50.1109,lon:8.6821,radiusKm:35,url:'https://tiles.arcgis.com/tiles/cFEFS0EWrhfDeVw9/arcgis/rest/services/Buildings_Frankfurt_2021/SceneServer',credit:'Aerowest GmbH / Esri – Luftbild-Photogrammetrie'}];
  const loaded=new Map(),loading=new Set();
  function km(a,b,c,d){const R=6371,p=Math.PI/180,x=(d-b)*p*Math.cos((a+c)*.5*p),y=(c-a)*p;return R*Math.hypot(x,y)}
  async function load(Cesium,viewer,q){if(loaded.has(q.id)||loading.has(q.id))return;loading.add(q.id);try{const p=await Cesium.I3SDataProvider.fromUrl(q.url,{show:true});viewer.scene.primitives.add(p);loaded.set(q.id,p)}catch(e){console.warn('[REAL3D V20]',q.name,e)}finally{loading.delete(q.id)}}
  function addLandmarks(Cesium,v){if(v.__coastLandmarks)return;v.__coastLandmarks=true;const E=v.entities;
    const box=(name,lat,lon,h,w,l,color,heading=0)=>E.add({name,position:Cesium.Cartesian3.fromDegrees(lon,lat,h/2),orientation:Cesium.Transforms.headingPitchRollQuaternion(Cesium.Cartesian3.fromDegrees(lon,lat),new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading),0,0)),box:{dimensions:new Cesium.Cartesian3(l,w,h),material:color,shadows:Cesium.ShadowMode.ENABLED}});
    const cyl=(name,lat,lon,h,r,color)=>E.add({name,position:Cesium.Cartesian3.fromDegrees(lon,lat,h/2),cylinder:{length:h,topRadius:r*.78,bottomRadius:r,material:color,shadows:Cesium.ShadowMode.ENABLED}});
    // Helgoland: landmark-scale reconstructions at real-world locations.
    cyl('Helgoland Leuchtturm',54.18110,7.88574,35,4.8,Cesium.Color.fromCssColorString('#b51d23'));box('Leuchtturm Laternenhaus',54.18110,7.88574,38,7,7,Cesium.Color.fromCssColorString('#20252a'));
    box('Helgoland Hummerbuden West',54.17755,7.88905,5,65,8,Cesium.Color.fromCssColorString('#c7483d'),4);box('Helgoland Hummerbuden Ost',54.17776,7.88955,5,58,8,Cesium.Color.fromCssColorString('#2c7b83'),4);
    box('Helgoland Binnenhafen Terminal',54.17872,7.89033,7,34,15,Cesium.Color.fromCssColorString('#d9d7cf'),2);box('Helgoland Südhafen Halle',54.17374,7.89416,9,55,22,Cesium.Color.fromCssColorString('#c9cdd0'),8);
    cyl('Helgoland Richtfeuer',54.17452,7.89552,15,2.2,Cesium.Color.WHITE);
    // Cuxhaven Alte Liebe / Kugelbake area.
    box('Cuxhaven Alte Liebe',53.87142,8.70885,6,46,12,Cesium.Color.fromCssColorString('#8b4b32'),100);cyl('Cuxhaven Hafenfeuer',53.87187,8.70963,12,1.7,Cesium.Color.fromCssColorString('#d63a32'));
    cyl('Kugelbake Cuxhaven',53.89130,8.68664,29,1.2,Cesium.Color.fromCssColorString('#272727'));
    // Wilhelmshaven maritime landmarks.
    cyl('Wilhelmshaven Mole Leuchtfeuer',53.51323,8.15494,14,1.8,Cesium.Color.fromCssColorString('#d52c2c'));box('Wilhelmshaven Hafenhalle',53.51415,8.14990,10,58,24,Cesium.Color.fromCssColorString('#b7bdc1'),20);
    console.info('[V20 COAST 3D] Küsten-Landmarks geladen');
  }
  function attach(Cesium,viewer){if(viewer.__real3dv20)return;viewer.__real3dv20=true;addLandmarks(Cesium,viewer);setInterval(()=>{try{const c=viewer.camera.positionCartographic;if(!c)return;const lat=Cesium.Math.toDegrees(c.latitude),lon=Cesium.Math.toDegrees(c.longitude);for(const q of layers){const d=km(lat,lon,q.lat,q.lon);if(d<q.radiusKm)load(Cesium,viewer,q);const p=loaded.get(q.id);if(p)p.show=d<q.radiusKm*1.35}}catch(e){}},2500)}
  function hook(){if(!window.Cesium||!Cesium.Viewer)return setTimeout(hook,50);if(Cesium.Viewer.__real3dHook)return;const Original=Cesium.Viewer;const Wrapped=new Proxy(Original,{construct(target,args,newTarget){const v=Reflect.construct(target,args,newTarget);setTimeout(()=>attach(Cesium,v),0);return v}});Wrapped.__real3dHook=true;Cesium.Viewer=Wrapped;console.info('[REAL3D V20] Reality + Coast 3D loader ready')}
  hook();
})();