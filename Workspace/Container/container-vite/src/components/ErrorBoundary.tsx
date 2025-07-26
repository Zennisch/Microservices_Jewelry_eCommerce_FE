import React, {ErrorInfo, ReactNode} from 'react';

// Define interfaces for props and state
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false, error: null};
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {hasError: true, error};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error caught by error boundary:', error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6 text-center">
                    <div className="text-red-600 text-5xl mb-4">
                        <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <h2 className="text-xl font-medium text-red-700 mb-2">Đã xảy ra lỗi</h2>
                    <p className="text-red-600 mb-4">Không thể tải module. Vui lòng thử lại sau.</p>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Tải lại trang
                    </button>
                    {this.props.fallback}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;