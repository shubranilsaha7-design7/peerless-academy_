const fs = require('fs');

let c = fs.readFileSync('src/components/BroadcastBanner.tsx', 'utf-8');

c = c.replace(
  '<span className="pr-12">{banner.message}</span>',
  '<span className="pr-12 whitespace-nowrap flex-shrink-0">{banner.message}</span>'
);
c = c.replace(
  '<span className="pr-12">{banner.message}</span>',
  '<span className="pr-12 whitespace-nowrap flex-shrink-0">{banner.message}</span>'
);

// Just in case replaceAll is better
c = c.replace(/<span className="pr-12">\{banner\.message\}<\/span>/g, '<span className="pr-12 whitespace-nowrap flex-shrink-0">{banner.message}</span>');

fs.writeFileSync('src/components/BroadcastBanner.tsx', c);
console.log('Fixed whitespace in BroadcastBanner');
