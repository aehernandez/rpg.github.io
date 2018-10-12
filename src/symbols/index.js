import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import font from './swrpg.otf';

export const GlobalSymbolStyle = createGlobalStyle`
  @font-face { font-family: StarWars; src: url(${font}); }
`;

export const Challenge = styled(
  ({...props}) => <span title="Challenge" {...props}>{'\u0063'}</span>
)`
     font-family: StarWars;
     color: red;
     -webkit-text-stroke: 1px black;
`;

export const Proficiency = styled(
  ({...props}) => <span title="Proficiency" {...props}>{'\u0063'}</span>
)`
     font-family: StarWars;
     color: yellow;
     -webkit-text-stroke: 1px black;
`;

export const Ability = styled(
  ({...props}) => <span title="Ability" {...props}>{'\u0064'}</span>
)`
     font-family: StarWars;
     color: green;
     -webkit-text-stroke: 1px black;
`;

export const Difficulty = styled(
  ({...props}) => <span title="Difficulty" {...props}>{'\u0064'}</span>
)`
     font-family: StarWars;
     color: purple;
     -webkit-text-stroke: 1px black;
`;

export const Setback = styled(
  ({...props}) => <span title="Setback" {...props}>{'\u0062'}</span>
)`
     font-family: StarWars;
     color: black;
     -webkit-text-stroke: 1px black;
`;

export const Boost = styled(
  ({...props}) => <span title="Boost" {...props}>{'\u0062'}</span>
)`
     font-family: StarWars;
     color: aqua;
     -webkit-text-stroke: 1px black;
`;

export const Force = styled(
  ({...props}) => <span title="Force" {...props}>{'\u0063'}</span>
)`
     font-family: StarWars;
     color: white;
     -webkit-text-stroke: 1px black;
`;

export const Light = styled(
  ({...props}) => <span title="Light" {...props}>{'\u007A'}</span>
)`
     font-family: StarWars;
     color: white;
     -webkit-text-stroke: 1px black;
`;

export const Dark = styled(
  ({...props}) => <span title="Dark" {...props}>{'\u007A'}</span>
)`
     font-family: StarWars;
     color: black;
     -webkit-text-stroke: 1px black;
`;

const Symbol = styled.span`
  font-family: StarWars;
`;

export const Success = () => <Symbol title="Success">{'\u0073'}</Symbol>
export const Advantage = () => <Symbol title="Advantage">{'\u0061'}</Symbol>
export const Triumph = () => <Symbol title="Triumph">{'\u0078'}</Symbol>
export const Failure = () => <Symbol title="Failure">{'\u0066'}</Symbol>
export const Threat = () => <Symbol title="Threat">{'\u0074'}</Symbol>
export const Despair = () => <Symbol title="Despair">{'\u0079'}</Symbol>

export const LargeSymbol = styled.div`
  font-size: 3em;
  padding: 5px;
  display: inline;
`;
export const MediumSymbol = styled.div`
  font-size: 1.75em;
  display: inline;
`;

export const DiceMap = {
  Ability,
  Proficiency,
  Difficulty,
  Challenge,
  Boost,
  Setback,
  Force,
};

export const ResultMap = {
  Success,
  Failure,
  Advantage,
  Threat,
  Triumph,
  Despair,
  Light,
  Dark,
};

export const DiceProbability = {
  Ability: [
    ["Success"],
    ["Advantage"],
    ["Success", "Advantage"],
    ["Success", "Success"],
    ["Advantage"],
    ["Success"],
    ["Advantage", "Advantage"],
    [],
  ],
  Proficiency: [
    ["Advantage", "Advantage"],
    ["Advantage"],
    ["Advantage", "Advantage"],
    ["Triumph"],
    ["Success"],
    ["Success", "Advantage"],
    ["Success"],
    ["Success", "Advantage"],
    ["Success", "Success"],
    ["Success", "Advantage"],
    ["Success", "Success"],
    [],
  ],
  Difficulty: [
    ["Threat"],
    ["Failure"],
    ["Threat", "Failure"],
    ["Threat"],
    [],
    ["Threat", "Threat"],
    ["Failure", "Failure"],
    ["Threat"],
  ],
  Challenge: [
    ["Threat", "Threat"],
    ["Threat"],
    ["Threat", "Threat"],
    ["Threat"],
    ["Threat", "Failure"],
    ["Failure"],
    ["Threat", "Failure"],
    ["Failure"],
    ["Failure", "Failure"],
    ["Despair"],
    ["Failure", "Failure"],
    [],
  ],
  Boost: [
    ["Advantage"],
    ["Advantage", "Advantage"],
    ["Success"],
    ["Success", "Advantage"],
    [],
    [],
  ],
  Setback: [
    ["Failure"],
    ["Failure"],
    ["Threat"],
    ["Threat"],
    [],
    [],
  ],
  Force: [
    ["Light", "Light"],
    ["Light", "Light"],
    ["Light", "Light"],
    ["Light"],
    ["Light"],
    ["Dark"],
    ["Dark"],
    ["Dark"],
    ["Dark"],
    ["Dark"],
    ["Dark"],
    ["Dark", "Dark"],
  ],
};

const diceNameIndex = {};
Object.keys(DiceMap).forEach((name, index) => { diceNameIndex[name] = index; });

export const diceSorter = (left, right) => {
  return diceNameIndex[left] - diceNameIndex[right];
}

function roll(name) {
  const choices = DiceProbability[name]
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function rollall(names) {
  return names.map(roll).reduce((acc, value) => acc.concat(value), []);
}

function cancelresult(collector, left, right) {
  if (collector[left] > collector[right]) {
    collector[left] -= collector[right];
    collector[right] = 0;
  } else {
    collector[right] -= collector[left];
    collector[left] = 0;
  }
}

export function resolveroll(names, triumphAddsSuccess) {
  const collector = {
    Success: 0,
    Advantage: 0,
    Triumph: 0,
    Failure: 0,
    Threat: 0,
    Despair: 0,
    Light: 0,
    Dark: 0,
  };

  const results = rollall(names);

  if (triumphAddsSuccess) {
    results.filter((result) => result === "Triumph").forEach(() => results.push("Success"));
    results.filter((result) => result === "Despair").forEach(() => results.push("Failure"));
  }

  results.forEach((result) => collector[result] += 1);

  [
    ["Success", "Failure"],
    ["Advantage", "Threat"],

  ].forEach(([left, right]) => cancelresult(collector, left, right));

  return collector;
}

