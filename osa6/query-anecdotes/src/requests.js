import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = newAnecdote => {
  const res = axios.post(baseUrl, newAnecdote)
    .then(res => res.data)
    .catch(error => {
      return error
    })
  return res
}

export const voteAnecdote = votedAnecdote => {
  const changedAnecdote = {...votedAnecdote, votes: votedAnecdote.votes+1}
  axios.put(`${baseUrl}/${votedAnecdote.id}`, changedAnecdote).then(res => res.data)
}