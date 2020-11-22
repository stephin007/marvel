import React, {useState} from 'react'

import CardItem from "./CardItem"
const CardSection = () => {
    const [profiles] = useState([
        {
            id: 1009146,
            image: "http://i.annihil.us/u/prod/marvel/i/mg/9/50/4ce18691cbf04/landscape_xlarge.jpg",
            title: "Abomination (Emil Blonsky)",
            description: "Formerly known as Emil Blonsky, a spy of Soviet Yugoslavian origin working for the KGB, the Abomination gained his powers after receiving a dose of gamma radiation similar to that which transformed Bruce Banner into the incredible Hulk."
        },
        {
            id: 1016823,
            image: "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/landscape_xlarge.jpg",
            title: "Abomination (Ultimate)",
            description: ""
        }
    ])

    const cards = (
        profiles.map(profile => {
            return ( 
            <CardItem image={profile.image} title={profile.title} description={profile.description} key={profile.id} />
            )
        })
    )

    return (
        <div className="container">
            { cards }
        </div>
    )
}

export default CardSection
