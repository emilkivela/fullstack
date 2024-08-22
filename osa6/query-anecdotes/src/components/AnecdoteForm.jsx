import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useNotificationDispatch } from "../NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (data) => {
      console.log(data)
      if (data.response) {
        console.log('ERROR FOUND: ', data.response.data.error)
        dispatch({
          type: "SET_NOTIFICATION",
          payload: data.response.data.error
        })
        setTimeout(() => {
          dispatch({type:"CLEAR_NOTIFICATION"})
        }, 5000)
      } else {
        console.log("HERE")
        queryClient.invalidateQueries({queryKey: ['anecdotes']})
        dispatch({
          type: "SET_NOTIFICATION",
          payload: `anecdote ${data.content} added`
        })
        setTimeout(() => {
          dispatch({type:"CLEAR_NOTIFICATION"})
        }, 5000)
      }
      
    }
  })


  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutateAsync({content, votes: 0})
    
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
