import React from 'react';
import axios from 'axios';

interface Props {
  setPokemonOne: React.Dispatch<React.SetStateAction<any>>;
  setPokemonTwo: React.Dispatch<React.SetStateAction<any>>;
}

const PokemonSelector: React.FC<Props> = ({ setPokemonOne, setPokemonTwo }) => {

  const getRandomPokemon = async () => {
    try {
      const randomIdOne = Math.floor(Math.random() * 151) + 1;
      const randomIdTwo = Math.floor(Math.random() * 151) + 1;

      const [responseOne, responseTwo] = await Promise.all([
        axios.get(`https://pokeapi.co/api/v2/pokemon/${randomIdOne}`),
        axios.get(`https://pokeapi.co/api/v2/pokemon/${randomIdTwo}`)
      ]);

      setPokemonOne(responseOne.data);
      setPokemonTwo(responseTwo.data);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    }
  };

  return (
    <div>
      <button onClick={getRandomPokemon}>Select Random Pokémon</button>
    </div>
  );
}

export default PokemonSelector;
