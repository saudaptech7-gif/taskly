import { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { setTasks, addTask, updateTask } from "./store/taskSlice";

import { updateUserTasks, logout } from "./store/authSlice";

import "./home.css";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================= REDUX =================

  const user = useSelector((state) => state.auth.user);

  const tasks = useSelector((state) => state.tasks);

  // ================= LOCAL STATE =================

  const [toname, setToname] = useState("");
  const [description, setDescription] = useState("");

  const [filter, setFilter] = useState("All");

  const [justAdded, setJustAdded] = useState(false);

  const [toast, setToast] = useState(null); // { message, type }
  const toastTimer = useRef(null);

  // ================= TOAST HELPER =================
  // Small non-blocking replacement for alert() — auto-dismisses.

  const showToast = (message, type = "info") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // ================= LOAD USER TASKS =================

  useEffect(() => {
    if (user) {
      dispatch(setTasks(user.tasks || []));
    }
  }, [user, dispatch]);

  // ================= ADD TASK =================

  const handleAddTask = (e) => {
    e.preventDefault();

    // Empty check

    if (!toname.trim() || !description.trim()) {
      showToast("Please fill all fields", "error");

      return;
    }

    // Duplicate check

    const alreadyExists = tasks.some(
      (task) => task.todoName.toLowerCase() === toname.trim().toLowerCase(),
    );

    if (alreadyExists) {
      showToast("Task already exists", "error");

      return;
    }

    // New task

    const newTask = {
      id: Date.now(),

      userId: user?.userId,

      todoName: toname.trim(),

      description: description.trim(),

      completed: false,
    };

    // New array

    const updatedTasks = [...tasks, newTask];

    // Redux task state update

    dispatch(addTask(newTask));

    // Current user ke tasks update

    dispatch(updateUserTasks(updatedTasks));

    // Inputs clear

    setToname("");
    setDescription("");

    // Little success flourish on the button + a toast

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1100);

    showToast("Task added ✓", "success");
  };

  // ================= TOGGLE COMPLETE =================
  // NOTE: assumes updateTask merges the fields you pass it (as TaskDetails
  // already does with todoName/description) — adjust the reducer if it
  // instead expects a full replacement object.

  const handleToggleComplete = (e, task) => {
    e.stopPropagation();

    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, completed: !t.completed } : t,
    );

    dispatch(updateTask({ ...task, completed: !task.completed }));
    dispatch(updateUserTasks(updatedTasks));

    showToast(task.completed ? "Marked as pending" : "Task completed 🎉");
  };

  // ================= FILTER =================

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pending") {
      return !task.completed;
    }

    if (filter === "Completed") {
      return task.completed;
    }

    return true;
  });

  // ================= STATS =================

  const completedTasks = tasks.filter((task) => task.completed).length;

  const pendingTasks = tasks.length - completedTasks;

  // ================= DESCRIPTION PREVIEW =================

  const previewDescription = (text) => {
    const words = text.split(" ");

    if (words.length <= 4) {
      return text;
    }

    return words.slice(0, 4).join(" ") + "...";
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    dispatch(logout());

    dispatch(setTasks([]));

    navigate("/login");
  };

  return (
    <div className="home-page">
      <main className="home-container">
        {/* WELCOME */}

        <section className="welcome-section">
          <h1>👋 Welcome, {user?.name}!</h1>

          <p>Here are your tasks. Keep going!</p>
        </section>

        {/* ADD TASK */}

        <section className="add-task-card">
          <h2>Add New Task</h2>

          <form className="task-form" onSubmit={handleAddTask}>
            <div className="input-wrapper">
              <span>T</span>

              <input
                type="text"
                placeholder="Task name..."
                value={toname}
                onChange={(e) => setToname(e.target.value)}
              />
            </div>

            <div className="input-wrapper">
              <span>▱</span>

              <input
                type="text"
                placeholder="Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`add-button ${justAdded ? "add-button-success" : ""}`}
            >
              {justAdded ? "✓ Added" : "＋ Add Task"}
            </button>
          </form>
        </section>

        {/* STATS */}

        <section className="stats">
          <div className="stat-card total">
            <div className="stat-icon">▣</div>

            <div>
              <p>Total</p>

              <h3>{tasks.length}</h3>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">◷</div>

            <div>
              <p>Pending</p>

              <h3>{pendingTasks}</h3>
            </div>
          </div>

          <div className="stat-card completed">
            <div className="stat-icon">✓</div>

            <div>
              <p>Completed</p>

              <h3>{completedTasks}</h3>
            </div>
          </div>
        </section>

        {/* TASKS */}

        <section className="tasks-section">
          <div className="tasks-heading">
            <h2>My Tasks ({tasks.length})</h2>

            <div className="filters">
              <button
                className={filter === "All" ? "active" : ""}
                onClick={() => setFilter("All")}
              >
                All
              </button>

              <button
                className={filter === "Pending" ? "active" : ""}
                onClick={() => setFilter("Pending")}
              >
                Pending
              </button>

              <button
                className={filter === "Completed" ? "active" : ""}
                onClick={() => setFilter("Completed")}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="tasks-grid">
            {filteredTasks.length === 0 ? (
              <div className="empty-task">
                <div>✓</div>

                <h3>No tasks found</h3>

                <p>Add a new task to get started.</p>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`task-card ${
                    task.completed ? "task-completed" : "task-pending"
                  }`}
                  style={{ animationDelay: `${index * 60}ms` }}
                  onClick={() => navigate(`/task/${task.id}`)}
                >
                  <div className="task-top">
                    <div
                      className={`check-circle ${
                        task.completed ? "checked" : ""
                      }`}
                      onClick={(e) => handleToggleComplete(e, task)}
                      title={
                        task.completed ? "Mark as pending" : "Mark as completed"
                      }
                    >
                      {task.completed && "✓"}
                    </div>

                    <div className="task-content">
                      <h3>{task.todoName}</h3>

                      <p>{previewDescription(task.description)}</p>
                    </div>

                    <span
                      className={`status ${
                        task.completed ? "completed-status" : "pending-status"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <div className="task-bottom">
                    <span className="task-date">◫ &nbsp; Today</span>

                    <span className="arrow">→</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* TOAST */}

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          {toast.message}
        </div>
      )}

      {/* MOBILE NAV */}

      <nav className="bottom-nav">
        <button className="nav-item active">
          <span>⌂</span>

          <small>Home</small>
        </button>

        <button
          className="nav-item"
          onClick={() =>
            document.querySelector(".tasks-section")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <span>☷</span>

          <small>My Tasks</small>
        </button>

        <button className="nav-item">
          <span>♙</span>

          <small>Profile</small>
        </button>

        <button className="nav-item" onClick={handleLogout}>
          <span>↪</span>

          <small>Logout</small>
        </button>
      </nav>
    </div>
  );
}

export default Home;
