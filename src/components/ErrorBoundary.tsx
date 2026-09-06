import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
          <div className="mb-4 rounded-full bg-red-500/20 p-4 text-red-500">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-black">Oops, something went wrong.</h1>
          <p className="mb-6 max-w-2xl text-sm text-slate-400">
            A rendering error occurred in this section of the app.
            <br/><br/>
            <code className="block text-left bg-black text-red-400 p-4 overflow-auto max-h-64 rounded whitespace-pre-wrap text-xs">
              {this.state.error?.message}
              <br/><br/>
              {this.state.error?.stack}
            </code>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-amber-400"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
