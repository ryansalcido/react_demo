import React, { Component, Fragment } from "react";
import Header from "Components/Header/Header";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from "@material-ui/icons/Clear";
import CreateIcon from "@material-ui/icons/Create";
import ErrorIcon from "@material-ui/icons/Error";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import "./Signup.css";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", email: "", password: "", usernameValid: null, emailValid: null };
    this.updateState = this.updateState.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
  }

  updateState(event) {
    event.persist();
    this.setState((state) => state[event.target.name] = event.target.value);
  }
  
  validateEmail() {
    this.setState((state) => 
      state.emailValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email));
  }

  validateUsername() {
    this.setState((state) => state.usernameValid = /^[A-Za-z0-9]+$/.test(this.state.username));
  }

  handleIconClick(name) {
    this.setState((state) => state[name] = "" );
    if(name === "username") {
      this.setState((state) => state.usernameValid = null);
    } else if(name === "email") {
      this.setState((state) => state.emailValid = null);
    }
  }

  render() {
    return (
      <Fragment>
        <Header />
        <h1 className="center">Signup</h1>
    
        <Box display="block" className="center">
          <TextField className="textBoxField" value={this.state.username} onChange={this.updateState} 
            name="username" display="block" required label="Username" variant="outlined" 
            inputProps={{maxLength: 25}} onBlur={this.validateUsername}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  { this.state.usernameValid !== null 
                    ? (this.state.usernameValid 
                        ? <CheckCircleIcon className="success" /> : <ErrorIcon className="error" />)
                    : ""
                  }
                  { this.state.username !== "" ? <ClearIcon onClick={() => this.handleIconClick("username")}/> : "" }
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box display="block" className="center inputEntry" mt="20px">
          <TextField className="textBoxField" value={this.state.email} onBlur={this.validateEmail}
            onChange={this.updateState} name="email" display="block" required label="Email" variant="outlined" 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  { this.state.emailValid !== null 
                    ? (this.state.emailValid 
                        ? <CheckCircleIcon className="success" /> : <ErrorIcon className="error" />)
                    : "" 
                  }
                  { this.state.email !== "" ? <ClearIcon onClick={() => this.handleIconClick("email")}/> : "" }
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box display="block" className="center" mt="20px">
          <TextField className="textBoxField" value={this.state.password} onChange={this.updateState} 
            name="password" display="block" required label="Password" variant="outlined" 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  { this.state.password !== "" ? <ClearIcon onClick={() => this.handleIconClick("password")}/> : "" }
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box className="cancelCreateDiv center" >
          <Button style={{marginRight: 60 }} variant="contained" color="secondary" startIcon={<CancelIcon />} component={Link} to={"/"}>Cancel</Button>
          <Button variant="contained" color="primary" startIcon={<CreateIcon />} component={Link} to={"/"}>Create</Button>
        </Box>
      </Fragment>
    )
  }
}

export default Signup;