import React from 'react';

import { renderPool, renderResult } from './symbols';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';


export default function DisplayResultHistory({ history }) {
  return (
    <List>
      {
        history.map(({ pool, resultCollector }, index) => (
          <React.Fragment key={`History ${index}`}>
          <Divider />
          <ListItem >
            <ListItemText 
              primary={renderResult(resultCollector)} 
              secondary={renderPool(pool)} 
            />
          </ListItem>
        </React.Fragment>
        ))
      }
    </List>
  );
}
