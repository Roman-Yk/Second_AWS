import React, { useEffect, useState } from 'react';
import 'regenerator-runtime/runtime';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import Pagination from './Pagination';
import Users from './Users';
import { If } from '@tms/shared/components/If';
import { CustomLicenseKey } from './Licenses';

const getToken = () => window.location.search.slice(1)
  .split('&')
  .map(i => i.split("="))
  .reduce((curr, item) => {
    curr[item[0]] = item[1];
    return curr;
  }, {}) as any

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
      const res = await fetch('http://'+window.location.hostname+':8000/api/client/all', {
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

  const handleSort =  () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
      setUsers(users.sort((a, b) => a.user_display_name.localeCompare(b.user_display_name)))
    } else {
      setSortOrder('asc');
      setUsers(users.sort((a, b) => b.user_display_name.localeCompare(a.user_display_name)))
    }
  };


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const send =  async() => {
    const res = await fetch('http://'+window.location.hostname+':8000/api/user/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${getToken().access_token}`,
      },
      body: JSON.stringify({'value': filterValue})
    });
    const data = await res.json();

    setUsers(data.items);

  }

  const handleInputChange = (event) => {
    setFilterValue(event.target.value);
  };
  

  return (
    <div>
      <button onClick={handleSort}>Sort</button>

      <input type="text" value={filterValue} onChange={handleInputChange}/>
      <button onClick={send}>Submit</button>
      <Users users={currentUsers} loading={loading} />
      <Pagination
        postsPerPage={usersPerPage}
        totalPosts={users.length}
        paginate={paginate}
      />
     
    </div>
  );
};

export default UsersList;
