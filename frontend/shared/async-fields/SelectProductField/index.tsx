import * as React from 'react';
import { useTranslate } from 'react-polyglot';

import { productGetAll } from "@tms/api";

import { ButtonModal } from '@tms/shared/components/ButtonModal';
import { ButtonPrimaryOutline } from '@tms/shared/components/Button/';
import { SelectFieldWithButton } from '@tms/shared/components/Form/';
import { withServerData, defaultShouldRefresh } from '@tms/shared/components/Form/';

import ProductAddModal from './ProductAddModal';


export const SelectProductField = withServerData({
	fetch: (props) => productGetAll().then(response => response.items),
	shouldRefetch: defaultShouldRefresh,
})((props) => {
	const t = useTranslate();
	const handleItemAdd = React.useCallback((item) => {
		props.appendNewItem(item);
		props.onChange({ target: { name: props.name, value: item.id } });
	}, []);
	return (
		<SelectFieldWithButton
			{...props}
			isFetching={props.isFetching}
			addons={
				<ButtonModal
					title={t("add")}
					ButtonComponent={ButtonPrimaryOutline}
					ModalComponent={ProductAddModal}
					handleItemAdd={handleItemAdd}
				/>
			}
		>
			{props.data ? props.data.map(item =>
				<option key={item.id} value={item.id}>{item.name}</option>
			) : undefined}
		</SelectFieldWithButton>
	);
});
