import * as React from 'react';


const beforeSubmitDefault = (values, props) => values;
const onAsyncSubmitDefault = (values, props) => Promise.reject<any>(Error("No fetcher"));


interface withFormState {
	values: Record<string, any>;
	errors: Record<string, any>;
	errorMessage: string;
	isSubmitting: boolean;
}

interface withFormProps {
	handleFieldChange(e: any): void;
	onSubmit(): void;
	reset(): void;
}


interface withFormHocProps extends withFormState, withFormProps {}


export type defaultValues<T> = Record<any, any> | ((props: T) => Record<any, any>);

export interface withFormInterface<CP> {
	onAsyncSubmit: (values: any, props: CP) => Promise<any>;
	beforeSubmit?: (values: any, props: CP) => Record<any, any>;
	onSuccess: (props: CP, data: any, form?: {reset(): void}) => any;
	onError?: (props: CP, data: any) => any;
	defaultValues?: defaultValues<CP>;
	name?: string;
}


export const withForm = <P extends any>({
	defaultValues = {},
	beforeSubmit = beforeSubmitDefault,
	onAsyncSubmit = onAsyncSubmitDefault,
	onSuccess = undefined,
	onError = undefined,
}: withFormInterface<P>) => <T extends Partial<withFormHocProps> & Partial<P>>(Component: React.ComponentType<T>) => {
	const initState = (props): withFormState => ({
		values: typeof defaultValues === 'function' ? defaultValues(props) : defaultValues,
		errors: {},
		errorMessage: "",
		isSubmitting: false,
	});

	class WithForm extends React.Component<P, withFormState> {
		static displayName = `withForm(${Component.name || Component.displayName})`;

		constructor(props) {
			super(props);

			this.state = initState(props);
		}

		handleSubmitAsync = () => {
			this.setState(state => ({
				...state,
				isSubmitting: true,
				errors: {},
				errorMessage: "",
			}));
			const asyncSubmit = onAsyncSubmit(beforeSubmit(this.state.values, this.props), this.props)
				.catch(err => {
					let message = err.message;
					if (!navigator.onLine) {
						message = 'No internet connection! Please connect to the internet and try again.';
					}
					if (err.error) {
						return err;
					}
					this.setState(state => ({
						...state,
						isSubmitting: false,
						errorMessage: message,
					}));
				})
				.then(response => {
					if (response.error) {
						this.setState(state => ({
							...state,
							errors: response.error.fields || {},
							isSubmitting: false,
							errorMessage: response.error.message,
						}));
						throw new Error("Server error");
					}
					this.setState(state => ({
						...state,
						isSubmitting: false,
						errors: {},
						errorMessage: "",
					}));
					return response;
				});

			if (onSuccess) {
				asyncSubmit.then((data) => onSuccess(this.props, data, {
					reset: this.reset,
				}));
			}
		}

		onSubmit = (e) => {
			this.handleSubmitAsync();
		}

		handleFieldChange = ({ target }) => {
			const { name, value } = target;
			this.setState(state => ({
				...state,
				values: {
					...state.values,
					[name]: value,
				}
			}));
		}

		reset = () => {
			this.setState(state => initState(this.props));
		}

		render() {
			return (
				<Component
					{...this.props as P}
					{...this.state}
					onSubmit={this.onSubmit}
					handleFieldChange={this.handleFieldChange}
					reset={this.reset}
				/>
			);
		}
	}

	return WithForm;
}
