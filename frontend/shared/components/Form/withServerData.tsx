import * as React from 'react';


export const withServerData = ({ fetch, shouldRefetch }) => (Component) => class extends React.Component<any, any> {
	static displayName = `withServerData(${Component.name})`;

	state = {
		isFetching: true,
		isFetchingError: true,
		data: null
	}

	setData = (data) => {
		this.setState(state => ({
			...state,
			data: data,
			isFetching: false,
			isFetchingError: false,
		}));
	}

	handleFetchError = (err) => {
		this.setState(state => ({
			...state,
			isFetching: false,
			isFetchingError: true,
		}));
		throw err;
	}

	handleFetchStart = () => {
		this.setState(state => ({
			...state,
			isFetching: true,
			isFetchingError: false,
		}));
	}

	fetchData = () => {
		this.handleFetchStart();
		fetch(this.props)
			.then(this.setData)
			.catch(this.handleFetchError);
	}

	appendSomeData = (appendNewData) => {
		this.setState(state => ({
			...state,
			data: appendNewData(state.data)
		}));
	}

	appendNewItem = (item) => {
		this.appendSomeData((oldItems) => {
			return [...oldItems, item];
		});
	}

	componentDidUpdate(oldProps) {
		if (shouldRefetch(oldProps, this.props)) {
			this.fetchData();
		}
	}

	componentDidMount() {
		this.fetchData();
	}

	render() {

		return (
			<Component
				{...this.props}
				{...this.state}
				disabled={this.state.isFetching || this.props.disabled}
				appendSomeData={this.appendSomeData}
				appendNewItem={this.appendNewItem}
			/>
		);
	}

}
