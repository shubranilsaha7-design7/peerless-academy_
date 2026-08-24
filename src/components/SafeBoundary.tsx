import React from 'react';

type Props = { children: React.ReactNode; label?: string };
type State = { failed: boolean };

/** Keeps a heavy/WebGL section from taking down the whole page. */
export default class SafeBoundary extends React.Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[SafeBoundary]', this.props.label, error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 border-y border-white/10 bg-slate-950 px-6 py-16 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">
            {this.props.label ?? 'This module'} could not load
          </p>
          <p className="text-xs text-slate-500">Your browser may not support WebGL. Everything else works normally.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
