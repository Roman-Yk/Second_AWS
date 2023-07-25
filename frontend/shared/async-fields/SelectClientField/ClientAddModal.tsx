import * as React from 'react';

import { connect } from 'react-redux';

import { clientAdd } from "@tms/api";

import { ModalAddForm } from '@tms/shared/components/Modal/';
import {
	withForm, withServerData, Form, FormGroup, FormRow,
	InputField, SelectField, TextareaField,
} from '@tms/shared/components/Form/';


interface ClientAddModalProps {
	handleItemAdd: (item: any) => void;
	onModalClose: () => void;
}

const ClientAddModal = (props) => (
	<ModalAddForm
		title="Add new client account"
		isOpened={props.isModalOpened}
		handleClose={props.onModalClose}
		onSubmit={props.onSubmit}
		isLoading={props.isSubmitting}
	>
		<Form onSubmit={props.onSubmit} disabled={props.isSubmitting} errorMessage={props.errorMessage}>
			<FormRow>
				<InputField
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					type="text"
					name="first_name"
					title="First Name"
					wrapperClassName="col-md-6"
					autoFocus={true}
					required
				/>
				<InputField
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					type="text"
					name="last_name"
					title="Last Name"
					wrapperClassName="col-md-6"
					required
				/>
			</FormRow>
			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="text"
				name="client_company"
				title="Client Company"
				required={false}
			/>
			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="email"
				name="email"
				title="Email"
				required
			/>
			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="tel"
				name="phone"
				placeholder="099 99 99 999"
				title="Phone Number"
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


const ClientAddModalForm = withForm<ClientAddModalProps>({
	onAsyncSubmit(values) {
		return clientAdd(values);
	},

	onSuccess(props, data) {
		props.handleItemAdd(data.item);
		props.onModalClose();
	}
})(ClientAddModal);


export default ClientAddModalForm;