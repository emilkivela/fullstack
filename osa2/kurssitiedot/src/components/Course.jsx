const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ parts }) => {
  const exercises = parts.map(parts => parts.exercises)
  console.log(exercises)
  const sum = exercises.reduce((partialSum, a)=> partialSum+a,0)
  return (

    <p> <b>Total of {sum} exercises</b></p>
  )
}

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(parts => <Part key={parts.id} part={parts}/>)}
  </>

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course