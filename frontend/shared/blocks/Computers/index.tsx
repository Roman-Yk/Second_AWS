import * as React from 'react';
import { connect } from 'react-redux';

import { useApiRequest } from '@tms/api/utils/';
import { ComputerItem, ComputerItemEmpty, ComputerItemLoading } from './Item';
import "./styles.scss";


const EMPTY_COMPUTERS = [];

export const createComputersList = (ComputerItem) => {
	const ComputersList = ({ computers = EMPTY_COMPUTERS, isLoading = false, updateComputer = undefined }) => (
		<ul className="list-group list-group-scroll">
			{computers.length ?
				computers.map(computer => <ComputerItem key={computer.id} computer={computer} updateComputer={updateComputer} />)
				:
				<ComputerItemEmpty />
			}
		</ul>
	);

	return ComputersList;
};


export const createComputersListAsync = (ComputersList) => {
	const ComputersListAsync = ({ fetcher, loadingOnValueChange = undefined }) => {
		const { isFetching, isFetched, response, setResponse, updateResponse } = useApiRequest(fetcher);

		const updateComputer = React.useCallback(computer => {
			updateResponse((response) => ({
				...response,
				items: response.items.map(item => {
					if (item.id === computer.id) {
						return {
							...item,
							...computer,
						}
					}
					return {...item};
				})
			}));
		}, [ response ]);

		if (isFetching) {
			return <ComputerItemLoading />
		}

		if (isFetched) {
			return (
				<ComputersList
					updateComputer={updateComputer}
					computers={response.items}
					isLoading={isFetching}
				/>
			);
		}

		return <ComputerItemEmpty />;
	}

	return ComputersListAsync;
};


export const ComputersList = createComputersList(ComputerItem);
export const ComputersListAsync = createComputersListAsync(ComputersList);


export { ComputerItem, ComputerItemEmpty, ComputerItemLoading };
