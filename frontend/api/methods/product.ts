import { API_POST, ResponseAll, ResponseAdd, ResponseDelete } from "../utils";


export interface Product {
	id: number;
	name: string;
	description: string;
}

export type Feature = {
	id: number;
	product_id: number;
	name: string;
	description: string;
};


export const productFeaturesGetAll = (data: any) => API_POST<ResponseAll<Feature>>(`/product/features/all`, data);
export const productGetAll = () => API_POST<ResponseAll<Product>>(`/product/all`);
export const productAdd = (data: any) => API_POST<ResponseAdd<Product>>(`/product/add`, data);
export const productDelete = (data: {
	product_id: number;
}) => API_POST<ResponseDelete>(`/product/delete`, data);
