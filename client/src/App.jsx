import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import AppRoutes from './routes/routeConfig';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toast />
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
