const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Authentication middleware
const authenticateUser = async (req, res, next) => {
	let message;

	// Parse user credentials from Authorization header
	const credentials = auth(req);

	if (credentials) {
		// Look for user with matching email
		const user = await User.findOne({
		where: { emailAddress: credentials.name }
		});
		
		if (user) {
			// Compare password
			const authenticated = bcrypt.compareSync(credentials.pass, user.password);
		
		if (authenticated) {
			// Store user on request object
			req.currentUser = user;
		} else {
			message = `Authentication failure for email: ${user.emailAddress}`;
		}
		} else {
			message = `User not found for email: ${credentials.name}`;
		}
	} else {
			message = 'Auth header not found';
	}

	// Deny access if authentication failed
	if (message) {
		console.warn(message);
		res.status(401).json({ message: 'Access Denied' });
	} else {
			next();
	}
};

module.exports = authenticateUser;
