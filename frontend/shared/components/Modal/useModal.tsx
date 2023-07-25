import * as React from 'react';


export const useModal = () => {
	const [isModalOpened, setIsModalOpened] = React.useState(false);

	const handleModalOpen = React.useCallback(() => setIsModalOpened(true), [])
	const handleModalClose = React.useCallback(() => setIsModalOpened(false), [])

	return {
		isModalOpened: isModalOpened,
		handleModalOpen: handleModalOpen,
		handleModalClose: handleModalClose,
	}
}
