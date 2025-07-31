const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Return currently authenticated user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const user = req.currentUser;
    
    // Filter out sensitive information (Extra credit)
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    };
    
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users - Create new user
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;
    
    // Only hash if password exists
    let hashedPassword;
    if (password) {
      hashedPassword = bcrypt.hashSync(password, 10);
    }

    await User.create({
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword
    });
    
    res.status(201).location('/').end();
    
  } catch (error) {
    // Handle unique constraint error (Extra credit)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Email address already exists' 
      });
    }
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ errors });
    }
    
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
