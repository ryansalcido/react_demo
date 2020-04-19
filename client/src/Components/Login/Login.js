import React, { Fragment, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import InputAdornment from "@material-ui/core/InputAdornment";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Password from "Components/Password/Password";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from "@material-ui/icons/Clear";
import Alert from '@material-ui/lab/Alert';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    paddingTop: 20
  },
  createAccountItem: {
    paddingRight: 60
  },
  loginAlertError: {
    width: 600
  }
}));

export default function Login(props) {
  const classes = useStyles();
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ viewLoginError, setViewLoginError ] = useState(false);

  function login() {
    axios.post("http://localhost:8443/api/login", { username, password })
      .then(response => {
        console.log("SUCCESS authenticating user: ", response);
        if(response.data.success === true) {
          setViewLoginError(false);
          props.history.push("/");
        } else {
          setUsername("");
          setPassword("");
          setViewLoginError(true);
        }
        
      })
      .catch(error => {
        console.log("ERROR authenticating user: ", error);
        setUsername("");
        setPassword("");
        setViewLoginError(true);
      });
  }

  return (
    <Fragment>
      <Typography color="secondary" align="center" variant="h4">Login</Typography>
      
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.gridItem}>
          { viewLoginError 
            ? <Alert className={classes.loginAlertError} severity="error" 
                action={<ClearIcon onClick={() => setViewLoginError(false)} />}>
                Invalid username or password
              </Alert> 
            : ""
          }
        </Grid>
        <Grid item className={classes.gridItem}>
          <TextField margin="normal" value={username} onChange={(event) => setUsername(event.target.value)} 
            name="username" label="Username" variant="outlined" color="secondary"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setUsername("")}>
                    {username !== "" ? <ClearIcon /> : "" }
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <Password sendPassword={setPassword}/>
        </Grid>
      </Grid>

      <Grid container direction="row" alignItems="center" justify="center">
        <Grid item className={`${classes.gridItem} ${classes.createAccountItem}`}>
          <Button color="secondary" variant="contained" component={Link} to={"/register"}>register</Button>
        </Grid>
        <Grid item className={classes.gridItem}>
          <Button color="primary" variant="contained" startIcon={<ExitToAppIcon />} onClick={() => login()}>
            sign in
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  )
}