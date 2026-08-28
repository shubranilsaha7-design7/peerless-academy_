import { Home, Swords, PlaySquare, BrainCircuit, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomTabBarProps {
  activeRoute: string;
  setActiveRoute: (route: string) => void;
  openAiDoubt: () => void;
}

export default function BottomTabBar({ activeRoute, setActiveRoute, openAiDoubt }: BottomTabBarProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, route: 'home' },
    { id: 'arena', label: 'Arena', icon: Swords, route: 'cbt' },
    { id: 'batches', label: 'Batches', icon: PlaySquare, route: 'video' },
    { id: 'ask_ai', label: 'Ask AI', icon: BrainCircuit, action: openAiDoubt },
    { id: 'profile', label: 'Profile', icon: User, route: 'profile' },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around px-2 py-3">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = tab.route ? activeRoute === tab.route : false;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.action) tab.action();
                else if (tab.route) setActiveRoute(tab.route);
              }}
              className={`relative flex flex-col items-center justify-center w-16 gap-1 transition-colors ${isActive ? 'text-coral' : 'text-slate-500 hover:text-white'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavBubble"
                  className="absolute inset-0 bg-coral/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={22} className="relative z-10" />
              <span className="text-[10px] font-bold tracking-wider relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
