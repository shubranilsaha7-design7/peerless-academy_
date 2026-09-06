const fs = require('fs');

let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

const imports = `
import DynamicMediaManager from './DynamicMediaManager';
import LiveTelemetry from './LiveTelemetry';
import AiQuotaMonitor from './AiQuotaMonitor';
import GlobalBroadcaster from './GlobalBroadcaster';
import FinancialAuditVault from './FinancialAuditVault';
`;

code = code.replace("import IpProtectionPanel from './IpProtectionPanel';", "import IpProtectionPanel from './IpProtectionPanel';\n" + imports);

code = code.replace(/\| 'ip_master'>\('enquiries'\)/, "| 'ip_master' | 'finance'>('enquiries')");

code = code.replace(
  /\{activeTab === 'media' && \([\s\S]*?<\/div>\n          \)\}/,
  "{activeTab === 'media' && (<div className=\"max-w-6xl mx-auto\"><DynamicMediaManager /></div>)}"
);

code = code.replace(
  /\{activeTab === 'stats' && \([\s\S]*?<\/div>\n          \)\}/,
  "{activeTab === 'stats' && (<div className=\"max-w-6xl mx-auto\"><LiveTelemetry /></div>)}"
);

code = code.replace(
  /\{activeTab === 'ai_settings' && \([\s\S]*?<\/div>\n          \)\}/,
  "{activeTab === 'ai_settings' && (<div className=\"max-w-6xl mx-auto\"><AiQuotaMonitor /></div>)}"
);

code = code.replace(
  /\{activeTab === 'banner' && \([\s\S]*?<\/div>\n          \)\}/,
  "{activeTab === 'banner' && (<div className=\"max-w-6xl mx-auto\"><GlobalBroadcaster /></div>)}"
);

const financeTabLogic = "\n          {activeTab === 'finance' && (<div className=\"max-w-6xl mx-auto\"><FinancialAuditVault /></div>)}";
code = code.replace(/<\/AnimatePresence>/, financeTabLogic + "\n        </AnimatePresence>");

const financeNav = "\n    { id: 'finance', label: 'Financial Audit', icon: <DollarSign size={18} /> },";
code = code.replace(/\{ id: 'ip_master', label: 'IP Protection', icon: <Lock size=\{18\} \/> \},/, "{ id: 'ip_master', label: 'IP Protection', icon: <Lock size={18} /> }," + financeNav);

if (!code.includes('DollarSign,')) {
  code = code.replace('Lock,', 'Lock, DollarSign,');
}

fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
console.log('Modules injected.');
