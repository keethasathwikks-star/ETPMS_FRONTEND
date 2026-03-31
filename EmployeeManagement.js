import { useState, useEffect } from 'react';
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api';
import './EmployeeManagement.css';

/**
 * Employee Management page with full CRUD operations.
 * Features: data table, add/edit modal form, delete confirmation.
 */
const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', department: '', role: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await getAllEmployees();
            setEmployees(response.data);
        } catch (err) {
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    // Open form for adding a new employee
    const handleAdd = () => {
        setEditingEmployee(null);
        setFormData({ name: '', email: '', department: '', role: '' });
        setError('');
        setShowForm(true);
    };

    // Open form for editing an existing employee
    const handleEdit = (emp) => {
        setEditingEmployee(emp);
        setFormData({
            name: emp.name,
            email: emp.email,
            department: emp.department,
            role: emp.role,
        });
        setError('');
        setShowForm(true);
    };

    // Delete an employee with confirmation
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee? All associated tasks and reviews will also be deleted.')) {
            try {
                await deleteEmployee(id);
                fetchEmployees();
            } catch (err) {
                console.error('Error deleting employee:', err);
            }
        }
    };

    // Submit the form (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (editingEmployee) {
                await updateEmployee(editingEmployee.id, formData);
            } else {
                await createEmployee(formData);
            }
            setShowForm(false);
            fetchEmployees();
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.email || 'An error occurred';
            setError(typeof message === 'string' ? message : 'Validation error. Please check your inputs.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner"></div>
                <p>Loading employees...</p>
            </div>
        );
    }

    return (
        <div className="employee-page" id="employee-management-page">
            <div className="page-header">
                <div>
                    <h1>Employee Management</h1>
                    <p className="page-subtitle">Manage your team members</p>
                </div>
                <button className="btn btn-primary" onClick={handleAdd} id="btn-add-employee">
                    + Add Employee
                </button>
            </div>

            {/* Employee Data Table */}
            <div className="table-container">
                <table className="data-table" id="employee-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    No employees found. Click "Add Employee" to create one.
                                </td>
                            </tr>
                        ) : (
                            employees.map((emp) => (
                                <tr key={emp.id}>
                                    <td>{emp.id}</td>
                                    <td className="name-cell">{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td><span className="badge badge-dept">{emp.department}</span></td>
                                    <td><span className="badge badge-role">{emp.role}</span></td>
                                    <td className="action-cell">
                                        <button className="btn btn-sm btn-edit" onClick={() => handleEdit(emp)}>Edit</button>
                                        <button className="btn btn-sm btn-delete" onClick={() => handleDelete(emp.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form for Add/Edit */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form" id="employee-form">
                            {error && <div className="form-error">{error}</div>}
                            <div className="form-group">
                                <label htmlFor="emp-name">Full Name</label>
                                <input id="emp-name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="emp-email">Email Address</label>
                                <input id="emp-email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. john@company.com" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="emp-department">Department</label>
                                <input id="emp-department" type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Engineering" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="emp-role">Role</label>
                                <input id="emp-role" type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Software Engineer" required />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingEmployee ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;
