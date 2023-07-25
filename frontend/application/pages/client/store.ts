import { createApplicationStore } from '../../utils/storeCreator';

// import clientLicenses from './blocks/ClientLicenses/reducer';
import clientLicenses from './ClientLicenses/slice';
import clientComputers from './ClientComputers/slice';

// export const setCurrentCompany = (id) => ({
// 	type: SET_CURRENT_COMPANY,
// 	payload: id,
// });

// const initialState = {
// 	currentCompany: null,
// };

// function reducer(state = initialState, { type, payload }) {
// 	if (type === SET_CURRENT_COMPANY) {
// 		return {
// 			...state,
// 			currentCompany: payload,
// 		}
// 	}
// 	return state;
// }

export default createApplicationStore({
	clientLicenses: clientLicenses.reducer,
	clientComputers: clientComputers.reducer,
	// client: reducer,
});