import React from 'react'

import banner from "../assets/banner.jpg"

const Navbar = () => {
    return (
        <div className="banner">
            {/* Banner Credits: <a href="http://www.freepik.com">Designed by Harryarts / Freepik</a> */}
            <img src={banner} alt="NavBanner"/>
            <h1><span>MARVEL</span> HEROES</h1>
            <a href="https://github.com/stephin007/contactkeeper" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
        </div>
    )
}

export default Navbar
