// Cache resources
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import { createResource } from '../utils'

function PokemonInfo({ pokemonResource }) {
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

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
}


const pokemonResourceCacheContext = React.createContext()

function PokemonCacheProvider({ children }) {
  const cache = React.useRef({})

  const getPokemonResource = React.useCallback(name => {
    const lowerName = name.toLowerCase()
    let resource = cache.current[lowerName]
    if (!resource) {
      resource = createPokemonResource(lowerName)
      cache.current[lowerName] = resource
    }
    return resource
  }, [])
  return <pokemonResourceCacheContext.Provider value={getPokemonResource} >
    {children}
  </pokemonResourceCacheContext.Provider>
}



function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}
function usePokemonResourceCacheContext() {
  return React.useContext(pokemonResourceCacheContext)
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  const getPokemonResource = usePokemonResourceCacheContext()

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    startTransition(() => {

      setPokemonResource(getPokemonResource(pokemonName))
    })
  }, [pokemonName, startTransition, getPokemonResource])

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
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
            'Submit a pokemon'
          )}
      </div>
    </div>
  )
}

function AppWithProvider() {
  return (
    <PokemonCacheProvider>
      <App />
    </PokemonCacheProvider>
  )
}

export default AppWithProvider
