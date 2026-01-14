import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import './index.css'
import App from './App.jsx'

// Global error handlers to capture unexpected failures and unhandled promise rejections
// This will log richer diagnostics to the console to help trace minified bundle errors.
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    try {
      // log common shapes (payload, response, message)
      if (event.reason && typeof event.reason === 'object') {
        console.error('Reason keys:', Object.keys(event.reason));
        if ('payload' in event.reason) console.error('Reason.payload:', event.reason.payload);
        if (event.reason.response) console.error('Reason.response:', event.reason.response);
        if (event.reason.message) console.error('Reason.message:', event.reason.message);
      }
    } catch (e) {
      console.error('Failed to inspect rejection reason', e);
    }
  });

  window.addEventListener('error', (event) => {
    console.error('Uncaught Error:', event.error || event.message, event.filename, event.lineno, event.colno);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
