import {notFound} from 'next/navigation';import {list} from '@/lib/data';import {SECTIONS as S} from '@/lib/site';import Card from '@/components/Card';import {T} from '@/components/Providers';
export const revalidate=60;
const K={blog:'nav_blog',articles:'nav_articles',projects:'nav_projects',certificates:'nav_certs'};
export async function generateMetadata({params}){const k=(await params).section,s=S[k];return s?{title:s.title,description:s.desc,alternates:{canonical:'/'+k}}:{}}
export default async function Page({params}){const k=(await params).section,s=S[k];if(!s)notFound();const d=await list(s.type);
return <div className="wrap sec"><h1 style={{fontSize:'clamp(32px,5vw,52px)'}}><T k={K[k]}/></h1><p className="mu" style={{marginBottom:28}}>{s.desc}</p>{d.length?<div className="grid">{d.map(x=><Card key={x._id} d={x} base={k}/>)}</div>:<p className="mu"><T k="blog_empty"/></p>}</div>}
