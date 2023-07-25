import { API_POST, ResponseAll } from "../utils";
import { License } from './license';

export interface UserLicense {
	id: number;
	key: string;
	count: number;
	current_count: number;
	license: License;
	time_created: string;
	time_login: string;
	trial_expiration_days: number;
}


export const userLicenseGetAllByUser = (data: {
	user_id: number;
}) => API_POST("/user-license/all/by-user", data);

export const userLicenseGetAllByLicense = (data: {
	license_id: number;
}) => API_POST("/user-license/all/by-license", data);

export const userLicenseGetAllMyLicenses = () => API_POST<ResponseAll<UserLicense>>("/user-license/all/my");

export const userLicenseAdd = (data: {
	user_id: number;
	license_id: number;
}) => API_POST("/user-license/add", data);

export const userLicenseUpdate = (data: any) => API_POST("/user-license/update", data);

export const userLicenseDelete = (data: {
	user_license_id: number;
}) => API_POST("/user-license/delete", data);

export const userLicenseEnable = (data: {
	user_license_id: number;
}) => API_POST("/user-license/enable", data);

export const userLicenseDisable = (data: {
	user_license_id: number;
}) => API_POST("/user-license/disable", data);


(window as any).userLicenseEnable = userLicenseEnable;