import React, { Component, Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <Fragment>
        <AppBar id="header" position="static">
          <Toolbar id="headerToolbar">
            <Grid container alignItems="flex-start" justify="flex-end" direction="row">
              <Button startIcon={<AccountCircleIcon />} component={Link} to={"/login"}>LOGIN</Button>
            </Grid>
          </Toolbar>
        </AppBar>
      </Fragment>
    )
  }
}

export default Header;