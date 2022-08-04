import React from "react"

export default function ClubCard(props) {

    let positionTxt
    if(props.isFirst) {
        positionTxt = `Position: ${props.club.position}`
        switch(props.club.position) {
            case 1:
                positionTxt = positionTxt.concat("st")
                break
            case 2:
                positionTxt = positionTxt.concat("nd")
                break
            case 3:
                positionTxt = positionTxt.concat("rd")
                break
            default:
                positionTxt = positionTxt.concat("th")
        }
    }



    console.log(props)

    return (
        <div className="card">
            <img src={props.club.team.logos[0].href} alt="" className="card--image"/>
            <h3 className="card--name">{props.club.team.name}</h3>
            <h3 className="card--season">{props.club.seasonDisplay}</h3>

            {props.isFirst && <h3 className="card--position">{positionTxt}</h3>}


        </div>
    )
}