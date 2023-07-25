import { API_POST, ResponseAll, ResponseAdd, ResponseDelete } from "../utils";


export interface Company {
	id: number;
	name: string;
}

export interface CompaniesAllResponse extends ResponseAll<Company> {}
export interface CompanyAddResponse extends ResponseAdd<Company> {}

export const companyGetAll = () => API_POST<CompaniesAllResponse>(`/company/all`);
export const companyAdd = (data: any) => API_POST<CompanyAddResponse>(`/company/add`, data);
export const companyDelete = (data: {
	company_id: number;
}) => API_POST<ResponseDelete>(`/company/delete`, data);
