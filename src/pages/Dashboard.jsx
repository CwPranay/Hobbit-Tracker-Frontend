import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import AddHabitModal from "../components/AddHabitModal";
import ConfirmModal from "../components/ConfirmModal";
import { Trash2 } from "lucide-react";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteHabitId, setDeleteHabitId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHabits = async () => {
    try {
      const res = await api.get("/api/habits");
      setHabits(res.data);
    } catch {
      toast.error("Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteHabitId) return;

    try {
      setDeleting(true);
      await api.delete(`/api/habits/${deleteHabitId}`);
      toast.success("Habit deleted");
      setDeleteHabitId(null);
      fetchHabits();
    } catch {
      toast.error("Failed to delete habit");
    } finally {
      setDeleting(false);
    }
  };

  const checkIn = async (habit) => {
    if (habit.checkedToday) return;

    try {
      await api.post(`/api/habits/${habit.id}/checkin`, {});
      toast.success("Check-in completed 🎯");
      fetchHabits();
    } catch (err) {
      toast(
        err.response?.data?.message || "Something went wrong",
        { icon: "ℹ️" }
      );
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">

       
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Habits</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-medium"
          >
            + Add Habit
          </button>
        </div>

        
        {showModal && (
          <AddHabitModal
            onClose={() => setShowModal(false)}
            onCreated={fetchHabits}
          />
        )}

        {deleteHabitId && (
          <ConfirmModal
            title="Delete Habit"
            description="This action cannot be undone. All progress for this habit will be permanently removed."
            confirmText="Delete"
            onCancel={() => setDeleteHabitId(null)}
            onConfirm={confirmDelete}
            loading={deleting}
          />
        )}

        
        {loading && (
          <p className="text-zinc-400">Loading habits...</p>
        )}

        {!loading && habits.length === 0 && (
          <p className="text-zinc-500 italic">
            You haven’t added any habits yet.
          </p>
        )}

        {/* Habit List */}
        <div className="grid gap-4">
          {habits.map((h) => (
            <div
              key={h.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex justify-between items-center"
            >
              {/* Left: Habit Info */}
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{h.name}</h3>
                  <button
                    onClick={() => setDeleteHabitId(h.id)}
                    className="text-zinc-400 cursor-pointer hover:text-red-500"
                    title="Delete habit"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-sm text-zinc-400 mt-1">
                  Frequency: {h.frequency}
                </p>

                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-amber-400">
                    🔥 {h.streak ?? 0} day streak
                  </span>

                  {h.lastCheckIn && (
                    <span className="text-zinc-400">
                      🕒 {new Date(h.lastCheckIn).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

             
              <button
                disabled={h.checkedToday}
                onClick={() => checkIn(h)}
                className={`px-4 py-2 checkin rounded-lg text-sm font-medium transition
                  ${
                    h.checkedToday
                      ? "bg-zinc-700 cursor-not-allowed"
                      : "bg-emerald-600 cursor-pointer hover:bg-emerald-700"
                  }`}
              >
                {h.checkedToday ? "Done today " : "Check in"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
