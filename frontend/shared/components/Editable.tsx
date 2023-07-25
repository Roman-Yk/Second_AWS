import * as React from 'react';


export const useEdit = () => {
	const [isEditing, setIsEditing] = React.useState(false);

	const handleEditClick = React.useCallback(() => {
		setIsEditing(true);
	}, []);

	const handleSaveClick = React.useCallback(() => {
		setIsEditing(false);
	}, []);

	const handleCancelClick = React.useCallback(() => {
		setIsEditing(false);
	}, []);

	return { isEditing, handleEditClick, handleSaveClick, handleCancelClick };
}



export const Editable = ({ ComponentEdit, ComponentStatic, ...props }) => {
	const edit = useEdit();

	if (edit.isEditing) {
		return (
			<ComponentEdit
				onSave={edit.handleSaveClick}
				onCancel={edit.handleCancelClick}
				// computer={props.computer}
				// updateComputer={props.updateComputer}
				{...props}
			/>
		);
	}

	return (
		<ComponentStatic
			onEdit={edit.handleEditClick}
			{...props}
			// computer={props.computer}
			// updateComputer={props.updateComputer}
		/>
	)
};