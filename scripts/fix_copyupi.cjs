const fs = require('fs');
let html = fs.readFileSync('public/nfc.html', 'utf8');
html = html.replace("navigator.clipboard.writeText('8794130855@ybl')", "navigator.clipboard.writeText('xprasenjit1992-1@okhdfcbank')");
fs.writeFileSync('public/nfc.html', html);
console.log('Fixed copyUPI');
