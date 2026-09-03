const fs = require('fs');
let html = fs.readFileSync('public/nfc.html', 'utf8');

const targetRegex = /\s*<a href="https:\/\/peerlessacademy\.in\/cbt" class="list-link">[\s\S]*?<span class="li-text">CBT Student Portal<\/span>[\s\S]*?<\/a>/;
if (targetRegex.test(html)) {
    html = html.replace(targetRegex, '');
    fs.writeFileSync('public/nfc.html', html, 'utf8');
    console.log('Removed CBT link.');
} else {
    console.log('CBT link not found.');
}
