import * as React from 'react';

import {
	withForm, withServerData, Form, FormGroup, FormRow,
	InputField, SelectField, TextareaField,
} from '@tms/shared/components/Form/';
import { ButtonPrimary } from '@tms/shared/components/Button';
import { authLogin } from '@tms/api';


const AuthForm = withForm<any>({
	onAsyncSubmit(values) {
		console.log(values);
		return authLogin(values);
	},

	onSuccess(props, data) {
		console.log(data);
		props.setToken(data.token)
	}
})((props) => (
	<div className="auth-form" style={{maxWidth: '300px', margin: '0 auto'}}>
		<Form
			onSubmit={props.onSubmit}
			disabled={props.isSubmitting}
			errorMessage={props.errorMessage}
		>
			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="email"
				name="email"
				title="Email"
				autoFocus={true}
				required
			/>
			<InputField
				values={props.values}
				errors={props.errors}
				onChange={props.handleFieldChange}
				type="password"
				name="password"
				title="Password"
				required
			/>

			<ButtonPrimary type="submit" onClick={props.onSubmit}>Login</ButtonPrimary>
		</Form>
	</div>
));



export default class Auth extends React.Component<any, any> {
	state = {
		token: undefined,
	}

	setToken = (token) => {
		localStorage.setItem("token", token);
		this.setState(state => ({
			...state,
			token: token
		}));
	}

	componentDidMount() {
		this.setState((state) => ({
			// token: localStorage.getItem("token"),
			token: (window as any).LICENSE_SERVER_CONFIG.token,
		}))
	}

	render() {
		const { token } = this.state;
		return (
			<div>
				{this.state.token ?
					this.props.children
					:
					<AuthForm setToken={this.setToken} />
				}
			</div>
		);
	}
}

