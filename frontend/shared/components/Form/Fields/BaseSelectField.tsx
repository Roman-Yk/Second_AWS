import * as React from 'react';


export const BaseSelectField = ({
	name, values, errors,
	placeholder = " ",
	onChange = undefined,
	className = "form-control",
	autoFocus = undefined,
	disabled = undefined,
	required = undefined,
	isFetching = false,
	addon = undefined,
	...props
}) => (
	<React.Fragment>
	<select
		id={name}
		name={name}
		value={values[name] || ''}
		onChange={onChange}
		className={errors[name] ? `${className} is-invalid` : className}
		autoFocus={autoFocus}
		disabled={isFetching || disabled}
		required={required}
	>
		<option value="">{isFetching ? "Loading..." : placeholder}</option>
		{props.children}
	</select>
	{addon}
	</React.Fragment>
);
