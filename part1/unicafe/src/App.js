import React, {useState} from 'react'

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistic = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <>
      <table>
        <tbody>
          <StatisticLine text="good" value ={good} />
          <StatisticLine text="neutral" value ={neutral} />
          <StatisticLine text="bad" value ={bad} />
          <StatisticLine text="all" value ={all} />
          <StatisticLine text="average" value ={(good*1 + bad*(-1))/all} />
          <StatisticLine text="positive" value ={`${good*100/all} %`} />
        
        </tbody>
      </table>
    </>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
const [good, setGood] = useState(0)
const [neutral, setNeutral] = useState(0)
const [bad, setBad] = useState(0)

const handleGood = () => {
  setGood(good + 1)
}

const handleNeutral = () => {
  setNeutral(neutral + 1)
}

const handleBad = () => {
  setBad(bad + 1)
}
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text='good'/>
      <Button handleClick={handleNeutral} text='neutral'/>
      <Button handleClick={handleBad} text='bad'/>
      <Statistic good={good} neutral={neutral} bad={bad} />

      </div>
  )
}

export default App;
