import * as React from 'react';

import { companyGetAll } from "@tms/api";

import { ButtonModal } from '@tms/shared/components/ButtonModal';
import { ButtonPrimaryOutline } from '@tms/shared/components/Button/';
import { SelectFieldWithButton } from '@tms/shared/components/Form/';
import { withServerData, defaultShouldRefresh } from '@tms/shared/components/Form/';

import CompanyAddModal from './CompanyAddModal';


export const SelectCompanyField = withServerData({
	fetch: (props) => companyGetAll().then(response => response.items),
	shouldRefetch: defaultShouldRefresh,
})((props) => {
	const handleItemAdd = React.useCallback((item) => {
		props.appendNewItem(item);
		props.onChange({ target: { name: props.name, value: item.id } });
	}, []);
	return (
		<SelectFieldWithButton
			{...props}
			placeholder={props.isFetching ? "Companies loading..." : props.placeholder}
			addons={
				<ButtonModal
					title="Add"
					ButtonComponent={ButtonPrimaryOutline}
					ModalComponent={CompanyAddModal}
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
