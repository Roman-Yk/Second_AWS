import * as React from 'react';

export * from './useApiRequest';


export interface ResponseAll<T> {
	items: Array<T>;
}

export interface ResponseAdd<T> {
	success: boolean;
	item: T;
}

export interface ResponseUpdate<T = any> {
	success: boolean;
	item?: T;
}

export interface ResponseDelete {
	success: boolean;
}


export const handleResponseError = res => {
	if (res.error) {
		throw res;
	}
	return res;
}

export const API_AS_JSON = res => {
	if (res.status >= 500) {
		throw new Error(`Server error ${res.status}: ${res.statusText}. Please try again later or contact developers to fix this problem.`)
	}
	return res.json().then(handleResponseError);
}

const getToken = () => window.location.search.slice(1)
	.split('&')
	.map(i => i.split("="))
	.reduce((curr, item) => {
		curr[item[0]] = item[1];
		return curr;
	}, {}) as any

export const API_AS_TEXT = res => res.text().then(handleResponseError);
const w = (window as any);
// export const API_BASE_URL = (w.LICENSE_SERVER_CONFIG && w.LICENSE_SERVER_CONFIG.url) || '';
// export const API_PREFIX = API_BASE_URL + "/api";
// export const API_PREFIX = "/api";
export const API_PREFIX = "api";

export const API_GET = (url) => fetch(API_PREFIX + url).then(API_AS_JSON);

export const API_POST = <T = any>(url: string, data?: any) => fetch(API_PREFIX + url, {
	method: "POST",
	headers: {
		'Content-Type': 'application/json',
		// Authorization: `JWT ${(window as any).LICENSE_SERVER_CONFIG.token}`,
		// Authorization: `JWT ${(window as any).LICENSE_SERVER_CONFIG.token}`,
		Authorization: `JWT ${getToken().access_token}`,
	},
	body: JSON.stringify(data),
}).then(API_AS_JSON) as Promise<T>;


// type TT = <T extends (...args: any[]) => any>;
function logDuration<T extends (...args: any[]) => any>(func: T): (...funcArgs: Parameters<T>) => ReturnType<T> {
	const funcName = func.name;

	// Return a new function that tracks how long the original took
	return (...args: Parameters<T>): ReturnType<T> => {
		console.time(funcName);
		const results = func(...args);
		console.timeEnd(funcName);
		return results;
	};
}


export function onlyLastFetchResult<T extends (...args: any[]) => any>(fetcher: T): (...funcArgs: Parameters<T>) => ReturnType<T> {
	let currentTime = 0;

	return (...args: Parameters<T>): ReturnType<T> => {
		const startTime = Date.now();
		currentTime = startTime;
		return fetcher(...args).then(result => {
			if (currentTime !== startTime) return undefined;
			return result;
		});
	}
}

window.location.search
	.slice(1)
	.split('&')
	.map(i => i.split("="))
	.reduce((curr, item) => {
		curr[item[0]] = item[1];
		return curr;
	}, {})