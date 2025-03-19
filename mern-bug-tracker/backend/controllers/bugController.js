    const Bug = require('../models/bugModel');
    const { validateBugData } = require('../utils/helpers');
    const asyncHandler = require('express-async-handler');

    // @desc    Get all bugs
    // @route   GET /api/bugs
    // @access  Private
    const getBugs = asyncHandler(async (req, res) => {
    const bugs = await Bug.find({})
        .populate('reporter', 'name email')
        .populate('assignee', 'name email');
    res.json(bugs);
    });

    // @desc    Get a specific bug
    // @route   GET /api/bugs/:id
    // @access  Private
    const getBugById = asyncHandler(async (req, res) => {
    const bug = await Bug.findById(req.params.id)
        .populate('reporter', 'name email')
        .populate('assignee', 'name email');
        
    if (bug) {
        res.json(bug);
    } else {
        res.status(404);
        throw new Error('Bug not found');
    }
    });

    // @desc    Create a new bug
    // @route   POST /api/bugs
    // @access  Private
   // Bug in bugController.js
const createBug = asyncHandler(async (req, res) => {
    const { title, description, severity } = req.body;
    
    // Bug: Validation logic is bypassed in some cases
    let validation = { isValid: true, errors: {} };
    if (title && title.length < 3) {
    validation = validateBugData(req.body);
    }
    
    if (!validation.isValid) {
    res.status(400);
    throw new Error(JSON.stringify(validation.errors));
    }
    
    const bug = await Bug.create({
    title,
    description,
    severity,
    reporter: req.user._id,
    });
    
    res.status(201).json(bug);
});
    // @desc    Update a bug
    // @route   PUT /api/bugs/:id
    // @access  Private
    const updateBug = asyncHandler(async (req, res) => {
    const { title, description, status, severity, assignee } = req.body;
    
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
        res.status(404);
        throw new Error('Bug not found');
    }
    
    // Validate input data
    const validation = validateBugData({
        ...bug.toObject(),
        ...req.body
    });
    
    if (!validation.isValid) {
        res.status(400);
        throw new Error(JSON.stringify(validation.errors));
    }
    
    bug.title = title || bug.title;
    bug.description = description || bug.description;
    bug.status = status || bug.status;
    bug.severity = severity || bug.severity;
    bug.assignee = assignee || bug.assignee;
    
    const updatedBug = await bug.save();
    res.json(updatedBug);
    });

    // @desc    Delete a bug
    // @route   DELETE /api/bugs/:id
    // @access  Private
    const deleteBug = asyncHandler(async (req, res) => {
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
        res.status(404);
        throw new Error('Bug not found');
    }
    
    await bug.remove();
    res.json({ message: 'Bug removed' });
    });

    module.exports = {
    getBugs,
    getBugById,
    createBug,
    updateBug,
    deleteBug
    };