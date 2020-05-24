import React, { Fragment, useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { AuthContext } from "../../Context/AuthContext";
import Todo from "./Todo";
import axios from "axios";
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

const TodoView = () => {
	const classes = useStyles();

	const { manageUserSession } = useContext(AuthContext);

	const [ isLoading, setIsLoading ] = useState(false);
	const [ todo, setTodo ] = useState("");
	const [ todoList, setTodoList ] = useState([]);

	useEffect(() => {
		setIsLoading(true);
		let source = axios.CancelToken.source();
		axios.get("/user/todos", 
			{cancelToken: source.token, headers: {"pragma": "no-cache", "cache-control": "no-cache"}}
		).then(res => {
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

		return () => source.cancel();
	}, [manageUserSession]);

	const createTodo = (e) => {
		e.preventDefault();
		setIsLoading(true);
		axios.post("/user/todo", {name: todo}).then(res => {
			const { isAuthenticated, todos } = res.data;
			if(isAuthenticated && todos) {
				setTodo("");
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
		<div className={classes.root}>
			<Backdrop className={classes.backdrop} open={isLoading}>
				<CircularProgress color="inherit" />
			</Backdrop>

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
												<Todo todo={myTodo} setTodoList={setTodoList} setIsLoading={setIsLoading} />
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

export default TodoView;