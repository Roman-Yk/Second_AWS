import { createApplicationStore } from '../../utils/storeCreator';

import managers from './Managers/slice';


export default createApplicationStore({
	managers: managers.reducer,
});
