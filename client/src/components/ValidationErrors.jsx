function ValidationErrors({ errors }) {
	// Don't render anything if no errors exist
	if (!errors || errors.length === 0) {
		return null;
	}

	return (
		<div className="validation--errors">
			<h3>Validation Errors</h3>
			{/* Render each error as a list item */}
			<ul>
				{errors.map((error, index) => (
					<li key={index}>{error}</li>
				))}
			</ul>
		</div>
	);
}

export default ValidationErrors;
