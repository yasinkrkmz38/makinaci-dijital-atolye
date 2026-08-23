'use strict';

const fs=require('fs');
const path=require('path');
const assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const {calculatorSeo,seoArticles,articleBodyText}=require('../seo-content');
const {renderCalculatorPage,renderArticlePage,renderLibraryPage,renderCalculatorIndexPage}=require('../seo-render');
const baseUrl='https://dijitalmakinaci.pro',nonce='seo-check-nonce';
const wordCount=value=>String(value||'').trim().split(/\s+/).filter(Boolean).length;
const calculatorSlugs=Object.keys(calculatorSeo),articleSlugs=seoArticles.map(article=>article.slug);

assert.equal(calculatorSlugs.length,5,'Beş public hesaplama aracı bulunmalı');
assert.ok(seoArticles.length>=15,'En az 15 teknik rehber bulunmalı');
assert.equal(new Set(calculatorSlugs).size,calculatorSlugs.length,'Hesaplama slug değerleri benzersiz olmalı');
assert.equal(new Set(articleSlugs).size,articleSlugs.length,'Makale slug değerleri benzersiz olmalı');
assert.equal(new Set(seoArticles.map(article=>article.title)).size,seoArticles.length,'Makale başlıkları benzersiz olmalı');
assert.equal(new Set(Object.values(calculatorSeo).map(tool=>tool.title)).size,calculatorSlugs.length,'Hesaplama SEO başlıkları benzersiz olmalı');

for(const tool of Object.values(calculatorSeo)){
  assert.ok(tool.description.length>=100&&tool.description.length<=160,`${tool.slug}: meta açıklaması 100–160 karakter olmalı`);
  assert.ok(tool.sections.length>=4,`${tool.slug}: en az dört açıklama bölümü olmalı`);
  assert.ok(wordCount(tool.sections.flatMap(section=>[...(section.paragraphs||[]),...(section.bullets||[])]).join(' '))>=180,`${tool.slug}: açıklama içeriği yetersiz`);
  assert.ok(tool.faq?.length>=3,`${tool.slug}: en az üç SSS bulunmalı`);
  for(const relatedSlug of tool.relatedArticles||[])assert.ok(articleSlugs.includes(relatedSlug),`${tool.slug}: ilişkili makale bulunamadı: ${relatedSlug}`);
  const html=renderCalculatorPage(tool,{baseUrl,nonce});
  assert.ok(html.includes(`<link rel="canonical" href="${baseUrl}/hesaplamalar/${tool.slug}">`),`${tool.slug}: self-canonical eksik`);
  assert.ok(html.includes('data-ssr-seo="true"')&&html.includes('application/ld+json'),`${tool.slug}: SSR SEO veya şema eksik`);
  assert.ok(html.includes('"@type":"WebApplication"')&&html.includes('"@type":"FAQPage"'),`${tool.slug}: hesaplama şeması eksik`);
  assert.ok(wordCount(html.replace(/<[^>]+>/g,' '))>=220,`${tool.slug}: ilk HTML içeriği yetersiz`);
}

for(const article of seoArticles){
  assert.ok(article.description.length>=100&&article.description.length<=160,`${article.slug}: meta açıklaması 100–160 karakter olmalı`);
  assert.ok(article.sections.length>=4,`${article.slug}: en az dört içerik bölümü olmalı`);
  assert.ok(wordCount(articleBodyText(article))>=125,`${article.slug}: makale içeriği yetersiz`);
  assert.ok(article.standard&&article.source&&/^\d{4}-\d{2}-\d{2}$/.test(article.revisionDate),`${article.slug}: kaynak, standart veya revizyon eksik`);
  for(const toolSlug of article.relatedTools||[])assert.ok(calculatorSlugs.includes(toolSlug),`${article.slug}: ilişkili araç bulunamadı: ${toolSlug}`);
  for(const relatedSlug of article.relatedArticles||[])assert.ok(articleSlugs.includes(relatedSlug),`${article.slug}: ilişkili makale bulunamadı: ${relatedSlug}`);
  const html=renderArticlePage(article,{baseUrl,nonce});
  assert.ok(html.includes(`<link rel="canonical" href="${baseUrl}/teknik/${article.slug}">`),`${article.slug}: self-canonical eksik`);
  assert.ok(html.includes('"@type":"TechArticle"')&&html.includes('data-ssr-seo="true"'),`${article.slug}: TechArticle SSR şeması eksik`);
}

const libraryHtml=renderLibraryPage(seoArticles,{baseUrl,nonce}),calculatorIndexHtml=renderCalculatorIndexPage({baseUrl,nonce});
assert.ok(libraryHtml.includes('"@type":"CollectionPage"')&&libraryHtml.includes(`"numberOfItems":${seoArticles.length}`),'Teknik kütüphane ItemList şeması eksik');
assert.ok(calculatorIndexHtml.includes('"@type":"CollectionPage"')&&calculatorIndexHtml.includes('"numberOfItems":5'),'Hesaplama dizini ItemList şeması eksik');
const unsafe=renderArticlePage({slug:'xss-test',title:'<script>alert(1)</script>',summary:'Güvenli render testi için yeterli teknik açıklama metni.',body:'<img src=x onerror=alert(1)>',source:'test',standard:'test',revision_date:'2026-08-23',related_tools:[],related_systems:[]},{baseUrl,nonce});
assert.ok(!unsafe.includes('<script>alert(1)</script>')&&!unsafe.includes('<img src=x'),'Dinamik makale HTML kaçışından geçmeli');

const server=read('server.js'),client=read('site.js'),home=read('index.html');
for(const invariant of ['renderCalculatorPage','renderArticlePage','renderLibraryPage','renderCalculatorIndexPage','mergedPublicArticles','seoArticles.map','s-maxage=21600'])assert.ok(server.includes(invariant),`SSR SEO backend invariant eksik: ${invariant}`);
assert.ok(!server.includes("rootUiFile(res,'calculator.html','html')")&&!server.includes("rootUiFile(res,'article.html','html')"),'SEO sayfaları eski generic HTML dosyasını açmamalı');
assert.ok(client.includes("dataset.ssrSeo==='true'"),'İstemci SSR metadatasını korumalı');
assert.ok((home.match(/href="\/teknik\//g)||[]).length>=6&&home.includes('href="/teknik"'),'Ana sayfada taranabilir teknik içerik bağlantıları bulunmalı');

console.log(`SEO kontrolü başarılı: ${calculatorSlugs.length} hesaplama, ${seoArticles.length} teknik rehber, SSR metadata ve yapılandırılmış veri.`);
