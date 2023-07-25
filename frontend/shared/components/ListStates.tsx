import * as React from 'react';
import { useTranslate } from 'react-polyglot';


export const ListLoading = () => {
	const t = useTranslate();
	return (
		<ul className="list-group mb-3">
			<li className="list-group-item d-flex justify-content-center align-items-center p-5">
				<div className="spinner-border" role="status">
					<span className="sr-only">{t("loading")}...</span>
				</div>
				<h5 className="m-0 ml-3 text-muted">{t("loading")}...</h5>
			</li>
		</ul>
	);
}


export const ListMessage = ({ message = undefined, children = undefined }) => {
	return (
		<div className="list-group">
			<a className="list-group-item text-center text-muted p-0">
				<h5 className="p-5">{message || children}</h5>
			</a>
		</div>
	);
}