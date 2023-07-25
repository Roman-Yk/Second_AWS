import * as React from 'react';

import { connect } from 'react-redux';
import { loadLicenses } from './slice';

import { ButtonModal } from '@tms/shared/components/ButtonModal';
import { ButtonSuccessSmPx4, ButtonPrimaryOutlineSm } from '@tms/shared/components/Button/';
import Title from '@tms/shared/components/Title';
import UsersLicensesList, { UsersLicensesListNotSelectedProduct } from './components/List';
import ClientAddModal from './components/ClientAddModal';

import './styles.scss';
import { useTranslate } from 'react-polyglot';


const LicensesWithModal = ({ children, isAddButtonDisabled, licenseId, loadLicenses }) => {
	const t = useTranslate();
	return (
		<React.Fragment>
			<Title text={t("manager.client_licenses.title")}>
				<div className="btn-group">
					<ButtonPrimaryOutlineSm disabled={isAddButtonDisabled} onClick={loadLicenses}>{t("manager.client_licenses.refresh_list")}</ButtonPrimaryOutlineSm>
					<ButtonModal
						title={t("manager.client_licenses.add_client_license")}
						disabled={isAddButtonDisabled}
						ButtonComponent={ButtonSuccessSmPx4}
						ModalComponent={ClientAddModal}
						licenseId={licenseId}
					/>
				</div>
			</Title>

			{children}
		</React.Fragment>
	);
}


interface UsersLicensesProps {
	licenseId: number | void;
	loadLicenses?: (licenseId: number) => void;
}

class Licenses extends React.Component<UsersLicensesProps, any> {
	loadLicenses = () => {
		if (typeof this.props.licenseId === 'number') {
			this.props.loadLicenses(this.props.licenseId);
		}
	}

	componentDidMount() {
		this.loadLicenses();
	}

	componentDidUpdate() {
		this.loadLicenses();
	}

	render() {
		const { licenseId } = this.props;
		return (
			<LicensesWithModal loadLicenses={this.loadLicenses} isAddButtonDisabled={!licenseId} licenseId={licenseId}>
				{licenseId
					?
						<UsersLicensesList licenseId={licenseId} />
					:
						<UsersLicensesListNotSelectedProduct />
				}
			</LicensesWithModal>
		);
	}
}


export default connect(
	undefined,
	{ loadLicenses }
)(Licenses);