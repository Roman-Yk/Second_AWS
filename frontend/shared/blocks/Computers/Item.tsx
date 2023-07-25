import * as React from 'react';
import { connect } from 'react-redux';

import { Loader } from '@tms/shared/components/Loader';
import { useEdit, Editable } from '@tms/shared/components/Editable';

import { ComputerItemProps, ComputerItemStatic, ComputerItemEdit } from './components';


export const ComputerItemEmpty = ({ message = "No computers" }) => {
	return (
		<li className="list-group-item-computer list-group-item-computer-centered">
			<strong className="m-2 text-muted">{message}</strong>
		</li>
	);
}

export const ComputerItemLoading = () => {
	return (
		<li className="list-group-item-computer list-group-item-computer-centered">
			<Loader />
		</li>
	);
}

export const createEditableComputerItem = (ComputerItemStatic, ComputerItemEdit) => {
	const ComputerItem = (props: ComputerItemProps) => (
		<Editable
			ComponentEdit={ComputerItemEdit}
			ComponentStatic={ComputerItemStatic}

			computer={props.computer}
			updateComputer={props.updateComputer}
		/>
	);

	return ComputerItem;
}


export const ComputerItem = createEditableComputerItem(ComputerItemStatic, ComputerItemEdit)
