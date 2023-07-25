import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { userLicenseGetAllMyLicenses, License } from '@tms/api';


interface InitialState {
	current: number;
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


const clientLicenses = createSlice({
	name: 'clientLicenses',
	initialState: initialState,
	reducers: {
		fetchingPending: (state, action) => ({
			...state,
			isFetching: true,
		}),
		fetchingSuccess: (state, { payload }) => ({
			...state,
			isFetching: false,
			byId: payload.byId,
			ids: payload.ids,
		}),
		fetchingError: (state, action) => ({
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
			ids: [payload.id, ...state.ids],
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
	},
});


export const setCurrentClientLicense = createAction<number>(clientLicenses.actions.selected.type);


export const loadClientLicenses = () => (dispatch) => {
	dispatch(clientLicenses.actions.fetchingPending());
	userLicenseGetAllMyLicenses().then(json => {
		const ids = json.items.map(item => item.id);
		const byId = json.items.reduce((obj, item) => ({
			...obj,
			[item.id]: item,
		}), {});
		dispatch(clientLicenses.actions.fetchingSuccess({ byId, ids }));
		dispatch(setCurrentClientLicense(ids[0])); // select first license by default
	}).catch(err => {
		dispatch(clientLicenses.actions.fetchingError());
	});
}


export default clientLicenses;