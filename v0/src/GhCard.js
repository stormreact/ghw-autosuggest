// This was a SimpleMediaCard
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Card, { CardContent, CardMedia } from "material-ui/Card";
import Typography from "material-ui/Typography";

const styles = {
  card: {
    maxWidth: 175
  },
  media: {
    height: 90
  },
  cardContent: {
    height: 150
  },
  location: {
    height: 20
  }
};

function GhCard(props) {
  const { classes, tile } = props;
  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={tile.avatar}
          title={tile.login}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="title" component="p">
            <a href={"https://github.com/" + tile.login}>{tile.login}</a>
          </Typography>
          <Typography component="p">{tile.name}</Typography>
          <Typography component="p" className={classes.location} gutterBottom>
            <b>{tile.location}</b>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

GhCard.propTypes = {
  classes: PropTypes.object.isRequired,
  tile: PropTypes.object.isRequired
};

export default withStyles(styles)(GhCard);
