import React, { Fragment } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import Alert from "@material-ui/lab/Alert";
import PropTypes from "prop-types";

const Message = (props) => {
	return (
		<Fragment>
			{props.message.msgBody !== "" &&
				<Alert style={{width: props.width}} severity={props.message.msgError === true ? "error" : "success"}
					action={<ClearIcon onClick={() => props.setMessage({msgBody: "", msgError: false})} />}>
					{props.message.msgBody}
				</Alert>}
		</Fragment>
	);
};

Message.propTypes = {
	message: PropTypes.object.isRequired,
	setMessage: PropTypes.func.isRequired,
	width: PropTypes.string.isRequired
};

export default Message;