import * as React from 'react';
import { connect } from 'react-redux';

import { userUpdatePersonal } from '@tms/api';
import {
	FormGroup, FormRow, Form, withForm, withServerData,
	InputField, SelectField, TextareaField,
} from '@tms/shared/components/Form/';

import { ButtonPrimary } from '@tms/shared/components/Button/';
import { useAlert, AlertSuccess } from '@tms/shared/components/Alert';

import './styles.scss';


interface PersonalInfoFormProps {
	handlePersonalInfoChanged(data?: any): void;
}


const PersonalInfoForm = withForm<PersonalInfoFormProps>({
	defaultValues: (window as any).USER_PERSONAL_INFO,
	onAsyncSubmit: (values) => userUpdatePersonal(values),

	onSuccess(props, data, form) {
		props.handlePersonalInfoChanged();
	},
})((props) => (
	<Form onSubmit={props.onSubmit} disabled={true} errorMessage={props.errorMessage}>
		<FormRow>
			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="text"
				name="first_name"
				title="First name"
				placeholder="John"
				wrapperClassName="col-6"
				required
			/>
			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="text"
				name="last_name"
				title="Last name"
				placeholder="Doe"
				wrapperClassName="col-6"
				required
			/>
		</FormRow>
		<InputField
			values={props.values}
			errors={props.errors}
			onChange={props.handleFieldChange}
			type="text"
			name="email"
			title="Email"
			placeholder="email@gmail.com"
			required
		/>

		<ButtonPrimary type="submit">Save</ButtonPrimary>
	</Form>
		// <InputField
		// 	values={props.values}
		// 	errors={props.errors}
		// 	onChange={props.handleFieldChange}
		// 	type="text"
		// 	name="phone"
		// 	title="Phone number"
		// 	placeholder="0 99 99 99 999"
		// 	required
		// />
));


const PersonalInfo = () => {
	const alert = useAlert(10000);

	return (
		<div className="card">
			<h3 className="card-header">
				Personal info
			</h3>
			<div className="card-body">
				<AlertSuccess message="Personal info saved." {...alert} />
				<PersonalInfoForm handlePersonalInfoChanged={alert.show} />
			</div>
		</div>
	);
}



export default PersonalInfo;