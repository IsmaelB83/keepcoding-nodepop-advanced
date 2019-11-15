'use strict';
// Own imports
var Jimp = require('jimp');

module.exports = (original, callback) => {
    // Thumbnail name
    let thumbnail = original;
    thumbnail = thumbnail.replace('/original/','/thumbnail/');
    // Resize
    Jimp.read(`public${original}`)
    .then(lenna => {
        // Create thumbnail
        lenna.resize(256, 256).quality(60).write(`public${thumbnail}`);
        // Save item
        callback(thumbnail);
    })
    .catch(err => {
        console.error(err);
    });
}
