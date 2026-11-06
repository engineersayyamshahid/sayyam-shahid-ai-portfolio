import {notFound} from 'next/navigation';import {get,SITE} from '@/lib/api';import {find} from '@/lib/data';import {SECTIONS as S,CFG as C} from '@/lib/site';import ReviewForm from '@/components/ReviewForm';
export const revalidate=60;
async function load(p){const {section,slug}=await p;const s=S[section];return {section,s,d:s?await find(s.type,slug):null}}
export async function generateMetadata({params}){const {section,d}=await load(params);if(!d)return{};const u=`/${section}/${d.slug}`;
return{title:d.title,description:d.excerpt,keywords:d.tags,alternates:{canonical:u},openGraph:{type:'article',title:d.title,description:d.excerpt,url:SITE+u,images:d.image?[d.image]:undefined}}}
export default async function Item({params}){const {section,s,d}=await load(params);if(!d)notFound();
const post=['blog','articles'].includes(section);const rv=post?(await get('/reviews?postSlug='+d.slug))||[]:[];
const ld={'@context':'https://schema.org','@type':post?'BlogPosting':'CreativeWork',headline:d.title,description:d.excerpt,datePublished:d.createdAt,dateModified:d.updatedAt,author:{'@type':'Person',name:C.name},keywords:(d.tags||[]).join(', ')};
return <article className="wrap sec post"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld)}}/>
<p className="mu">{s.title} · {new Date(d.createdAt).toLocaleDateString('en-GB',{dateStyle:'long'})}</p><h1 style={{fontSize:'clamp(30px,5vw,48px)'}}>{d.title}</h1><p className="mu" style={{fontSize:18}}>{d.excerpt}</p>
{d.image&&<img src={d.image} alt={d.title} style={{width:'100%',borderRadius:16}}/>}
{(d.body||'').split(/\n\n+/).map((b,i)=>b.startsWith('## ')?<h2 key={i}>{b.slice(3)}</h2>:<p key={i}>{b}</p>)}
<div>{(d.tags||[]).map(t=><span className="chip" key={t}>{t}</span>)}</div>
{d.live&&<a className="btn pr" href={d.live} target="_blank" rel="noopener">Live demo</a>}{d.github&&<a className="btn" href={d.github} target="_blank" rel="noopener">Source code</a>}
{post&&<section style={{marginTop:50}}><h2>Reviews ({rv.length})</h2>{rv.map(r=><div className="card" key={r._id} style={{marginBottom:10}}><span className="st">{'★'.repeat(r.rating)}</span><p>{r.text}</p><b>{r.name}</b></div>)}<h3>Leave a review</h3><ReviewForm postSlug={d.slug}/></section>}</article>}
