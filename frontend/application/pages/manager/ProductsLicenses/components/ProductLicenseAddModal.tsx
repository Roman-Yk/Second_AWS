import * as React from 'react';

import { connect } from 'react-redux';
import { addProductLicense } from '../slice';

import { licenseAdd } from "@tms/api";

import { ModalAddForm } from '@tms/shared/components/Modal/';
import {
	withForm, withServerData, Form, FormGroup, FormRow,
	InputField, SelectField, TextareaField,
} from '@tms/shared/components/Form/';

import { SelectLicenseTypeField, SelectProductField } from '@tms/shared/async-fields/';
import { useTranslate } from 'react-polyglot';


export interface ProductLicenseAddModalProps {
	addProductLicense: (product: any) => any;
	onModalClose: () => any;
}

const ProductLicenseAddModal = (props) => {
	const t = useTranslate();

	return (
		<ModalAddForm
			title={t("modals.license_add.title")}
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
					title={t("modals.license_add.fields.name")}
					autoFocus={true}
					required
				/>
				<SelectProductField
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					title={t("modals.license_add.fields.product")}
					name="product_id"
					required
				/>
				<SelectLicenseTypeField
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					title={t("modals.license_add.fields.type")}
					name="type_id"
					required
				/>
			</Form>
		</ModalAddForm>
	);
}


const ProductLicenseAddModalForm = withForm<ProductLicenseAddModalProps>({
	onAsyncSubmit(values) {
		return licenseAdd(values);
	},

	onSuccess(props, data) {
		props.addProductLicense(data.item);
		props.onModalClose();
	}
})(ProductLicenseAddModal);


export default connect(
	undefined,
	{ addProductLicense },
)(ProductLicenseAddModalForm);

