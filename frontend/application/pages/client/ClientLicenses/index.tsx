import * as React from 'react';

import { connect } from 'react-redux'
import { loadClientLicenses } from './slice';

import Title from '@tms/shared/components/Title';
import ClientLicensesList from './components/List';

import './styles.scss';
import { useTranslate } from 'react-polyglot';


interface ClientLicensesAppProps {
	loadClientLicenses?: () => void;
}


const ClientLicensesApp: React.FC<ClientLicensesAppProps> = (props) => {
	const t = useTranslate();

	React.useEffect(() => {
		props.loadClientLicenses();
	}, []);

	return (
		<React.Fragment>
			<Title text={t("client.licenses.title")} />
			<ClientLicensesList />
		</React.Fragment>
	);
}


export default connect(
	undefined,
	{ loadClientLicenses },
)(ClientLicensesApp);