import React from 'react';
import { motion } from 'framer-motion';
import { Home, Brain, Trophy, LayoutDashboard, User } from 'lucide-react';
import { Haptics } from '@/lib/haptics';

interface TabItem {
  id: string;
  label: string;
  icon: React.FC<any>;
}

const TABS: TabItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'cbt', label: 'CBT Simulator', icon: LayoutDashboard },
  { id: 'arena', label: 'The Arena', icon: Trophy },
  { id: 'tutor', label: 'AI Tutor', icon: Brain },
];

interface BottomTabBarProps {
  activeRoute: string;
  onTabChange: (tabId: string) => void;
  openAITutor: () => void;
}

export default function BottomTabBar({ activeRoute, onTabChange, openAITutor }: BottomTabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-pb bg-black/70 backdrop-blur-xl border-t border-white/10 select-none touch-none">
      <div className="flex h-[72px] items-center justify-around px-2">
        {TABS.map((tab) => {
          const isActive = tab.id === 'tutor' ? false : activeRoute === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                Haptics.trigger('light');
                if (tab.id === 'tutor') {
                  openAITutor();
                } else if (tab.id === 'arena') {
                  onTabChange('home'); // or open arena modal if handled in App
                  setTimeout(() => window.dispatchEvent(new CustomEvent('open-arena-modal')), 50);
                } else {
                  onTabChange(tab.id);
                }
              }}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 h-full pt-1"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 z-0 bg-gradient-to-t from-coral/20 to-transparent"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-coral shadow-[0_0_12px_#ff6b00]" />
                </motion.div>
              )}
              
              <div className="relative z-10">
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-300 ${isActive ? 'text-coral' : 'text-slate-500'}`} 
                />
              </div>
              <span 
                className={`relative z-10 text-[10px] font-semibold tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
