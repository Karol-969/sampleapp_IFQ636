import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PlanDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlanData = async () => {
      try {
        const res = await axiosInstance.get(`/api/plans/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPlan(res.data);
      } catch (err) {
        alert('Failed to load plan');
        navigate('/plans');
      } finally {
        setLoading(false);
      }
    };

    if (user) getPlanData();
  }, [id, user, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await axiosInstance.delete(`/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/plans');
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading plan details...</div>;
  if (!plan) return <div className="text-center mt-10">Plan not found</div>;

  // calc total cals from meals
  const totalMealCals = plan.meals ? plan.meals.reduce((sum, meal) => sum + meal.calories, 0) : 0;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{plan.planName}</h1>
          <span className={`px-3 py-1 rounded text-sm font-medium ${
            plan.status === 'active' ? 'bg-green-100 text-green-800' :
            plan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {plan.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{plan.description || 'No description provided'}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">Goal</p>
            <p className="font-semibold">{plan.goal.replace('_', ' ')}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">Target Calories</p>
            <p className="font-semibold">{plan.targetCalories} cal/day</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-semibold">{plan.startDate ? new Date(plan.startDate).toLocaleDateString() : 'Not set'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-semibold">{plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'Not set'}</p>
          </div>
        </div>

        {/* meals summary */}
        <div className="border-t pt-4 mb-4">
          <h2 className="text-xl font-bold mb-3">Meals ({plan.meals ? plan.meals.length : 0})</h2>
          <p className="text-gray-600 mb-3">Total calories from meals: <strong>{totalMealCals}</strong></p>

          {plan.meals && plan.meals.length > 0 ? (
            <div className="space-y-2">
              {plan.meals.map((meal) => (
                <div key={meal._id} className="bg-gray-50 p-3 rounded flex justify-between">
                  <div>
                    <p className="font-medium">{meal.mealName}</p>
                    <p className="text-sm text-gray-500">{meal.mealType} - {meal.calories} cal</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    P: {meal.protien || 0}g | C: {meal.carbs || 0}g | F: {meal.fats || 0}g
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No meals added yet.</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Link
            to={`/plans/${id}/edit`}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit Plan
          </Link>
          <Link
            to={`/plans/${id}/meals`}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Manage Meals
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Plan
          </button>
          <Link
            to="/plans"
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Back to Plans
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
