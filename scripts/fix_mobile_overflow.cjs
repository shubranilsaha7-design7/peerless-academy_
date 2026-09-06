const fs = require('fs');
const path = 'public/nfc.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Fix body styling
html = html.replace(
`    body {
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      overflow-x: hidden;
      position: relative;
    }`,
`    body {
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: hidden;
      width: 100%;
      max-width: 100vw;
      position: relative;
    }`
);

// 2. Fix notice board wrapping and max-width
const noticeBoardRegex = /<div id="notice-board" style="([^"]*)">/;
const match = html.match(noticeBoardRegex);
if (match) {
    let currentStyle = match[1];
    // Add width and max-width if they don't exist
    if (!currentStyle.includes('width: 100%')) {
        currentStyle = 'width: 100%; max-width: 100vw; box-sizing: border-box; ' + currentStyle;
    }
    html = html.replace(match[0], `<div id="notice-board" style="${currentStyle}">`);
}

fs.writeFileSync(path, html, 'utf8');
console.log('Mobile layout fixes applied.');
