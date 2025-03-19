import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import BugForm from '../screens/BugForm';

// Mock axios
jest.mock('axios');
// Mock useParams to handle route params
jest.mock('react-router-dom', () => ({
...jest.requireActual('react-router-dom'),
useParams: () => ({ id: null }),
useHistory: () => ({ push: jest.fn() }),
}));
// Mock localStorage
const mockLocalStorage = {
getItem: jest.fn(() => JSON.stringify({ token: 'test-token' })),
};
Object.defineProperty(window, 'localStorage', {
value: mockLocalStorage
});

describe('BugForm Component', () => {
test('renders form elements correctly', () => {
    render(
    <BrowserRouter>
        <BugForm />
    </BrowserRouter>
    );
    
    expect(screen.getByText('Create New Bug')).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('status-select')).toBeInTheDocument();
    expect(screen.getByTestId('severity-select')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
});

test('validates form inputs correctly', async () => {
    render(
    <BrowserRouter>
        <BugForm />
    </BrowserRouter>
    );
    
    // Click submit without filling form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Wait for validation errors
    await waitFor(() => {
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
    
    // Enter short title
    fireEvent.change(screen.getByTestId('title-input'), {
    target: { value: 'AB' }
    });
    
    // Click submit again
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Wait for validation error about title length
    await waitFor(() => {
    expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
    });
});

test('submits form data correctly', async () => {
    axios.post.mockResolvedValue({ data: { _id: '123', title: 'Test Bug' } });
    
    render(
    <BrowserRouter>
        <BugForm />
    </BrowserRouter>
    );
    
    // Fill form with valid data
    fireEvent.change(screen.getByTestId('title-input'), {
    target: { value: 'Test Bug' }
    });
    
    fireEvent.change(screen.getByTestId('description-input'), {
    target: { value: 'This is a test bug description' }
    });
    
    fireEvent.change(screen.getByTestId('severity-select'), {
    target: { value: 'high' }
    });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Verify axios was called with correct data
    await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
        '/api/bugs',
        {
        title: 'Test Bug',
        description: 'This is a test bug description',
        status: 'open',
        severity: 'high'
        },
        expect.any(Object)
    );
    });
});
});