import React, { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: 40
  }
}));

export default function Header() {
  const classes = useStyles();

  return (
    <Fragment>
      <AppBar color="primary" position="static">
        <Toolbar className={classes.toolbar}>
            <Grid container alignItems="flex-start" justify="flex-end" direction="row">
              <Button component={Link} to={"/register"}>register</Button>
              <Button component={Link} to={"/login"}>sign in</Button>
            </Grid>
          </Toolbar>
      </AppBar>
    </Fragment>
  )
}