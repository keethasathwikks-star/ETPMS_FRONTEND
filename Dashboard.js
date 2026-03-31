import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api';
import './Dashboard.css';

/**
 * Dashboard page displaying aggregated statistics about
 * employees, tasks (by status), reviews, and average rating.
 */
const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        totalReviews: 0,
        averageRating: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await getDashboardStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    // Card configuration for cleaner rendering
    const cards = [
        { title: 'Total Employees', value: stats.totalEmployees, icon: '👥', color: 'indigo' },
        { title: 'Total Tasks', value: stats.totalTasks, icon: '📋', color: 'blue' },
        { title: 'Pending Tasks', value: stats.pendingTasks, icon: '⏳', color: 'amber' },
        { title: 'In Progress', value: stats.inProgressTasks, icon: '🔄', color: 'cyan' },
        { title: 'Completed', value: stats.completedTasks, icon: '✅', color: 'green' },
        { title: 'Total Reviews', value: stats.totalReviews, icon: '⭐', color: 'purple' },
        { title: 'Avg Rating', value: stats.averageRating.toFixed(1), icon: '📊', color: 'rose' },
    ];

    return (
        <div className="dashboard" id="dashboard-page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p className="page-subtitle">Overview of employee tasks and performance</p>
            </div>

            <div className="stats-grid">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`stat-card stat-card-${card.color}`}
                        id={`stat-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                    >
                        <div className="stat-icon">{card.icon}</div>
                        <div className="stat-info">
                            <span className="stat-value">{card.value}</span>
                            <span className="stat-label">{card.title}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
