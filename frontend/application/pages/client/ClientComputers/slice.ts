import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { computerGetAllByUserLicense, Computer } from "@tms/api";
import { onlyLastFetchResult } from "@tms/api/utils/";


interface InitialState {
	isFetching: boolean;
	isFetchingError: boolean;
	byId: Record<number, Computer>;
	ids: Array<number>,
}


const initialState: InitialState = {
	isFetching: false,
	isFetchingError: false,
	byId: {},
	ids: [],
};


const userComputers = createSlice({
	name: 'userComputers',
	initialState: initialState,
	reducers: {
		fetchingPending: (state, { payload }) => {
			return {
				...state,
				isFetching: true,
			};
		},
		fetchingSuccess: (state, { payload }) => {
			return {
				...state,
				isFetching: false,
				byId: payload.byId,
				ids: payload.ids,
			};
		},
		fetchingError: (state, { payload }) => {
			return {
				...state,
				isFetching: false,
				isFetchingError: true,
			};
		},
		added: (state, { payload }) => {
			return {
				...state,
				ids: [payload.id, ...state.ids],
				byId: {
					...state.byId,
					[payload.id]: payload,
				}
			};
		},
		deleted: (state, { payload }) => {
			delete state.byId[payload.id];
			return {
				...state,
				ids: state.ids.filter(item => item !== payload.id),
				byId: { ...state.byId }
			};
		},
		updated: (state, { payload }) => {
			return {
				...state,
				ids: [...state.ids],
				byId: {
					...state.byId,
					[payload.id]: {
						...state.byId[payload.id],
						...payload,
					}
				}
			};
		},
	},
});


const computerGetAllByUserLicenseOnce = onlyLastFetchResult(computerGetAllByUserLicense);

export const updateComputer = createAction<any>(userComputers.actions.updated.type);

export const loadClientComputers = (clientLicenseId: number) => (dispatch) => {
	dispatch(userComputers.actions.fetchingPending());
	computerGetAllByUserLicenseOnce({ user_license_id: clientLicenseId }).then(json => {
		if (json === undefined) return;
		const ids = json.items.map(item => item.id);
		const byId = json.items.reduce((obj, item) => ({
			...obj,
			[item.id]: item,
		}), {});
		dispatch(userComputers.actions.fetchingSuccess({ byId, ids }));
	}).catch(err => {
		dispatch(userComputers.actions.fetchingError());
	});
}


export default userComputers;