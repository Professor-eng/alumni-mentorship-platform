import { useState, useEffect, useMemo } from "react";
import {
  Users, Calendar, MessageSquare, LayoutDashboard, Plus, Clock,
  CheckCircle2, XCircle, Send, X, Briefcase, Star, Sparkles
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const statusStyle = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  declined: "bg-rose-50 text-rose-700 border-rose-200",
};

function Sidebar({ tab, setTab }) {
  const items = [
    { id: "mentors", label: "Mentors", icon: Users },
    { id: "bookings", label: "Book a session", icon: Calendar },
    { id: "forum", label: "Forum", icon: MessageSquare },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];
  return (
    <div className="w-56 shrink-0 border-r border-slate-200 bg-[#12203a] text-slate-200 min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-white/10">
        <p className="font-serif text-lg text-white tracking-tight">Alumni Bridge</p>
        <p className="text-xs text-slate-400 mt-1">Mentorship platform</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                active ? "bg-[#B8863B] text-white" : "hover:bg-white/5 text-slate-300"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}


function InterestPicker({ allTags, selected, onToggle, onClear }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <Sparkles size={15} className="text-[#B8863B]" />
          What are you looking for help with?
        </p>
        {selected.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                active
                  ? "bg-[#12203a] text-white border-[#12203a]"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-slate-400 mt-3">
          Mentors below are ranked by how closely they match your interests.
        </p>
      )}
    </div>
  );
}


