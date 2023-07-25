import * as React from 'react';


export interface FieldSetProps {
	disabled?: boolean;
	children: React.ReactNode;
}

export const FieldSet = ({ disabled, children }) => (
	<fieldset disabled={disabled}>
		{children}
	</fieldset>
);


export interface FormRawProps {
	onSubmit: () => void;
	errorMessage: string;
	children: React.ReactNode;
	className?: string;
}

export class FormRaw extends React.Component<FormRawProps, any> {
	onSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		this.props.onSubmit && this.props.onSubmit();

		return false;
	}

	render() {
		return (
			<form onSubmit={this.onSubmit} className={this.props.className}>
				{this.props.errorMessage && (
					<div className="alert alert-danger fade show" role="alert">
						<strong>Error!</strong> {this.props.errorMessage}
					</div>
				)}
				{this.props.children}
			</form>
		);
	}
}


export interface FormProps extends FormRawProps, FieldSetProps {

}

export const Form = (props: FormProps) => (
	<FormRaw onSubmit={props.onSubmit} className={props.className} errorMessage={props.errorMessage}>
		<FieldSet disabled={props.disabled}>
			{props.children}
		</FieldSet>
	</FormRaw>
);


export default Form;


class Elem extends React.Component<any,any> {
	render() {
		return (this.props.children);
	}
}
