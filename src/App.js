import React, { Component } from 'react';
import './App.css';
import { GlobalSymbolStyle, DiceMap, ResultMap, diceSorter, resolveroll } from './symbols';
import * as storage from './storage';
import SavePoolController from './SavePoolController';
import DisplaySavedPools from './DisplaySavedPools';
import DisplayResultHistory from './DisplayResultHistory';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GithubMark from './GitHub-Mark.svg';

import 'typeface-roboto';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true
  }
});

const DiceSelector = ({ addToPool }) => (
  <Grid 
    container 
    direction="row" 
    spacing={32}
    justify="center"
    alignItems="flex-start"
  >
    {
      Object.entries(DiceMap).map(([name, Component]) => (
          <Grid item key={name}>
            <Component onClick={() => addToPool(name)} size="large"/>
          </Grid>
      ))
    }
  </Grid>
);

const DisplayPool = ({ names, removeFromPool }) => {
  return (
    <React.Fragment>
    {
      names.length === 0 ?
        <i>-</i>:
      names.map((name, index) => {
        const Component = DiceMap[name];
        return <Component key={`${name} ${index}`} onClick={() => removeFromPool(name)} size="medium"/>;
      })
    }
    </React.Fragment>
  );
};


function displayResult(collector, result)  {
  const count = collector[result];
  if (count === 0) {
    return null;
  } 
  return (
    <ListItem key={result}>
      <ListItemText
        secondary={`${count}x ${result}${count > 1 ? 's': ''}`}
        primary={Array(count).fill().map((_, i) => {
          const Component = ResultMap[result];
          return <Component key={`Result ${i}`} />;
        })}
      />
    </ListItem>
  );
}

const DisplayResults = ({ resultCollector, noResultText = "Even Wash" }) => {
  const results = Object.keys(ResultMap)
    .map((result) => displayResult(resultCollector, result))
    .filter((r) => r !== null);
  const isWash = results.length === 0;

  return (
    <List>
      {(isWash) ? <ListItem><i>{noResultText}</i></ListItem> : 
          <List>
            {results}
          </List>
      }
    </List>
  );
}

class App extends Component {
  state = {
    pool: [],
    resultCollector: null,
    savedPools: {},
    history: [],
  }

  componentDidMount() {
    this.loadPools();
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
    const history = this.state.history.slice();
    if (history.length > 5) { history.pop(); }
    history.unshift({ pool, resultCollector });

    this.setState({ resultCollector, history });
  }

  clearPool = () => {
    this.setState({ pool: [], resultCollector: null, history: [] });
  }

  loadPools = () => {
    storage.loadPools();
    this.setState({ savedPools: storage.loadPools() });
  }

  savePool = (name) => {
    storage.savePool(name, this.state.pool);
    this.loadPools();
  }

  deletePool = (name) => {
    storage.deletePool(name);
    this.loadPools();
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
      <div className="App">
        <GlobalSymbolStyle />
        <DiceSelector addToPool={this.addToPool} />
        <br />
        <Divider inset />
        <br />
        <Grid 
          container 
          direction="column"
          alignItems="center"
          spacing={32}
        >
          <Grid item md={6}>
            <DisplayPool names={this.state.pool} removeFromPool={this.removeFromPool} />
            <br />
            <br />
            <Button onClick={this.clearPool}>Clear</Button>
            {' '}
            <Button disabled={this.state.pool.length === 0} variant="outlined" color="primary" onClick={this.rollPool}>Roll</Button>
          </Grid>
          <Grid item md={6}>
            <Card>
              {this.state.resultCollector !== null ?
              <DisplayResults resultCollector={this.state.resultCollector} />
                  : <CardContent><i>No results</i></CardContent>
              }
            </Card>
          </Grid>
          <Grid 
            container 
            justify="center"
            alignItems="flex-start"
            spacing={24}
          >
            <Grid item md={6}>
              <Card>
                <CardHeader subheader="Saved Dice Pools" />
                <CardContent>
                  <SavePoolController savePool={this.savePool} />
                  <DisplaySavedPools 
                    pools={this.state.savedPools}
                    loadPool={(pool) => this.setState({ pool }) }
                    deletePool={this.deletePool}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={4}>
              <Card>
                <CardHeader subheader="History" />
                  <DisplayResultHistory history={this.state.history} />
              </Card>
            </Grid>
          </Grid>
          <Grid item>
            <p>
              <i>Click a dice symbol to add or remove it.</i>
            </p>
          </Grid>
        </Grid>
        <br />
        <br />
      <footer>
        <Grid 
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
        iiii>
          <Grid item md={1}>
            <Button variant="fab" href="https://github.com/aehernandez/rpg.github.io" target="_blank">
              <img src={GithubMark} alt="Github"/>
            </Button>
          </Grid>
        </Grid>
      </footer>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
