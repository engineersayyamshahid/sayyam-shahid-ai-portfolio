'use client';import {useEffect,useState} from 'react';import {API} from '@/lib/api';
const TABS=['blog','article','project','certificate','skill','testimonial','reviews','messages'];
const E={title:'',excerpt:'',body:'',tags:'',image:'',live:'',github:'',verify:'',meta:'',published:true};
const HINT={skill:'Title = category, Tags = items',certificate:'Meta = issuer, Verify = Coursera link',testimonial:'Title = client name, Meta = company, Excerpt = feedback',project:'Excerpt = summary, Tags = tech stack'};
export default function Admin(){
const [tok,setTok]=useState(null),[tab,setTab]=useState('blog'),[rows,setRows]=useState([]),[f,setF]=useState(E),[id,setId]=useState(null),[msg,setMsg]=useState(''),[lg,setLg]=useState({username:'',password:''});
useEffect(()=>setTok(localStorage.getItem('tk')||''),[]);
const call=(p,o={})=>fetch(API+p,{...o,headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok}}).then(r=>{if(r.status==401){localStorage.removeItem('tk');setTok('');throw 0}return r.json()});
const load=()=>call(tab=='reviews'?'/reviews/all':tab=='messages'?'/contact':'/content/all?type='+tab).then(setRows).catch(()=>{});
useEffect(()=>{if(tok){load();setF(E);setId(null);setMsg('')}},[tok,tab]);
async function login(e){e.preventDefault();try{const r=await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lg)});const d=await r.json();if(!r.ok)throw d.error;localStorage.setItem('tk',d.token);setTok(d.token)}catch(x){setMsg(typeof x=='string'?x:'Cannot reach the API')}}
async function save(e){e.preventDefault();const b={...f,type:tab,tags:String(f.tags).split(',').map(s=>s.trim()).filter(Boolean)};
await call(id?'/content/'+id:'/content',{method:id?'PUT':'POST',body:JSON.stringify(b)});setMsg(id?'Updated':'Published');setF(E);setId(null);load()}
const del=async r=>{if(confirm('Delete this item?')){await call((tab=='reviews'?'/reviews/':'/content/')+r._id,{method:'DELETE'});load()}};
const edit=r=>{setId(r._id);setF({...E,...r,tags:(r.tags||[]).join(', ')});scrollTo({top:0})};
if(tok===null)return null;
if(!tok)return <div className="wrap sec" style={{maxWidth:420}}><h1 style={{fontSize:32}}>Dashboard login</h1><form className="form" onSubmit={login}><input placeholder="Username" value={lg.username} onChange={e=>setLg({...lg,username:e.target.value})}/><input type="password" placeholder="Password" value={lg.password} onChange={e=>setLg({...lg,password:e.target.value})}/><button className="btn pr">Log in</button><p className="mu">{msg}</p></form></div>;
const content=!['reviews','messages'].includes(tab);
return <div className="wrap sec"><div style={{display:'flex',justifyContent:'space-between'}}><h1 style={{fontSize:32}}>Dashboard</h1><button className="btn" onClick={()=>{localStorage.removeItem('tk');setTok('')}}>Log out</button></div>
<div className="tabs">{TABS.map(t=><button key={t} className={'btn '+(t==tab?'on':'')} onClick={()=>setTab(t)}>{t}</button>)}</div>
{content&&<form className="form card" onSubmit={save} style={{margin:'16px 0'}}><b>{id?'Edit':'New'} {tab}</b><p className="mu" style={{margin:0}}>{HINT[tab]||'Body: use "## Heading" lines and blank lines between paragraphs. Tags = SEO keywords.'}</p>
{['title','excerpt','tags','image','meta','live','github','verify'].map(k=><input key={k} placeholder={k+(k=='tags'?' (comma separated)':'')} value={f[k]||''} onChange={e=>setF({...f,[k]:e.target.value})} required={k=='title'}/>)}
<textarea rows="9" placeholder="body" value={f.body||''} onChange={e=>setF({...f,body:e.target.value})}/>
<label><input type="checkbox" style={{width:'auto'}} checked={!!f.published} onChange={e=>setF({...f,published:e.target.checked})}/> Published</label>
<div><button className="btn pr">{id?'Save changes':'Publish'}</button>{id&&<button type="button" className="btn" onClick={()=>{setId(null);setF(E)}}>Cancel</button>}</div><span className="mu">{msg}</span></form>}
{rows.map(r=><div className="row" key={r._id}><div><b>{r.title||r.name||r.subject}</b> {r.published===false&&<span className="chip">draft</span>}{r.approved===false&&<span className="chip">pending</span>}<div className="mu" style={{fontSize:14}}>{r.text||r.message||r.excerpt||r.meta||''}{r.email&&' · '+r.email}</div></div>
<div style={{whiteSpace:'nowrap'}}>{content&&<button className="btn" onClick={()=>edit(r)}>Edit</button>}{tab=='reviews'&&!r.approved&&<button className="btn pr" onClick={async()=>{await call('/reviews/'+r._id+'/approve',{method:'PUT'});load()}}>Approve</button>}{tab!='messages'&&<button className="btn" onClick={()=>del(r)}>Delete</button>}</div></div>)}
{!rows.length&&<p className="mu">Nothing here yet.</p>}</div>}
