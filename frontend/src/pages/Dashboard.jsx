import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Welcome to NutriPlan Manager
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Track your nutrition plans, manage meals, and reach your health goals.
        </p>

        {user ? (
          <div>
            <p className="text-xl mb-6">Hello, <span className="font-semibold">{user.name}</span>!</p>
            <div className="flex justify-center gap-4">
              <Link
                to="/plans"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 text-lg"
              >
                View My Plans
              </Link>
              <Link
                to="/plans/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg"
              >
                Create New Plan
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-500 mb-6">
              Please login or register to start managing your nutrition plans.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
