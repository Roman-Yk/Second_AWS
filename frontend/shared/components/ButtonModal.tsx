import * as React from 'react';
import { useModal } from '@tms/shared/components/Modal/';


export const ButtonModal = ({
	ButtonComponent,
	ModalComponent,
	title,
	disabled = undefined,
	...props
}) => {
	const { isModalOpened, handleModalOpen, handleModalClose } = useModal();

	return (
		<React.Fragment>
			<ButtonComponent onClick={handleModalOpen} disabled={disabled}>
				{title}
			</ButtonComponent>
			{isModalOpened && <ModalComponent
				isModalOpened={isModalOpened}
				onModalClose={handleModalClose}
				{...props}
			/>}
		</React.Fragment>
	);
}
