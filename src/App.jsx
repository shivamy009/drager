import { useState } from 'react'
 
import './App.css'
 
import WordGene from './component/WordGene'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <WordGene/>
     </>
  )
}

export default App
