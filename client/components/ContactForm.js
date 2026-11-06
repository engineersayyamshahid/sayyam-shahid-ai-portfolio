'use client';import {useState} from 'react';import {API} from '@/lib/api';import {useApp} from './Providers';
export default function ContactForm(){const {t}=useApp();const [s,setS]=useState('');
async function go(e){e.preventDefault();const form=e.target,f=Object.fromEntries(new FormData(form));setS(t('f_sending'));
try{const r=await fetch(API+'/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)});if(!r.ok)throw 0;setS(t('f_ok'));form.reset()}catch{setS(t('f_fail'))}}
return <form onSubmit={go} className="form"><input name="name" placeholder={t('f_name')} required/><input name="email" type="email" placeholder={t('f_email')} required/><input name="subject" placeholder={t('f_subject')} required/><textarea name="message" rows="5" placeholder={t('f_msg')} minLength="10" required/><button className="btn pr">{t('f_send')}</button><p role="status" className="mu">{s}</p></form>}
