import React, { Fragment, useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../Context/AuthContext";
import AuthService from "../Services/authService";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: 40
  }
}));

const Header = () => {
  const classes = useStyles();
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const onClickLogoutHandler = () => {
    AuthService.logout().then(data => {
      if(data.success) {
        setUser(data.user);
        setIsAuthenticated(false);
      }
    });
  }

  return (
    <Fragment>
      <AppBar color="primary" position="static">
        <Toolbar className={classes.toolbar}>
            <Grid container alignItems="flex-start" justify="flex-end" direction="row">
              
              {isAuthenticated 
                ? <Button component={Link} to={"/"} onClick={onClickLogoutHandler}>logout</Button>
                : <Fragment>
                    <Button component={Link} to={"/register"}>register</Button>
                    <Button component={Link} to={"/login"}>sign in</Button>
                  </Fragment>
              }
            </Grid>
          </Toolbar>
      </AppBar>
    </Fragment>
  )
}

export default Header;