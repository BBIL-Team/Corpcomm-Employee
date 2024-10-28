import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';

function App() {
    const { signOut } = useAuthenticator();
    const employeeId = '10005315'; 
    const [tasks, setTasks] = useState<string>(''); 
    const [loading, setLoading] = useState(false);
    const [noTasksMessage, setNoTasksMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showRemovePopup, setShowRemovePopup] = useState(false);
    const [popupTasks, setPopupTasks] = useState([]);
    const [messagePopup, setMessagePopup] = useState<{ show: boolean, content: string }>({ show: false, content: '' });

    const fetchTasksForEmployee = async (employeeId: string) => {
        setLoading(true);
        setTasks('');
        setNoTasksMessage(false);
        setErrorMessage(null);

        try {
            const apiUrl = `https://aehcu90kr8.execute-api.ap-south-1.amazonaws.com/default/Test5?EmployeeID=${encodeURIComponent(employeeId)}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
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
            setErrorMessage('Failed to fetch tasks.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasksForEmployee(employeeId);
    }, [employeeId]);

    const showAddTaskPopup = () => setShowAddPopup(true);
        const showRemoveTaskPopup = () => {
        populatePopupTable();
        setShowRemovePopup(true);
    };

    const closePopup = () => setShowAddPopup(false);
        setShowRemovePopup(false);
        setMessagePopup({ show: false, content: '' });
        setPopupTasks([]);
    };


    const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const params = new URLSearchParams(formData as any).toString();

        try {
            const response = await fetch(e.currentTarget.action, {
                method: e.currentTarget.method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params,
            });

            const result = await response.json();
            setMessagePopup({ show: true, content: result.message });
            closePopup();
            fetchTasksForEmployee(employeeId);
        } catch (error) {
            console.error('Error adding task:', error);
            setMessagePopup({ show: true, content: 'Failed to add task.' });
        }
    };
        const populatePopupTable = () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tasks;
        const rows = tempDiv.querySelectorAll('tr');

        const tasksArray = Array.from(rows).slice(1).map(row => ({
            employeeName: row.children[1]?.innerText || '',
            taskDescription: row.children[2]?.innerText || '',
            startDate: row.children[3]?.innerText || '',
            endDate: row.children[4]?.innerText || '',
            rating: row.children[5]?.innerText || '',
            remarks: row.children[6]?.innerText || '',
            row,
        }));

        setPopupTasks(tasksArray);
    };

    const removeTask = async (employeeName, taskDescription) => {
        const apiUrl = 'https://oje3cr7sy2.execute-api.ap-south-1.amazonaws.com/V1/RemoveTask';
        const plainText = `${employeeName},${taskDescription}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: plainText,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }

            const data = await response.json();
            setMessagePopup({ show: true, content: data.message || 'Task removed successfully.' });
            fetchTasksForEmployee(employeeId);
        } catch (error) {
            console.error('Error:', error);
            setMessagePopup({ show: true, content: 'Request failed: ' + error.message });
        }
    };


    return (
        <main>
            <h1>Employee Task List</h1>
            
            {loading && <div id="loading">Loading tasks...</div>}
            {errorMessage && <div id="errorMessage">{errorMessage}</div>}

            <div id="cardContainer" dangerouslySetInnerHTML={{ __html: tasks }} />
            
            {noTasksMessage && <div id="noTasksMessage">No tasks found for the Employee ID.</div>}
            
            <div id="buttonContainer">
                <button onClick={showAddTaskPopup}>Add Task</button>&nbsp;&nbsp;
                <button onClick={showRemoveTaskPopup>Remove Task</button>
            </div>
            
            {showAddPopup && (
                <>
                    <div className="overlay" onClick={closePopup}></div>
                    <div className={`popup ${showAddPopup ? 'show' : ''}`}>
                        <h3>Add New Task</h3>
                        <form id="taskForm" action="https://bi3hh9apo0.execute-api.ap-south-1.amazonaws.com/S1/Addtask" method="POST" onSubmit={handleAddTask}>
                            <label htmlFor="employeeID">Employee ID:</label>
                            <input type="text" id="employeeID" name="eID" required />
                            
                            <label htmlFor="employeeName">Employee Name:</label>
                            <input type="text" id="employeeName" name="eName" required />
                            
                            <label htmlFor="taskDescription">Task:</label>
                            <input type="text" id="taskDescription" name="TaskDescription" required />
                            
                            <label htmlFor="StartDate">Start Date:</label>
                            <input type="date" id="StartDate" name="StartDate" />
                            
                            <label htmlFor="EndDate">End Date:</label>
                            <input type="date" id="EndDate" name="EndDate" />
                            
                            <button type="submit">Add</button>
                            <button type="button" onClick={closePopup}>Cancel</button>
                        </form>
                    </div>
                </>
            )}
            {showRemovePopup && (
                    <div className="popup1">
                        <h3>Remove Task</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                    <th>Task Description</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Rating</th>
                                    <th>Remarks</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popupTasks.map((task, index) => (
                                    <tr key={index}>
                                        <td>{employeeId}</td>
                                        <td>{task.employeeName}</td>
                                        <td>{task.taskDescription}</td>
                                        <td>{task.startDate}</td>
                                        <td>{task.endDate}</td>
                                        <td>{task.rating}</td>
                                        <td>{task.remarks}</td>
                                        <td>
                                            <button onClick={() => removeTask(task.employeeName, task.taskDescription)}>X</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={closePopup}>Close</button>
                    </div>
                )}

            {messagePopup.show && (
                <div className="popup">
                    <p>{messagePopup.content}</p>
                    <button onClick={() => setMessagePopup({ ...messagePopup, show: false })}>Close</button>
                </div>
            )}
            
            <button onClick={signOut}>Sign out</button>
        </main>
    );
}

export default App;
