import { Link } from 'react-router-dom';

function Forbidden() {
	return (
		<div className="wrap">
			<h2>Forbidden</h2>
			<p>Oh oh! You can't access this page.</p>
			<Link className="button button-secondary" to="/">
				Return to List
			</Link>
		</div>
	);
}

export default Forbidden;
