import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { addNotification, hideNotification } from "../reducers/notificationReducer"
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const NewAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(NewAnecdote))
    dispatch(addNotification(content))
    setTimeout(() => {
      dispatch(hideNotification())
    }, 5000)
  }

  return (
    <form onSubmit={addAnecdote}>
      <input name="anecdote"/>
      <button type="submit">add</button>
    </form>
  )
  
}

export default AnecdoteForm