import * as React from 'react';


export const FormRow = ({ children }) => (
	<div className="form-row">
		{children}
	</div>
);


export const InputGroup = ({ children, addons = undefined }) => (
	<div className="input-group">
		{children}
		<div className="input-group-append">
			{addons}
		</div>
	</div>
);


const EMPTY_CLASSNAME = ''


export const FormGroupContainer = (props) => (
	<div className={`form-group ${props.className ? props.className : EMPTY_CLASSNAME}`}>
		{props.title ? <label htmlFor={props.name}><strong>{props.title}</strong></label> : undefined}
		{props.children}
	</div>
);

export const FormGroup = ({ name, children, errors, title = undefined, className = undefined }) => (
	<FormGroupContainer name={name} title={title} className={className}>
		{children}
		<div className="invalid-feedback">
			{errors[name]}
		</div>
	</FormGroupContainer>
);


export const FormInputGroup = ({ name, title, children, errors, addons = undefined, className = undefined }) => (
	<FormGroupContainer name={name} title={title} className={className}>
		<div className="input-group">
			{children}
			<div className="input-group-append">
				{addons}
			</div>
			<div className="invalid-feedback">
				{errors[name]}
			</div>
		</div>
	</FormGroupContainer>
);
