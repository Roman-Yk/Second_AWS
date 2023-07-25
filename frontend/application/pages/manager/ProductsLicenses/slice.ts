import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { licenseGetAllForManager, License } from '@tms/api';

interface InitialState {
	current?: number;
	isFetching: boolean;
	isFetchingError: boolean;
	byId: Record<number, any>;
	ids: Array<number>;
}

const initialState: InitialState = {
	current: undefined,
	isFetching: true,
	isFetchingError: false,
	byId: {},
	ids: [],
};


const productsLicenses = createSlice({
	name: 'productsLicenses',
	initialState: initialState,
	reducers: {
		fetchingPending: (state) => ({
			...state,
			isFetching: true,
		}),
		fetchingSuccess: (state, { payload }) => ({
			...state,
			isFetching: false,
			byId: payload.byId,
			ids: payload.ids,
		}),
		fetchingError: (state) => ({
			...state,
			isFetching: false,
			isFetchingError: true,
		}),
		selected: (state, { payload }) => ({
			...state,
			current: payload,
		}),
		added: (state, { payload }) => ({
			...state,
			ids: [...state.ids, payload.id],
			byId: {
				...state.byId,
				[payload.id]: payload,
			}
		}),
		deleted: (state, { payload }) => {
			delete state.byId[payload.id];
			return {
				...state,
				ids: state.ids.filter(item => item !== payload.id),
				byId: { ...state.byId }
			}
		},
	}
});


export const addProductLicense = createAction<License>(productsLicenses.actions.added.type);
export const deleteProductLicense = createAction<License>(productsLicenses.actions.deleted.type);
export const setCurrentProductLicense = createAction<number>(productsLicenses.actions.selected.type);


export const loadProductsLicenses = () => (dispatch) => {
	dispatch(productsLicenses.actions.fetchingPending());
	licenseGetAllForManager().then(json => {
		const ids = json.items.map(item => item.id);
		const byId = json.items.reduce((obj, item) => ({
			...obj,
			[item.id]: item,
		}), {});
		dispatch(productsLicenses.actions.fetchingSuccess({ byId, ids }));
		dispatch(setCurrentProductLicense(ids[0])); // select first product by default
	}).catch(err => {
		dispatch(productsLicenses.actions.fetchingError());
	});
}


export default productsLicenses;