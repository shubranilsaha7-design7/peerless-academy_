const fs = require('fs');
let html = fs.readFileSync('public/nfc.html', 'utf8');
html = html.replace(/function open\(id\)/g, 'function openDrawer(id)');
html = html.replace(/onclick="open\(/g, 'onclick="openDrawer(');
fs.writeFileSync('public/nfc.html', html);
console.log('Fixed openDrawer');
