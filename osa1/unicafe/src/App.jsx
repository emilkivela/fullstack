import { useState } from 'react'


const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td> <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.good + props.neutral + props.bad === 0)  {
    return (
      <div>
        no feedback given
      </div>
    )
  }
  return (
    <div>
      <table>
        < StatisticLine text="good" value ={props.good} />
        < StatisticLine text="neutral" value ={props.neutral} />
        < StatisticLine text="bad" value ={props.bad} />
        < StatisticLine text="all" value ={props.good + props.neutral + props.bad} />
        < StatisticLine text="average" value ={(props.good-props.bad)/(props.good+props.neutral+props.bad)} />
        < StatisticLine text="positive" value ={(props.good/(props.good+props.neutral+props.bad))*100+'%'} />
      </table>
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const increaseGood = () => setGood(good+1)
  const increaseNeutral = () => setNeutral(neutral+1)
  const increaseBad = () => setBad(bad+1)

  return (
    <div>
      <h1>give feedback</h1>

      <Button handleClick={increaseGood} text='good'/>
      <Button handleClick={increaseNeutral} text='neutral'/>
      <Button handleClick={increaseBad} text='bad'/>

      <h1>statistics</h1>
        < Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App