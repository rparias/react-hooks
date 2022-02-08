// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, PokemonInfoFallback, PokemonDataView, fetchPokemon} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: 'idle'
  })

  React.useEffect(() => {
    if(!pokemonName) return

    setState({ status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({ pokemon: pokemonData, status: 'resolved'})
      },
      error => {
        setState({ error: error, status: 'rejected'})
      }
    )
  }, [pokemonName])

  const { status, error, pokemon } = state

  if(status === 'rejected') {
    throw error
  }
  if(status === 'idle') return 'Submit a pokemon'
  if(status === 'pending') return <PokemonInfoFallback name={pokemonName} />
  if(status === 'resolved') return <PokemonDataView pokemon={pokemon} />
}


function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
