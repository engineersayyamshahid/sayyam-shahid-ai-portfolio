export const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:5000/api';
export const SITE=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';
export async function get(path){try{const r=await fetch(API+path,{next:{revalidate:60}});return r.ok?await r.json():null}catch{return null}}
