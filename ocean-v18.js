window.createSailOceanV18=function(Cesium,viewer,state){
  const rings=54, segs=128, radius=1500;
  const pos=[], st=[], ring=[];
  // Center vertex
  pos.push(0,0,0); st.push(.5,.5); ring.push(0);
  for(let r=1;r<=rings;r++){
    // Dense near the vessel, progressively coarser in world space toward the edge.
    const q=r/rings;
    const rr=radius*Math.pow(q,1.72);
    for(let j=0;j<segs;j++){
      const a=j/segs*Math.PI*2;
      pos.push(Math.cos(a)*rr,Math.sin(a)*rr,0);
      st.push(.5+.5*Math.cos(a)*q,.5+.5*Math.sin(a)*q);
      ring.push(q);
    }
  }
  const idx=[];
  for(let j=0;j<segs;j++) idx.push(0,1+j,1+(j+1)%segs);
  for(let r=1;r<rings;r++){
    const a0=1+(r-1)*segs,b0=1+r*segs;
    for(let j=0;j<segs;j++){
      const n=(j+1)%segs;
      idx.push(a0+j,b0+j,b0+n,a0+j,b0+n,a0+n);
    }
  }
  const geometry=new Cesium.Geometry({
    attributes:{
      position:new Cesium.GeometryAttribute({componentDatatype:Cesium.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:new Float64Array(pos)}),
      st:new Cesium.GeometryAttribute({componentDatatype:Cesium.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:new Float32Array(st)}),
      a_ring:new Cesium.GeometryAttribute({componentDatatype:Cesium.ComponentDatatype.FLOAT,componentsPerAttribute:1,values:new Float32Array(ring)})
    },
    indices:Cesium.IndexDatatype.createTypedArray(pos.length/3,idx),
    primitiveType:Cesium.PrimitiveType.TRIANGLES,
    boundingSphere:new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO,radius+12)
  });

  const vs=`
    attribute vec3 position3DHigh;
    attribute vec3 position3DLow;
    attribute vec2 st;
    attribute float a_ring;
    varying vec2 v_st;
    varying float v_ring;
    varying float v_h;
    varying vec3 v_nEC;
    const float PI=3.141592653589793;
    void wave(in vec2 p,in vec2 dir,in float lambda,in float amp,in float steep,in float speed,in float t,inout float h,inout vec2 grad){
      float k=2.0*PI/lambda;
      float ph=k*dot(dir,p)-speed*t;
      float s=sin(ph), c=cos(ph);
      h += amp*s;
      grad += amp*k*c*dir;
    }
    void main(){
      vec4 p=czm_computePosition();
      vec2 xy=vec2(position3DHigh.x+position3DLow.x,position3DHigh.y+position3DLow.y);
      float t=czm_frameNumber/60.0;
      float h=0.0; vec2 g=vec2(0.0);
      // Long North Sea swell + two crossing systems + short wind chop.
      wave(xy,normalize(vec2(.42,.91)),74.0,.48,.65,.72,t,h,g);
      wave(xy,normalize(vec2(.91,.35)),43.0,.29,.58,1.02,t,h,g);
      wave(xy,normalize(vec2(-.28,.96)),27.0,.18,.52,1.31,t,h,g);
      wave(xy,normalize(vec2(.72,-.69)),13.0,.075,.34,1.88,t,h,g);
      wave(xy,normalize(vec2(-.83,-.55)),7.2,.035,.25,2.55,t,h,g);
      // Fade physical displacement very gently only at the last 12% of the disk.
      float edge=1.0-smoothstep(.88,1.0,a_ring);
      h*=edge; g*=edge;
      p.z += h;
      vec3 nMC=normalize(vec3(-g.x,-g.y,1.0));
      v_nEC=normalize(czm_normal*nMC);
      v_st=st; v_ring=a_ring; v_h=h;
      gl_Position=czm_modelViewProjectionRelativeToEye*p;
    }
  `;
  const fs=`
    varying vec2 v_st;
    varying float v_ring;
    varying float v_h;
    varying vec3 v_nEC;
    void main(){
      vec3 N=normalize(v_nEC);
      vec3 V=normalize(-czm_viewerPositionWC); // only used as a stable fresnel driver fallback
      vec3 L=normalize(czm_sunDirectionEC);
      float ndl=max(dot(N,L),0.0);
      float facing=clamp(abs(N.z),0.0,1.0);
      float fres=pow(1.0-facing,3.0);
      float spec=pow(max(dot(reflect(-L,N),vec3(0.0,0.0,1.0)),0.0),46.0);
      float crest=smoothstep(.32,.72,v_h)*.10;
      vec3 deep=vec3(.015,.105,.145);
      vec3 sky=vec3(.19,.43,.53);
      vec3 col=mix(deep,sky,.16+fres*.50+ndl*.08)+spec*.40+crest;
      // Radial fade prevents any visible edge or square/box artifact.
      float alpha=.56*(1.0-smoothstep(.70,1.0,v_ring));
      gl_FragColor=vec4(col,alpha);
    }
  `;
  const appearance=new Cesium.Appearance({
    translucent:true,
    closed:false,
    renderState:{
      depthTest:{enabled:true},
      depthMask:false,
      blending:Cesium.BlendingState.ALPHA_BLEND,
      cull:{enabled:false}
    },
    vertexShaderSource:vs,
    fragmentShaderSource:fs
  });
  appearance.getFragmentShaderSource=Cesium.Appearance.prototype.getFragmentShaderSource;
  appearance.isTranslucent=()=>true;
  appearance.getRenderState=Cesium.Appearance.prototype.getRenderState;

  const prim=new Cesium.Primitive({
    geometryInstances:new Cesium.GeometryInstance({geometry}),
    appearance,
    asynchronous:false,
    modelMatrix:Cesium.Matrix4.IDENTITY
  });
  viewer.scene.primitives.add(prim);

  function update(){
    // Center at actual sea level under the vessel; scale Z with selected sea state.
    const enu=Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(state.lon,state.lat,.05));
    const seaScale=.08+Math.max(0,state.sea||0)*.34;
    prim.modelMatrix=Cesium.Matrix4.multiplyByScale(enu,new Cesium.Cartesian3(1,1,seaScale),new Cesium.Matrix4());
  }
  update();
  return {primitive:prim,update};
};
