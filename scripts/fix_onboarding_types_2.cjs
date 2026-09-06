const fs = require('fs');
let code = fs.readFileSync('src/components/layout/OnboardingModal.tsx', 'utf8');

code = code.replace(
  /const \{ error \} = await supabase/g,
  "const { error } = await (supabase as any)"
);

code = code.replace(
  /\.then\(\(\{ data \}\) => \{/,
  ".then(({ data }: { data: any }) => {"
);

fs.writeFileSync('src/components/layout/OnboardingModal.tsx', code);
