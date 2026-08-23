'use strict';

const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const version=require(path.join(root,'package.json')).version;
const checkOnly=process.argv.includes('--check');
const files=[
  '.env.example','admin.css','admin.html','app.html',
  'forgot-password.html','index.html','manifest.webmanifest','not-found.html','pwa.js',
  'report.html','report.js','reset-password.html','service-worker.js','style.css','verify-email.html',
  'README.md','PROJECT.md'
];
let changed=[];
for(const file of files){
  const target=path.join(root,file);
  const source=fs.readFileSync(target,'utf8');
  const next=source.replace(/\b\d+\.\d+\.\d+\b/g,version);
  if(next!==source){
    changed.push(file);
    if(!checkOnly)fs.writeFileSync(target,next,'utf8');
  }
}
if(checkOnly&&changed.length)throw Error(`package.json sürümüyle eşleşmeyen dosyalar: ${changed.join(', ')}`);
console.log(checkOnly?`Sürüm kaynakları ${version} ile eşleşiyor.`:`Sürüm ${version} olarak eşitlendi.`);
