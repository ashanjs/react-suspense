// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import { PokemonDataView, fetchPokemon, PokemonErrorBoundary } from '../pokemon'

let pokemonResource = createResource(fetchPokemon('pikachu'))

function createResource(promise) {
  let status = 'pending'
  let result = promise.then(
    resolved => {
      status = 'success'
      result = resolved
    },
    rejected => {
      status = 'error'
      result = rejected
    }
  )
  return {
    read() {
      if (status === 'pending') throw result
      if (status === 'errror') throw result
      if (status === 'success') return result
      throw new Error('This should be impossible')
    }
  }
}


function PokemonInfo() {
  const pokemon = pokemonResource.read()
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
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <PokemonErrorBoundary>
          <React.Suspense fallback={<div>Loading pokemon...</div>}>
            <PokemonInfo />
          </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
