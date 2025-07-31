import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import ReactMarkdown from 'react-markdown';

function CourseDetail() {
	// Get course ID from URL and set up hooks
	const { id } = useParams();
	const { authUser, getAuthHeaders } = useUserContext();
	const navigate = useNavigate();
	
	// Component state
	const [course, setCourse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);

	// Fetch course data when component loads
	useEffect(() => {
		const fetchCourse = async () => {
			try {
				const response = await fetch(`http://localhost:5000/api/courses/${id}`);
				
				if (response.ok) {
					const data = await response.json();
					setCourse(data);
				} else if (response.status === 404) {
					// Redirect to not found page for 404 errors
					navigate('/notfound');
					return;
				} else if (response.status === 500) {
					// Redirect to error page for server errors
					navigate('/error');
					return;
				} else {
					throw new Error('Failed to fetch course');
				}
			} catch (err) {
				console.error('Error fetching course:', err);
				navigate('/error');
			} finally {
				setLoading(false);
			}
		};

		fetchCourse();
	}, [id, navigate]);

	// Handle course deletion
	const handleDelete = async () => {
		if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
			setIsDeleting(true);
			
			try {
				const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
					method: 'DELETE',
					headers: getAuthHeaders()
				});

				if (response.ok) {
					navigate('/');
				} else if (response.status === 403) {
					navigate('/forbidden');
				} else if (response.status === 401) {
					alert('You must be signed in to delete courses.');
				} else if (response.status === 404) {
					navigate('/notfound');
				} else if (response.status === 500) {
					navigate('/error');
				} else {
					throw new Error('Failed to delete course');
				}
			} catch (error) {
				console.error('Delete course error:', error);
				navigate('/error');
			} finally {
				setIsDeleting(false);
			}
		}
	};

	// Check if current user owns this course
	const isOwner = authUser && course && course.User && course.User.id === authUser.id;

	// Loading state
	if (loading) return <div className="wrap"><p>Loading course...</p></div>;

	return (
		<>
			{/* Action buttons - only show Update/Delete if user owns course */}
			<div className="actions--bar">
				<div className="wrap">
					{isOwner && (
						<>
							<Link className="button" to={`/courses/${course.id}/update`}>
								Update Course
							</Link>
							<button 
								className="button" 
								onClick={handleDelete}
								disabled={isDeleting}
							>
								{isDeleting ? 'Deleting...' : 'Delete Course'}
							</button>
						</>
					)}
					<Link className="button button-secondary" to="/">
						Return to List
					</Link>
				</div>
			</div>
			
			{/* Course details display */}
			<div className="wrap">
				<h2>Course Detail</h2>
				<form>
					<div className="main--flex">
						<div>
							<label htmlFor="courseTitle">Course</label>
							<input 
								id="courseTitle" 
								name="courseTitle" 
								type="text" 
								value={course.title} 
								readOnly 
							/>

							<p>By {course.User?.firstName} {course.User?.lastName}</p>

							<label htmlFor="courseDescription">Description</label>
							<div className="course--detail--list">
								<ReactMarkdown>{course.description}</ReactMarkdown>
							</div>
						</div>
						<div>
							<label htmlFor="estimatedTime">Estimated Time</label>
							<input 
								id="estimatedTime" 
								name="estimatedTime" 
								type="text" 
								value={course.estimatedTime || ''} 
								readOnly 
							/>

							<label htmlFor="materialsNeeded">Materials Needed</label>
							<div className="course--detail--list">
								<ReactMarkdown>{course.materialsNeeded || 'No materials specified'}</ReactMarkdown>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default CourseDetail;
