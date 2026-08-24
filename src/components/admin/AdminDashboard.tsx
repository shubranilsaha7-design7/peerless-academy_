import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Search, Mail, Phone, Calendar, RefreshCcw } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface AdminDashboardProps {
  user: User;
  onBack: () => void;
}

interface Inquiry {
  id: string;
  student_name: string;
  guardian_name: string;
  phone: string;
  class_level: string;
  message: string | null;
  created_at: string;
}

export default function AdminDashboard({ user, onBack }: AdminDashboardProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // A simple hardcoded check. In production, check RLS or user_metadata.roles
  const isAdmin = user.email === 'admin@peerlessacademy.com' || user.email === 'shubranilsaha7@gmail.com' || user.email === 'xprasenjit1992@gmail.com';

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching inquiries:', error);
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchInquiries();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <h2 className="text-2xl font-bold text-rose-500 mb-4">Access Denied</h2>
        <p className="text-slate-400 mb-6">You do not have administrator privileges to view this page.</p>
        <button onClick={onBack} className="rounded-xl bg-slate-800 px-6 py-3 font-bold hover:bg-slate-700">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const filteredInquiries = inquiries.filter(inq => 
    inq.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.phone?.includes(searchTerm) ||
    inq.class_level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-slate-950/80 p-4 backdrop-blur-md lg:px-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center justify-center rounded-full bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Admin Enquiries Dashboard</h1>
        </div>
        <button onClick={fetchInquiries} className="flex items-center gap-2 rounded-lg bg-coral/10 px-4 py-2 text-sm font-bold text-coral transition hover:bg-coral/20">
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </header>

      <main className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by student, phone, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral"
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
            Total Enquiries: <span className="rounded-lg bg-white/10 px-2.5 py-1 text-white">{filteredInquiries.length}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-slate-800/50 uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-bold">Student</th>
                  <th className="px-6 py-4 font-bold">Guardian</th>
                  <th className="px-6 py-4 font-bold">Contact</th>
                  <th className="px-6 py-4 font-bold">Class</th>
                  <th className="px-6 py-4 font-bold">Message</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && inquiries.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading enquiries...</td></tr>
                ) : filteredInquiries.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No enquiries found.</td></tr>
                ) : (
                  filteredInquiries.map((inq) => (
                    <tr key={inq.id} className="transition hover:bg-white/[0.02]">
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-white">{inq.student_name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-400">{inq.guardian_name}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <a href={`tel:${inq.phone}`} className="flex items-center gap-1.5 text-coral hover:underline">
                            <Phone size={12} /> {inq.phone}
                          </a>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                          Class {inq.class_level}
                        </span>
                      </td>
                      <td className="max-w-xs px-6 py-4 text-slate-400 truncate" title={inq.message || 'No message provided'}>
                        {inq.message || <span className="italic opacity-50">None</span>}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-500 flex items-center gap-1.5">
                        <Calendar size={14} /> {new Date(inq.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
