import {useEffect,useState} from 'react';
import {useLocalSearchParams,useRouter} from 'expo-router';
import {api} from '@/services/api';
import {useAuth} from '@/providers/auth-provider';
import {AppButton,Card,ErrorState,Screen,Skeleton} from '@/components/ui';
import {BackHeader} from '@/components/BackHeader';
import {Text} from 'react-native';
import {useAppTheme} from '@/theme/tokens';

export default function AcceptInvite(){const {token}=useLocalSearchParams<{token:string}>(),router=useRouter(),t=useAppTheme(),{reload}=useAuth(),[state,setState]=useState<'loading'|'done'|'error'>('loading'),[message,setMessage]=useState('');useEffect(()=>{api<{company:{name:string};role:string}>('/api/invitations/accept',{method:'POST',body:JSON.stringify({token})}).then(async result=>{await reload();setMessage(`${result.company.name} ekibine ${result.role} rolüyle katıldınız.`);setState('done')}).catch(error=>{setMessage((error as Error).message);setState('error')})},[token,reload]);return <Screen><BackHeader title="Ekip daveti" subtitle="Firma üyeliği doğrulanıyor"/>{state==='loading'?<Skeleton rows={3}/>:state==='error'?<ErrorState message={message}/>:<Card><Text style={{color:t.colors.text,fontSize:18,fontWeight:'900'}}>Davet kabul edildi</Text><Text style={{color:t.colors.muted,lineHeight:21}}>{message}</Text><AppButton label="Çalışma alanına geç" onPress={()=>router.replace('/(app)/(tabs)')}/></Card>}</Screen>}
