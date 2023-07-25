import * as React from 'react';
import { connect } from 'react-redux';

import { computerDeactivateMyById } from '@tms/api';
import { updateComputer } from '../slice';

import { ButtonPrimary, ButtonWarning, createHoverButton } from '@tms/shared/components/Button/';
import { ButtonActiveDeactivate } from '@tms/application/pages/manager/UsersLicenses/components/ClientComputersListModal';
import { Editable } from '@tms/shared/components/Editable';
import { createComputersList, createComputersListAsync } from '@tms/shared/blocks/Computers/';
import { createEditableComputerItem } from '@tms/shared/blocks/Computers/Item';
import {
	ComputerItemProps, ComputerItemEdit, ComputerItemWrapper,
	ComputerItemStaticBody, ComputerItemStaticProps, ComputerItemButtonsWrapper
} from '@tms/shared/blocks/Computers/components';
import { useTranslate } from 'react-polyglot';

export const ComputerItemStatic = (props: ComputerItemStaticProps) => {
	const t = useTranslate();
	const handleDeactivateClick = React.useCallback(() => {
		if (!confirm("Are you sure to deactivate the license?")) {
			return;
		}
		computerDeactivateMyById({computer_id: props.computer.id}).then(res => {
			props.updateComputer && props.updateComputer(res.item);
		});
	}, [props.computer]);

	return (
		<ComputerItemWrapper>
			<ComputerItemStaticBody computer={props.computer} />
			<ComputerItemButtonsWrapper>
				{props.computer.is_active ?
					<ButtonActiveDeactivate onClick={handleDeactivateClick} />
					:
					<ButtonWarning>{t("not_active")}</ButtonWarning>
				}
				<ButtonPrimary onClick={props.onEdit}>{t("edit")}</ButtonPrimary>
			</ComputerItemButtonsWrapper>
		</ComputerItemWrapper>
	);
}


export const ComputerItem = createEditableComputerItem(ComputerItemStatic, ComputerItemEdit)


export default connect(
	(state, ownProps) => ({
		computer: state.clientComputers.byId[ownProps.clientComputerId],
	}),
	{ updateComputer }
)(ComputerItem);
