import { API_POST, ResponseAll, ResponseAdd, ResponseDelete } from "../utils";


export interface AuthLogin {
	token: number;
}

export const authLogin = (data: {
	email: string;
	password: string;
}) => API_POST<{token: string}>(`/login`, data);

(window as any).__login = authLogin;
