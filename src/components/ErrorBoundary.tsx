import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { Alert, Button, Box } from '@mui/material';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">
                        Something went wrong. Please refresh the page.
                        <Button onClick={() => window.location.reload()}>Refresh</Button>
                    </Alert>
                </Box>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;