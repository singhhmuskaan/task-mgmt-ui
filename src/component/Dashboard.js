import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [filter, setFilter] = useState("all");
    const [editingTask, setEditingTask] = useState(null);
    const [editedTaskName, setEditedTaskName] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/tasks", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
            localStorage.removeItem("token");
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleCreateTask = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:5000/api/tasks",
                { name: newTask },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks([...tasks, response.data]);
            setNewTask("");
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleToggleTask = async (taskId, isCompleted) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:5000/api/tasks/${taskId}`,
                { isCompleted: !isCompleted },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(tasks.map((task) => (task._id === taskId ? response.data : task)));
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleEditTask = async (taskId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:5000/api/tasks/${taskId}`,
                { name: editedTaskName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(tasks.map((task) => (task._id === taskId ? response.data : task)));
            setEditingTask(null);
            setEditedTaskName("");
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "all") return true;
        if (filter === "completed") return task.isCompleted;
        if (filter === "pending") return !task.isCompleted;
        return true;
    });

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title text-center">Dashboard</h2>
                    <h4 className="text-center">Welcome, {user?.name}</h4>
                    <button onClick={handleLogout} className="btn btn-danger mt-3 d-block mx-auto">Logout</button>

                    <div className="input-group mt-4">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Enter new task"
                            className="form-control"
                        />
                        <button onClick={handleCreateTask} className="btn btn-primary">Add Task</button>
                    </div>

                    <div className="mt-3">
                        <button onClick={() => setFilter("all")} className="btn btn-outline-primary me-2">All</button>
                        <button onClick={() => setFilter("pending")} className="btn btn-outline-warning me-2">Pending</button>
                        <button onClick={() => setFilter("completed")} className="btn btn-outline-success">Completed</button>
                    </div>

                    <ul className="list-group mt-4">
                        {filteredTasks.map((task) => (
                            <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
                                {editingTask === task._id ? (
                                    <input
                                        type="text"
                                        value={editedTaskName}
                                        onChange={(e) => setEditedTaskName(e.target.value)}
                                        className="form-control me-2"
                                    />
                                ) : (
                                    <span className={task.isCompleted ? "text-decoration-line-through text-muted" : ""}>{task.name}</span>
                                )}
                                <div>
                                    {editingTask === task._id ? (
                                        <button onClick={() => handleEditTask(task._id)} className="btn btn-sm btn-info me-2">Save</button>
                                    ) : (
                                        <button onClick={() => { setEditingTask(task._id); setEditedTaskName(task.name); }} className="btn btn-sm btn-secondary me-2">Edit</button>
                                    )}
                                    <button
                                        onClick={() => handleToggleTask(task._id, task.isCompleted)}
                                        className={`btn btn-sm ${task.isCompleted ? "btn-warning" : "btn-success"} me-2"}`}
                                    >
                                        {task.isCompleted ? "Mark Pending" : "Mark Complete"}
                                    </button>
                                    <button onClick={() => handleDeleteTask(task._id)} className="btn btn-sm btn-danger">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
