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
        <Link
          to="/"
          className="text-xl font-bold text-white"
        >
          HabitTracker
        </Link>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 cursor-pointer rounded-full bg-zinc-800
               flex items-center justify-center
               hover:bg-zinc-700"
          >
            <User size={18} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48
                    bg-zinc-900 border border-zinc-800
                    rounded-lg shadow-lg">

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2
                   text-sm text-red-400
                   hover:bg-zinc-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>


      </div>
    </nav>
  );
};

export default Navbar;
