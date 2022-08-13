import Person from './Person'

const Persons = ({persons, newFilter, deletePerson}) => {
    return (
      persons.filter((person) => person.name.toLowerCase().startsWith(newFilter.toLowerCase()))
      .map(person =>
        <Person 
          key={person.id} 
          person={person}
          deletePerson={deletePerson}
        />)
    )
  }

export default Persons