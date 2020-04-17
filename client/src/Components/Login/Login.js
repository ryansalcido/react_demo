import React, { Component, Fragment } from "react";
import Header from "Components/Header/Header";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
    this.updateState = this.updateState.bind(this);
  }

  updateState(event) {
    event.persist();
    this.setState((state) => state[event.target.name] = event.target.value);
  }

  render() {
    return (
      <Fragment>
        <Header />
        <h1 className="center">Login</h1>

        <Box display="block" className="center">
          <TextField className="textBoxField" value={this.state.username} onChange={this.updateState} 
            name="username" display="block" label="Username" variant="outlined" />
        </Box>
        <Box display="block" className="center inputEntry" mt="20px">
          <TextField className="textBoxField" value={this.state.email} name="email" display="block"
            onChange={this.updateState} label="Email" variant="outlined" />
        </Box>

        <Box display="block" className="loginBtnsDiv center">
          <Button color="primary" style={{marginRight: 60 }} component={Link} to={"/signup"}>Create account</Button>
          <Button color="primary" variant="contained" startIcon={<ExitToAppIcon />}>Sign in</Button>
        </Box>
      </Fragment>
    )
  }
}

export default Login;