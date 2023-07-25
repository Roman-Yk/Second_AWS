import * as React from 'react';

import { connect } from 'react-redux';
import { setCurrentProductLicense } from '../slice';
import { LicenseTypes } from '@tms/api';
import { useTranslate } from 'react-polyglot';

// import TypeSelect from './TypeSelect';

// const activeClass = "list-group-item-primary";
// const activeClass = "list-group-item-info";
const activeClass = "active";


export const ProductItemEmpty = () => {
	const t = useTranslate();
	return (
		<h5 className="m-0 text-muted p-5 list-group-item d-flex justify-content-center align-items-center">
			{t("manager.products.not_found")}
		</h5>
	);
}


const ProductItemWrapper = ({ children, onClick, productData, isActive }) => {
	let classPrefix = isActive ? 'light' : 'primary';

	return (
		<li onClick={onClick} className={`p-3 list-group-item list-group-item-action d-flex justify-content-between align-items-start ${isActive ? activeClass : ''}`}>
			<div>
				<h6 className="my-0">{productData.product.name} | {productData.name}</h6>
				<small>
					<p className="m-0 mt-2 mb-1">{productData.product.description}</p>
					{children}
				</small>
			</div>
		</li>
	);
}


const ProductItemPermanent = ({ onClick, productData, isActive }) => {
	const t = useTranslate();
	return (
		<ProductItemWrapper onClick={onClick} productData={productData} isActive={isActive}>
			<ul>
				<li>{t('manager.products.list.item.type')}: <strong>{productData.type.name}</strong></li>
			</ul>
		</ProductItemWrapper>
	);
};

const ProductItemSubscription = ({ onClick, productData, isActive }) => {
	const t = useTranslate();
	return (
		<ProductItemWrapper onClick={onClick} productData={productData} isActive={isActive}>
			<ul>
				<li>{t('manager.products.list.item.type')}: <strong>{productData.type.name}</strong></li>
			</ul>
		</ProductItemWrapper>
	);
}

// const ProductItemTrial = ({ onClick, productData, isActive }) => {
// 	const t = useTranslate();
// 	return (
// 		<ProductItemWrapper onClick={onClick} productData={productData} isActive={isActive}>
// 			<ul>
// 				<li>{t('manager.products.list.item.type')}: <strong>{productData.type.name}</strong></li>
// 				<li>Trial Period: {productData.trial_days} days</li>
// 			</ul>
// 		</ProductItemWrapper>
// 	);
// }

const productComponentByTypeId: Record<LicenseTypes, any> = {
	[LicenseTypes.PERMANENT]: ProductItemPermanent,
	[LicenseTypes.SUBSCRIPTION]: ProductItemSubscription,
};


class ProductItem extends React.Component<any, any> {
	onClick = () => {
		this.props.setCurrentProductLicense(this.props.productId);
	}

	render() {
		const { productData } = this.props;

		const ProductItemComponent = productComponentByTypeId[productData.type.id];

		return (
			<ProductItemComponent
				onClick={this.onClick}
				{...this.props}
			/>
		);
	}
}



export default connect(
	(state, ownProps) => ({
		productData: state.productsLicenses.byId[ownProps.productId],
		isActive: ownProps.productId === state.productsLicenses.current,
	}),
	{ setCurrentProductLicense }
)(ProductItem);