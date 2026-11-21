'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);

    // Si es un error de carga de chunk desfasado tras una nueva compilación
    if (error?.name === 'ChunkLoadError' || error?.message?.includes('Loading chunk')) {
      if (typeof window !== 'undefined') {
        const key = 'chunk_reload_attempt';
        const attempts = parseInt(sessionStorage.getItem(key) || '0', 10);
        if (attempts < 2) {
          sessionStorage.setItem(key, String(attempts + 1));
          window.location.reload();
        }
      }
    }
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('chunk_reload_attempt');
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-superficie border border-borde rounded-2xl text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-alerta-suave flex items-center justify-center text-alerta mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold font-marca text-marca-oscuro mb-2">
            No se pudo cargar el mapa
          </h3>
          <p className="text-texto-secundario max-w-md mb-6 leading-relaxed">
            Hubo un desfase temporal con los archivos en caché. Por favor recarga la página para sincronizar con la versión actual.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex min-h-[50px] items-center gap-2 rounded-xl bg-marca-oscuro px-6 text-lg font-bold text-white btn-bounce hover:bg-marca-oscuro-hover"
          >
            <RotateCw className="w-5 h-5" />
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
