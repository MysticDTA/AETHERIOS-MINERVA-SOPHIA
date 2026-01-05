
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  // Optional callback to report errors to a parent component or logging system
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary - Captures runtime fractures in the UI lattice.
 * Ensures system composure even during component-level decoherence.
 */
// Fix: Use React.Component to ensure props and state are correctly typed
export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Fix: Use the inherited this.props to access component properties.
    // Pass error details to the provided callback for robust logging
    this.props.onError?.(error, errorInfo);
    console.error("Uncaught error captured by Boundary:", error, errorInfo);
  }

  public render() {
    // Fix: Access state through the inherited this.state property.
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 border-2 border-red-700/50 p-8 rounded-lg text-center backdrop-blur-xl">
            <h1 className="font-orbitron text-2xl text-red-500 font-bold text-glow-red uppercase tracking-tighter">
                Component Decoherence
            </h1>
            <p className="mt-4 text-slate-300 font-minerva italic">
                A critical fracture has occurred in the UI lattice. The error has been logged to the system registry.
            </p>
            <p className="mt-2 text-slate-500 text-[10px] font-mono uppercase tracking-widest">
                CAUSAL_ERROR: COMPONENT_RENDER_FAILURE
            </p>
             <button
                // Fix: Access setState through the base Component class.
                onClick={() => this.setState({ hasError: false })}
                className="mt-8 px-8 py-3 rounded-sm bg-rose-600/20 border border-rose-500/50 text-rose-300 font-orbitron font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-95"
            >
                Attempt Core Restoration
            </button>
        </div>
      );
    }

    // Fix: Correctly access children from the inherited this.props object.
    return this.props.children;
  }
}
