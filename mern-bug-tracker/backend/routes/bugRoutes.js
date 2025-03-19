const express = require('express');
const router = express.Router();
const { 
getBugs, 
getBugById, 
createBug, 
updateBug, 
deleteBug 
} = require('../controllers/bugController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
.get(protect, getBugs)
.post(protect, createBug);

router.route('/:id')
.get(protect, getBugById)
.put(protect, updateBug)
.delete(protect, deleteBug);

module.exports = router;