import * as React from 'react';

import { connect } from 'react-redux';
import { updateClientAndUserLicense } from '../slice';

import { userLicenseUpdate, clientUpdate } from "@tms/api";

import { ModalEditForm } from '@tms/shared/components/Modal/';
import {
	FormGroup, FormRow, DateField,
	InputField, SelectField, TextareaField,
	Form, withForm, withServerData,
} from '@tms/shared/components/Form/';

import { SelectClientField, TagsFeaturesField } from '@tms/shared/async-fields/';
import { useTranslate } from 'react-polyglot';


interface ClientEditModalProps {
	client: any;
	userLicense: any;
	license: any;
	handleClose: () => any;
	updateClientAndUserLicense: (/*client: any, */userLicense: any) => any;
}

const ClientEditModal = (props) => {
	const t = useTranslate();

	return (
		<ModalEditForm
			top={props.top}
			title={t("modals.client_license_edit.title")}
			isOpened={props.isOpened}
			handleClose={props.handleClose}
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
						title={t("modals.client_license_edit.fields.first_name")}
						wrapperClassName="col-md-4"
						disabled
						// autoFocus={true}
					/>
					<InputField
						values={props.values}
						errors={props.errors}
						onChange={props.handleFieldChange}
						type="text"
						name="last_name"
						title={t("modals.client_license_edit.fields.last_name")}
						wrapperClassName="col-md-4"
						disabled
					/>
					<InputField
						values={props.values}
						errors={props.errors}
						onChange={props.handleFieldChange}
						type="password"
						name="new_password"
						title={t("modals.client_license_edit.fields.new_password")}
						wrapperClassName="col-md-4"
						disabled
					/>
				</FormRow>
				<FormRow>
					<InputField
						values={props.values}
						errors={props.errors}
						onChange={props.handleFieldChange}
						type="email"
						name="email"
						title={t("modals.client_license_edit.fields.email")}
						wrapperClassName="col-md-8"
						disabled
					/>
					<InputField
						values={props.values}
						errors={props.errors}
						onChange={props.handleFieldChange}
						type="text"
						name="phone"
						title={t("modals.client_license_edit.fields.phone")}
						wrapperClassName="col-md-4"
						disabled
					/>
				</FormRow>
				<InputField
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					type="text"
					name="client_company"
					title={t("modals.client_license_edit.fields.client_company")}
					disabled
				/>
				<InputField
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					type="number"
					name="count"
					title={t("modals.client_license_edit.fields.computers_count")}
				/>
				{(props.license.trial_days || props.userLicense.expiration_date) && <DateField
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					name="expiration_date"
					title={t("modals.client_license_edit.fields.expiration_date")}
				/>}
				<TagsFeaturesField
					productId={props.license.product_id}
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					name="features"
					title={t("modals.client_license_edit.fields.features")}
				/>
			</Form>
		</ModalEditForm>
	);
};


const pad = val => val < 10 ? ('0' + val) : ('' + val);
const isoDate = date => date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());

const ClientEditModalForm = withForm<ClientEditModalProps>({
	defaultValues: (props) => ({
		count: props.userLicense.count,
		features: props.userLicense.features,
		expiration_date: props.userLicense.expiration_date,
		first_name: props.client.first_name,
		last_name: props.client.last_name,
		client_company: props.client.client_company,
		email: props.client.email,
		phone: props.client.phone,
	}),
	onAsyncSubmit(values, props) {
		return Promise.all([
			// clientUpdate({
			// 	id: props.client.id,
			// 	...values,
			// }),
			userLicenseUpdate({
				id: props.userLicense.id,
				count: values.count,
				features: values.features,
				expiration_date: values.expiration_date instanceof Date ? isoDate(values.expiration_date) : values.expiration_date,
			}),
		]);
	},

	onSuccess(props, data) {
		props.updateClientAndUserLicense(
			data[0].item,
			// data[1].item
		);
		props.handleClose();
	}
})(ClientEditModal);


export default connect(
	undefined,
	{ updateClientAndUserLicense },
)(ClientEditModalForm);