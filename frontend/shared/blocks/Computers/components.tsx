import * as React from 'react';
import { useTranslate } from 'react-polyglot';
import { computerUpdateDescription } from '@tms/api';
import { withForm, TextareaField } from '@tms/shared/components/Form/';
import { ButtonPrimary, ButtonSuccess, ButtonWarning, ButtonDanger } from '@tms/shared/components/Button/';


export interface ComputerItemProps {
	deactivateHardwareFetcher?: (data?: any) => Promise<any>;
	updateComputer(data: any): void;
	computer: any;
}

export interface ComputerItemEditProps extends ComputerItemProps {
	onSave(): void;
	onCancel(): void;
}

export interface ComputerItemStaticProps extends ComputerItemProps {
	onEdit(): void;
}

export const ComputerItemWrapper = (props) => (
	<li className="list-group-item-computer">
		{props.children}
	</li>
);

export const ComputerItemButtonsWrapper = (props) => (
	<div className="btn-group-vertical btn-group-sm btn-group-min-100">
		{props.children}
	</div>
);

export const withComputerItemEditForm = withForm<ComputerItemEditProps>({
	name: "ComputerItemEdit",
	beforeSubmit: (values, props) => ({
		id: props.computer.id,
		...values
	}),
	
	defaultValues: (props) => ({
		h_description: props.computer.h_description
	}),

	onAsyncSubmit: (values) => {
		return computerUpdateDescription(values);
	},

	onSuccess(props, data, form) {
		props.updateComputer(data.item);
		props.onSave();
	},
});

export const ComputerItemEdit = withComputerItemEditForm((props) => {
	const t = useTranslate();
	return (
		<ComputerItemWrapper>
			<div className="list-group-item-computer-body">
				<strong>{ props.computer.h_id }</strong>
				<TextareaField
					wrapperClassName="mb-0"
					className="form-control-sm"
					values={props.values}
					errors={props.errors}
					onChange={props.handleFieldChange}
					type="text"
					placeholder="Computer Description"
					name="h_description"
					rows={2}
					autoFocus
				/>
				<small className="text-muted">
					<span title="IP Address">{props.computer.ip_address}</span> | <span  title="Operating system">{props.computer.os_name}</span> | <span title="Logged username">{props.computer.logged_username}</span>
				</small>
			</div>
			<ComputerItemButtonsWrapper>
				<ButtonSuccess onClick={props.onSubmit} isLoading={props.isSubmitting}>{t("save")}</ButtonSuccess>
				<ButtonDanger onClick={props.onCancel} disabled={props.isSubmitting}>{t("cancel")}</ButtonDanger>
			</ComputerItemButtonsWrapper>
		</ComputerItemWrapper>
	);
});



export const ComputerItemStaticBody = (props: { computer: any }) => (
	<div className="list-group-item-computer-body">
		<strong>{ props.computer.h_id }</strong>
		<p className="m-0">{props.computer.h_description}</p>
		<small className="text-muted">
		<span title="IP Address">{props.computer.ip_address}</span> | <span  title="Operating system">{props.computer.os_name}</span> | <span title="Logged username">{props.computer.logged_username}</span>
		</small>
	</div>
);

export const ComputerItemStatic = (props: ComputerItemStaticProps) => {
	const t = useTranslate();
	return (
		<ComputerItemWrapper>
			<ComputerItemStaticBody computer={props.computer} />
			<ComputerItemButtonsWrapper>
				{props.computer.is_active ?
					<ButtonSuccess>{t("is_active")}</ButtonSuccess>
					:
					<ButtonWarning>{t("is_not_active")}</ButtonWarning>
				}
				<ButtonPrimary onClick={props.onEdit}>{t("edit")}</ButtonPrimary>
			</ComputerItemButtonsWrapper>
		</ComputerItemWrapper>
	)
};