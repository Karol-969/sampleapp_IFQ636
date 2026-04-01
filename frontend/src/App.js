import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import CreatePlan from './pages/CreatePlan';
import EditPlan from './pages/EditPlan';
import PlanDetail from './pages/PlanDetail';
import PlanMeals from './pages/PlanMeals';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/plans/new" element={<CreatePlan />} />
          <Route path="/plans/:id" element={<PlanDetail />} />
          <Route path="/plans/:id/edit" element={<EditPlan />} />
          <Route path="/plans/:id/meals" element={<PlanMeals />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
