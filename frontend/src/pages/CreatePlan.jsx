import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const CreatePlan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    goal: 'maintenance',
    targetCalories: 2000,
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/api/plans', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/plans');
    } catch (error) {
      console.log(error);
      alert('Failed to create plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Nutrition Plan</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Plan Name *</label>
          <input
            type="text"
            name="planName"
            value={formData.planName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="e.g. My Weight Loss Plan"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Describe your plan..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Goal</label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
            <option value="bulking">Bulking</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Target Calories (per day)</label>
          <input
            type="number"
            name="targetCalories"
            value={formData.targetCalories}
            onChange={handleChange}
            min="500"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Plan'}
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;
