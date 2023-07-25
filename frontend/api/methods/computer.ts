import { API_POST, ResponseAll, ResponseAdd, ResponseDelete, ResponseUpdate } from "../utils";

// export interface Hardware {
// 	id: number;
// }

export interface Computer {
	id: number;
	// name: string;
	user_license_id: number;
	is_active: boolean;
	h_id: string;
	h_description: string;

	ip_address: string;
	logged_username: string;
	os_name: string;
}


export const computerGetAllByUserLicense = (data: {
	user_license_id: number;
}) => API_POST<ResponseAll<Computer>>("/computer/all/by-user-license", data);

export const computerUpdateDescription = (data: {
	id: number;
	h_description: string;
}) => API_POST<any>("/computer/update-description", data);

export const computerDisableById = (data: {
	computer_id: number;
}) => API_POST<any>("/computer/disable", data);

export const computerEnableById = (data: {
	computer_id: number;
}) => API_POST<any>("/computer/enable", data);

export const computerDeactivateById = (data: {
	computer_id: number;
}) => API_POST<ResponseUpdate<{is_active: boolean}>>(`/computer/deactivate-by-id`, data);

export const computerDeactivateMyById = (data: {
	computer_id: number;
}) => API_POST<ResponseUpdate<{is_active: boolean}>>(`/computer/deactivate-my-by-id`, data);


// export const computerAdd = (data: any) => API_POST<ComputerAddResponse>("/computer/add", data);
// export const computerDelete = (data: any) => API_POST<ResponseDelete>("/computer/delete", data);
