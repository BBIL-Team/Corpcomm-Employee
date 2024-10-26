import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
    const { signOut } = useAuthenticator();
     const employeeId = '10005315'; 
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noTasksMessage, setNoTasksMessage] = useState(false);
    const fetchTasksForEmployee = async (employeeId) => {
        setLoading(true);
        setTasks([]);
        setNoTasksMessage(false);
        try {
            const apiUrl = `https://aehcu90kr8.execute-api.ap-south-1.amazonaws.com/default/Test5?EmployeeID=${encodeURIComponent(employeeId)}`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.text();
            if (data.trim() !== '') {
                setTasks(data);
                setNoTasksMessage(false);
            } else {
                setNoTasksMessage(true);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setMessagePopup({ show: true, content: 'Failed to fetch tasks.' });
        } finally {
            setLoading(false);
        }
    };


  return (
    <main>
      <h1>Employee Task List</h1>
      {loading && <div id="loading">Loading tasks...</div>}
            <div id="cardContainer" dangerouslySetInnerHTML={{ __html: tasks }} />
            {noTasksMessage && <div id="noTasksMessage">No tasks found for the Employee ID.</div>}
            <div id="buttonContainer">
                <button>Add Task</button>&nbsp;&nbsp;
                <button>Remove Task</button>
            </div>
            <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
