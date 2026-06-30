import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl">⚠</span>
          </div>
          <h1 className="mb-2 text-xl font-bold text-slate-900">Algo sali\u00f3 mal</h1>
          <p className="mb-6 max-w-md text-sm text-slate-500">
            Ocurri\u00f3 un error inesperado. Por favor, recarga la p\u00e1gina e intenta de nuevo.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Recargar p\u00e1gina
          </button>
          <details className="mt-6 max-w-lg text-left">
            <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600">
              Detalles t\u00e9cnicos
            </summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-600">
              {this.state.error?.message}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
