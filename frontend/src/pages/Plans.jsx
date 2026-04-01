import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Plans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get('/api/plans', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPlans(response.data);
      } catch (error) {
        console.log('error fetching plans');
        alert('Failed to load plans.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPlans();
  }, [user]);

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await axiosInstance.delete(`/api/plans/${planId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPlans(plans.filter(p => p._id !== planId));
    } catch (err) {
      alert('Failed to delete plan');
    }
  };

  // filter plans based on search
  const filterdPlans = plans.filter(plan =>
    plan.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center mt-10">Loading plans...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Nutrition Plans</h1>
        <Link
          to="/plans/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + New Plan
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search plans..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-6 p-3 border rounded-lg"
      />

      {filterdPlans.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          {searchTerm ? 'No plans match your search.' : 'No nutrition plans yet. Create your first one!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterdPlans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-lg shadow-md p-5 border">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{plan.planName}</h2>
                <span className={`text-sm px-2 py-1 rounded ${
                  plan.status === 'active' ? 'bg-green-100 text-green-800' :
                  plan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {plan.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{plan.description || 'No description'}</p>
              <p className="text-sm text-gray-500">Goal: {plan.goal.replace('_', ' ')}</p>
              <p className="text-sm text-gray-500">Target: {plan.targetCalories} cal/day</p>
              <p className="text-sm text-gray-500">Meals: {plan.meals ? plan.meals.length : 0}</p>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/plans/${plan._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  View
                </Link>
                <Link
                  to={`/plans/${plan._id}/edit`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <Link
                  to={`/plans/${plan._id}/meals`}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                >
                  Meals
                </Link>
                <button
                  onClick={() => handleDeletePlan(plan._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Plans;
