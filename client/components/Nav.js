'use client';import Link from 'next/link';import {useState} from 'react';import {useApp} from './Providers';import {LANGS} from '@/lib/dict';import {CFG as C} from '@/lib/site';
export default function Nav(){const {t,lang,setLang,theme,toggle}=useApp();const [o,setO]=useState(false);
const L=[['/#about','nav_about'],['/#skills','nav_skills'],['/#experience','nav_exp'],['/projects','nav_projects'],['/blog','nav_blog'],['/articles','nav_articles'],['/certificates','nav_certs'],['/#reviews','nav_reviews'],['/#contact','nav_contact']];
return <nav><div className="wrap bar"><Link href="/" className="brand g">{C.brand}</Link>
<div className={'links '+(o?'open':'')} onClick={()=>setO(false)}>{L.map(([h,k])=><Link key={h} href={h}>{t(k)}</Link>)}</div>
<div className="ctl"><select aria-label="Language" value={lang} onChange={e=>setLang(e.target.value)}>{Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
<button className="ib" onClick={toggle} aria-label="Toggle theme">{theme=='dark'?'☀':'☾'}</button><button className="ib mb" onClick={()=>setO(!o)} aria-label="Menu">☰</button></div></div></nav>}
