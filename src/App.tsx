import React, { useState } from 'react';
import './App.css';
import PokemonSelector from './components/PokemonSelector';
import BattleView from './components/BattleView';
import BattleLog from './components/BattleLog';
import axios from 'axios';

function App() {
  const [pokemonOne, setPokemonOne] = useState<any>(null);
  const [pokemonTwo, setPokemonTwo] = useState<any>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState<boolean>(false); // New state to track if the game has started

  const fetchRandomPokemon = async () => {
    const randomIdOne = Math.floor(Math.random() * 151) + 1; // Fetch from first 151 Pokémon
    const randomIdTwo = Math.floor(Math.random() * 151) + 1;

    try {
      const [responseOne, responseTwo] = await Promise.all([
        axios.get(`https://pokeapi.co/api/v2/pokemon/${randomIdOne}`),
        axios.get(`https://pokeapi.co/api/v2/pokemon/${randomIdTwo}`)
      ]);

      setPokemonOne(responseOne.data);
      setPokemonTwo(responseTwo.data);
      setHasStarted(true); // Mark the game as started once Pokémon are fetched
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    }
  };

  const resetBattle = () => {
    setPokemonOne(null);
    setPokemonTwo(null);
    fetchRandomPokemon(); // Automatically select two new Pokémon
  };

  const refreshApp = () => {
    setHasStarted(false); // Reset the start status
    setPokemonOne(null);
    setPokemonTwo(null);
    setBattleLog([]); // Clear the battle log
  };

  return (
    <div className="App">
      <h1>Pokémon Battle App</h1>
      {!hasStarted ? (
        <button onClick={fetchRandomPokemon}>Begin Game</button> // Show Begin Game button if not started
      ) : (
        <>
          <button onClick={refreshApp}>Refresh App</button> {/* Button to refresh the entire app */}
          <div className="battle-container">
            {!pokemonOne && !pokemonTwo && (
              <PokemonSelector 
                setPokemonOne={setPokemonOne} 
                setPokemonTwo={setPokemonTwo} 
              />
            )}
            {pokemonOne && pokemonTwo && (
              <BattleView 
                pokemonOne={pokemonOne} 
                pokemonTwo={pokemonTwo} 
                battleLog={battleLog}
                setBattleLog={setBattleLog}
                resetBattle={resetBattle}
              />
            )}
          </div>
          <div className="log-container">
            {battleLog.length > 0 && <BattleLog battleLog={battleLog} />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
