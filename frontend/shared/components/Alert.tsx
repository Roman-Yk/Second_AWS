import * as React from 'react';


export interface useAlertResult {
	isShown: boolean;
	show: () => void;
	hide: () => void;
}

export const useAlert = (timeout): useAlertResult => {
	const [ isAlertShown, setIsAlertShown ] = React.useState(false);
	const [ alertTimeoutId, setAlertTimeoutId ] = React.useState<any>();

	const showAlert = React.useCallback(() => {
		setIsAlertShown(true);
		if (alertTimeoutId) {
			clearTimeout(alertTimeoutId);
			setAlertTimeoutId(undefined);
		}
		const newAlertTimeout = setTimeout(() => {
			setIsAlertShown(false);
		}, timeout);
		setAlertTimeoutId(newAlertTimeout);
	}, [alertTimeoutId]);

	const hideAlert = React.useCallback(() => {
		if (alertTimeoutId) {
			clearTimeout(alertTimeoutId);
			setAlertTimeoutId(undefined);
		}
		setIsAlertShown(false);
	}, [alertTimeoutId]);

	return {
		isShown: isAlertShown,
		show: showAlert,
		hide: hideAlert,
	}
}


export interface AlertProps {
	hide(): void;
	message: string;
	isShown: boolean;
}

const alertFabric = (title, className) => {
	return (props: AlertProps) => props.isShown ? (
		<div className={className} role="alert">
			<strong>{title}</strong> {props.message}
			<button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={props.hide}>
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
	) : null;
};

export const AlertSuccess = alertFabric("Success!", "alert alert-success alert-dismissible");
export const AlertDanger = alertFabric("Error!", "alert alert-danger alert-dismissible");
export const AlertWarning = alertFabric("Warning!", "alert alert-warning alert-dismissible");
export const AlertInfo = alertFabric("Info!", "alert alert-info alert-dismissible");
