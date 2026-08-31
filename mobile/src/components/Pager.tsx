import {StyleSheet,Text,View} from 'react-native';
import {AppButton} from './ui';
import {useAppTheme} from '@/theme/tokens';
export function Pager({page,total,limit,onPage}:{page:number;total:number;limit:number;onPage:(page:number)=>void}){const t=useAppTheme(),pages=Math.max(1,Math.ceil(total/limit));if(pages<=1)return null;return <View style={styles.row}><AppButton label="Önceki" variant="secondary" disabled={page<=1} onPress={()=>onPage(page-1)}/><Text style={{color:t.colors.muted,fontWeight:'800'}}>{page} / {pages}</Text><AppButton label="Sonraki" variant="secondary" disabled={page>=pages} onPress={()=>onPage(page+1)}/></View>}
const styles=StyleSheet.create({row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8}});
