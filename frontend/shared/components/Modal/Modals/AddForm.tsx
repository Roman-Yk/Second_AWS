import * as React from 'react';
import { useTranslate } from 'react-polyglot';

import {
	withModalProps, withModal,
	ModalDialogSm, ModalDialogMd, ModalDialogLg,
	ModalRoot, ModalDialog, ModalHeader, ModalBody, ModalFooter
} from '../Modal';

import { ButtonDanger, ButtonPrimary } from '../../Button';


export interface ModalAddFormProps extends withModalProps {
	title: string;
	isLoading: boolean;
	isOpened: boolean;
	handleClose: () => void;
	onSubmit: () => void;
	children: JSX.Element;
	top?: number;
}

const createModalAddForm = (ModalDialog) => {
	const ModalAddForm = withModal<ModalAddFormProps>((props) => {
		const t = useTranslate();
		return (
			<ModalRoot isOpened={props.isOpened} handleClose={props.handleClose}>
				<ModalDialog top={props.top}>
					<ModalHeader title={props.title} handleClose={props.handleClose} />
					<ModalBody>
						{props.children}
					</ModalBody>
					<ModalFooter>
						<ButtonDanger onClick={props.handleClose} disabled={props.isLoading}>{t("cancel")}</ButtonDanger>
						<ButtonPrimary onClick={props.onSubmit} isLoading={props.isLoading}>{t("add")}</ButtonPrimary>
					</ModalFooter>
				</ModalDialog>
			</ModalRoot>
		)
	});
	return ModalAddForm;
};

export const ModalAddForm = createModalAddForm(ModalDialog);
export const ModalAddFormSm = createModalAddForm(ModalDialogSm);
export const ModalAddFormMd = createModalAddForm(ModalDialogMd);
export const ModalAddFormLg = createModalAddForm(ModalDialogLg);
