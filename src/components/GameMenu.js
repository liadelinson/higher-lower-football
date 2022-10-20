import React from "react"
import LeagueCard from "./LeagueCard"

export default function GameMenu(props) {    

    const leagueCardElements = props.allLeagues.map(item => {
        return <LeagueCard
                    key = {item.id}
                    selectedLeague = {props.selectedLeague}
                    selectALeague = {props.selectALeague}        
                    {...item}
                            
                />
    })

    return (
        <div className="gameMenu">
            <h1 className="gameMenu--title">Main Menu</h1>
            <h2 className="gameMenu--subTitle">Select a league</h2>
            <div className="gameMenu--leagueCards">
                {leagueCardElements}
            </div>

            {
                (props.allStandingsPerLeague && Object.keys(props.allStandingsPerLeague).length > 0) &&
                <div
                    className="game--mainButton"                
                    onClick={props.handleStartGame}
                >
                    START
                </div>
            }

            
        </div>
    )
}