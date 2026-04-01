import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PlanMeals = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mealData, setMealData] = useState({
    mealName: '',
    mealType: 'breakfast',
    calories: '',
    protien: '',
    carbs: '',
    fats: '',
    notes: '',
  });

  useEffect(() => {
    fetchPlanData();
  }, [id, user]);

  const fetchPlanData = async () => {
    try {
      const res = await axiosInstance.get(`/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPlan(res.data);
    } catch (err) {
      alert('Error loading plan');
      navigate('/plans');
    } finally {
      setLoading(false);
    }
  };

  const handleMealChange = (e) => {
    setMealData({ ...mealData, [e.target.name]: e.target.value });
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`/api/plans/${id}/meals`, {
        ...mealData,
        calories: Number(mealData.calories),
        protien: Number(mealData.protien) || 0,
        carbs: Number(mealData.carbs) || 0,
        fats: Number(mealData.fats) || 0,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPlan(res.data);
      setMealData({ mealName: '', mealType: 'breakfast', calories: '', protien: '', carbs: '', fats: '', notes: '' });
      setShowForm(false);
    } catch (err) {
      alert('Failed to add meal');
    }
  };

  const handleRemoveMeal = async (mealId) => {
    if (!window.confirm('Remove this meal?')) return;
    try {
      const res = await axiosInstance.delete(`/api/plans/${id}/meals/${mealId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPlan(res.data);
    } catch (err) {
      alert('Error removing meal');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading meals...</div>;
  if (!plan) return <div className="text-center mt-10">Plan not found</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Meals</h1>
          <p className="text-gray-500">{plan.planName}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showForm ? 'Cancel' : '+ Add Meal'}
        </button>
      </div>

      {/* add meal form */}
      {showForm && (
        <form onSubmit={handleAddMeal} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Meal</h2>

          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Meal Name *</label>
            <input
              type="text"
              name="mealName"
              value={mealData.mealName}
              onChange={handleMealChange}
              required
              className="w-full p-2 border rounded"
              placeholder="e.g. Grilled Chicken Salad"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-gray-700 mb-1">Meal Type *</label>
              <select name="mealType" value={mealData.mealType} onChange={handleMealChange} className="w-full p-2 border rounded">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Calories *</label>
              <input
                type="number"
                name="calories"
                value={mealData.calories}
                onChange={handleMealChange}
                required
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-3">
            <div>
              <label className="block text-gray-700 mb-1">Protein (g)</label>
              <input type="number" name="protien" value={mealData.protien} onChange={handleMealChange} min="0" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Carbs (g)</label>
              <input type="number" name="carbs" value={mealData.carbs} onChange={handleMealChange} min="0" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Fats (g)</label>
              <input type="number" name="fats" value={mealData.fats} onChange={handleMealChange} min="0" className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Notes</label>
            <input type="text" name="notes" value={mealData.notes} onChange={handleMealChange} className="w-full p-2 border rounded" placeholder="Optional notes" />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Add Meal
          </button>
        </form>
      )}

      {/* meals list */}
      <div className="space-y-4">
        {plan.meals && plan.meals.length > 0 ? (
          plan.meals.map((meal) => (
            <div key={meal._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{meal.mealName}</h3>
                <p className="text-sm text-gray-500 capitalize">{meal.mealType}</p>
                <p className="text-sm">
                  {meal.calories} cal | P: {meal.protien || 0}g | C: {meal.carbs || 0}g | F: {meal.fats || 0}g
                </p>
                {meal.notes && <p className="text-xs text-gray-400 mt-1">{meal.notes}</p>}
              </div>
              <button
                onClick={() => handleRemoveMeal(meal._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No meals added to this plan yet.</p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate(`/plans/${id}`)}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Back to Plan
        </button>
      </div>
    </div>
  );
};

export default PlanMeals;
