import React, { Component, Fragment } from "react";
import Header from "Components/Header/Header";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Password from "Components/Password/Password";
import "./Login.css";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
    this.updateState = this.updateState.bind(this);
    this.getPassword = this.getPassword.bind(this);
    this.login = this.login.bind(this);
  }

  updateState(event) {
    event.persist();
    this.setState((state) => state[event.target.name] = event.target.value);
  }

  getPassword(password) {
    this.setState({ password });
  }

  login() {
    axios.post("http://localhost:8443/api/login", 
    {username: this.state.username, password: this.state.password})
      .then(response => {
        console.log("SUCCESS authenticating user: ", response);
        // this.setState({success: response.data.success});
        if(response.data.success === true) {
          this.props.history.push("/");
        } else {
          this.setState({username: "", password: ""});
        }
      })
      .catch(error => {
        console.log("ERROR authenticating user: ", error);
        // this.setState({success: false});
        this.setState({username: "", password: ""});
      });
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
        {/* <Box display="block" className="center inputEntry" mt="20px">
          <TextField className="textBoxField" value={this.state.email} name="email" display="block"
            onChange={this.updateState} label="Password" variant="outlined" />
        </Box> */}

        <Password setPassword={this.getPassword}/>

        <Box display="block" className="loginBtnsDiv center">
          <Button color="primary" style={{marginRight: 60 }} component={Link} to={"/signup"}>Create account</Button>
          <Button color="primary" variant="contained" startIcon={<ExitToAppIcon />} onClick={this.login}>
            Login
          </Button>
        </Box>
      </Fragment>
    )
  }
}

export default Login;