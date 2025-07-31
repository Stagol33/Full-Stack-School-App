import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import ValidationErrors from './ValidationErrors';

function UserSignIn() {
	// Get sign in function from context
	const { signIn } = useUserContext();
	const navigate = useNavigate();
	const location = useLocation();
	
	// Form data state
	const [formData, setFormData] = useState({
		emailAddress: '',
		password: ''
	});
	
	// UI state
	const [errors, setErrors] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Get intended destination from location state or default to home
	const from = location.state?.from || '/';

	// Handle form input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors([]);
		setIsSubmitting(true);

		// Basic validation
		const validationErrors = [];
		if (!formData.emailAddress) {
			validationErrors.push('Email address is required');
		}
		if (!formData.password) {
			validationErrors.push('Password is required');
		}

		if (validationErrors.length > 0) {
			setErrors(validationErrors);
			setIsSubmitting(false);
			return;
		}

		try {
			await signIn({
				emailAddress: formData.emailAddress,
				password: formData.password
			});
			
			// Redirect to intended destination after successful sign in
			navigate(from, { replace: true });
		} catch (error) {
			setErrors([error.message]);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle cancel button
	const handleCancel = () => {
		navigate('/');
	};

	return (
		<div className="form--centered">
			<h2>Sign In</h2>
			
			{/* Display validation errors */}
			<ValidationErrors errors={errors} />

			<form onSubmit={handleSubmit}>
				<label htmlFor="emailAddress">Email Address</label>
				<input 
					id="emailAddress" 
					name="emailAddress" 
					type="email" 
					value={formData.emailAddress}
					onChange={handleChange}
					placeholder="Enter your email address"
				/>

				<label htmlFor="password">Password</label>
				<input 
					id="password" 
					name="password" 
					type="password" 
					value={formData.password}
					onChange={handleChange}
					placeholder="Enter your password"
				/>

				<button 
					className="button" 
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Signing In...' : 'Sign In'}
				</button>
				
				<button 
					className="button button-secondary" 
					type="button"
					onClick={handleCancel}
					disabled={isSubmitting}
				>
					Cancel
				</button>
			</form>
			
			<p>
				Don't have a user account? <Link to="/signup">Click here to sign up!</Link>
			</p>
		</div>
	);
}

export default UserSignIn;
