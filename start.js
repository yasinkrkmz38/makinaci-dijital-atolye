'use strict';

/*
 * Dijital Makinacı V17.2 production bootstrap.
 * Güvenlik açısından kritik environment değişkenleri olmadan
 * production sunucusunun yanlışlıkla ayağa kalkmasını engeller.
 */

const production = process.env.NODE_ENV === 'production';

function required(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) {
    console.error(`[V17.2 SECURITY] ${name} tanımlı değil.`);
    process.exit(1);
  }
  return value;
}

required('DATABASE_URL');

if (production) {
  const secret = required('JWT_SECRET');

  if (secret === 'DEVELOPMENT_ONLY_CHANGE_ME' || secret.length < 32) {
    console.error(
      '[V17.2 SECURITY] Production JWT_SECRET güvenli değil. ' +
      'En az 32 karakterlik rastgele bir secret kullanın.'
    );
    process.exit(1);
  }
}

process.env.APP_VERSION = process.env.APP_VERSION || '17.2.0';

// Render ağ ayarlarını uygular ve ardından uygulama sunucusunu başlatır.
require('./render-start.js');
