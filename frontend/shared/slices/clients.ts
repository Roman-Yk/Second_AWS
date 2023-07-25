import { createSimpleSlice } from './utils';


export const createClientsSlice = (name = 'clients') => {
	return createSimpleSlice(name);
}
