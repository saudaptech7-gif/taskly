import { createSlice } from "@reduxjs/toolkit";

const savedUsers = localStorage.getItem("users");
const savedLogin = localStorage.getItem("isLoggedIn");
const savedCurrentUser = localStorage.getItem("currentUser");

const initialState = {
  users: savedUsers ? JSON.parse(atob(savedUsers)) : [],

  user: savedCurrentUser ? JSON.parse(atob(savedCurrentUser)) : null,

  isLoggedIn: savedLogin === "true",
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // ================= SIGNUP =================

    signup: (state, action) => {
      const newUser = {
        userId: Date.now(),
        name: action.payload.name,
        email: action.payload.email,
        password: action.payload.password,
        tasks: [],
      };

      state.users.push(newUser);

      state.user = null;
      state.isLoggedIn = false;

      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");

      localStorage.setItem("users", btoa(JSON.stringify(state.users)));
    },

    // ================= LOGIN =================

    login: (state, action) => {
      const foundUser = state.users.find(
        (user) =>
          user.email === action.payload.email &&
          user.password === action.payload.password,
      );

      if (foundUser) {
        state.user = foundUser;
        state.isLoggedIn = true;

        localStorage.setItem("currentUser", btoa(JSON.stringify(foundUser)));

        localStorage.setItem("isLoggedIn", "true");
      }
    },

    // ================= UPDATE USER TASKS =================

    updateUserTasks: (state, action) => {
      if (!state.user) return;

      const currentUser = state.users.find(
        (user) => user.userId === state.user.userId,
      );

      if (currentUser) {
        currentUser.tasks = action.payload;

        state.user.tasks = action.payload;

        localStorage.setItem("users", btoa(JSON.stringify(state.users)));

        localStorage.setItem("currentUser", btoa(JSON.stringify(state.user)));
      }
    },

    // ================= LOGOUT =================

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;

      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");
    },
  },
});

export const { signup, login, updateUserTasks, logout } = authSlice.actions;

export default authSlice.reducer;
