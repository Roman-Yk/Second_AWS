import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';


export const createApplicationStore = (rawReducers) => {
	const reducers = combineReducers(rawReducers);

	const middlewares = applyMiddleware(
		thunk,
	);

	const middlewaresWithDevtools = composeWithDevTools(middlewares);

	return createStore(reducers, middlewaresWithDevtools);
}


// export default createApplicationStore;