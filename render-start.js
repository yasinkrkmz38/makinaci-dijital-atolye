'use strict';

/*
  Dijital Makinacı — Render 502 Hotfix
  - Render'ın verdiği PORT değerini kullanır.
  - HTTP listener'ı açıkça 0.0.0.0 adresine bağlar.
  - Keep-alive / headers timeout değerlerini 120 saniyeye çıkarır.
  - Asıl uygulama koduna dokunmadan server.js'i çalıştırır.
*/

process.env.PORT = String(process.env.PORT || '10000');

const http = require('http');
const originalListen = http.Server.prototype.listen;

http.Server.prototype.listen = function patchedListen(...args) {
  let callback = null;

  if (args.length && typeof args[args.length - 1] === 'function') {
    callback = args.pop();
  }

  // server.js şu anda app.listen(PORT, callback) kullanıyor.
  // Render'da bunu açıkça 0.0.0.0:$PORT şeklinde çalıştırıyoruz.
  if (args.length && (typeof args[0] === 'number' || typeof args[0] === 'string')) {
    const port = Number(process.env.PORT) || 10000;
    const server = originalListen.call(this, port, '0.0.0.0', callback || undefined);

    server.keepAliveTimeout = 120000;
    server.headersTimeout = 120000;

    console.log(`[RENDER] Listening on 0.0.0.0:${port}`);
    console.log('[RENDER] keepAliveTimeout=120000 headersTimeout=120000');

    return server;
  }

  if (callback) args.push(callback);
  return originalListen.apply(this, args);
};

require('./server.js');
