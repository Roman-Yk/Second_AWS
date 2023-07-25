import { userLicenseGetAllByLicense, UserLicense } from "@tms/api";
import { onlyLastFetchResult } from "@tms/api/utils/";
import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { batch } from 'react-redux';

import { createLicensesSlice } from '@tms/shared/slices/licenses';
import { createClientsSlice } from '@tms/shared/slices/clients';
import { createUserLicensesSlice } from '@tms/shared/slices/userLicenses';
import { createUserLicenseHardwaresSlice } from '@tms/shared/slices/computers';

export const licenses = createLicensesSlice('licenses');
export const clients = createClientsSlice('clients');
export const userLicenses = createUserLicensesSlice('userLicenses');
export const computers = createUserLicenseHardwaresSlice('computers');


export const userLicensesReducers = {
	licenses: licenses.reducer,
	clients: clients.reducer,
	userLicenses: userLicenses.reducer,
	computers: computers.reducer,
}


interface InitialState {
	isFetching: boolean;
	isFetchingError: boolean;
}


const initialState: InitialState = {
	isFetching: false,
	isFetchingError: false,
};


const usersLicenses = createSlice({
	name: 'usersLicenses',
	initialState: initialState,
	reducers: {
		fetchingPending: (state) => {
			return {
				...state,
				isFetching: true,
			};
		},
		fetchingSuccess: (state) => {
			return {
				...state,
				isFetching: false,
			};
		},
		fetchingError: (state) => {
			return {
				...state,
				isFetching: false,
				isFetchingError: true,
			};
		},
	},
});


export const createUserLicense = (userLicense, client, license) => (dispatch) => {
	batch(() => {
		dispatch(clients.actions.added(client));
		dispatch(userLicenses.actions.added(userLicense));
		dispatch(licenses.actions.added(license));
	})
}


export const updateClientAndUserLicense = (/*client, */userLicense) => (dispatch) => {
	batch(() => {
		// dispatch(clients.actions.updated(client));
		dispatch(userLicenses.actions.updated(userLicense));
	});
}


const usersLicensesGetOnce = onlyLastFetchResult(userLicenseGetAllByLicense);
export const loadLicenses = (licenseId: number) => (dispatch) => {
	dispatch(usersLicenses.actions.fetchingPending());
	usersLicensesGetOnce({ license_id: licenseId }).then(json => {
		if (json === undefined) return;
		batch(() => {
			dispatch(licenses.actions.loaded(json.licenses));
			dispatch(clients.actions.loaded(json.clients));
			dispatch(computers.actions.loaded(json.computers));
			dispatch(userLicenses.actions.loaded(json.user_licenses));
			dispatch(usersLicenses.actions.fetchingSuccess());
		});
	}).catch(err => {
		dispatch(usersLicenses.actions.fetchingError());
	});
}

export default usersLicenses;