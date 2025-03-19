import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const BugForm = () => {
const { id } = useParams();
const history = useHistory();
const [bug, setBug] = useState(null);
const [loading, setLoading] = useState(id ? true : false);
const [error, setError] = useState(null);

// Bug validation schema
const bugSchema = Yup.object().shape({
    title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
    description: Yup.string()
    .required('Description is required'),
    status: Yup.string()
    .oneOf(['open', 'in-progress', 'resolved'], 'Invalid status'),
    severity: Yup.string()
    .oneOf(['low', 'medium', 'high', 'critical'], 'Invalid severity'),
});

useEffect(() => {
    // If editing an existing bug, fetch the bug data
    if (id) {
    const fetchBug = async () => {
        try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
            headers: {
            Authorization: `Bearer ${userInfo.token}`,
            },
        };
        
        const { data } = await axios.get(`/api/bugs/${id}`, config);
        setBug(data);
        setLoading(false);
        } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bug');
        setLoading(false);
        }
    };
    
    fetchBug();
    }
}, [id]);

const initialValues = {
    title: bug?.title || '',
    description: bug?.description || '',
    status: bug?.status || 'open',
    severity: bug?.severity || 'medium',
};

const handleSubmit = async (values, { setSubmitting }) => {
    try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
        },
    };
    
    if (id) {
        // Update existing bug
        await axios.put(`/api/bugs/${id}`, values, config);
    } else {
        // Create new bug
        await axios.post('/api/bugs', values, config);
    }
    
    setSubmitting(false);
    history.push('/');
    } catch (err) {
    setError(err.response?.data?.message || 'Failed to save bug');
    setSubmitting(false);
    }
};

if (loading) {
    return <div>Loading...</div>;
}

return (
    <Card className='p-4'>
    <h2>{id ? 'Edit Bug' : 'Create New Bug'}</h2>
    {error && <div className='alert alert-danger'>{error}</div>}
    
    <Formik
        initialValues={initialValues}
        validationSchema={bugSchema}
        onSubmit={handleSubmit}
        enableReinitialize
    >
        {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        }) => (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId='title'>
            <Form.Label>Title</Form.Label>
            <Form.Control
                type='text'
                name='title'
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.title && errors.title}
                data-testid='title-input'
            />
            <Form.Control.Feedback type='invalid'>
                {errors.title}
            </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
                as='textarea'
                rows={4}
                name='description'
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.description && errors.description}
                data-testid='description-input'
            />
            <Form.Control.Feedback type='invalid'>
                {errors.description}
            </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group controlId='status'>
            <Form.Label>Status</Form.Label>
            <Form.Control
                as='select'
                name='status'
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.status && errors.status}
                data-testid='status-select'
            >
                <option value='open'>Open</option>
                <option value='in-progress'>In Progress</option>
                <option value='resolved'>Resolved</option>
            </Form.Control>
            <Form.Control.Feedback type='invalid'>
                {errors.status}
            </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group controlId='severity'>
            <Form.Label>Severity</Form.Label>
            <Form.Control
                as='select'
                name='severity'
                value={values.severity}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.severity && errors.severity}
                data-testid='severity-select'
            >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
                <option value='critical'>Critical</option>
            </Form.Control>
            <Form.Control.Feedback type='invalid'>
                {errors.severity}
            </Form.Control.Feedback>
            </Form.Group>
            
            <Button
            type='submit'
            variant='primary'
            disabled={isSubmitting}
            data-testid='submit-button'
            >
            {isSubmitting ? 'Saving...' : 'Save Bug'}
            </Button>
            <Button
            variant='secondary'
            className='ml-2'
            onClick={() => history.push('/')}
            >
            Cancel
            </Button>
        </Form>
        )}
    </Formik>
    </Card>
);
};

export default BugForm;