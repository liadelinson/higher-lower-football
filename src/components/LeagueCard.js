import React from "react"
import GreenTick from "../images/green-tick.png"

export default function LeagueCard(props) {    

    return (
        <div className="leagueCard" onClick={props.selectALeague} id={props.id}>
            {(props.selectedLeague === props.id) &&
             <img src={GreenTick} alt="" className="leagueCard--tick"/>}
            <img src={props.logos.light} alt="" className="leagueCard--image"/>

        </div>
    )

}