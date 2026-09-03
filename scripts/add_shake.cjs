const fs = require('fs');
let tailwind = fs.readFileSync('tailwind.config.js', 'utf8');
if (!tailwind.includes('shake:')) {
  tailwind = tailwind.replace('extend: {', "extend: { keyframes: { shake: { '0%, 100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-10px)' }, '75%': { transform: 'translateX(10px)' } } }, animation: { shake: 'shake 0.4s ease-in-out' },");
  fs.writeFileSync('tailwind.config.js', tailwind);
}
