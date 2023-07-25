import * as React from 'react';

import { connect } from 'react-redux';
import { addManager } from '../slice';

import { managerAdd } from "@tms/api";

import { ModalAddForm } from '@tms/shared/components/Modal/';
import {
	InputField, SelectField, SelectFieldWithButton,
	FormGroup, FormRow, Form, withForm,
} from '@tms/shared/components/Form/';

import { SelectCompanyField } from '@tms/shared/async-fields/';


interface ManagerAddModalProps {
	addManager: (manager: any) => any;
	onModalClose: () => any;
}

const ManagerAddModal = (props) => (
	<ModalAddForm
		title="Add new manager"
		isOpened={props.isModalOpened}
		handleClose={props.onModalClose}
		onSubmit={props.onSubmit}
		isLoading={props.isSubmitting}
	>
		<Form onSubmit={props.onSubmit} disabled={props.isSubmitting} errorMessage={props.errorMessage}>
			<SelectCompanyField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				title="Company"
				placeholder="Select company..."
				name="company_id"
				required
			/>
			<FormRow>
				<InputField
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					wrapperClassName="col-md-6"
					type="text"
					name="first_name"
					title="First name"
					required
					autoFocus={true}
				/>
				<InputField
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					wrapperClassName="col-md-6"
					type="text"
					name="last_name"
					title="Last name"
					required
				/>
			</FormRow>

			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="email"
				name="email"
				title="Email"
				placeholder="user@domain.com"
				required
			/>

			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="phone"
				name="phone"
				title="Phone"
				placeholder="099 99 99 999"
				required
			/>

			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="password"
				name="password"
				autoComplete="new-password"
				placeholder="****"
				title="Password"
				required
			/>
			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="password"
				name="repeat_password"
				autoComplete="new-password"
				placeholder="****"
				title="Repeat Password"
				required
			/>
		</Form>
	</ModalAddForm>
);


const ManagerAddModalForm = withForm<ManagerAddModalProps>({
	onAsyncSubmit(values) {
		return managerAdd(values);
	},

	onSuccess(props, data) {
		props.addManager(data.item);
		props.onModalClose();
	}
})(ManagerAddModal);


export default connect(
	undefined,
	{ addManager }
)(ManagerAddModalForm);