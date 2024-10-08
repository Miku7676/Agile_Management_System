import React, { useState, useEffect } from 'react';
import axios from 'axios';


function UserList() {
  const [users, setUsers] = useState([]);
  

  // Fetch users when the component loads
  useEffect(() => {
    axios.get('http://localhost:5000/api/users')  // Fixed typo here
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  

  return (
    <div>
      <h3>User List</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.USERNAME} - {user.EMAIL}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
