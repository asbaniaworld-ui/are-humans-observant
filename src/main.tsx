import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary.tsx';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
