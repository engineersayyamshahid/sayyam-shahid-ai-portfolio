import {get,SITE} from '@/lib/api';
export default async function sitemap(){const all=(await get('/content'))||[];const base={blog:'blog',article:'articles',project:'projects'};
return[...['','/blog','/articles','/projects','/certificates'].map(p=>({url:SITE+p,lastModified:new Date()})),...all.filter(x=>base[x.type]).map(x=>({url:`${SITE}/${base[x.type]}/${x.slug}`,lastModified:x.updatedAt}))]}
