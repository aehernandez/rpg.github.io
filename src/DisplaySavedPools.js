import React from 'react';

import { DiceMap } from './symbols';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

function renderPool(pool) {
  return (
    <React.Fragment>
    {
      pool.map((dice, index) => {
        const Component = DiceMap[dice];
        return <Component key={`${dice} ${index}`}/>;
      })
    }
    </React.Fragment>
  );
}

export default function DisplaySavedPools({ pools, loadPool, deletePool }) {
  return (
    <List>
      {
        Object.entries(pools).map(([name, pool]) => (
          <ListItem key={name} button onClick={() => loadPool(pool)}>
            <ListItemText primary={name} secondary={renderPool(pool)} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => deletePool(name)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))
      }
    </List>
  );
}
