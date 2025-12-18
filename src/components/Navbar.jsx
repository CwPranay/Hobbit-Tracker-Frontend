import { Link, useNavigate } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          Hobbie Tracker
        </Link>

        {/* Desktop */}
        {token && (
          <div className="hidden md:flex items-center gap-6">
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
              flex items-center justify-center hover:bg-zinc-700"
            >
              <User size={18} />
            </button>

            {open && (
              <div className="absolute right-6 top-16 w-40 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="text-zinc-400 cursor-pointer  hover:text-white"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-zinc-950
        border-l border-zinc-800 md:hidden
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <span className="font-semibold text-white">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="text-zinc-400 cursor-pointer  hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col px-6 py-6 gap-4">
          {!token ? (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="text-zinc-300 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-center"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-zinc-300 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/friends"
                onClick={() => setOpen(false)}
                className="text-zinc-300 hover:text-white"
              >
                Friends
              </Link>
              <Link
                to="/activity"
                onClick={() => setOpen(false)}
                className="text-zinc-300 hover:text-white"
              >
                Activity
              </Link>

              <button
                onClick={handleLogout}
                className="mt-4 text-left text-red-400 hover:text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
