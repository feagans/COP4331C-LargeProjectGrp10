import React from "react";
import "./Friends.css";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
const useStyles = makeStyles({
  root: {
    minWidth: 150,
    margin: "0 20px",
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
                Johns dream is to see Japan
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
    </div>
  );
}

export default Friends;
