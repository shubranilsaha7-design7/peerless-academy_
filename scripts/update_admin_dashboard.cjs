const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

if(!code.includes('AdminQuestionBank')) {
  code = code.replace(
    /import QuestionIngestionEngine from '.\/QuestionIngestionEngine';/,
    `import QuestionIngestionEngine from './QuestionIngestionEngine';
import AdminQuestionBank from './AdminQuestionBank';
import AdminMediaManager from './AdminMediaManager';`
  );
  
  // Update state
  code = code.replace(
    /useState<'enquiries' \| 'lectures' \| 'batches' \| 'codes' \| 'media' \| 'students' \| 'banner' \| 'stats' \| 'sql' \| 'ai_ingest' \| 'cms_video' \| 'ai_settings' \| 'rbac' \| 'ip_master' \| 'finance'>/,
    `useState<'enquiries' | 'lectures' | 'batches' | 'codes' | 'media' | 'students' | 'banner' | 'stats' | 'sql' | 'ai_ingest' | 'cms_video' | 'ai_settings' | 'rbac' | 'ip_master' | 'finance' | 'qbank' | 'cms_media'>`
  );

  // Add navigation buttons
  const navReplacement = `<button onClick={() => setActiveTab('students')} className={\`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition \${activeTab === 'students' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}\`}><Users size={18} /> Student Roster</button>
          
          <div className="pt-4 pb-2"><div className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-600">Core Systems</div></div>
          <button onClick={() => setActiveTab('qbank')} className={\`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition \${activeTab === 'qbank' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}\`}><Database size={18} /> Question Bank</button>
          <button onClick={() => setActiveTab('cms_media')} className={\`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition \${activeTab === 'cms_media' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}\`}><ImageIcon size={18} /> Global Media</button>`;
          
  code = code.replace(
    /<button onClick=\{\(\) => setActiveTab\('students'\)\} className=\{`w-full text-left px-4 py-2\.5 rounded-xl text-sm font-bold flex items-center gap-3 transition \$\{activeTab === 'students' \? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'\}`\}><Users size=\{18\} \/> Student Roster<\/button>/,
    navReplacement
  );

  // Add content rendering
  const renderReplacement = `{activeTab === 'qbank' && <AdminQuestionBank />}
        {activeTab === 'cms_media' && <AdminMediaManager />}
        {activeTab === 'finance' && <FinancialAuditVault />}`;
        
  code = code.replace(
    /\{activeTab === 'finance' && <FinancialAuditVault \/>\}/,
    renderReplacement
  );

  fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
}
