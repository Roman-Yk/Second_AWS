import * as React from 'react';


const Title = ({ text, muted = false, children = undefined }) => (
	<h4 className="d-flex justify-content-between align-items-center mb-3">
		<span className={muted ? "text-muted" : ""}>{text}</span>
		{children}
	</h4>
);


export default Title;