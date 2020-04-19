import React, { Fragment, useState } from "react";
import TextField from "@material-ui/core/TextField";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from "@material-ui/icons/Clear";
import CreateIcon from "@material-ui/icons/Create";
import ErrorIcon from "@material-ui/icons/Error";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Password from "Components/Password/Password";

const useStyles = makeStyles((theme) => ({
  success: {
    color: "green"
  },
  error: {
    color: "red"
  },
  gridItem: {
    paddingTop: 20
  },
  cancelItem: {
    paddingRight: 60
  }
}));

export default function Register() {
  const classes = useStyles();
  const [ username, setUsername ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ usernameValid, setUsernameValid ] = useState(null);
  const [ emailValid, setEmailValid ] = useState(null);
  const [ usernameHelpText, setUsernameHelpText ] = useState("Case insensitive");

  function createUser() {
    axios.post("http://localhost:8443/api/createUser", { username, email, password })
      .then(response => {
        console.log("SUCCESS creating user", response);
      })
      .catch(error => {
        console.log("ERROR creating user: ", error);
      });
  }

  function validateUsername() {
    var normalize = username.trim().toLowerCase();
    console.log(/^[A-Za-z0-9]+$/.test(normalize));
    if(!/^[A-Za-z0-9]+$/.test(normalize)) {
      setUsernameValid(false);
      setUsernameHelpText("Username may only use letters/numbers");
    } else {
      axios.post("http://localhost:8443/api/checkUsername", {username: normalize})
      .then(response => {
        if(response.data.available === true) {
          setUsernameValid(true);
          setUsernameHelpText("Case insensitive");         
        } else {
          setUsernameValid(false);
          setUsernameHelpText("Username is already taken");
        }
      })
      .catch(error => {
        console.log("ERROR checkusername: ", error);
      });
    }
  }

  function validateEmail() {
    setEmailValid(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email));
  }

  return (
    <Fragment>
      <Typography color="secondary" align="center" variant="h4">Signup</Typography>

      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.gridItem}>
          <TextField color="secondary" value={username} onChange={(event) => setUsername(event.target.value)} 
            name="username" required label="Username" variant="outlined" helperText={usernameHelpText}
            inputProps={{maxLength: 25}} onBlur={() => validateUsername()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">                  
                  <IconButton onClick={() => setUsername("")}>
                    {username !== "" ? <ClearIcon /> : "" }
                  </IconButton>
                  <IconButton>
                    { usernameValid !== null 
                      ? (usernameValid 
                        ? <CheckCircleIcon className={classes.success} /> : <ErrorIcon className={classes.error} />)
                      : ""
                    }
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <TextField value={email} onBlur={() => validateEmail()} color="secondary"
            onChange={(event) => setEmail(event.target.value)} name="email" display="block" 
            required label="Email" variant="outlined" helperText={emailValid === false ? "Invalid email address" : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setEmail("")}>
                    {email !== "" ? <ClearIcon /> : "" }
                  </IconButton>
                  <IconButton>
                    { emailValid !== null 
                      ? (emailValid 
                          ? <CheckCircleIcon className={classes.success} /> : <ErrorIcon className={classes.error} />)
                      : "" 
                    }
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <Password required sendPassword={setPassword}/>
        </Grid>
      </Grid>

      <Grid container direction="row" alignItems="center" justify="center">
        <Grid item className={`${classes.gridItem} ${classes.cancelItem}`}>
          <Button variant="contained" color="secondary" 
            startIcon={<CancelIcon />} component={Link} to={"/"}>
            cancel
          </Button>
        </Grid>
        <Grid item className={classes.gridItem}>
          <Button variant="contained" color="primary" startIcon={<CreateIcon />} component={Link} to={"/login"}
            onClick={() => createUser()}>
            create
          </Button>
        </Grid>
      </Grid>        
    </Fragment>
  )
}