window.makePowerCatUrl=function(){
const P=[],N=[],I=[],parts=[];
function tri(a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1,nn=n.map(x=>x/l),s=P.length/3;[a,b,c].forEach(q=>{P.push(...q);N.push(...nn)});I.push(s,s+1,s+2)}
function mesh(name,v,f,mat){const i0=I.length,p0=P.length/3;f.forEach(q=>{for(let k=1;k<q.length-1;k++)tri(v[q[0]],v[q[k]],v[q[k+1]])});parts.push({name,p0,pc:P.length/3-p0,i0,ic:I.length-i0,mat})}
function box(name,x,y,z,l,w,h,mat){let a=x-l/2,b=x+l/2,c=y-w/2,d=y+w/2,e=z-h/2,g=z+h/2,v=[[a,c,e],[b,c,e],[b,d,e],[a,d,e],[a,c,g],[b,c,g],[b,d,g],[a,d,g]],f=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]];mesh(name,v,f,mat)}
function loft(name,sections,mat,y0=0){const v=[],f=[];sections.forEach(s=>{const[x,w,zb,zt]=s;v.push([x,y0-w,zb],[x,y0-w,zt],[x,y0+w,zt],[x,y0+w,zb])});f.push([0,3,2,1]);let z=(sections.length-1)*4;f.push([z,z+1,z+2,z+3]);for(let j=0;j<sections.length-1;j++){let a=j*4,b=a+4;f.push([a,b,b+1,a+1],[a+1,b+1,b+2,a+2],[a+2,b+2,b+3,a+3],[a+3,b+3,b,a])}mesh(name,v,f,mat)}
function sidePanel(name,side,pts,mat){const y=side;mesh(name,pts.map(p=>[p[0],y,p[1]]),[pts.map((_,i)=>i)],mat)}
// 0 white, 1 navy, 2 glass, 3 gold, 4 orange, 5 metal, 6 deck, 7 red
// Two genuine catamaran hulls. +X is bow, +Z is up.
const lower=[[-15.4,1.05,-1.38,.08],[-11.5,1.13,-1.48,.38],[-5.5,1.16,-1.45,.72],[2.0,1.08,-1.28,.94],[8.5,.82,-.88,.96],[12.6,.43,-.40,.70],[15.7,.025,-.02,.17]];
const upper=[[-13.9,1.10,.05,1.42],[-8.0,1.18,.20,1.70],[0,1.16,.32,1.88],[7.5,.95,.42,1.82],[12.0,.55,.32,1.42],[15.25,.045,.10,.43]];
for(const y of[-3.45,3.45]){loft('NavyHull',lower,1,y);loft('WhiteHullShoulder',upper,0,y)}
// Bridge deck ends before the bow tips, keeping a large visible tunnel between both noses.
loft('BridgeDeck',[[-13.5,4.35,1.48,2.05],[-7.0,4.35,1.55,2.18],[1.0,4.25,1.58,2.28],[7.8,3.55,1.52,2.20]],0);
box('AftWorkingDeck',-12.9,0,2.28,4.5,8.55,.28,6);box('SternPlatform',-15.1,0,1.35,1.4,8.3,.25,6);
// One continuous passenger superstructure instead of stacked boxes.
loft('PassengerBody',[[-10.9,3.65,2.15,4.25],[-7.0,3.78,2.20,4.55],[-1.0,3.72,2.25,4.78],[4.4,3.42,2.28,4.92],[8.0,2.72,2.24,4.42]],0);
// Long side glazing follows the shape of the saloon.
for(const s of[-1,1]){
  const y=s*3.76;sidePanel('SaloonWindowBand',y,[[-9.8,3.20],[-7.0,3.35],[-1.0,3.48],[4.2,3.52],[7.0,3.35],[6.6,4.30],[3.8,4.48],[-1.0,4.42],[-7.0,4.18],[-9.8,3.95]],2);
  sidePanel('GoldLivery',s*3.79,[[-10.6,2.42],[-4.4,2.52],[.4,2.58],[5.8,2.70],[7.2,3.10],[4.8,3.36],[.3,3.00],[-5.0,2.95],[-10.6,3.36]],3);
  sidePanel('NavyBelt',s*3.81,[[-11.4,2.15],[6.2,2.22],[7.0,2.50],[-11.4,2.47]],1);
}
// Sloped integrated bridge, lower and wider than before.
loft('BridgeHouse',[[-1.4,3.18,4.50,5.82],[2.0,3.02,4.56,6.12],[5.2,2.62,4.48,6.18],[7.25,2.15,4.18,5.65]],0);
mesh('BridgeFrontGlass',[[7.30,-2.08,4.55],[7.30,2.08,4.55],[5.30,2.42,6.02],[5.30,-2.42,6.02]],[[0,1,2,3]],2);
for(const s of[-1,1])sidePanel('BridgeSideGlass',s*3.04,[[-.8,4.92],[2.0,4.98],[5.0,4.87],[4.65,5.86],[2.0,5.95],[-.65,5.72]],2);
loft('BridgeRoof',[[-1.6,3.25,6.02,6.25],[2.0,3.15,6.18,6.42],[5.35,2.72,6.12,6.36]],0);
// Upper deck is now connected directly to bridge roof, not floating above it.
loft('UpperDeckBase',[[-8.7,3.25,6.18,6.40],[-3.0,3.30,6.22,6.43],[2.0,3.12,6.28,6.48],[4.8,2.70,6.25,6.44]],6);
loft('UpperWheelhouse',[[-.8,2.32,6.42,7.65],[2.0,2.25,6.46,7.85],[4.65,1.86,6.40,7.56]],0);
mesh('UpperFrontGlass',[[4.70,-1.80,6.65],[4.70,1.80,6.65],[2.90,2.06,7.68],[2.90,-2.06,7.68]],[[0,1,2,3]],2);
for(const s of[-1,1])sidePanel('UpperSideGlass',s*2.30,[[-.45,6.72],[2.0,6.78],[3.85,6.70],[3.35,7.55],[1.8,7.67],[-.3,7.45]],2);
loft('UpperHardtop',[[-1.1,2.60,7.68,7.88],[2.0,2.55,7.82,8.04],[4.0,2.18,7.68,7.88]],1);
// Open aft passenger deck with compact furniture instead of huge wall-like blocks.
for(const y of[-2.35,0,2.35]){box('Seat',-5.7,y,6.72,2.2,.48,.32,1);box('SeatBack',-6.25,y,7.00,.12,.54,.62,0)}
for(const y of[-3.16,3.16]){box('UpperRail',-6.0,y,7.02,5.2,.055,.055,5);for(const x of[-8.2,-6.8,-5.4,-4.0])box('UpperPost',x,y,6.73,.055,.055,.62,5)}
// Rescue craft, exhausts and roof equipment.
for(const y of[-4.10,4.10]){loft('RescueBoat',[[-9.5,.62,4.92,5.42],[-7.2,.72,4.90,5.55],[-5.6,.12,5.00,5.30]],4,y);box('Davits',-7.5,y*.88,4.70,4.5,.15,.15,5)}
for(const y of[-1.35,1.35]){box('Exhaust',-2.6,y,8.28,.62,.54,.82,1);box('Radome',-.8,y,8.45,.78,.78,.62,0)}
box('MainMast',.4,0,10.15,.17,.17,4.25,5);box('Radar',.4,0,11.52,3.5,.18,.15,0);box('CrossTree',.4,0,10.55,.22,3.8,.12,5);for(const y of[-1.5,1.5])box('Antenna',.4,y,11.25,.06,.06,2.0,5);box('SignalRed',-.1,0,9.25,.28,.28,.42,7);
// Rails around main aft deck and separate bow rails emphasize the twin-bow layout.
for(const y of[-4.20,4.20]){box('AftRail',-11.8,y,3.18,6.2,.055,.055,5);for(const x of[-14,-12.5,-11,-9.5])box('AftPost',x,y,2.84,.055,.055,.74,5)}
for(const y of[-4.38,-2.52,2.52,4.38]){box('SplitBowRail',11.0,y,2.12,7.0,.05,.05,5);for(const x of[8.2,10,11.8,13.5])box('BowPost',x,y,1.85,.05,.05,.56,5)}
const specs=[[[.97,.975,.965,1],.02,.30],[[.006,.015,.040,1],.08,.25],[[.006,.065,.125,1],.06,.14],[[1.0,.45,.015,1],.02,.30],[[1.0,.08,.01,1],.01,.32],[[.70,.73,.74,1],.58,.21],[[.27,.29,.30,1],.02,.54],[[.90,.01,.01,1],.01,.30]];
const mats=specs.map(m=>({pbrMetallicRoughness:{baseColorFactor:m[0],metallicFactor:m[1],roughnessFactor:m[2]},doubleSided:true}));
function b64(ab){let u=new Uint8Array(ab),s='',n=0x8000;for(let i=0;i<u.length;i+=n)s+=String.fromCharCode.apply(null,u.subarray(i,i+n));return btoa(s)}
const pa=new Float32Array(P),na=new Float32Array(N),ia=new Uint16Array(I),pbs=new Uint8Array(pa.buffer),nbs=new Uint8Array(na.buffer),ibs=new Uint8Array(ia.buffer),pad=x=>(4-x%4)%4,oN=pbs.length+pad(pbs.length),oI=oN+nbs.length+pad(nbs.length),buf=new Uint8Array(oI+ibs.length);buf.set(pbs,0);buf.set(nbs,oN);buf.set(ibs,oI);const views=[{buffer:0,byteOffset:0,byteLength:pbs.length,target:34962},{buffer:0,byteOffset:oN,byteLength:nbs.length,target:34962},{buffer:0,byteOffset:oI,byteLength:ibs.length,target:34963}],acc=[],meshes=[];
parts.forEach(p=>{let vals=[];for(let i=0;i<p.pc;i++)vals.push([P[(p.p0+i)*3],P[(p.p0+i)*3+1],P[(p.p0+i)*3+2]]);let a=acc.length;acc.push({bufferView:0,byteOffset:p.p0*12,componentType:5126,count:p.pc,type:'VEC3',min:[0,1,2].map(k=>Math.min(...vals.map(v=>v[k]))),max:[0,1,2].map(k=>Math.max(...vals.map(v=>v[k])))},{bufferView:1,byteOffset:p.p0*12,componentType:5126,count:p.pc,type:'VEC3'},{bufferView:2,byteOffset:p.i0*2,componentType:5123,count:p.ic,type:'SCALAR'});meshes.push({name:p.name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,material:p.mat}]})});
const g={asset:{version:'2.0',generator:'Sail the World Adler Cat HSC v5 lofted'},scene:0,scenes:[{nodes:meshes.map((_,i)=>i)}],nodes:meshes.map((_,i)=>({mesh:i})),meshes,materials:mats,buffers:[{uri:'data:application/octet-stream;base64,'+b64(buf.buffer),byteLength:buf.byteLength}],bufferViews:views,accessors:acc};return URL.createObjectURL(new Blob([JSON.stringify(g)],{type:'model/gltf+json'}));
};