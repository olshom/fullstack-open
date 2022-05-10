import Course from "./Course"
                                                                                                            
  const Courses = ({ courses }) => {
    return (
      <div>
        <ul style={{'listStyleType': 'none'}}>
          {courses.map(course =>
            <Course key={course.id} name={course.name} parts={course.parts}/>)}
        </ul>
      </div>
    )
  }

  export default Courses