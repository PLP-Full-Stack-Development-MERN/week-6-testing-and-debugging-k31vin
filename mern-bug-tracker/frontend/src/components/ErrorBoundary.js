import React, { Component } from 'react';
import { Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends Component {
constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
}

static getDerivedStateFromError(error) {
    return { hasError: true };
}

componentDidCatch(error, errorInfo) {
    this.setState({
    error: error,
    errorInfo: errorInfo
    });
    console.error("Error caught by boundary:", error, errorInfo);
}

handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
};

render() {
    if (this.state.hasError) {
    return (
        <Alert variant="danger">
        <Alert.Heading>Something went wrong</Alert.Heading>
        <p>
            An error occurred in this component. Please try again or contact support if the problem persists.
        </p>
        {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div>
            <h6>Error details (development only):</h6>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
            </pre>
            </div>
        )}
        <Button variant="outline-danger" onClick={this.handleReset}>
            Reset
        </Button>
        </Alert>
    );
    }

    return this.props.children;
}
}

export default ErrorBoundary;