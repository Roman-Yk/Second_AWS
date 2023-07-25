import * as React from 'react';
import { useSelector } from 'react-redux'

import { ListLoading } from '@tms/shared/components/ListStates';
import ProductItem, { ProductItemEmpty } from './Item';


const ProductsList = (props) => {
	const isFetching = useSelector((state: any) => state.productsLicenses.isFetching)
	const productsIds = useSelector((state: any) => state.productsLicenses.ids)

	if (isFetching) {
		return (
			<ListLoading />
		);
	}

	if (productsIds.length) {
		return productsIds.map((productId) => (
			<ul className="list-group mb-2" key={productId}>
				<ProductItem productId={productId} />
			</ul>
		));
	}

	return (
		<ul className="list-group mb-2">
			<ProductItemEmpty />
		</ul>
	);

};


export default ProductsList;