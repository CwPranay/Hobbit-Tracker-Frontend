import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";

const isToday = (date) =>
  new Date(date).toDateString() === new Date().toDateString();

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

export default function ActivityFeed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const res = await api.get("/api/activity/feed");
        setFeed(res.data);
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, []);

  const friends = useMemo(() => {
    const map = {};

    feed.forEach((item) => {
      if (!map[item.user_name]) map[item.user_name] = [];
      map[item.user_name].push(item);
    });

    return Object.entries(map)
      .map(([name, activities]) => {
        const sorted = activities.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        return {
          name,
          today: sorted.filter((a) => isToday(a.created_at)),
          history: sorted.filter((a) => !isToday(a.created_at)),
          lastActivity: sorted[0].created_at,
        };
      })
      .sort((a, b) => {
        if (a.today.length && !b.today.length) return -1;
        if (!a.today.length && b.today.length) return 1;
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      });
  }, [feed]);

  const toggle = (name) =>
    setExpanded((p) => ({ ...p, [name]: !p[name] }));

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Friends Activity</h1>
        <p className="text-zinc-400 mb-8">
          People who showed up today
        </p>

        {loading && (
          <p className="text-zinc-400 text-center py-10">
            Loading activity…
          </p>
        )}

        {!loading && friends.length === 0 && (
          <p className="text-zinc-400 text-center py-10">
            No activity yet. Follow friends to stay accountable.
          </p>
        )}

        <div className="space-y-5">
          {friends.map((friend) => {
            const activeToday = friend.today.length > 0;

            return (
              <div
                key={friend.name}
                className={`rounded-2xl p-5 border transition
                  ${
                    activeToday
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-zinc-900/40 border-zinc-800/60"
                  }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                      {friend.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{friend.name}</p>
                      <p
                        className={`text-xs ${
                          activeToday
                            ? "text-emerald-400"
                            : "text-zinc-500"
                        }`}
                      >
                        {activeToday
                          ? "Checked in today"
                          : "No check-in today"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        activeToday
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-700/30 text-zinc-400"
                      }`}
                  >
                    {activeToday ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Today */}
                {activeToday && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {friend.today.map((a, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm"
                      >
                        {a.habit_name}
                      </span>
                    ))}
                  </div>
                )}

                {/* History */}
                {expanded[friend.name] && friend.history.length > 0 && (
                  <div className="mt-4 space-y-2 text-sm text-zinc-400">
                    {friend.history.map((a, i) => (
                      <div
                        key={i}
                        className="flex justify-between"
                      >
                        <span>{a.habit_name}</span>
                        <span>{timeAgo(a.created_at)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Toggle */}
                {friend.history.length > 0 && (
                  <button
                    onClick={() => toggle(friend.name)}
                    className="mt-3 text-sm text-indigo-400 hover:underline cursor-pointer"
                  >
                    {expanded[friend.name]
                      ? "Hide history"
                      : "View history"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
