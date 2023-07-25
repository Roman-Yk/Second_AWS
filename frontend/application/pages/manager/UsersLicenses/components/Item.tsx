import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { If } from '@tms/shared/components/If';
import ClientComputersListModal from './ClientComputersListModal';
import ClientEditModal from './ClientEditModal';
import { LicenseKey } from '@tms/shared/blocks/LicenseKey';
import { ButtonSuccess, ButtonWarning, ButtonAsyncToggle, createAsyncButtonToggle, createHoverButton } from '@tms/shared/components/Button';

import { LicenseTypes, userLicenseDisable, userLicenseEnable } from '@tms/api';

import { getById, getId, mapIdsToObj } from '@tms/shared/slices/utils';
import { licenses, clients, userLicenses, computers } from '../slice';
import { useTranslate } from 'react-polyglot';

const ButtonDisabledEnable = createHoverButton(ButtonWarning, 'disabled', ButtonSuccess, 'enable');
const ButtonEnabledDisable = createHoverButton(ButtonSuccess, 'enabled', ButtonWarning, 'disable');
const LicenseItemIsEnabledButton = createAsyncButtonToggle(ButtonEnabledDisable, ButtonDisabledEnable);


const DAYS = {
	1: 'day',
	default: 'days',
};


const HR = {
	marginTop: "0.4em",
};


const useToggle = (defaultState) => {
	const [state, setState] = React.useState(defaultState);

	const handleSetTrue = React.useCallback(() => {
		setState(true);
	}, []);

	const handleSetFalse = React.useCallback(() => {
		setState(false);
	}, []);

	return [state, handleSetTrue, handleSetFalse];
}


const useModalTop = (shown) => {
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const modalTop = React.useMemo(() => {
		if (shown) {
			const box = buttonRef.current.getBoundingClientRect();
			const top = box.top - 50;
			return top < 0 ? 0 : top;
		}

		return 0;
	}, [shown]);

	return [buttonRef, modalTop] as [React.Ref<HTMLButtonElement>, number];
}


const LicenseItem = (props) => {
	const t = useTranslate();
	const { userLicenseData, userData, licenseData, currentCount } = props;
	
	const [ isMoreInfoShown, handleShowMoreInfo, handleHideMoreInfo ] = useToggle(false);
	const [ isEditing, handleShowEdit, handleHideEdit ] = useToggle(false);

	const [editButtonRef, editModalTop] = useModalTop(isEditing);
	const [infoButtonRef, infoModalTop] = useModalTop(isMoreInfoShown);


	const handleEnableClick = React.useCallback(() => {
		return userLicenseEnable({ user_license_id: props.userLicenseId })
			.then(res => props.updateUserLicense(res.item));
	}, [ props.userLicenseId ]);

	const handleDisableClick = React.useCallback(() => {
		return userLicenseDisable({ user_license_id: props.userLicenseId })
			.then(res => props.updateUserLicense(res.item));
	}, [ props.userLicenseId ]);

	if (!userData || !userLicenseData) {
		return null;
		// return <li className="list-group-item text-danger">Item rendering error.</li>
	}

	return (
		<li className="list-group-item">
			<div className="d-flex w-100 justify-content-between align-items-center">
				<h5 className="mb-0">
					{userData.client_company ?
						`${userData.client_company} (${userData.first_name} ${userData.last_name})`
						:
						`${userData.first_name} ${userData.last_name}`
					}
				</h5>
				<div className="d-flex justify-content-center align-items-center">
					<button onClick={handleShowEdit} ref={editButtonRef} className="btn btn-primary btn-sm mr-2">{t("edit")}</button>
					<div className="btn-group btn-group-sm btn-group-min-100">
						<LicenseItemIsEnabledButton
							handleTurnOn={handleEnableClick}
							handleTurnOff={handleDisableClick}
							state={userLicenseData.is_enabled}
						/>
					</div>
				</div>
			</div>
			<hr style={HR} />
			<small className="d-flex flex-column flex-lg-row justify-content-between">
				<ul className="mb-2 mb-lg-0 mr-lg-3 text-nowrap">
					<li>{t("email")}: <a href={`mailto:${userData.email}`}>{userData.email}</a></li>
					{userData.phone ?
						<li>{t("phone")}: <a href={`tel:${userData.phone}`}>{userData.phone}</a></li>
						:
						<li>{t("phone")}: -</li>
					}
					<li>
						{t("manager.client_licenses.list.item.registration_date")}: <strong>{userLicenseData.time_created}</strong>
					</li>
					{userData.time_last_login ?
						<li>Last login: <strong>{userData.time_last_login}</strong></li>
					: null}
					{userLicenseData.expiration_date ?
						<li>
							{t("manager.client_licenses.list.item.expiration_date")}: <strong>{userLicenseData.expiration_date}</strong>
						</li>
					: null}
					<li>
						{t("manager.client_licenses.list.item.active_computers")}:&nbsp;
						<strong>
							{currentCount}/{userLicenseData.count}
							&nbsp;
							<span className="badge badge-primary cursor-pointer" ref={infoButtonRef} onClick={handleShowMoreInfo}>{t("manager.client_licenses.list.item.active_computers_show")}</span>
						</strong>
					</li>
				</ul>
				<LicenseKey licenseKey={userLicenseData.key} features={userLicenseData.features} />
			</small>

			<If condition={isMoreInfoShown}>
				<ClientComputersListModal
					top={infoModalTop}
					userLicenseId={userLicenseData.id}
					isOpened={isMoreInfoShown}
					handleClose={handleHideMoreInfo}
				/>
			</If>

			<If condition={isEditing}>
				<ClientEditModal
					top={editModalTop}
					client={userData}
					userLicense={userLicenseData}
					license={licenseData}
					isOpened={isEditing}
					handleClose={handleHideEdit}
				/>
			</If>
		</li>
	);
}


const getLicenseIdFromUserLicense = (state, props) => props.license_id;
const getUserLicenseId = (state, props) => props.userLicenseId;
const getClientIdFromUserLicense = (state, props) => props.user_id;

const mapStateToPropsFabric = () => {
	const computersByUserLicenseSelector = createSelector(
		[computers.selectors.itemsSelector, getId],
		(computers, userLicenseId) =>
			computers.filter(ulh => ulh.user_license_id === userLicenseId)
	);
	const userLicenseSelector = createSelector([userLicenses.selectors.getObj, getUserLicenseId], getById);
	const clientByUserLicenseSelector = createSelector([clients.selectors.getObj, getClientIdFromUserLicense], getById);
	const licenseByUserLicenseSelector = createSelector([licenses.selectors.getObj, getLicenseIdFromUserLicense], getById);
	const currentCountSelector = createSelector(
		[computersByUserLicenseSelector],
		(computers) => {
			return computers.reduce((curr, item) => {
				if (item.is_active && item.is_enabled) {
					return curr + 1;
				}
				return curr;
			}, 0);
		}
	)
	
	return (state, ownProps) => {
		const userLicenseData = userLicenseSelector(state, ownProps);
		const userData = clientByUserLicenseSelector(state, userLicenseData);
		const licenseData = licenseByUserLicenseSelector(state, userLicenseData);
		const currentCount = currentCountSelector(state, userLicenseData);

		return {
			userLicenseData: userLicenseData,
			userData: userData,
			licenseData: licenseData,
			currentCount: currentCount,
		}
	};
}


export default connect(
	mapStateToPropsFabric,
	{
		updateUserLicense: userLicenses.actions.updated
	}
)(LicenseItem);
