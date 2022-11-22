import React from "react"
import ImageNotAvailable from "../images/image-not-available.png"

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

    let imageSource 
    try
    {
        imageSource = props.club.team.logos[0].href                 
    }
    catch (errors)
    {
        imageSource = ImageNotAvailable
    }   

    return (
        <div className="card">
            <img 
                src={imageSource}
                alt=""
                className="card--image"
                onError={event => {
                    event.target.src = ImageNotAvailable
                    event.onerror = null
                }}/>
                

            <div className="card--data">
                <p className="card--name">{props.club.team.name}</p>
                <p className="card--season">{props.club.seasonDisplay}</p>                
            </div>

            {
                props.isFirst ?
                <h2 className="card--position">{positionTxt}</h2> :
                <div className="card--buttons">
                    <div
                        className="buttons--lower"
                        id="btnLower"
                        onClick={props.handleChange}                        
                    >
                        Lower
                    </div>
                    <div
                        className="buttons--higher"
                        id="btnHigher"
                        onClick={props.handleChange}                        
                    >                            
                        Higher
                    </div>                    
                </div>
            }
        </div>
    )
}