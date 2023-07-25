import { API_POST, ResponseAll, ResponseAdd, ResponseDelete } from "../utils";
import { Product } from './product';


export enum LicenseTypes {
	PERMANENT = 1,
	SUBSCRIPTION = 2,
}

export interface LicenseType {
	id: LicenseTypes;
	name: string;
}

export interface License {
	id: number;
	name: string;

	type_id: LicenseTypes;
	trial_days: number;

	type?: LicenseType;
	product?: Product;
}


export const licenseTypeGetAll = () => API_POST<ResponseAll<LicenseType>>(`/license/type/all`);

export const licenseGetAll = (data: {
	product_id: number;
}) => API_POST<ResponseAll<License>>(`/license/all`, data);

export const licenseGetAllForManager = () => API_POST<ResponseAll<License>>("/license/all/for-manager");

export const licenseAdd = (data: any) => API_POST<ResponseAdd<License>>(`/license/add`, data);

export const licenseDelete = (data: {
	product_id: number;
}) => API_POST<ResponseDelete>(`/license/delete`, data);
