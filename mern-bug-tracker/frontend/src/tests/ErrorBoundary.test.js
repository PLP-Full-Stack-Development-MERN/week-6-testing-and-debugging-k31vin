import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

// Create a component that throws an error
const BuggyComponent = () => {
throw new Error('Test error');
return <div>This should not render</div>;
};

const originalConsoleError = console.error;
beforeAll(() => {
console.error = jest.fn();
});
afterAll(() => {
console.error = originalConsoleError;
});

describe('ErrorBoundary Component', () => {
test('renders children when there is no error', () => {
    render(
    <ErrorBoundary>
        <div>Normal Component</div>
    </ErrorBoundary>
    );
    
    expect(screen.getByText('Normal Component')).toBeInTheDocument();
});

test('renders error UI when child throws an error', () => {
    render(
    <ErrorBoundary>
        <BuggyComponent />
    </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/An error occurred in this component/)).toBeInTheDocument();
});

test('resets error state when reset button is clicked', () => {
    // Save the original React error behavior
    const originalError = console.error;
    console.error = jest.fn();
    
    const { rerender } = render(
    <ErrorBoundary>
        <BuggyComponent />
    </ErrorBoundary>
    );
    
    // Verify error UI is shown
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Click reset button
    fireEvent.click(screen.getByText('Reset'));
    
    // Rerender with a non-buggy component after reset
    rerender(
    <ErrorBoundary>
        <div>Normal Component</div>
    </ErrorBoundary>
    );
    
    // Verify normal content is now shown
    expect(screen.getByText('Normal Component')).toBeInTheDocument();
    
    // Restore console.error
    console.error = originalError;
});
});