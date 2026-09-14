import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <header className="mobile-header">
      {" "}
      <div className="brand">
        {" "}
        <div className="brand-icon">✓</div> <span>Be punctual</span>{" "}
      </div>{" "}
      <div className="header-right">
        {" "}
        {isLoggedIn && (
          <button
            className="logout-btn"
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
          >
            {" "}
            Logout{" "}
          </button>
        )}{" "}
        <div className="profile-circle">
          {" "}
          {user?.name?.charAt(0).toUpperCase() || "U"}{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
}
export default Header;
