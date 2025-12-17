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
      loadStats();
      loadLists();
      searchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to follow");
    }
  };

  const unfollowUser = async (id) => {
    try {
      await api.delete(`/friends/unfollow/${id}`);
      toast.success("Unfollowed");
      loadStats();
      loadLists();
      searchUsers();
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
              className={`px-4 py-2 cursor-pointer rounded-lg text-sm ${
                tab === t
                  ? "bg-indigo-600"
                  : "bg-zinc-900 border border-zinc-800"
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
              placeholder="Search by name or email"
              className="w-full px-4 py-3 rounded-lg bg-zinc-900
                         border border-zinc-800 text-white
                         placeholder:text-zinc-500"
            />

            {loading && <p className="mt-4 text-zinc-400">Searching...</p>}

            <div className="mt-6 space-y-3">
              {results.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between
                             bg-zinc-900 border border-zinc-800
                             rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-zinc-400">{user.email}</p>
                  </div>

                  {user.isFollowing ? (
                    <button
                      onClick={() => unfollowUser(user.id)}
                      className="px-4 cursor-pointer py-2 text-sm rounded-lg
                                 border border-zinc-700 hover:bg-zinc-800"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={() => followUser(user.id)}
                      className="px-4 cursor-pointer py-2 text-sm rounded-lg
                                 bg-indigo-600 hover:bg-indigo-700"
                    >
                      Follow
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        
        {tab === "followers" &&
          followers.map((f) => (
            <div
              key={f.follower.id}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg mb-3"
            >
              {f.follower.name}
            </div>
          ))}

        
        {tab === "following" &&
          following.map((f) => (
            <div
              key={f.following.id}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg mb-3"
            >
              {f.following.name}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Friends;
