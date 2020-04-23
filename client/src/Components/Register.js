import React, { Fragment, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from "@material-ui/icons/Clear";
import CreateIcon from "@material-ui/icons/Create";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import useDebounce from "./utils/useDebounce";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import AuthService from "../Services/authService";

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
  },
  passwordStrengthItem: {
    paddingTop: 10
  }
}));

const Register = (props) => {
  const classes = useStyles();
  const [ username, setUsername ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ showPassword, setShowPassword ] = useState(false);
  const [ usernameError, setUsernameError ] = useState({error: false, msg: ""});
  const [ emailError, setEmailError ]= useState({error: false, msg: ""});
  const [ passwordError, setPasswordError ] = useState({error: false, msg: ""});

  const debouncedUsername = useDebounce(username, 500);
  const debouncedEmail = useDebounce(email, 500);
  const debouncedPassword = useDebounce(password, 500);

  useEffect(() => {
    if(debouncedUsername) {
      var normalized = debouncedUsername.trim();
      if(!/^[A-Za-z0-9]+$/.test(normalized)) {
        setUsernameError({error: true, msg: "Username may only contain alphanumeric characters"});
      } else {
        AuthService.checkUsername({username: normalized}).then(data => {
          const { message } = data;
          if(message.msgError === true) {
            setUsernameError({error: true, msg: "Username is already taken"});
          } else {
            setUsernameError({error: false, msg: ""});
          }
        });
      }
    }
  }, [debouncedUsername]);

  useEffect(() => {
    if(debouncedEmail) {
      setEmailError(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(debouncedEmail)
        ? {error: false, msg: ""} : {error: true, msg: "Please provide a valid email address"});
    }
  }, [debouncedEmail]);

  useEffect(() => {
    if(debouncedPassword) {
      if(debouncedPassword.length < 8) {
        setPasswordError({error: true, msg: "Password must be at least 8 characters"});
      } else {
        setPasswordError({error: false, msg: ""});
      }
    }
  }, [debouncedPassword]);

  function createUser() {
    if(username === "" || email === "" || password === "") {
      if(username === "") {
        setUsernameError({error: true, msg: "Username is a required field"});
      }
      if(email === "") {
        setEmailError({error: true, msg: "Email is a required field"});
      }
      if(password === "") {
        setPasswordError({error: true, msg: "Password is a required field"});
      }
    } else {
      AuthService.register({ username, email, password }).then(data => {
        const { message } = data;
        if(!message.msgError) {
          console.log("SUCCESS creating user", message);
          props.history.push("/login");
        }
      });
    }
  }

  return (
    <Fragment>
      <Typography color="secondary" align="center" variant="h4">Signup</Typography>
      {usernameError.error}
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.gridItem}>
          <TextField color="secondary" value={username} name="username" required label="Username"
            variant="outlined" inputProps={{maxLength: 25}} onChange={(event) => setUsername(event.target.value)}
            error={usernameError.error} helperText={usernameError.msg}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => {setUsername(""); setUsernameError({error: false, msg: ""})}}>
                    {username !== "" && <ClearIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item className={classes.gridItem}>
          <TextField value={email} color="secondary" name="email" required label="Email"
            variant="outlined" onChange={(event) => setEmail(event.target.value)}
            error={emailError.error} helperText={emailError.msg}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => {setEmail(""); setEmailError({error: false, msg: ""})}}>
                    {email !== "" && <ClearIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <TextField color="secondary" value={password} label="Password" required
            name="password" type={showPassword ? "text" : "password"} variant="outlined"
            onChange={(event) => setPassword(event.target.value)}
            error={passwordError.error} helperText={passwordError.msg}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => {setPassword(""); setPasswordError({error: false, msg: ""})}}>
                      {password !== "" && <ClearIcon />}
                  </IconButton>
                  <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }} 
          />
        </Grid>
        <Grid item className={classes.passwordStrengthItem}>
          <PasswordStrengthMeter password={password} />
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
          <Button variant="contained" color="primary" startIcon={<CreateIcon />}
            onClick={() => createUser()}>
            create
          </Button>
        </Grid>
      </Grid>        
    </Fragment>
  )
}

export default Register;