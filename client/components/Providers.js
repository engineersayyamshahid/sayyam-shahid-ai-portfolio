'use client';import {createContext,useContext,useEffect,useState} from 'react';import {D} from '@/lib/dict';
const Ctx=createContext({t:k=>k});export const useApp=()=>useContext(Ctx);
export function Providers({children}){const [lang,setL]=useState('en'),[theme,setT]=useState('dark');
useEffect(()=>{setL(localStorage.getItem('lg')||'en');setT(document.documentElement.dataset.theme||'dark')},[]);
const setLang=l=>{setL(l);localStorage.setItem('lg',l);const h=document.documentElement;h.lang=l;h.dir=l=='ar'||l=='ur'?'rtl':'ltr'};
const toggle=()=>{const n=theme=='dark'?'light':'dark';setT(n);localStorage.setItem('th',n);document.documentElement.dataset.theme=n};
const t=k=>(D[lang]&&D[lang][k])||D.en[k]||k;
return <Ctx.Provider value={{lang,setLang,theme,toggle,t}}>{children}</Ctx.Provider>}
export const T=({k})=>useApp().t(k);
