import * as React from 'react';
import { useTranslate } from 'react-polyglot';

import {
	withModalProps, withModal,
	ModalRoot, ModalHeader, ModalBody, ModalFooter,
	ModalDialog, ModalDialogSm, ModalDialogMd, ModalDialogLg,
} from '../Modal';

import { ButtonDanger } from '../../Button';


export interface ModalReadonlyProps extends withModalProps {
	title: string;
	isOpened: boolean;
	handleClose: () => void;
	children: JSX.Element;
	top?: number;
}

const createModalReadonly = ModalDialog => {
	const ModalReadonly = withModal<ModalReadonlyProps>((props) => {
		const t = useTranslate();
		return (
			<ModalRoot isOpened={props.isOpened} handleClose={props.handleClose}>
				<ModalDialog top={props.top}>
					<ModalHeader title={props.title} handleClose={props.handleClose} />
					<ModalBody>
						{props.children}
					</ModalBody>
					<ModalFooter>
						<ButtonDanger onClick={props.handleClose}>{t("close")}</ButtonDanger>
					</ModalFooter>
				</ModalDialog>
			</ModalRoot>
		)
	});
	return ModalReadonly;
}


export const ModalReadonly = createModalReadonly(ModalDialog);
export const ModalReadonlySm = createModalReadonly(ModalDialogSm);
export const ModalReadonlyMd = createModalReadonly(ModalDialogMd);
export const ModalReadonlyLg = createModalReadonly(ModalDialogLg);
