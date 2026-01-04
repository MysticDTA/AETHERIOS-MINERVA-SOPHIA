
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  // Fix: Making children optional helps resolve cases where TypeScript doesn't automatically detect children in JSX tags
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

// Fix: Explicitly extending React.Component to ensure state, props, and setState are correctly inherited and recognized by the compiler
export class ErrorBoundary extends React.Component<Props, State> {
  // Fix: Define state as a public class property to ensure 'state' property existence is known to the type system
  public state: State = {
    hasError: false,
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    // Fix: Accessing state inherited from React.Component
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 border-2 border-red-700/50 p-8 rounded-lg text-center">
            <h1 className="font-orbitron text-2xl text-red-500 font-bold text-glow-red">
                Component Failure
            </h1>
            <p className="mt-2 text-slate-300">
                A critical error occurred in a user interface component.
            </p>
            <p className="text-slate-400 text-sm">
                The system may be unstable. A page refresh is recommended.
            </p>
             <button
                // Fix: Accessing setState inherited from React.Component
                onClick={() => this.setState({ hasError: false })}
                className="mt-4 px-4 py-2 rounded-md bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-sm transition-colors"
            >
                Attempt to Recover
            </button>
        </div>
      );
    }

    // Fix: Accessing props inherited from React.Component
    return this.props.children;
  }
}
