import * as React from 'react';
import { useTranslate } from 'react-polyglot';

import { productAdd } from "@tms/api";

import { ModalAddForm } from '@tms/shared/components/Modal/';
import {
	FormGroup, FormRow, InputField, SelectField, TextareaField,
	Form, withForm, withServerData,
} from '@tms/shared/components/Form/';


interface ProductAddModalProps {
	onModalClose(): void;
	handleItemAdd(data: any): void;
}

const ProductAddModal = (props) => {
	const t = useTranslate();
	return (
		<ModalAddForm
			title={t("modals.product_add.title")}
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
					title={t("modals.product_add.fields.name")}
					autoFocus={true}
					required
				/>
				<TextareaField
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					type="text"
					name="description"
					title={t("modals.product_add.fields.description")}
					required
				/>
			</Form>
		</ModalAddForm>
	);
};


const ProductAddModalForm = withForm<ProductAddModalProps>({
	onAsyncSubmit(values) {
		return productAdd(values);
	},

	onSuccess(props, data) {
		props.handleItemAdd(data.item);
		props.onModalClose();
	}
})(ProductAddModal);


export default ProductAddModalForm;