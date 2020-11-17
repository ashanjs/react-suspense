// Render as you fetch
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary
} from '../pokemon'
import { createResource } from '../utils'


function PokemonInfo({ pokemonResource }) {
  let pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )

}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [pokemonResource, setPokemonResource] = React.useState(null)
  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    setPokemonResource(createResource(fetchPokemon(pokemonName)))
  }, [pokemonName])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }
  function handleReset() {
    setPokemonName('')
  }
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <PokemonErrorBoundary
        onReset={handleReset}
        resetKeys={[pokemonResource]} >
        <React.Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
          <div className="pokemon-info">
            {pokemonResource ? (
              <PokemonInfo pokemonResource={pokemonResource} />) : (
                'Submit a pokemon'
              )}
          </div>
        </React.Suspense>
      </PokemonErrorBoundary>
    </div>

  )
}

export default App
