'use client';import {useState,useRef,useEffect} from 'react';import {useApp} from './Providers';import {FB} from '@/lib/data';import {CFG as C} from '@/lib/site';
export default function Chat(){const {t}=useApp();const [o,setO]=useState(false),[m,setM]=useState([]),[v,setV]=useState(''),r=useRef();
useEffect(()=>{r.current&&(r.current.scrollTop=1e5)},[m]);
const A={skills:()=>FB.skill.map(s=>s.title+': '+s.tags.join(', ')).join('\n'),projects:()=>FB.project.map(p=>p.title).join(', '),certs:()=>FB.certificate.length+' certificates (IBM, Google, Microsoft, DeepLearning.AI).',hire:()=>t('open')+'\n'+C.email,contact:()=>C.email+'\nWhatsApp: +'+C.wa};
const ask=(k,l)=>setM(x=>[...x,{u:1,s:l},{s:A[k]()}]);
const guess=s=>/skill|tech|stack|k[öo]nn|مهار|مہارت/i.test(s)?'skills':/project|projekt|مشروع|مشاريع|پروجیکٹ/i.test(s)?'projects':/cert|zertif|شهاد|سرٹیف/i.test(s)?'certs':/hire|job|freelan|einstell|وظف|ہائر/i.test(s)?'hire':'contact';
const go=()=>{if(v.trim()){ask(guess(v),v);setV('')}};
return <><button className="ib bot" onClick={()=>setO(!o)} aria-label={t('chat_t')}>🤖</button>
{o&&<div className="cb"><header>{t('chat_t')}</header><div className="ms" ref={r}><div className="m">{t('chat_hi')}</div>{m.map((x,i)=><div key={i} className={'m '+(x.u?'u':'')} style={{whiteSpace:'pre-line'}}>{x.s}</div>)}</div>
<div className="qk">{[['skills','nav_skills'],['projects','nav_projects'],['certs','nav_certs'],['hire','hire'],['contact','nav_contact']].map(([k,l])=><button className="chip" key={k} onClick={()=>ask(k,t(l))}>{t(l)}</button>)}</div>
<div className="ci2"><input value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>e.key=='Enter'&&go()} placeholder={t('chat_ph')}/><button className="btn pr" onClick={go}>{t('send')}</button></div></div>}</>}
