import * as React from 'react';
import { connect } from 'react-redux';
import { computers } from '../slice';

import { ModalReadonly, ModalReadonlyLg } from '@tms/shared/components/Modal/';

import { Editable } from '@tms/shared/components/Editable';
import {
	ButtonPrimary, ButtonSuccess, ButtonInfo, ButtonDanger, ButtonWarning,
	createHoverButton, createAsyncButtonToggle,
} from '@tms/shared/components/Button/';
import { createComputersList, createComputersListAsync } from '@tms/shared/blocks/Computers/';
import { createEditableComputerItem } from '@tms/shared/blocks/Computers/Item';
import {
	ComputerItemProps, ComputerItemEdit, ComputerItemWrapper,
	ComputerItemStaticBody, ComputerItemStaticProps, ComputerItemButtonsWrapper
} from '@tms/shared/blocks/Computers/components';

import { computerGetAllByUserLicense, computerDeactivateById, computerDisableById, computerEnableById } from '@tms/api';
import { useTranslate } from 'react-polyglot';


export const ButtonActiveDeactivate = createHoverButton(ButtonSuccess, 'is_active', ButtonDanger, 'deactivate');

const ButtonNotActive = (props) => {
	const t = useTranslate();
	return (
		<ButtonWarning isLoading={props.isLoading}>{t("is_not_active")}</ButtonWarning>
	);
};
const ComputerIsActiveAsyncToggle = createAsyncButtonToggle(ButtonActiveDeactivate, ButtonNotActive);


export const ComputerItemStatic = (props: ComputerItemStaticProps) => {
	const t = useTranslate();
	const handleDeactivateClick = React.useCallback(() => {
		if (!confirm("Are you sure to deactivate the license?")) {
			return;
		}
		return computerDeactivateById({computer_id: props.computer.id}).then(res => {
			props.updateComputer && props.updateComputer(res.item);
		});
	}, [props.computer]);

	return (
		<ComputerItemWrapper>
			<ComputerItemStaticBody computer={props.computer} />
			<ComputerItemButtonsWrapper>
				<ComputerIsActiveAsyncToggle
					state={props.computer.is_active}
					handleTurnOff={handleDeactivateClick}
				/>
				<ButtonPrimary onClick={props.onEdit}>{t("edit")}</ButtonPrimary>
			</ComputerItemButtonsWrapper>
		</ComputerItemWrapper>
	);
}

const ComputerItem = createEditableComputerItem(ComputerItemStatic, ComputerItemEdit);
const ComputersList = createComputersList(ComputerItem);
const ComputersListAsync = createComputersListAsync(ComputersList);


// export const ComputersListAsyncByUserLicense = ({ userLicenseId }) => {
// 	const fetcher = React.useCallback(() => {
// 		return computerGetAllByUserLicense({
// 			user_license_id: userLicenseId
// 		})
// 	}, [ userLicenseId ]);

// 	return <ComputersListAsync fetcher={fetcher} />;
// }


const UserLicenseComputersListModal = (props) => {
	const t = useTranslate();
	return (
		<ModalReadonlyLg
			top={props.top}
			title={t("modals.client_computers.title")}
			isOpened={props.isOpened}
			handleClose={props.handleClose}
		>
			<div className="user-add-list-select">
				<ComputersList
					computers={props.computers}
					isLoading={false}
					updateComputer={props.updateComputer}
				/>
			</div>
		</ModalReadonlyLg>
	);
};


const mapStateToPropsFabric = () => {
	const computersByUserLicenseSelector = computers.selectors.makeUserLicenseHardwaresByUserLicenseSelector();
	return (state, ownProps) => ({
		computers: computersByUserLicenseSelector(state, ownProps),
	})
}


export default connect(
	mapStateToPropsFabric,
	{ updateComputer: computers.actions.updated }
)(UserLicenseComputersListModal);