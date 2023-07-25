import { createSelector } from 'reselect';
import { createSimpleSlice } from './utils';


export const createUserLicenseHardwaresSlice = (name = 'computers') => {
	const slice = createSimpleSlice(
		name,
		function extendSelectors(defaultSelectors) {
			return {
				makeUserLicenseHardwaresByUserLicenseSelector: () => createSelector(
					[ defaultSelectors.itemsSelector, (state, props) => props.userLicenseId ],
					(items, userLicenseId) => items.filter(item => item.user_license_id === userLicenseId)
				),
				
			}
		}
	);

	return slice;
}
