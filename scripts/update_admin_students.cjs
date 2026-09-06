const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

// 1. Add states for student filters
code = code.replace(
  /const \[searchStudent, setSearchStudent\] = useState\(''\);/,
  "const [searchStudent, setSearchStudent] = useState('');\n  const [studentFilterExam, setStudentFilterExam] = useState('all');\n  const [studentFilterClass, setStudentFilterClass] = useState('all');"
);

// 2. Modify fetch to query user_profiles
code = code.replace(
  /const \{ data: profs, error: profsErr \} = await \(supabase as any\)\s*\.from\('profiles'\)\s*\.select\('\*'\)\s*\.order\('xp', \{ ascending: false \}\);/,
  "const { data: profs, error: profsErr } = await (supabase as any).from('user_profiles').select('*').order('created_at', { ascending: false });"
);

// 3. Update filteredStudents
code = code.replace(
  /const filteredStudents = students\.filter\(s =>[\s\S]*?\);/m,
  `const filteredStudents = students.filter(s => {
    const matchesSearch = (s.full_name?.toLowerCase() || '').includes(searchStudent.toLowerCase()) || (s.id || '').includes(searchStudent);
    const matchesExam = studentFilterExam === 'all' || s.target_exam === studentFilterExam;
    const matchesClass = studentFilterClass === 'all' || s.class_level === studentFilterClass;
    return matchesSearch && matchesExam && matchesClass;
  });`
);

// 4. Update the Students Table rendering block
const tableStart = code.indexOf('{/* Students Table */}');
const tableEnd = code.indexOf('</div>', code.indexOf('</tbody>', tableStart)) + 6;

if (tableStart !== -1 && tableEnd !== -1) {
  const newTable = `{/* Students Table */}
            <div className="flex gap-2 mb-4">
              <select value={studentFilterExam} onChange={e => setStudentFilterExam(e.target.value)} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none">
                <option value="all">All Exams</option>
                <option value="NEET">NEET</option>
                <option value="JEE">JEE</option>
                <option value="Foundation">Foundation</option>
              </select>
              <select value={studentFilterClass} onChange={e => setStudentFilterClass(e.target.value)} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none">
                <option value="all">All Classes</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="Dropper">Dropper</option>
              </select>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-white/10 bg-slate-800/50 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-black">Name</th>
                    <th className="px-6 py-4 font-black">Target Exam</th>
                    <th className="px-6 py-4 font-black">Class</th>
                    <th className="px-6 py-4 font-black">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No students found.</td>
                    </tr>
                  ) : (
                    filteredStudents.map(s => (
                      <tr key={s.id} className="transition hover:bg-white/5">
                        <td className="whitespace-nowrap px-6 py-4 font-bold text-white">{s.full_name || 'Unknown'}</td>
                        <td className="whitespace-nowrap px-6 py-4 font-bold text-indigo-400">{s.target_exam || '-'}</td>
                        <td className="whitespace-nowrap px-6 py-4 font-bold text-emerald-400">{s.class_level || '-'}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-400">{s.state || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>`;
  code = code.substring(0, tableStart) + newTable + code.substring(tableEnd);
}

fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
