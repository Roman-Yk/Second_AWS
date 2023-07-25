import * as React from 'react';
import { useTranslate } from 'react-polyglot';


export const Loader = () => {
	const t = useTranslate();
	return (
		<div className="d-flex justify-content-center align-items-center p-5">
			<div className="spinner-border" role="status">
				<span className="sr-only">{t("loading")}...</span>
			</div>
			<h5 className="m-0 ml-3 text-muted">{t("loading")}...</h5>
		</div>
	);
};