import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';
import { GlobalSymbolStyle, DiceMap, ResultMap, LargeSymbol, MediumSymbol, diceSorter, resolveroll } from './symbols';

const Button = styled.button`
  font-size: 2em;
`;

const Footer = styled.div`
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
`;

const DiceSelector = ({ addToPool }) => (
  <div>
    {
      Object.entries(DiceMap).map(([name, Component]) => (
        <LargeSymbol>
        <Component key={name} onClick={() => addToPool(name)} />
        </LargeSymbol>
      ))
    }
  </div>
);

const DisplayPool = ({ names, removeFromPool }) => {
  return (
    <>
    {
      names.map((name) => {
        const Component = DiceMap[name];
        return <MediumSymbol><Component onClick={() => removeFromPool(name)} /></MediumSymbol>;
      })
    }
    </>
  );
};

function displayResult(collector, result)  {
  const count = collector[result];
  if (count === 0) {
    return null;
  } 
  return (
    <div>
    {`${count}x ${result}${count > 1 ? 's': ''}`}
    {' '}
    {Array(count).fill().map(() => {
      const Component = ResultMap[result];
      return <Component />;
    })}
    </div>
  );
}

const DisplayResults = ({ resultCollector }) => {
  return (
    <>
      {Object.keys(ResultMap).map((result) => displayResult(resultCollector, result))}
    </>
  );
}

class App extends Component {
  state = {
    pool: [],
    resultCollector: null,
  }

  addToPool = (name) => {
    let pool = this.state.pool.slice();
    pool.push(name);
    pool.sort(diceSorter);
    this.setState({ pool });
  }

  removeFromPool = (name) => {
    let pool = this.state.pool.slice();
    pool.splice(pool.indexOf(name), 1);
    this.setState({ pool });
  }

  rollPool = () => {
    const pool = this.state.pool;
    const resultCollector = resolveroll(pool, true);
    this.setState({ resultCollector });
  }

  clearPool = () => {
    this.setState({ pool: [], resultCollector: null });
  }

  render() {
    return (
      <div className="App">
        <GlobalSymbolStyle />
        <DiceSelector addToPool={this.addToPool} />
        {'---'}
        <br />
        <DisplayPool names={this.state.pool} removeFromPool={this.removeFromPool} />
        <br />
        <br />
        <Button onClick={this.clearPool}>Clear</Button>
        {' '}
        <Button onClick={this.rollPool}>Roll</Button>
        <br />
        <br />
        {this.state.resultCollector !== null ?
        <DisplayResults resultCollector={this.state.resultCollector} />
            : null
        }
        <Footer>
          <p>
            <i>Click a dice symbol to add or remove it.</i>
          </p>
        </Footer>
      </div>
    );
  }
}

export default App;
