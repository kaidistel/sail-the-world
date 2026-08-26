window.initReal3DV20=function(Cesium,viewer,state,notify){
  const layers=[
    {
      id:'frankfurt-photo',
      name:'Frankfurt echtes Photogrammetrie-Mesh',
      lat:50.1109,lon:8.6821,radiusKm:35,
      url:'https://tiles.arcgis.com/tiles/cFEFS0EWrhfDeVw9/arcgis/rest/services/Buildings_Frankfurt_2021/SceneServer',
      credit:'Aerowest GmbH / Esri – echtes Luftbild-Photogrammetrie-Mesh'
    }
  ];
  const loaded=new Map(),loading=new Set();
  function km(a,b,c,d){const R=6371,p=Math.PI/180,x=(d-b)*p*Math.cos((a+c)*.5*p),y=(c-a)*p;return R*Math.hypot(x,y)}
  async function load(q){
    if(loaded.has(q.id)||loading.has(q.id))return;
    loading.add(q.id);
    try{
      const p=await Cesium.I3SDataProvider.fromUrl(q.url,{show:true});
      viewer.scene.primitives.add(p);
      loaded.set(q.id,p);
      notify&&notify('REAL 3D geladen: '+q.name);
      console.info('[REAL3D V20]',q.name,q.credit);
    }catch(e){console.warn('[REAL3D V20] Layer nicht geladen',q.name,e)}
    finally{loading.delete(q.id)}
  }
  function tick(){
    for(const q of layers){
      const d=km(state.lat,state.lon,q.lat,q.lon);
      if(d<q.radiusKm)load(q);
      const p=loaded.get(q.id);
      if(p)p.show=d<q.radiusKm*1.35;
    }
  }
  tick();
  const timer=setInterval(tick,2500);
  return{layers,loaded,update:tick,destroy(){clearInterval(timer)}};
};