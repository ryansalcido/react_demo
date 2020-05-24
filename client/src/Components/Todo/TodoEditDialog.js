import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
	cancelButton: {
		backgroundColor: theme.palette.error.dark,
		"&:hover": {
			backgroundColor: theme.palette.error.dark
		}
	},
	textFieldRoot: {
		width: "100%"
	}
}));

const TodoEditDialog = (props) => {
	const classes = useStyles();
	const { todo, setIsLoading, setTodoList, openEditDialog, setOpenEditDialog } = props;
	
	const { manageUserSession } = useContext(AuthContext);
	const [ newTodoName, setNewTodoName ] = useState("");

	const updateTodo = () => {
		setOpenEditDialog(false); 
		setIsLoading(true);
		axios.post("/user/updateTodo", {_id: todo._id, name: newTodoName}).then(res => {
			const { isAuthenticated, todos } = res.data;
			if(isAuthenticated && todos) {
				setNewTodoName("");
				setTodoList(todos);
			}
			setIsLoading(false);
		}).catch(error => {
			if(error.response && error.response.status === 401) {
				manageUserSession({name: "", email: ""}, false);
				toast.info("Session has timed out");
			}
		});
	};

	return (
		<Dialog open={openEditDialog} onClose={() => setOpenEditDialog(!openEditDialog)}>
			<DialogTitle>Rename Todo</DialogTitle>
			<DialogContent>
				<TextField className={classes.textFieldRoot} autoFocus margin="dense" label="Name" 
					value={newTodoName} onChange={(event) => setNewTodoName(event.target.value)} />
			</DialogContent>
			<DialogActions>
				<Button className={classes.cancelButton} onClick={() => setOpenEditDialog(!openEditDialog)} variant="contained">
					cancel
				</Button>
				<Button disabled={newTodoName === ""} onClick={() => updateTodo()} color="primary" variant="contained">
					rename
				</Button>
			</DialogActions>
		</Dialog>
	);
};

TodoEditDialog.propTypes = {
	todo: PropTypes.object.isRequired,
	setTodoList: PropTypes.func.isRequired,
	setIsLoading: PropTypes.func.isRequired,
	openEditDialog: PropTypes.bool.isRequired,
	setOpenEditDialog: PropTypes.func.isRequired
};

export default TodoEditDialog;