import * as React from 'react';

import { productFeaturesGetAll } from "@tms/api";

import { TagsField } from '@tms/shared/components/Form/';
import { withServerData, defaultShouldRefresh } from '@tms/shared/components/Form/';


export const TagsFeaturesField = withServerData({
	fetch: (props) => productFeaturesGetAll({ product_id: props.productId }).then(response => response.items.map(f => f.name)),
	shouldRefetch: defaultShouldRefresh,
})((props) => {
	return (
		<TagsField
			{...props}
			items={props.data}
			placeholder={props.isFetching ? "Features is loading..." : props.placeholder}
		/>
	);
}
);