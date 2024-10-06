import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SprintList() {
  const [sprints, setSprints] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/sprints')
      .then(response => setSprints(response.data))
      .catch(error => console.error('Error fetching sprints:', error));
  }, []);

  return (
    <div>
      <h2>Sprint List</h2>
      <ul>
        {sprints.map(sprint => (
          <li key={sprint.id}>{sprint.sprint_name} - {sprint.start_date} to {sprint.end_date}</li>
        ))}
      </ul>
    </div>
  );
}

export default SprintList;