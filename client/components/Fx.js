'use client';import {useEffect} from 'react';import {usePathname} from 'next/navigation';
export default function Fx(){const p=usePathname();
useEffect(()=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.rv:not(.in)').forEach(el=>io.observe(el));return()=>io.disconnect()},[p]);
useEffect(()=>{const bar=document.getElementById('prog');
const sc=()=>{const h=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${h>0?scrollY/h:0})`};
const mm=e=>{const t=e.target,c=t.closest&&t.closest('.card');if(c){const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}
const im=document.querySelector('.ph img');if(!im)return;const ph=t.closest&&t.closest('.ph');
if(ph){const r=ph.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;im.style.transform=`perspective(700px) rotateY(${x*14}deg) rotateX(${-y*14}deg) scale(1.02)`}else im.style.transform=''};
sc();addEventListener('scroll',sc,{passive:true});addEventListener('pointermove',mm);
return()=>{removeEventListener('scroll',sc);removeEventListener('pointermove',mm)}},[]);
return <div id="prog" aria-hidden="true"/>}
