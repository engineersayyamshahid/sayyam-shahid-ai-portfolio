'use client';import {useState} from 'react';import {API} from '@/lib/api';import {useApp} from './Providers';
export default function ReviewForm({postSlug=''}){const {t}=useApp();const [s,setS]=useState('');
async function go(e){e.preventDefault();const form=e.target,f=Object.fromEntries(new FormData(form));f.rating=+f.rating;f.postSlug=postSlug;setS(t('f_sending'));
try{const r=await fetch(API+'/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)});if(!r.ok)throw 0;setS(t('r_ok'));form.reset()}catch{setS(t('r_fail'))}}
return <form onSubmit={go} className="form"><input name="name" placeholder={t('r_name')} required/><select name="rating" defaultValue="5">{[5,4,3,2,1].map(n=><option key={n} value={n}>{'★'.repeat(n)} ({n}/5)</option>)}</select><textarea name="text" rows="4" placeholder={t('r_text')} minLength="5" required/><button className="btn pr">{t('r_send')}</button><p role="status" className="mu">{s}</p></form>}
