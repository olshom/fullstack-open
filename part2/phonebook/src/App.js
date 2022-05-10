import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personsService from './services/PersonsService'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons) 
    })
  }, [])

  const addNumber = (event) => {
    event.preventDefault()

    const numberObject = {
      name: newName,
      number: newNumber,
      
    }

    if (persons.find(({name})=> name===newName)) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {

        const person = persons.find(({name})=> name===newName)
        const changedPerson = {...person, number: newNumber}

        personsService
          .updateContact(changedPerson)
          .then(returnedPerson => {
            setNotification(`${numberObject.name} was changed`)
            setTimeout(() => {setNotification(null)}, 5000)
            setPersons(persons.map(person => person.id !== changedPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(`the contact ${changedPerson.name} was already deleted from server`)
            setTimeout(() => {setErrorMessage(null)}, 5000)
            setPersons(persons.filter(person => person.id !== changedPerson.id))
          })
      }
    } else {
      personsService
        .createPerson(numberObject)
        .then(returnedPerson => {
          setNotification(`Added ${numberObject.name}`)
          setTimeout(() => {setNotification(null)}, 5000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setNewFilter(event.target.value)
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)){
      personsService
      .deletePerson(id) 
      .then(setPersons(persons.filter(person => person.id !== id)))
    }      
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} textColor='green'/>
      <Notification message={errorMessage} textColor='red'/>
      <Filter newFilter={newFilter} handleSearch={handleSearch}/>
      <h2>add a new</h2>
      <PersonForm addNumber={addNumber} newName={newName} handleNameChange={handleNameChange} 
      newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <ul>
        <Persons persons={persons} newFilter={newFilter} deletePerson={deletePerson}/>
      </ul>
    </div>
  )
}

export default App;