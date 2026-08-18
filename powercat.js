window.makePowerCatUrl=function(){
const P=[],N=[],I=[],parts=[];
function tri(a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1,nn=n.map(x=>x/l),s=P.length/3;[a,b,c].forEach(q=>{P.push(...q);N.push(...nn)});I.push(s,s+1,s+2)}
function mesh(name,v,f,mat){const i0=I.length,p0=P.length/3;f.forEach(q=>{for(let k=1;k<q.length-1;k++)tri(v[q[0]],v[q[k]],v[q[k+1]])});parts.push({name,p0,pc:P.length/3-p0,i0,ic:I.length-i0,mat})}
function box(name,x,y,z,l,w,h,mat){let a=x-l/2,b=x+l/2,c=y-w/2,d=y+w/2,e=z-h/2,g=z+h/2,v=[[a,c,e],[b,c,e],[b,d,e],[a,d,e],[a,c,g],[b,c,g],[b,d,g],[a,d,g]],f=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]];mesh(name,v,f,mat)}
function hull(name,y){const st=[[-6.4,.78,-.78,.40],[-3.8,.86,-.96,.58],[-.6,.84,-.98,.72],[2.9,.70,-.80,.80],[5.4,.43,-.48,.70],[6.95,.06,-.02,.46]],v=[],f=[];st.forEach(q=>{const[x,w,z0,z1]=q;v.push([x,y-w,z0],[x,y-w,z1],[x,y+w,z1],[x,y+w,z0])});f.push([0,3,2,1]);let z=(st.length-1)*4;f.push([z,z+1,z+2,z+3]);for(let j=0;j<st.length-1;j++){let a=j*4,b=a+4;f.push([a,b,b+1,a+1],[a+1,b+1,b+2,a+2],[a+2,b+2,b+3,a+3],[a+3,b+3,b,a])}mesh(name,v,f,0)}
// Twin planing hulls with a clearly connected bridge structure.
hull('PortHull',-2.05);hull('StarboardHull',2.05);
box('BridgeDeck',-.15,0,.72,11.8,5.55,.32,0);box('Foredeck',3.65,0,.92,3.1,5.25,.24,0);box('AftDeck',-4.7,0,.94,2.7,5.30,.24,4);box('SwimPlatform',-6.75,0,.66,1.35,5.75,.24,4);
// Cabin: wider lower body plus tapered upper body gives a complete yacht silhouette.
box('CabinLower',-.15,0,1.38,6.25,4.45,.92,1);
const cv=[[-3.0,-2.08,1.66],[-3.0,2.08,1.66],[2.85,-1.96,1.66],[2.85,1.96,1.66],[-2.45,-1.78,3.28],[-2.45,1.78,3.28],[1.90,-1.48,3.28],[1.90,1.48,3.28]];
mesh('CabinUpper',cv,[[0,2,3,1],[4,5,7,6],[0,4,6,2],[1,3,7,5],[0,1,5,4],[2,6,7,3]],1);
box('Hardtop',-.20,0,3.48,5.95,4.45,.22,0);box('RoofAft',-2.55,0,3.34,1.35,4.15,.16,0);
mesh('Windshield',[[2.88,-1.78,1.75],[2.88,1.78,1.75],[1.92,1.43,3.12],[1.92,-1.43,3.12]],[[0,1,2,3]],2);
mesh('PortWindows',[[-2.62,-2.10,1.78],[1.72,-1.98,1.78],[1.45,-1.54,3.08],[-2.18,-1.82,3.08]],[[0,1,2,3]],2);
mesh('StarboardWindows',[[-2.18,1.82,3.08],[1.45,1.54,3.08],[1.72,1.98,1.78],[-2.62,2.10,1.78]],[[0,1,2,3]],2);
mesh('RearWindow',[[-3.03,-1.72,1.80],[-3.03,-1.72,2.98],[-3.03,1.72,2.98],[-3.03,1.72,1.80]],[[0,1,2,3]],2);
// Cockpit furniture and bow details make the body read as one complete boat.
box('CockpitBench',-4.55,0,1.32,1.1,3.55,.65,4);box('BowSunpad',4.18,0,1.18,2.25,3.15,.16,4);box('BowStep',5.45,0,.94,.75,4.20,.18,0);
for(const y of[-1.78,1.78])for(const x of[-2.35,1.55])box('RoofSupport',x,y,2.54,.14,.14,1.68,3);
for(const y of[-1.58,1.58]){box('Outboard',-7.18,y,.93,.92,.78,1.12,3);box('OutboardLeg',-7.24,y,.08,.30,.30,.86,3);box('PropHub',-7.38,y,-.36,.30,.42,.22,3)}
for(const y of[-2.73,2.73]){box('RailTop',.10,y,1.98,10.35,.07,.07,5);for(const x of[-4.55,-2.55,-.55,1.45,3.45,4.85])box('RailPost',x,y,1.55,.07,.07,.92,5)}
box('Mast',-.40,0,4.13,.13,.13,1.28,5);box('Radar',-.05,0,4.73,1.75,.16,.12,0);
const specs=[[[.94,.965,.985,1],.03,.26],[[.84,.90,.94,1],.02,.30],[[.01,.055,.085,.90],.05,.10],[[.035,.045,.055,1],.46,.23],[[.66,.55,.39,1],0,.48],[[.77,.81,.83,1],.72,.17]];
const mats=specs.map((m,i)=>({pbrMetallicRoughness:{baseColorFactor:m[0],metallicFactor:m[1],roughnessFactor:m[2]},doubleSided:true,...(i===2?{alphaMode:'BLEND'}:{})}));
function b64(ab){let u=new Uint8Array(ab),s='',n=0x8000;for(let i=0;i<u.length;i+=n)s+=String.fromCharCode.apply(null,u.subarray(i,i+n));return btoa(s)}
const pa=new Float32Array(P),na=new Float32Array(N),ia=new Uint16Array(I),pbs=new Uint8Array(pa.buffer),nbs=new Uint8Array(na.buffer),ibs=new Uint8Array(ia.buffer),pad=x=>(4-x%4)%4,oN=pbs.length+pad(pbs.length),oI=oN+nbs.length+pad(nbs.length),buf=new Uint8Array(oI+ibs.length);buf.set(pbs,0);buf.set(nbs,oN);buf.set(ibs,oI);
const views=[{buffer:0,byteOffset:0,byteLength:pbs.length,target:34962},{buffer:0,byteOffset:oN,byteLength:nbs.length,target:34962},{buffer:0,byteOffset:oI,byteLength:ibs.length,target:34963}],acc=[],meshes=[];
parts.forEach(p=>{let vals=[];for(let i=0;i<p.pc;i++)vals.push([P[(p.p0+i)*3],P[(p.p0+i)*3+1],P[(p.p0+i)*3+2]]);let a=acc.length;acc.push({bufferView:0,byteOffset:p.p0*12,componentType:5126,count:p.pc,type:'VEC3',min:[0,1,2].map(k=>Math.min(...vals.map(v=>v[k]))),max:[0,1,2].map(k=>Math.max(...vals.map(v=>v[k])))},{bufferView:1,byteOffset:p.p0*12,componentType:5126,count:p.pc,type:'VEC3'},{bufferView:2,byteOffset:p.i0*2,componentType:5123,count:p.ic,type:'SCALAR'});meshes.push({name:p.name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,material:p.mat}]})});
const g={asset:{version:'2.0',generator:'Sail the World PowerCat v2'},scene:0,scenes:[{nodes:meshes.map((_,i)=>i)}],nodes:meshes.map((_,i)=>({mesh:i})),meshes,materials:mats,buffers:[{uri:'data:application/octet-stream;base64,'+b64(buf.buffer),byteLength:buf.byteLength}],bufferViews:views,accessors:acc};return URL.createObjectURL(new Blob([JSON.stringify(g)],{type:'model/gltf+json'}));
};