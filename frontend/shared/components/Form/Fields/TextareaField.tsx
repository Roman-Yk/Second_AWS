import * as React from 'react';

import { FormGroup, InputGroup } from '../wrappers';


export const TextareaField = ({
	name, values, errors,
	title = undefined,
	onChange = undefined,
	autoFocus = undefined,
	placeholder = undefined,
	disabled = undefined,
	className = undefined,
	required = undefined,
	wrapperClassName = undefined,
	rows = 4,
	...props
}) => {
	const finalClassName = className === undefined ? 'form-control' : `form-control ${className}`;
	return (
		<FormGroup name={name} title={title} errors={errors} className={wrapperClassName}>
			<textarea
				autoComplete="off-off"
				rows={rows}
				id={name}
				name={name}
				value={values[name] || ''}
				onChange={onChange}
				required={required}
				className={errors[name] ? `${finalClassName} is-invalid` : finalClassName}
				placeholder={placeholder || title}
				title={placeholder || title}
				autoFocus={autoFocus}
				disabled={disabled}
			></textarea>
		</FormGroup>
	);
}
