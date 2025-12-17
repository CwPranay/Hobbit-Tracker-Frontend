import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const Friends = () => {
  const [tab, setTab] = useState("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);

  const isUserFollowing = (userId) =>
    following.some((f) => f.following.id === userId);

  const loadStats = async () => {
    const res = await api.get("/friends/stats");
    setStats({
      followers: res.data.followersCount,
      following: res.data.followingCount,
    });
  };

  const loadLists = async () => {
    const res = await api.get("/friends/list");
    setFollowers(res.data.followers);
    setFollowing(res.data.following);
  };

  const searchUsers = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/friends/search?q=${query}`);
      setResults(res.data);
    } catch {
      toast.error("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (id) => {
    try {
      await api.post(`/friends/follow/${id}`);
      toast.success("Followed");
      await loadStats();
      await loadLists();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to follow");
    }
  };

  const unfollowUser = async (id) => {
    try {
      await api.delete(`/friends/unfollow/${id}`);
      toast.success("Unfollowed");
      await loadStats();
      await loadLists();
    } catch {
      toast.error("Unable to unfollow");
    }
  };

  useEffect(() => {
    loadStats();
    loadLists();
  }, []);

  useEffect(() => {
    const delay = setTimeout(searchUsers, 400);
    return () => clearTimeout(delay);
  }, [query]);

  const primaryBtn =
    "cursor-pointer px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-sm font-medium";

  const dangerBtn =
    "cursor-pointer px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 transition text-sm font-medium";

  const ghostBtn =
    "cursor-pointer px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 transition text-sm font-medium";

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Friends</h1>

        <div className="flex gap-6 mb-6">
          <div>
            <p className="text-sm text-zinc-400">Followers</p>
            <p className="text-xl font-semibold">{stats.followers}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Following</p>
            <p className="text-xl font-semibold">{stats.following}</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          {["search", "followers", "following"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t
                  ? "bg-indigo-600"
                  : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "search" && (
          <>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500"
            />

            {loading && <p className="text-zinc-400">Searching...</p>}

            {results.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center bg-zinc-900 p-4 mb-3 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-medium">{user.name}</p>
                </div>

                {isUserFollowing(user.id) ? (
                  <button
                    className={dangerBtn}
                    onClick={() => unfollowUser(user.id)}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className={primaryBtn}
                    onClick={() => followUser(user.id)}
                  >
                    Follow
                  </button>
                )}
              </div>
            ))}
          </>
        )}

        {tab === "followers" &&
          followers.map((f) => (
            <div
              key={f.follower.id}
              className="flex justify-between items-center bg-zinc-900 p-4 mb-3 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                  {f.follower.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-medium">{f.follower.name}</p>
              </div>

              {isUserFollowing(f.follower.id) ? (
                <button
                  className={dangerBtn}
                  onClick={() => unfollowUser(f.follower.id)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className={primaryBtn}
                  onClick={() => followUser(f.follower.id)}
                >
                  Follow back
                </button>
              )}
            </div>
          ))}

        {tab === "following" &&
          following.map((f) => (
            <div
              key={f.following.id}
              className="flex justify-between items-center bg-zinc-900 p-4 mb-3 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                  {f.following.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-medium">{f.following.name}</p>
              </div>

              <button
                className={dangerBtn}
                onClick={() => unfollowUser(f.following.id)}
              >
                Unfollow
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Friends;
