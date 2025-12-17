import { Link, Navigate } from "react-router-dom";

const Home = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Build habits. Stay consistent.
        </h1>

        <p className="text-zinc-400 mb-8">
          Track daily habits, build streaks, and stay accountable —
          without distractions.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 rounded-lg bg-indigo-600
                       hover:bg-indigo-700 font-medium"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-lg border
                       border-zinc-700 hover:bg-zinc-900"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
