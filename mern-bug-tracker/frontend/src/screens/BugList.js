import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Button, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';

const BugList = () => {
const [bugs, setBugs] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchBugs = async () => {
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        },
        };
        
        const { data } = await axios.get('/api/bugs', config);
        setBugs(data);
        setLoading(false);
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bugs');
        setLoading(false);
    }
    };
    
    fetchBugs();
}, []);

const getStatusBadge = (status) => {
    let variant;
    switch (status) {
    case 'open':
        variant = 'danger';
        break;
    case 'in-progress':
        variant = 'warning';
        break;
    case 'resolved':
        variant = 'success';
        break;
    default:
        variant = 'secondary';
    }
    return <Badge variant={variant}>{status}</Badge>;
};

const getSeverityBadge = (severity) => {
    let variant;
    switch (severity) {
    case 'critical':
        variant = 'dark';
        break;
    case 'high':
        variant = 'danger';
        break;
    case 'medium':
        variant = 'warning';
        break;
    case 'low':
        variant = 'info';
        break;
    default:
        variant = 'secondary';
    }
    return <Badge variant={variant}>{severity}</Badge>;
};

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
        setBugs(bugs.filter(bug => bug._id !== id));
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete bug');
    }
    }
};

return (
    <>
    <Row className='align-items-center'>
        <Col>
        <h1>Bug List</h1>
        </Col>
        <Col className='text-right'>
        <Link to='/create'>
            <Button variant='primary'>
            <i className='fas fa-plus'></i> New Bug
            </Button>
        </Link>
        </Col>
    </Row>
    
    {loading ? (
        <Spinner animation='border' />
    ) : error ? (
        <div className='alert alert-danger'>{error}</div>
    ) : (
        <Table striped bordered hover responsive className='table-sm'>
        <thead>
            <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Severity</th>
            <th>Reporter</th>
            <th>Created At</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {bugs.length === 0 ? (
            <tr>
                <td colSpan='7' className='text-center'>
                No bugs found. Start by creating one!
                </td>
            </tr>
            ) : (
            bugs.map((bug) => (
                <tr key={bug._id}>
                <td>{bug._id}</td>
                <td>
                    <Link to={`/bug/${bug._id}`}>{bug.title}</Link>
                </td>
                <td>{getStatusBadge(bug.status)}</td>
                <td>{getSeverityBadge(bug.severity)}</td>
                <td>{bug.reporter.name}</td>
                <td>{new Date(bug.createdAt).toLocaleDateString()}</td>
                <td>
                    <Link to={`/edit/${bug._id}`} className='btn btn-sm btn-light mr-2'>
                    <i className='fas fa-edit'></i>
                    </Link>
                    <Button
                    variant='danger'
                    size='sm'
                    onClick={() => handleDelete(bug._id)}
                    >
                    <i className='fas fa-trash'></i>
                    </Button>
                </td>
                </tr>
            ))
            )}
        </tbody>
        </Table>
    )}
    </>
);
};

export default BugList;