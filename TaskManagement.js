import { useState, useEffect } from 'react';
import { getAllTasks, getAllEmployees, createTask, updateTask, deleteTask } from '../api';
import './TaskManagement.css';

/**
 * Task Management page for assigning tasks, updating statuses, and managing tasks.
 * Features: status-colored badges, employee dropdown for assignment, status transitions.
 */
const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', deadline: '', status: 'PENDING', employeeId: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [taskRes, empRes] = await Promise.all([getAllTasks(), getAllEmployees()]);
            setTasks(taskRes.data);
            setEmployees(empRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingTask(null);
        setFormData({ title: '', description: '', deadline: '', status: 'PENDING', employeeId: '' });
        setError('');
        setShowForm(true);
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            deadline: task.deadline,
            status: task.status,
            employeeId: task.employeeId,
        });
        setError('');
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(id);
                fetchData();
            } catch (err) {
                console.error('Error deleting task:', err);
            }
        }
    };

    // Quick status update without opening the full form
    const handleStatusChange = async (task, newStatus) => {
        try {
            await updateTask(task.id, { ...task, status: newStatus });
            fetchData();
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const payload = {
            ...formData,
            employeeId: parseInt(formData.employeeId),
        };

        try {
            if (editingTask) {
                await updateTask(editingTask.id, payload);
            } else {
                await createTask(payload);
            }
            setShowForm(false);
            fetchData();
        } catch (err) {
            const message = err.response?.data?.message || 'An error occurred';
            setError(typeof message === 'string' ? message : 'Validation error. Please check your inputs.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Status badge color mapping
    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'IN_PROGRESS': return 'status-progress';
            case 'COMPLETED': return 'status-completed';
            default: return '';
        }
    };


    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner"></div>
                <p>Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className="task-page" id="task-management-page">
            <div className="page-header">
                <div>
                    <h1>Task Management</h1>
                    <p className="page-subtitle">Assign and track employee tasks</p>
                </div>
                <button className="btn btn-primary" onClick={handleAdd} id="btn-add-task">
                    + Assign Task
                </button>
            </div>

            {/* Task Data Table */}
            <div className="table-container">
                <table className="data-table" id="task-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Assigned To</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    No tasks found. Click "Assign Task" to create one.
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.id}</td>
                                    <td className="name-cell">
                                        {task.title}
                                        {task.description && (
                                            <span className="task-desc">{task.description}</span>
                                        )}
                                    </td>
                                    <td>{task.employeeName}</td>
                                    <td>{task.deadline}</td>
                                    <td>
                                        <select
                                            className={`status-select ${getStatusClass(task.status)}`}
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task, e.target.value)}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </td>
                                    <td className="action-cell">
                                        <button className="btn btn-sm btn-edit" onClick={() => handleEdit(task)}>Edit</button>
                                        <button className="btn btn-sm btn-delete" onClick={() => handleDelete(task.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form for Add/Edit Task */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingTask ? 'Edit Task' : 'Assign New Task'}</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form" id="task-form">
                            {error && <div className="form-error">{error}</div>}
                            <div className="form-group">
                                <label htmlFor="task-title">Task Title</label>
                                <input id="task-title" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Design new homepage" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="task-description">Description</label>
                                <textarea id="task-description" name="description" value={formData.description} onChange={handleChange} placeholder="Optional task description..." rows="3" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="task-deadline">Deadline</label>
                                    <input id="task-deadline" type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="task-status">Status</label>
                                    <select id="task-status" name="status" value={formData.status} onChange={handleChange} required>
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="task-employee">Assign To</label>
                                <select id="task-employee" name="employeeId" value={formData.employeeId} onChange={handleChange} required>
                                    <option value="">Select an employee...</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>{emp.name} — {emp.department}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingTask ? 'Update' : 'Assign'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManagement;
