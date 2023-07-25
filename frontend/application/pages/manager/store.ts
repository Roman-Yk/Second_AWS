import { createApplicationStore } from '../../utils/storeCreator';

import productsLicenses from './ProductsLicenses/slice';
import usersLicenses, { userLicensesReducers } from './UsersLicenses/slice';


export default createApplicationStore({
	productsLicenses: productsLicenses.reducer,
	usersLicenses: usersLicenses.reducer,
	...userLicensesReducers,
});
