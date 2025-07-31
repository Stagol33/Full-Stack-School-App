import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useUserContext } from './hooks/useUserContext';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';

function App() {
	// Get user authentication state and sign out function
	const { authUser, signOut } = useUserContext();

	// Handle sign out and redirect to home
	const handleSignOut = () => {
		signOut();
		window.location.href = '/';
	};

	return (
		<Router>
			{/* Header with dynamic navigation based on auth state */}
			<header>
				<div className="wrap header--flex">
					<h1 className="header--logo">
						<Link to="/">Courses</Link>
					</h1>
					<nav>
						{authUser ? (
							// Signed in navigation
							<ul className="header--signedin">
								<li>Welcome, {authUser.firstName} {authUser.lastName}!</li>
								<li>
									<button 
										onClick={handleSignOut}
										style={{ 
											background: 'none', 
											border: 'none', 
											color: '#dbd', 
											cursor: 'pointer',
											fontSize: '.8rem'
										}}
									>
										Sign Out
									</button>
								</li>
							</ul>
						) : (
							// Signed out navigation
							<ul className="header--signedout">
								<li><Link to="/signup">Sign Up</Link></li>
								<li><Link to="/signin">Sign In</Link></li>
							</ul>
						)}
					</nav>
				</div>
			</header>
			
			<main>
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<Courses />} />
					<Route path="/signin" element={<UserSignIn />} />
					<Route path="/signup" element={<UserSignUp />} />
					<Route path="/courses/:id" element={<CourseDetail />} />
					
					{/* Error/Status routes */}
					<Route path="/notfound" element={<NotFound />} />
					<Route path="/forbidden" element={<Forbidden />} />
					<Route path="/error" element={<UnhandledError />} />
					
					{/* Protected routes */}
					<Route element={<PrivateRoute />}>
						<Route path="/courses/create" element={<CreateCourse />} />
						<Route path="/courses/:id/update" element={<UpdateCourse />} />
					</Route>
					
					{/* Catch-all route for 404s - must be last */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>
		</Router>
	);
}

export default App;
