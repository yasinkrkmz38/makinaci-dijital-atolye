import {beforeEach,describe,expect,it,vi} from 'vitest';

const {memory,api,uploadAsset}=vi.hoisted(()=>({memory:new Map<string,string>(),api:vi.fn(),uploadAsset:vi.fn()}));
vi.mock('@react-native-async-storage/async-storage',()=>({default:{getItem:vi.fn(async(key:string)=>memory.get(key)??null),setItem:vi.fn(async(key:string,value:string)=>{memory.set(key,value)}),removeItem:vi.fn(async(key:string)=>{memory.delete(key)})}}));
vi.mock('@/services/api',()=>({api,ApiError:class ApiError extends Error{constructor(message:string,public status=0){super(message)}}}));
vi.mock('@/services/media',()=>({uploadAsset,cleanupOfflineAsset:vi.fn()}));
import {createRequestId,enqueue,getQueue,syncQueue} from '@/services/offline-queue';

describe('çevrimdışı saha kuyruğu',()=>{
  beforeEach(()=>{memory.clear();api.mockReset();uploadAsset.mockReset()});
  it('kullanıcıya özel kayıt saklar',async()=>{await enqueue(7,{method:'POST',path:'/api/faults',body:{symptom:'Titreşim'},kind:'fault'});expect(await getQueue(7)).toHaveLength(1);expect(await getQueue(8)).toHaveLength(0)});
  it('RFC 4122 v4 biçiminde istek anahtarı üretir',()=>expect(createRequestId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/));
  it('senkronizasyonda idempotency başlığı gönderir ve başarılı kaydı siler',async()=>{await enqueue(7,{method:'POST',path:'/api/faults',body:{symptom:'Ses'},kind:'fault'});api.mockResolvedValue({id:4});const result=await syncQueue(7);expect(result).toEqual({synced:1,pending:0});expect(api).toHaveBeenCalledWith('/api/faults',expect.objectContaining({method:'POST',headers:expect.objectContaining({'X-Idempotency-Key':expect.any(String)})}))});
  it('ağ hatasında kaydı kaybetmez',async()=>{await enqueue(7,{method:'POST',path:'/api/work-orders',body:{title:'Kontrol'},kind:'work-order'});api.mockRejectedValue(new Error('offline'));expect((await syncQueue(7)).pending).toBe(1);expect((await getQueue(7))[0]?.attempts).toBe(1)});
  it('çevrimdışı fotoğrafı oluşan arıza kaydına yalnızca anahtarıyla yükler',async()=>{await enqueue(7,{method:'POST',path:'/api/faults',body:{symptom:'Kaçak'},kind:'fault',attachments:[{id:createRequestId(),uri:'file://photo.jpg',name:'photo.jpg',mimeType:'image/jpeg'}]});api.mockResolvedValue({id:19});uploadAsset.mockResolvedValue({id:5});expect(await syncQueue(7)).toEqual({synced:1,pending:0});expect(uploadAsset).toHaveBeenCalledWith('/api/faults/19/attachments',expect.objectContaining({name:'photo.jpg'}),'',expect.any(String))});
});
