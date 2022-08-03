import React from "react";
import PhilJones from "../images/phil-jones.jpg"

export default function Header() {
    return (
        <header className="header">
            <img src={PhilJones} className="header--image" alt="jones"/>            
            <h2 className="header--title">Higher Lower - Football</h2>
            <h3 className="header--description">Have Fun</h3>
        </header>
    )   
}