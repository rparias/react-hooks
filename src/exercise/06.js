// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, PokemonInfoFallback, PokemonDataView, fetchPokemon} from '../pokemon'

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
    return (
      <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  }
  if(status === 'idle') return 'Submit a pokemon'
  if(status === 'pending') return <PokemonInfoFallback name={pokemonName} />
  if(status === 'resolved') return <PokemonDataView pokemon={pokemon} />
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
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
