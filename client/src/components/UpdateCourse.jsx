import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import ValidationErrors from './ValidationErrors';

function UpdateCourse() {
	// Get course ID from URL and set up hooks
	const { id } = useParams();
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
	const [loading, setLoading] = useState(true);
	const [course, setCourse] = useState(null);

	// Fetch existing course data when component loads
	useEffect(() => {
		const fetchCourse = async () => {
			try {
				const response = await fetch(`http://localhost:5000/api/courses/${id}`);
				
				if (response.ok) {
					const courseData = await response.json();
					setCourse(courseData);
					
					// Check if authenticated user owns this course
					if (authUser && courseData.User && courseData.User.id !== authUser.id) {
						navigate('/forbidden');
						return;
					}
					
					// Populate form with existing course data
					setFormData({
						title: courseData.title || '',
						description: courseData.description || '',
						estimatedTime: courseData.estimatedTime || '',
						materialsNeeded: courseData.materialsNeeded || ''
					});
				} else if (response.status === 404) {
					// Redirect to not found for missing courses
					navigate('/notfound');
					return;
				} else if (response.status === 500) {
					// Redirect to error page for server errors
					navigate('/error');
					return;
				} else {
					throw new Error('Failed to fetch course');
				}
			} catch (error) {
				console.error('Fetch course error:', error);
				navigate('/error');
			} finally {
				setLoading(false);
			}
		};

		fetchCourse();
	}, [id, authUser, navigate]);

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
			// Send PUT request to update course
			const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
				method: 'PUT',
				headers: getAuthHeaders(),
				body: JSON.stringify({
					title: formData.title,
					description: formData.description,
					estimatedTime: formData.estimatedTime || null,
					materialsNeeded: formData.materialsNeeded || null
				})
			});

			if (response.ok) {
				// Redirect back to course detail page
				navigate(`/courses/${id}`);
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
			} else if (response.status === 403) {
				navigate('/forbidden');
			} else if (response.status === 401) {
				setErrors(['You must be signed in to update courses.']);
			} else if (response.status === 404) {
				navigate('/notfound');
			} else if (response.status === 500) {
				navigate('/error');
			} else {
				throw new Error('Failed to update course');
			}
		} catch (error) {
			console.error('Update course error:', error);
			navigate('/error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle cancel button
	const handleCancel = () => {
		navigate(`/courses/${id}`);
	};

	// Loading state
	if (loading) {
		return <div className="wrap"><p>Loading course...</p></div>;
	}

	return (
		<>
			<div className="wrap">
				<h2>Update Course</h2>
				
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

							<p>By {course?.User ? `${course.User.firstName} ${course.User.lastName}` : 'Unknown User'}</p>

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
						{isSubmitting ? 'Updating Course...' : 'Update Course'}
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

export default UpdateCourse;
