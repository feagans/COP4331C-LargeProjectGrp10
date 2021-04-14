import React from "react";
import "./Popup.js";
import "./Friends.css";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { useState } from "react";
import Popup from "./Popup.js";
const useStyles = makeStyles({
  root: {
    minWidth: 150,
    margin: "0 20px",
    backgroundColor: "#1E5F74",
    color: "#FFFF",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function Friends() {
  const [buttonPopup, setButtonPopup] = useState(false);
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  return (
    <div>
      <input
        type="text"
        class="form-control searchBar"
        placeholder="Search Friends..."
      ></input>
      <Grid container spacing={1}>
        <Grid Item spacing={3}>
          <Card className={classes.root}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Added Friend
              </Typography>
              <Typography variant="h5" component="h2">
                John Doe
              </Typography>
              <Typography variant="body2" component="p">
                John's dream is to see Japan
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid Item spacing={3}>
          <Card className={classes.root}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Added Friend
              </Typography>
              <Typography variant="h5" component="h2">
                Timmy Turner
              </Typography>
              <Typography variant="body2" component="p">
                Timmy wants to visit the zoo
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid Item spacing={3}>
          <Card className={classes.root}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Added Friend
              </Typography>
              <Typography variant="h5" component="h2">
                Jim Jones
              </Typography>
              <Typography variant="body2" component="p">
                Jim wants to visit the store
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <button className="button" onClick={() => setButtonPopup(true)}>
        Add new Friend
      </button>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <h3></h3>
      </Popup>
    </div>
  );
}

export default Friends;
