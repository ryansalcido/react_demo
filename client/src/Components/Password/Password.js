import React, { Fragment, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from "@material-ui/icons/Clear";

export default function Password(props) {
  const [ password, setPassword ] = useState("");
  const [ showPassword, setShowPassword ] = useState(false);
  const { sendPassword } = props;

  useEffect(() => {
    sendPassword(password);
  }, [ password, sendPassword ]);

  return (
    <Fragment>
      <TextField color="secondary" className="textBoxField" value={password} label="Password" variant="outlined"
        name="password" type={showPassword ? "text" : "password"} required={props.required}
        onChange={(event) => setPassword(event.target.value)} 
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setPassword("")}>
                {password !== "" ? <ClearIcon /> : "" }
              </IconButton>
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          )
        }}>
        Password
      </TextField>
    </Fragment>
  )
}