import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'

import store from './store';

import ChangePassword from './ChangePassword/';
import PersonalInfo from './PersonalInfo/';


const App = connect(
	(state) => ({}),
	(dispatch) => ({}),
)(({ currentProductId }) => (
	<div className="row">
		<div className="col-md-6 mb-4">
			<ChangePassword />
		</div>
		<div className="col-md-6 mb-4">
			<PersonalInfo />
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
