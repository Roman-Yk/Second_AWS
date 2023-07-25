import * as React from 'react';
import { connect } from 'react-redux';

import { deleteManager } from '../slice';
import { managerDelete } from '@tms/api';


class ManagerItem extends React.Component<any, any> {
	state = {
		isFetching: false,
	}

	setFetching = (isFetching) => {
		this.setState(state => ({...state, isFetching: isFetching}));
	}

	onDelete = () => {
		if (!confirm(`Are you really want to delete '${this.props.managerData.first_name.toUpperCase()} ${this.props.managerData.last_name.toUpperCase()}' account?`)) {
			return;
		}
		this.setFetching(true)
		managerDelete({
			user_id: this.props.managerData.id,
		}).then(res => {
			this.setFetching(false);
			this.props.deleteManager(this.props.managerData);
		}).catch(err => {
			this.setFetching(false)
		});
	}

	render() {
		const { managerData } = this.props;

		return (
			<tr>
				<th>{managerData.first_name} {managerData.last_name}</th>
				<td>{managerData.email}</td>
				<td>{managerData.phone}</td>
				<td>{managerData.company}</td>
				<td>{managerData.usersCount}</td>
				<td className="manager-item-buttons-wrapper">
					<div className="btn-group btn-group-sm">
						{/*<button className="btn btn-primary" disabled={true}>Edit</button>*/}
						<button className="btn btn-danger" onClick={this.onDelete} disabled={this.state.isFetching}>Remove</button>
					</div>
				</td>
			</tr>
		);
	}
}



export default connect(
	(state, ownProps) => ({
		managerData: state.managers.byId[ownProps.managerId],
	}),
	{ deleteManager },
)(ManagerItem);