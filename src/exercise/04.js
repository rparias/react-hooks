// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = React.useState(
    () => {
      const valueInLocalStorage = window.localStorage.getItem(key) ?? defaultValue
      if(valueInLocalStorage) {
        try {
          return JSON.parse(valueInLocalStorage)
        } catch {
          window.localStorage.removeItem(key)
        }
      }
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  )

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if(prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('squares:history', [Array(9).fill(null)])
  const [current, setCurrent] = useLocalStorageState('squares:step', 0)
  
  const currentSquares = history[current]
  const winner = calculateWinner(currentSquares)
  const nextValue = calculateNextValue(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square) {
    if(winner || currentSquares[square]) {
      return
    }

    const historyCopy = history.slice(0, current + 1)
    const squaresCopy = [...currentSquares]
    
    squaresCopy[square] = nextValue
    setHistory([...historyCopy, squaresCopy])
    setCurrent(historyCopy.length)
  }

  function restart() {
    setCurrent(0)
    setHistory([Array(9).fill(null)])
  }

  const moves = history.map((stepSquares, step) => {
    const description = step ? `Go to move #${step}` : 'Go to game start'
    const isCurrentStep = step === current
    return(
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrent(step)}>
          {description} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
