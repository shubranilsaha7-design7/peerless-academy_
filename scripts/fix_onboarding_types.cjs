const fs = require('fs');
let code = fs.readFileSync('src/components/layout/OnboardingModal.tsx', 'utf8');
code = code.replace(/supabase\.from\('user_profiles'\)/g, "(supabase as any).from('user_profiles')");
fs.writeFileSync('src/components/layout/OnboardingModal.tsx', code);
