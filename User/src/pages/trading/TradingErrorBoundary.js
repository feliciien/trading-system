import React from 'react';

class TradingErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Trading page error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{padding: 20, color: 'red'}}>
                    <h2>Something went wrong loading the trading page.</h2>
                    <pre>{this.state.error?.toString()}</pre>
                    <button onClick={() => window.location.reload()}>
                        Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default TradingErrorBoundary;