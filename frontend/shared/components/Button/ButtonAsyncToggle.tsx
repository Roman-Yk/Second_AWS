import * as React from 'react';
import { ButtonProps } from './Buttons';


export interface ButtonAsyncToggleProps {
	state: boolean;

	ComponentTrue: React.ComponentClass<ButtonProps>;
	handleTurnOn(): Promise<any>;

	ComponentFalse: React.ComponentClass<ButtonProps>;
	handleTurnOff(): Promise<any>;
}

export const ButtonAsyncToggle = (props: ButtonAsyncToggleProps) => {
	const ComponentTrue = props.ComponentTrue;
	const ComponentFalse = props.ComponentFalse;
	const [ isLoading, setIsLoading ] = React.useState(false);

	const handleClick = React.useCallback(async () => {
		setIsLoading(true);
		if (props.state === true) {
			await props.handleTurnOff();
		} else {
			await props.handleTurnOn();
		}
		setIsLoading(false);
	}, [ props.state ]);

	return (props.state ?
		<ComponentFalse onClick={handleClick} isLoading={isLoading} />
		:
		<ComponentTrue onClick={handleClick} isLoading={isLoading} />
	);
}


export interface createAsyncButtonToggleProps {
	state: boolean;
	handleTurnOn?(): Promise<any>;
	handleTurnOff?(): Promise<any>;
}

export const createAsyncButtonToggle = (ComponentTrue, ComponentFalse) => {
	class ButtonAsyncToggle extends React.Component<createAsyncButtonToggleProps> {
		state = {
			isLoading: false,
		}

		setIsLoading = (isLoading) => {
			// console.log('IS LOADING', isLoading);
			this.setState(state => ({ ...state, isLoading: isLoading }));
		}

		handleClick = async () => {
			this.setIsLoading(true);
			if (this.props.state === true) {
				if (this.props.handleTurnOff !== undefined) {
					await this.props.handleTurnOff();
				}
			} else {
				if (this.props.handleTurnOn !== undefined) {
					await this.props.handleTurnOn();
				}
			}
			this.setIsLoading(false);
		}

		render() {
			return (this.props.state ?
				<ComponentTrue onClick={this.handleClick} isLoading={this.state.isLoading} />
				:
				<ComponentFalse onClick={this.handleClick} isLoading={this.state.isLoading} />
			);
		}
	}
	return ButtonAsyncToggle;
}
