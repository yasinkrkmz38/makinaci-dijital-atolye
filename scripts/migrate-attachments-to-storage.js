'use strict';
const {Pool}=require('pg');
const crypto=require('crypto');
const storage=require('../storage');

if(!process.env.DATABASE_URL)throw Error('DATABASE_URL gerekli');
if(!storage.configured)throw Error('Object storage ortam değişkenleri gerekli');
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:false});

(async()=>{
  const rows=(await pool.query(`SELECT id,company_id,file_name,mime_type,file_data FROM attachments WHERE file_data IS NOT NULL AND storage_key IS NULL ORDER BY id`)).rows;
  let migrated=0;
  for(const row of rows){
    const body=Buffer.from(row.file_data),checksum=crypto.createHash('sha256').update(body).digest('hex'),key=storage.objectKey({companyId:row.company_id,context:'legacy',fileName:row.file_name}),uploaded=await storage.put({key,body,contentType:row.mime_type,metadata:{company:String(row.company_id),checksum}});
    try{const result=await pool.query(`UPDATE attachments SET storage_key=$1,storage_bucket=$2,storage_etag=$3,checksum_sha256=$4,file_data=NULL WHERE id=$5 AND storage_key IS NULL`,[uploaded.key,uploaded.bucket,uploaded.etag,checksum,row.id]);if(result.rowCount)migrated++;else await storage.remove(uploaded.key)}catch(error){await storage.remove(uploaded.key).catch(()=>{});throw error}
    process.stdout.write(`\r${migrated}/${rows.length} dosya taşındı`);
  }
  process.stdout.write(`\nTamamlandı: ${migrated} dosya object storage'a taşındı.\n`);
})().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>pool.end());
