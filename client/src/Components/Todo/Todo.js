import React, { Fragment, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import { AuthContext } from "../../Context/AuthContext";
import TodoEditDialog from "./TodoEditDialog";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
	todoItem: {
		minHeight: 50
	}
}));

const Todo = (props) => {
	const { todo, setTodoList, setIsLoading } = props;
	const classes = useStyles();

	const { manageUserSession } = useContext(AuthContext);
	const [ selectedTodo, setSelectedTodo ] = useState({});
	const [ openEditDialog, setOpenEditDialog ] = useState(false);

	const deleteTodo = (myTodo) => {
		setIsLoading(true);
		const { _id } = myTodo;
		axiosInstance.post("user/deleteTodo", {_id}).then(res => {
			const { isAuthenticated, todos } = res.data;
			if(isAuthenticated && todos) {
				setTodoList(todos);
			}
			setIsLoading(false);
		}).catch(error => {
			setIsLoading(false);
			if(error.response && error.response.status === 401) {
				manageUserSession({name: "", email: ""}, false);
				toast.info("Session has timed out");
			}
		});
	};

	return (
		<Fragment>
			<TodoEditDialog todo={selectedTodo} setIsLoading={setIsLoading} setTodoList={setTodoList}
				openEditDialog={openEditDialog} setOpenEditDialog={setOpenEditDialog} />

			<ListItem className={classes.todoItem}>
				<ListItemText primary={todo.name} />
				<ListItemSecondaryAction>
					<IconButton edge="end" onClick={() => {setSelectedTodo(todo); setOpenEditDialog(true);}} >
						<EditIcon />
					</IconButton>
					<IconButton edge="end" onClick={() => deleteTodo(todo)}>
						<DeleteIcon />
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
		</Fragment>
	);
};

Todo.propTypes = {
	todo: PropTypes.object.isRequired,
	setTodoList: PropTypes.func.isRequired,
	setIsLoading: PropTypes.func.isRequired
};

export default Todo;