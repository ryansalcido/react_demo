import React, { Fragment, useState, useLayoutEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import TodoService from "../Services/TodoService";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import TodoEditDialog from "./TodoEditDialog";

const useStyles = makeStyles((theme) => ({
	root: {
		marginLeft: theme.spacing(2)
	},
	createTodo: {
		padding: "2px 4px",
		display: "flex",
		alignItems: "center"
	},
	todoList: {
		marginTop: theme.spacing(3),
		padding: "2px 4px",
		maxHeight: 250,
		overflowY: "auto"
	},
	input: {
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	divider: {
		height: 28,
		margin: 4
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#FFF"
	},
	noTodosText: {
		paddingTop: theme.spacing(3)
	}
}));

const Todo = () => {
	const classes = useStyles();

	const [ isLoading, setIsLoading ] = useState(false);
	const [ todo, setTodo ] = useState("");
	const [ todoList, setTodoList ] = useState([]);
	const [ selectedTodo, setSelectedTodo ] = useState({});
	const [ openEditDialog, setOpenEditDialog ] = useState(false);

	useLayoutEffect(() => {
		setIsLoading(true);
		updateTodoList();
	}, []);

	const updateTodoList = () => {
		TodoService.getTodos().then(data => {
			const { isAuthenticated, todos } = data;
			if(isAuthenticated && todos) {
				setTodoList(todos);
				setIsLoading(false);
			}
		});
	};

	const createTodo = () => {
		setIsLoading(true);
		TodoService.createTodo({name: todo}).then(data => {
			const { isAuthenticated, message } = data;
			if(isAuthenticated && message.msgError === false) {
				setTodo("");
				updateTodoList();
			} else {
				setIsLoading(false);
			}
		});
	};

	const deleteTodo = (myTodo) => {
		setIsLoading(true);
		const { _id } = myTodo;
		TodoService.deleteTodo({_id}).then(data => {
			const { isAuthenticated, message } = data;
			if(isAuthenticated && message.msgError === false) {
				updateTodoList();
			} else {
				setIsLoading(false);
			}
		});
	};

	return (
		<div className={classes.root}>
			<Backdrop className={classes.backdrop} open={isLoading}>
				<CircularProgress color="inherit" />
			</Backdrop>

			<TodoEditDialog todo={selectedTodo} updateTodoList={updateTodoList} setIsLoading={setIsLoading}
				openEditDialog={openEditDialog} setOpenEditDialog={setOpenEditDialog} />

			<Paper className={classes.createTodo}>
				<InputBase value={todo} className={classes.input} placeholder="Create todo"
					onChange={(event) => setTodo(event.target.value)} />
				<Divider className={classes.divider} orientation="vertical" />
				<IconButton disabled={todo === ""} color="primary" className={classes.iconButton} onClick={() => createTodo()}>
					<AddCircleOutlineOutlinedIcon />
				</IconButton>
    	</Paper>
			
			{todoList.length === 0 
				? <Typography className={classes.noTodosText}>No todos. You may create a new Todo above.</Typography>
				: (
					<Paper className={classes.todoList}>
						<List disablePadding>
							{todoList.map((myTodo, idx) => {
								return (
									<Fragment key={`${myTodo.name}-${idx}`}>
										<ListItem>
											<ListItemText primary={myTodo.name} />
											<ListItemSecondaryAction>
												<IconButton edge="end" onClick={() => {setSelectedTodo(myTodo); setOpenEditDialog(true);}} >
													<EditIcon />
												</IconButton>
												<IconButton edge="end" onClick={() => deleteTodo(myTodo)}>
													<DeleteIcon />
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
										{(todoList.length > idx + 1) && <Divider />}
									</Fragment>
								);
							})}
						</List>
					</Paper>
				)
			}
		</div>
	);
};

export default Todo;