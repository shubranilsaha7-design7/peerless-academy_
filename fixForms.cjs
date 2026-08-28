const fs = require('fs');
let admin = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf-8');
admin = admin.replace(/new FormData\(e.target\)/g, 'new FormData(e.target as HTMLFormElement)');
admin = admin.replace(/e.target.reset\(\)/g, '(e.target as HTMLFormElement).reset()');
fs.writeFileSync('src/components/admin/AdminDashboard.tsx', admin);
