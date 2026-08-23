'use strict';
const fs=require('fs');
const path=require('path');

async function runMigrations(pool,directory){
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations(name TEXT PRIMARY KEY,applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  const files=fs.existsSync(directory)?fs.readdirSync(directory).filter(file=>/^\d+.*\.sql$/.test(file)).sort():[];
  const applied=new Set((await pool.query('SELECT name FROM schema_migrations')).rows.map(row=>row.name));
  for(const file of files){
    if(applied.has(file))continue;
    const sql=fs.readFileSync(path.join(directory,file),'utf8');
    const client=await pool.connect();
    try{
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations(name) VALUES($1)',[file]);
      await client.query('COMMIT');
      console.log(`[MIGRATION] ${file} uygulandı`);
    }catch(error){
      await client.query('ROLLBACK').catch(()=>{});
      throw error;
    }finally{client.release()}
  }
}

module.exports={runMigrations};
