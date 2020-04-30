import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import TodoService from "../Services/TodoService";
import PropTypes from "prop-types";

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
	const { todo, updateTodoList, setIsLoading, openEditDialog, setOpenEditDialog } = props;
	
	const [ newTodoName, setNewTodoName ] = useState("");

	const updateTodo = () => {
		setOpenEditDialog(false); 
		setIsLoading(true);
		TodoService.updateTodo({_id: todo._id, name: newTodoName}).then(data => {
			const { isAuthenticated, message } = data;
			if(isAuthenticated && message.msgError === false) {
				setNewTodoName("");
				updateTodoList();
			} else {
				setIsLoading(false);
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
	updateTodoList: PropTypes.func.isRequired,
	setIsLoading: PropTypes.func.isRequired,
	openEditDialog: PropTypes.bool.isRequired,
	setOpenEditDialog: PropTypes.func.isRequired
};

export default TodoEditDialog;