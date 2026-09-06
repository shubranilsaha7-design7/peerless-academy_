const fs = require('fs');

let aid = fs.readFileSync('src/components/AIDoubtSolver.tsx', 'utf-8');
aid = aid.replace(/supabase\.from\('platform_settings'\)/g, "(supabase as any).from('platform_settings')");
fs.writeFileSync('src/components/AIDoubtSolver.tsx', aid);

let adv = fs.readFileSync('src/components/Content/AdvancedVideoPlayer.tsx', 'utf-8');
adv = adv.replace(/supabase\s*\.from\('course_modules'\)/g, "(supabase as any).from('course_modules')");
fs.writeFileSync('src/components/Content/AdvancedVideoPlayer.tsx', adv);

let admin = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf-8');
admin = admin.replace(/supabase\.from\('course_modules'\)/g, "(supabase as any).from('course_modules')");
admin = admin.replace(/supabase\.from\('platform_settings'\)/g, "(supabase as any).from('platform_settings')");
fs.writeFileSync('src/components/admin/AdminDashboard.tsx', admin);

console.log('Fixed Type errors by casting supabase as any for new tables');
