import { useUserContext } from '../hooks/useUserContext';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

function PrivateRoute() {
	const { authUser } = useUserContext();
	const location = useLocation();

	if (!authUser) {
		// Redirect to sign in, but save where they were trying to go
		return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
	}

	// Render the child routes if authenticated
	return <Outlet />;
}

export default PrivateRoute;
