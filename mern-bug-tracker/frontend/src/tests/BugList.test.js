import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import BugList from '../screens/BugList';

// Mock axios
jest.mock('axios');
// Mock localStorage
const mockLocalStorage = {
getItem: jest.fn(() => JSON.stringify({ token: 'test-token' })),
};
Object.defineProperty(window, 'localStorage', {
value: mockLocalStorage
});
// Mock window.confirm
window.confirm = jest.fn();

describe('BugList Component', () => {
const mockBugs = [
    {
    _id: '1',
    title: 'Test Bug 1',
    description: 'Description 1',
    status: 'open',
    severity: 'high',
    reporter: { name: 'John Doe' },
    createdAt: '2023-01-01T00:00:00.000Z'
    },
    {
    _id: '2',
    title: 'Test Bug 2',
    description: 'Description 2',
    status: 'in-progress',
    severity: 'medium',
    reporter: { name: 'Jane Smith' },
    createdAt: '2023-01-02T00:00:00.000Z'
    }
];

test('displays loading spinner initially', () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    
    render(
    <BrowserRouter>
        <BugList />
    </BrowserRouter>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
});

test('renders bug list correctly after loading', async () => {
    axios.get.mockResolvedValueOnce({ data: mockBugs });
    
    render(
    <BrowserRouter>
        <BugList />
    </BrowserRouter>
    );
    
    // Wait for the bugs to load
    await waitFor(() => {
    expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    });
    
    // Check for correct status badges
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('in-progress')).toBeInTheDocument();
    
    // Check for correct severity badges
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    
    // Check for reporter names
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
});

test('displays empty message when no bugs available', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    
    render(
    <BrowserRouter>
        <BugList />
    </BrowserRouter>
    );
    
    // Wait for the bugs to load
    await waitFor(() => {
    expect(screen.getByText('No bugs found. Start by creating one!')).toBeInTheDocument();
    });
});

// Bug in BugList.js
const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        },
        };
        
        await axios.delete(`/api/bugs/${id}`, config);
        // Bug: Using filter incorrectly
        // eslint-disable-next-line no-undef
        setBugs(bug => bug.filter(bug => bug._id !== id));
    } catch (err) {
        // eslint-disable-next-line no-undef
        setError(err.response?.data?.message || 'Failed to delete bug');
    }
    }
};

test('handles bug deletion correctly', async () => {
    // Setup mocks
    axios.get.mockResolvedValueOnce({ data: mockBugs });
    axios.delete.mockResolvedValueOnce({});
    window.confirm.mockReturnValueOnce(true);
    
    render(
    <BrowserRouter>
        <BugList />
    </BrowserRouter>
    );
    
    // Wait for the bugs to load
    await waitFor(() => {
    expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });
    
    // Get all delete buttons and click the first one
    const deleteButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(deleteButtons[0]);
    
    // Verify confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this bug?');
    
    // Verify delete API was called
    await waitFor(() => {
    expect(axios.delete).toHaveBeenCalledWith('/api/bugs/1', expect.any(Object));
    });
});
});