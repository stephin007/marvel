import React from 'react'

import CardItem from "./CardItem"
const CardSection = ({heroes}) => {
    console.log(heroes)

    return (
        <div className="container card-section" >
            { heroes.map(hero => (
                <CardItem image={hero.thumbnail.path + "/landscape_xlarge.jpg"} title={hero.name} description={hero.description} key={hero.id} />
            )) }
        </div>
    )
}

export default CardSection
