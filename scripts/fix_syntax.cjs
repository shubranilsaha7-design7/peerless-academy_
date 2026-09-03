const fs = require('fs');

function fixEscapes(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
  fs.writeFileSync(file, content);
}

fixEscapes('src/components/admin/DynamicMediaManager.tsx');
fixEscapes('src/components/admin/FinancialAuditVault.tsx');
fixEscapes('src/components/admin/IpProtectionPanel.tsx');
