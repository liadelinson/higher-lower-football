import React from "react"

export default function GameMenu(props) {

    return (
        <div className="gameMenu">
            <h1 className="gameMenu--title">Main Menu</h1>
            <h2 className="gameMenu--subTitle">Select a league</h2>
            <div className="gameMenu--leagueCards">

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