function MentorCard({ mentor, onBook, matchInfo }) {
  const tags = mentor.tags ? mentor.tags.split(",").map((t) => t.trim()) : [];
  return (
    <div
      className={`bg-white rounded-xl p-5 flex flex-col gap-3 border ${
        matchInfo?.score > 0 ? "border-[#B8863B]/40 ring-1 ring-[#B8863B]/10" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-serif text-base text-slate-900">{mentor.name}</p>
          <p className="text-sm text-slate-500">{mentor.domain}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#F5F0E6] border border-[#B8863B]/30 flex items-center justify-center text-[#B8863B] font-medium text-sm shrink-0">
          {mentor.name.split(" ").map((n) => n[0]).join("")}
        </div>
      </div>

      {matchInfo?.score > 0 && (
        <div className="flex items-center gap-1.5 -mt-1">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#B8863B]/10 text-[#B8863B]">
            {matchInfo.percent}% match
          </span>
          <span className="text-xs text-slate-400">
            {matchInfo.matchedTags.join(", ")}
          </span>
        </div>
      )}

      <p className="text-xs text-slate-500 flex items-center gap-1"><Briefcase size={13} /> {mentor.experience}</p>
      <p className="text-sm text-slate-600">{mentor.bio}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className={`text-xs px-2 py-0.5 rounded-full ${
              matchInfo?.matchedTags.includes(t)
                ? "bg-[#B8863B]/15 text-[#8a6529] font-medium"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
        <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={13} /> {mentor.availability}</p>
        <button
          onClick={() => onBook(mentor)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#12203a] text-white hover:bg-[#1a2d4d] transition"
        >
          Request session
        </button>
      </div>
    </div>
  );
}

function BookingModal({ mentor, onClose, onSubmit }) {
  const [studentName, setStudentName] = useState("");
  const [topic, setTopic] = useState("");
  const [slot, setSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!mentor) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
        <p className="font-serif text-lg text-slate-900">Request a session</p>
        <p className="text-sm text-slate-500 mb-4">with {mentor.name} · {mentor.domain}</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500">Your name</label>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B8863B]"
              placeholder="e.g. Ananya Singh"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">What do you want to discuss?</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B8863B]"
              placeholder="e.g. Resume review before campus placements"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Preferred slot</label>
            <input
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B8863B]"
              placeholder="e.g. Thu, 6:00 PM"
            />
          </div>
        </div>
        <button
          disabled={!studentName || !topic || !slot || submitting}
          onClick={() => {
            setSubmitting(true);
            onSubmit({ mentor_id: mentor.id, student_name: studentName, topic, slot });
            onClose();
          }}
          className="w-full mt-5 bg-[#12203a] disabled:opacity-40 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#1a2d4d] transition"
        >
          {submitting ? "Sending..." : "Send request"}
        </button>
      </div>
    </div>
  );
}

function BookingsList({ bookings, mentors, onUpdateStatus }) {
  return (
    <div className="space-y-3">
      {bookings.length === 0 && <p className="text-sm text-slate-500">No booking requests yet.</p>}
      {bookings.map((b) => {
        const mentor = mentors.find((m) => m.id === b.mentor_id);
        return (
          <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">{b.student_name} → {mentor?.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{b.topic}</p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Clock size={12} /> {b.slot}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${statusStyle[b.status]}`}>
                {b.status}
              </span>
              {b.status === "pending" && (
                <>
                  <button onClick={() => onUpdateStatus(b.id, "accepted")} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg">
                    <CheckCircle2 size={18} />
                  </button>
                  <button onClick={() => onUpdateStatus(b.id, "declined")} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg">
                    <XCircle size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Forum({ posts, onAddPost, onAddComment }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [commentDrafts, setCommentDrafts] = useState({});

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-serif text-lg text-slate-900">Open discussion</p>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#12203a] text-white hover:bg-[#1a2d4d]"
        >
          <Plus size={14} /> New post
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B8863B]"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your question or insight..."
            rows={3}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B8863B]"
          />
          <button
            disabled={!title || !body}
            onClick={() => {
              onAddPost({ author: "You", role: "Student", title, body });
              setTitle("");
              setBody("");
              setShowForm(false);
            }}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-[#B8863B] disabled:opacity-40 text-white"
          >
            Post
          </button>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-slate-900">{p.author}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{p.role}</span>
            </div>
            <p className="font-serif text-[15px] text-slate-900 mt-1">{p.title}</p>
            <p className="text-sm text-slate-600 mt-1">{p.body}</p>

            {p.comments.length > 0 && (
              <div className="mt-3 pl-3 border-l-2 border-slate-100 space-y-2">
                {p.comments.map((c) => (
                  <div key={c.id}>
                    <p className="text-xs font-medium text-slate-700">{c.author}</p>
                    <p className="text-sm text-slate-600">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <input
                value={commentDrafts[p.id] || ""}
                onChange={(e) => setCommentDrafts({ ...commentDrafts, [p.id]: e.target.value })}
                placeholder="Write a reply..."
                className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#B8863B]"
              />
              <button
                onClick={() => {
                  if (!commentDrafts[p.id]) return;
                  onAddComment(p.id, commentDrafts[p.id]);
                  setCommentDrafts({ ...commentDrafts, [p.id]: "" });
                }}
                className="text-slate-400 hover:text-[#12203a] p-1.5"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ mentors, bookings, posts }) {
  const pending = bookings.filter((b) => b.status === "pending").length;
  const accepted = bookings.filter((b) => b.status === "accepted").length;

  const stats = [
    { label: "Mentors", value: mentors.length, icon: Users },
    { label: "Pending requests", value: pending, icon: Clock },
    { label: "Sessions confirmed", value: accepted, icon: CheckCircle2 },
    { label: "Forum posts", value: posts.length, icon: MessageSquare },
  ];

  return (
    <div>
      <p className="font-serif text-lg text-slate-900 mb-4">Overview</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
              <Icon size={16} className="text-[#B8863B] mb-2" />
              <p className="text-2xl font-serif text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      <p className="text-sm font-medium text-slate-700 mb-2">Recent booking requests</p>
      <div className="space-y-2 mb-6">
        {bookings.slice(0, 4).map((b) => {
          const mentor = mentors.find((m) => m.id === b.mentor_id);
          return (
            <div key={b.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2.5">
              <p className="text-sm text-slate-700">{b.student_name} → {mentor?.name}</p>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border capitalize ${statusStyle[b.status]}`}>{b.status}</span>
            </div>
          );
        })}
      </div>

      <p className="text-sm font-medium text-slate-700 mb-2">Mentor directory</p>
      <div className="space-y-2">
        {mentors.map((m) => (
          <div key={m.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2.5">
            <div>
              <p className="text-sm text-slate-800">{m.name}</p>
              <p className="text-xs text-slate-500">{m.domain}</p>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1"><Star size={12} /> {m.availability}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("mentors");
  const [mentors, setMentors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [bookingMentor, setBookingMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [error, setError] = useState(null);


  const loadAll = () => {
    Promise.all([
      fetch(`${API}/mentors`).then((r) => r.json()),
      fetch(`${API}/bookings`).then((r) => r.json()),
      fetch(`${API}/forum/posts`).then((r) => r.json()),
    ])
      .then(([m, b, p]) => {
        setMentors(m);
        setBookings(b);
        setPosts(p);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data. Is the FastAPI server running?", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAll();
  }, []);

  const addBooking = (details) => {
    fetch(`${API}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.detail || "Failed to create booking");
        }
        return r.json();
      })
      .then((newBooking) => setBookings((prev) => [newBooking, ...prev]))
      .catch((err) => setError(err.message));
  };


  const updateStatus = (id, status) => {
    fetch(`${API}/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.detail || "Failed to update booking status");
        }
        return r.json();
      })
      .then((updated) =>
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? updated : b))
        )
      )
      .catch((err) => setError(err.message));
  };

  const addPost = (payload) => {
    fetch(`${API}/forum/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.detail || "Failed to create post");
        }
        return r.json();
      })
      .then((newPost) =>
        setPosts((prev) => [
          { ...newPost, comments: [] },
          ...prev,
        ])
      )
      .catch((err) => setError(err.message));
  };

  const addComment = (postId, text) => {
    fetch(`${API}/forum/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: "You", text }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.detail || "Failed to add comment");
        }
        return r.json();
      })
      .then((newComment) => {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, comments: [...p.comments, newComment] }
              : p
          )
        );
      })
      .catch((err) => setError(err.message));
  };


  // ---------- Matching logic ----------

  // Every unique tag across all mentors, used to populate the interest picker.
  const allTags = useMemo(() => {
    const set = new Set();
    mentors.forEach((m) => {
      (m.tags ? m.tags.split(",") : []).forEach((t) => set.add(t.trim()));
    });
    return Array.from(set).filter(Boolean);
  }, [mentors]);

  const toggleInterest = (tag) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // For each mentor, score = number of selected interests that appear in their tags.
  // percent = score relative to however many interests the student picked, so it
  // reads as "how much of what you asked for this person covers", not an absolute count.
  const rankedMentors = useMemo(() => {
    const withScores = mentors.map((m) => {
      const mentorTags = (m.tags ? m.tags.split(",") : []).map((t) => t.trim());
      const matchedTags = selectedInterests.filter((i) => mentorTags.includes(i));
      const score = matchedTags.length;
      const percent =
        selectedInterests.length > 0
          ? Math.round((score / selectedInterests.length) * 100)
          : 0;
      return { mentor: m, matchInfo: { score, percent, matchedTags } };
    });

    if (selectedInterests.length === 0) {
      return withScores.map((w) => ({ ...w, matchInfo: { score: 0, percent: 0, matchedTags: [] } }));
    }

    // Highest overlap first; stable-ish tie-break by mentor id so order doesn't jitter.
    return withScores.sort((a, b) => b.matchInfo.score - a.matchInfo.score || a.mentor.id - b.mentor.id);
  }, [mentors, selectedInterests]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] text-slate-500 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F5F0] font-sans">
      <Sidebar tab={tab} setTab={setTab} />
      {error && (
        <div className="fixed top-4 right-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-2 rounded-lg z-50">
          {error}
          <button onClick={() => setError(null)} className="ml-3 text-rose-400">✕</button>
        </div>
      )}
      <div className="flex-1 p-8 max-w-4xl">
        {tab === "mentors" && (
          <>
            <p className="font-serif text-lg text-slate-900 mb-4">Find a mentor</p>

            {allTags.length > 0 && (
              <InterestPicker
                allTags={allTags}
                selected={selectedInterests}
                onToggle={toggleInterest}
                onClear={() => setSelectedInterests([])}
              />
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {rankedMentors.map(({ mentor, matchInfo }) => (
                <MentorCard key={mentor.id} mentor={mentor} onBook={setBookingMentor} matchInfo={matchInfo} />
              ))}
            </div>
          </>
        )}

        {tab === "bookings" && (
          <>
            <p className="font-serif text-lg text-slate-900 mb-4">Booking requests</p>
            <BookingsList bookings={bookings} mentors={mentors} onUpdateStatus={updateStatus} />
          </>
        )}

        {tab === "forum" && (
          <Forum posts={posts} onAddPost={addPost} onAddComment={addComment} />
        )}

        {tab === "dashboard" && (
          <Dashboard mentors={mentors} bookings={bookings} posts={posts} />
        )}
      </div>

      <BookingModal
        mentor={bookingMentor}
        onClose={() => setBookingMentor(null)}
        onSubmit={addBooking}
      />
    </div>
  );
}