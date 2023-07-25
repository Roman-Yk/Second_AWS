import * as React from 'react';
import { connect } from 'react-redux';

import ManagerItem from './Item';


export const ManagersListNotManagers = ({}) => (
	<table className="table table-bordered">
		<tbody>
			<tr>
				<th>No managers</th>
			</tr>
		</tbody>
	</table>
);


const ManagersList = connect(
	(state, ownProps) => ({
		managersIds: state.managers.ids,
		isFetching: state.managers.isFetching,
	}),
)(({ managersIds, isFetching }) => {
	if (isFetching) {
		return (
			<table className="table table-bordered">
				<tbody>
					<tr>
						<th className="text-center p-5">
							<div className="spinner-border" role="status">
								<span className="sr-only">Loading...</span>
							</div>
							<h5 className="m-0 ml-3 text-muted">Loading...</h5>
						</th>
					</tr>
				</tbody>
			</table>
		);
	}

	if (managersIds.length === 0) {
		return <ManagersListNotManagers />
	}

	return (
		<table className="table table-bordered table-hover table-vertical-middle">
			<thead className="thead-light">
				<tr>
					<th>Manager name</th>
					<th>Manager email</th>
					<th>Manager phone</th>
					<th>Company name</th>
					<th>Users count</th>
					<th className="text-center">Actions</th>
				</tr>
			</thead>
			<tbody>
				{managersIds.map(managerId => (
					<ManagerItem key={managerId} managerId={managerId} />
				))}
			</tbody>
		</table>
	);
});


export default ManagersList;