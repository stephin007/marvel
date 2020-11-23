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
            image: "http://i.annihil.us/u/prod/marvel/i/mg/9/50/4ce18691cbf04/landscape_xlarge.jpg",
            title: "Abomination (Ultimate)",
            description: ""
        },
        {
            id: 1016826,
            image: "http://i.annihil.us/u/prod/marvel/i/mg/9/50/4ce18691cbf04/landscape_xlarge.jpg",
            title: "Abomination (Ultimate)",
            description: "Formerly known as Emil Blonsky, a spy of Soviet Yugoslavian origin working for the KGB, the Abomination gained his powers after receiving a dose of gamma radiation similar to that which transformed Bruce Banner into the incredible Hulk."
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
        <div className="container card-section" >
            { cards }
        </div>
    )
}

export default CardSection
