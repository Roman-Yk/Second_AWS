import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ButtonDanger, ButtonPrimary } from '../Button';

import './styles.scss';


const stylesOpened = {
	display: "block",
	// background: "rgba(0,0,0,0.4)",
	background: "rgba(0, 0, 0, 0)",
};

const stylesClosed = {};


const modalStyles = {
	entering: {opacity: 1},
	entered: {opacity: 1},
	exiting: {opacity: 0},
	exited: {opacity: 0},
};


const modalsStack = [];

let openedModals = 0;


export interface withModalProps {
	handleClose: (e?: any) => any;
}

export const withModal = <T extends withModalProps>(Component: React.ComponentType<T>) => {
	return class extends React.Component<T, any> {
		static displayName = `withModal(${Component.displayName || Component.name})`

		// handleEscPress = (e) => {
		// 	e.keyCode === 27 && this.props.handleClose(e);
		// }

		componentDidMount() {
			openedModals++;
			document.body.classList.add('modal-open');
			// document.addEventListener('keydown', this.handleEscPress);
		}
		componentWillUnmount() {
			// document.removeEventListener('keydown', this.handleEscPress);
			openedModals--;
			if (!openedModals) {
				document.body.classList.remove('modal-open');
			} else {
				// pass
			}
		}

		handleClose = (e) => {
			e.preventDefault();
			e.stopPropagation();

			// console.log('EEEEEE >> > ', e);

			this.props.handleClose && this.props.handleClose(e);

			return false;
		}
		
		render() {
			return ReactDOM.createPortal(
				<Component
					{...this.props}
					handleClose={this.handleClose}
				/>,
				document.body
			);
		}
	}
}



export interface ModalRootProps {
	isOpened: boolean;
	handleClose: (e: any) => void;
}

export class ModalRoot extends React.Component<ModalRootProps> {
	wrapperRef: HTMLElement;
	canClose: boolean;
	wrapRef = (ref) => this.wrapperRef = ref;

	// handleWrapperClick = (e) => {
	// 	if (e.target === this.wrapperRef) {
	// 		this.props.handleClose(e);
	// 	}
	// }

	handleWrapperClickStart = (e) => {
		// console.log("START", e);
		if (e.target === this.wrapperRef) {
			this.canClose = true;
		} else {
			this.canClose = false;
		}
	}

	handleWrapperClickEnd = (e) => {
		// console.log("END", e);
		if (this.canClose && e.target === this.wrapperRef) {
			this.props.handleClose(e);
		}
	}

	render() {
		return (
			<div
				ref={this.wrapRef}
				className="modal"
				style={this.props.isOpened ? stylesOpened : stylesClosed}
				// onClick={this.handleWrapperClick}
				onMouseDown={this.handleWrapperClickStart}
				onMouseUp={this.handleWrapperClickEnd}
				role="dialog"
			>
				{this.props.children}
			</div>
		);
	}
}


export const createModalDialog = (className) => {
	const ModalDialog = (props) => (
		<div className={className} role="document" style={{ marginTop: props.top }}>
			<div className="modal-content">
				{props.children}
			</div>
		</div>
	);

	return ModalDialog;
}


export const ModalDialog   = createModalDialog("modal-dialog");
export const ModalDialogSm = createModalDialog("modal-dialog modal-sm");
export const ModalDialogMd = createModalDialog("modal-dialog modal-md");
export const ModalDialogLg = createModalDialog("modal-dialog modal-lg");


export const ModalHeader = (props) => (
	<div className="modal-header">
		<h5 className="modal-title">{props.title}</h5>
		<button onClick={props.handleClose} type="button" className="close">
			<span aria-hidden="true">×</span>
		</button>
	</div>
);


export const ModalBody = (props) => (
	<div className="modal-body">
		{props.children}
	</div>
);


export const ModalFooter = (props) => (
	<div className="modal-footer">
		{props.children}
	</div>
);
