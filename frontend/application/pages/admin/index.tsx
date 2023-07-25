import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'

import store from './store';

import Managers from './Managers/';


const App = connect(
	state => ({
		// currentProductId: state.products.current
	}),
	dispatch => ({

	}),
)(({ currentProductId }) => (
	<div className="row">
		<div className="col-md-12 mb-4">
			<Managers />
		</div>
	</div>
));


ReactDOM.render(
	(
		<Provider store={store}>
			<App />
		</Provider>
	),
	document.getElementById('root')
);
