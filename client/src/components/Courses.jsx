import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Courses() {
	// Component state
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// Fetch all courses when component loads
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await fetch('http://localhost:5000/api/courses');
				
				if (response.ok) {
					const data = await response.json();
					setCourses(data);
				} else if (response.status === 500) {
					// Redirect to error page for server errors
					navigate('/error');
					return;
				} else {
					throw new Error('Failed to fetch courses');
				}
			} catch (err) {
				console.error('Error fetching courses:', err);
				navigate('/error');
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, [navigate]);

	// Loading and error states
	if (loading) return <div className="wrap"><p>Loading courses...</p></div>;

	return (
		<div className="wrap main--grid">
			{/* Render each course as a clickable card */}
			{courses.map(course => (
				<Link 
					key={course.id} 
					className="course--module course--link" 
					to={`/courses/${course.id}`}
				>
					<h2 className="course--label">Course</h2>
					<h3 className="course--title">{course.title}</h3>
				</Link>
			))}
			
			{/* Add new course button */}
			<Link 
				className="course--module course--add--module" 
				to="/courses/create"
			>
				<span className="course--add--title">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
						viewBox="0 0 13 13" className="add">
						<polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
					</svg>
					New Course
				</span>
			</Link>
		</div>
	);
}

export default Courses;
