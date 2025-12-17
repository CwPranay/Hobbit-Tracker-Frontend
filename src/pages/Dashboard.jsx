import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHabits = async () => {
        try {
            const res = await api.get("/habits");
            setHabits(res.data);
        } catch (err) {
            console.error("Failed to fetch habits");
        } finally {
            setLoading(false);
        }
    };

    const checkIn = async (habit) => {
        if (habit.checkedToday) {
            // Do absolutely nothing
            return;
        }

        try {
            await api.post(`/habits/${habit.id}/checkin`, {});
            toast.success("Check-in completed 🎯");
            fetchHabits();
        } catch (err) {
            const message =
                err.response?.data?.message || "Something went wrong";

            toast(message, { icon: "ℹ️" });
        }
    };


    useEffect(() => {
        fetchHabits();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 text-white px-6 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">
                    My Habits
                </h1>

                {loading && (
                    <p className="text-zinc-400">Loading habits...</p>
                )}

                {!loading && habits.length === 0 && (
                    <p className="text-zinc-400">
                        No habits found. Start by adding one.
                    </p>
                )}

                <div className="grid gap-4">
                    {habits.map((h) => (
                        <div
                            key={h.id}
                            className="flex items-center justify-between
             bg-zinc-900 border border-zinc-800
             rounded-xl p-4"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {h.name}
                                </h3>

                                <p className="text-sm text-zinc-400">
                                    Frequency: {h.frequency}
                                </p>

                                <div className="flex gap-4 mt-2 text-sm">
                                    <span className="text-amber-400">
                                        🔥 {h.streak ?? 0} day streak
                                    </span>

                                    {h.lastCheckIn && (
                                        <span className="text-zinc-400">
                                            🕒 Last: {new Date(h.lastCheckIn).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={h.checkedToday}
                                onClick={() => checkIn(h)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium
      ${h.checkedToday
                                        ? "bg-zinc-700 cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-700"
                                    }`}
                            >
                                {h.checkedToday ? "Done today ✓" : "Check in"}
                            </button>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
}
