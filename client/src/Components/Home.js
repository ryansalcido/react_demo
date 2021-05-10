import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import NASA from "./NASA";
import axiosInstance from "../utils/axiosInstance";

const useStyles = makeStyles((theme) => ({
	homeRoot: {
		padding: `0 ${theme.spacing(2)}px`
	}
}));

const Home = () => {
	const classes = useStyles();
	const [ nasaResult, setNasaResult ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		let source = axiosInstance.CancelToken.source();
		axiosInstance.get("nasa/apod", {cancelToken: source.token}).then(res => {
			const { nasa } = res.data;
			setNasaResult(nasa);
			setIsLoading(false);
		}).catch(error => {
			if(!axiosInstance.isCancel(error)) {
				setNasaResult(null);
			  setIsLoading(false);
			}
		});

		return () => source.cancel();
	}, []);

	return (
		<div className={classes.homeRoot}>
			{isLoading 
				? <LinearProgress color="secondary" />
				: (
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography color="secondary" align="center" variant="h4">{"Ryan's React Project"}</Typography>
						</Grid>
						{nasaResult && <NASA nasaResult={nasaResult} />}
					</Grid>
				)
			}
		</div>
	);
};

export default Home;