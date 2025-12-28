import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to error reporting service
    // logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFFE3] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#CBCBCB] rounded-[14px] p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            
            <h1 className="text-2xl font-[640] text-[#4A4A4A] mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-[#6D8196] mb-6">
              We're sorry for the inconvenience. The page encountered an error.
            </p>

            {(typeof window !== 'undefined' ? window.location.hostname === 'localhost' : false) && this.state.error && (
              <div className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-[560] text-[#4A4A4A] mb-2">
                  Error Details:
                </p>
                <pre className="text-xs text-[#6D8196] overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-[#6D8196] text-[#FFFFE3] font-[600] rounded-[10px] hover:bg-[#5A6B7F] transition-colors"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/app/dashboard'}
                className="flex items-center gap-2 px-6 py-3 bg-transparent border border-[#6D8196] text-[#6D8196] font-[600] rounded-[10px] hover:bg-[#6D8196] hover:bg-opacity-10 transition-colors"
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;