import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import TaskManagement from './pages/TaskManagement';
import PerformanceReviewPage from './pages/PerformanceReview';
import AIAnalytics from './pages/AIAnalytics';
import './App.css';

/**
 * Root application component.
 * Sets up React Router with Navbar and page routes.
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/reviews" element={<PerformanceReviewPage />} />
            <Route path="/ai-analytics" element={<AIAnalytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
