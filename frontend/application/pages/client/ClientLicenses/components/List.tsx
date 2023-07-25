import * as React from 'react';
import { useSelector } from 'react-redux'


import { ListLoading, ListMessage } from '@tms/shared/components/ListStates';
import ClientLicenseItem from './Item';
import { useTranslate } from 'react-polyglot';


const ProductsList: React.FC = () => {
	const t = useTranslate();
	const isFetching = useSelector((state: any) => state.clientLicenses.isFetching);
	const clientLicensesIds = useSelector((state: any) => state.clientLicenses.ids);

	if (isFetching) {
		return (
			<ListLoading />
		);
	}

	if (clientLicensesIds.length === 0) {
		return (
			<ListMessage message={t("client.licenses.not_found")} />
		);
	}

	return clientLicensesIds.map((clientLicenseId) => (
		<ul className="list-group mb-2" key={clientLicenseId}>
			<ClientLicenseItem clientLicenseId={clientLicenseId} />
		</ul>
	));
};


export default ProductsList;