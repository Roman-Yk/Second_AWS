import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslate } from 'react-polyglot';

import { ListLoading, ListMessage } from '@tms/shared/components/ListStates';
import LicenseItem from './Item';


export const UsersLicensesListNotSelectedProduct = () => {
	const t = useTranslate();
	return (
		<ListMessage
			message={t("manager.client_licenses.select_product")}
		/>
	);
}


export const UsersLicensesListNotLicenses = ({ license }) => {
	const t = useTranslate();
	return (
		<ListMessage>
			{t("manager.client_licenses.not_found", {
				license_product_name: license.product.name,
				license_name: license.name,
			})}
		</ListMessage>
	);
}


const LicensesList = (props) => {
	const userLicensesIds = useSelector((state: any) => state.userLicenses.ids);
	const isFetching = useSelector((state: any) => state.usersLicenses.isFetching);
	const license = useSelector((state: any) => state.productsLicenses.byId[props.licenseId]);

	if (isFetching) {
		return (
			<ListLoading />
		);
	}

	if (userLicensesIds.length === 0) {
		return <UsersLicensesListNotLicenses license={license} />
	}

	return (
		<ul className="list-group">
			{userLicensesIds.map(userLicenseId => (
				<LicenseItem key={userLicenseId} userLicenseId={userLicenseId} />
			))}
		</ul>
	);
};


export default LicensesList;