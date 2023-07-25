import * as React from 'react';
import './styles.scss';

import useClipboard from 'react-use-clipboard';
import { useTranslate } from 'react-polyglot';


export const LicenseKey = ({ licenseKey, features=null }) => {
	const t = useTranslate();
	const [ isCopied, setCopied ] = useClipboard(licenseKey, {
		successDuration: 2000,
	});

	const onClick = React.useCallback((e) => {
		setCopied();
		e.preventDefault();
		e.stopPropagation();
		return false;
	}, [ setCopied ]);

	return (
		<div className="m-0 license-key">
			<span className="license-key-title">
				<span className="license-key-title-left">{t("license_key.title")}:</span>
				<span
					className={`btn btn-${isCopied ? 'success' : 'outline-primary'} license-key-copy`}
					onClick={onClick}
				>
					{isCopied ? t("copied") : t("copy")}
				</span>
			</span>
			<span className="license-key-key">
				<code>
					{licenseKey}
				</code>
			</span>
			{features && <span className="license-key-footer">
				{features.join(', ')}
			</span>}
		</div>
	);
};
