window.makePowerCatUrl=function(){
const P=[],N=[],I=[],parts=[];
function tri(a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1,nn=n.map(x=>x/l),s=P.length/3;[a,b,c].forEach(q=>{P.push(...q);N.push(...nn)});I.push(s,s+1,s+2)}
function mesh(name,v,f,mat){const i0=I.length,p0=P.length/3;f.forEach(q=>{for(let k=1;k<q.length-1;k++)tri(v[q[0]],v[q[k]],v[q[k+1]])});parts.push({name,p0,pc:P.length/3-p0,i0,ic:I.length-i0,mat})}
function box(name,x,y,z,l,w,h,mat){let a=x-l/2,b=x+l/2,c=y-w/2,d=y+w/2,e=z-h/2,g=z+h/2,v=[[a,c,e],[b,c,e],[b,d,e],[a,d,e],[a,c,g],[b,c,g],[b,d,g],[a,d,g]],f=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]];mesh(name,v,f,mat)}
function hull(name,y){const st=[[-15.0,1.00,-1.25,.15],[-11.0,1.08,-1.35,.55],[-5.0,1.12,-1.38,.82],[2.0,1.05,-1.20,1.02],[8.0,.82,-.88,1.10],[12.0,.48,-.46,.92],[15.2,.055,-.02,.38]],v=[],f=[];st.forEach(q=>{const[x,w,z0,z1]=q;v.push([x,y-w,z0],[x,y-w,z1],[x,y+w,z1],[x,y+w,z0])});f.push([0,3,2,1]);let z=(st.length-1)*4;f.push([z,z+1,z+2,z+3]);for(let j=0;j<st.length-1;j++){let a=j*4,b=a+4;f.push([a,b,b+1,a+1],[a+1,b+1,b+2,a+2],[a+2,b+2,b+3,a+3],[a+3,b+3,b,a])}mesh(name,v,f,1)}
// Adler-Cat inspired HSC: two independent 30m hulls and an open tunnel between the bows.
hull('PortHull',-3.35);hull('StarboardHull',3.35);
box('PortWhiteShoulder',-.8,-3.35,1.25,24.5,2.25,1.05,0);box('StarboardWhiteShoulder',-.8,3.35,1.25,24.5,2.25,1.05,0);
box('CrossDeck',-2.0,0,1.85,22.0,8.45,.55,0);box('AftDeck',-12.2,0,2.02,4.2,8.55,.42,6);box('SternPlatform',-15.0,0,1.15,1.6,8.2,.32,6);
// Main passenger body. Forward end stops behind the two noses so both bows remain visible.
box('MainSaloon',-2.2,0,3.25,19.2,7.15,2.25,0);box('SaloonRoof',-2.6,0,4.72,19.0,7.45,.34,0);
// Strong dark window ribbon and gold Adler-style livery on BOTH sides.
for(const y of[-3.64,3.64]){box('NavyWindowBand',-1.6,y,3.72,17.2,.16,1.15,2);box('GoldAftPanel',-7.5,y,2.72,7.2,.20,1.35,3);box('GoldForwardSlash',5.5,y,2.80,5.8,.20,.65,3);box('NavyLowerStripe',-1.0,y,2.22,18.5,.18,.30,1)}
// Sloped bridge front and large dark glazing.
const br=[[-1.2,-3.05,4.82],[-1.2,3.05,4.82],[7.2,-2.55,4.82],[7.2,2.55,4.82],[-.4,-2.72,6.55],[-.4,2.72,6.55],[5.5,-2.05,6.55],[5.5,2.05,6.55]];mesh('BridgeHouse',br,[[0,2,3,1],[4,5,7,6],[0,4,6,2],[1,3,7,5],[0,1,5,4],[2,6,7,3]],0);
mesh('FrontGlass',[[7.24,-2.48,4.95],[7.24,2.48,4.95],[5.55,1.98,6.40],[5.55,-1.98,6.40]],[[0,1,2,3]],2);
for(const y of[-2.78,2.78])box('BridgeSideGlass',2.2,y,5.72,5.7,.13,1.08,2);box('BridgeRoof',2.0,0,6.78,8.7,5.85,.30,0);
// Full upper deck: open passenger area, raised wheelhouse, benches, windbreaks.
box('UpperDeckFloor',-3.0,0,7.03,14.7,6.8,.22,6);box('UpperWheelhouse',2.0,0,7.75,5.5,4.55,1.25,0);box('UpperFrontGlass',4.62,0,7.90,.18,4.15,.72,2);for(const y of[-2.32,2.32])box('UpperSideGlass',1.8,y,7.92,4.6,.12,.72,2);box('UpperHardtop',1.7,0,8.55,6.4,5.0,.25,1);
for(const y of[-2.45,0,2.45]){box('PassengerBenchA',-5.0,y,7.38,2.8,.58,.48,1);box('PassengerBenchBack',-5.75,y,7.75,.18,.64,.82,0)}
for(const y of[-3.10,3.10]){box('UpperWindbreak',-4.0,y,7.65,6.0,.10,.95,2);box('UpperRail',-7.1,y,7.72,7.5,.07,.07,5);for(const x of[-9.8,-8.2,-6.6,-5.0,-3.4])box('UpperRailPost',x,y,7.34,.07,.07,.82,5)}
// Rescue craft and aft equipment.
for(const y of[-4.05,4.05]){box('RescueBoat',-7.6,y,5.38,4.0,1.05,.72,4);box('RescueCradle',-7.6,y*.88,4.92,4.2,.20,.18,5);box('LifeRaft',-11.2,y*.78,4.35,1.25,.72,.62,4)}
// Mast / radar / antenna farm.
box('MainMast',.2,0,10.8,.20,.20,4.6,5);box('RadarBar',.2,0,12.45,3.8,.20,.18,0);box('CrossTree',.2,0,11.35,.25,4.1,.14,5);for(const y of[-1.45,1.45]){box('Radome',-.7,y,9.65,.82,.82,.68,0);box('Antenna',.2,y,12.05,.07,.07,2.2,5)}
for(const x of[-2.0,-3.2])for(const y of[-1.25,1.25])box('RoofVent',x,y,9.0,.65,.52,.95,1);box('SignalRed',-.1,0,10.25,.35,.35,.50,7);
// Main deck rails, separated at the bows.
for(const y of[-4.18,4.18]){box('AftRail',-11.2,y,3.32,7.0,.07,.07,5);for(const x of[-14,-12.5,-11,-9.5,-8])box('AftRailPost',x,y,2.92,.07,.07,.88,5)}
for(const y of[-4.28,-2.42,2.42,4.28]){box('BowRail',10.1,y,2.02,8.0,.06,.06,5);for(const x of[7,9,11,13])box('BowRailPost',x,y,1.72,.06,.06,.62,5)}
// Materials deliberately saturated enough to survive Cesium lighting and distance.
const specs=[[[.98,.98,.96,1],.02,.28],[[.008,.018,.045,1],.10,.24],[[.005,.055,.11,1],.08,.12],[[1.0,.42,.0,1],.02,.30],[[1.0,.07,.0,1],.01,.30],[[.68,.72,.74,1],.60,.20],[[.24,.27,.29,1],.02,.55],[[.86,.01,.01,1],.01,.30]];
const mats=specs.map(m=>({pbrMetallicRoughness:{baseColorFactor:m[0],metallicFactor:m[1],roughnessFactor:m[2]},doubleSided:true}));
function b64(ab){let u=new Uint8Array(ab),s='',n=0x8000;for(let i=0;i<u.length;i+=n)s+=String.fromCharCode.apply(null,u.subarray(i,i+n));return btoa(s)}
const pa=new Float32Array(P),na=new Float32Array(N),ia=new Uint16Array(I),pbs=new Uint8Array(pa.buffer),nbs=new Uint8Array(na.buffer),ibs=new Uint8Array(ia.buffer),pad=x=>(4-x%4)%4,oN=pbs.length+pad(pbs.length),oI=oN+nbs.length+pad(nbs.length),buf=new Uint8Array(oI+ibs.length);buf.set(pbs,0);buf.set(nbs,oN);buf.set(ibs,oI);const views=[{buffer:0,byteOffset:0,byteLength:pbs.length,target:34962},{buffer:0,byteOffset:oN,byteLength:nbs.length,target:34962},{buffer:0,byteOffset:oI,byteLength:ibs.length,target:34963}],acc=[],meshes=[];
parts.forEach(p=>{let vals=[];for(let i=0;i<p.pc;i++)vals.push([P[(p.p0+i)*3],P[(p.p0+i)*3+1],P[(p.p0+i)*3+2]]);let a=acc.length;acc.push({bufferView:0,byteOffset:p.p0*12,componentType:5126,count:p.pc,type:'VEC3',min:[0,1,2].map(k=>Math.min(...vals.map(v=>v[k]))),max:[0,1,2].map(k=>Math.max(...vals.map(v=>v[k])))},{bufferView:1,byteOffset:p.p0*12,componentType:5126,count:p.pc,type:'VEC3'},{bufferView:2,byteOffset:p.i0*2,componentType:5123,count:p.ic,type:'SCALAR'});meshes.push({name:p.name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,material:p.mat}]})});
const g={asset:{version:'2.0',generator:'Sail the World Adler Cat HSC v4'},scene:0,scenes:[{nodes:meshes.map((_,i)=>i)}],nodes:meshes.map((_,i)=>({mesh:i})),meshes,materials:mats,buffers:[{uri:'data:application/octet-stream;base64,'+b64(buf.buffer),byteLength:buf.byteLength}],bufferViews:views,accessors:acc};return URL.createObjectURL(new Blob([JSON.stringify(g)],{type:'model/gltf+json'}));
};