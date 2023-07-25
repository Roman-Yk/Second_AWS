import * as React from 'react';
import { connect } from 'react-redux';
import { useTranslate } from 'react-polyglot';

import { loadProductsLicenses } from './slice';

import { ButtonModal } from '@tms/shared/components/ButtonModal';
import { ButtonSuccessSmPx4 } from '@tms/shared/components/Button/';
import Title from '@tms/shared/components/Title';
import ProductsList from './components/List';
import ProductLicenseAddModal from './components/ProductLicenseAddModal';

import './styles.scss';


const ProductsWithModal = ({ children }) => {
	const t = useTranslate();

	return (
		<React.Fragment>
			<Title text={t("manager.products.title")}>
				<ButtonModal
					title={t("manager.products.add_license")}
					ButtonComponent={ButtonSuccessSmPx4}
					ModalComponent={ProductLicenseAddModal}
				/>
			</Title>

			{children}
		</React.Fragment>
	);
}


class ProductsApp extends React.Component<{
	loadProductsLicenses?: () => void
}, any> {
	componentDidMount() {
		this.props.loadProductsLicenses();
	}

	render() {
		return (
			<ProductsWithModal>
				<ProductsList />
			</ProductsWithModal>
		);
	}
}



export default connect(
	undefined,
	{ loadProductsLicenses },
)(ProductsApp);