import {Redirect,useLocalSearchParams,type Href} from 'expo-router';
import {useAuth} from '@/providers/auth-provider';

export default function WebAppLink(){const params=useLocalSearchParams<{machine?:string;section?:string;invite?:string}>(),{user}=useAuth();if(params.machine)return <Redirect href={`/(app)/machines/${params.machine}` as Href}/>;if(params.invite)return <Redirect href={user?{pathname:'/(app)/invite',params:{token:params.invite}}:{pathname:'/(auth)/login',params:{invite:params.invite}}}/>;const routes:Record<string,Href>={maintenance:'/(app)/maintenance',workorders:'/(app)/(tabs)/work-orders',parts:'/(app)/parts',diagnosis:'/(app)/diagnosis',dashboard:'/(app)/(tabs)'};return <Redirect href={routes[params.section||'']||'/(app)/(tabs)'}/>}
