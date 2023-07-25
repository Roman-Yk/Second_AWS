import * as React from 'react';
import { connect } from 'react-redux';

import { ListLoading, ListMessage } from '@tms/shared/components/ListStates';
import ClientComputer from './Item';
import { useTranslate } from 'react-polyglot';


export const ClientComputersListNotSelectedProduct = () => {
	const t = useTranslate();
	return (
		<ListMessage
		// message="Please select a license"
			message={t("client.computers.select_a_license")}
		/>
	);
}


export const ClientComputersListNotClientComputers = ({ clientLicense }) => {
	const t = useTranslate();
	return (
		<ListMessage>
			{t("client.computers.license_has_not_been_activated")}
		</ListMessage>
			// Computers for license '<strong>{clientLicense.license.product.name} | {clientLicense.license.name}</strong>' not found!
	);
}


const ClientComputersList = connect(
	(state, ownProps) => ({
		clientComputersIds: state.clientComputers.ids,
		isFetching: state.clientComputers.isFetching,
		clientLicense: state.clientLicenses.byId[ownProps.clientLicenseId]
	}),
)(({ clientLicense, clientComputersIds, isFetching }) => {
	if (isFetching) {
		return (
			<ListLoading />
		);
	}

	if (clientComputersIds.length === 0) {
		return <ClientComputersListNotClientComputers clientLicense={clientLicense} />
	}

	return (
		<div className="list-group">
			{clientComputersIds.map(clientComputerId => (
				<ClientComputer key={clientComputerId} clientComputerId={clientComputerId} />
			))}
		</div>
	);
});


export default ClientComputersList;