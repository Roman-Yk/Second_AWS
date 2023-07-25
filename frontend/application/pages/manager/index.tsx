import 'regenerator-runtime/runtime';
import * as React from 'react';
import { useSelector } from 'react-redux'

import store from './store';

import Products from './ProductsLicenses/';
import UsersLicenses from './UsersLicenses/';

import { createApp } from '../../utils/createApp';


const App: React.FC<any> = () => {
	const currentProductLicenseId = useSelector((state: any) => state.productsLicenses.current);

	return (
		<div className="d-flex">
			<div className="col-md-4 mb-4">
				<Products />
			</div>

			<div className="col-md-8 mb-4">
				<UsersLicenses licenseId={currentProductLicenseId} />
			</div>
		</div>
	);
}


createApp(App, store);
