import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="w-full top-0 sticky bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">
          HabitTracker
        </Link>

        {!token ? (
          <div className="flex items-center gap-4 text-sm">
            <Link
              to="/login"
              className="text-zinc-400 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Sign up
            </Link>
          </div>
        ) : (
          <div className="relative flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              to="/friends"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Friends
            </Link>

            <Link
              to="/activity"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Activity
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 cursor-pointer rounded-full bg-zinc-800
               flex items-center justify-center
               hover:bg-zinc-700"
            >
              <User size={18} />
            </button>

            {open && (
              <div
                className="absolute right-0 top-12 w-48
                 bg-zinc-900 border border-zinc-800
                 rounded-lg shadow-lg"
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2
                   text-sm text-red-400 hover:bg-zinc-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        )}
      </div>
    </nav>
  );
};

export default Navbar;
