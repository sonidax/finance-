import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, X } from "lucide-react";

interface Props {
  children: ReactNode;
  onClose?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class IPOErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("IPO Application Modal Error Caught:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onClose) this.props.onClose();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 sm:p-8 text-center space-y-5 bg-white dark:bg-card text-foreground rounded-2xl shadow-xl max-w-md mx-auto border border-border relative">
          {this.props.onClose && (
            <button
              onClick={this.props.onClose}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="h-14 w-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold text-foreground">
              Unable to Load IPO Application
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              We encountered an issue loading this IPO details. Please refresh or try again.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-5 h-11 rounded-xl bg-[#163A7D] hover:bg-[#1e4ca5] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
