import React from "react";
import Typography from '@material-ui/core/Typography';
import Container from "@material-ui/core/Container";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    marginTop: "auto",
    backgroundColor: "lightgray",
  },
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Typography variant="body1">Ryan's React Project</Typography>
      </Container>
    </footer>
  )
}