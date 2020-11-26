import React, {Fragment} from 'react'

import CardItem from "./CardItem"
import Spinner from "../assets/spinner.gif"

const CardSection = ({heroes, loading}) => {

    return (
    <Fragment>
        {
            loading === false 
            ? (
                <div className="container card-section" >
                    { heroes.map(hero => (
                        <CardItem image={hero.thumbnail.path + "/landscape_xlarge.jpg"} title={hero.name} description={hero.description} key={hero.id} />
                    )) }
                </div>
            ) : (
                <img src={Spinner} alt="Loading..." style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "200", height: "200"}} />
            )
        }   
    </Fragment>
    )
}

export default CardSection
