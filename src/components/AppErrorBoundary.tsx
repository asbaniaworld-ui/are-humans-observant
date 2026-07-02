import React, { Component } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare readonly props: Readonly<ErrorBoundaryProps>;
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[402-B] render error', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            margin: 0,
            padding: '2rem',
            background: '#faf6eb',
            color: '#1a1a1a',
            fontFamily: 'system-ui, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              maxWidth: '28rem',
              border: '3px solid #1a1a1a',
              padding: '1.5rem',
              boxShadow: '6px 6px 0 #d94141',
            }}
          >
            <p style={{ fontWeight: 700, color: '#d94141', marginTop: 0 }}>校准程序加载中断</p>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              页面资源未能完整加载。请刷新重试，或使用本地模式运行：
            </p>
            <code style={{ display: 'block', fontSize: '0.75rem', marginTop: '0.75rem' }}>
              npm install && npm run dev
            </code>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                border: '2px solid #1a1a1a',
                background: '#1a1a1a',
                color: '#faf6eb',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              重新加载
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
