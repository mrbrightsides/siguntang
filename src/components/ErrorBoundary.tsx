import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] w-full p-8 flex flex-col items-center justify-center text-center bg-[#f5f2ed] text-[#1a1a1a] rounded-3xl border border-black/10 my-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#8b0000]/10 text-[#8b0000] flex items-center justify-center mb-4">
            <ShieldAlert size={32} />
          </div>
          <h3 className="font-serif text-2xl font-bold mb-2">
            {this.props.fallbackTitle || 'Terjadi Kendala Memuat Modul'}
          </h3>
          <p className="text-sm text-gray-600 max-w-md mb-6 leading-relaxed">
            Komponen ini sedang disegarkan atau memerlukan izin peramban. Seluruh modul lainnya dalam platform SIGUNTANG tetap berjalan normal.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-white border border-black/15 text-stone-800 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-stone-50 transition-colors"
            >
              Coba Lagi
            </button>
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 bg-[#8b0000] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#a00000] transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
