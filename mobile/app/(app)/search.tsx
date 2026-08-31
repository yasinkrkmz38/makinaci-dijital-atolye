import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'expo-router';
import {api} from '@/services/api';
import type {PageResult} from '@/types';
import {EmptyState,ErrorState,Screen,SearchField,Skeleton} from '@/components/ui';
import {BackHeader} from '@/components/BackHeader';
import {EntityRow} from '@/components/EntityRow';

type SearchItem={type:'machine'|'maintenance'|'work_order'|'fault'|'part'|'article';id:number;title:string;subtitle?:string;slug?:string};
const icons={machine:'construct-outline',maintenance:'calendar-outline',work_order:'clipboard-outline',fault:'warning-outline',part:'cube-outline',article:'book-outline'} as const;
export default function GlobalSearch(){const router=useRouter(),[term,setTerm]=useState(''),normalized=term.trim(),query=useQuery({queryKey:['search',normalized],queryFn:()=>api<PageResult<SearchItem>>(`/api/search?q=${encodeURIComponent(normalized)}&limit=30`),enabled:normalized.length>=2}),open=(item:SearchItem)=>{const routes={machine:`/(app)/machines/${item.id}`,maintenance:`/(app)/maintenance/${item.id}`,work_order:`/(app)/work-orders/${item.id}`,fault:`/(app)/faults/${item.id}`,part:`/(app)/parts/${item.id}`,article:'/(app)/library'};router.push(routes[item.type])};return <Screen><BackHeader title="Global arama" subtitle="Makine, bakım, iş emri, arıza, parça ve makale"/><SearchField value={term} onChange={setTerm} placeholder="En az 2 karakter yazın"/>{normalized.length<2?<EmptyState title="Aramaya başlayın" body="Firma verileri yalnızca sunucu tarafında, aktif firma kapsamında aranır."/>:query.isLoading?<Skeleton rows={5}/>:query.error?<ErrorState message={(query.error as Error).message}/>:query.data?.items.length?query.data.items.map(item=><EntityRow key={`${item.type}-${item.id}`} title={item.title} subtitle={item.subtitle} status={item.type.replace('_',' ')} icon={icons[item.type]} onPress={()=>open(item)}/>):<EmptyState title="Sonuç bulunamadı" body="Farklı bir arama ifadesi deneyin."/>}</Screen>}
