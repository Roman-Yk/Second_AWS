import * as React from 'react';

import { FormGroup, FormInputGroup, InputGroup } from '../wrappers';
import { BaseSelectField } from './BaseSelectField';


export const SelectFieldWithButton = ({
	name, title, values, errors,
	addons = undefined,
	onChange=undefined,
	autoFocus=undefined,
	placeholder=undefined,
	disabled=undefined,
	className=undefined,
	required=undefined,
	wrapperClassName=undefined,
	...props
}) => (
	<FormInputGroup name={name} title={title} errors={errors} addons={addons} className={wrapperClassName}>
		<BaseSelectField
			id={name}
			name={name}
			values={values}
			errors={errors}
			onChange={onChange}
			className="custom-select"
			placeholder={placeholder}
			autoFocus={autoFocus}
			disabled={disabled}
			required={required}
			{...props}
		/>
	</FormInputGroup>
);
