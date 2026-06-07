import React from "react";
import { Icon } from "./ui/Icon";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  declare state: ErrorBoundaryState;
  declare props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#0D0D12] p-6">
          <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/10 via-[#0D0D12] to-transparent p-8 text-center">
            <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertCircle" size={28} className="text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">
              Something Went Wrong
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {this.state.error?.message ||
                "An unexpected error occurred. Please refresh the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-200 font-semibold text-sm transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
