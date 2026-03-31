import { useState, useEffect } from 'react';
import { getAllReviews, getAllEmployees, createReview, deleteReview } from '../api';
import './PerformanceReview.css';

/**
 * Performance Review page for adding and viewing employee reviews.
 * Features: star-based rating display, review form, employee filter.
 */
const PerformanceReviewPage = () => {
    const [reviews, setReviews] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5, feedback: '', reviewDate: '', employeeId: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [revRes, empRes] = await Promise.all([getAllReviews(), getAllEmployees()]);
            setReviews(revRes.data);
            setEmployees(empRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setFormData({
            rating: 5,
            feedback: '',
            reviewDate: new Date().toISOString().split('T')[0],
            employeeId: ''
        });
        setError('');
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this review?')) {
            try {
                await deleteReview(id);
                fetchData();
            } catch (err) {
                console.error('Error deleting review:', err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const payload = {
            ...formData,
            rating: parseInt(formData.rating),
            employeeId: parseInt(formData.employeeId),
        };

        try {
            await createReview(payload);
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

    // Render star rating (filled vs empty)
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? 'star-filled' : 'star-empty'}`}>
                    ★
                </span>
            );
        }
        return <div className="stars-container">{stars}</div>;
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner"></div>
                <p>Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="review-page" id="performance-review-page">
            <div className="page-header">
                <div>
                    <h1>Performance Reviews</h1>
                    <p className="page-subtitle">Track and manage employee performance</p>
                </div>
                <button className="btn btn-primary" onClick={handleAdd} id="btn-add-review">
                    + Add Review
                </button>
            </div>

            {/* Reviews Table */}
            <div className="table-container">
                <table className="data-table" id="review-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee</th>
                            <th>Rating</th>
                            <th>Feedback</th>
                            <th>Review Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    No reviews found. Click "Add Review" to create one.
                                </td>
                            </tr>
                        ) : (
                            reviews.map((review) => (
                                <tr key={review.id}>
                                    <td>{review.id}</td>
                                    <td className="name-cell">{review.employeeName}</td>
                                    <td>{renderStars(review.rating)}</td>
                                    <td>
                                        <span className="feedback-text">{review.feedback}</span>
                                    </td>
                                    <td>{review.reviewDate}</td>
                                    <td className="action-cell">
                                        <button className="btn btn-sm btn-delete" onClick={() => handleDelete(review.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form for Add Review */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Performance Review</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form" id="review-form">
                            {error && <div className="form-error">{error}</div>}
                            <div className="form-group">
                                <label htmlFor="review-employee">Employee</label>
                                <select id="review-employee" name="employeeId" value={formData.employeeId} onChange={handleChange} required>
                                    <option value="">Select an employee...</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>{emp.name} — {emp.department}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="review-rating">Rating (1–5)</label>
                                <div className="rating-input">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            className={`rating-star ${val <= formData.rating ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, rating: val })}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span className="rating-value">{formData.rating}/5</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="review-feedback">Feedback</label>
                                <textarea id="review-feedback" name="feedback" value={formData.feedback} onChange={handleChange} placeholder="Write performance feedback..." rows="4" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="review-date">Review Date</label>
                                <input id="review-date" type="date" name="reviewDate" value={formData.reviewDate} onChange={handleChange} required />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerformanceReviewPage;
