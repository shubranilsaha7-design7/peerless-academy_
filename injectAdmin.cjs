const fs = require('fs');
let admin = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf-8');

// 1. Add tabs to the array
const oldTabs = `{ id: 'ai_ingest', label: 'GenAI Ingestion', icon: Bot },`;
const newTabs = `{ id: 'ai_ingest', label: 'GenAI Ingestion', icon: Bot },
            { id: 'cms_video', label: 'Video CMS', icon: Video },
            { id: 'ai_settings', label: 'AI Command Center', icon: Zap },`;
admin = admin.replace(oldTabs, newTabs);

// 2. Add state for the new tabs in activeTab
admin = admin.replace(
  /activeTab, setActiveTab\] = useState<'enquiries' \| 'lectures' \| 'batches' \| 'codes' \| 'media' \| 'students' \| 'banner' \| 'stats' \| 'sql' \| 'ai_ingest'>/,
  `activeTab, setActiveTab] = useState<'enquiries' | 'lectures' | 'batches' | 'codes' | 'media' | 'students' | 'banner' | 'stats' | 'sql' | 'ai_ingest' | 'cms_video' | 'ai_settings'>`
);

// 3. Inject the UI blocks for these tabs at the end of the tabs rendering
const endOfTabs = `{activeTab === 'ai_ingest' && (`;

const newTabsContent = `
        {/* === VIDEO CMS === */}
        {activeTab === 'cms_video' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Video className="text-cyan-500" /> Video CMS Manager
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                setActionLoading(true);
                const { error } = await supabase.from('course_modules').insert({
                  title: formData.get('title'),
                  description: formData.get('description'),
                  video_url: formData.get('url'),
                });
                setActionLoading(false);
                if (error) {
                  setToastMessage({ text: 'Error adding module: ' + error.message, type: 'error' });
                } else {
                  setToastMessage({ text: 'Module Live! Check Batches tab.', type: 'success' });
                  e.target.reset();
                }
              }} className="space-y-4">
                <label className="block text-xs font-bold text-slate-400">Video Title
                  <input name="title" required className="mt-1 block w-full rounded-xl bg-slate-800 border-none px-4 py-3 text-white" />
                </label>
                <label className="block text-xs font-bold text-slate-400">Description
                  <textarea name="description" className="mt-1 block w-full rounded-xl bg-slate-800 border-none px-4 py-3 text-white" />
                </label>
                <label className="block text-xs font-bold text-slate-400">Video URL (YouTube, Vimeo, MP4)
                  <input name="url" required type="url" className="mt-1 block w-full rounded-xl bg-slate-800 border-none px-4 py-3 text-white" placeholder="https://youtube.com/watch?v=..." />
                </label>
                <button type="submit" disabled={actionLoading} className="w-full bg-cyan-500 text-black py-3 rounded-xl font-bold uppercase shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-400">Publish Video Module</button>
              </form>
            </div>
          </div>
        )}

        {/* === AI COMMAND CENTER === */}
        {activeTab === 'ai_settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Zap className="text-emerald-500" /> AI Command Center
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                setActionLoading(true);
                const { error } = await supabase.from('platform_settings').upsert({
                  id: 'GLOBAL',
                  ai_name: formData.get('ai_name'),
                  ai_greeting: formData.get('ai_greeting'),
                  system_prompt: formData.get('system_prompt'),
                  model_tier: formData.get('model_tier'),
                  updated_at: new Date().toISOString()
                });
                setActionLoading(false);
                if (error) {
                  setToastMessage({ text: 'Error updating AI Config: ' + error.message, type: 'error' });
                } else {
                  setToastMessage({ text: 'AI Command Center Updated!', type: 'success' });
                }
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="block text-xs font-bold text-slate-400">AI Agent Name
                    <input name="ai_name" required defaultValue="Elite AI Mentor" className="mt-1 block w-full rounded-xl bg-slate-800 border-none px-4 py-3 text-white" />
                  </label>
                  <label className="block text-xs font-bold text-slate-400">Model Tier
                    <select name="model_tier" className="mt-1 block w-full rounded-xl bg-slate-800 border-none px-4 py-3 text-white">
                      <option value="gemini-2.5-flash">Gemini 1.5 Pro</option>
                      <option value="gemini-2.5-flash">Gemini 1.5 Flash</option>
                    </select>
                  </label>
                </div>
                <label className="block text-xs font-bold text-slate-400">AI Greeting Message
                  <input name="ai_greeting" required defaultValue="Hello! I am your AI Mentor. How can I help you today?" className="mt-1 block w-full rounded-xl bg-slate-800 border-none px-4 py-3 text-white" />
                </label>
                <label className="block text-xs font-bold text-slate-400">System Prompt (Strict Boundaries & Persona)
                  <textarea name="system_prompt" required rows={6} defaultValue="You are an elite educational AI mentor. Provide concise, helpful answers." className="mt-1 block w-full rounded-xl bg-slate-800 border-none px-4 py-3 text-white" />
                </label>
                <button type="submit" disabled={actionLoading} className="w-full bg-emerald-500 text-black py-3 rounded-xl font-bold uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:bg-emerald-400">Update AI Agent</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'ai_ingest' && (
`;

admin = admin.replace(endOfTabs, newTabsContent);

fs.writeFileSync('src/components/admin/AdminDashboard.tsx', admin);
console.log('Injected CMS and AI into AdminDashboard');
