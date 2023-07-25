import * as React from 'react';

import { connect } from 'react-redux';
import { createUserLicense } from '../slice';

import { userLicenseAdd } from "@tms/api";

import { ModalAddForm } from '@tms/shared/components/Modal/';
import {
	FormGroup, FormRow, InputField, SelectField, TextareaField,
	Form, withForm, withServerData,
} from '@tms/shared/components/Form/';

import { SelectClientField } from '@tms/shared/async-fields/';
import { useTranslate } from 'react-polyglot';


interface ClientAddModalProps {
	licenseId: number;
	onModalClose: () => any;
	createUserLicense: (userLicense: any, user: any, license: any) => any;
}

const ClientAddModal = (props) => {
	const t = useTranslate();
	return (
		<ModalAddForm
			title={t("modals.client_license_add.title")}
			isOpened={props.isModalOpened}
			handleClose={props.onModalClose}
			onSubmit={props.onSubmit}
			isLoading={props.isSubmitting}
		>
			<Form onSubmit={props.onSubmit} disabled={props.isSubmitting} errorMessage={props.errorMessage}>
				<SelectClientField
					licenseId={props.licenseId}
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					title={t("modals.client_license_add.fields.client")}
					name="user_id"
					required
				/>
				<InputField
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					type="number"
					name="count"
					title={t("modals.client_license_add.fields.computers_count")}
					required
				/>
			</Form>
		</ModalAddForm>
	);
};


const ClientAddModalForm = withForm<ClientAddModalProps>({
	defaultValues: {
		count: 5,
	},
	beforeSubmit(values, props) {
		return {
			...values,
			license_id: props.licenseId
		};
	},
	onAsyncSubmit(values) {
		return userLicenseAdd(values);
	},

	onSuccess(props, data) {
		props.createUserLicense(data.user_license, data.user, data.license);
		props.onModalClose();
	}
})(ClientAddModal);


export default connect(
	undefined,
	{ createUserLicense },
)(ClientAddModalForm);