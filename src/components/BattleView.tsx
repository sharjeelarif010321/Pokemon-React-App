import React, { useState } from 'react';
import axios from 'axios';
import './BattleView.css';

interface Props {
  pokemonOne: any;
  pokemonTwo: any;
  battleLog: string[];
  setBattleLog: React.Dispatch<React.SetStateAction<string[]>>;
  resetBattle: () => void;
}

const BattleView: React.FC<Props> = ({ pokemonOne, pokemonTwo, battleLog, setBattleLog, resetBattle }) => {
  const [pokemonOneHealth, setPokemonOneHealth] = useState<number>(100);
  const [pokemonTwoHealth, setPokemonTwoHealth] = useState<number>(100);
  const [battleEnded, setBattleEnded] = useState<boolean>(false);
  const [pokemonOneMove, setPokemonOneMove] = useState<any>(null);
  const [pokemonTwoMove, setPokemonTwoMove] = useState<any>(null);

  const startBattle = async () => {
    try {
      let winnerDetermined = false;

      setBattleLog(prevLog => [...prevLog, `<strong>Battle:</strong> <strong>${pokemonOne.name}</strong> vs <strong>${pokemonTwo.name}</strong>`]);

      while (!winnerDetermined) {
        const moveOne = pokemonOne.moves[Math.floor(Math.random() * pokemonOne.moves.length)].move;
        const moveTwo = pokemonTwo.moves[Math.floor(Math.random() * pokemonTwo.moves.length)].move;

        const [moveOneDetails, moveTwoDetails] = await Promise.all([
          axios.get(moveOne.url),
          axios.get(moveTwo.url)
        ]);

        const movePowerOne = moveOneDetails.data.power || 0;
        const movePowerTwo = moveTwoDetails.data.power || 0;

        setPokemonOneMove({ name: moveOneDetails.data.name, power: movePowerOne });
        setPokemonTwoMove({ name: moveTwoDetails.data.name, power: movePowerTwo });

        setBattleLog(prevLog => [
          ...prevLog,
          `<span>${pokemonOne.name} uses <span class="move">${moveOneDetails.data.name}</span> with power ${movePowerOne}</span>`,
          `<span>${pokemonTwo.name} uses <span class="move">${moveTwoDetails.data.name}</span> with power ${movePowerTwo}</span>`,
        ]);

        if (movePowerOne > movePowerTwo) {
          setBattleLog(prevLog => [...prevLog, `<span class="winning-move">${pokemonOne.name} lands a decisive blow, knocking out ${pokemonTwo.name}!</span>`]);
          setPokemonTwoHealth(0);
          winnerDetermined = true;
        } else if (movePowerOne < movePowerTwo) {
          setBattleLog(prevLog => [...prevLog, `<span class="winning-move">${pokemonTwo.name} lands a decisive blow, knocking out ${pokemonOne.name}!</span>`]);
          setPokemonOneHealth(0);
          winnerDetermined = true;
        } else {
          setBattleLog(prevLog => [...prevLog, `<span class="tie-move">It's a tie! The battle continues...</span>`]);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setBattleEnded(true);

    } catch (error) {
      console.error('Error fetching move details:', error);
      setBattleLog(prevLog => [...prevLog, 'An error occurred during the battle.']);
    }
  };

  return (
    <div>
      <h2>Battle View</h2>
      <div className="pokemon-container">
        <div className="pokemon">
          <h3>{pokemonOne.name}</h3>
          <img className="pokemon-image user-pokemon" src={pokemonOne.sprites.back_default} alt={pokemonOne.name} />
          <div className={`health-bar ${pokemonOneHealth === 0 ? 'empty' : ''}`}>
            <div className="health-fill" style={{ width: `${pokemonOneHealth}%` }}></div>
          </div>
          {pokemonOneMove && (
            <div className="move-details">
              <span className="move-name">{pokemonOneMove.name}</span>
              <span className="move-power">{pokemonOneMove.power}</span>
            </div>
          )}
        </div>
        <div className="pokemon">
          <h3>{pokemonTwo.name}</h3>
          <img className="pokemon-image enemy-pokemon" src={pokemonTwo.sprites.front_default} alt={pokemonTwo.name} />
          <div className={`health-bar ${pokemonTwoHealth === 0 ? 'empty' : ''}`}>
            <div className="health-fill" style={{ width: `${pokemonTwoHealth}%` }}></div>
          </div>
          {pokemonTwoMove && (
            <div className="move-details">
              <span className="move-name">{pokemonTwoMove.name}</span>
              <span className="move-power">{pokemonTwoMove.power}</span>
            </div>
          )}
        </div>
      </div>
      {battleEnded ? (
        <button onClick={resetBattle}>Select New Pokémon</button>
      ) : (
        <button onClick={startBattle}>Start Battle</button>
      )}
    </div>
  );
}

export default BattleView;
