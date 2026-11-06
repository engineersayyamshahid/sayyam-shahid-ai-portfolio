'use client';import Link from 'next/link';import {useState} from 'react';import {useApp} from './Providers';
export default function Card({d,base}){const {t}=useApp();const [bad,setBad]=useState(false);const ext=base==='certificates';
const id=(d.verify||'').split('/').pop();const img=d.image||(ext&&id?`/certs/${id}.jpg`:null);
const inner=<>{img&&!bad?<img className="ci" src={img} alt={d.title} loading="lazy" onError={()=>setBad(true)}/>:base==='projects'?<div className="pv">{d.title.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>:null}
<h3 style={{fontSize:18}}>{d.title}</h3>{d.meta&&<p>{d.meta}</p>}{d.excerpt&&<p>{d.excerpt}</p>}<div>{(d.tags||[]).slice(0,6).map(x=><span className="chip" key={x}>{x}</span>)}</div></>;
return ext?<a className="card" href={d.verify||'#'} target="_blank" rel="noopener">{inner}<p style={{color:'var(--a)',margin:0}}>{t('verify')} ↗</p></a>:<Link className="card" href={`/${base}/${d.slug}`}>{inner}</Link>}
