'use client';import {useEffect,useState} from 'react';
const W=['Full Stack Developer','AI Engineer','RAG & Chatbot Builder','Automation Architect','SaaS Founder'];
export default function Typer(){const [i,setI]=useState(0),[n,setN]=useState(0),[d,setD]=useState(false);
useEffect(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches){setN(W[0].length);return}
const w=W[i];const t=setTimeout(()=>{if(!d&&n<w.length)setN(n+1);else if(!d)setD(true);else if(n>0)setN(n-1);else{setD(false);setI((i+1)%W.length)}},!d&&n==w.length?1500:d?35:75);return()=>clearTimeout(t)},[i,n,d]);
return <p className="typer" aria-hidden="true"><span>{W[i].slice(0,n)}</span><i className="cur"/></p>}
