// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
// 🐨 you'll also need to get the fetchPokemon function from ../pokemon:
import { PokemonDataView, fetchPokemon } from '../pokemon'

// 💰 use it like this:fetchPokemon(pokemonName).then(handleSuccess, handleFailure)

// 🐨 create a variable called "pokemon" (using let)
let pokemon
// 💣 delete this now...
/*const pokemon = {
  name: 'TODO',
  number: 'TODO',
  attacks: {
    special: [{name: 'TODO', type: 'TODO', damage: 'TODO'}],
  },
  fetchedAt: 'TODO',
}*/

// We don't need the app to be mounted to know that we want to fetch the pokemon
// named "pikachu" so we can go ahead and do that right here.
// 🐨 assign the pokemonPromise variable to a call to fetchPokemon('pikachu')
let pokemonPromise = fetchPokemon('pikachu').then(
  pokemonData => pokemon = pokemonData
)
// 🐨 when the promise resolves, assign the "pokemon" variable to the resolved value
// 💰 For example: somePromise.then(resolvedValue => (someValue = resolvedValue))

function PokemonInfo() {
  // 🐨 if there's no pokemon yet, then throw the pokemonPromise
  // 💰 (no, for real. Like: `throw pokemonPromise`)
  if (!pokemon) {
    throw pokemonPromise
  }
  // if the code gets it this far, then the pokemon variable is defined and
  // rendering can continue!
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
        {/* 🐨 Wrap the PokemonInfo component with a React.Suspense component with a fallback */}
        <React.Suspense fallback={<div>Loading pokemon...</div>}>
          <PokemonInfo />
        </React.Suspense>
      </div>
    </div>
  )
}

export default App
