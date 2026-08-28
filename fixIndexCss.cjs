const fs = require('fs');
let c = fs.readFileSync('src/index.css', 'utf-8');
const idx = c.indexOf('.ambient-glow {');
if (idx !== -1) {
  const endIdx = c.indexOf('}', idx) + 1;
  const newTail = `\n
@keyframes marquee-scroll {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 25s linear infinite;
}
.animate-marquee-track:hover {
  animation-play-state: paused;
}
`;
  c = c.substring(0, endIdx) + newTail;
  fs.writeFileSync('src/index.css', c);
  console.log('Fixed index.css');
}
