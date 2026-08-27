import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  ChevronDown, LogOut, Menu, Moon, Phone,
  Sun, Swords, Zap, Flame, X, Shield
} from 'lucide-react';

const logoImage = '/images/WhatsApp_Image_2026-08-17_at_21.04.26.jpeg';

const NAV_ITEMS = [
  { label: 'Home',      href: '#home'      },
  { label: 'Programs',  href: '#programs'  },
  { label: 'The Arena', href: '#arena'     },
  { label: 'Faculty',   href: '#faculty'   },
  { label: 'Contact',   href: '#contact'   },
  { label: 'Practice',  href: '#practice'  },
  { label: 'Resources', href: '#resources' },
];

interface NavbarProps {
  user:            User | null;
  xp:              number;
  streak:          number;
  level:           number;
  isDark:          boolean;
  onToggleTheme:   () => void;
  onSignIn:        () => void;
  onSignOut:       () => void;
  onEnterArena:    () => void;
  onOpenLeaderboard: () => void;
  onOpenAdmin?:     () => void;
}

function getDisplayName(user: User): string {
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name      ||
    user.email?.split('@')[0]     ||
    user.phone                    ||
    'Student'
  );
}

function levelLabel(lvl: number) {
  if (lvl < 5)  return 'Novice';
  if (lvl < 10) return 'Scholar';
  if (lvl < 20) return 'Expert';
  return 'Legend';
}

