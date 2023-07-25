import * as React from 'react';


interface UseApiRequestState {
	response: any;
	isFetched: boolean;
	isFetchingError: boolean;
	isFetching: boolean;
}

const initialState: UseApiRequestState = {
	response: undefined,
	isFetched: false,
	isFetchingError: false,
	isFetching: true,
};

const IS_FETCHED = 'IS_FETCHED';
const IS_FETCHING = 'IS_FETCHING';
const SET_RESPONSE = 'SET_RESPONSE';
const UPDATE_RESPONSE = 'UPDATE_RESPONSE';
const FETCHING_PENDING = 'FETCHING_PENDING';
const FETCHING_SUCCESS = 'FETCHING_SUCCESS';
const FETCHING_ERROR = 'FETCHING_ERROR';

interface DispatchWithAction extends React.DispatchWithoutAction {
	type: string;
	payload: any;
}

function reducer(state, { type, payload }: DispatchWithAction) {
	switch (type) {
		case IS_FETCHED:
			return {
				...state,
				isFetched: payload,
			};
		case IS_FETCHING:
			return {
				...state,
				isFetching: payload,
			};
		case SET_RESPONSE:
			return {
				...state,
				response: payload
			};
		case UPDATE_RESPONSE:
			return {
				...state,
				response: payload
			};
		case FETCHING_PENDING:
			return {
				...state,
				isFetching: true,
				isFetched: false,
				response: payload
			};
		case FETCHING_SUCCESS:
			return {
				...state,
				isFetching: false,
				isFetched: true,
				response: payload
			};
	}
	return state;
}

export function useApiRequest(requester) {
	const [ state, dispatch ] = React.useReducer<React.Reducer<UseApiRequestState, any>>(reducer, initialState);
	const setIsFetching = React.useCallback((isFetching) => {
		dispatch({type: IS_FETCHING, payload: isFetching});
	}, [state.response]);

	const setResponse = React.useCallback((response) => {
		dispatch({type: SET_RESPONSE, payload: response});
	}, [state.response]);

	const updateResponse = React.useCallback((callback: any) => {
		dispatch({type: UPDATE_RESPONSE, payload: callback(state.response)});
	}, [state.response]);

	const fetchingSuccess = React.useCallback((response) => {
		dispatch({type: FETCHING_SUCCESS, payload: response});
	}, [state.response]);

	const fetchingPending = React.useCallback(() => {
		dispatch({type: FETCHING_PENDING});
	}, [state.response]);

	React.useEffect(() => {
		fetchingPending();
		requester().then((res) => {
			fetchingSuccess(res);
		});
	}, [ requester ]);

	return {
		isFetched: state.isFetched,
		isFetching: state.isFetching,
		setIsFetching: setIsFetching,
		setResponse: setResponse,
		updateResponse: updateResponse,
		response: state.response,
	}
}
