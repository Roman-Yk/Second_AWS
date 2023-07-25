import 'regenerator-runtime/runtime';
import * as React from 'react';
import { useSelector } from 'react-redux'

import { createApp } from '../../utils/createApp';
import store from './store';

import ClientLicenses from './ClientLicenses/';
import ClientComputers from './ClientComputers/';

import './styles.scss';


const App = () => {
	const clientLicenseId = useSelector(state => state.clientLicenses.current);
	return (
		<div className="row">
			<div className="col-md-5 mb-4">
				<ClientLicenses />
			</div>
			<div className="col-md-7 mb-4">
				<ClientComputers clientLicenseId={clientLicenseId} />
			</div>
		</div>
	);
};


createApp(App, store);
