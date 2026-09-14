import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const taskSlice = createSlice({
  name: "tasks",

  initialState,

  reducers: {
    setTasks: (state, action) => {
      return action.payload;
    },

    addTask: (state, action) => {
      state.push(action.payload);
    },

    deleteTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },

    updateTask: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);

      if (task) {
        task.todoName = action.payload.todoName;
        task.description = action.payload.description;
        task.completed = action.payload.completed;
      }
    },
  },
});

export const { setTasks, addTask, deleteTask, updateTask } = taskSlice.actions;

export default taskSlice.reducer;
