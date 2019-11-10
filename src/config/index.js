'use strict';

module.exports = {
  port: 8443,
  mongodb: "mongodb://localhost:27017/nodepop",
  secret: "zASqocowSXsaodA1293SKLVNIS",
  prod: {
    key: `/etc/letsencrypt/live/autodeluxegarage.es/privkey.pem`,
    cert: `/etc/letsencrypt/live/autodeluxegarage.es/cert.pem`
  },
  dev: {
    key: './certs/example.com+5-key.pem',
    cert: './certs/example.com+5.pem'
  }
}