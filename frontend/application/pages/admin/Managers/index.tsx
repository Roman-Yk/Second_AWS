import * as React from 'react';

import { connect } from 'react-redux';
import { loadManagers } from './slice';

import { ButtonModal } from '@tms/shared/components/ButtonModal';
import { ButtonSuccessSmPx4 } from '@tms/shared/components/Button/';
import Title from '@tms/shared/components/Title';
import ManagerList from './components/List';

import ManagerAddModal from './components/ManagerAddModal';

import './styles.scss';


const ManagerWithModal = ({ children }) => {
	return (
		<React.Fragment>
			<Title text="Managers">
				<ButtonModal
					title="Add manager"
					ButtonComponent={ButtonSuccessSmPx4}
					ModalComponent={ManagerAddModal}
				/>
			</Title>

			{children}
		</React.Fragment>
	);
}


class Manager extends React.Component<{
	loadManagers?: () => void;
}, any> {
	componentDidMount() {
		this.props.loadManagers();
	}

	render() {
		return (
			<ManagerWithModal>
				<ManagerList />
			</ManagerWithModal>
		);
	}
}


export default connect(
	state => ({
		
	}),
	{ loadManagers }
)(Manager);