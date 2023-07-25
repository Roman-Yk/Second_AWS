import * as React from 'react';

import { clientGetAllForLicense } from "@tms/api";

import { ButtonModal } from '@tms/shared/components/ButtonModal';
import { ButtonPrimaryOutline } from '@tms/shared/components/Button/';
import { SelectFieldWithButton } from '@tms/shared/components/Form/';
import { withServerData, defaultShouldRefresh } from '@tms/shared/components/Form/';

import ClientAddModal from './ClientAddModal';


export const SelectClientField = withServerData({
	fetch: (props) => clientGetAllForLicense({ license_id: props.licenseId }).then(response => response.items),
	shouldRefetch: defaultShouldRefresh,
})((props) => {
	const handleItemAdd = React.useCallback((item) => {
		props.appendNewItem(item);
		props.onChange({ target: { name: props.name, value: item.id } });
	}, []);
	return (
		<SelectFieldWithButton
			{...props}
			placeholder={props.isFetching ? "Clients loading..." : props.placeholder}
			addons={
				// <ButtonModal
				// 	title="Add"
				// 	ButtonComponent={ButtonPrimaryOutline}
				// 	ModalComponent={ClientAddModal}
				// 	handleItemAdd={handleItemAdd}
				// />
				undefined
			}
		>
			{props.data ? props.data.map(client =>
				<option key={client.id} value={client.id}>
					{client.client_company ?
						`${client.client_company} (${client.first_name} ${client.last_name}, ${client.email})`
						:
						(
							client.first_name && client.last_name
							?
							`${client.first_name} ${client.last_name} (${client.email})`
							:
							client.email
						)
					}
				</option>
			) : undefined}
		</SelectFieldWithButton>
	);
});
