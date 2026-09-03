const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('OnboardingModal')) {
  code = code.replace(
    /import BottomTabBar from '@\/components\/layout\/BottomTabBar';/,
    "import BottomTabBar from '@/components/layout/BottomTabBar';\nimport OnboardingModal from '@/components/layout/OnboardingModal';"
  );

  // Add state for isOnboarded
  code = code.replace(
    /const \[isDoubtOpen, setIsDoubtOpen\] = useState\(false\);/,
    "const [isDoubtOpen, setIsDoubtOpen] = useState(false);\n  const [isOnboarded, setIsOnboarded] = useState(true);"
  );
  
  // Add useEffect to check onboarding status
  code = code.replace(
    /useEffect\(\(\) => \{\n\s*supabase\.auth\.getSession\(\)/,
    "useEffect(() => {\n    const checkOnboarding = () => {\n      const onboarded = localStorage.getItem('isOnboarded');\n      if (!onboarded) { setIsOnboarded(false); }\n    };\n    checkOnboarding();\n\n    supabase.auth.getSession()"
  );

  // Inject into return block (before BottomTabBar)
  code = code.replace(
    /<BottomTabBar/,
    "{!isOnboarded && user && <OnboardingModal onComplete={() => setIsOnboarded(true)} />}\n      <BottomTabBar"
  );
}

fs.writeFileSync('src/App.tsx', code);
