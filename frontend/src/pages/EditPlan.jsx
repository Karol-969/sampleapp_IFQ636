import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const EditPlan = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    goal: 'maintenance',
    targetCalories: 2000,
    startDate: '',
    endDate: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const res = await axiosInstance.get(`/api/plans/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const plan = res.data;
        setFormData({
          planName: plan.planName,
          description: plan.description || '',
          goal: plan.goal,
          targetCalories: plan.targetCalories,
          startDate: plan.startDate ? plan.startDate.substring(0, 10) : '',
          endDate: plan.endDate ? plan.endDate.substring(0, 10) : '',
          status: plan.status,
        });
      } catch (error) {
        alert('Could not load plan data');
        navigate('/plans');
      } finally {
        setLoading(false);
      }
    };

    if (user) loadPlan();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/plans/${id}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate(`/plans/${id}`);
    } catch (err) {
      alert('Failed to update plan');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Plan</h1>
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
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Goal</label>
          <select name="goal" value={formData.goal} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
            <option value="bulking">Bulking</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Target Calories</label>
          <input
            type="number"
            name="targetCalories"
            value={formData.targetCalories}
            onChange={handleChange}
            min="500"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">End Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate('/plans')}
            className="flex-1 bg-gray-400 text-white p-3 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlan;
