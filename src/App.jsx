import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./Home_1";
import TaskDetails from "./TaskDetails";
import Login from "./login";
import Signup from "./signup";
import Header from "./header";
import { Navigate } from "react-router-dom";
function App() {
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.tasks);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
