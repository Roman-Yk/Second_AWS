import * as React from 'react';

import { connect } from 'react-redux';
import { loadClientComputers } from './slice';

import Title from '@tms/shared/components/Title';
import ClientComputersList, { ClientComputersListNotSelectedProduct } from './components/List';

import './styles.scss';
import { useTranslate } from 'react-polyglot';


export type ClientComputersProps = {
	clientLicenseId: number | void;
	loadClientComputers?: (clientLicenseId: number) => void;
};

const ClientComputers: React.FC<ClientComputersProps> = ({ clientLicenseId, loadClientComputers }) => {
	const t = useTranslate();
	React.useEffect(() => {
		if (typeof clientLicenseId === 'number') {
			loadClientComputers(clientLicenseId);
		}
	}, [clientLicenseId]);

	return (
		<React.Fragment>
			<Title text={t("client.computers.title")} />
			{clientLicenseId
				?
					<ClientComputersList clientLicenseId={clientLicenseId} />
				:
					<ClientComputersListNotSelectedProduct />
			}
		</React.Fragment>
	);
};


export default connect(
	() => ({}),
	{ loadClientComputers }
)(ClientComputers);