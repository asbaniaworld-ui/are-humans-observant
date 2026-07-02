import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary.tsx';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <StrictMode>
    <AppErrorBoundary>
      <Suspense
        fallback={
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#faf6eb',
              color: '#1a1a1a',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            正在加载认知校准程序…
          </div>
        }
      >
        <App />
      </Suspense>
    </AppErrorBoundary>
  </StrictMode>,
);
