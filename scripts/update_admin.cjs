const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

code = code.replace(
  /\| 'ai_settings' \| 'rbac'>\('enquiries'\)/,
  "| 'ai_settings' | 'rbac' | 'ip_master'>('enquiries')"
);

code = code.replace(
  /{ id: 'rbac', label: 'Role Based Access', icon: <ShieldAlert size={18} \/> },/,
  "{ id: 'rbac', label: 'Role Based Access', icon: <ShieldAlert size={18} /> },\n    { id: 'ip_master', label: 'IP Protection', icon: <ShieldAlert size={18} /> },"
);

code = code.replace(
  /<\/AnimatePresence>/,
  "  {activeTab === 'ip_master' && (\n            <div className=\"max-w-6xl mx-auto\">\n              <IpProtectionPanel />\n            </div>\n          )}\n        </AnimatePresence>"
);

fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
console.log('Done');
