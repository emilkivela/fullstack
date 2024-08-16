import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({message}) => {
  if (message === null) {
    return null
  }
  return (
    <div className={message.includes('Information') ? 'notif' : 'error'}>
      {message}
    </div>
  )
}

const Filter = ({handleChange, filter}) => (
    <p>filter shown with <input 
    value={filter}
    onChange={handleChange}/> </p>
)

const PersonForm = (props) => (
  <form onSubmit={props.addPersons}>
        <div>
          name: <input 
            value={props.nameValue}
            onChange={props.handlePersonChange}/><br></br>
          number: <input
            value={props.numberValue}
            onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
)

const Deletion = ({deletePerson}) => (
  <>
    <button onClick={deletePerson}> delete</button>
  </>
)

const Persons = ({persons, filter, deletePersonID}) => (
  <>
  {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()) || filter === '')
      .map(person => <div key={person.id}> {person.name} {person.number} <Deletion deletePerson={() => deletePersonID(person.name, person.id)}/>  </div>)}
  </>
)




const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons  => (
        setPersons(initialPersons)
      ))
  }, [])

  const addPersons = (event) => {
    
    event.preventDefault()
    const names = persons.map(person => person.name)
    console.log(persons)

    if (names.includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = {...person, number: newNumber}

        personService
          .changeNumber(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            setNotifMessage(`Information: ${person.name}'s number changed`)
            setTimeout(() => {
              setNotifMessage(null)
            }, 4000)
          })
          .catch(error => {
            setNotifMessage(
              `${person.name} was already removed from server`
            )
            setTimeout(() => {
              setNotifMessage(null)
          }, 4000)
          })
      }

    } else {
      const personObject = {
        name: newName,
        number: newNumber,
        }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotifMessage(`Information: ${returnedPerson.name} added to phonebook`)
          setTimeout(() => {
            setNotifMessage(null)
          }, 4000)
        })
        .catch(error => {
          setNotifMessage(error.response.data.error)
          setTimeout(() => {
            setNotifMessage(null)
          }, 4000)
        })

      setNewName('')
      setNewNumber('')
    }
  }
  const deletePersonID = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deletion(id)
        .then(response =>  {
          setPersons(persons.filter(person => person.id !== id))
          setNotifMessage(`Information: ${name} removed from phonebook`)
          setTimeout(() => {
            setNotifMessage(null)
          }, 4000)
        })
        .catch(error => {
          setNotifMessage(
            `${name} was already removed from server`
          )
          setTimeout(() => {
            setNotifMessage(null)
        }, 4000)
        })
    }
  }  

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleChange={handleFilterChange} filter={filter}/>
      <h3>Add a new</h3>
      <Notification message={notifMessage}/>
      <PersonForm 
        addPersons={addPersons} nameValue={newName} handlePersonChange={handlePersonChange}
        numberValue={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePersonID={deletePersonID}/>
      
    </div>
  )

}

export default App