import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';


export default class SavePoolController extends React.PureComponent {
  state = { name: '' }

  savePool = () => {
    this.props.savePool(this.state.name);
    this.setState({ name: '' });
  }

  render() {
    return (
      <TextField
        id="outlined-adornment-password"
        variant="outlined"
        type="text"
        label="Name"
        value={this.state.name}
        onChange={(e) => this.setState({ name: e.target.value })}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button disabled={!this.state.name} onClick={this.savePool}>
                Save
              </Button>
            </InputAdornment>
          ),
        }}
      />
    )
  }
}
