import React, { useEffect, useState } from 'react';
import 'regenerator-runtime/runtime';
import User from './User'

const Users = ({ users, loading }) => {

  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <ul>
      {users.map((user) => (
        <User user={user} />
      ))}
    </ul>

  );
};

export default Users;
