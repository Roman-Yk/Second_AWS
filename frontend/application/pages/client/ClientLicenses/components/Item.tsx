import * as React from 'react';

import { connect } from 'react-redux';
// import { setCurrentClientLicense } from '../actions';
import slice from '../slice';

import { LicenseKey } from '@tms/shared/blocks/LicenseKey';
import { LicenseTypes } from '@tms/api';
import { useTranslate } from 'react-polyglot';


const activeClass = "active";


const LicenseItemWrapper = ({ children, onClick, clientLicenseData, isActive }) => {
	const t = useTranslate();
	const locale = t._polyglot.currentLocale;
	let classPrefix = isActive ? 'light' : 'primary';

	return (
		<li onClick={onClick} className={`p-3 list-group-item list-group-item-action d-flex justify-content-between align-items-start ${isActive ? activeClass : ''}`}>
			<div>
				<h6 className="d-flex flex-row justify-content-between align-items-center my-0">
					<span>{clientLicenseData.license.product.name} | {clientLicenseData.license.name}</span>
					<div className="btn-group btn-group-sm">
						<a className="btn btn-sm btn-success" target="_blank" href={clientLicenseData.license.product.software_url}>
							{t("client.licenses.list.item.download_app", {
								software_version: clientLicenseData.license.product.software_version
							})}
						</a>
						<a className="btn btn-sm btn-secondary" href={`/files/Diamond-${locale}.pdf`}>
							{t("client.licenses.list.item.documentation")}
						</a>
					</div>
				</h6>
				<small>
					<p className="m-0 mt-2 mb-1">{clientLicenseData.license.product.description}</p>
					{children}
					<div className="mb-2"></div>
					<LicenseKey licenseKey={clientLicenseData.key} />
				</small>
			</div>
		</li>
	);
}


const LicenseItemPermanent = ({ onClick, clientLicenseData, isActive }) => {
	const t = useTranslate();
	return (
		<LicenseItemWrapper onClick={onClick} clientLicenseData={clientLicenseData} isActive={isActive}>
			<ul>
				<li>{t("type")}: <strong>{clientLicenseData.license.type.name}</strong></li>
				<li>{t("client.licenses.list.item.computers_count")}: <strong>{clientLicenseData.current_count}/{clientLicenseData.count}</strong></li>
			</ul>
		</LicenseItemWrapper>
	);
}

const LicenseItemSubscription = ({ onClick, clientLicenseData, isActive }) => {
	const t = useTranslate();
	return (
		<LicenseItemWrapper onClick={onClick} clientLicenseData={clientLicenseData} isActive={isActive}>
			<ul>
				<li>{t("type")}: <strong>{clientLicenseData.license.type.name}</strong></li>
				<li>{t("client.licenses.list.item.computers_count")}: <strong>{clientLicenseData.current_count}/{clientLicenseData.count}</strong></li>
			</ul>
		</LicenseItemWrapper>
	);
}

const LicenseItemTrial = ({ onClick, clientLicenseData, isActive }) => {
	const t = useTranslate();
	return (
		<LicenseItemWrapper onClick={onClick} clientLicenseData={clientLicenseData} isActive={isActive}>
			<ul>
				<li>{t("type")}: <strong>{clientLicenseData.license.type.name}</strong></li>
				<li>{t("client.licenses.list.item.computers_count")}: <strong>{clientLicenseData.current_count}/{clientLicenseData.count}</strong></li>
				<li>{t("client.licenses.list.item.trial_expiration_days")}: <strong>{clientLicenseData.trial_expiration_days}</strong></li>
			</ul>
		</LicenseItemWrapper>
	);
};


const productComponentByTypeId: Record<LicenseTypes, any> = {
	[LicenseTypes.PERMANENT]: LicenseItemPermanent,
	[LicenseTypes.SUBSCRIPTION]: LicenseItemSubscription,
};


class LicenseItem extends React.Component<any, any> {
	onClick = () => {
		this.props.setCurrentClientLicense(this.props.clientLicenseId);
	}

	render() {
		const { clientLicenseData } = this.props;

		const LicenseItemComponent = productComponentByTypeId[clientLicenseData.license.type.id];

		return (
			<LicenseItemComponent
				onClick={this.onClick}
				{...this.props}
			/>
		);
	}
}



export default connect(
	(state, ownProps) => ({
		clientLicenseData: state.clientLicenses.byId[ownProps.clientLicenseId],
		isActive: ownProps.clientLicenseId === state.clientLicenses.current,
	}),
	dispatch => ({
		setCurrentClientLicense(clientLicenseId) {
			dispatch(slice.actions.selected(clientLicenseId));
		}
	}),
)(LicenseItem);