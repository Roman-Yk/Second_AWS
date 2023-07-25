import * as React from 'react';

import { licenseTypeGetAll } from "@tms/api";

import { SelectField } from '@tms/shared/components/Form/';
import { withServerData, defaultShouldRefresh } from '@tms/shared/components/Form/';


export const SelectLicenseTypeField = withServerData({
	fetch: (props) => licenseTypeGetAll().then(response => response.items),
	shouldRefetch: defaultShouldRefresh,
})((props) => {
	return (
		<SelectField
			{...props}
			isFetching={props.isFetching}
		>
			{props.data ? props.data.map(item =>
				<option key={item.id} value={item.id}>{item.name}</option>
			) : undefined}
		</SelectField>
	);
}
);