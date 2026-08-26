(()=>{
  const layers=[{
    id:'frankfurt-photo',name:'Frankfurt echtes Photogrammetrie-Mesh',lat:50.1109,lon:8.6821,radiusKm:35,
    url:'https://tiles.arcgis.com/tiles/cFEFS0EWrhfDeVw9/arcgis/rest/services/Buildings_Frankfurt_2021/SceneServer',
    credit:'Aerowest GmbH / Esri – Luftbild-Photogrammetrie'
  }];
  const loaded=new Map(),loading=new Set();
  function km(a,b,c,d){const R=6371,p=Math.PI/180,x=(d-b)*p*Math.cos((a+c)*.5*p),y=(c-a)*p;return R*Math.hypot(x,y)}
  async function load(Cesium,viewer,q){if(loaded.has(q.id)||loading.has(q.id))return;loading.add(q.id);try{const p=await Cesium.I3SDataProvider.fromUrl(q.url,{show:true});viewer.scene.primitives.add(p);loaded.set(q.id,p);console.info('[REAL3D V20] geladen',q.name,q.credit)}catch(e){console.warn('[REAL3D V20]',q.name,e)}finally{loading.delete(q.id)}}
  function attach(Cesium,viewer){if(viewer.__real3dv20)return;viewer.__real3dv20=true;setInterval(()=>{try{const c=viewer.camera.positionCartographic;if(!c)return;const lat=Cesium.Math.toDegrees(c.latitude),lon=Cesium.Math.toDegrees(c.longitude);for(const q of layers){const d=km(lat,lon,q.lat,q.lon);if(d<q.radiusKm)load(Cesium,viewer,q);const p=loaded.get(q.id);if(p)p.show=d<q.radiusKm*1.35}}catch(e){}},2500)}
  function hook(){if(!window.Cesium||!Cesium.Viewer)return setTimeout(hook,50);if(Cesium.Viewer.__real3dHook)return;const Original=Cesium.Viewer;const Wrapped=new Proxy(Original,{construct(target,args,newTarget){const v=Reflect.construct(target,args,newTarget);setTimeout(()=>attach(Cesium,v),0);return v}});Wrapped.__real3dHook=true;Cesium.Viewer=Wrapped;console.info('[REAL3D V20] Reality loader ready')}
  hook();
})();