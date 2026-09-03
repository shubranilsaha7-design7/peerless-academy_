import React from 'react';
import { Wallet, FileText, Download, TrendingUp } from 'lucide-react';

export default function FinancialAuditVault() {
  const transactions = [
    { id: 'TXN-001', student: 'Rohan Sharma', class: 'Class 11', amount: ',11,800', date: '2026-09-02', status: 'Verified' },
    { id: 'TXN-002', student: 'Aditi Das', class: 'Class 9', amount: ',11,200', date: '2026-09-01', status: 'Verified' },
    { id: 'TXN-003', student: 'Karan Patel', class: 'Class 12', amount: ',11,800', date: '2026-08-30', status: 'Pending Verification' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Wallet className="text-amber-400" size={28} />
          <h2 className="text-3xl font-black text-white">Financial Audit Vault</h2>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition font-bold text-sm">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Revenue (MTD)</div>
          <div className="text-4xl font-black text-white">,3,45,600</div>
          <div className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1"><TrendingUp size={14} /> +14% vs last month</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Pending Verifications</div>
          <div className="text-4xl font-black text-white">12</div>
          <div className="text-amber-400 text-xs font-bold mt-2">Requires manual approval</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Active Scholarships</div>
          <div className="text-4xl font-black text-white">45</div>
          <div className="text-slate-400 text-xs font-bold mt-2">,85,000 dispersed</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white">Recent UPI Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50">
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Student</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {transactions.map((t, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 text-slate-300 font-mono text-xs">{t.id}</td>
                  <td className="p-4 text-white font-bold">{t.student} <span className="text-slate-500 font-normal text-xs ml-2">{t.class}</span></td>
                  <td className="p-4 text-emerald-400 font-bold">{t.amount}</td>
                  <td className="p-4 text-slate-400">{t.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${t.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-slate-400 hover:text-white transition flex items-center gap-1 text-xs font-bold">
                      <FileText size={14} /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
