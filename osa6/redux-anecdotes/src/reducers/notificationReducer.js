import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    voteNotification(state, action) {
      return `you voted "${action.payload}"`
    },
    addNotification(state, action) {
      return `anecdote "${action.payload}" added`
    },
    hideNotification() {
      return null
    }
  }
})

export const { voteNotification, addNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer