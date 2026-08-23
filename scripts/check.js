'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const pkg = require(path.join(root, 'package.json'));
const jsFiles = ['server.js','start.js','render-start.js','v1621-app.js','admin.js','v1621-service-worker.js','v172-integrity.js','v172-login-hotfix.js'];
const requiredFiles = ['v1621-index.html','v1621-style.css','v1621-manifest.webmanifest','admin.html','admin.css','.env.example'];

for (const file of [...jsFiles, ...requiredFiles]) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Eksik üretim dosyası: ${file}`);
}
for (const file of jsFiles) execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'inherit' });

const start = fs.readFileSync(path.join(root, 'start.js'), 'utf8');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
if (!start.includes(`'${pkg.version}'`)) throw new Error('start.js ile package.json sürümleri farklı');
if (!server.includes(`'${pkg.version}'`)) throw new Error('server.js ile package.json sürümleri farklı');
if (pkg.scripts.start !== 'node start.js') throw new Error('npm start güvenli başlangıç dosyasını kullanmıyor');

console.log(`Dijital Makinacı V${pkg.version}: kontroller başarılı.`);
