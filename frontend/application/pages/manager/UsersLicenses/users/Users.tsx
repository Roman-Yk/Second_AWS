import React, { useEffect, useState } from 'react';
import 'regenerator-runtime/runtime';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'

import './styles.scss'

import { CustomLicenseKey } from './Licenses';
import User from './User';

const UserRow = ({ user }) => {
    // console.log(user)
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen((prevState) => !prevState);
    };

    return (
        <tbody>
            <tr>
                <td>
                    <button onClick={handleOpen} className='expand-btn'>
                        <span>
                            &darr;
                        </span>
                    </button>
                    {user.client_company ?
                        `${user.client_company} (${user.first_name} ${user.last_name})`
                        :
                        `${user.user_display_name}`
                    }
                </td>
                <td><a href={`mailto:${user.user_email}`}>{user.user_email}</a></td>
                {user.phone ?
                    <td><a href={`tel:${user.phone}`}>{user.phone}</a></td>
                    :
                    <td>-</td>
                }
                <td>
                    <strong>{user.user_registered_date}</strong>
                </td>

                <td>
                    {(user.active_hours / 60).toFixed(2)}
                </td>
            </tr>
            {isOpen && (
                <tr>
                    <td colSpan="6">
                        {user.licenses.length > 0 ? (
                            user.licenses.map((license) => (
                                <User user={user} license={license} key={license.id} />
                            ))
                        ) : (
                            <p>No licenses found for this user.</p>
                        )}
                    </td>
                </tr>
            )}
        </tbody>

    );
};

export default UserRow;
