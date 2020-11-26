import React, {Fragment} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        width: "100%",
      boxShadow: "0 0 11px rgba(33,33,33,.6)"
    },
    media: {
      height: 140,
    },
});

const handleImageError = (e) => {
    e.target.onerror = null
    // e.target.style.display = 'none'
    e.target.src = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/landscape_xlarge.jpg"
}

const CardItem = (props) => {
    const classes = useStyles();
    return (
        <Fragment>
            <Card className={[classes.root, "card"]} >
                <CardActionArea>
                    <CardMedia
                    className={classes.media}
                    component="img"
                    image={props.image}
                    title={props.title}
                    onError={handleImageError}
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {
                            props.description !== ""
                            ?
                                props.description
                            :
                            <p style={{color: "gray", margin: "50px 80px", textAlign: "center"}}>No Description Provided By Marvel</p>
                        }
                    </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Grid container justify="flex-end">
                        <Button variant="contained" color="primary" justifyContent="flex-end" >
                            More
                        </Button>
                    </Grid>
                </CardActions>
            </Card>
        </Fragment>
    )
}

export default CardItem
