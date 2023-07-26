import React, { useEffect, useState } from 'react';
import 'regenerator-runtime/runtime';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import Pagination from './Pagination';

import UserRow from './UserRow';
import { If } from '@tms/shared/components/If';
import { CustomLicenseKey } from './Licenses';
import './styles.scss'

const getToken = () => window.location.search.slice(1)
  .split('&')
  .map(i => i.split("="))
  .reduce((curr, item) => {
    curr[item[0]] = item[1];
    return curr;
  }, {}) as any

const buttonStyle = {
  color: 'black',
  background: 'none',
  border: 'none',
  borderColor: 'gray',
  fontWeight: 'bold',
  cursor: 'pointer',
};


const UsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch('http://' + window.location.hostname + ':8000/api/client/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${getToken().access_token}`,
        },
      });
      const data = await res.json();
      setUsers(data.items);
      setLoading(false);

    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleNameSort = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
      setUsers(users.sort((a, b) => a.user_display_name.localeCompare(b.user_display_name)))
    } else {
      setSortOrder('asc');
      setUsers(users.sort((a, b) => b.user_display_name.localeCompare(a.user_display_name)))
    }
  };
  const handleEmailSort = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
      setUsers(users.sort((a, b) => a.user_email.localeCompare(b.user_email)))
    } else {
      setSortOrder('asc');
      setUsers(users.sort((a, b) => b.user_email.localeCompare(a.user_email)))
    }
  };
  const handleDateSort = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
      setUsers(users.sort((a, b) => a.user_registered_date.localeCompare(b.user_registered_date)))
    } else {
      setSortOrder('asc');
      setUsers(users.sort((a, b) => b.user_registered_date.localeCompare(a.user_registered_date)))
    }
  };
  const handleHoursSort = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
      setUsers(users.sort((a, b) => a.active_hours - b.active_hours));
    } else {
      setSortOrder('asc');
      setUsers(users.sort((a, b) => b.active_hours - a.active_hours));
    }
  };


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const send = async () => {
    const res = await fetch('http://' + window.location.hostname + ':8000/api/user/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${getToken().access_token}`,
      },
      body: JSON.stringify({ 'value': filterValue })
    });
    const data = await res.json();

    setUsers(data.items);

  }

  const handleInputChange = async (event) => {
    setFilterValue(event.target.value);
    const res = await fetch('http://' + window.location.hostname + ':8000/api/user/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${getToken().access_token}`,
      },
      body: JSON.stringify({ 'value': event.target.value })
    });
    const data = await res.json();
    setUsers(data.items);
  };


  return (
    <div className=''>

      <input type="text" value={filterValue} onChange={handleInputChange} />
      <table border='1' style={{ borderColor: 'gray' }}>
        <thead>
          <th><button style={buttonStyle} onClick={handleNameSort}>Name</button></th>
          <th><button style={buttonStyle} onClick={handleEmailSort}>Email</button> </th>
          <th>Phone</th>
          <th><button style={buttonStyle} onClick={handleDateSort}>Registration date</button></th>
          <th><button style={buttonStyle} onClick={handleHoursSort}>Active hours</button></th>
        </thead>
        {currentUsers.map((user) => (
        <UserRow user={user} />
      ))}
      </table>

      <Pagination
        postsPerPage={usersPerPage}
        totalPosts={users.length}
        paginate={paginate}
      />

    </div>
  );
};

export default UsersList;
