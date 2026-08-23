'use strict';
const {S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand,HeadBucketCommand}=require('@aws-sdk/client-s3');
const crypto=require('crypto');
const path=require('path');

const config={
  endpoint:String(process.env.STORAGE_ENDPOINT||'').trim()||undefined,
  region:String(process.env.STORAGE_REGION||'auto').trim(),
  bucket:String(process.env.STORAGE_BUCKET||'').trim(),
  accessKeyId:String(process.env.STORAGE_ACCESS_KEY_ID||'').trim(),
  secretAccessKey:String(process.env.STORAGE_SECRET_ACCESS_KEY||'').trim(),
  forcePathStyle:String(process.env.STORAGE_FORCE_PATH_STYLE||'false').toLowerCase()==='true'
};
const configured=!!(config.bucket&&config.accessKeyId&&config.secretAccessKey);
const client=configured?new S3Client({endpoint:config.endpoint,region:config.region,forcePathStyle:config.forcePathStyle,credentials:{accessKeyId:config.accessKeyId,secretAccessKey:config.secretAccessKey}}):null;

function safeSegment(value){return String(value||'file').normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80)||'file'}
function objectKey({companyId,context,fileName}){const extension=path.extname(fileName||'').slice(0,12).toLowerCase(),date=new Date();return `companies/${safeSegment(companyId)}/${safeSegment(context)}/${date.getUTCFullYear()}/${String(date.getUTCMonth()+1).padStart(2,'0')}/${crypto.randomUUID()}${extension}`}
async function put({key,body,contentType,metadata={}}){if(!client)throw Error('Object storage yapılandırılmamış');const result=await client.send(new PutObjectCommand({Bucket:config.bucket,Key:key,Body:body,ContentType:contentType,Metadata:metadata}));return {bucket:config.bucket,key,etag:String(result.ETag||'').replace(/^"|"$/g,'')}}
async function streamToBuffer(stream){if(Buffer.isBuffer(stream))return stream;const chunks=[];for await(const chunk of stream)chunks.push(Buffer.from(chunk));return Buffer.concat(chunks)}
async function get(key){if(!client)throw Error('Object storage yapılandırılmamış');const result=await client.send(new GetObjectCommand({Bucket:config.bucket,Key:key}));return {body:await streamToBuffer(result.Body),contentType:result.ContentType,etag:String(result.ETag||'').replace(/^"|"$/g,'')}}
async function remove(key){if(!client||!key)return;await client.send(new DeleteObjectCommand({Bucket:config.bucket,Key:key}))}
async function health(){if(!client)return {status:'unconfigured'};try{await client.send(new HeadBucketCommand({Bucket:config.bucket}));return {status:'ok'}}catch(error){return {status:'error',message:String(error.name||error.message).slice(0,120)}}}

module.exports={configured,bucket:config.bucket,objectKey,put,get,remove,health};
