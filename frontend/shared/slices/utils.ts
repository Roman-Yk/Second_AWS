import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { createSelector, Selector, OutputParametricSelector } from 'reselect';


type RecordType = {
	id: number;
	[key: string]: any;
};


export const mapIdsToObj = (ids: number[], obj: RecordType) => ids.map(id => obj[id]);
export const getById = (obj: RecordType, id: number) => obj[id];
export const getId = (state, props) => props.id as number;

type DefaultGetter = (state: any, props: any) => any;
type DefaultSelector = OutputParametricSelector<any, any, any, any>;

interface DefaultSelectors {
	getObj: DefaultGetter;
	getIds: DefaultGetter;
	itemsSelector: DefaultSelector;
	itemSelector: DefaultSelector;
}

const emptyAdditionalSelectors = (selectors: DefaultSelectors) => {
	return {} as any;
};


function createSimpleSlice<AdditionalSelectors>(
	sliceName,
	additionalSelectorsGenerator: (selectors: DefaultSelectors) => AdditionalSelectors = emptyAdditionalSelectors
) {
	type InitialStateType = {
		byId: Record<number, RecordType>;
		ids: Array<number>;
	}

	const initialState: InitialStateType = {
		byId: {},
		ids: [],
	};

	const slice = createSlice({
		name: sliceName,
		initialState: initialState,
		reducers: {
			loaded: (state, { payload }) => {
				const ids = payload.map(item => item.id);
				const byId = payload.reduce((obj, item) => ({
					...obj,
					[item.id]: item,
				}), {});

				return {
					...state,
					byId: byId,
					ids: ids,
				};
			},
			concatanated: (state, { payload }) => {
				const ids = payload.map(item => item.id);
				const byId = payload.reduce((obj, item) => ({
					...obj,
					[item.id]: item,
				}), {});

				return {
					...state,
					byId: {...state.byId, ...byId},
					ids: [...state.ids, ...ids],
				};
			},
			added: (state, { payload }) => {
				const updatedState = {};
				if (state.byId[payload.id] === undefined) {
					updatedState['ids'] = [payload.id, ...state.ids];
					updatedState['byId'] = {
						...state.byId,
						[payload.id]: payload,
					}
				}
				return {
					...state,
					...updatedState,
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

	const getObj = (state, props) => state[sliceName].byId;
	const getIds = (state, props) => state[sliceName].ids;
	const itemsSelector = createSelector([getIds, getObj], mapIdsToObj);
	const itemSelector = createSelector([getObj], getById);

	const defaultSelectors: DefaultSelectors = { getObj, getIds, itemsSelector, itemSelector };
	const additionalSelectors = additionalSelectorsGenerator(defaultSelectors);

	const newSlice = {
		...slice,
		selectors: { ...defaultSelectors, ...additionalSelectors }
	};

	return newSlice;
}


export { createSimpleSlice };





// type ExtendableObject = {a: number, b: number};

// const defaultExtender = function(data: ExtendableObject) {
// 	return {};
// };

// const extendable = <T>(extender: (data: ExtendableObject) => T) => {
// 	const result: ExtendableObject = {a: 1, b: 2};
// 	const extended = extender(result);
// 	return {
// 		...result,
// 		...extended
// 	};
// }

// interface ex {
// 	c: any;
// }
// const a = extendable((data) => ({ c: data.a + data.b }));

