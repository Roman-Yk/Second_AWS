import * as React from 'react';

import { FormGroup, InputGroup } from '../wrappers';



const TagsInput: React.FC<any> = ({ name, value, onChange, items }) => {
	const valueCheck = React.useMemo(() => {
		return value.reduce((curr, item) => {
			curr[item] = true;
			return curr;
		}, {});
	}, [value]);

	const onItemClick = (e) => {
		const itemName = e.target.getAttribute('data-name');
		if (valueCheck[itemName]) {
			const newValue = value.filter(item => item === itemName ? false : true);
			onChange({ target: { name: name, value: newValue } });
		} else {
			const newValue = [...value, itemName];
			onChange({ target: { name: name, value: newValue } });
		}
	}

	const renderItems = items || value;

	return (
		<div>
			{renderItems && renderItems.map(item =>
				<span
					key={item}
					data-name={item}
					onClick={onItemClick}
					className={`cursor-pointer badge badge-${valueCheck[item] ? 'primary' : 'light'} m-1`}
				>{item}</span>
			)}
			{!items && <span className="m-1"><div className="spinner-border spinner-border-sm" role="status"></div> <small>Loading more features...</small></span>}
		</div>
	);
}


export const TagsField = ({
	name, title, values, errors, items,
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
		<TagsInput {...props} name={name} value={values[name]} items={items} onChange={onChange} />
	</FormGroup>
);
