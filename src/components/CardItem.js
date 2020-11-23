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

const CardItem = (props) => {
    const classes = useStyles();

    // const margin = props.description === "" ? 35 : 0

    return (
        <Fragment>
            <Card className={[classes.root, "card"]} >
                <CardActionArea>
                    <CardMedia
                    className={classes.media}
                    image={props.image}
                    title={props.title}
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.description}
                    </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {
                        props.description !== "" 
                        ?
                            <Grid container justify="flex-end">
                                <Button variant="contained" color="primary" justifyContent="flex-end">
                                    More
                                </Button>
                            </Grid>
                        : 
                        <p style={{color: "gray", margin: "auto"}}>No Description Found</p>
                    }
                    
                </CardActions>
            </Card>
        </Fragment>
    )
}

export default CardItem
