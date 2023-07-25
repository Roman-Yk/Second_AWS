import { API_POST, ResponseAll, ResponseDelete } from "../utils";


export interface User {
	id: number;
	// name: string;
	first_name: string;
	last_name: string;
	email: string;
	company: any;
	phone?: string;
}

export interface Client extends User {
	client_company: string;
}

export interface Manager extends User {
	usersCount: number;
}


export const userUpdatePersonal = (data: {
	first_name: string;
	last_name: string;
	email: string;
}) => API_POST<any>("/user/update-personal", data);

export const usersSearch = (data: { term: string }) => API_POST<ResponseAll<User>>("/user/search", data);
export const usersSearchIgnoreLicenseUsers = (data: {
	term: string,
	license_id: number
}) => API_POST<ResponseAll<User>>("/user/search/ignore-license-users", data);

export const userUpdatePassword = (data: {
	current_password: string,
	new_password: string,
	new_password_repeat: string,
}) => API_POST<any>("/user/update-password", data);


export const clientGetAll = () => API_POST<ResponseAll<Client>>("/client/all");
export const clientGetAllForLicense = (data: {
	license_id: number;
}) => API_POST<ResponseAll<Client>>("/client/for-license", data);
export const clientAdd = (data: any) => API_POST("/client/add", data);
export const clientUpdate = (data: any) => API_POST("/client/update", data);
export const clientDelete = (data: {
	user_id: number;
}) => API_POST<ResponseDelete>("/client/delete", data);


export const managerGetAll = () => API_POST<ResponseAll<Manager>>("/manager/all");
export const managerAdd = (data) => API_POST("/manager/add", data);
export const managerDelete = (data: {
	user_id: number;
}) => API_POST<ResponseDelete>("/manager/delete", data);


(window as any).clientGetAll = clientGetAll;
