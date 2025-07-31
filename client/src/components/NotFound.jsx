import { Link } from 'react-router-dom';

function NotFound() {
	return (
		<div className="wrap">
			<h2>Not Found</h2>
			<p>Sorry! We couldn't find the page you're looking for.</p>
			<Link className="button button-secondary" to="/">
				Return to List
			</Link>
		</div>
	);
}

export default NotFound;
