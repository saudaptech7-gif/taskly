import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteTask,
  updateTask,
} from "./store/taskSlice";
import "./TaskDetails.css"

function TaskDetails() {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Current logged-in user
  const user = useSelector((state) => state.auth.user);

  // All tasks Redux se
  const allTasks = useSelector((state) => state.tasks);

  // Sirf current user ka requested task
  const task = allTasks.find(
    (task) =>
      task.id === Number(id) &&
      task.userId === user?.userId
  );

  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [editName, setEditName] = useState(
    task?.todoName || ""
  );

  const [editDescription, setEditDescription] =
    useState(task?.description || "");

  if (!task) {
    return (
      <div className="task-details">
        <h2>Task not found</h2>

        <button className="back-btn" onClick={() => navigate("/home")}>
          Back
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      // auto-cancel the confirm state if left untouched
      setTimeout(() => setConfirmingDelete(false), 3000);
      return;
    }

    dispatch(
      deleteTask({
        taskId: task.id,
        userId: user.userId,
      })
    );

    navigate("/home");
  };

  const handleToggleComplete = () => {
    dispatch(
      updateTask({
        id: task.id,
        userId: user.userId,
        todoName: task.todoName,
        description: task.description,
        completed: !task.completed,
      })
    );
  };

  const handleSave = () => {
    dispatch(
      updateTask({
        id: task.id,
        userId: user.userId,
        todoName: editName.trim(),
        description: editDescription.trim(),
        completed: task.completed,
      })
    );

    setIsEditing(false);
  };

  return (
    <div className="task-details">
      <button className="back-btn" onClick={() => navigate("/home")}>
        ← Back
      </button>

      {isEditing ? (
        <div className="task-edit-panel">
          <input
            value={editName}
            autoFocus
            onChange={(e) =>
              setEditName(e.target.value)
            }
          />

          <textarea
            value={editDescription}
            onChange={(e) =>
              setEditDescription(e.target.value)
            }
          />

          <div className="task-actions">
            <button className="save-btn" onClick={handleSave}>
              Save changes
            </button>

            <button
              className="cancel-btn"
              onClick={() => {
                setEditName(task.todoName);
                setEditDescription(task.description);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="task-view-panel">
          <div className="task-title-row">
            <h1>{task.todoName}</h1>

            <span
              className={`status-pill ${
                task.completed ? "completed-status" : "pending-status"
              }`}
            >
              {task.completed ? "Completed" : "Pending"}
            </span>
          </div>

          <p className="task-description">{task.description}</p>

          <div className="task-actions">
            <button
              className={`toggle-btn ${task.completed ? "is-complete" : ""}`}
              onClick={handleToggleComplete}
            >
              {task.completed ? "↺ Mark as pending" : "✓ Mark as complete"}
            </button>

            <button className="edit-icon" onClick={() => setIsEditing(true)}>
              ✎ Edit
            </button>

            <button
              className={`delete-icon ${confirmingDelete ? "confirming" : ""}`}
              onClick={handleDelete}
            >
              {confirmingDelete ? "Confirm delete?" : "🗑 Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDetails;
