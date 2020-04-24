import React, { Fragment } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	messageAlert: {
		width: 600
	}
}));

const Message = (props) => {
	const classes = useStyles();
	return (
		<Fragment>
			{props.message.msgBody !== "" &&
				<Alert className={classes.messageAlert} severity={props.message.msgError === true ? "error" : "success"}
					action={<ClearIcon onClick={() => props.setMessage({msgBody: "", msgError: false})} />}>
					{props.message.msgBody}
				</Alert>}
		</Fragment>
	);
};

Message.propTypes = {
	message: PropTypes.object.isRequired,
	setMessage: PropTypes.func.isRequired
};

export default Message;