export default function Navbar({
  user, xp, streak, level, isDark,
  onToggleTheme, onSignIn, onSignOut, onEnterArena, onOpenLeaderboard, onOpenAdmin
}: NavbarProps) {
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const displayName = user ? getDisplayName(user) : null;
  const avatarUrl   = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const isAdmin     = user?.email === 'admin@peerlessacademy.com' || user?.email === 'shubranilsaha7@gmail.com' || user?.email === 'xprasenjit1992@gmail.com';

  return (
    <div className="fixed inset-x-0 top-0 z-[60]">
      {/* Marquee-style ticker */}
      <div className="overflow-hidden bg-orange-600 py-1.5">
        <div className="animate-marquee whitespace-nowrap text-[10px] font-black uppercase tracking-[.18em] text-white">
          {'⚡ 2026–27 Admissions Open · Science & Math · Classes 5–12 · CBSE ICSE JEE NEET · Agartala · '.repeat(5)}
        </div>
      </div>

      <header
        className={`border-b transition-colors duration-300
          ${isDark
            ? 'border-cyan-500/10 bg-slate-950/90 backdrop-blur-xl'
            : 'border-slate-200 bg-white/90 backdrop-blur-xl'}`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">

          {/* ── Logo ── */}
          <a href="#home" className="flex items-center gap-3" aria-label="Peerless Academy home">
            <div className="logo-frame h-11 w-11 overflow-hidden rounded-xl bg-white shadow-md">
              <img src={logoImage} alt="Peerless Academy" className="h-full w-full object-cover" />
            </div>
            <div className="hidden leading-none sm:block">
              <span className={`block text-[15px] font-black tracking-[0.16em] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                PEERLESS
              </span>
              <span className="mt-1 block text-[9px] font-semibold tracking-[0.35em] text-orange-500">ACADEMY</span>
            </div>
          </a>

          {/* ── Desktop Nav ── */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_ITEMS.map(item => (
              <a
                key={item.label}
                href={item.href}
                className={`text-[13px] font-semibold transition hover:text-orange-500
                  ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* ── Right cluster ── */}
          <div className="flex items-center gap-2">

            {/* XP + Streak badge (when logged in) */}
            {user && (
              <button 
                onClick={onOpenLeaderboard}
                title="View Global Leaderboard"
                className={`hidden sm:flex items-center gap-3 rounded-full border px-3 py-1.5 text-xs font-black transition hover:scale-105 hover:shadow-lg
                ${isDark ? 'border-slate-700 bg-slate-800 hover:border-yellow-500/50' : 'border-slate-200 bg-slate-50 hover:border-yellow-500/50'}`}
              >
                {/* XP */}
                <span className="flex items-center gap-1 text-amber-400">
                  <Zap size={12} />
                  {xp} XP
                </span>
                <span className={`h-3 w-px ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
                {/* Streak */}
                <span className="flex items-center gap-1 text-orange-400">
                  <Flame size={12} />
                  {streak}🔥
                </span>
                <span className={`h-3 w-px ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
                {/* Level */}
                <span className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  Lv.{level} {levelLabel(level)}
                </span>
                {/* Online dot */}
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" title="Online" />
              </button>
            )}

            {/* Enter Arena */}
            <button
              onClick={onEnterArena}
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600
                         px-4 py-2 text-xs font-black text-white shadow-[0_0_20px_rgba(6,182,212,.3)]
                         transition hover:shadow-[0_0_30px_rgba(6,182,212,.5)] hover:-translate-y-0.5 sm:flex"
            >
              <Swords size={13} /> Enter Arena
            </button>

            {/* Call */}
            <a
              href="tel:+918794130855"
              className="hidden items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-xs
                         font-black tracking-wide text-white shadow-[0_8px_24px_rgba(255,107,0,.2)]
                         transition hover:-translate-y-0.5 hover:bg-orange-600 lg:flex"
            >
              <Phone size={13} /> Call Now
            </a>

            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className={`rounded-lg p-2 transition
                ${isDark
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-yellow-400'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin Console Direct Button */}
            {isAdmin && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden xl:flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/15 px-3 py-1.5 text-xs font-black text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] transition hover:bg-indigo-500 hover:text-white"
                title="Open Admin Control Center"
              >
                <Shield size={13} className="text-indigo-400" /> Admin
              </button>
            )}

            {/* Auth section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(o => !o)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold transition
                    ${isDark
                      ? 'border-orange-500/40 bg-orange-500/10 text-orange-200 hover:border-orange-500 hover:bg-orange-500/20'
                      : 'border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100'}`}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName!} className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-white">
                      {(displayName || 'S')[0].toUpperCase()}
                    </span>
                  )}
                  <span className="hidden sm:inline max-w-[90px] truncate">{displayName}</span>
                  <ChevronDown size={13} />
                </button>

                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
                    <div className={`absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border p-2 shadow-xl
                      ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}
                    >
                      <div className={`border-b px-3 py-2 mb-1 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                        <p className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayName}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email || user.phone}</p>
                        <div className="mt-2 flex items-center gap-3 text-[10px] font-bold">
                          <span className="text-amber-400">⚡ {xp} XP</span>
                          <span className="text-orange-400">🔥 {streak} streak</span>
                        </div>
                      </div>

                      {isAdmin && onOpenAdmin && (
                        <button
                          onClick={() => { onOpenAdmin(); setProfileMenuOpen(false); }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-indigo-400 hover:bg-indigo-500/10 transition mb-1"
                        >
                          <Shield size={14} /> Admin Control Center
                        </button>
                      )}

                      <button
                        onClick={() => { onSignOut(); setProfileMenuOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className={`rounded-full border-2 border-orange-600 px-5 py-2 text-sm font-bold transition
                  ${isDark
                    ? 'text-orange-400 hover:bg-orange-600 hover:text-white'
                    : 'text-orange-600 hover:bg-orange-600 hover:text-white'}`}
              >
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className={`rounded-lg p-2 lg:hidden ${isDark ? 'text-white' : 'text-slate-800'}`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={`border-t px-5 py-5 lg:hidden ${isDark ? 'border-white/10 bg-slate-950' : 'border-slate-100 bg-white'}`}>
            <div className="mx-auto flex max-w-[1240px] flex-col gap-1">
              {NAV_ITEMS.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-semibold
                    ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => { onEnterArena(); setMenuOpen(false); }}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-3 text-sm font-bold text-white"
              >
                <Swords size={15} /> Enter Arena
              </button>
              <a href="tel:+918794130855" className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-bold text-white">
                Call: +91 87941 30855
              </a>
              {isAdmin && onOpenAdmin && (
                <button
                  onClick={() => { onOpenAdmin(); setMenuOpen(false); }}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/15 px-4 py-3 text-sm font-bold text-indigo-300"
                >
                  <Shield size={15} /> Admin Control Center
                </button>
              )}
              {user ? (
                <button
                  onClick={() => { onSignOut(); setMenuOpen(false); }}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-red-500/40 px-4 py-3 text-sm font-bold text-red-400"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { onSignIn(); setMenuOpen(false); }}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-orange-600 px-4 py-3 text-sm font-bold text-orange-400"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
