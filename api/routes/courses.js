const express = require('express');
const { Course, User } = require('../models');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// GET /api/courses - Return all courses (with User association and filtered attributes)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }, // Extra credit - filter out timestamps
      include: [{
        model: User,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } // Extra credit - filter out sensitive/unnecessary fields
      }]
    });
    
    res.status(200).json(courses);
  } catch (error) {
    console.error('Courses route error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/courses/:id - Return specific course (with User association and filtered attributes)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }, // Extra credit - filter out timestamps
      include: [{
        model: User,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } // Extra credit - filter out sensitive/unnecessary fields
      }]
    });
    
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('Single course route error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/courses - Create new course (with auth and proper userId handling)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      userId: req.currentUser.id // Set userId from authenticated user, not from request body
    });
    
    res.status(201).location(`/api/courses/${course.id}`).end();
    
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ errors });
    }
    
    console.error('Create course error:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/courses/:id - Update course (with ownership check)
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Extra credit - Check if current user owns the course
    if (course.userId !== req.currentUser.id) {
      return res.status(403).json({ message: 'Access denied. You can only update your own courses.' });
    }
    
    await course.update(req.body);
    res.status(204).end();
    
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ errors });
    }
    
    console.error('Update course error:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/courses/:id - Delete course (with ownership check)
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Extra credit - Check if current user owns the course
    if (course.userId !== req.currentUser.id) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own courses.' });
    }
    
    await course.destroy();
    res.status(204).end();
    
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
