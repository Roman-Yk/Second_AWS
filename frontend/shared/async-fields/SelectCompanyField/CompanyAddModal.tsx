import * as React from 'react';
import { connect } from 'react-redux';

import { companyAdd } from "@tms/api";

import { ModalAddForm } from '@tms/shared/components/Modal/';
import {
	FormGroup, FormRow, InputField, SelectField, TextareaField,
	Form, withForm, withServerData,
} from '@tms/shared/components/Form/';


interface CompanyAddModalProps {
	handleItemAdd(data: any): void;
	onModalClose(): void;
}

const CompanyAddModal = (props) => (
	<ModalAddForm
		title="Add new company"
		isOpened={props.isModalOpened}
		handleClose={props.onModalClose}
		onSubmit={props.onSubmit}
		isLoading={props.isSubmitting}
	>
		<Form onSubmit={props.onSubmit} disabled={props.isSubmitting} errorMessage={props.errorMessage}>
			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="text"
				name="name"
				title="Company name"
				autoFocus={true}
				required
			/>
		</Form>
	</ModalAddForm>
);


const CompanyAddModalForm = withForm<CompanyAddModalProps>({
	onAsyncSubmit(values) {
		return companyAdd(values);
	},

	onSuccess(props, data) {
		props.handleItemAdd(data.item);
		props.onModalClose();
	}
})(CompanyAddModal);


export default CompanyAddModalForm;