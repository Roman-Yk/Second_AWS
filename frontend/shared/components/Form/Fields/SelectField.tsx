import * as React from 'react';

import { FormGroup, InputGroup } from '../wrappers';
import { BaseSelectField } from './BaseSelectField';


export const SelectField = ({
	name, title, values, errors,
	addon = undefined,
	onChange=undefined,
	autoFocus=undefined,
	placeholder=undefined,
	disabled=undefined,
	className=undefined,
	required=undefined,
	wrapperClassName=undefined,
	...props
}) => (
	<FormGroup name={name} title={title} errors={errors} className={wrapperClassName}>
		<BaseSelectField
			id={name}
			name={name}
			values={values}
			errors={errors}
			onChange={onChange}
			className="form-control"
			autoFocus={autoFocus}
			disabled={disabled}
			required={required}
			placeholder={placeholder}
			{...props}
		/>
		{addon}
	</FormGroup>
);
