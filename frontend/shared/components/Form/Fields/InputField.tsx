import * as React from 'react';

import { FormGroup, InputGroup } from '../wrappers';


export const InputField = ({
	type, name, title, values, errors,
	onChange = undefined,
	autoFocus = undefined,
	placeholder = undefined,
	disabled = undefined,
	className = undefined,
	required = undefined,
	wrapperClassName = undefined,
	...props
}) => (
	<FormGroup name={name} title={title} errors={errors} className={wrapperClassName}>
		<input
			autoComplete="off-off"
			id={name}
			name={name}
			type={type}
			value={values[name] || ''}
			onChange={onChange}
			required={required}
			className={errors[name] ? "form-control is-invalid" : "form-control"}
			placeholder={placeholder || title}
			autoFocus={autoFocus}
			disabled={disabled}
			{...props}
		/>
	</FormGroup>
);
