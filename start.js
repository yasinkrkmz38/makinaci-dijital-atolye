'use strict';

/*
 * Dijital Makinacı production bootstrap.
 * Güvenlik açısından kritik environment değişkenleri olmadan
 * production sunucusunun yanlışlıkla ayağa kalkmasını engeller.
 */

const production = process.env.NODE_ENV === 'production';

function required(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) {
    console.error(`[SECURITY] ${name} tanımlı değil.`);
    process.exit(1);
  }
  return value;
}

required('DATABASE_URL');

if (production) {
  const secret = required('JWT_SECRET');

  if (secret === 'DEVELOPMENT_ONLY_CHANGE_ME' || secret.length < 32) {
    console.error(
      '[SECURITY] Production JWT_SECRET güvenli değil. ' +
      'En az 32 karakterlik rastgele bir secret kullanın.'
    );
    process.exit(1);
  }
}

const packageVersion=require('./package.json').version;
if(process.env.APP_VERSION&&process.env.APP_VERSION!==packageVersion){
  console.error(`[CONFIG] APP_VERSION kullanmayın; sürümün tek kaynağı package.json (${packageVersion}).`);
  process.exit(1);
}

require('./server.js');
