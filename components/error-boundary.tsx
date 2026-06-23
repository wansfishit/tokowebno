"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 my-4 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold mb-2">Terjadi kesalahan saat memuat komponen ini</h3>
          <p className="text-sm mb-4">{this.state.error?.toString()}</p>
          <pre className="text-xs p-4 bg-red-100/50 rounded-xl overflow-x-auto max-h-48 whitespace-pre-wrap">
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
