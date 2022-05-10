const Person = ({ person, deletePerson }) => {
    return (
      <>
        <li>{person.name} {person.number}</li>
        <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
      </>
    )
  }

  export default Person