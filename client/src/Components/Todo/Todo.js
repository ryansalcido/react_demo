import React, { Fragment, useState, useLayoutEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import TodoService from "../../Services/TodoService";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import TodoEditDialog from "./TodoEditDialog";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(1)
	},
	createTodo: {
		padding: "2px 4px",
		display: "flex",
		alignItems: "center"
	},
	divider: {
		height: 28,
		margin: 4
	},
	input: {
		flex: 1
	},
	todoList: {
		padding: "2px 4px",
		overflowY: "auto",
		maxHeight: 350
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#FFF"
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
			} else {
				setIsLoading(false);
			}
		});
	};

	const createTodo = (e) => {
		e.preventDefault();
		setIsLoading(true);
		TodoService.createTodo({name: todo}).then(data => {
			const { isAuthenticated, message } = data;
			if(isAuthenticated && message) {
				setTodo("");
				updateTodoList();
			} else {
				toast.error("Unable to create todo. Please try again.");
				setIsLoading(false);
			}
		});
	};

	const deleteTodo = (myTodo) => {
		setIsLoading(true);
		const { _id } = myTodo;
		TodoService.deleteTodo({_id}).then(data => {
			const { isAuthenticated, message } = data;
			if(isAuthenticated && message) {
				updateTodoList();
			} else {
				toast.error("Unable to delete todo. Please try again.");
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

			<Grid container spacing={1}>
				<Grid item xs={12} md={9} lg={7}>
					<form onSubmit={createTodo}>
						<Paper className={classes.createTodo}>
							<InputBase value={todo} autoFocus className={classes.input} placeholder="Create todo"
								onChange={(event) => setTodo(event.target.value)} />
							<Divider className={classes.divider} orientation="vertical" />
							<IconButton disabled={todo === ""} size="small" color="primary" onClick={createTodo}>
								<AddCircleOutlineOutlinedIcon />
							</IconButton>
						</Paper>
					</form>
				</Grid>
				<Grid item xs={12}>
					{todoList.length === 0 
						? <Typography>No todos. You may create a new Todo above.</Typography>
						: (
							<Paper className={classes.todoList}>
								<List disablePadding>
									{todoList.map((myTodo, idx) => {
										return (
											<Fragment key={`${myTodo.name}-${idx}`}>
												<ListItem  style={{minHeight: 50}}>
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
						)}
				</Grid>
			</Grid>
		</div>
	);
};

export default Todo;