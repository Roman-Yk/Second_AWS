import * as React from 'react';
import './styles.scss';


export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	onClick?(): any;
	isLoading?: boolean;
}


const createButton = (className, name = "Button") => {
	class Button extends React.Component<ButtonProps, any> {
		displayName = name;
		name = name;

		static defaultProps = {
			type: "button"
		}

		render() {
			return (
				<button
					disabled={this.props.disabled || this.props.isLoading}
					type={this.props.type}
					className={className}
					onClick={this.props.onClick}
					onMouseEnter={this.props.onMouseEnter}
					onMouseLeave={this.props.onMouseLeave}
				>
					{this.props.isLoading && <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>}
					{this.props.children}
				</button>
			);
		}
	}

	return Button;
}


export const ButtonPrimary = createButton("btn btn-primary", "ButtonPrimary");
export const ButtonPrimaryOutline = createButton("btn btn-outline-primary", "ButtonPrimary");
export const ButtonPrimaryOutlineSm = createButton("btn btn-sm btn-outline-primary", "ButtonPrimary");

export const ButtonInfo = createButton("btn btn-info", "ButtonInfo");
export const ButtonDanger = createButton("btn btn-danger", "ButtonDanger");
export const ButtonWarning = createButton("btn btn-warning", "ButtonWarning");

export const ButtonSuccess = createButton("btn btn-success", "ButtonSuccess");
export const ButtonSuccessSm = createButton("btn btn-success btn-sm", "ButtonSuccessSm");
export const ButtonSuccessSm100 = createButton("btn btn-success btn-sm w-100", "ButtonSuccessSm100");
export const ButtonSuccessSmPx4 = createButton("btn btn-success btn-sm px-4", "ButtonSuccessSm");
