import * as React from 'react';
import { connect } from 'react-redux';

import { userUpdatePassword } from '@tms/api';
import {
	FormGroup, FormRow, Form, withForm, withServerData,
	InputField, SelectField, TextareaField,
} from '@tms/shared/components/Form/';

import { ButtonPrimary } from '@tms/shared/components/Button/';
import { useAlert, AlertSuccess } from '@tms/shared/components/Alert';

import './styles.scss';



interface ChangePasswordFormProps {
	handlePasswordChanged(data): void;
}

const ChangePasswordForm = withForm<ChangePasswordFormProps>({
	onAsyncSubmit: (values) => userUpdatePassword(values),

	onSuccess(props, data, form) {
		form.reset();
		props.handlePasswordChanged(data);
	}
})((props) => (
	<Form onSubmit={props.onSubmit} disabled={props.isSubmitting} errorMessage={props.errorMessage}>
		<InputField
			values={props.values}
			errors={props.errors}
			onChange={props.handleFieldChange}
			type="password"
			name="current_password"
			title="Current password"
			placeholder="****"
			required
		/>
		<FormRow>
			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="password"
				name="new_password"
				title="New password"
				placeholder="****"
				wrapperClassName="col-lg-6"
				required
			/>
			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="password"
				name="new_password_repeat"
				title="Repeat new password"
				placeholder="****"
				wrapperClassName="col-lg-6"
				required
			/>
		</FormRow>

		<ButtonPrimary type="submit" isLoading={props.isSubmitting}>Change password</ButtonPrimary>
	</Form>
));


const ChangePassword = () => {
	const alert = useAlert(10000);

	return (
		<div className="card">
			<h3 className="card-header">
				Change password
			</h3>
			<div className="card-body">
				<AlertSuccess message="Password successfully changed." {...alert} />
				<ChangePasswordForm handlePasswordChanged={alert.show} />
			</div>
		</div>
	);
}




export default ChangePassword;