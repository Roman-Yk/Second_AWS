import * as React from 'react';

import { FormGroup, InputGroup } from '../wrappers';

import DatePicker from 'react-date-picker'


export const DateField = ({
	name, title, values, errors,
	onChange = undefined,
	autoFocus = undefined,
	placeholder = undefined,
	disabled = undefined,
	className = undefined,
	required = undefined,
	wrapperClassName = undefined,
	...props
}) => {
	const value = React.useMemo(() => {
		console.log(values, name);
		const raw = values[name];
		if (!raw) return raw;
		if (raw instanceof Date) {
			return raw;
		}
		return new Date(raw);
	}, [values[name]]);

	const _onChange = (value) => {
		onChange({ target: { name, value } });
	}

	return (
		<FormGroup name={name} title={title} errors={errors} className={wrapperClassName}>
			<DatePicker className="form-control" format="y-MM-dd" name={name} value={value} onChange={_onChange} />
			{/*<input
				autoComplete="off-off"
				id={name}
				name={name}
				value={values[name] || ''}
				onChange={onChange}
				required={required}
				className={errors[name] ? "form-control is-invalid" : "form-control"}
				placeholder={placeholder || title}
				autoFocus={autoFocus}
				disabled={disabled}
				{...props}
			/>*/}
		</FormGroup>
	);
};
