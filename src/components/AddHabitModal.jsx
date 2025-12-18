import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AddHabitModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: "",
    frequency: "DAILY",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      toast.error("Habit name is required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/habits", form);
      toast.success("Habit created 🎉");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create habit"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Hobbie</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
              placeholder="e.g. Morning Walk"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Frequency</label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-zinc-400">Category (optional)</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
              placeholder="Health, Study, Work"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer rounded-lg border border-zinc-700 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
