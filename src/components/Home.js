import React, {Fragment, useState, useEffect} from 'react'

import Search from "./Search"
import CardSection from "./cardSection"

import {getCharacters} from "../api/Api"

const Home = () => {
    const [characters, setCharacters] = useState([])

    useEffect(()=>{
        getCharacters()
        .then((output)=>{
            setCharacters(output.data.results)
            console.log(output.data.results)
        })

    },[])

    return (
        <Fragment>
            <Search characters={characters}/>
            <CardSection />
        </Fragment>
    )
}

export default Home
