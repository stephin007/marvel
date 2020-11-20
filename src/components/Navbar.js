import React from 'react'

import banner from "../assets/banner.jpg"

const Navbar = () => {
    return (
        <div className="banner">
            {/* Banner Credits: <a href="http://www.freepik.com">Designed by Harryarts / Freepik</a> */}
            <img src={banner} alt="NavBanner"/>
            <h1><span>Marvel</span> Heroes</h1>
        </div>
    )
}

export default Navbar
