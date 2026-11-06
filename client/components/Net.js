'use client';import {useEffect,useRef} from 'react';
export default function Net(){const r=useRef();
useEffect(()=>{const c=r.current,x=c.getContext('2d');let W,H,P=[],raf,f=0,m={x:-999,y:-999};
const col=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'#6366f1';let A=col('--a'),B=col('--b');
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const init=()=>{const d=devicePixelRatio||1;W=c.offsetWidth;H=c.offsetHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);P=Array.from({length:Math.min(75,W/15|0)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}))};init();
const mv=e=>{const b=c.getBoundingClientRect();m={x:e.clientX-b.left,y:e.clientY-b.top}};
const loop=()=>{if(f++%30==0){A=col('--a');B=col('--b')}x.clearRect(0,0,W,H);
for(const p of P){if(!rm){p.x+=p.vx;p.y+=p.vy;const dx=m.x-p.x,dy=m.y-p.y,d=Math.hypot(dx,dy);if(d<170&&d>1){p.x+=dx/d*.7;p.y+=dy/d*.7}}
if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;x.globalAlpha=.9;x.fillStyle=A;x.fillRect(p.x,p.y,2.4,2.4)}
x.lineWidth=1;for(let i=0;i<P.length;i++){for(let j=i+1;j<P.length;j++){const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);if(d<120){x.globalAlpha=.4*(1-d/120);x.strokeStyle=B;x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(P[j].x,P[j].y);x.stroke()}}
const d=Math.hypot(P[i].x-m.x,P[i].y-m.y);if(d<150){x.globalAlpha=.7*(1-d/150);x.strokeStyle=A;x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(m.x,m.y);x.stroke()}}
raf=requestAnimationFrame(loop)};loop();
addEventListener('pointermove',mv);addEventListener('resize',init);
return()=>{cancelAnimationFrame(raf);removeEventListener('pointermove',mv);removeEventListener('resize',init)}},[]);
return <canvas ref={r} className="net" aria-hidden="true"/>}
