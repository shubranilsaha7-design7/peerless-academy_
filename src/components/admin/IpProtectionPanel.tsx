import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ShieldAlert, ShieldCheck, Lock, Globe } from 'lucide-react';

export default function IpProtectionPanel() {
  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === 'shubranil@peerlessacademy.in') {
      setIsSuperAdmin(true);
      fetchAccess();
    } else {
      setIsSuperAdmin(false);
      setLoading(false);
    }
  };

  const fetchAccess = async () => {
    try {
      const { data } = await (supabase as any).from('platform_settings').select('full_pyq_access').eq('id', 'GLOBAL').single();
      if (data) {
        setAccess(data.full_pyq_access);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccess = async () => {
    setLoading(true);
    const newVal = !access;
    try {
      await (supabase as any).from('platform_settings').update({ full_pyq_access: newVal }).eq('id', 'GLOBAL');
      setAccess(newVal);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white p-8 animate-pulse">Verifying Security Clearance...</div>;

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center border border-red-500/30 bg-red-500/10 rounded-3xl">
        <Lock size={64} className="text-red-500 mb-6" />
        <h2 className="text-3xl font-black text-white mb-2">ACCESS DENIED</h2>
        <p className="text-slate-400 max-w-md">This module is protected under Intellectual Property laws. Only the Lead Architect (shubranil@peerlessacademy.in) possesses clearance to modify the Global IP Master Switch.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
          <Globe size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Global IP Access</h2>
          <p className="text-sm text-slate-400 mt-1">Super Admin Exclusive Dashboard</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-indigo-500" />
        
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              PYQ Database Master Switch
            </h3>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              When disabled, standard users and students will only see a restricted sample (max 50 questions) of the 30,000+ PYQ databank. When enabled, the entire databank unlocks for all active platform users.
            </p>
          </div>

          <button
            onClick={toggleAccess}
            className={\`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 focus:outline-none \${access ? 'bg-emerald-500' : 'bg-slate-700'}\`}
          >
            <span className={\`inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out \${access ? 'translate-x-3' : '-translate-x-3'}\`} />
          </button>
        </div>

        <div className={\`mt-8 p-4 rounded-xl flex items-center gap-4 \${access ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-amber-500/10 border border-amber-500/30'}\`}>
          {access ? <ShieldCheck size={24} className="text-emerald-400 shrink-0" /> : <ShieldAlert size={24} className="text-amber-400 shrink-0" />}
          <div>
            <div className={\`font-bold \${access ? 'text-emerald-400' : 'text-amber-400'}\`}>
              {access ? 'DATABASE UNLOCKED GLOBALLY' : 'DATABASE SECURED (SAMPLE MODE)'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {access ? 'All users currently have unrestricted access to the entire proprietary PYQ databank.' : 'Intellectual property is protected. Only sample PYQs are being served to the frontend UI.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
