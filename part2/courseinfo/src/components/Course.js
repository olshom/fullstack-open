const Header = ({ name }) => (
    <>
    <h2>{name}</h2>
    </>
  )
  
  const Content = ({ parts }) => {
    return (
      <ul style={{'listStyleType': 'none'}}>
        {parts.map(part => <li key={part.id} ><p>{part.name} {part.exercises}</p></li>)}
        <p><strong>total of {parts.reduce((sum, part) => sum+part.exercises, 0)} exercises</strong></p>
      </ul>
    )
  }
  
  const Course = ({name, parts}) => {
    return (
      <li>
        <Header name={name} />
        <Content parts={parts} />
    </li>
    )
  }

  export default Course