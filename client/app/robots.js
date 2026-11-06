import {SITE} from '@/lib/api';
export default function robots(){return{rules:{userAgent:'*',allow:'/',disallow:'/admin'},sitemap:SITE+'/sitemap.xml'}}
