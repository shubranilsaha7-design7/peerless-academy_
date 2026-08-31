import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, UserMinus, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';

export default function RBACPanel() {
  const { userEmail } = useAdmin();
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputEmail, setInputEmail] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('platform_settings')
      .select('system_prompt')
      .eq('id', 'ADMIN_EMAILS')
      .single();
      
    if (!error && data) {
      try {
        setEmails(JSON.parse(data.system_prompt || '[]'));
      } catch (e) {
        setEmails([]);
      }
    }
    setLoading(false);
  };

  const handleAction = async (action: 'grant' | 'revoke') => {
    if (!inputEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (action === 'revoke' && inputEmail === userEmail) {
      setMessage({ type: 'error', text: 'You cannot revoke your own admin privileges.' });
      return;
    }

    setActionLoading(true);
    setMessage(null);

    let newEmails = [...emails];
    if (action === 'grant') {
      if (newEmails.includes(inputEmail)) {
        setMessage({ type: 'error', text: 'Email is already an administrator.' });
        setActionLoading(false);
        return;
      }
      newEmails.push(inputEmail);
    } else {
      if (!newEmails.includes(inputEmail)) {
        setMessage({ type: 'error', text: 'Email is not an administrator.' });
        setActionLoading(false);
        return;
      }
      newEmails = newEmails.filter(e => e !== inputEmail);
    }

    const { error } = await supabase
      .from('platform_settings')
      .update({ system_prompt: JSON.stringify(newEmails) })
      .eq('id', 'ADMIN_EMAILS');

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setEmails(newEmails);
      setMessage({ type: 'success', text: `Successfully ${action === 'grant' ? 'granted' : 'revoked'} admin privileges for ${inputEmail}.` });
      setInputEmail('');
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Shield size={24} className="text-rose-500" /> Access Control (RBAC)
        </h2>
        <p className="text-xs text-slate-400">
          Securely assign or revoke super-admin privileges for the entire Peerless Academy infrastructure.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl space-y-6 h-fit">
          <h3 className="text-lg font-black text-white border-b border-white/10 pb-4">Manage Permissions</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">User Email Address</label>
              <input
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="e.g. shubranilsaha7@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition placeholder:text-slate-700"
              />
            </div>
            
            {message && (
              <div className={`p-3 rounded-xl text-xs font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {message.text}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => handleAction('grant')}
                disabled={actionLoading || !inputEmail}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 py-3 rounded-xl font-bold transition disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                Grant Admin
              </button>
              
              <button
                onClick={() => handleAction('revoke')}
                disabled={actionLoading || !inputEmail}
                className="flex-1 flex items-center justify-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 py-3 rounded-xl font-bold transition disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <UserMinus size={16} />}
                Revoke Admin
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">
          <h3 className="text-lg font-black text-white border-b border-white/10 pb-4 mb-4">Authorized Administrators</h3>
          
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-500" /></div>
          ) : (
            <div className="space-y-2">
              {emails.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No external admins authorized.</p>
              ) : (
                emails.map(email => (
                  <div key={email} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-mono text-sm text-slate-300">{email}</span>
                    {email === userEmail && (
                      <span className="text-[10px] uppercase tracking-widest font-bold bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md">You</span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-500/80 leading-relaxed font-medium">
              Granting admin privileges gives the user unrestricted access to student telemetry, the AI ingestion engine, database master records, and the ability to modify these access controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
