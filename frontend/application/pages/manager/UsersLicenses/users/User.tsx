import React, { useEffect, useState } from 'react';
import 'regenerator-runtime/runtime';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'

import { If } from '@tms/shared/components/If';
import { CustomLicenseKey } from './Licenses';
import { LicenseTypes, userLicenseDisable, userLicenseEnable, usersSearch } from '@tms/api';
import { ButtonSuccess, ButtonWarning, ButtonAsyncToggle, createHoverButton } from '@tms/shared/components/Button';
import UserEditModal from './UserEditModal';
import ClientComputersListModal from '../components/ClientComputersListModal';

import { useTranslate } from 'react-polyglot';

const ButtonDisabledEnable = createHoverButton(ButtonWarning, 'disabled', ButtonSuccess, 'enable');
const ButtonEnabledDisable = createHoverButton(ButtonSuccess, 'enabled', ButtonWarning, 'disable');

export const createAsyncButtonToggle = (ComponentTrue, ComponentFalse) => {
    const ButtonAsyncToggle = ({ state, handleTurnOn, handleTurnOff }) => {
        const [isLoading, setIsLoading] = useState(false);

        const handleClick = async () => {
            setIsLoading(true);
            try {
                if (state) {
                    if (handleTurnOff) await handleTurnOff();
                } else {
                    if (handleTurnOn) await handleTurnOn();
                }
            } catch (error) {
                console.error('Error toggling license state:', error);
            }
            setIsLoading(false);
        };

        return state ? (
            <ComponentTrue onClick={handleClick} isLoading={isLoading} />
        ) : (
            <ComponentFalse onClick={handleClick} isLoading={isLoading} />
        );
    };

    return ButtonAsyncToggle;
};

const LicenseItemIsEnabledButton = createAsyncButtonToggle(ButtonEnabledDisable, ButtonDisabledEnable);

const HR = {
    marginTop: "0.4em",
};


const useToggle = (defaultState) => {
    const [state, setState] = React.useState(defaultState);

    const handleSetTrue = React.useCallback(() => {
        setState(true);
    }, []);

    const handleSetFalse = React.useCallback(() => {
        setState(false);
    }, []);

    return [state, handleSetTrue, handleSetFalse];
}

const useModalTop = (shown) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const modalTop = React.useMemo(() => {
        if (shown) {
            const box = buttonRef.current.getBoundingClientRect();
            const top = box.top - 50;
            return top < 0 ? 0 : top;
        }

        return 0;
    }, [shown]);

    return [buttonRef, modalTop] as [React.Ref<HTMLButtonElement>, number];
}


const User = ({ user }) => {
    const t = useTranslate();
    const [state, setState] = useState(user.licenses.is_enabled);

    useEffect(() => {
        setState(user.licenses.is_enabled);
    }, [user.licenses.is_enabled]);

    const [isMoreInfoShown, handleShowMoreInfo, handleHideMoreInfo] = useToggle(false);
    const [isEditing, handleShowEdit, handleHideEdit] = useToggle(false);

    const [editButtonRef, editModalTop] = useModalTop(isEditing);
    const [infoButtonRef, infoModalTop] = useModalTop(isMoreInfoShown);

    const handleEnableClick = React.useCallback(() => {
        return userLicenseEnable({ user_license_id: user.licenses.id })
            .then(res => setState(res.item.is_enabled));
    }, [user.licenses.id]);

    const handleDisableClick = React.useCallback(() => {
        return userLicenseDisable({ user_license_id: user.licenses.id })
            .then(res => setState(res.item.is_enabled));
    }, [user.licenses.id]);

    return (
        <li className="list-group-item">
            <div className="d-flex w-100 justify-content-between align-items-center">
                <h5 className="mb-0">
                    {user.client_company ?
                        `${user.client_company} (${user.first_name} ${user.last_name})`
                        :
                        `${user.user_display_name}`
                    }
                </h5>
                <div className="d-flex justify-content-center align-items-center">
                    <button onClick={handleShowEdit} ref={editButtonRef} className="btn btn-primary btn-sm mr-2">edit</button>

                    <div className="btn-group btn-group-sm btn-group-min-100">
                        <LicenseItemIsEnabledButton
                            handleTurnOn={handleEnableClick}
                            handleTurnOff={handleDisableClick}
                            state={state}
                        />
                    </div>
                </div>
            </div>
            <hr style={HR} />
            <small className="d-flex flex-column flex-lg-row justify-content-between">
                <ul className="mb-2 mb-lg-0 mr-lg-3 text-nowrap">
                    <li>Email: <a href={`mailto:${user.user_email}`}>{user.user_email}</a></li>
                    {user.phone ?
                        <li>Phone: <a href={`tel:${user.phone}`}>{user.phone}</a></li>
                        :
                        <li>Phone: -</li>
                    }
                    <li>
                        Registration date: <strong>{user.user_registered_date}</strong>
                    </li>

                    <li>
                        Active hours : {(user.licenses.total_active_minutes / 60).toFixed(2)}
                    </li>

                </ul>
                <CustomLicenseKey licenseKey={user.licenses} />

            </small>

            <If condition={isEditing}>
                <UserEditModal
                    top={editModalTop}
                    client={user}
                    userLicense={user.licenses}
                    isOpened={isEditing}
                    handleClose={handleHideEdit}
                />
            </If>


            <If condition={isMoreInfoShown}>
                <ClientComputersListModal
                    top={infoModalTop}
                    userLicenseId={user.licenses.id}
                    isOpened={isMoreInfoShown}
                    handleClose={handleHideMoreInfo}
                />
            </If>

        </li>

    );
};

export default User;
