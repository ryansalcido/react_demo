import React, { Component, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from "@material-ui/icons/Clear";

class Password extends Component {
  constructor(props) {
    super(props);
    this.state = { password: "", showPassword: false };
    this.updatePassword = this.updatePassword.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
    this.clearPassword = this.clearPassword.bind(this);
  }

  updatePassword(event) {
    event.persist();
    this.setState(
      (state) => state.password = event.target.value, 
      () => { this.props.setPassword(this.state.password); }
    );    
  }

  clearPassword() {
    this.setState((state) => state.password = "");
  }

  togglePassword() {
    this.setState((state) => state.showPassword = !this.state.showPassword);
  }

  render() {
    return (
      <Fragment>
        <Box display="block" className="center" mt="20px">
          <TextField className="textBoxField" value={this.state.password} label="Password" variant="outlined"
           name="password" type={this.state.showPassword ? "text" : "password"} required={this.props.required}
           onChange={this.updatePassword} InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={this.clearPassword}>
                    {this.state.password !== "" ? <ClearIcon /> : "" }
                  </IconButton>
                  
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={this.togglePassword}>
                      {this.state.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}>
            Password
          </TextField>
        </Box>
      </Fragment>
    )
  }
}

export default Password;