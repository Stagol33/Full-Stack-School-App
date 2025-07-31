import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import ValidationErrors from './ValidationErrors';

function CreateCourse() {
	// Get user context and navigation hook
	const { authUser, getAuthHeaders } = useUserContext();
	const navigate = useNavigate();
	
	// Form data state
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		estimatedTime: '',
		materialsNeeded: ''
	});
	
	// UI state
	const [errors, setErrors] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

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

		try {
			// Send POST request to create course
			const response = await fetch('http://localhost:5000/api/courses', {
				method: 'POST',
				headers: getAuthHeaders(),
				body: JSON.stringify({
					title: formData.title,
					description: formData.description,
					estimatedTime: formData.estimatedTime || null,
					materialsNeeded: formData.materialsNeeded || null
				})
			});

			if (response.ok) {
				// Get course ID from Location header and redirect to course detail
				const location = response.headers.get('Location');
				const courseId = location ? location.split('/').pop() : null;
				
				if (courseId) {
					navigate(`/courses/${courseId}`);
				} else {
					navigate('/');
				}
			} else if (response.status === 400) {
				// Handle validation errors
				const errorData = await response.json();
				if (errorData.errors) {
					setErrors(errorData.errors);
				} else if (errorData.message) {
					setErrors([errorData.message]);
				} else {
					setErrors(['Validation failed. Please check your input.']);
				}
			} else if (response.status === 401) {
				setErrors(['You must be signed in to create courses.']);
			} else if (response.status === 500) {
				// Redirect to error page for server errors
				navigate('/error');
				return;
			} else {
				throw new Error('Failed to create course');
			}
		} catch (error) {
			console.error('Create course error:', error);
			navigate('/error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle cancel button
	const handleCancel = () => {
		navigate('/');
	};

	return (
		<>
			<div className="wrap">
				<h2>Create Course</h2>
				
				{/* Display validation errors */}
				<ValidationErrors errors={errors} />

				<form onSubmit={handleSubmit}>
					<div className="main--flex">
						{/* Left column - Title and Description */}
						<div>
							<label htmlFor="courseTitle">Course Title</label>
							<input 
								id="courseTitle" 
								name="title" 
								type="text" 
								value={formData.title}
								onChange={handleChange}
								placeholder="Course title..."
							/>

							<p>By {authUser ? `${authUser.firstName} ${authUser.lastName}` : 'Unknown User'}</p>

							<label htmlFor="courseDescription">Course Description</label>
							<textarea 
								id="courseDescription" 
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Course description..."
							></textarea>
						</div>
						
						{/* Right column - Time and Materials */}
						<div>
							<label htmlFor="estimatedTime">Estimated Time</label>
							<input 
								id="estimatedTime" 
								name="estimatedTime" 
								type="text" 
								value={formData.estimatedTime}
								onChange={handleChange}
								placeholder="Hours"
							/>

							<label htmlFor="materialsNeeded">Materials Needed</label>
							<textarea 
								id="materialsNeeded" 
								name="materialsNeeded"
								value={formData.materialsNeeded}
								onChange={handleChange}
								placeholder="List materials..."
							></textarea>
						</div>
					</div>
					
					{/* Form buttons */}
					<button 
						className="button" 
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Creating Course...' : 'Create Course'}
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
			</div>
		</>
	);
}

export default CreateCourse;
