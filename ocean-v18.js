window.createSailOceanV18=function(Cesium,viewer,state){
  const rings=54,segs=128,radius=1500;
  const pos=[],st=[],ring=[],local=[];
  const origin=Cesium.Cartesian3.fromDegrees(state.lon,state.lat,.05);
  const initialENU=Cesium.Transforms.eastNorthUpToFixedFrame(origin);
  const inverseInitial=Cesium.Matrix4.inverseTransformation(initialENU,new Cesium.Matrix4());
  function addLocal(x,y,q,u,v){const world=Cesium.Matrix4.multiplyByPoint(initialENU,new Cesium.Cartesian3(x,y,0),new Cesium.Cartesian3());pos.push(world.x,world.y,world.z);st.push(u,v);ring.push(q);local.push(x,y)}
  addLocal(0,0,0,.5,.5);
  for(let r=1;r<=rings;r++){const q=r/rings,rr=radius*Math.pow(q,1.72);for(let j=0;j<segs;j++){const a=j/segs*Math.PI*2,x=Math.cos(a)*rr,y=Math.sin(a)*rr;addLocal(x,y,q,.5+.5*Math.cos(a)*q,.5+.5*Math.sin(a)*q)}}
  const idx=[];for(let j=0;j<segs;j++)idx.push(0,1+j,1+(j+1)%segs);for(let r=1;r<rings;r++){const a0=1+(r-1)*segs,b0=1+r*segs;for(let j=0;j<segs;j++){const n=(j+1)%segs;idx.push(a0+j,b0+j,b0+n,a0+j,b0+n,a0+n)}}
  const geometry=new Cesium.Geometry({attributes:{position:new Cesium.GeometryAttribute({componentDatatype:Cesium.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:new Float64Array(pos)}),st:new Cesium.GeometryAttribute({componentDatatype:Cesium.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:new Float32Array(st)}),a_ring:new Cesium.GeometryAttribute({componentDatatype:Cesium.ComponentDatatype.FLOAT,componentsPerAttribute:1,values:new Float32Array(ring)}),a_local:new Cesium.GeometryAttribute({componentDatatype:Cesium.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:new Float32Array(local)})},indices:Cesium.IndexDatatype.createTypedArray(pos.length/3,idx),primitiveType:Cesium.PrimitiveType.TRIANGLES,boundingSphere:new Cesium.BoundingSphere(origin,radius+20)});
  const vs=`
    in vec3 position3DHigh;
    in vec3 position3DLow;
    in vec2 st;
    in float a_ring;
    in vec2 a_local;
    out vec2 v_st;
    out float v_ring;
    out float v_h;
    out vec3 v_nEC;
    const float PI=3.141592653589793;
    void wave(in vec2 p,in vec2 dir,in float lambda,in float amp,in float speed,in float t,inout float h,inout vec2 grad){float k=2.0*PI/lambda;float ph=k*dot(dir,p)-speed*t;float ss=sin(ph),cc=cos(ph);h+=amp*ss;grad+=amp*k*cc*dir;}
    void main(){vec4 p=czm_computePosition();vec2 xy=a_local;float t=czm_frameNumber/60.0;float h=0.0;vec2 g=vec2(0.0);wave(xy,normalize(vec2(.42,.91)),74.0,.48,.72,t,h,g);wave(xy,normalize(vec2(.91,.35)),43.0,.29,1.02,t,h,g);wave(xy,normalize(vec2(-.28,.96)),27.0,.18,1.31,t,h,g);wave(xy,normalize(vec2(.72,-.69)),13.0,.075,1.88,t,h,g);wave(xy,normalize(vec2(-.83,-.55)),7.2,.035,2.55,t,h,g);float edge=1.0-smoothstep(.86,1.0,a_ring);h*=edge;g*=edge;p.z+=h;vec3 nMC=normalize(vec3(-g.x,-g.y,1.0));v_nEC=normalize(czm_normal*nMC);v_st=st;v_ring=a_ring;v_h=h;gl_Position=czm_modelViewProjectionRelativeToEye*p;}
  `;
  const fs=`
    in vec2 v_st;
    in float v_ring;
    in float v_h;
    in vec3 v_nEC;
    void main(){vec3 N=normalize(v_nEC);vec3 L=normalize(czm_sunDirectionEC);float ndl=max(dot(N,L),0.0);float slope=1.0-clamp(abs(N.z),0.0,1.0);float fres=pow(slope,2.4);float spec=pow(max(dot(reflect(-L,N),vec3(0.0,0.0,1.0)),0.0),38.0);float crest=smoothstep(.28,.70,v_h)*.12;vec3 deep=vec3(.010,.085,.125);vec3 sky=vec3(.17,.40,.52);vec3 col=mix(deep,sky,.14+fres*.58+ndl*.07)+spec*.46+crest;float alpha=.60*(1.0-smoothstep(.68,1.0,v_ring));out_FragColor=vec4(col,alpha);}
  `;
  const appearance=new Cesium.Appearance({translucent:true,closed:false,renderState:{depthTest:{enabled:true},depthMask:false,blending:Cesium.BlendingState.ALPHA_BLEND,cull:{enabled:false}},vertexShaderSource:vs,fragmentShaderSource:fs});
  appearance.getFragmentShaderSource=Cesium.Appearance.prototype.getFragmentShaderSource;appearance.isTranslucent=()=>true;appearance.getRenderState=Cesium.Appearance.prototype.getRenderState;
  const prim=new Cesium.Primitive({geometryInstances:new Cesium.GeometryInstance({geometry}),appearance,asynchronous:false,allowPicking:false,modelMatrix:Cesium.Matrix4.IDENTITY});viewer.scene.primitives.add(prim);
  function update(){const currentENU=Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(state.lon,state.lat,.05));const move=Cesium.Matrix4.multiply(currentENU,inverseInitial,new Cesium.Matrix4());const seaScale=.10+Math.max(0,state.sea||0)*.34;const scaleLocal=Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1,1,seaScale),new Cesium.Matrix4());prim.modelMatrix=Cesium.Matrix4.multiply(move,scaleLocal,new Cesium.Matrix4())}
  update();return{primitive:prim,update};
};