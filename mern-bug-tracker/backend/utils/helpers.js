const validateBugData = (bugData) => {
const errors = {};

if (!bugData.title || bugData.title.trim() === '') {
    errors.title = 'Title is required';
    } else if (bugData.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
    }

if (!bugData.description || bugData.description.trim() === '') {
    errors.description = 'Description is required';
    }

const validStatuses = ['open', 'in-progress', 'resolved'];
    if (bugData.status && !validStatuses.includes(bugData.status)) {
    errors.status = 'Invalid status value';
    }

const validSeverities = ['low', 'medium', 'high', 'critical'];
    if (bugData.severity && !validSeverities.includes(bugData.severity)) {
    errors.severity = 'Invalid severity value';
    }

return {
    isValid: Object.keys(errors).length === 0,
    errors
    };
};

module.exports = {
validateBugData
};