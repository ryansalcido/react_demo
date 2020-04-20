// import React, { Fragment, useState, useEffect } from "react";
// import TextField from "@material-ui/core/TextField";
// import VisibilityIcon from "@material-ui/icons/Visibility";
// import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
// import InputAdornment from '@material-ui/core/InputAdornment';
// import IconButton from '@material-ui/core/IconButton';
// import ClearIcon from "@material-ui/icons/Clear";
// import useDebounce from "Components/useDebounce";

// export default function Password(props) {
//   const [ password, setPassword ] = useState("");
//   const [ showPassword, setShowPassword ] = useState(false);
//   const { sendPassword, pw } = props;

//   const debouncedPassword = useDebounce(password, 500);
//   const [ passwordError, setPasswordError ] = useState({error: false, msg: ""});

//   useEffect(() => {
//     if(debouncedPassword) {
//       if(debouncedPassword.length < 8) {
//         setPasswordError({error: true, msg: "Password must be at least 8 characters"});
//       } else {
//         setPasswordError({error: false, msg: ""});
//       }
//     }
//   }, [debouncedPassword]);

//   useEffect(() => {
//     sendPassword(password);
//   }, [ password, sendPassword ]);

//   useEffect(() => {
//     setPassword(pw);
//   }, [ pw ]);

//   return (
//     <Fragment>
//       <TextField color="secondary" className="textBoxField" value={password} label="Password" variant="outlined"
//         name="password" type={showPassword ? "text" : "password"} required={props.required}
//         onChange={(event) => setPassword(event.target.value)} 
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconButton
//                 aria-label="toggle password visibility"
//                 onClick={() => setShowPassword(!showPassword)}>
//                   {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
//               </IconButton>
//             </InputAdornment>
//           )
//         }}>
//         Password
//       </TextField>
//     </Fragment>
//   )
// }