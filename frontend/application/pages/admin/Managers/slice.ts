import { managerGetAll, managerAdd, Manager } from "@tms/api";
import { onlyLastFetchResult } from "@tms/api/utils/";
import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';


interface InitialState {
	isFetching: boolean;
	isFetchingError: boolean;
	byId: Record<number, Manager>;
	ids: Array<number>,
}


const initialState: InitialState = {
	isFetching: false,
	isFetchingError: false,
	byId: {},
	ids: [],
};


const managers = createSlice({
	name: 'managers',
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
			const newById = { ...state.byId };
			delete newById[payload.id];
			return {
				...state,
				ids: state.ids.filter(item => item !== payload.id),
				byId: { ...newById }
			};
		},
	},
});


const managersGetAllOnce = onlyLastFetchResult(managerGetAll);

export const loadManagers = () => (dispatch) => {
	dispatch(managers.actions.fetchingPending());
	managersGetAllOnce().then(json => {
		if (json === undefined) return;
		const ids = json.items.map(item => item.id);
		const byId = json.items.reduce((obj, item) => ({
			...obj,
			[item.id]: item,
		}), {});
		dispatch(managers.actions.fetchingSuccess({ byId, ids }));
	}).catch(err => {
		dispatch(managers.actions.fetchingError());
	});
}


export const addManager = createAction(managers.actions.added.type);
export const deleteManager = createAction(managers.actions.deleted.type);


export default managers;