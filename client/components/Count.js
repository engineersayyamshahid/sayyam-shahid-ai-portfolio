'use client';import {useEffect,useRef,useState} from 'react';
export default function Count({to}){const r=useRef(),[v,setV]=useState(0);
useEffect(()=>{const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;io.disconnect();const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/1400);setV(Math.round(to*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)});io.observe(r.current);return()=>io.disconnect()},[to]);
return <span ref={r}>{v}</span>}
