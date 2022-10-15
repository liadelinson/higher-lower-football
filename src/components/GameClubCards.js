import React from "react"
import ClubCard from "./ClubCard"

export default function GameClubCards(props) {

    return (
        <div className="gameClubCards">
            <ClubCard club={props.firstClub} isFirst={true} handleChange={props.handleChange}/>
            <ClubCard club={props.secondClub} isFirst={false} handleChange={props.handleChange}/>
        </div>
    )
}